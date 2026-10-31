import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar } from './components/layout/Topbar';
import { AdminLayout } from './components/layout/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { FrontDeskPersonPage } from './components/frontdesk/FrontDeskPersonPage';
import { ToastContainer } from './components/ui/Toast';
import { SplashScreen } from './components/ui/SplashScreen';

const AppContent = () => {
  const { currentView, scannedRoom } = useApp();
  const [showSplash, setShowSplash] = useState(false);

  if (showSplash) {
    return <SplashScreen onDismiss={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Global topbar: hidden on mobile when scanned via QR so guest gets a full native phone app */}
      <div className={scannedRoom ? 'hidden md:block flex-shrink-0' : 'flex-shrink-0'}>
        <Topbar />
      </div>

      {/* Content area fills remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {currentView === 'admin' ? (
          <AdminLayout />
        ) : currentView === 'frontdesk' ? (
          <FrontDeskPersonPage />
        ) : (
          <PublicLayout />
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
