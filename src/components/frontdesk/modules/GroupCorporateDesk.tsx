import React, { useState } from 'react';
import {
  Briefcase, Users, Building, Plus, CheckCircle2, DollarSign,
  FileText, Download, Printer, CreditCard, ChevronRight, Check,
  Search, Calendar, BedDouble, AlertCircle, Phone, Mail, ArrowLeft
} from 'lucide-react';
import type { GroupBooking, FDRoom } from '../types';
import { Modal } from '../../ui/Modal';

interface GroupCorporateDeskProps {
  rooms: FDRoom[];
  groups: GroupBooking[];
  onAddGroup: (group: GroupBooking) => void;
  onUpdateGroup: (id: string, updates: Partial<GroupBooking>) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const GroupCorporateDesk: React.FC<GroupCorporateDeskProps> = ({
  rooms,
  groups,
  onAddGroup,
  onUpdateGroup,
  onAddToast,
  onBack,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupBooking>(groups[0]);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Corporate Payment State
  const [corpPaymentAmount, setCorpPaymentAmount] = useState<number>(2500);
  const [corpPaymentMethod, setCorpPaymentMethod] = useState('Corporate Wire Transfer');

  // New Group Booking Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState(`GRP-CORP-${Math.floor(100 + Math.random() * 900)}`);
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
  const [newLeaderEmail, setNewLeaderEmail] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newCheckIn, setNewCheckIn] = useState('2026-11-05');
  const [newCheckOut, setNewCheckOut] = useState('2026-11-09');
  const [newRoomCount, setNewRoomCount] = useState(5);
  const [newBillingType, setNewBillingType] = useState<GroupBooking['billingArrangement']>(
    'Master Covers Room & Tax / Guest Covers Incidentals'
  );

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newLeaderName.trim()) {
      onAddToast({ type: 'warning', title: 'Required Fields', message: 'Enter Group Name and Group Leader.' });
      return;
    }

    // Generate room allocations
    const diffNights = 4;
    const assignedRooms = Array.from({ length: newRoomCount }).map((_, i) => ({
      roomNumber: `${201 + i}`,
      roomType: 'Deluxe King',
      guestName: `${newCompanyName || 'Corporate'} Delegate #${i + 1}`,
      adults: 1,
      isCheckInComplete: false,
      individualChargesTotal: 0,
    }));

    const newGroup: GroupBooking = {
      id: `GB-${Date.now()}`,
      groupCode: newGroupCode,
      groupName: newGroupName,
      groupLeader: {
        name: newLeaderName,
        phone: newLeaderPhone || '+1 (555) 019-9944',
        email: newLeaderEmail || 'coordinator@corp.com',
      },
      corporateAccount: newCompanyName ? {
        companyName: newCompanyName,
        taxId: newTaxId || 'TAX-US-9918231',
        billingContact: newLeaderName,
        creditLimit: 50000,
        directBillingApproved: true,
      } : undefined,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      nights: diffNights,
      totalRooms: newRoomCount,
      roomsAssigned: assignedRooms,
      billingArrangement: newBillingType,
      masterFolioBalance: newRoomCount * 300 * diffNights * 1.10,
      masterPayments: [],
      status: 'Confirmed',
    };

    onAddGroup(newGroup);
    setSelectedGroup(newGroup);
    setIsNewGroupModalOpen(false);

    onAddToast({
      type: 'success',
      title: 'Group Booking Created',
      message: `${newGroup.groupName} (${newGroup.groupCode}) created with ${newGroup.totalRooms} rooms allocated.`,
    });
  };

  const handleProcessCorpPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    const newPayment = {
      id: `CORP-PAY-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      method: corpPaymentMethod,
      amount: corpPaymentAmount,
      ref: `CORP-WIRE-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const newBalance = Math.max(0, selectedGroup.masterFolioBalance - corpPaymentAmount);
    onUpdateGroup(selectedGroup.id, {
      masterFolioBalance: newBalance,
      masterPayments: [...selectedGroup.masterPayments, newPayment],
    });

    setSelectedGroup(prev => ({
      ...prev,
      masterFolioBalance: newBalance,
      masterPayments: [...prev.masterPayments, newPayment],
    }));

    onAddToast({
      type: 'success',
      title: 'Corporate Payment Processed',
      message: `$${corpPaymentAmount.toLocaleString()} recorded for ${selectedGroup.groupName}. Remaining: $${newBalance.toLocaleString()}`,
    });

    setIsPaymentModalOpen(false);
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
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Group & Corporate Guest Management
            </h2>
            <p className="text-xs text-gray-500">
              Coordinate multi-room corporate delegations, group leaders, shared billing folios, and consolidated invoicing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewGroupModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 1. New Group Reservation
          </button>
        </div>
      </div>

      {/* Main Layout: Group Selector Sidebar + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Groups List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            Active Group Master Bookings ({groups.length}):
          </span>

          <div className="space-y-2">
            {groups.map(grp => {
              const isSelected = selectedGroup?.id === grp.id;
              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {grp.groupCode}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      {grp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{grp.groupName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {grp.totalRooms} Rooms · {grp.nights} Nights · Leader: {grp.groupLeader.name}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs">
                    <span className="text-gray-400">Master Folio:</span>
                    <span className="font-bold text-gray-900 dark:text-white">${grp.masterFolioBalance.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Group Master Console (8 cols) */}
        {selectedGroup && (
          <div className="lg:col-span-8 space-y-5">
            {/* Group Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{selectedGroup.groupCode}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white font-serif">{selectedGroup.groupName}</h3>
                  </div>
                  {selectedGroup.corporateAccount && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      5. Linked Corporate Account: <strong>{selectedGroup.corporateAccount.companyName}</strong> (Tax ID: {selectedGroup.corporateAccount.taxId})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <DollarSign className="w-3.5 h-3.5" /> 8. Record Corporate Payment
                  </button>
                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> 9. Generate Group Invoice
                  </button>
                </div>
              </div>

              {/* Group Leader & Shared Billing Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    4. Group Leader & Primary Contact:
                  </span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedGroup.groupLeader.name}</p>
                  <p className="text-gray-500">Phone: {selectedGroup.groupLeader.phone}</p>
                  <p className="text-gray-500">Email: {selectedGroup.groupLeader.email}</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    7. Shared Billing Arrangement:
                  </span>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">{selectedGroup.billingArrangement}</p>
                  <p className="text-gray-500">
                    Master Folio Balance: <strong className="text-gray-900 dark:text-white">${selectedGroup.masterFolioBalance.toLocaleString()}</strong>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Corporate direct billing limit: ${selectedGroup.corporateAccount?.creditLimit.toLocaleString() || 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 & 6. Multi-Room Assignments & Arrival / Departure Manifest */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    3 & 6. Multi-Room Group Manifest ({selectedGroup.roomsAssigned.length} Allocated Rooms)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Dates: {selectedGroup.checkInDate} to {selectedGroup.checkOutDate} ({selectedGroup.nights} nights)
                  </p>
                </div>

                <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-xl">
                  {selectedGroup.roomsAssigned.filter(r => r.isCheckInComplete).length} / {selectedGroup.totalRooms} Checked In
                </span>
              </div>

              {/* Table of Rooms and Guests */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase font-semibold text-[10px] text-left">
                      <th className="pb-2">Room #</th>
                      <th className="pb-2">Room Type</th>
                      <th className="pb-2">Assigned Guest / Delegate</th>
                      <th className="pb-2">Occupants</th>
                      <th className="pb-2">Check-In State</th>
                      <th className="pb-2 text-right">Individual Folio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {selectedGroup.roomsAssigned.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        <td className="py-2.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          #{item.roomNumber}
                        </td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">{item.roomType}</td>
                        <td className="py-2.5 font-semibold text-gray-900 dark:text-white">{item.guestName}</td>
                        <td className="py-2.5 text-gray-500">{item.adults} Adult</td>
                        <td className="py-2.5">
                          {item.isCheckInComplete ? (
                            <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full font-bold">
                              Checked In
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full font-bold">
                              Pending Arrival
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-mono text-gray-700 dark:text-gray-300">
                          ${item.individualChargesTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL 1: NEW GROUP RESERVATION ─── */}
      <Modal isOpen={isNewGroupModalOpen} onClose={() => setIsNewGroupModalOpen(false)} title="1. Create Group / Corporate Reservation">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Group Booking Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google Cloud Summit 2026"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Group Code *</label>
              <input
                type="text"
                value={newGroupCode}
                onChange={e => setNewGroupCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">4. Group Leader Name *</label>
              <input
                type="text"
                required
                placeholder="Organizer Name"
                value={newLeaderName}
                onChange={e => setNewLeaderName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Phone *</label>
              <input
                type="tel"
                placeholder="+1 555-0100"
                value={newLeaderPhone}
                onChange={e => setNewLeaderPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Email *</label>
              <input
                type="email"
                placeholder="coordinator@corp.com"
                value={newLeaderEmail}
                onChange={e => setNewLeaderEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">5. Company Account Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Corporate Tax ID / Registration</label>
              <input
                type="text"
                placeholder="e.g. US-TAX-992019"
                value={newTaxId}
                onChange={e => setNewTaxId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Check-In Date *</label>
              <input
                type="date"
                value={newCheckIn}
                onChange={e => setNewCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Check-Out Date *</label>
              <input
                type="date"
                value={newCheckOut}
                onChange={e => setNewCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">3. Rooms to Assign *</label>
              <input
                type="number"
                min="2"
                max="30"
                value={newRoomCount}
                onChange={e => setNewRoomCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">7. Shared Billing Arrangement *</label>
            <select
              value={newBillingType}
              onChange={e => setNewBillingType(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="Master Covers Room & Tax / Guest Covers Incidentals">
                Master Covers Room & Tax; Guest Covers Incidentals (Standard Corporate)
              </option>
              <option value="Master Folio Covers All">Master Folio Covers All (All charges on company invoice)</option>
              <option value="Individual Settlement">Individual Settlement (Guests pay separately)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewGroupModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Create Group Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 2: 9. GENERATE GROUP MASTER INVOICE ─── */}
      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="9. Consolidated Group Master Invoice">
        {selectedGroup && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 font-mono">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">CONSOLIDATED MASTER INVOICE</h4>
                  <p className="text-[10px] text-gray-400">Ref: INV-{selectedGroup.groupCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">LuxeStay Hotel ERP</p>
                  <p className="text-[10px] text-gray-400">Tax ID: HOTEL-US-882910</p>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300">
                <div>
                  <p className="font-bold">Billed To:</p>
                  <p>{selectedGroup.corporateAccount?.companyName || selectedGroup.groupName}</p>
                  <p>Attn: {selectedGroup.groupLeader.name}</p>
                  <p>Tax Reg: {selectedGroup.corporateAccount?.taxId || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p><span className="text-gray-400">Stay:</span> {selectedGroup.checkInDate} to {selectedGroup.checkOutDate}</p>
                  <p><span className="text-gray-400">Rooms:</span> {selectedGroup.totalRooms} Rooms ({selectedGroup.nights} Nights)</p>
                  <p><span className="text-gray-400">Billing:</span> {selectedGroup.billingArrangement}</p>
                </div>
              </div>

              {/* Line items */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Room Accommodation ({selectedGroup.totalRooms} rooms × {selectedGroup.nights} nights):</span>
                  <span>${(selectedGroup.totalRooms * 300 * selectedGroup.nights).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>State & City Hospitality Tax (10%):</span>
                  <span>${(selectedGroup.totalRooms * 300 * selectedGroup.nights * 0.10).toFixed(2)}</span>
                </div>
                {selectedGroup.masterPayments.map(p => (
                  <div key={p.id} className="flex justify-between text-emerald-600 font-semibold">
                    <span>Payment Received ({p.date} - {p.method}):</span>
                    <span>-${p.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span>Balance Due:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${selectedGroup.masterFolioBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Export Master Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL 3: 8. RECORD CORPORATE PAYMENT ─── */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="8. Process Corporate Account Payment">
        <form onSubmit={handleProcessCorpPayment} className="space-y-4">
          <p className="text-xs text-gray-500">
            Post payment to the master group folio.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Payment Amount ($) *</label>
            <input
              type="number"
              required
              min="1"
              value={corpPaymentAmount}
              onChange={e => setCorpPaymentAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-base"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Payment Method *</label>
            <select
              value={corpPaymentMethod}
              onChange={e => setCorpPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
            >
              <option value="Corporate Wire Transfer">Corporate Wire Transfer / ACH</option>
              <option value="Corporate Credit Card">Corporate Amex / Visa Card</option>
              <option value="Direct Company Billing Invoice">Direct Company Billing (Net 30)</option>
              <option value="Bank Check">Bank Cashier Check</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
