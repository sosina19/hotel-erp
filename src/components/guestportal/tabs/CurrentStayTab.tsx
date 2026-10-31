import React, { useState } from 'react';
import {
  BedDouble, Calendar, Clock, DollarSign, Download, PhoneCall,
  Sparkles, CheckCircle2, ShieldCheck, ArrowRightLeft, Users,
  Coffee, Wifi, Car, FileText, Send, MessageSquare, AlertCircle,
  HelpCircle, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import type { GuestStayInfo } from '../types';
import { Modal } from '../../ui/Modal';

interface CurrentStayTabProps {
  stay: GuestStayInfo;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

export const CurrentStayTab: React.FC<CurrentStayTabProps> = ({ stay, onAddToast }) => {
  // Modals
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [extensionNights, setExtensionNights] = useState(2);
  const [extensionReason, setExtensionReason] = useState('Business meetings extended');

  const [isRoomChangeModalOpen, setIsRoomChangeModalOpen] = useState(false);
  const [changeReason, setChangeReason] = useState('Prefer higher floor with panoramic view');
  const [preferredType, setPreferredType] = useState('Executive Suite');

  const [isEarlyCheckoutModalOpen, setIsEarlyCheckoutModalOpen] = useState(false);
  const [earlyDepartureTime, setEarlyDepartureTime] = useState('11:00 AM');
  const [needPorter, setNeedPorter] = useState(true);

  const [isContactReceptionModalOpen, setIsContactReceptionModalOpen] = useState(false);
  const [receptionMessage, setReceptionMessage] = useState('');

  // Active room image carousel
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const handleDownloadConfirmation = () => {
    const confirmationText =
      `====================================================\n` +
      `LUXESTAY PALACE HOTEL - OFFICIAL BOOKING CONFIRMATION\n` +
      `====================================================\n` +
      `Booking Reference: ${stay.bookingRef}\n` +
      `Guest Name: ${stay.name} (Guest ID: ${stay.guestId})\n` +
      `Assigned Room: Room #${stay.room} - ${stay.roomType} (Floor ${stay.floor})\n` +
      `Check-In Date: ${stay.checkIn}\n` +
      `Expected Check-Out: ${stay.checkOut} (Total Nights: ${stay.nights})\n` +
      `Number of Guests: ${stay.adults} Adults, ${stay.children} Children\n` +
      `Payment Status: ${stay.paymentStatus}\n` +
      `Included Services: ${stay.includedServices.join(', ')}\n` +
      `Special Requests: ${stay.specialRequests}\n` +
      `Issued at: ${new Date().toLocaleString()}\n` +
      `====================================================\n`;

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Booking_Confirmation_${stay.bookingRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    onAddToast({
      type: 'success',
      title: 'Confirmation Voucher Downloaded',
      message: `Booking confirmation voucher for ${stay.bookingRef} downloaded.`,
    });
  };

  const handleRequestExtension = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExtensionModalOpen(false);
    onAddToast({
      type: 'info',
      title: 'Stay Extension Requested',
      message: `Request for +${extensionNights} additional night(s) submitted to Front Desk. The duty manager will notify you upon room allocation review.`,
    });
  };

  const handleRequestRoomChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRoomChangeModalOpen(false);
    onAddToast({
      type: 'info',
      title: 'Room Transfer Requested',
      message: `Transfer request to ${preferredType} submitted. Front office will review ready room inventory and contact you shortly.`,
    });
  };

  const handleRequestEarlyCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEarlyCheckoutModalOpen(false);
    onAddToast({
      type: 'info',
      title: 'Early Departure Notice Logged',
      message: `Front Desk alerted for checkout at ${earlyDepartureTime}. Luggage porter service flagged: ${needPorter ? 'YES' : 'NO'}.`,
    });
  };

  const handleSendMessageToReception = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receptionMessage.trim()) return;
    setIsContactReceptionModalOpen(false);
    setReceptionMessage('');
    onAddToast({
      type: 'success',
      title: 'Message Sent to Front Desk',
      message: 'Your message has been received by Counter #1 (Duty Agent Sarah Mitchell).',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── POLICY COMPLIANCE NOTICE ─── */}
      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong>Hotel Stay Policy:</strong> Direct room changes and date extensions require formal hotel approval to guarantee availability and security verification.
          </span>
        </div>
        <button
          onClick={handleDownloadConfirmation}
          className="flex-shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Room Showcase & Included Amenities */}
        <div className="lg:col-span-7 space-y-5">
          {/* Room Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs">
            <div className="relative h-64 sm:h-72 bg-gray-900">
              <img
                src={stay.roomImages[activeImgIndex] || stay.roomImages[0]}
                alt={stay.roomType}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  Room #{stay.room}
                </span>
                <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  {stay.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-xl">
                  {stay.roomImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-10 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImgIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
                <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl">
                  Floor {stay.floor} · Ocean Wing
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                  {stay.roomType}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  High-floor sanctuary featuring panoramic sea views, bespoke Italian furnishings, and lavish marble bathroom with standalone soaking tub.
                </p>
              </div>

              {/* Room Amenities Badges */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Room Amenities</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {stay.roomAmenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Included Services */}
              <div className="pt-3 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Included In Your Rate</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  {stay.includedServices.map((svc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Stay Parameters & Guest Request Hub */}
        <div className="lg:col-span-5 space-y-5">
          {/* Reservation Breakdown Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-gray-500 border-b pb-3">
              Accommodation Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Booking Reference</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{stay.bookingRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Check-in Date</span>
                <span className="font-bold text-gray-900 dark:text-white">{stay.checkIn} (from 14:00)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Expected Checkout</span>
                <span className="font-bold text-gray-900 dark:text-white">{stay.checkOut} (until 12:00)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Total Duration</span>
                <span className="font-bold text-gray-900 dark:text-white">{stay.nights} Nights ({stay.nightsRemaining} Nights Remaining)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Registered Occupants</span>
                <span className="font-bold text-gray-900 dark:text-white">{stay.adults} Adults, {stay.children} Children</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stay.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Special Booking Notes</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[180px] truncate">{stay.specialRequests}</span>
              </div>
            </div>
          </div>

          {/* Interactive Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Stay Adjustments & Requests
            </h4>

            <button
              onClick={() => setIsExtensionModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Request Stay Extension</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setIsRoomChangeModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                <span>Request Room Change or Upgrade</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setIsEarlyCheckoutModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Request Early Departure / Checkout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setIsContactReceptionModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 text-xs font-bold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Message Front Desk Reception</span>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Extension Modal */}
      <Modal isOpen={isExtensionModalOpen} onClose={() => setIsExtensionModalOpen(false)} title="Request Stay Extension">
        <form onSubmit={handleRequestExtension} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            Current Checkout Date: <strong>{stay.checkOut}</strong>. Extensions are subject to suite availability and room inventory approval.
          </p>
          <div>
            <label className="block text-xs font-semibold mb-1">Additional Nights</label>
            <select
              value={extensionNights}
              onChange={e => setExtensionNights(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            >
              <option value={1}>+1 Night (until Nov 03, 2026)</option>
              <option value={2}>+2 Nights (until Nov 04, 2026)</option>
              <option value={3}>+3 Nights (until Nov 05, 2026)</option>
              <option value={5}>+5 Nights (until Nov 07, 2026)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Reason for Extension</label>
            <textarea
              value={extensionReason}
              onChange={e => setExtensionReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsExtensionModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
              Submit Extension Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Room Change Modal */}
      <Modal isOpen={isRoomChangeModalOpen} onClose={() => setIsRoomChangeModalOpen(false)} title="Request Room Change / Transfer">
        <form onSubmit={handleRequestRoomChange} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            Room transfers require Front Office review and housekeeping inspection before luggage transfer.
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Preferred Room Type / Category</label>
            <select
              value={preferredType}
              onChange={e => setPreferredType(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            >
              <option value="Executive Suite">Executive Suite (Floor 3 or higher)</option>
              <option value="Presidential Penthouse">Presidential Penthouse</option>
              <option value="Deluxe King (Garden Wing)">Deluxe King (Quiet Garden Wing)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Reason for Request</label>
            <textarea
              value={changeReason}
              onChange={e => setChangeReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsRoomChangeModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold">
              Submit Transfer Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Early Checkout Modal */}
      <Modal isOpen={isEarlyCheckoutModalOpen} onClose={() => setIsEarlyCheckoutModalOpen(false)} title="Request Early Departure / Checkout">
        <form onSubmit={handleRequestEarlyCheckout} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Desired Departure Time Today</label>
            <input
              type="text"
              value={earlyDepartureTime}
              onChange={e => setEarlyDepartureTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="porterCheck"
              checked={needPorter}
              onChange={e => setNeedPorter(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="porterCheck" className="text-xs font-medium cursor-pointer">
              Request Bellman & Luggage Assistance to Driveway
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsEarlyCheckoutModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold">
              Confirm Departure Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Message Reception Modal */}
      <Modal isOpen={isContactReceptionModalOpen} onClose={() => setIsContactReceptionModalOpen(false)} title="Send Message to Front Desk Counter">
        <form onSubmit={handleSendMessageToReception} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            Duty Agent: <strong>{stay.server}</strong> (Front Desk Terminal FD-01). Instant notification delivered to desk console.
          </p>
          <textarea
            value={receptionMessage}
            onChange={e => setReceptionMessage(e.target.value)}
            placeholder="Type your message, inquiry, or special preference here..."
            className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            rows={4}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsContactReceptionModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
