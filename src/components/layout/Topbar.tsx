import React, { useState, useRef, useEffect } from 'react';
import {
  Hotel, Leaf, Flame, Sun, Moon, LayoutDashboard, Globe,
  Bell, ChevronDown, User, Settings, LogOut, Zap, X, ConciergeBell, ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PropertyMode } from '../../data/mockData';
import { propertyConfigs } from '../../data/mockData';

const modeOptions: { mode: PropertyMode; label: string; short: string; icon: React.ReactNode; gradient: string }[] = [
  { mode: 'hotel', label: 'Luxury Hotel', short: 'Hotel', icon: <Hotel className="w-3.5 h-3.5" />, gradient: 'luxury-gradient' },
  { mode: 'guesthouse', label: 'Guest House', short: 'G.House', icon: <Leaf className="w-3.5 h-3.5" />, gradient: 'guesthouse-gradient' },
  { mode: 'restaurant', label: 'Restaurant', short: 'Resto', icon: <Flame className="w-3.5 h-3.5" />, gradient: 'restaurant-gradient' },
];

export const Topbar: React.FC = () => {
  const { currentView, setCurrentView, viewHistory, goBackView, propertyMode, setPropertyMode, darkMode, toggleDarkMode, addToast } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const config = propertyConfigs[propertyMode];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleModeChange = (mode: PropertyMode) => {
    setPropertyMode(mode);
    addToast({
      type: 'info',
      title: `Switched to ${propertyConfigs[mode].name}`,
      message: 'Dashboard updated.',
    });
  };

  const currentMode = modeOptions.find(m => m.mode === propertyMode)!;

  return (
    <header className="flex-shrink-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-3 md:px-5 h-14 gap-3">

        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className={`w-8 h-8 rounded-lg ${currentMode.gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
            <span className="text-base">{config.logo}</span>
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none font-serif truncate max-w-[160px]">{config.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">ERP Platform</p>
          </div>
        </div>

        {/* Center: Demo Mode Switcher */}
        <div className="flex items-center gap-1 flex-1 justify-center max-w-md">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-0.5">
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 px-1.5 font-medium">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Demo:</span>
            </div>
            {modeOptions.map(opt => (
              <button
                key={opt.mode}
                onClick={() => handleModeChange(opt.mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  propertyMode === opt.mode
                    ? `${opt.gradient} text-white shadow-sm`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {opt.icon}
                <span className="hidden md:inline">{opt.label}</span>
                <span className="md:hidden">{opt.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Back to Previous View Button */}
          {viewHistory.length > 0 && (
            <button
              onClick={goBackView}
              title={`Return to previous view: ${viewHistory[viewHistory.length - 1] === 'public' ? 'Guest Site' : viewHistory[viewHistory.length - 1] === 'frontdesk' ? 'Front Desk' : 'Admin PMS'}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors shadow-xs border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Back ({viewHistory[viewHistory.length - 1] === 'public' ? 'Guest' : viewHistory[viewHistory.length - 1] === 'frontdesk' ? 'Desk' : 'Admin'})</span>
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setCurrentView('public')}
              title="Guest Website"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'public'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Guest Site</span>
            </button>
            <button
              onClick={() => setCurrentView('frontdesk')}
              title="Front Desk Terminal"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'frontdesk'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <ConciergeBell className="w-3.5 h-3.5" />
              <span>Front Desk</span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              title="Admin Dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin PMS</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
              className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-luxury-lg border border-gray-100 dark:border-gray-700 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</p>
                  <button onClick={() => setNotifOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-72 overflow-y-auto scrollbar-thin">
                  {[
                    { title: 'Room 302 checked in', desc: 'Marcus Adeyemi arrived', time: '2m ago', dot: 'bg-emerald-500' },
                    { title: 'New booking confirmed', desc: 'LXP-2026-007 — Presidential Suite', time: '35m ago', dot: 'bg-blue-500' },
                    { title: 'Maintenance alert', desc: 'Room 401 — AC unit requires service', time: '1hr ago', dot: 'bg-amber-500' },
                    { title: 'Low inventory warning', desc: 'Wagyu Beef A4 — Only 12kg remaining', time: '2hr ago', dot: 'bg-red-500' },
                    { title: 'Guest request', desc: 'Room 201 — Extra towels requested', time: '3hr ago', dot: 'bg-purple-500' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => { addToast({ type: 'info', title: 'Coming Soon', message: 'Full notification center in production.' }); setNotifOpen(false); }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                VH
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">Victoria H.</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">General Manager</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-luxury-lg border border-gray-100 dark:border-gray-700 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Victoria Hartley</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">General Manager</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">● On Duty</p>
                </div>
                <div className="p-1.5">
                  {[
                    { icon: <User className="w-4 h-4" />, label: 'My Profile' },
                    { icon: <Settings className="w-4 h-4" />, label: 'Settings' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { addToast({ type: 'info', title: item.label, message: 'Available in full version.' }); setUserOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button
                      onClick={() => { addToast({ type: 'info', title: 'Signed Out', message: 'Demo mode — no actual auth.' }); setUserOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
