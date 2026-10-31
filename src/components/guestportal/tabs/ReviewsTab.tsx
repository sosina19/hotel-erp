import React, { useState } from 'react';
import {
  Star, MessageSquare, ShieldCheck, CheckCircle2, AlertTriangle,
  Award, Send, ThumbsUp, Heart, Building, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import type { GuestStayInfo, StayReview } from '../types';

interface ReviewsTabProps {
  stay: GuestStayInfo;
}

type ReviewsSubTab = 'submit' | 'history' | 'management';

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ stay }) => {
  const [subTab, setSubTab] = useState<ReviewsSubTab>('submit');

  // Star ratings state for 5 categories
  const [overallRating, setOverallRating] = useState<number>(5);
  const [roomRating, setRoomRating] = useState<number>(5);
  const [restaurantRating, setRestaurantRating] = useState<number>(5);
  const [housekeepingRating, setHousekeepingRating] = useState<number>(5);
  const [staffRating, setStaffRating] = useState<number>(5);

  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [reportedDissatisfaction, setReportedDissatisfaction] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReviewSuccess, setSubmittedReviewSuccess] = useState<boolean>(false);

  // Reviews history with official management responses
  const [reviewsList, setReviewsList] = useState<StayReview[]>([
    {
      id: 'REV-001',
      bookingRef: 'LXP-2025-REF-B',
      stayDates: 'Aug 3 – Aug 8, 2026',
      roomNumber: '204 (Executive Suite)',
      overallRating: 5,
      roomRating: 5,
      restaurantRating: 5,
      housekeepingRating: 5,
      staffRating: 5,
      writtenFeedback: 'Exceptional hospitality. Sarah Mitchell and the concierge team made our anniversary unforgettable. The sommelier wine pairing at Le Cirque was world class.',
      submittedAt: '2026-08-09 10:30',
      managementResponse: {
        respondedBy: 'Marcus Sterling (General Manager)',
        responseDate: '2026-08-09 14:15',
        message: 'Dear Lord Worthington, It was our absolute privilege to host you and Lady Worthington for your anniversary. We have shared your kind compliments with Sarah and the culinary brigade.',
      },
    },
    {
      id: 'REV-002',
      bookingRef: 'LXP-2025-REF-C',
      stayDates: 'Jun 12 – Jun 14, 2026',
      roomNumber: '310 (Junior Suite)',
      overallRating: 4,
      roomRating: 4,
      restaurantRating: 5,
      housekeepingRating: 4,
      staffRating: 5,
      writtenFeedback: 'Delightful brief stay. High-speed Wi-Fi was seamless for global conference calls. Balcony view over the courtyard was tranquil.',
      reportedDissatisfaction: 'Air conditioning unit had a faint vibration on the highest fan mode during the first evening.',
      submittedAt: '2026-06-15 16:45',
      managementResponse: {
        respondedBy: 'David Vance (Director of Engineering)',
        responseDate: '2026-06-16 09:20',
        message: 'Thank you for your valuable feedback, Lord Worthington. Our engineering team immediately inspected room 310 and recalibrated the acoustic dampener on the HVAC unit.',
      },
    },
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: StayReview = {
        id: `REV-00${reviewsList.length + 1}`,
        bookingRef: stay.bookingRef,
        stayDates: `${stay.checkIn} – ${stay.checkOut}`,
        roomNumber: `#${stay.room} (${stay.roomType})`,
        overallRating,
        roomRating,
        restaurantRating,
        housekeepingRating,
        staffRating,
        writtenFeedback,
        reportedDissatisfaction: reportedDissatisfaction.trim() || undefined,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      setReviewsList(prev => [newReview, ...prev]);
      setIsSubmitting(false);
      setSubmittedReviewSuccess(true);
      setSubTab('history');
    }, 1000);
  };

  const renderStarSelector = (value: number, onChange: (val: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? 'fill-blue-400 text-blue-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
        {value === 5 ? '5.0 - Exceptional' : value === 4 ? '4.0 - Very Good' : value === 3 ? '3.0 - Satisfactory' : `${value}.0`}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-[#1e3a5f] to-gray-900 text-white rounded-2xl p-6 sm:p-7 shadow-luxury border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Resident Feedback</span>
              </span>
              <span className="text-xs text-gray-400">
                Tied to Stay: <strong className="text-white font-mono">{stay.bookingRef}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Stay Reviews & Quality Feedback
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Authentic multi-category ratings and direct responses from the General Manager and department heads.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[200px] text-center">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider block">
              Hotel Lifetime Score
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Star className="w-5 h-5 fill-blue-400 text-blue-400" />
              <span className="text-2xl font-extrabold text-white">4.9</span>
              <span className="text-xs text-gray-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-blue-300 font-bold block mt-0.5">
              Top 1% Luxury Hospitality Tier
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setSubTab('submit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'submit'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-blue-500" />
          <span>Rate Current Stay (Room #{stay.room})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          <span>Verified Reviews & Feedback ({reviewsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('management')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'management'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-emerald-500" />
          <span>Management Responses ({reviewsList.filter(r => r.managementResponse).length})</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: SUBMIT STAY REVIEW */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'submit' && (
        <div className="card p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>Multi-Category Guest Satisfaction Evaluation</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Verified review tied to booking reference <strong>{stay.bookingRef}</strong> for Room #{stay.room}.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* 5 Rating Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1.5">
                  1. Overall Stay Experience
                </label>
                {renderStarSelector(overallRating, setOverallRating)}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1.5">
                  2. Room Comfort & Cleanliness
                </label>
                {renderStarSelector(roomRating, setRoomRating)}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1.5">
                  3. Restaurant & Dining Quality
                </label>
                {renderStarSelector(restaurantRating, setRestaurantRating)}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1.5">
                  4. Housekeeping & Amenities
                </label>
                {renderStarSelector(housekeepingRating, setHousekeepingRating)}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1.5">
                  5. Front Desk & Concierge Staff Service
                </label>
                {renderStarSelector(staffRating, setStaffRating)}
              </div>
            </div>

            {/* Written Feedback Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Written Feedback & Highlights
              </label>
              <textarea
                required
                rows={4}
                value={writtenFeedback}
                onChange={e => setWrittenFeedback(e.target.value)}
                placeholder="Share your experience regarding room comfort, dining, amenities, or staff assistance..."
                className="input-field text-xs resize-none"
              />
            </div>

            {/* Report Dissatisfaction / Grievance (Optional) */}
            <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Report Dissatisfaction or Specific Issue (Optional)</span>
              </label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Any issues reported here trigger an immediate notification directly to the General Manager's executive desk.
              </p>
              <textarea
                rows={2}
                value={reportedDissatisfaction}
                onChange={e => setReportedDissatisfaction(e.target.value)}
                placeholder="Did anything fail to meet your expectations during your stay?"
                className="input-field text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !writtenFeedback.trim()}
              className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#2b5182] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <Send className="w-4 h-4" />
              <span>Submit Verified Review & Quality Survey</span>
            </button>
          </form>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: VERIFIED REVIEWS HISTORY */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'history' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Verified Resident Review History
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Every review is strictly authenticated against an actual booking reference to ensure credibility.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Total Published: {reviewsList.length}
            </span>
          </div>

          <div className="space-y-4">
            {reviewsList.map(review => (
              <div key={review.id} className="card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#1e3a5f] dark:text-blue-400">
                        {review.bookingRef}
                      </span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Room {review.roomNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold">
                        ✓ Verified Stay
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{review.stayDates} · Submitted on {review.submittedAt}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <span className="text-sm font-bold text-[#1e3a5f] dark:text-blue-300 font-mono">
                      {review.overallRating}.0
                    </span>
                    <span className="text-[10px] text-[#1e3a5f] dark:text-blue-400">Overall</span>
                  </div>
                </div>

                {/* Category breakdown pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span className="font-bold">{review.roomRating} / 5</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg flex justify-between">
                    <span className="text-gray-500">Dining:</span>
                    <span className="font-bold">{review.restaurantRating} / 5</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg flex justify-between">
                    <span className="text-gray-500">Housekeeping:</span>
                    <span className="font-bold">{review.housekeepingRating} / 5</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg flex justify-between">
                    <span className="text-gray-500">Staff:</span>
                    <span className="font-bold">{review.staffRating} / 5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{review.writtenFeedback}"
                </p>

                {review.reportedDissatisfaction && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                    <strong>Reported Issue:</strong> {review.reportedDissatisfaction}
                  </div>
                )}

                {/* Management Response */}
                {review.managementResponse && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#1e3a5f] dark:text-blue-400 font-bold">
                      <span>Official Response from {review.managementResponse.respondedBy}</span>
                      <span className="text-gray-400 font-normal">{review.managementResponse.responseDate}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.managementResponse.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: MANAGEMENT RESPONSES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'management' && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Executive Leadership Responses & Action Plans
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Direct answers and proactive resolutions provided by the General Manager and directors.
            </p>
          </div>

          <div className="space-y-3">
            {reviewsList.filter(r => r.managementResponse).map(r => (
              <div key={r.id} className="card p-5 space-y-3 border-l-4 border-l-[#1e3a5f]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#1e3a5f] dark:text-blue-400" />
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      {r.managementResponse!.respondedBy}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">{r.managementResponse!.responseDate}</span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-xs text-gray-600 dark:text-gray-400">
                  <strong>Referencing Stay:</strong> {r.bookingRef} (Room {r.roomNumber})
                </div>

                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                  "{r.managementResponse!.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};