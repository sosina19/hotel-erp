import React, { useEffect, useState } from 'react';
import { Hotel, Leaf, Flame, Zap, LayoutDashboard, Globe, ConciergeBell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PropertyMode } from '../../data/mockData';

export const SplashScreen: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { setPropertyMode, setCurrentView } = useApp();
  const [visible, setVisible] = useState(true);

  const options: { mode: PropertyMode; icon: React.ReactNode; label: string; sub: string; gradient: string; textColor: string }[] = [
    { mode: 'hotel', icon: <Hotel className="w-8 h-8" />, label: 'Grand Luxe Palace', sub: '5-Star Luxury Hotel', gradient: 'luxury-gradient', textColor: 'text-blue-600' },
    { mode: 'guesthouse', icon: <Leaf className="w-8 h-8" />, label: 'The Willow Retreat', sub: 'Boutique Guest House', gradient: 'guesthouse-gradient', textColor: 'text-emerald-600' },
    { mode: 'restaurant', icon: <Flame className="w-8 h-8" />, label: 'Ember & Ash', sub: 'Fine Dining Restaurant', gradient: 'restaurant-gradient', textColor: 'text-red-600' },
  ];

  const handleSelect = (mode: PropertyMode, view: 'public' | 'admin' | 'frontdesk') => {
    setPropertyMode(mode);
    setCurrentView(view);
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!visible) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-[200] flex items-center justify-center animate-fade-in" style={{ animationDirection: 'reverse' }}>
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 z-[200] flex items-center justify-center p-4 animate-fade-in">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl luxury-gradient flex items-center justify-center">
              <span className="text-xl">🏰</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl font-serif leading-none">LuxeStay ERP</p>
              <p className="text-gray-400 text-xs">Hospitality Management Platform</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Interactive Sales Demo</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif mb-3">
            Welcome to the Future<br />of Hospitality
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            A unified enterprise platform for hotels, guest houses & restaurants. Choose a property to explore.
          </p>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {options.map(opt => (
            <div key={opt.mode} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all group">
              <div className={`${opt.gradient} p-6 flex flex-col items-center text-white`}>
                {opt.icon}
                <p className="font-bold text-lg font-serif mt-3 text-center">{opt.label}</p>
                <p className="text-white/70 text-xs mt-1">{opt.sub}</p>
              </div>
              <div className="p-3 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelect(opt.mode, 'public')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-[11px] font-medium text-gray-300">Guest</span>
                </button>
                <button
                  onClick={() => handleSelect(opt.mode, 'frontdesk')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-amber-950/40 border border-amber-600/30 hover:bg-amber-900/40 transition-colors"
                >
                  <ConciergeBell className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">Front Desk</span>
                </button>
                <button
                  onClick={() => handleSelect(opt.mode, 'admin')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-400" />
                  <span className="text-[11px] font-medium text-gray-300">Admin</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: '📅', label: 'Reservations & PMS' },
            { icon: '🍽️', label: 'Restaurant POS' },
            { icon: '🧹', label: 'Housekeeping' },
            { icon: '💳', label: 'Finance & Folios' },
            { icon: '👥', label: 'Guest CRM' },
            { icon: '📦', label: 'Inventory' },
            { icon: '🔐', label: 'Staff & RBAC' },
            { icon: '📊', label: 'Live Analytics' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
              <span className="text-base">{f.icon}</span>
              <span className="text-gray-400 text-xs font-medium">{f.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs">
          All data is simulated · No backend required · For demonstration purposes only
        </p>
      </div>
    </div>
  );
};
