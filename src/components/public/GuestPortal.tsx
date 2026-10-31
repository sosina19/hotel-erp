import React, { useState } from 'react';
import { User, Lock, Sparkles, BedDouble, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { propertyConfigs } from '../../data/mockData';
import { GuestPortalPage } from '../guestportal/GuestPortalPage';

interface GuestPortalProps {
  setCurrentPage: (page: string) => void;
}

export const GuestPortal: React.FC<GuestPortalProps> = ({ setCurrentPage }) => {
  const { guestLoggedIn, setGuestLoggedIn, setGuestEmail, addToast, propertyMode } = useApp();
  const config = propertyConfigs[propertyMode];

  const [loginForm, setLoginForm] = useState({
    email: 'james.worthington@uk-holdings.co.uk',
    bookingRef: 'LXP-2026-001'
  });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginForm.email || !loginForm.bookingRef) {
      setLoginError('Please enter both your email address and booking reference.');
      return;
    }
    setGuestEmail(loginForm.email);
    setGuestLoggedIn(true);
    setLoginError('');
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Welcome to your self-service portal, ${loginForm.email.split('@')[0]}.`,
    });
  };

  const handleDemoFill = () => {
    setLoginForm({
      email: 'james.worthington@uk-holdings.co.uk',
      bookingRef: 'LXP-2026-001'
    });
    setGuestEmail('james.worthington@uk-holdings.co.uk');
    setGuestLoggedIn(true);
    setLoginError('');
    addToast({
      type: 'success',
      title: 'Authenticated as Resident',
      message: 'Access granted to Room 101 Resident Portal (Lord James Worthington).',
    });
  };

  const gradientClass = propertyMode === 'hotel'
    ? 'luxury-gradient'
    : propertyMode === 'guesthouse'
    ? 'guesthouse-gradient'
    : 'restaurant-gradient';

  // When logged in, render the comprehensive 8-module dedicated Guest Portal
  if (guestLoggedIn) {
    return <GuestPortalPage onExitToPublicSite={() => setCurrentPage('home')} />;
  }

  // Guest Self-Service Login Screen
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className={`${gradientClass} py-12 px-4 flex-shrink-0 text-white shadow-md`}>
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-3 block">{config.logo}</span>
          <h1 className="text-3xl font-bold font-serif mb-1">{config.name}</h1>
          <p className="text-white/80 text-sm">Guest Self-Service Portal & Resident Services</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-luxury border border-gray-100 dark:border-gray-700 p-8 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-700">
                <KeyRound className="w-7 h-7 text-[#1e3a5f] dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resident Sign In</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Access your room details, dining orders, amenities & hotel services
              </p>
            </div>

            {/* Quick 1-Click Demo Login Banner */}
            <div className="mb-6 p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Demo Account</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-bold">
                  Room 101
                </span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300 mb-2.5 leading-relaxed">
                Experience the complete 8-module portal as Lord James Worthington (Checked-In Resident).
              </p>
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>⚡ 1-Click Resident Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="input-field pl-9"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Booking Reference
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="input-field pl-9 uppercase"
                    placeholder="LXP-2026-001"
                    value={loginForm.bookingRef}
                    onChange={e => setLoginForm({ ...loginForm, bookingRef: e.target.value })}
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.01] shadow-md"
              >
                Sign In to My Stay
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Don't have an active reservation yet?
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage('book-now')}
                className="w-full py-2.5 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse & Book Rooms Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};