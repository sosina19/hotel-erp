import React, { useState } from 'react';
import {
  MessageSquareWarning, Plus, CheckCircle2, AlertCircle, Clock,
  Send, User, Phone, Check, X, ShieldAlert, Sparkles, Filter,
  Search, Coffee, Shirt, BellRing, Baby, HelpCircle, Utensils, ArrowLeft
} from 'lucide-react';
import type { ServiceRequestTicket, InHouseResident } from '../types';
import { Modal } from '../../ui/Modal';

interface GuestServicesDeskProps {
  tickets: ServiceRequestTicket[];
  residents: InHouseResident[];
  onAddTicket: (ticket: ServiceRequestTicket) => void;
  onUpdateTicket: (id: string, updates: Partial<ServiceRequestTicket>) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const GuestServicesDesk: React.FC<GuestServicesDeskProps> = ({
  tickets,
  residents,
  onAddTicket,
  onUpdateTicket,
  onAddToast,
  onBack,
}) => {
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Request Modal
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState(residents[0]?.id || '');
  const [customRoom, setCustomRoom] = useState('');
  const [customGuest, setCustomGuest] = useState('');
  const [department, setDepartment] = useState<ServiceRequestTicket['department']>('Housekeeping');
  const [category, setCategory] = useState('Extra towels');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ServiceRequestTicket['priority']>('High');
  const [isComplaint, setIsComplaint] = useState(false);
  const [complaintSeverity, setComplaintSeverity] = useState<'Low' | 'Medium' | 'High' | 'Severe'>('Medium');

  // Cancel/Reject Modal State
  const [actionTicket, setActionTicket] = useState<{ ticket: ServiceRequestTicket; action: 'Cancelled' | 'Rejected' } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  // Resolution Notes Modal State
  const [resolveTicket, setResolveTicket] = useState<ServiceRequestTicket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [recoveryComp, setRecoveryComp] = useState('None');

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    if (filterDept !== 'all' && t.department !== filterDept) return false;
    if (filterStatus === 'pending' && t.status !== 'Pending') return false;
    if (filterStatus === 'active' && (t.status === 'Completed' || t.status === 'Cancelled' || t.status === 'Rejected')) return false;
    if (filterStatus === 'complaints' && !t.isComplaint) return false;
    if (filterStatus === 'completed' && t.status !== 'Completed') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.guestName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const activeCount = tickets.filter(t => t.status === 'Pending' || t.status === 'Assigned' || t.status === 'In Progress').length;
  const complaintsCount = tickets.filter(t => t.isComplaint && t.status !== 'Completed').length;

  // Preset Handlers
  const handleApplyPreset = (cat: string, dept: ServiceRequestTicket['department'], desc: string) => {
    setCategory(cat);
    setDepartment(dept);
    setDescription(desc);
  };

  // Submit New Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find(r => r.id === selectedResidentId);
    const roomNum = res ? res.roomNumber : customRoom || '101';
    const guestName = res ? res.guestName : customGuest || 'In-House Guest';

    const newTicket: ServiceRequestTicket = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      roomNumber: roomNum,
      guestName,
      guestPhone: res?.phone,
      guestEmail: res?.email,
      department,
      category,
      description: description || `Request for ${category}`,
      priority,
      status: 'Pending',
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isComplaint,
      complaintSeverity: isComplaint ? complaintSeverity : undefined,
    };

    onAddTicket(newTicket);
    onAddToast({
      type: isComplaint ? 'warning' : 'success',
      title: isComplaint ? 'Guest Complaint Logged' : 'Service Request Logged',
      message: `${newTicket.category} ticket created for Room #${newTicket.roomNumber}. Assigned to ${newTicket.department}.`,
    });

    setIsNewRequestModalOpen(false);
    setDescription('');
    setIsComplaint(false);
  };

  // 8. Notify Guest
  const handleNotifyGuest = (t: ServiceRequestTicket) => {
    onUpdateTicket(t.id, { guestNotified: true });
    onAddToast({
      type: 'info',
      title: '8. Guest Notification Dispatched',
      message: `SMS/Email notification sent to ${t.guestName} regarding ${t.category}: "Your request is currently ${t.status} with our ${t.department} team."`,
    });
  };

  // Advance Status (Pending -> Assigned -> In Progress -> Completed)
  const handleAdvanceStatus = (t: ServiceRequestTicket) => {
    if (t.status === 'Pending') {
      onUpdateTicket(t.id, {
        status: 'Assigned',
        assignedStaff: t.department === 'Housekeeping' ? 'Maria (Floor Lead)' : t.department === 'F&B' ? 'Chef Antoine' : 'Duty Staff',
      });
      onAddToast({ type: 'info', title: 'Request Assigned', message: `Ticket assigned to duty staff.` });
    } else if (t.status === 'Assigned') {
      onUpdateTicket(t.id, { status: 'In Progress' });
      onAddToast({ type: 'info', title: 'Request In Progress', message: `Staff is fulfilling the request.` });
    } else if (t.status === 'In Progress') {
      setResolveTicket(t);
    }
  };

  // Submit Completion Notes
  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveTicket) return;

    onUpdateTicket(resolveTicket.id, {
      status: 'Completed',
      completionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completionNotes: resolutionNotes || 'Fulfilled to guest satisfaction',
      serviceRecoveryComp: recoveryComp !== 'None' ? recoveryComp : undefined,
    });

    onAddToast({
      type: 'success',
      title: '6. Request Fulfilled & Logged',
      message: `Ticket ${resolveTicket.id} marked Completed. Guest notified.`,
    });

    setResolveTicket(null);
    setResolutionNotes('');
    setRecoveryComp('None');
  };

  // Submit Cancel/Reject Reason
  const handleCancelRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTicket) return;

    if (actionTicket.action === 'Cancelled') {
      onUpdateTicket(actionTicket.ticket.id, {
        status: 'Cancelled',
        cancelReason: reasonInput || 'Cancelled by guest request',
      });
      onAddToast({ type: 'warning', title: 'Request Cancelled', message: `Ticket marked as Cancelled.` });
    } else {
      onUpdateTicket(actionTicket.ticket.id, {
        status: 'Rejected',
        rejectionReason: reasonInput || 'Service unavailable at requested hour',
      });
      onAddToast({ type: 'error', title: 'Request Rejected', message: `Ticket marked as Rejected with reason.` });
    }

    setActionTicket(null);
    setReasonInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Return to previous screen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-indigo-600" />
              Guest Requests & Service Coordination Central
            </h2>
            <p className="text-xs text-gray-500">
              Front Office is the central point for all guest requests, department routing, notifications, and complaint recovery.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 2. Create Service Request
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setFilterStatus('pending')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'pending' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 block">7. Pending Intake</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{pendingCount}</p>
          <span className="text-[10px] text-gray-500">Awaiting department dispatch</span>
        </div>

        <div
          onClick={() => setFilterStatus('active')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'active' ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">5. Active in Pipeline</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{activeCount}</p>
          <span className="text-[10px] text-gray-500">Assigned / In Progress</span>
        </div>

        <div
          onClick={() => setFilterStatus('complaints')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'complaints' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400 block">9. Guest Complaints</span>
          <p className="text-2xl font-black text-red-600 mt-1">{complaintsCount}</p>
          <span className="text-[10px] text-red-500">Service recovery required</span>
        </div>

        <div
          onClick={() => setFilterStatus('completed')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">6. Completed Today</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{tickets.filter(t => t.status === 'Completed').length}</p>
          <span className="text-[10px] text-emerald-600">Fulfilled to satisfaction</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="all">3. All Departments</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
            <option value="F&B">Food & Beverage</option>
            <option value="Front Desk">Front Desk</option>
            <option value="Concierge">Concierge</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Request Statuses</option>
            <option value="pending">Pending Intake</option>
            <option value="active">Active Pipeline</option>
            <option value="complaints">Guest Complaints</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ticket, room, or guest..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => {
          const isPending = ticket.status === 'Pending';
          const isAssigned = ticket.status === 'Assigned';
          const isInProgress = ticket.status === 'In Progress';
          const isCompleted = ticket.status === 'Completed';
          const isCancelled = ticket.status === 'Cancelled';
          const isRejected = ticket.status === 'Rejected';

          return (
            <div
              key={ticket.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
                ticket.isComplaint
                  ? 'border-red-300 dark:border-red-900/60 ring-2 ring-red-400/10'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                      ticket.department === 'Housekeeping'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : ticket.department === 'F&B'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : ticket.department === 'Maintenance'
                        ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    }`}
                  >
                    {ticket.category.includes('towel') || ticket.category.includes('cleaning') ? <Sparkles className="w-5 h-5" /> :
                     ticket.category.includes('Dining') || ticket.category.includes('Food') ? <Coffee className="w-5 h-5" /> :
                     ticket.category.includes('laundry') ? <Shirt className="w-5 h-5" /> :
                     ticket.category.includes('wake-up') ? <BellRing className="w-5 h-5" /> :
                     ticket.category.includes('cot') ? <Baby className="w-5 h-5" /> :
                     <MessageSquareWarning className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{ticket.id}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        Room #{ticket.roomNumber} ({ticket.guestName}) · {ticket.category}
                      </span>
                      {ticket.isComplaint && (
                        <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          COMPLAINT: {ticket.complaintSeverity}
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Dept: {ticket.department}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{ticket.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <span>Logged at {ticket.loggedAt}</span>
                      {ticket.assignedStaff && <span>Assigned to: <strong>{ticket.assignedStaff}</strong></span>}
                      {ticket.completionTime && (
                        <span className="text-emerald-600 font-semibold">
                          Completed at {ticket.completionTime} ({ticket.completionNotes})
                        </span>
                      )}
                      {ticket.cancelReason && <span className="text-amber-600">Cancelled: {ticket.cancelReason}</span>}
                      {ticket.rejectionReason && <span className="text-red-600">Rejected: {ticket.rejectionReason}</span>}
                      {ticket.serviceRecoveryComp && (
                        <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded">
                          Recovery: {ticket.serviceRecoveryComp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex flex-col sm:flex-row items-end md:items-center gap-2">
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase block ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : isCancelled
                          ? 'bg-gray-100 text-gray-600'
                          : isRejected
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}
                    >
                      5. {ticket.status}
                    </span>
                  </div>

                  {/* Actions for Active Tickets */}
                  {!isCompleted && !isCancelled && !isRejected && (
                    <div className="flex items-center gap-1.5">
                      {/* 8. Notify Guest Button */}
                      <button
                        onClick={() => handleNotifyGuest(ticket)}
                        title="8. Send status notification to guest via SMS/Email"
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 ${
                          ticket.guestNotified
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200'
                        }`}
                      >
                        <Send className="w-3 h-3 text-indigo-500" />
                        <span className="hidden sm:inline">Notify Guest</span>
                      </button>

                      {/* Advance Status Button */}
                      <button
                        onClick={() => handleAdvanceStatus(ticket)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        {isPending ? 'Assign →' : isAssigned ? 'Start →' : 'Complete ✓'}
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={() => setActionTicket({ ticket, action: 'Cancelled' })}
                        title="Cancel Request"
                        className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => setActionTicket({ ticket, action: 'Rejected' })}
                        title="Reject Request"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pipeline Visualizer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[10px] text-gray-400">
                <span className="font-mono">
                  Lifecycle: <strong>Pending</strong> → <strong>Assigned</strong> → <strong>In Progress</strong> → <strong>Completed</strong>
                </span>
                <span>Priority: <strong className="uppercase text-gray-700 dark:text-gray-300">{ticket.priority}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODAL 1: CREATE SERVICE REQUEST & COMPLAINTS ─── */}
      <Modal isOpen={isNewRequestModalOpen} onClose={() => setIsNewRequestModalOpen(false)} title="2. Create Guest Service Request / Complaint">
        <form onSubmit={handleCreateRequest} className="space-y-4">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">Common Request Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Extra Towels', dept: 'Housekeeping', desc: 'Guest requested 2 extra bath sheets and hand towels.' },
                { label: 'Room Cleaning', dept: 'Housekeeping', desc: 'Mid-stay refresher cleaning requested.' },
                { label: 'Airport Pickup', dept: 'Concierge', desc: 'Schedule private airport chauffeur pickup.' },
                { label: 'Express Laundry', dept: 'Housekeeping', desc: 'Pick up laundry bag for same-day dry cleaning.' },
                { label: 'Wake-Up Call', dept: 'Front Desk', desc: 'Automated morning telephone wake-up call at 07:00 AM.' },
                { label: 'Baby Cot', dept: 'Housekeeping', desc: 'Deliver infant crib/baby cot with bedding.' },
                { label: 'Report Missing Item', dept: 'Front Desk', desc: 'Guest reports misplaced sunglasses in restaurant.' },
              ].map(preset => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset.label, preset.dept as any, preset.desc)}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Select In-House Resident *</label>
              <select
                value={selectedResidentId}
                onChange={e => setSelectedResidentId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                {residents.map(r => (
                  <option key={r.id} value={r.id}>
                    Room #{r.roomNumber} - {r.guestName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">3. Department Assignment *</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="F&B">Food & Beverage (Room Service)</option>
                <option value="Front Desk">Front Desk / Concierge</option>
                <option value="Concierge">Chauffeur & Tours</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Request Category *</label>
              <input
                type="text"
                required
                placeholder="e.g. Extra towels, wake-up call"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">4. Set Priority *</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="Critical">Critical (Immediate SLA)</option>
                <option value="High">High (Within 20m)</option>
                <option value="Medium">Medium (Within 1h)</option>
                <option value="Low">Low (Routine)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Detailed Instructions / Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Specify quantity, timings, or guest preferences..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          {/* 9. Record Guest Complaint Option */}
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="complaintCheck"
                checked={isComplaint}
                onChange={e => setIsComplaint(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="complaintCheck" className="text-xs font-bold text-red-900 dark:text-red-200 cursor-pointer">
                9. Flag this request as a Formal Guest Complaint
              </label>
            </div>

            {isComplaint && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] font-bold text-red-700">Complaint Severity:</span>
                {(['Low', 'Medium', 'High', 'Severe'] as const).map(sev => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setComplaintSeverity(sev)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      complaintSeverity === sev ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Submit & Dispatch Request
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 2: RESOLUTION & COMPLETION ─── */}
      <Modal isOpen={Boolean(resolveTicket)} onClose={() => setResolveTicket(null)} title="6. Record Request Completion & Satisfaction">
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <p className="text-xs text-gray-500">
            Log fulfillment details and any service recovery compensation provided.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Completion Notes *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Delivered 2 extra towels to Room 201. Guest thanked the team."
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          {resolveTicket?.isComplaint && (
            <div>
              <label className="text-xs font-bold uppercase text-red-600 block mb-1">
                10. Service Recovery Goodwill Compensation
              </label>
              <select
                value={recoveryComp}
                onChange={e => setRecoveryComp(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="None">None (Standard Resolution)</option>
                <option value="Complimentary Cocktail Voucher">Complimentary Cocktail Voucher at Rooftop Lounge</option>
                <option value="$25 Folio Credit">$25 Incidentals Folio Credit</option>
                <option value="Late Checkout Waiver">Late Checkout Fee Waived until 14:00</option>
                <option value="Free Breakfast Voucher">Complimentary Continental Breakfast</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setResolveTicket(null)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Save & Close Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 3: CANCEL OR REJECT WITH REASON ─── */}
      <Modal
        isOpen={Boolean(actionTicket)}
        onClose={() => setActionTicket(null)}
        title={`${actionTicket?.action} Service Request`}
      >
        <form onSubmit={handleCancelRejectSubmit} className="space-y-4">
          <p className="text-xs text-gray-500">
            Please provide a mandatory operational reason for this status update.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
              Reason for {actionTicket?.action} *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Guest called back stating item was already found / Service closed after hours..."
              value={reasonInput}
              onChange={e => setReasonInput(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActionTicket(null)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Confirm {actionTicket?.action}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
