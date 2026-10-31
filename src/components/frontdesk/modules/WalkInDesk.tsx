import React, { useState } from 'react';
import {
  UserCheck, Search, Plus, Calendar, BedDouble, CreditCard,
  Scan, Camera, CheckCircle2, ShieldCheck, DollarSign, KeyRound,
  Sparkles, Check, UserPlus, ArrowLeft
} from 'lucide-react';
import type { FDRoom, InHouseResident, FDReservation, AdditionalOccupant } from '../types';
import type { Guest } from '../../../data/mockData';

interface WalkInDeskProps {
  rooms: FDRoom[];
  guests: Guest[];
  onCompleteWalkInCheckIn: (payload: {
    guest: Guest;
    room: FDRoom;
    nights: number;
    adults: number;
    children: number;
    additionalOccupants: AdditionalOccupant[];
    depositPaid: number;
    paymentMethod: string;
    specialRequests: string;
  }) => void;
  onNavigateToRegistration: () => void;
  onNavigateToScanner: () => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const WalkInDesk: React.FC<WalkInDeskProps> = ({
  rooms,
  guests,
  onCompleteWalkInCheckIn,
  onNavigateToRegistration,
  onNavigateToScanner,
  onAddToast,
  onBack,
}) => {
  // Step 1: Guest selection / Search
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Step 2: Room Selection (Only clean / inspected & vacant)
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');

  // Step 3: Duration & Guest Counts
  const [nights, setNights] = useState(2);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [occupants, setOccupants] = useState<AdditionalOccupant[]>([]);
  const [newOccName, setNewOccName] = useState('');
  const [newOccRel, setNewOccRel] = useState('Spouse');

  // Step 4: Identification & OCR Capture
  const [idCaptured, setIdCaptured] = useState(false);
  const [idDocType, setIdDocType] = useState('Passport');
  const [idDocNumber, setIdDocNumber] = useState('');

  // Step 5: Payment / Deposit
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('Walk-in guest reception check-in');

  // Ready rooms
  const availableRooms = rooms.filter(r => {
    if (r.roomStatus !== 'vacant') return false;
    if (r.housekeepingStatus !== 'clean' && r.housekeepingStatus !== 'inspected') return false;
    if (roomTypeFilter !== 'all' && r.type !== roomTypeFilter) return false;
    return true;
  });

  const selectedRoom = rooms.find(r => r.number === selectedRoomNumber);
  const roomRate = selectedRoom ? selectedRoom.ratePerNight : 250;
  const totalRoomCharge = roomRate * nights;
  const totalTax = totalRoomCharge * 0.10;
  const estimatedTotal = totalRoomCharge + totalTax;

  // Search existing guest profiles
  const matchingGuests = guests.filter(g => {
    if (!guestSearchQuery) return false;
    const q = guestSearchQuery.toLowerCase();
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
    return (
      g.id.toLowerCase().includes(q) ||
      fullName.includes(q) ||
      g.phone.includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.passportNumber.toLowerCase().includes(q)
    );
  });

  const handleSelectGuest = (g: Guest) => {
    setSelectedGuest(g);
    setIdCaptured(true);
    setIdDocType(g.idType || 'Passport');
    setIdDocNumber(g.idNumber || g.passportNumber);
    setGuestSearchQuery('');
  };

  const handleAddOccupant = () => {
    if (!newOccName.trim()) return;
    setOccupants(prev => [
      ...prev,
      { id: `OCC-${Date.now()}`, name: newOccName, relationship: newOccRel }
    ]);
    setNewOccName('');
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGuest) {
      onAddToast({ type: 'warning', title: 'Guest Profile Required', message: 'Select an existing guest or register a new one.' });
      return;
    }

    if (!selectedRoom) {
      onAddToast({ type: 'warning', title: 'Room Selection Required', message: 'Select an available ready room.' });
      return;
    }

    onCompleteWalkInCheckIn({
      guest: selectedGuest,
      room: selectedRoom,
      nights,
      adults,
      children,
      additionalOccupants: occupants,
      depositPaid: depositAmount || estimatedTotal * 0.5,
      paymentMethod,
      specialRequests,
    });

    onAddToast({
      type: 'success',
      title: '9. Walk-In Check-In Complete',
      message: `${selectedGuest.firstName} ${selectedGuest.lastName} checked into Room #${selectedRoom.number}. RFID key encoded.`,
    });

    // Reset Form
    setSelectedGuest(null);
    setSelectedRoomNumber('');
    setIdCaptured(false);
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
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Walk-in Guest Management & Fast-Track Check-In
            </h2>
            <p className="text-xs text-gray-500">
              For guests arriving without prior reservations. Links CRM lookup, live room inventory, ID capture, payment, and room check-in.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToRegistration}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> 2. Register New Guest
          </button>
          <button
            type="button"
            onClick={onNavigateToScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800"
          >
            <Scan className="w-3.5 h-3.5" /> 7. ID OCR Scanner
          </button>
        </div>
      </div>

      <form onSubmit={handleWalkInSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Guest Lookup, Room Selection & Details (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Step 1: Guest Profile Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                1. Search Existing Guest Profile or Register
              </h3>
              {selectedGuest && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Profile Attached: {selectedGuest.id}
                </span>
              )}
            </div>

            {selectedGuest ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={selectedGuest.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {selectedGuest.firstName} {selectedGuest.lastName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {selectedGuest.email} · {selectedGuest.phone} · {selectedGuest.nationality}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Change Guest
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search guest by name, phone, email, or passport number..."
                    value={guestSearchQuery}
                    onChange={e => setGuestSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                  />
                </div>

                {matchingGuests.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl max-h-40 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 shadow-md">
                    {matchingGuests.map(g => (
                      <div
                        key={g.id}
                        onClick={() => handleSelectGuest(g)}
                        className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white">{g.firstName} {g.lastName}</span>
                          <span className="text-gray-400 ml-2">({g.id}) · {g.phone}</span>
                        </div>
                        <span className="text-indigo-600 font-bold">Select →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3 & 4: Room Selection & Live Readiness */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                3 & 4. Live Available Rooms Ready for Check-In ({availableRooms.length} Ready)
              </h3>
              <select
                value={roomTypeFilter}
                onChange={e => setRoomTypeFilter(e.target.value)}
                className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <option value="all">All Room Types</option>
                <option value="Deluxe King">Deluxe King</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Superior Twin">Superior Twin</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {availableRooms.map(r => {
                const isSelected = selectedRoomNumber === r.number;
                return (
                  <button
                    type="button"
                    key={r.number}
                    onClick={() => setSelectedRoomNumber(r.number)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">#{r.number}</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {r.housekeepingStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{r.type}</p>
                    <p className="text-[10px] text-gray-400">Floor {r.floor} · Max {r.capacity} Guests</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">${r.ratePerNight} / night</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 6: Stay Details & Additional Occupants */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              6. Stay Duration & Number of Guests
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Nights *</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={nights}
                  onChange={e => setNights(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Adults *</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Children</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={children}
                  onChange={e => setChildren(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Additional Occupants */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase text-gray-500 block mb-1.5">Additional Occupants ({occupants.length})</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Occupant Full Name"
                  value={newOccName}
                  onChange={e => setNewOccName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
                <select
                  value={newOccRel}
                  onChange={e => setNewOccRel(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddOccupant}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>

              {occupants.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {occupants.map((occ, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                      {occ.name} ({occ.relationship})
                      <button
                        type="button"
                        onClick={() => setOccupants(prev => prev.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: ID Capture, Payment & Check-In Action (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Step 7: Capture Identification Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-indigo-500" /> 7. Identification Document
              </span>
              {idCaptured && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Doc Type</label>
                <select
                  value={idDocType}
                  onChange={e => setIdDocType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                >
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Driver License">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Document Number</label>
                <input
                  type="text"
                  placeholder="Doc Number e.g. USA-991823"
                  value={idDocNumber}
                  onChange={e => {
                    setIdDocNumber(e.target.value);
                    if (e.target.value) setIdCaptured(true);
                  }}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIdCaptured(true);
                  setIdDocNumber('PASS-WLK-88291');
                  onAddToast({ type: 'info', title: 'Document Verified', message: 'Simulated passport scan verified.' });
                }}
                className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Capture / Scan via Camera
              </button>
            </div>
          </div>

          {/* Step 8: Folio Deposit & Estimated Total */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-700 pb-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> 8. Billing & Deposit
            </span>

            <div className="text-xs space-y-1.5 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Room Charges ({nights} nights @ ${roomRate}):</span>
                <span className="font-bold">${totalRoomCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>City & Occupancy Tax (10%):</span>
                <span>${totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-gray-700">
                <span>Estimated Stay Total:</span>
                <span className="text-indigo-600 dark:text-indigo-400">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Initial Deposit Paid *
                </label>
                <input
                  type="number"
                  value={depositAmount || (estimatedTotal * 0.5)}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                >
                  <option value="Credit Card">Credit Card (Stripe Terminal)</option>
                  <option value="Cash">Cash (Front Desk Drawer)</option>
                  <option value="Apple Pay">Apple Pay / Contactless</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 9: Complete Check-In Button */}
          <button
            type="submit"
            disabled={!selectedGuest || !selectedRoom}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" /> 9. Complete Walk-In & Issue Key
          </button>
        </div>
      </form>
    </div>
  );
};
