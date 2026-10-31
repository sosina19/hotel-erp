import React, { useState, useRef } from 'react';
import {
  Wrench, AlertTriangle, Clock, CheckCircle2, Camera, Upload,
  Zap, Droplets, Wifi, Lock, Bed, ShowerHead, HelpCircle,
  Send, X, Sparkles, ShieldAlert, ArrowRightLeft
} from 'lucide-react';
import type { GuestMaintenanceRequest } from '../types';
import { Modal } from '../../ui/Modal';

interface MaintenanceTabProps {
  roomNumber: string;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onRequestRoomRelocation: () => void;
}

const ISSUE_CATEGORIES = [
  { id: 'Air conditioning' as const, label: 'Air Conditioning & Climate', icon: '❄️' },
  { id: 'Television & Media' as const, label: 'Television & Entertainment', icon: '📺' },
  { id: 'Water leakage & Plumbing' as const, label: 'Water Leakage & Plumbing', icon: '🚿' },
  { id: 'Electrical & Outlets' as const, label: 'Electrical & Power Outlets', icon: '⚡' },
  { id: 'Broken furniture' as const, label: 'Furniture & Fixtures', icon: '🪑' },
  { id: 'Bathroom & Shower' as const, label: 'Bathroom Equipment & Hot Water', icon: '🛁' },
  { id: 'Wi-Fi & Connectivity' as const, label: 'Wi-Fi & Network Connection', icon: '📶' },
  { id: 'Door lock & RFID' as const, label: 'Electronic Door Lock / RFID', icon: '🔐' },
  { id: 'Lighting & Bulbs' as const, label: 'Lighting & Reading Lamps', icon: '💡' },
];

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  roomNumber,
  onAddToast,
  onRequestRoomRelocation,
}) => {
  const [requests, setRequests] = useState<GuestMaintenanceRequest[]>([
    {
      id: 'WO-8102',
      category: 'Air conditioning',
      description: 'AC unit blowing ambient air instead of cool air; thermostat display showing error E3.',
      roomNumber,
      reportedAt: '11:15 AM',
      priority: 'Urgent',
      status: 'In Progress',
      assignedTechnician: 'Marcus Vance (HVAC Lead)',
      staffResponse: 'Technician Marcus is on site checking compressor and refrigerant levels.',
    },
    {
      id: 'WO-8041',
      category: 'Lighting & Bulbs',
      description: 'Bedside reading lamp bulb flickers intermittently.',
      roomNumber,
      reportedAt: 'Yesterday 18:20',
      priority: 'Normal',
      status: 'Resolved',
      assignedTechnician: 'Carlos Mendez (Electrician)',
      staffResponse: 'LED bulb and dimmer switch replaced.',
      resolutionTime: 'Yesterday 18:45',
    }
  ]);

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GuestMaintenanceRequest['category']>('Air conditioning');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      onAddToast({ type: 'info', title: 'Photo Attached', message: `${file.name} attached to maintenance ticket.` });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      onAddToast({ type: 'warning', title: 'Description Required', message: 'Please describe the problem.' });
      return;
    }

    const newTicket: GuestMaintenanceRequest = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      description,
      photoUrl: photoUrl || undefined,
      roomNumber,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority,
      status: 'Submitted',
      assignedTechnician: 'Duty Engineering Dispatch',
      staffResponse: 'Ticket received by engineering team. Technician dispatch pending.',
    };

    setRequests(prev => [newTicket, ...prev]);

    onAddToast({
      type: 'success',
      title: 'Maintenance Work Order Logged',
      message: `Work Order ${newTicket.id} registered for Room #${roomNumber}. Priority: ${priority.toUpperCase()}.`,
    });

    setIsReportModalOpen(false);
    setDescription('');
    setPhotoUrl(null);
    setPriority('Normal');

    // Simulate lifecycle update: Submitted -> Assigned
    setTimeout(() => {
      setRequests(cur => cur.map(t => t.id === newTicket.id ? {
        ...t,
        status: 'Assigned' as const,
        assignedTechnician: 'Marcus Vance (Lead Technician)',
        staffResponse: 'Marcus Vance has been assigned and is heading to Room #' + roomNumber + ' with diagnostic tools (ETA: 12 min).',
      } : t));
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            Maintenance & Engineering Assistance
          </h2>
          <p className="text-xs text-gray-500">
            Report hardware, electrical, climate, or plumbing issues in Room #{roomNumber} for rapid technician response.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          Report Maintenance Problem
        </button>
      </div>

      {/* Alternative Room Relocation Banner for Severe Problems */}
      <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#1e3a5f] dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#1e3a5f] dark:text-blue-200">
            <p className="font-bold text-sm">Facing an unresolvable or severe room disruption?</p>
            <p className="text-blue-900/80 dark:text-blue-300/80 mt-0.5">
              If a major issue (water leak, power failure, AC failure) cannot be resolved swiftly, the Front Desk will immediately arrange an upgrade or alternative suite relocation for your comfort.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestRoomRelocation}
          className="flex-shrink-0 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Request Urgent Room Transfer
        </button>
      </div>

      {/* ─── LIVE WORK ORDER STATUS PIPELINE ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Track Maintenance Work Orders (Room #{roomNumber})
          </h3>
          <span className="text-xs text-gray-400">Engineering SLA Live Monitor</span>
        </div>

        <div className="space-y-4">
          {requests.map(ticket => {
            const steps = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
            const currentStepIndex = steps.indexOf(ticket.status);

            return (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{ticket.id}</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{ticket.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.priority === 'Emergency'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : ticket.priority === 'Urgent'
                          ? 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                      <span className="text-[11px] text-gray-400">({ticket.reportedAt})</span>
                    </div>

                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {ticket.description}
                    </p>

                    {ticket.assignedTechnician && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Assigned Specialist: <strong>{ticket.assignedTechnician}</strong>
                      </p>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                    ticket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : ticket.status === 'In Progress'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                      : 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/40 dark:text-blue-300'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                {/* Photo preview if attached */}
                {ticket.photoUrl && (
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 inline-block">
                    <img src={ticket.photoUrl} alt="Problem Attachment" className="h-20 rounded-lg object-cover" />
                  </div>
                )}

                {/* Staff Response Note */}
                {ticket.staffResponse && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                    <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Engineering Dispatch Update:
                    </p>
                    <p>{ticket.staffResponse}</p>
                    {ticket.resolutionTime && (
                      <p className="text-[10px] text-gray-400">Completed at: {ticket.resolutionTime}</p>
                    )}
                  </div>
                )}

                {/* 4-Step Pipeline: Submitted -> Assigned -> In Progress -> Resolved */}
                <div>
                  <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold mb-1.5">
                    {steps.map((st, i) => (
                      <span
                        key={st}
                        className={i <= currentStepIndex ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400'}
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
                          i <= currentStepIndex ? 'bg-indigo-600' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Problem Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Report Maintenance Issue">
        <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div>
            <label className="block text-xs font-semibold mb-1">Issue Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            >
              {ISSUE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Detailed Problem Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what is broken, abnormal sounds, leaks, or error codes..."
              rows={4}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              >
                <option value="Normal">Normal (within 1 hour)</option>
                <option value="Urgent">Urgent (within 30 mins)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Attach Photo (Optional)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border border-dashed rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-500" />
                <span>{photoUrl ? 'Photo Attached ✓' : 'Upload Image / Camera'}</span>
              </button>
            </div>
          </div>

          {photoUrl && (
            <div className="relative inline-block">
              <img src={photoUrl} alt="Attachment" className="h-16 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Dispatch Work Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
