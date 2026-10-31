import React, { useState } from 'react';
import {
  Sparkles, Clock, AlertTriangle, CheckCircle2, Flame, User,
  Calendar, ShieldCheck, HeartHandshake, Baby, Coffee,
  Filter, Plus, Search, Check, RefreshCw, Send, AlertCircle, ArrowLeft
} from 'lucide-react';
import type { FDRoom } from '../types';
import { Modal } from '../../ui/Modal';

interface HousekeepingCoordinationProps {
  rooms: FDRoom[];
  onUpdateRoom: (roomNumber: string, updates: Partial<FDRoom>) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onSimulateRoomReady: (roomNumber: string) => void;
  onBack?: () => void;
}

export const HousekeepingCoordination: React.FC<HousekeepingCoordinationProps> = ({
  rooms,
  onUpdateRoom,
  onAddToast,
  onSimulateRoomReady,
  onBack,
}) => {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'dirty' | 'waiting' | 'in_progress' | 'awaiting_inspection' | 'clean_inspected' | 'delayed'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [selectedUrgentRoom, setSelectedUrgentRoom] = useState('');
  const [urgentReason, setUrgentReason] = useState('VIP Guest Waiting in Lobby');

  const [isArrivalPrepModalOpen, setIsArrivalPrepModalOpen] = useState(false);
  const [prepRoomNumber, setPrepRoomNumber] = useState('');
  const [prepArrivalTime, setPrepArrivalTime] = useState('14:00');
  const [prepGuestName, setPrepGuestName] = useState('');
  const [prepTemp, setPrepTemp] = useState('21°C');

  const [isSpecialPrepModalOpen, setIsSpecialPrepModalOpen] = useState(false);
  const [specialPrepRoom, setSpecialPrepRoom] = useState('');
  const [specialPrepPackage, setSpecialPrepPackage] = useState<'VIP Deluxe' | 'Honeymoon & Romance' | 'Infant & Family' | 'Hypoallergenic' | 'Executive Tech'>('VIP Deluxe');
  const [specialPrepNotes, setSpecialPrepNotes] = useState('');

  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [issueRoom, setIssueRoom] = useState('');
  const [issueCategory, setIssueCategory] = useState<'Linen Shortage' | 'Amenity Depleted' | 'Carpet Stain' | 'Glassware Broken' | 'Other'>('Linen Shortage');
  const [issueDescription, setIssueDescription] = useState('');

  // Filtering
  const filteredRooms = rooms.filter(r => {
    // Search
    if (searchQuery && !r.number.includes(searchQuery) && !r.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterStatus === 'all') return true;
    if (filterStatus === 'dirty') return r.housekeepingStatus === 'dirty';
    if (filterStatus === 'waiting') return r.housekeepingStatus === 'dirty' && (!r.cleaningProgress || r.cleaningProgress === 0);
    if (filterStatus === 'in_progress') return r.housekeepingStatus === 'inspecting' || (r.cleaningProgress && r.cleaningProgress > 0 && r.cleaningProgress < 100);
    if (filterStatus === 'awaiting_inspection') return r.housekeepingStatus === 'clean' && !r.cleaningProgress; // or clean awaiting final inspect
    if (filterStatus === 'clean_inspected') return r.housekeepingStatus === 'inspected';
    if (filterStatus === 'delayed') return Boolean(r.isCleaningDelayed);
    return true;
  });

  // KPI counts
  const countDirty = rooms.filter(r => r.housekeepingStatus === 'dirty').length;
  const countInProgress = rooms.filter(r => (r.cleaningProgress && r.cleaningProgress > 0 && r.cleaningProgress < 100) || r.housekeepingStatus === 'inspecting').length;
  const countAwaitingInspect = rooms.filter(r => r.housekeepingStatus === 'clean').length;
  const countCleanInspected = rooms.filter(r => r.housekeepingStatus === 'inspected').length;
  const countDelayed = rooms.filter(r => r.isCleaningDelayed).length;

  // Handlers
  const handleRequestUrgentCleaning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUrgentRoom) {
      onAddToast({ type: 'warning', title: 'Room Required', message: 'Select a room for urgent cleaning.' });
      return;
    }
    onUpdateRoom(selectedUrgentRoom, {
      urgentCleaningRequested: true,
      cleaningEtaMins: 15,
      cleaningProgress: 25,
      assignedHousekeeper: 'Elena Rostova (Lead Housekeeper)',
    });
    onAddToast({
      type: 'error',
      title: '🚨 Urgent Cleaning Dispatched',
      message: `Priority emergency cleaning requested for Room #${selectedUrgentRoom}. Reason: ${urgentReason}`,
    });
    setIsUrgentModalOpen(false);
  };

  const handleRequestArrivalPrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepRoomNumber) {
      onAddToast({ type: 'warning', title: 'Room Required', message: 'Select a room for arrival preparation.' });
      return;
    }
    onUpdateRoom(prepRoomNumber, {
      specialPrepRequested: `Arrival Prep for ${prepGuestName || 'Guest'} at ${prepArrivalTime} (Temp: ${prepTemp})`,
      urgentCleaningRequested: true,
    });
    onAddToast({
      type: 'info',
      title: 'Arrival Preparation Dispatched',
      message: `Room #${prepRoomNumber} flagged for arrival readiness by ${prepArrivalTime}.`,
    });
    setIsArrivalPrepModalOpen(false);
  };

  const handleRequestSpecialPrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialPrepRoom) {
      onAddToast({ type: 'warning', title: 'Room Required', message: 'Select a room.' });
      return;
    }
    onUpdateRoom(specialPrepRoom, {
      specialPrepRequested: `${specialPrepPackage}: ${specialPrepNotes || 'Standard package amenities'}`,
    });
    onAddToast({
      type: 'success',
      title: 'Special Room Prep Dispatched',
      message: `${specialPrepPackage} package requested for Room #${specialPrepRoom}. Housekeeping alerted.`,
    });
    setIsSpecialPrepModalOpen(false);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast({
      type: 'warning',
      title: 'Housekeeping Issue Logged',
      message: `Issue logged for Room #${issueRoom || 'Inventory'}: ${issueCategory} - ${issueDescription}`,
    });
    setIsReportIssueModalOpen(false);
    setIssueDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Action Bar */}
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
              <Sparkles className="w-5 h-5 text-amber-500" />
              Housekeeping Visibility & Operational Coordination
            </h2>
            <p className="text-xs text-gray-500">
              Housekeeping owns cleaning operations. Front Office coordinates guest turnover, urgent arrivals, and inspects readiness.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUrgentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Flame className="w-3.5 h-3.5" /> Request Urgent Cleaning
          </button>
          <button
            onClick={() => setIsArrivalPrepModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5" /> Arrival Prep Request
          </button>
          <button
            onClick={() => setIsSpecialPrepModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Special Prep Package
          </button>
          <button
            onClick={() => setIsReportIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Report Issue
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setFilterStatus('dirty')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'dirty'
              ? 'bg-red-50 dark:bg-red-900/30 border-red-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400 block">1. Dirty Rooms</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{countDirty}</p>
          <span className="text-[10px] text-gray-500">Awaiting turnover</span>
        </button>

        <button
          onClick={() => setFilterStatus('in_progress')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'in_progress'
              ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 block">3. In Progress</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{countInProgress}</p>
          <span className="text-[10px] text-gray-500">Active housekeeping</span>
        </button>

        <button
          onClick={() => setFilterStatus('awaiting_inspection')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'awaiting_inspection'
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 block">4. Awaiting Inspect</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{countAwaitingInspect}</p>
          <span className="text-[10px] text-gray-500">Supervisor review</span>
        </button>

        <button
          onClick={() => setFilterStatus('clean_inspected')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'clean_inspected'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">5. Clean & Inspected</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{countCleanInspected}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Ready for Check-In</span>
        </button>

        <button
          onClick={() => setFilterStatus('delayed')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'delayed'
              ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400 block">11. Delayed Tasks</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{countDelayed}</p>
          <span className="text-[10px] text-purple-600 font-medium">DND / Supply issues</span>
        </button>
      </div>

      {/* Delayed Tasks Alert Banner if any */}
      {countDelayed > 0 && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>
              <strong>11. Delayed Cleaning Alert:</strong> {countDelayed} room cleaning tasks are behind schedule (DND flags or linen turnover).
            </span>
          </div>
          <button
            onClick={() => setFilterStatus('delayed')}
            className="text-[11px] font-bold underline hover:text-purple-700"
          >
            Filter Delayed Tasks →
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'All Rooms' },
              { id: 'dirty', label: '1. Dirty' },
              { id: 'waiting', label: '2. Waiting' },
              { id: 'in_progress', label: '3. In Progress' },
              { id: 'awaiting_inspection', label: '4. Awaiting Inspect' },
              { id: 'clean_inspected', label: '5. Clean & Inspected' },
              { id: 'delayed', label: '11. Delayed' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search room # or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Rooms Grid with Real-Time Housekeeping Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => {
          const isClean = room.housekeepingStatus === 'clean' || room.housekeepingStatus === 'inspected';
          const isInspected = room.housekeepingStatus === 'inspected';
          const isDirty = room.housekeepingStatus === 'dirty';
          const isDelayed = room.isCleaningDelayed;
          const progress = room.cleaningProgress || (isInspected ? 100 : isClean ? 90 : 0);

          return (
            <div
              key={room.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-sm relative transition-all hover:shadow-md ${
                room.urgentCleaningRequested
                  ? 'border-red-500 ring-2 ring-red-400/20'
                  : isDelayed
                  ? 'border-purple-400'
                  : isInspected
                  ? 'border-emerald-200 dark:border-emerald-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Badges top right */}
              <div className="flex items-center gap-1.5 absolute top-3 right-3">
                {room.urgentCleaningRequested && (
                  <span className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                    <Flame className="w-3 h-3 text-red-600" /> URGENT
                  </span>
                )}
                {isDelayed && (
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    DELAYED
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isInspected
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : isClean
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {room.housekeepingStatus}
                </span>
              </div>

              {/* Room Info */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-serif flex-shrink-0 ${
                    isInspected
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : isDirty
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  #{room.number}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{room.type}</h3>
                  <p className="text-[11px] text-gray-500">Floor {room.floor} · Max {room.capacity} Guests · ${room.ratePerNight}/nt</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5">Room State: <strong className="uppercase text-gray-700 dark:text-gray-300">{room.roomStatus}</strong></p>
                </div>
              </div>

              {/* Special Prep Banner if set */}
              {room.specialPrepRequested && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-600" /> 8. Special Prep Active:
                  </span>
                  <p className="text-[11px] mt-0.5">{room.specialPrepRequested}</p>
                </div>
              )}

              {/* Delay reason if delayed */}
              {isDelayed && (
                <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                  Delay Reason: {room.delayReason || 'Guest requested DND; rescheduled for later'}
                </div>
              )}

              {/* 9. Cleaning Progress Bar & Housekeeper Details */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {room.assignedHousekeeper || (isInspected ? 'Elena R. (Inspected)' : 'Housekeeping Pool')}
                  </span>
                  <span className="font-bold font-mono text-gray-700 dark:text-gray-300">{progress}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isInspected
                        ? 'bg-emerald-500'
                        : isClean
                        ? 'bg-blue-500'
                        : room.urgentCleaningRequested
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Started: {room.cleaningStartTime || '10:15 AM'}</span>
                  <span>ETA: {room.cleaningEtaMins ? `${room.cleaningEtaMins} mins` : isInspected ? 'Completed' : '15 mins'}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                {!isInspected && (
                  <button
                    onClick={() => {
                      onUpdateRoom(room.number, {
                        housekeepingStatus: 'inspected',
                        cleaningProgress: 100,
                        urgentCleaningRequested: false,
                        isCleaningDelayed: false,
                      });
                      onSimulateRoomReady(room.number);
                    }}
                    className="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 10. Mark Room Ready
                  </button>
                )}

                {isDirty && (
                  <button
                    onClick={() => {
                      onUpdateRoom(room.number, {
                        urgentCleaningRequested: true,
                        cleaningEtaMins: 15,
                        cleaningProgress: 20,
                        assignedHousekeeper: 'Emergency Dispatch',
                      });
                      onAddToast({
                        type: 'error',
                        title: 'Urgent Cleaning Dispatched',
                        message: `Room #${room.number} flagged for immediate turnaround.`,
                      });
                    }}
                    className="px-2.5 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
                    title="Request Urgent Turnover"
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setSpecialPrepRoom(room.number);
                    setIsSpecialPrepModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300"
                  title="Special Prep"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODAL 1: REQUEST URGENT CLEANING ─── */}
      <Modal isOpen={isUrgentModalOpen} onClose={() => setIsUrgentModalOpen(false)} title="6. Request Urgent Room Cleaning">
        <form onSubmit={handleRequestUrgentCleaning} className="space-y-4">
          <p className="text-xs text-gray-500">
            Send an expedited emergency priority turnaround ticket to the Housekeeping duty supervisor.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Select Room to Clean *</label>
            <select
              value={selectedUrgentRoom}
              onChange={e => setSelectedUrgentRoom(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="">-- Select Dirty Room --</option>
              {rooms.filter(r => r.housekeepingStatus === 'dirty' || r.cleaningProgress !== 100).map(r => (
                <option key={r.number} value={r.number}>
                  Room #{r.number} ({r.type}) - Currently: {r.housekeepingStatus}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Urgency Justification *</label>
            <select
              value={urgentReason}
              onChange={e => setUrgentReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="VIP Guest Waiting in Lobby">VIP Guest Waiting in Lobby</option>
              <option value="Early Arrival Flight Landed">Early Arrival Flight Landed</option>
              <option value="Room Move due to Maintenance">Room Move due to Maintenance Issue</option>
              <option value="Liquid Spill / Beverage Incident">Liquid Spill / Beverage Incident</option>
              <option value="Turnover for Back-to-Back Group">Turnover for Back-to-Back Group</option>
            </select>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-900 dark:text-red-200">
            <strong>Target SLA:</strong> Housekeeping dispatched within 5 minutes. Target room ready in 20 minutes.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUrgentModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" /> Dispatch Urgent Request
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 2: ARRIVAL PREPARATION REQUEST ─── */}
      <Modal isOpen={isArrivalPrepModalOpen} onClose={() => setIsArrivalPrepModalOpen(false)} title="7. Request Room Preparation for Arrivals">
        <form onSubmit={handleRequestArrivalPrep} className="space-y-4">
          <p className="text-xs text-gray-500">
            Alert housekeeping to prepare temperature, lighting, and amenities for an incoming guest.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Room Number *</label>
              <select
                value={prepRoomNumber}
                onChange={e => setPrepRoomNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="">-- Select Room --</option>
                {rooms.map(r => (
                  <option key={r.number} value={r.number}>Room #{r.number} ({r.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Expected Arrival Time *</label>
              <input
                type="time"
                value={prepArrivalTime}
                onChange={e => setPrepArrivalTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Guest Name</label>
              <input
                type="text"
                placeholder="e.g. Lord Harrington"
                value={prepGuestName}
                onChange={e => setPrepGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Climate Thermostat Setting</label>
              <select
                value={prepTemp}
                onChange={e => setPrepTemp(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              >
                <option value="19°C (Cool)">19°C (Cool)</option>
                <option value="21°C (Standard)">21°C (Standard)</option>
                <option value="23°C (Warm)">23°C (Warm)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsArrivalPrepModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Queue Arrival Prep
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 3: SPECIAL ROOM PREPARATION ─── */}
      <Modal isOpen={isSpecialPrepModalOpen} onClose={() => setIsSpecialPrepModalOpen(false)} title="8. Request Special Room Preparation Package">
        <form onSubmit={handleRequestSpecialPrep} className="space-y-4">
          <p className="text-xs text-gray-500">
            Schedule custom amenities and specialized setups before guest arrival.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Target Room *</label>
            <select
              value={specialPrepRoom}
              onChange={e => setSpecialPrepRoom(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="">-- Select Room --</option>
              {rooms.map(r => (
                <option key={r.number} value={r.number}>Room #{r.number} ({r.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Special Preparation Package *</label>
            <select
              value={specialPrepPackage}
              onChange={e => setSpecialPrepPackage(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="VIP Deluxe">VIP Deluxe (Champagne, Artisan Chocolates & Fruit Tier)</option>
              <option value="Honeymoon & Romance">Honeymoon & Romance (Swan Towels, Rose Petal Turndown)</option>
              <option value="Infant & Family">Infant & Family (Baby Crib, Bottle Warmer, Child Safety Plugs)</option>
              <option value="Hypoallergenic">Hypoallergenic (Feather-Free Bedding, Air Purifier Machine)</option>
              <option value="Executive Tech">Executive Tech (Desk Lamp, International Adaptor Kit, Espresso Pods)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Special Notes for Housekeeping Team</label>
            <textarea
              rows={2}
              placeholder="e.g. Include personalized welcome card signed by GM"
              value={specialPrepNotes}
              onChange={e => setSpecialPrepNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSpecialPrepModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Submit Special Prep
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 4: REPORT HOUSEKEEPING ISSUE ─── */}
      <Modal isOpen={isReportIssueModalOpen} onClose={() => setIsReportIssueModalOpen(false)} title="12. Report Housekeeping Issue">
        <form onSubmit={handleReportIssue} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Room (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 204 or Linen Chute"
                value={issueRoom}
                onChange={e => setIssueRoom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Issue Category *</label>
              <select
                value={issueCategory}
                onChange={e => setIssueCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              >
                <option value="Linen Shortage">Linen Shortage (Bath towels/sheets)</option>
                <option value="Amenity Depleted">Amenity Depleted (Toiletries/Soaps)</option>
                <option value="Carpet Stain">Carpet Stain requiring steam extraction</option>
                <option value="Glassware Broken">Glassware Broken in room</option>
                <option value="Other">Other Housekeeping Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Details & Location *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what is needed or what was discovered..."
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReportIssueModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Report to Housekeeping
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
