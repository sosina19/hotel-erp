import React, { useState } from 'react';
import { Menu, X, Star, Phone, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { propertyConfigs } from '../../data/mockData';

interface PublicNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const PublicNav: React.FC<PublicNavProps> = ({ currentPage, setCurrentPage }) => {
  const { propertyMode, setCurrentView, guestLoggedIn } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const config = propertyConfigs[propertyMode];

  const navLinks = propertyMode === 'restaurant'
    ? ['Home', 'Menu', 'Reservations', 'About']
    : propertyMode === 'guesthouse'
    ? ['Home', 'Rooms', 'Dining', 'Book Now', 'Guest Portal']
    : ['Home', 'Rooms', 'Dining', 'Book Now', 'Guest Portal'];

  // Use inline style for gradient to avoid non-standard Tailwind color classes
  const navStyle: React.CSSProperties = propertyMode === 'hotel'
    ? { background: 'linear-gradient(to right, #0a1628, #1e3a5f)' }
    : propertyMode === 'guesthouse'
    ? { background: 'linear-gradient(to right, #064e3b, #059669)' }
    : { background: 'linear-gradient(to right, #3c0a0a, #8b1a1a)' };

  const toPageKey = (link: string) => link.toLowerCase().replace(/\s+/g, '-');

  return (
    <nav className="sticky top-0 z-30 shadow-luxury" style={navStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
          >
            <span className="text-xl">{config.logo}</span>
            <div className="hidden sm:block">
              <p className="font-bold text-sm font-serif leading-none">{config.name}</p>
              {config.stars > 1 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: Math.min(config.stars, 5) }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => {
              const key = toPageKey(link);
              const isPortal = link === 'Guest Portal';
              return (
                <button
                  key={link}
                  onClick={() => setCurrentPage(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === key
                      ? 'bg-white/20 text-white'
                      : isPortal && guestLoggedIn
                      ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/30'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isPortal && guestLoggedIn ? (
                    <span className="flex items-center gap-1.5">
                      <span>My Stay</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">#101</span>
                    </span>
                  ) : (
                    link
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${config.phone}`}
              className="hidden lg:flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{config.phone}</span>
            </a>

            {propertyMode !== 'restaurant' && (
              <button
                onClick={() => setCurrentPage('book-now')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Book Now
              </button>
            )}

            {propertyMode === 'restaurant' && (
              <button
                onClick={() => setCurrentPage('reservations')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Reserve
              </button>
            )}

            <button
              onClick={() => setCurrentView('admin')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Globe className="w-3 h-3" />
              Staff Login
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-3 pt-2 space-y-0.5 animate-fade-in">
          {navLinks.map(link => {
            const key = toPageKey(link);
            const isPortal = link === 'Guest Portal';
            return (
              <button
                key={link}
                onClick={() => { setCurrentPage(key); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === key ? 'bg-white/20 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {isPortal && guestLoggedIn ? 'My Stay (Room #101 Active)' : link}
              </button>
            );
          })}
          <div className="pt-2 border-t border-white/10 mt-2">
            <button
              onClick={() => { setCurrentView('admin'); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-white/60 hover:text-white text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              🔐 Staff Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
