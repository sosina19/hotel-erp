import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, BedDouble, Calendar, Clock, DollarSign, Utensils,
  Sparkles, Wrench, Coffee, LogOut, Globe, Bell, ChevronRight,
  ChevronLeft, ShieldCheck, Award, ArrowLeft, ArrowUpRight, CheckCircle2,
  Receipt, MessageSquare, Star, UserCog, KeyRound, Lock, PhoneCall,
  Menu, X
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
  const { setGuestLoggedIn, setGuestEmail, addToast, propertyMode, scannedRoom, scannedTarget, setCurrentView } = useApp();
  const config = propertyConfigs[propertyMode];

  const [activeTab, setActiveTab] = useState<GuestPortalTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Digital Mobile RFID Key state
  const [keyUnlocked, setKeyUnlocked] = useState(false);
  const [isUnlockingKey, setIsUnlockingKey] = useState(false);

  // Core authenticated resident stay information
  const [stay, setStay] = useState<GuestStayInfo>({
    name: 'Lord James Worthington',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    guestId: 'G001',
    room: scannedRoom || '101',
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
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* MOBILE SLIDE-OVER DRAWER (FULL NAVIGATION FOR SMARTPHONES)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className={`relative w-4/5 max-w-xs ${gradientClass} text-white flex flex-col h-full shadow-2xl p-4 z-50 animate-slide-right`}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-white shadow-xs">
                  {config.logo}
                </div>
                <div>
                  <p className="font-bold text-sm font-serif leading-tight">{config.name}</p>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    Guest Services
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resident Card */}
            <div className="p-3 my-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex items-center gap-3">
                <img
                  src={stay.avatar}
                  alt={stay.name}
                  className="w-10 h-10 rounded-full object-cover border border-blue-400/80"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate leading-tight">{stay.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 font-bold">
                      Room #{stay.room}
                    </span>
                    <span className="text-[10px] text-white/70">{stay.tier}</span>
                  </div>
                </div>
              </div>

              {/* Instant Mobile Key RFID Trigger */}
              <button
                type="button"
                onClick={handleUnlockMobileKey}
                disabled={isUnlockingKey}
                className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  keyUnlocked
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {isUnlockingKey ? (
                  <span>Transmitting Key Signal...</span>
                ) : keyUnlocked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Door Unlatched!</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Tap to Unlock Room #{stay.room}</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Modules */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin space-y-3 py-1">
              {navSections.map(section => (
                <div key={section.title}>
                  <p className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-white/20 text-white font-bold border border-white/20 shadow-xs'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-white/20 text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom Drawer Actions */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setCurrentView('admin');
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white/90 flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Staff PMS Admin View</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DESKTOP COLLAPSIBLE SIDEBAR (HIDDEN ON MOBILE SMARTPHONES)  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <aside
        className={`${gradientClass} hidden md:flex flex-col transition-all duration-300 h-full relative z-30 shadow-luxury flex-shrink-0 ${
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
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
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
              className="w-9 h-9 rounded-full object-cover border border-blue-400/80 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate leading-tight">{stay.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
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
              className="w-8 h-8 rounded-full object-cover border border-blue-400/80"
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
                                  ? 'bg-blue-400 text-gray-900 animate-pulse'
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
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
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
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
              className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN CONTAINER: MOBILE TOPBAR, DESKTOP TOPBAR & CONTENT     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE TOPBAR (Shown only on screens < md) */}
        <header className="md:hidden flex items-center justify-between px-3 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xs flex-shrink-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white font-serif truncate leading-tight">
                {config.name}
              </p>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block truncate">
                {currentTabLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Room Indicator Badge */}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 flex items-center gap-1 border border-blue-200 dark:border-blue-700">
              <BedDouble className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Room #{stay.room}</span>
            </span>

            {/* Folio Balance Shortcut */}
            <button
              type="button"
              onClick={() => setActiveTab('billing')}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 border border-gray-200 dark:border-gray-600"
              title="View room folio balance"
            >
              ${stay.balance.toFixed(0)}
            </button>
          </div>
        </header>

        {/* DESKTOP AUTHENTICATED HEADER BAR (Shown only on screens >= md) */}
        <header className="hidden md:flex flex-shrink-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 h-14 items-center justify-between gap-4 shadow-xs">
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
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
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

        {/* Scrollable Work Area (pb-24 on mobile so bottom nav doesn't cover content) */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-6 lg:p-7 pb-24 md:pb-6">
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

        {/* ──────────────────────────────────────────────────────────── */}
        {/* MOBILE STICKY BOTTOM NAVIGATION BAR (SMARTPHONE APP STYLE)   */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-3 py-1.5 flex items-center justify-around shadow-xl">
          {/* 1. Dining (Food Menu & In-Room Dining) */}
          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'dining'
                ? 'text-blue-600 dark:text-blue-400 scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <Utensils className="w-5 h-5 mb-0.5" />
            <span>Dining</span>
          </button>

          {/* 2. Hotel Services */}
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'services'
                ? 'text-blue-600 dark:text-blue-400 scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <Coffee className="w-5 h-5 mb-0.5" />
            <span>Services</span>
          </button>

          {/* 3. Center Elevated Digital RFID Key Unlock Button */}
          <button
            type="button"
            onClick={handleUnlockMobileKey}
            disabled={isUnlockingKey}
            className={`flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full shadow-lg text-white font-bold transition-all active:scale-95 ${
              keyUnlocked
                ? 'bg-emerald-500 ring-4 ring-emerald-200 dark:ring-emerald-900 animate-bounce'
                : isUnlockingKey
                ? 'bg-blue-400 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-100 dark:ring-blue-900/40'
            }`}
            title="Tap to unlock room door"
          >
            {keyUnlocked ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
          </button>

          {/* 4. My Bill & Folio */}
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'billing'
                ? 'text-blue-600 dark:text-blue-400 scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <Receipt className="w-5 h-5 mb-0.5" />
            <span>My Bill</span>
          </button>

          {/* 5. More / Full Navigation Drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  );
};