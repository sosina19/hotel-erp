import React, { useState } from 'react';
import {
  ArrowRightLeft, AlertCircle, ShieldCheck, CheckCircle2, Lock,
  BedDouble, Search, Sparkles, DollarSign, History, AlertTriangle
} from 'lucide-react';
import type { InHouseResident, FDRoom } from '../types';
import { Modal } from '../../ui/Modal';

interface RoomTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: InHouseResident | null;
  rooms: FDRoom[];
  onExecuteTransfer: (
    residentId: string,
    newRoomNumber: string,
    reason: string,
    rateDifference: number,
    supervisorAuthorized: boolean
  ) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

export const RoomTransferModal: React.FC<RoomTransferModalProps> = ({
  isOpen,
  onClose,
  resident,
  rooms,
  onExecuteTransfer,
  onAddToast,
}) => {
  const [selectedNewRoomNumber, setSelectedNewRoomNumber] = useState('');
  const [transferReason, setTransferReason] = useState<
    'Noise complaint' | 'Air conditioning issue' | 'Plumbing malfunction' | 'Guest requested view upgrade' | 'Stay extension required' | 'Guest preference'
  >('Noise complaint');
  const [customReasonDetails, setCustomReasonDetails] = useState('');
  const [supervisorPasscode, setSupervisorPasscode] = useState('');
  const [isSupervisorAuthorized, setIsSupervisorAuthorized] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');

  if (!resident) return null;

  // 1. Search available alternative rooms
  // Must be vacant, clean or inspected, not the current room, and not blocked
  const availableAlternativeRooms = rooms.filter(r => {
    if (r.number === resident.roomNumber) return false;
    if (r.roomStatus !== 'vacant') return false;
    if (r.housekeepingStatus !== 'clean' && r.housekeepingStatus !== 'inspected') return false;
    if (roomTypeFilter !== 'all' && r.type !== roomTypeFilter) return false;
    return true;
  });

  const selectedNewRoom = rooms.find(r => r.number === selectedNewRoomNumber);

  // Remaining nights calculation
  const remainingNights = Math.max(1, resident.nights - 1);
  const currentRate = resident.roomRate;
  const newRate = selectedNewRoom ? selectedNewRoom.ratePerNight : currentRate;
  const nightlyDiff = newRate - currentRate;
  const totalDifference = nightlyDiff * remainingNights;
  const isUpgrade = nightlyDiff > 0;

  // Authorize supervisor
  const handleAuthorize = () => {
    if (supervisorPasscode === '8899') {
      setIsSupervisorAuthorized(true);
      onAddToast({ type: 'success', title: 'Supervisor Authorized', message: 'Passcode verified. Upgrade override permitted.' });
    } else {
      onAddToast({ type: 'error', title: 'Invalid Passcode', message: 'Enter supervisor passcode 8899.' });
    }
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewRoomNumber) {
      onAddToast({ type: 'warning', title: 'Room Required', message: 'Please select an available alternative room.' });
      return;
    }

    if (isUpgrade && !isSupervisorAuthorized) {
      onAddToast({
        type: 'warning',
        title: 'Authorization Required',
        message: 'This room transfer is an upgrade. Please verify with supervisor passcode 8899.',
      });
      return;
    }

    const fullReason = `${transferReason}: ${customReasonDetails || 'Standard room relocation'}`;
    onExecuteTransfer(
      resident.id,
      selectedNewRoomNumber,
      fullReason,
      totalDifference,
      isSupervisorAuthorized
    );

    onAddToast({
      type: 'success',
      title: '6. Room Transfer Completed',
      message: `${resident.guestName} moved from Room #${resident.roomNumber} to Room #${selectedNewRoomNumber}. Previous room marked DIRTY for housekeeping.`,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="12. Room Change & Transfer Management">
      <form onSubmit={handleConfirmTransfer} className="space-y-4">
        {/* Guest and Current Room Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Assignment</span>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{resident.guestName}</h4>
            <p className="text-xs text-gray-500">
              Current Room: <strong className="text-indigo-600">#{resident.roomNumber}</strong> ({resident.roomType}) · ${resident.roomRate}/nt
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="text-gray-400 block">Remaining Stay</span>
            <span className="font-bold text-gray-900 dark:text-white">{remainingNights} nights remaining</span>
          </div>
        </div>

        {/* 10. Previous Assignment History if any */}
        {resident.roomAssignmentHistory && resident.roomAssignmentHistory.length > 0 && (
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> 10. Immutable Assignment History:
            </span>
            <div className="space-y-1">
              {resident.roomAssignmentHistory.map((rec, i) => (
                <div key={i} className="text-[11px] text-gray-600 dark:text-gray-300 flex justify-between">
                  <span>Room #{rec.roomNumber} ({rec.roomType})</span>
                  <span className="text-gray-400">{rec.from} → {rec.to} ({rec.reason})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1 & 2. Search Available Alternative Rooms */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-gray-500">
              1. Available Alternative Rooms ({availableAlternativeRooms.length} Ready):
            </label>
            <select
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value)}
              className="text-[11px] px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Room Types</option>
              <option value="Deluxe King">Deluxe King</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
              <option value="Superior Twin">Superior Twin</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {availableAlternativeRooms.map(r => {
              const diff = r.ratePerNight - currentRate;
              const isSelected = selectedNewRoomNumber === r.number;

              return (
                <button
                  type="button"
                  key={r.number}
                  onClick={() => setSelectedNewRoomNumber(r.number)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 ring-2 ring-indigo-400/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">#{r.number}</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.2 rounded">
                      {r.housekeepingStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{r.type}</p>
                  <p className="text-[10px] text-gray-400">Floor {r.floor} · Max {r.capacity} Guests</p>
                  <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700 flex justify-between text-[10px]">
                    <span className="font-bold text-gray-700 dark:text-gray-300">${r.ratePerNight}/nt</span>
                    {diff !== 0 ? (
                      <span className={diff > 0 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`}
                      </span>
                    ) : (
                      <span className="text-gray-400">Same rate</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {availableAlternativeRooms.length === 0 && (
            <p className="text-xs text-amber-600 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              No clean & inspected alternative rooms matching current criteria.
            </p>
          )}
        </div>

        {/* 4. Record Reason for Room Change */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            4. Reason for Room Relocation *
          </label>
          <select
            value={transferReason}
            onChange={e => setTransferReason(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
          >
            <option value="Noise complaint">Noise complaint (Street traffic / Elevator / Neighbors)</option>
            <option value="Air conditioning issue">Air conditioning / Heating malfunction</option>
            <option value="Plumbing malfunction">Plumbing / Bathroom equipment leak</option>
            <option value="Guest requested view upgrade">Guest requested view or category upgrade</option>
            <option value="Stay extension required">Stay extension required (original room pre-booked)</option>
            <option value="Guest preference">Guest personal preference (High floor / Bedding)</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Additional specific notes for records (e.g. guest noticed AC drip)..."
            value={customReasonDetails}
            onChange={e => setCustomReasonDetails(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
          />
        </div>

        {/* 8. Applicable Charges & Differential */}
        {selectedNewRoom && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-1">
            <span className="font-bold text-gray-700 dark:text-gray-300 block">8. Applicable Charges Update:</span>
            <div className="flex justify-between text-gray-500">
              <span>Prorated Nightly Difference:</span>
              <span className="font-bold">{nightlyDiff >= 0 ? `+$${nightlyDiff}` : `-$${Math.abs(nightlyDiff)}`} / night</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
              <span>Total Remaining Folio Adjustment ({remainingNights} nights):</span>
              <span className={totalDifference > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                {totalDifference >= 0 ? `+$${totalDifference.toFixed(2)}` : `-$${Math.abs(totalDifference).toFixed(2)}`}
              </span>
            </div>
          </div>
        )}

        {/* 5. Authorization for Upgrade */}
        {isUpgrade && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-200 font-bold">
              <Lock className="w-4 h-4 text-amber-600" />
              5. Supervisor Authorization Required for Room Upgrade
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Relocating to a higher room rate category requires manager passcode approval (Use PIN: 8899).
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Supervisor Passcode"
                value={supervisorPasscode}
                onChange={e => setSupervisorPasscode(e.target.value)}
                className="w-40 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAuthorize}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
              >
                {isSupervisorAuthorized ? '✓ Authorized' : 'Verify PIN'}
              </button>
            </div>
          </div>
        )}

        {/* 9. Notice about Housekeeping */}
        <div className="text-[11px] text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
          <strong>9. Housekeeping Notice:</strong> Upon completing this transfer, Room #{resident.roomNumber} will automatically be marked <strong>DIRTY</strong> and scheduled for housekeeping turnover.
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedNewRoomNumber || (isUpgrade && !isSupervisorAuthorized)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> 6. Transfer Guest & Issue Key
          </button>
        </div>
      </form>
    </Modal>
  );
};
