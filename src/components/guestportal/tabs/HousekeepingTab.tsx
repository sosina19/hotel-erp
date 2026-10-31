import React, { useState } from 'react';
import {
  Sparkles, Clock, CheckCircle2, AlertCircle, X, Plus,
  Send, Bed, Waves, Trash2, Droplets, Moon, Coffee
} from 'lucide-react';
import type { GuestHousekeepingRequest } from '../types';
import { Modal } from '../../ui/Modal';

interface HousekeepingTabProps {
  roomNumber: string;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

const PRESET_REQUESTS = [
  { type: 'Clean my room' as const, label: 'Full Room Cleaning', icon: '🧹', desc: 'Thorough vacuum, dusting, surface sanitization, and room refresh.' },
  { type: 'Change bedsheets & linens' as const, label: 'Fresh Bedsheets & Linens', icon: '🛏️', desc: 'Change fitted sheets, duvet cover, and crisp pillowcases.' },
  { type: 'Replace towels & robes' as const, label: 'Replace Towels & Bathrobes', icon: '🛁', desc: 'Fresh plush Egyptian cotton bath sheets, hand towels, and mats.' },
  { type: 'Refill luxury toiletries' as const, label: 'Refill Luxury Toiletries', icon: '🧴', desc: 'Replenish shampoo, conditioner, body wash, lotion, and bath salts.' },
  { type: 'Empty trash & recycling' as const, label: 'Empty Trash & Recycling', icon: '🗑️', desc: 'Quick removal of bins and room waste.' },
  { type: 'Extra down pillows' as const, label: 'Extra Down Pillows', icon: '🪶', desc: 'Choice of goose down, memory foam, or hypoallergenic pillows.' },
  { type: 'Extra blankets / duvet' as const, label: 'Extra Blankets & Throws', icon: '❄️', desc: 'Cozy cashmere throw or heavier winter duvet.' },
  { type: 'Extra mineral water' as const, label: 'Extra Glass Mineral Water', icon: '💧', desc: 'Still or sparkling glass bottled water delivered to your bedside.' },
  { type: 'Turndown & room preparation' as const, label: 'Evening Turndown Service', icon: '🌙', desc: 'Bed turned down, curtains drawn, pillow mist, and artisan chocolates.' },
];

export const HousekeepingTab: React.FC<HousekeepingTabProps> = ({ roomNumber, onAddToast }) => {
  const [requests, setRequests] = useState<GuestHousekeepingRequest[]>([
    {
      id: 'HK-9921',
      requestType: 'Replace towels & robes',
      submittedAt: '12:40',
      status: 'Completed',
      assignedStaff: 'Elena (Floor 1 Lead)',
      estimatedMinutes: 0,
      customNotes: 'Two extra large bath sheets requested',
    },
    {
      id: 'HK-9922',
      requestType: 'Extra down pillows',
      submittedAt: '14:15',
      status: 'In Progress',
      assignedStaff: 'Carlos (Housekeeping)',
      estimatedMinutes: 10,
      customNotes: 'Firm memory foam if possible',
    }
  ]);

  // Modal State
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_REQUESTS[0] | null>(null);
  const [scheduledTime, setScheduledTime] = useState('Immediate (~15-20 min)');
  const [customNotes, setCustomNotes] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreset) return;

    const newReq: GuestHousekeepingRequest = {
      id: `HK-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType: selectedPreset.type,
      scheduledTime: scheduledTime !== 'Immediate (~15-20 min)' ? scheduledTime : undefined,
      customNotes: customNotes || undefined,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
      assignedStaff: 'Floor Attendant Dispatch',
      estimatedMinutes: 15,
    };

    setRequests(prev => [newReq, ...prev]);

    onAddToast({
      type: 'success',
      title: 'Housekeeping Request Logged',
      message: `${newReq.requestType} dispatched for Room #${roomNumber}. Housekeeping lead notified.`,
    });

    setSelectedPreset(null);
    setCustomNotes('');

    // Advance status to Accepted after 4 seconds
    setTimeout(() => {
      setRequests(cur => cur.map(r => r.id === newReq.id ? { ...r, status: 'Accepted' as const, assignedStaff: 'Elena (Floor 1 Attendant)' } : r));
    }, 4000);
  };

  const handleCancelRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' as const } : r));
    onAddToast({
      type: 'warning',
      title: 'Request Cancelled',
      message: `Housekeeping request ${id} cancelled.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Housekeeping Requests & Floor Service
          </h2>
          <p className="text-xs text-gray-500">
            Request fresh amenities, linen change, turndown, or full cleaning for Room #{roomNumber}.
          </p>
        </div>
      </div>

      {/* Preset Service Buttons Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Select Housekeeping Request
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PRESET_REQUESTS.map(preset => (
            <button
              key={preset.type}
              type="button"
              onClick={() => setSelectedPreset(preset)}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3.5 group"
            >
              <span className="text-2xl p-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl group-hover:scale-110 transition-transform">
                {preset.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {preset.label}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── LIVE HOUSEKEEPING STATUS TRACKER PIPELINE ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Track Housekeeping Requests (Room #{roomNumber})
          </h3>
          <span className="text-xs text-gray-400">Live Floor Dispatch</span>
        </div>

        {requests.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">No current housekeeping requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(req => {
              const steps = ['Submitted', 'Accepted', 'In Progress', 'Completed'];
              const currentStepIndex = steps.indexOf(req.status);

              return (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{req.id}</span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{req.requestType}</span>
                        <span className="text-[11px] text-gray-400">({req.submittedAt})</span>
                      </div>
                      {req.customNotes && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                          "{req.customNotes}"
                        </p>
                      )}
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Assigned Attendant: <strong>{req.assignedStaff}</strong>
                      </p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold self-start sm:self-center ${
                      req.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : req.status === 'In Progress'
                        ? 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/40 dark:text-blue-300'
                        : req.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 text-indigo-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Lifecycle Pipeline */}
                  {req.status !== 'Cancelled' ? (
                    <div>
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold mb-1.5">
                        {steps.map((st, i) => (
                          <span
                            key={st}
                            className={i <= currentStepIndex ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400'}
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden flex">
                        {steps.map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 transition-all duration-500 ${
                              i <= currentStepIndex ? 'bg-emerald-500' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 font-semibold">Request was cancelled before staff fulfillment.</p>
                  )}

                  {/* Cancel Option */}
                  {req.status === 'Submitted' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(req.id)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Cancel Pending Request
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal isOpen={Boolean(selectedPreset)} onClose={() => setSelectedPreset(null)} title={`Request ${selectedPreset?.label}`}>
        <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            {selectedPreset?.desc}
          </p>

          <div>
            <label className="block text-xs font-semibold mb-1">Preferred Time of Service</label>
            <select
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            >
              <option value="Immediate (~15-20 min)">Immediate (~15-20 minutes)</option>
              <option value="In 1 Hour">In 1 Hour</option>
              <option value="Scheduled: 14:00">Scheduled: 14:00 PM</option>
              <option value="Scheduled: 16:30">Scheduled: 16:30 PM</option>
              <option value="Evening Turndown (19:00)">Evening Turndown (19:00 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Specific Instructions / Notes</label>
            <textarea
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="e.g. Please do not disturb sleeping child, leave extra lavender pillow spray..."
              rows={3}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setSelectedPreset(null)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Dispatch Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
