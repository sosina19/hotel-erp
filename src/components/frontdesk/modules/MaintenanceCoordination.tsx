import React, { useState } from 'react';
import {
  Wrench, AlertTriangle, Clock, CheckCircle2, Phone, Camera,
  Upload, ShieldAlert, Filter, Plus, Search, Building2, Check,
  Zap, Droplets, Wifi, Lock, Bed, ShowerHead, Eye, Ban, ArrowLeft
} from 'lucide-react';
import type { MaintenanceTicket, FDRoom } from '../types';
import { Modal } from '../../ui/Modal';

interface MaintenanceCoordinationProps {
  rooms: FDRoom[];
  tickets: MaintenanceTicket[];
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onUpdateTicket: (id: string, updates: Partial<MaintenanceTicket>) => void;
  onUpdateRoom: (roomNumber: string, updates: Partial<FDRoom>) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const MaintenanceCoordination: React.FC<MaintenanceCoordinationProps> = ({
  rooms,
  tickets,
  onAddTicket,
  onUpdateTicket,
  onUpdateRoom,
  onAddToast,
  onBack,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportRoom, setReportRoom] = useState('101');
  const [reportLocationType, setReportLocationType] = useState<'room' | 'public_area'>('room');
  const [reportCategory, setReportCategory] = useState<MaintenanceTicket['category']>('Air conditioning');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPriority, setReportPriority] = useState<MaintenanceTicket['priority']>('High');
  const [reportBlockRoom, setReportBlockRoom] = useState(true);
  const [reportPhotoUrl, setReportPhotoUrl] = useState<string | undefined>(undefined);

  // Inspection Request Modal State
  const [inspectTicket, setInspectTicket] = useState<MaintenanceTicket | null>(null);

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus === 'open' && t.status === 'Closed') return false;
    if (filterStatus === 'closed' && t.status !== 'Closed') return false;
    if (filterStatus === 'blocked' && !t.roomBlocked) return false;
    if (filterStatus === 'overdue' && !t.isOverdue) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPI Calculations
  const openCount = tickets.filter(t => t.status !== 'Closed').length;
  const criticalCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Closed').length;
  const blockedCount = tickets.filter(t => t.roomBlocked && t.status !== 'Closed').length;
  const overdueCount = tickets.filter(t => t.isOverdue && t.status !== 'Closed').length;

  // Handle Create Maintenance Request
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) {
      onAddToast({ type: 'warning', title: 'Description Required', message: 'Please describe the maintenance issue.' });
      return;
    }

    const newTicket: MaintenanceTicket = {
      id: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
      roomNumber: reportLocationType === 'room' ? reportRoom : 'Public: Lobby / Common',
      locationType: reportLocationType,
      category: reportCategory,
      description: reportDescription,
      priority: reportPriority,
      status: 'Reported',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'Front Desk Duty Agent',
      roomBlocked: reportBlockRoom,
      photoUrl: reportPhotoUrl,
      assignedTechnician: {
        name: reportCategory === 'Air conditioning' ? 'Marcus Vance (HVAC)' : 'Carlos Mendez (Electrician)',
        phone: '+1 (555) 018-402',
        etaMins: reportPriority === 'Critical' ? 10 : 30,
      },
    };

    onAddTicket(newTicket);

    // If room is blocked, update FDRoom status
    if (reportBlockRoom && reportLocationType === 'room') {
      onUpdateRoom(reportRoom, {
        roomStatus: 'out_of_order',
        maintenanceNote: `Blocked for ${reportCategory}: ${reportDescription}`,
      });
    }

    onAddToast({
      type: 'success',
      title: 'Maintenance Request Created',
      message: `Work Order ${newTicket.id} logged for ${newTicket.roomNumber}. Technician dispatched.`,
    });

    setIsReportModalOpen(false);
    setReportDescription('');
    setReportPhotoUrl(undefined);
  };

  // Step Status Advancement
  const handleAdvanceStatus = (ticket: MaintenanceTicket) => {
    const nextStatusMap: Record<MaintenanceTicket['status'], MaintenanceTicket['status']> = {
      'Reported': 'Assigned',
      'Assigned': 'Technician On-Site',
      'Technician On-Site': 'Repaired',
      'Repaired': 'Inspection Requested',
      'Inspection Requested': 'Closed',
      'Closed': 'Closed',
    };

    const nextStatus = nextStatusMap[ticket.status];
    onUpdateTicket(ticket.id, {
      status: nextStatus,
      repairedAt: nextStatus === 'Repaired' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ticket.repairedAt,
    });

    if (nextStatus === 'Repaired') {
      onAddToast({
        type: 'info',
        title: '10. Repair Complete Notification',
        message: `${ticket.category} repaired in Room #${ticket.roomNumber}. Housekeeping inspection requested before releasing room.`,
      });
    } else if (nextStatus === 'Closed') {
      // Unblock room
      if (ticket.roomBlocked) {
        onUpdateRoom(ticket.roomNumber, {
          roomStatus: 'vacant',
          housekeepingStatus: 'dirty', // requires inspection/cleaning
          maintenanceNote: undefined,
        });
      }
      onAddToast({
        type: 'success',
        title: 'Ticket Closed & Room Released',
        message: `Work Order ${ticket.id} closed. Room #${ticket.roomNumber} released for housekeeping sanitization.`,
      });
    } else {
      onAddToast({
        type: 'info',
        title: 'Work Order Updated',
        message: `${ticket.id} advanced to ${nextStatus}.`,
      });
    }
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
              <Wrench className="w-5 h-5 text-indigo-600" />
              Maintenance Coordination & Work Orders
            </h2>
            <p className="text-xs text-gray-500">
              Maintenance owns repair operations. Front Office reports issues, monitors repair SLAs, blocks rooms, and requests inspections.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 1. Report Maintenance Issue
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setFilterStatus('open')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'open' ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">7. Open Requests</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{openCount}</p>
          <span className="text-[10px] text-gray-500">Under repair</span>
        </div>

        <div
          onClick={() => setFilterPriority('Critical')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterPriority === 'Critical' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400 block">Critical Emergencies</span>
          <p className="text-2xl font-black text-red-600 mt-1">{criticalCount}</p>
          <span className="text-[10px] text-red-500">10 min SLA response</span>
        </div>

        <div
          onClick={() => setFilterStatus('blocked')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'blocked' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 block">11. Rooms Blocked (OOO)</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{blockedCount}</p>
          <span className="text-[10px] text-gray-500">Out of order inventory</span>
        </div>

        <div
          onClick={() => setFilterStatus('overdue')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'overdue' ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400 block">13. Overdue Tasks</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{overdueCount}</p>
          <span className="text-[10px] text-purple-500">Breaching target SLA</span>
        </div>
      </div>

      {/* 13. Overdue Maintenance Tasks Alert Banner */}
      {overdueCount > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between text-xs text-red-900 dark:text-red-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 animate-bounce" />
            <span>
              <strong>13. SLA Warning:</strong> {overdueCount} maintenance work order has exceeded the 2-hour target completion window. Supervisor escalation recommended.
            </span>
          </div>
          <button
            onClick={() => setFilterStatus('overdue')}
            className="text-[11px] font-bold underline hover:text-red-700"
          >
            Inspect Overdue Work Orders →
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Categories (7 Types)</option>
            <option value="Air conditioning">Air Conditioning</option>
            <option value="Electricity">Electricity</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Furniture">Furniture</option>
            <option value="Internet">Internet & Wi-Fi</option>
            <option value="Door locks">Door Locks & Keycards</option>
            <option value="Bathroom equipment">Bathroom Equipment</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Work Orders</option>
            <option value="open">Active / Open</option>
            <option value="blocked">Rooms Blocked (OOO)</option>
            <option value="overdue">Overdue</option>
            <option value="closed">Closed / Repaired</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search work order #, room, or issue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => {
          const isClosed = ticket.status === 'Closed';
          const isCritical = ticket.priority === 'Critical';

          return (
            <div
              key={ticket.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
                isCritical
                  ? 'border-red-400 ring-2 ring-red-400/10'
                  : ticket.isOverdue
                  ? 'border-purple-400'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                      ticket.category === 'Air conditioning'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : ticket.category === 'Plumbing'
                        ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                        : ticket.category === 'Electricity'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : ticket.category === 'Internet'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {ticket.category === 'Air conditioning' ? <Droplets className="w-5 h-5" /> :
                     ticket.category === 'Electricity' ? <Zap className="w-5 h-5" /> :
                     ticket.category === 'Plumbing' ? <ShowerHead className="w-5 h-5" /> :
                     ticket.category === 'Internet' ? <Wifi className="w-5 h-5" /> :
                     ticket.category === 'Door locks' ? <Lock className="w-5 h-5" /> :
                     <Wrench className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{ticket.id}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        Room #{ticket.roomNumber} · {ticket.category}
                      </span>
                      {ticket.roomBlocked && (
                        <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Room Blocked (OOO)
                        </span>
                      )}
                      {ticket.isOverdue && (
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{ticket.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <span>Reported: {ticket.reportedAt} by {ticket.reportedBy}</span>
                      {ticket.assignedTechnician && (
                        <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          9. Tech: <strong>{ticket.assignedTechnician.name}</strong> ({ticket.assignedTechnician.phone}) · ETA: {ticket.assignedTechnician.etaMins}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Priority & Status Controls */}
                <div className="flex flex-col sm:flex-row items-end md:items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase block ${
                        isCritical
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : ticket.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Priority: {ticket.priority}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white mt-1 block">
                      Status: {ticket.status}
                    </span>
                  </div>

                  {!isClosed && (
                    <div className="flex items-center gap-2">
                      {ticket.status === 'Repaired' && (
                        <button
                          onClick={() => {
                            onUpdateTicket(ticket.id, { inspectionStatus: 'Pending Inspection' });
                            onAddToast({
                              type: 'info',
                              title: '12. Inspection Requested',
                              message: `Housekeeping Supervisor notified to inspect repair in Room #${ticket.roomNumber}.`,
                            });
                          }}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> 12. Request Inspection
                        </button>
                      )}

                      <button
                        onClick={() => handleAdvanceStatus(ticket)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        Advance →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 8. Track Repair Progress Pipeline */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  8. Repair Progress Lifecycle:
                </span>
                <div className="grid grid-cols-5 gap-1 text-[11px] font-medium text-center">
                  {(['Reported', 'Assigned', 'Technician On-Site', 'Repaired', 'Closed'] as const).map((step, idx) => {
                    const stepOrder = ['Reported', 'Assigned', 'Technician On-Site', 'Repaired', 'Closed'];
                    const currentIdx = stepOrder.indexOf(ticket.status === 'Inspection Requested' ? 'Repaired' : ticket.status);
                    const isDone = currentIdx >= idx;
                    const isCurrent = ticket.status === step || (ticket.status === 'Inspection Requested' && step === 'Repaired');

                    return (
                      <div
                        key={step}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] ${
                          isCurrent
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200'
                            : 'bg-gray-50 text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {step}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODAL: 1. REPORT MAINTENANCE ISSUE ─── */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="1. Report Maintenance Issue">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <p className="text-xs text-gray-500">
            Log technical breakdowns and schedule technician dispatch.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Location Type *</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReportLocationType('room')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border ${
                    reportLocationType === 'room'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 dark:border-gray-700'
                  }`}
                >
                  Guest Room
                </button>
                <button
                  type="button"
                  onClick={() => setReportLocationType('public_area')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border ${
                    reportLocationType === 'public_area'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 dark:border-gray-700'
                  }`}
                >
                  Public Area
                </button>
              </div>
            </div>

            {reportLocationType === 'room' ? (
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">2. Select Affected Room *</label>
                <select
                  value={reportRoom}
                  onChange={e => setReportRoom(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                >
                  {rooms.map(r => (
                    <option key={r.number} value={r.number}>Room #{r.number} ({r.type})</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Common Area Location</label>
                <input
                  type="text"
                  placeholder="e.g. Main Lobby, Elevator B, Pool Terrace"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Issue Category *</label>
              <select
                value={reportCategory}
                onChange={e => setReportCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="Air conditioning">Air conditioning</option>
                <option value="Electricity">Electricity</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet / Wi-Fi</option>
                <option value="Door locks">Door locks / Keycards</option>
                <option value="Bathroom equipment">Bathroom equipment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">5. Set Priority *</label>
              <select
                value={reportPriority}
                onChange={e => setReportPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="Critical">Critical (Immediate dispatch - 10m SLA)</option>
                <option value="High">High (Within 30m)</option>
                <option value="Medium">Medium (Within 2 hours)</option>
                <option value="Low">Low (Routine)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">3. Describe the Problem in Detail *</label>
            <textarea
              required
              rows={3}
              placeholder="Explain the breakdown (e.g. AC leaking condensation onto wooden floor, temperature won't drop below 26°C)..."
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          {/* 4. Attach Photos */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">4. Attach Diagnostic Photo</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setReportPhotoUrl('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80');
                  onAddToast({ type: 'info', title: 'Photo Attached', message: 'Simulated leak photo captured and uploaded.' });
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-500" /> Capture Camera Photo
              </button>

              {reportPhotoUrl && (
                <div className="flex items-center gap-2">
                  <img src={reportPhotoUrl} alt="Attached" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Photo Attached
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Block Room Checkbox */}
          {reportLocationType === 'room' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2">
              <input
                type="checkbox"
                id="blockRoomCheck"
                checked={reportBlockRoom}
                onChange={e => setReportBlockRoom(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="blockRoomCheck" className="text-xs text-amber-900 dark:text-amber-200 font-semibold cursor-pointer">
                11. Temporarily Block Room (set to Out of Order) to prevent reservations or check-ins
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" /> 6. Create Maintenance Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
