import React, { useState } from 'react';
import {
  BedDouble, Calendar, Clock, DollarSign, Bell, ShieldCheck,
  Utensils, Sparkles, Wrench, PhoneCall, KeyRound, Wifi,
  ChevronRight, Award, AlertCircle, ArrowUpRight, CheckCircle2,
  HeartHandshake, Coffee, Moon, Star
} from 'lucide-react';
import type { GuestStayInfo, GuestPortalTab } from '../types';

interface GuestDashboardTabProps {
  stay: GuestStayInfo;
  onNavigateTab: (tab: GuestPortalTab) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

export const GuestDashboardTab: React.FC<GuestDashboardTabProps> = ({
  stay,
  onNavigateTab,
  onAddToast,
}) => {
  const [keyUnlocked, setKeyUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleSimulateKeyPass = () => {
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      setKeyUnlocked(true);
      onAddToast({
        type: 'success',
        title: 'RFID Key Sensor',
        message: `Room #${stay.room} electronic door lock unlatched. Welcome in!`,
      });
      setTimeout(() => setKeyUnlocked(false), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── 1. WELCOME HERO WITH GUEST AVATAR & ACTIVE RESIDENT STATUS ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={stay.avatar}
                alt={stay.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg text-white shadow-xs" title="Verified VIP">
                <Award className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {stay.tier} Member
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {stay.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-white">
                Welcome to your stay, {stay.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5 flex items-center gap-2">
                <span>{stay.assignedProperty}</span>
                <span>·</span>
                <span className="font-semibold text-amber-300">Room #{stay.room} ({stay.roomType})</span>
              </p>
            </div>
          </div>

          {/* Quick RFID Mobile Key Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleSimulateKeyPass}
              disabled={unlocking}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg ${
                keyUnlocked
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
              }`}
            >
              <KeyRound className={`w-4 h-4 ${unlocking ? 'animate-spin' : ''}`} />
              <span>{unlocking ? 'Transmitting RFID...' : keyUnlocked ? 'Room Door Unlocked!' : 'Tap Mobile Room Key'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('stay')}
              className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-semibold transition-colors"
            >
              <span>View Full Stay Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. CURRENT RESERVATION OVERVIEW CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Room & Type */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <BedDouble className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Assigned Suite</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Room #{stay.room}</p>
            <p className="text-[11px] text-gray-500 truncate">{stay.roomType} · Floor {stay.floor}</p>
          </div>
        </div>

        {/* Stay Dates */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Check-In / Out</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{stay.checkIn} → {stay.checkOut}</p>
            <p className="text-[11px] text-gray-500 truncate">{stay.nights} Nights ({stay.nightsRemaining} Nights Remaining)</p>
          </div>
        </div>

        {/* Current Outstanding Balance */}
        <button
          type="button"
          onClick={() => onNavigateTab('billing')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center gap-3.5 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding Balance</p>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">${stay.balance.toFixed(2)}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{stay.paymentStatus} · Click to Settle</p>
          </div>
        </button>

        {/* Wi-Fi & Credentials */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">High-Speed Wi-Fi 6</p>
            <p className="text-xs font-mono font-bold text-gray-900 dark:text-white truncate">{stay.wifiNetwork}</p>
            <p className="text-[11px] text-gray-500 font-mono">Pass: <strong className="text-gray-800 dark:text-gray-200">{stay.wifiPassword}</strong></p>
          </div>
        </div>
      </div>

      {/* ─── 3. QUICK ACCESS LAUNCHPAD (MENU, SERVICES, HOUSEKEEPING, MAINTENANCE, BILLING, CHAT, REVIEWS) ─── */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Quick In-Stay Services & Resident Portals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Folio & Billing */}
          <button
            type="button"
            onClick={() => onNavigateTab('billing')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                My Bill & Settlement
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Itemized Folio, Pay Balance & Receipts</p>
            </div>
          </button>

          {/* Reception Chat & Requests */}
          <button
            type="button"
            onClick={() => onNavigateTab('communications')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Requests & Concierge Chat
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Live Staff Messaging & Lost Property</p>
            </div>
          </button>

          {/* Restaurant Menu */}
          <button
            type="button"
            onClick={() => onNavigateTab('dining')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Restaurant & In-Room Dining
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Browse Menus & Track Orders Live</p>
            </div>
          </button>

          {/* Hotel Services */}
          <button
            type="button"
            onClick={() => onNavigateTab('services')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Hotel Services & Spa
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Spa, Gym, Laundry & Airport Chauffeur</p>
            </div>
          </button>

          {/* Housekeeping Requests */}
          <button
            type="button"
            onClick={() => onNavigateTab('housekeeping')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Housekeeping Coordination
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Linen change, towels & extra pillows</p>
            </div>
          </button>

          {/* Maintenance Requests */}
          <button
            type="button"
            onClick={() => onNavigateTab('maintenance')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                Maintenance Assistance
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Report AC, TV, Wi-Fi or Plumbing</p>
            </div>
          </button>

          {/* Reviews & Feedback */}
          <button
            type="button"
            onClick={() => onNavigateTab('reviews')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Reviews & Satisfaction
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Rate Stay & View GM Responses</p>
            </div>
          </button>

          {/* My Current Stay */}
          <button
            type="button"
            onClick={() => onNavigateTab('stay')}
            className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                My Stay & Digital Key
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Amenities, Extensions & Departure</p>
            </div>
          </button>
        </div>
      </div>

      {/* ─── 4. NOTIFICATIONS & IMPORTANT UPDATES CAROUSEL ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-700 pb-2.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            Notifications & Hotel Updates
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
            3 Active Updates
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 dark:text-gray-300 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">Express Laundry Service Fulfilled</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Your dry-cleaned garments (#LND-402) have been placed inside your room wardrobe. No charge added to folio.
              </p>
            </div>
            <span className="text-[10px] text-gray-400 ml-auto whitespace-nowrap">20m ago</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 dark:text-gray-300 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">Executive Chef's Tasting Menu Invitation</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Chef Antoine has reserved a VIP table for Platinum guests at The Grand Dining Room tonight at 19:30.
              </p>
            </div>
            <span className="text-[10px] text-gray-400 ml-auto whitespace-nowrap">1h ago</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 dark:text-gray-300 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">Rooftop Thermal Infinity Pool Open</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Water temperature is set to a comfortable 28°C / 82°F. Private cabanas can be booked via Hotel Services.
              </p>
            </div>
            <span className="text-[10px] text-gray-400 ml-auto whitespace-nowrap">3h ago</span>
          </div>
        </div>
      </div>

      {/* ─── 5. EMERGENCY CONTACT & HOTEL ASSISTANCE DIRECTORY ─── */}
      <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-red-900 dark:text-red-200 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-600" />
              Emergency Assistance & Medical Contacts
            </h3>
            <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-0.5">
              Available 24 hours a day for medical emergencies, urgent security, and in-house duty manager.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider self-start sm:self-center">
            24/7 Rapid Response
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 text-xs">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Front Desk & Concierge</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">Dial 0 from room</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400">+1 (555) 019-4001</p>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 text-xs">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Hotel Doctor on Call</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">Ext 4402 (Medical)</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Dr. Helena Rossi, MD</p>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 text-xs">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Security & Fire Safety</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">Ext 911 (Internal)</p>
            <p className="text-[11px] text-red-600 dark:text-red-400">Security Control Room</p>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 text-xs">
            <p className="text-gray-500 text-[10px] uppercase font-bold">Local Emergency Services</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">Dial 911 / 112</p>
            <p className="text-[11px] text-gray-500">Police · Fire · Ambulance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
