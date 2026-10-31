import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { PropertyMode } from '../data/mockData';

export type AppView = 'public' | 'admin' | 'frontdesk';
export type AdminPage =
  | 'dashboard'
  | 'reservations'
  | 'frontdesk'
  | 'guestcrm'
  | 'rooms'
  | 'housekeeping'
  | 'maintenance'
  | 'restaurant-pos'
  | 'night-audit'
  | 'finance'
  | 'inventory'
  | 'staff'
  | 'settings';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // View management
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  viewHistory: AppView[];
  goBackView: () => void;
  adminPage: AdminPage;
  setAdminPage: (page: AdminPage) => void;

  // Property mode
  propertyMode: PropertyMode;
  setPropertyMode: (mode: PropertyMode) => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Sidebar collapsed state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Guest portal
  guestLoggedIn: boolean;
  setGuestLoggedIn: (loggedIn: boolean) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewState] = useState<AppView>('frontdesk');
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [propertyMode, setPropertyMode] = useState<PropertyMode>('hotel');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [guestLoggedIn, setGuestLoggedIn] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');

  const setCurrentView = useCallback((view: AppView) => {
    setCurrentViewState(prev => {
      if (prev !== view) {
        setViewHistory(h => [...h, prev]);
      }
      return view;
    });
  }, []);

  const goBackView = useCallback(() => {
    setViewHistory(h => {
      if (h.length === 0) return h;
      const prevView = h[h.length - 1];
      setCurrentViewState(prevView);
      return h.slice(0, -1);
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      viewHistory, goBackView,
      adminPage, setAdminPage,
      propertyMode, setPropertyMode,
      darkMode, toggleDarkMode,
      toasts, addToast, removeToast,
      sidebarCollapsed, setSidebarCollapsed,
      guestLoggedIn, setGuestLoggedIn,
      guestEmail, setGuestEmail,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
