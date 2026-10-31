import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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
  | 'settings'
  | 'smart-qr';

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

  // QR Code Deep-Linking
  scannedRoom: string | null;
  setScannedRoom: (room: string | null) => void;
  scannedTarget: string | null;
  setScannedTarget: (target: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to read URL params synchronously on first load
const getInitialUrlParams = () => {
  if (typeof window === 'undefined') return { room: null, target: null };
  try {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const target = params.get('target');
    return { room, target: target || (room ? 'dining' : null) };
  } catch {
    return { room: null, target: null };
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialParams = getInitialUrlParams();

  const [currentView, setCurrentViewState] = useState<AppView>(initialParams.room ? 'public' : 'frontdesk');
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [propertyMode, setPropertyMode] = useState<PropertyMode>('hotel');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [guestLoggedIn, setGuestLoggedIn] = useState(Boolean(initialParams.room));
  const [guestEmail, setGuestEmail] = useState(initialParams.room ? `guest.room${initialParams.room}@betorahms.com` : '');

  // Scanned room & target parameters
  const [scannedRoom, setScannedRoom] = useState<string | null>(initialParams.room);
  const [scannedTarget, setScannedTarget] = useState<string | null>(initialParams.target);

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
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Deep-linking QR scan detection from URL params (e.g. ?room=101&target=dining)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = params.get('room');
      const target = params.get('target');
      if (room) {
        setScannedRoom(room);
        setScannedTarget(target || 'dining');
        setCurrentViewState('public');
        setGuestLoggedIn(true);
        setGuestEmail(`guest.room${room}@betorahms.com`);
        addToast({
          type: 'success',
          title: `Room #${room} QR Scan Connected`,
          message: `Direct ${target === 'dining' ? 'In-Room Dining' : target === 'services' ? 'Hotel Services' : 'Guest Portal'} session activated for Room #${room}.`,
        });
      }
    }
  }, [addToast]);

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
      scannedRoom, setScannedRoom,
      scannedTarget, setScannedTarget,
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