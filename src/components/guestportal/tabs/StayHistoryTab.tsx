import React, { useState } from 'react';
import {
  Clock, Calendar, BedDouble, Download, RotateCcw, Star,
  CheckCircle2, DollarSign, FileText, ChevronRight, MessageSquare,
  Sparkles, AlertCircle, Send, X
} from 'lucide-react';
import type { PastStayRecord } from '../types';
import { Modal } from '../../ui/Modal';

interface StayHistoryTabProps {
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onRebookStay: (stay: PastStayRecord) => void;
}

export const StayHistoryTab: React.FC<StayHistoryTabProps> = ({ onAddToast, onRebookStay }) => {
  const [historyList, setHistoryList] = useState<PastStayRecord[]>([
    {
      id: 'STAY-901',
      bookingRef: 'LXP-2025-884',
      checkIn: '2025-11-10',
      checkOut: '2025-11-14',
      nights: 4,
      roomNumber: '305',
      roomType: 'Executive Suite',
      totalBill: 1420.00,
      status: 'Completed',
      servicesUsed: ['In-Room Dining ($180)', 'Lotus Spa Hydrotherapy ($140)', 'Airport S-Class ($85)'],
      paymentMethod: 'Corporate Visa ending in 9102',
      reviewGiven: {
        stars: 5,
        comment: 'Exceptional service, world-class staff and stunning view from floor 3.',
        createdAt: '2025-11-15',
      },
    },
    {
      id: 'STAY-902',
      bookingRef: 'LXP-2025-412',
      checkIn: '2025-06-02',
      checkOut: '2025-06-05',
      nights: 3,
      roomNumber: '204',
      roomType: 'Deluxe King',
      totalBill: 980.00,
      status: 'Completed',
      servicesUsed: ['Bistro Breakfast ($60)', 'Valet Parking ($45)'],
      paymentMethod: 'Amex Centurion',
    },
    {
      id: 'STAY-903',
      bookingRef: 'LXP-2024-902',
      checkIn: '2024-12-22',
      checkOut: '2024-12-27',
      nights: 5,
      roomNumber: 'PH-01',
      roomType: 'Presidential Penthouse',
      totalBill: 3750.00,
      status: 'Completed',
      servicesUsed: ['Private Chef Banquet ($850)', 'Yacht Excursion ($1,200)', 'Spa Packages ($400)'],
      paymentMethod: 'Wire Transfer / Corporate Folio',
      reviewGiven: {
        stars: 5,
        comment: 'Unforgettable holiday celebration. The concierge arranged everything seamlessly.',
        createdAt: '2024-12-28',
      },
    },
    {
      id: 'STAY-904',
      bookingRef: 'LXP-2024-118',
      checkIn: '2024-02-14',
      checkOut: '2024-02-16',
      nights: 2,
      roomNumber: '108',
      roomType: 'Deluxe Suite',
      totalBill: 0.00,
      status: 'Cancelled',
      servicesUsed: [],
      paymentMethod: 'Refunded in full to Amex (Policy window)',
    },
  ]);

  // Review Modal State
  const [reviewStay, setReviewStay] = useState<PastStayRecord | null>(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Invoice Modal State
  const [selectedInvoiceStay, setSelectedInvoiceStay] = useState<PastStayRecord | null>(null);

  const handleDownloadInvoice = (stay: PastStayRecord) => {
    const invoiceContent =
      `====================================================\n` +
      `LUXESTAY PALACE HOTEL - OFFICIAL TAX INVOICE & RECEIPT\n` +
      `====================================================\n` +
      `Invoice Ref: INV-${stay.bookingRef}\n` +
      `Booking Reference: ${stay.bookingRef}\n` +
      `Stay Period: ${stay.checkIn} to ${stay.checkOut} (${stay.nights} Nights)\n` +
      `Room Allocated: Room #${stay.roomNumber} (${stay.roomType})\n` +
      `Status: ${stay.status.toUpperCase()}\n` +
      `----------------------------------------------------\n` +
      `Services & Incidentals:\n` +
      stay.servicesUsed.map(s => ` - ${s}`).join('\n') + '\n' +
      `----------------------------------------------------\n` +
      `Total Settled: $${stay.totalBill.toFixed(2)}\n` +
      `Payment Method: ${stay.paymentMethod}\n` +
      `Receipt Certified at Front Office Cashier Counter #1\n` +
      `====================================================\n`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${stay.bookingRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    onAddToast({
      type: 'success',
      title: 'Invoice Downloaded',
      message: `Tax receipt for ${stay.bookingRef} downloaded.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewStay) return;

    setHistoryList(prev => prev.map(s => s.id === reviewStay.id ? {
      ...s,
      reviewGiven: {
        stars: reviewStars,
        comment: reviewComment || 'Wonderful hospitality and stay.',
        createdAt: new Date().toISOString().split('T')[0],
      }
    } : s));

    onAddToast({
      type: 'success',
      title: 'Review Published',
      message: `Thank you! Your feedback for stay ${reviewStay.bookingRef} was submitted to hotel management.`,
    });

    setReviewStay(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Previous Reservations & Stay History
          </h2>
          <p className="text-xs text-gray-500">
            Inspect all past visits, download historical receipts, rebook previous suites, and review your guest experience.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300">
          Total Past Stays: <strong>{historyList.filter(s => s.status === 'Completed').length}</strong>
        </span>
      </div>

      <div className="space-y-4">
        {historyList.map(stay => (
          <div
            key={stay.id}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">{stay.bookingRef}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stay.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {stay.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Room #{stay.roomNumber} · {stay.roomType} · {stay.nights} Nights
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Total Settled</p>
                <p className="text-base font-bold text-gray-900 dark:text-white font-mono">
                  ${stay.totalBill.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
              <div>
                <p className="text-gray-400">Stay Period</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                  {stay.checkIn} → {stay.checkOut}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Services Used</p>
                <p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5 truncate">
                  {stay.servicesUsed.length > 0 ? stay.servicesUsed.join(', ') : 'None'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Payment Account</p>
                <p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5 truncate">
                  {stay.paymentMethod}
                </p>
              </div>
            </div>

            {/* Existing Review or Leave Review */}
            {stay.reviewGiven ? (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/30 mb-4 flex items-start gap-2.5 text-xs">
                <div className="flex gap-0.5 mt-0.5 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < stay.reviewGiven!.stars
                          ? 'fill-blue-500 text-blue-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 italic">"{stay.reviewGiven.comment}"</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Submitted on {stay.reviewGiven.createdAt}</p>
                </div>
              </div>
            ) : stay.status === 'Completed' ? (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setReviewStay(stay)}
                  className="text-xs text-[#1e3a5f] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  Leave Guest Review & Feedback for this stay
                </button>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              {stay.status === 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(stay)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Download Tax Invoice</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRebookStay(stay)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rebook This Room ({stay.roomType})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <Modal isOpen={Boolean(reviewStay)} onClose={() => setReviewStay(null)} title={`Review Your Stay (${reviewStay?.bookingRef})`}>
        <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            How was your experience in <strong>{reviewStay?.roomType}</strong> (Room #{reviewStay?.roomNumber})?
          </p>

          <div>
            <label className="block text-xs font-semibold mb-2">Overall Satisfaction Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewStars(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= reviewStars ? 'fill-blue-500 text-blue-500' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Written Review</label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Tell other travelers and management about the comfort, cleanliness, and service..."
              rows={4}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setReviewStay(null)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
