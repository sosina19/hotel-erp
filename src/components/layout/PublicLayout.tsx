import React, { useState, useEffect } from 'react';
import { PublicNav } from '../public/PublicNav';
import { HomePage } from '../public/HomePage';
import { RoomsPage } from '../public/RoomsPage';
import { DiningPage } from '../public/DiningPage';
import { BookingEngine } from '../public/BookingEngine';
import { GuestPortal } from '../public/GuestPortal';
import { RestaurantPage } from '../public/RestaurantPage';
import { GuesthousePage } from '../public/GuesthousePage';
import { useApp } from '../../context/AppContext';

export const PublicLayout: React.FC = () => {
  const { propertyMode, guestLoggedIn, scannedRoom, scannedTarget } = useApp();
  const [currentPage, setCurrentPage] = useState(
    scannedTarget === 'dining' || scannedRoom ? 'dining' : 'home'
  );

  // If scanned from QR code or target is dining, open dining on guest site
  useEffect(() => {
    if (scannedTarget === 'dining' || (scannedRoom && !guestLoggedIn)) {
      setCurrentPage('dining');
    }
  }, [scannedRoom, scannedTarget, guestLoggedIn]);

  // Reset to home when property mode switches (unless scanned via QR)
  useEffect(() => {
    if (!scannedRoom && !scannedTarget) {
      setCurrentPage('home');
    }
  }, [propertyMode, scannedRoom, scannedTarget]);

  // When authenticated and on the guest portal, bypass PublicNav completely
  // for a dedicated, uninterrupted Resident Portal user experience
  if (guestLoggedIn && currentPage === 'guest-portal') {
    return (
      <div className="h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <GuestPortal setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  const getHomePage = () => {
    if (propertyMode === 'restaurant') return <RestaurantPage setCurrentPage={setCurrentPage} />;
    if (propertyMode === 'guesthouse') return <GuesthousePage setCurrentPage={setCurrentPage} />;
    return <HomePage setCurrentPage={setCurrentPage} />;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
      case 'about':
        return getHomePage();
      case 'rooms':
        return propertyMode === 'guesthouse'
          ? <GuesthousePage setCurrentPage={setCurrentPage} />
          : <RoomsPage setCurrentPage={setCurrentPage} />;
      case 'dining':
      case 'menu':
        return <DiningPage setCurrentPage={setCurrentPage} />;
      case 'book-now':
        return <BookingEngine setCurrentPage={setCurrentPage} />;
      case 'reservations':
        return propertyMode === 'restaurant'
          ? <RestaurantPage setCurrentPage={setCurrentPage} />
          : <BookingEngine setCurrentPage={setCurrentPage} />;
      case 'guest-portal':
        return <GuestPortal setCurrentPage={setCurrentPage} />;
      default:
        return getHomePage();
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin bg-white dark:bg-gray-900">
      <PublicNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div key={`${propertyMode}-${currentPage}`} className="animate-fade-in">
        {renderPage()}
      </div>
    </div>
  );
};