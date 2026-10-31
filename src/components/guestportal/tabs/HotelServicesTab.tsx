import React, { useState } from 'react';
import {
  Coffee, Sparkles, Clock, Car, PhoneCall, Calendar,
  CheckCircle2, DollarSign, Bell, Waves, Dumbbell, Shirt,
  Briefcase, HeartHandshake, ChevronRight, X, Send, AlertCircle
} from 'lucide-react';
import type { HotelServiceItem, GuestPortalTab } from '../types';
import { Modal } from '../../ui/Modal';

interface HotelServicesTabProps {
  onNavigateTab: (tab: GuestPortalTab) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

export const HotelServicesTab: React.FC<HotelServicesTabProps> = ({ onNavigateTab, onAddToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookingService, setBookingService] = useState<HotelServiceItem | null>(null);

  // Booking Form State
  const [bookingTime, setBookingTime] = useState('15:00');
  const [bookingDate, setBookingDate] = useState('2026-10-31');
  const [specialNotes, setSpecialNotes] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  const services: HotelServiceItem[] = [
    {
      id: 'spa',
      name: 'The Lotus Spa & Hydrotherapy Suite',
      category: 'Wellness & Spa',
      description: 'Award-winning holistic sanctuary featuring Finnish cedar saunas, steam grotto, and aromatherapy deep-tissue massages.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
      price: 'From $120.00',
      hours: '08:00 – 21:00 Daily',
      estimatedTime: '60 – 90 mins',
      availability: 'Requires Reservation',
      rules: 'Robes & slippers provided. Please arrive 15 minutes before your treatment.',
      actionType: 'book',
    },
    {
      id: 'gym',
      name: 'Executive Technogym Fitness Center',
      category: 'Fitness & Recreation',
      description: 'State-of-the-art panoramic gym with cardiovascular stations, free weights, Peloton bikes, and private personal trainers.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
      price: 'Complimentary for Residents',
      hours: 'Open 24 Hours Daily',
      estimatedTime: 'Self-Service',
      availability: 'Available Now',
      rules: 'Athletic footwear required. Cold towels and chilled fruit water provided.',
      actionType: 'info',
    },
    {
      id: 'pool',
      name: 'Rooftop Heated Infinity Swimming Pool',
      category: 'Fitness & Recreation',
      description: 'Heated open-air infinity pool overlooking the coastline. Features poolside sun lounger cabanas and cocktail service.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80',
      price: 'Complimentary (Cabanas $50/day)',
      hours: '06:00 – 22:00 Daily',
      estimatedTime: 'Instant Access',
      availability: 'Available Now',
      rules: 'Lifeguard on duty. Children must be accompanied by an adult.',
      actionType: 'book',
    },
    {
      id: 'laundry',
      name: 'Express Same-Day Laundry & Dry Cleaning',
      category: 'In-Room & Concierge',
      description: 'Professional eco-friendly garment pressing, washing, and dry-cleaning with door-to-door garment pickup.',
      image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&q=80',
      price: 'Priced per garment',
      hours: 'Pickup: 07:00 – 19:00',
      estimatedTime: '3 – 6 hours',
      availability: 'Available Now',
      rules: 'Same-day turnaround for garments collected before 10:00 AM.',
      actionType: 'request',
    },
    {
      id: 'airport',
      name: 'VIP Chauffeur & Airport Transportation',
      category: 'Transport & Travel',
      description: 'Private chauffeur airport transfers and city journeys in luxury Mercedes S-Class sedan or executive VIP V-Class van.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80',
      price: '$85.00 per transfer',
      hours: '24 Hours Advance Notice',
      estimatedTime: 'Flight Tracking Included',
      availability: 'Requires Reservation',
      rules: 'Cancellation without fee up to 2 hours prior to scheduled departure.',
      actionType: 'book',
    },
    {
      id: 'wakeup',
      name: 'Scheduled Wake-Up Call Service',
      category: 'In-Room & Concierge',
      description: 'Personalized morning wake-up call by the duty concierge, with option for fresh hot espresso delivered to your door.',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=500&q=80',
      price: 'Complimentary',
      hours: 'Any requested hour',
      estimatedTime: 'Exact requested time',
      availability: 'Available Now',
      rules: 'Please schedule at least 30 minutes in advance.',
      actionType: 'request',
    },
    {
      id: 'valet',
      name: 'Valet Parking & Vehicle Retrieval',
      category: 'Transport & Travel',
      description: 'Secure underground parking with EV superchargers and 10-minute on-demand vehicle driveway retrieval.',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&q=80',
      price: 'Included with Suite',
      hours: '24 Hours Valet Attendants',
      estimatedTime: '10 min retrieval',
      availability: 'Available Now',
      rules: 'Present your valet ticket number or request car via the portal.',
      actionType: 'request',
    },
    {
      id: 'conference',
      name: 'Executive Boardroom & Meeting Suites',
      category: 'In-Room & Concierge',
      description: 'High-tech corporate meeting rooms with 4K interactive presentation display, Cisco teleconferencing, and catered coffee breaks.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=500&q=80',
      price: '$95.00 / hour',
      hours: '08:00 – 20:00 Daily',
      estimatedTime: 'Hourly reservation',
      availability: 'Requires Reservation',
      rules: 'High-speed dedicated Wi-Fi and conference station included.',
      actionType: 'book',
    },
    {
      id: 'concierge',
      name: 'Head Concierge & Bespoke City Tours',
      category: 'In-Room & Concierge',
      description: 'Private helicopter charters, Michelin-starred restaurant bookings, opera tickets, and tailored regional excursions.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
      price: 'Custom quote per itinerary',
      hours: '07:00 – 23:00 Daily',
      estimatedTime: 'Consultation within 15 mins',
      availability: 'Available Now',
      rules: 'Our Clefs d’Or concierges are at your complete service.',
      actionType: 'request',
    },
  ];

  const categories = ['All', 'Wellness & Spa', 'Fitness & Recreation', 'Transport & Travel', 'In-Room & Concierge'];

  const filteredServices = services.filter(svc => {
    if (selectedCategory !== 'All' && svc.category !== selectedCategory) return false;
    return true;
  });

  const handleBookServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService) return;

    onAddToast({
      type: 'success',
      title: 'Service Booked & Confirmed',
      message: `${bookingService.name} booked for ${bookingDate} at ${bookingTime}. Staff notification sent.`,
    });

    setBookingService(null);
    setSpecialNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
            <Coffee className="w-5 h-5 text-indigo-600" />
            Hotel Amenities & Concierge Services Directory
          </h2>
          <p className="text-xs text-gray-500">
            Explore world-class spa treatments, wellness facilities, private transport, and personalized concierge requests.
          </p>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map(svc => (
          <div
            key={svc.id}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                  {svc.category}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-md">
                  {svc.price}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {svc.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1 text-[11px] text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Operating Hours: <strong>{svc.hours}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Availability: <strong>{svc.availability}</strong></span>
                  </div>
                  {svc.rules && (
                    <p className="text-[10px] text-gray-400 italic pt-0.5">{svc.rules}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setBookingService(svc)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{svc.actionType === 'book' ? 'Book Appointment / Time' : 'Request Service Pickup'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking / Request Modal */}
      <Modal isOpen={Boolean(bookingService)} onClose={() => setBookingService(null)} title={`Book / Request ${bookingService?.name}`}>
        <form onSubmit={handleBookServiceSubmit} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            {bookingService?.description}
          </p>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <p><strong>Pricing:</strong> {bookingService?.price}</p>
            <p><strong>Hours:</strong> {bookingService?.hours}</p>
            <p><strong>Fulfillment Window:</strong> ~{bookingService?.estimatedTime}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Preferred Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Preferred Time</label>
              <input
                type="time"
                value={bookingTime}
                onChange={e => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Number of Guests</label>
            <input
              type="number"
              min={1}
              max={8}
              value={guestsCount}
              onChange={e => setGuestsCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Special Preferences / Requests</label>
            <textarea
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder="e.g. Flight arrival number for transfer, preferred masseuse, garment fabric notes..."
              rows={3}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setBookingService(null)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Confirm Service Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
