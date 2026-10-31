import React from 'react';
import {
  LayoutDashboard, CalendarDays, Users, DoorOpen, BedDouble,
  Sparkles, UtensilsCrossed, CreditCard, Package, UserCog,
  Settings, ChevronLeft, ChevronRight, TrendingUp, Wrench, Moon, QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AdminPage } from '../../context/AppContext';
import { propertyConfigs } from '../../data/mockData';

interface NavItem {
  id: AdminPage;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  modesOnly?: ('hotel' | 'guesthouse' | 'restaurant')[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'reservations', label: 'Reservations', icon: <CalendarDays className="w-4 h-4" />, badge: 7 },
  { id: 'guestcrm', label: 'Guest CRM', icon: <Users className="w-4 h-4" /> },
  { id: 'rooms', label: 'Rooms & Inventory', icon: <BedDouble className="w-4 h-4" />, modesOnly: ['hotel', 'guesthouse'] },
  { id: 'housekeeping', label: 'Housekeeping', icon: <Sparkles className="w-4 h-4" />, badge: 4, modesOnly: ['hotel', 'guesthouse'] },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" />, badge: 3, modesOnly: ['hotel', 'guesthouse'] },
  { id: 'restaurant-pos', label: 'Restaurant POS', icon: <UtensilsCrossed className="w-4 h-4" />, modesOnly: ['hotel', 'restaurant'] },
  { id: 'night-audit', label: 'Night Audit', icon: <Moon className="w-4 h-4" />, modesOnly: ['hotel', 'guesthouse'] },
  { id: 'finance', label: 'Finance & Folios', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'inventory', label: 'Inventory & Stock', icon: <Package className="w-4 h-4" /> },
  { id: 'staff', label: 'Staff & RBAC', icon: <UserCog className="w-4 h-4" /> },
  { id: 'smart-qr', label: 'QR Room Codes', icon: <QrCode className="w-4 h-4" />, badge: 'Live' },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
  const { adminPage, setAdminPage, sidebarCollapsed, setSidebarCollapsed, propertyMode } = useApp();
  const config = propertyConfigs[propertyMode];

  const gradientClass = propertyMode === 'hotel'
    ? 'luxury-gradient'
    : propertyMode === 'guesthouse'
    ? 'guesthouse-gradient'
    : 'restaurant-gradient';

  const filteredItems = navItems.filter(item =>
    !item.modesOnly || item.modesOnly.includes(propertyMode)
  );

  return (
    <aside
      className={`${gradientClass} flex flex-col transition-all duration-300 h-full relative ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
      >
        {sidebarCollapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft className="w-3.5 h-3.5" />
        }
      </button>

      {/* Logo */}
      <div className={`px-4 py-5 border-b border-white/10 flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-base">{config.logo}</span>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm font-serif leading-none truncate">{config.name}</p>
            <p className="text-white/60 text-xs mt-0.5">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {!sidebarCollapsed && (
          <p className="px-2 text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Main Menu</p>
        )}

        <div className="flex flex-col gap-0.5">
          {filteredItems.map(item => {
            const isActive = adminPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminPage(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`sidebar-item relative ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${
                  sidebarCollapsed ? 'justify-center px-2' : ''
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold leading-none flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge !== undefined && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Stats */}
      {!sidebarCollapsed && (
        <div className="px-3 py-4 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <p className="text-white/70 text-xs font-medium">Today's Revenue</p>
            </div>
            <p className="text-white font-bold text-lg">$13,650</p>
            <p className="text-emerald-300 text-xs flex items-center gap-1 mt-0.5">
              <span>↑ 12.4% vs yesterday</span>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
