import React from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../admin/Dashboard';
import { Reservations } from '../admin/Reservations';
import { FrontDesk } from '../admin/FrontDesk';
import { GuestCRM } from '../admin/GuestCRM';
import { RoomsInventory } from '../admin/RoomsInventory';
import { Housekeeping } from '../admin/Housekeeping';
import { Maintenance } from '../admin/Maintenance';
import { RestaurantPOS } from '../admin/RestaurantPOS';
import { NightAudit } from '../admin/NightAudit';
import { Finance } from '../admin/Finance';
import { Inventory } from '../admin/Inventory';
import { Staff } from '../admin/Staff';
import { Settings } from '../admin/Settings';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC = () => {
  const { adminPage } = useApp();

  const renderPage = () => {
    switch (adminPage) {
      case 'dashboard': return <Dashboard />;
      case 'reservations': return <Reservations />;
      case 'frontdesk': return <FrontDesk />;
      case 'guestcrm': return <GuestCRM />;
      case 'rooms': return <RoomsInventory />;
      case 'housekeeping': return <Housekeeping />;
      case 'maintenance': return <Maintenance />;
      case 'restaurant-pos': return <RestaurantPOS />;
      case 'night-audit': return <NightAudit />;
      case 'finance': return <Finance />;
      case 'inventory': return <Inventory />;
      case 'staff': return <Staff />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content — scrollable */}
      <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-900">
        <div key={adminPage} className="animate-fade-in min-h-full">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};
