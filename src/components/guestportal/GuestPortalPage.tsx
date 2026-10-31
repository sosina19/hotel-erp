import React, { useState } from 'react';
import {
  LayoutDashboard, BedDouble, Calendar, Clock, DollarSign, Utensils,
  Sparkles, Wrench, Coffee, LogOut, Globe, Bell, ChevronRight,
  ChevronLeft, ShieldCheck, Award, ArrowLeft, ArrowUpRight, CheckCircle2,
  Receipt, MessageSquare, Star, UserCog, KeyRound, Lock, PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { propertyConfigs } from '../../data/mockData';
import type {
  GuestPortalTab,
  GuestStayInfo,
  GuestProfileData,
  PastStayRecord
} from './types';
import { GuestDashboardTab } from './tabs/GuestDashboardTab';
import { GuestProfileTab } from './tabs/GuestProfileTab';
import { CurrentStayTab } from './tabs/CurrentStayTab';
import { StayHistoryTab } from './tabs/StayHistoryTab';
import { DiningMenuTab } from './tabs/DiningMenuTab';
import { HotelServicesTab } from './tabs/HotelServicesTab';
import { HousekeepingTab } from './tabs/HousekeepingTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';
import { BillingTab } from './tabs/BillingTab';
import { CommunicationsTab } from './tabs/CommunicationsTab';
import { ReviewsTab } from './tabs/ReviewsTab';

interface GuestPortalPageProps {
  onExitToPublicSite: () => void;
}

export const GuestPortalPage: React.FC<GuestPortalPageProps> = ({ onExitToPublicSite }) => {
  const { setGuestLoggedIn, setGuestEmail, addToast, propertyMode } = useApp();
  const config = propertyConfigs[propertyMode];

  const [activeTab, setActiveTab] = useState<GuestPortalTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Digital Mobile RFID Key state
  const [keyUnlocked, setKeyUnlocked] = useState(false);
  const [isUnlockingKey, setIsUnlockingKey] = useState(false);

  // Core authenticated resident stay information
  const [stay, setStay] = useState<GuestStayInfo>({
    name: 'Lord James Worthington',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    guestId: 'G001',
    room: '101',
    roomType: 'Deluxe King Suite',
    floor: 1,
    checkIn: '2026-10-29',
    checkOut: '2026-11-02',
    nights: 4,
    nightsRemaining: 2,
    bookingRef: 'LXP-2026-001',
    tier: 'Platinum',
    balance: 852.80,
    wifiNetwork: 'LuxeStay-HighSpeed-VIP',
    wifiPassword: 'LuxeGuest2026',
    server: 'Sarah Mitchell (Duty Agent)',
    adults: 2,
    children: 0,
    roomImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    ],
    roomAmenities: [
      'King Bed with Cashmere Topper',
      'Italian Marble En-Suite Bathroom',
      'Private Ocean-Facing Balcony',
      'Nespresso Vertuo Espresso Bar',
      'Complimentary High-Speed Wi-Fi 6',
      '65" 4K OLED Smart Television',
      'Bespoke Molton Brown Toiletries',
      'In-Room Electronic Laptop Safe',
      'Individual Climate Control',
    ],
    includedServices: [
      'Gourmet Breakfast Buffet (07:00 – 10:30)',
      'Complimentary Valet Parking & EV Charging',
      'Access to Lotus Spa Hydrotherapy Thermal Suite',
      'Unlimited High-Speed Optical Wi-Fi',
      'Evening Turn-Down Service with Artisan Chocolates',
    ],
    specialRequests: 'High floor, quiet wing away from elevator, extra goose down pillows, late checkout preference.',
    status: 'Checked-In',
    paymentStatus: 'Deposit Paid · Incidentals Open',
    assignedProperty: config.name,
  });

  // Guest Profile Data
  const [profile, setProfile] = useState<GuestProfileData>({
    fullName: 'Lord James Worthington',
    guestId: 'G001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    phone: '+44 7700 900123',
    email: 'james.worthington@uk-holdings.co.uk',
    address: '24 Belgrave Square, Knightsbridge, London SW1X 8PX',
    nationality: 'British',
    dateOfBirth: '1979-04-12',
    emergencyContact: {
      name: 'Lady Victoria Worthington',
      relationship: 'Spouse',
      phone: '+44 7700 900124',
    },
    identification: {
      type: 'Passport',
      maskedNumber: '•••• •••• 9123',
      fullNumber: 'GBR-88392014',
      expiryDate: '2032-08-15',
      verified: true,
      verificationDate: '2026-10-29 14:10',
      verifyingAgent: 'Sarah Mitchell (Terminal FD-01)',
    },
    language: 'English (UK)',
    commPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
    },
    loyaltyPoints: 14850,
    tier: 'Platinum VIP',
  });

  const handleSignOut = () => {
    setGuestLoggedIn(false);
    setGuestEmail('');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out of your guest self-service portal.',
    });
  };

  const handleChargeFolio = (amount: number, description: string) => {
    setStay(prev => ({ ...prev, balance: prev.balance + amount }));
    addToast({
      type: 'info',
      title: 'Folio Updated',
      message: `$${amount.toFixed(2)} charged to Room #${stay.room} (${description}).`,
    });
  };

  const handlePaymentSuccess = (amount: number, txnRef: string, method: string) => {
    setStay(prev => {
      const newBal = Math.max(0, prev.balance - amount);
      return {
        ...prev,
        balance: newBal,
        paymentStatus: newBal === 0 ? 'Paid in Full' : 'Deposit Paid · Incidentals Open',
      };
    });
    addToast({
      type: 'success',
      title: 'Payment Confirmed',
      message: `$${amount.toFixed(2)} authorized via ${method} (Ref: ${txnRef}). Folio balance reduced.`,
    });
  };

  const handleUnlockMobileKey = () => {
    setIsUnlockingKey(true);
    setTimeout(() => {
      setIsUnlockingKey(false);
      setKeyUnlocked(true);
      addToast({
        type: 'success',
        title: 'Digital Key Signal Transmitted',
        message: `Electronic lock for Room #${stay.room} unlocked via encrypted Bluetooth RFID. Welcome!`,
      });
      setTimeout(() => setKeyUnlocked(false), 4500);
    }, 1000);
  };

  // Nav Groups matching Admin PMS structure
  const navSections: {
    title: string;
    items: { id: GuestPortalTab; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: 'Main Experience',
      items: [
        { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'stay', label: 'My Stay & Digital Key', icon: <BedDouble className="w-4 h-4" />, badge: `Room ${stay.room}` },
        { id: 'billing', label: 'My Bill & Payments', icon: <Receipt className="w-4 h-4" />, badge: `$${stay.balance.toFixed(0)}` },
        { id: 'communications', label: 'Requests & Concierge', icon: <MessageSquare className="w-4 h-4" />, badge: '3' },
      ],
    },
    {
      title: 'In-House Services',
      items: [
        { id: 'dining', label: 'Restaurant & Dining', icon: <Utensils className="w-4 h-4" /> },
        { id: 'services', label: 'Hotel Services Directory', icon: <Coffee className="w-4 h-4" /> },
        { id: 'housekeeping', label: 'Housekeeping', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'maintenance', label: 'Maintenance Requests', icon: <Wrench className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Feedback & Account',
      items: [
        { id: 'reviews', label: 'Stay Reviews & Quality', icon: <Star className="w-4 h-4" />, badge: '4.9' },
        { id: 'history', label: 'Past Stay History', icon: <Clock className="w-4 h-4" />, badge: '3' },
        { id: 'profile', label: 'Resident Profile & Settings', icon: <UserCog className="w-4 h-4" /> },
      ],
    },
  ];

  const currentTabLabel =
    navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Resident Portal';

  const gradientClass = propertyMode === 'hotel'
    ? 'luxury-gradient'
    : propertyMode === 'guesthouse'
    ? 'guesthouse-gradient'
    : 'restaurant-gradient';

  return (
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* ADMIN-STYLE SLEEK COLLAPSIBLE RESIDENT SIDEBAR */}
      {/* ──────────────────────────────────────────────────────────── */}
      <aside
        className={`${gradientClass} flex flex-col transition-all duration-300 h-full relative z-30 shadow-luxury flex-shrink-0 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Collapse Toggle Pill */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors z-40"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Brand Header */}
        <div className={`px-4 py-4 border-b border-white/10 flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-xs">
            {config.logo}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm font-serif leading-tight truncate">{config.name}</p>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                Resident Portal
              </span>
            </div>
          )}
        </div>

        {/* Resident Summary Badge */}
        {!sidebarCollapsed ? (
          <div className="p-3 mx-2 my-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-3">
            <img
              src={stay.avatar}
              alt={stay.name}
              className="w-9 h-9 rounded-full object-cover border border-amber-400/80 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate leading-tight">{stay.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                  Room #{stay.room}
                </span>
                <span className="text-[10px] text-white/70">{stay.tier}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2.5 border-b border-white/10">
            <img
              src={stay.avatar}
              alt={stay.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-400/80"
              title={`${stay.name} · Room #${stay.room}`}
            />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2 space-y-4">
          {navSections.map(section => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <p className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-white/20 text-white shadow-sm font-bold border border-white/20'
                          : 'text-white/75 hover:text-white hover:bg-white/10'
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                                item.id === 'billing' && stay.balance > 0
                                  ? 'bg-amber-400 text-gray-900 animate-pulse'
                                  : 'bg-white/20 text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Digital RFID Door Key Simulation Card */}
        <div className={`p-2.5 border-t border-white/10 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {!sidebarCollapsed ? (
            <div className="bg-white/10 rounded-xl p-2.5 text-white border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" />
                  <span>Mobile Key</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 rounded font-bold">
                  {keyUnlocked ? 'Unlocked' : 'Secured'}
                </span>
              </div>
              <p className="text-[11px] text-white/80">Room #{stay.room} RFID Lock</p>
              <button
                type="button"
                onClick={handleUnlockMobileKey}
                disabled={isUnlockingKey}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  keyUnlocked
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                }`}
              >
                {isUnlockingKey ? (
                  <span>Transmitting...</span>
                ) : keyUnlocked ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Door Unlatched</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Tap to Unlock</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUnlockMobileKey}
              title="Unlock Room #101"
              className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN RIGHT CONTAINER: TOPBAR & SCROLLABLE CONTENT */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Authenticated Header Bar */}
        <header className="flex-shrink-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 h-14 flex items-center justify-between gap-4 shadow-xs">
          {/* Section Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-400 hidden sm:inline">Resident Portal</span>
            <span className="text-xs text-gray-300 hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
              {currentTabLabel}
            </h1>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Outstanding Balance Pill (Clickable -> Jumps to Billing) */}
            <button
              type="button"
              onClick={() => setActiveTab('billing')}
              title="View folio breakdown and settle balance"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                stay.balance > 0
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Balance: ${stay.balance.toFixed(2)}</span>
            </button>

            {/* Room Indicator Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('stay')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
              <span>Room #{stay.room}</span>
            </button>

            {/* Return to Public Website (Without logging out) */}
            <button
              type="button"
              onClick={onExitToPublicSite}
              title="Return to public hotel website without logging out"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Guest Website</span>
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out of resident portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-7">
          <div className="max-w-7xl mx-auto">
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <GuestDashboardTab
                stay={stay}
                onNavigateTab={tab => setActiveTab(tab)}
                onAddToast={addToast}
              />
            )}

            {/* TAB 2: MY CURRENT STAY */}
            {activeTab === 'stay' && (
              <CurrentStayTab
                stay={stay}
                onAddToast={addToast}
              />
            )}

            {/* TAB 3: DEDICATED MY BILL & PAYMENTS */}
            {activeTab === 'billing' && (
              <BillingTab
                stay={stay}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}

            {/* TAB 4: REQUESTS & CONCIERGE COMMUNICATIONS */}
            {activeTab === 'communications' && (
              <CommunicationsTab
                stay={stay}
              />
            )}

            {/* TAB 5: RESTAURANT & IN-ROOM DINING */}
            {activeTab === 'dining' && (
              <DiningMenuTab
                roomNumber={stay.room}
                onChargeFolio={handleChargeFolio}
                onAddToast={addToast}
              />
            )}

            {/* TAB 6: HOTEL SERVICES DIRECTORY */}
            {activeTab === 'services' && (
              <HotelServicesTab
                onNavigateTab={tab => setActiveTab(tab)}
                onAddToast={addToast}
              />
            )}

            {/* TAB 7: HOUSEKEEPING COORDINATION */}
            {activeTab === 'housekeeping' && (
              <HousekeepingTab
                roomNumber={stay.room}
                onAddToast={addToast}
              />
            )}

            {/* TAB 8: MAINTENANCE & REPAIRS */}
            {activeTab === 'maintenance' && (
              <MaintenanceTab
                roomNumber={stay.room}
                onAddToast={addToast}
                onRequestRoomRelocation={() => {
                  addToast({
                    type: 'warning',
                    title: 'Relocation Flagged',
                    message: 'Priority suite relocation ticket opened for Room #' + stay.room + '. Front Office dispatched.',
                  });
                  setActiveTab('stay');
                }}
              />
            )}

            {/* TAB 9: STAY REVIEWS & QUALITY FEEDBACK */}
            {activeTab === 'reviews' && (
              <ReviewsTab
                stay={stay}
              />
            )}

            {/* TAB 10: STAY HISTORY & INVOICES */}
            {activeTab === 'history' && (
              <StayHistoryTab
                onAddToast={addToast}
                onRebookStay={pastStay => {
                  addToast({
                    type: 'info',
                    title: 'Rebooking Pre-Filled',
                    message: `Rebooking configuration loaded for ${pastStay.roomType}. Opening current stay coordinator.`,
                  });
                  setActiveTab('stay');
                }}
              />
            )}

            {/* TAB 11: RESIDENT PROFILE & SETTINGS */}
            {activeTab === 'profile' && (
              <GuestProfileTab
                profile={profile}
                onUpdateProfile={updates => setProfile(prev => ({ ...prev, ...updates }))}
                onAddToast={addToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};