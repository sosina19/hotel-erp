import React, { useState } from 'react';
import { DoorOpen, DoorClosed, Clock, Users, BedDouble, CreditCard, Check, AlertCircle } from 'lucide-react';
import { todayArrivals, todayDepartures, rooms } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export const FrontDesk: React.FC = () => {
  const { addToast } = useApp();
  const [arrivals, setArrivals] = useState(todayArrivals);
  const [departures, setDepartures] = useState(todayDepartures);
  const [checkInModal, setCheckInModal] = useState<(typeof todayArrivals)[0] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkOutModal, setCheckOutModal] = useState<(typeof todayDepartures)[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures' | 'inhouse'>('arrivals');

  const availableRooms = rooms.filter(r => r.status === 'clean');

  const handleCheckIn = () => {
    if (!selectedRoom) return;
    setArrivals(prev => prev.map(a =>
      a.id === checkInModal?.id ? { ...a, status: 'checked-in' } : a
    ));
    addToast({
      type: 'success',
      title: 'Check-In Complete',
      message: `${checkInModal?.guestName} checked in to Room ${selectedRoom}. Keys programmed.`,
    });
    setCheckInModal(null);
    setSelectedRoom('');
  };

  const handleCheckOut = () => {
    setDepartures(prev => prev.map(d =>
      d.id === checkOutModal?.id ? { ...d, status: 'checked-out', billSettled: true } : d
    ));
    addToast({
      type: 'success',
      title: 'Check-Out Complete',
      message: `${checkOutModal?.guestName} checked out. Bill settled — $${checkOutModal?.totalBill}.`,
    });
    setCheckOutModal(null);
  };

  const inHouseGuests = [
    { name: 'James Worthington', room: '101', type: 'Deluxe King', checkOut: '2026-11-02', nights: 4, tier: 'Platinum' },
    { name: 'Sophia Chen', room: '201', type: 'Executive Suite', checkOut: '2026-11-04', nights: 7, tier: 'Gold' },
    { name: 'Marcus Adeyemi', room: '302', type: 'Junior Suite', checkOut: '2026-11-01', nights: 2, tier: 'Silver' },
    { name: 'The Morrison Family', room: '501', type: 'Family Suite', checkOut: '2026-11-03', nights: 5, tier: 'Silver' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Front Desk</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Friday, October 30, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'arrivals', label: `Arrivals (${arrivals.length})`, icon: <DoorOpen className="w-4 h-4" /> },
            { key: 'departures', label: `Departures (${departures.length})`, icon: <DoorClosed className="w-4 h-4" /> },
            { key: 'inhouse', label: `In-House (${inHouseGuests.length})`, icon: <BedDouble className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Expected Arrivals', value: arrivals.filter(a => a.status !== 'checked-in').length, color: 'text-emerald-600', icon: '🛎️' },
          { label: 'Pending Departures', value: departures.filter(d => d.status !== 'checked-out').length, color: 'text-amber-600', icon: '🚪' },
          { label: 'Currently In-House', value: inHouseGuests.length, color: 'text-blue-600', icon: '🏠' },
          { label: 'Rooms Available', value: availableRooms.length, color: 'text-purple-600', icon: '🛏️' },
        ].map(s => (
          <div key={s.label} className="kpi-card flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrivals Tab */}
      {activeTab === 'arrivals' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-emerald-500" />
            Today's Arrivals
          </h3>
          {arrivals.map(arrival => (
            <div key={arrival.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {arrival.guestName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white">{arrival.guestName}</p>
                  <span className="text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">{arrival.bookingRef}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{arrival.roomType}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{arrival.adults} guests</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{arrival.nights} nights</span>
                  <span>{arrival.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={arrival.status} />
                {arrival.status !== 'checked-in' ? (
                  <button
                    onClick={() => setCheckInModal(arrival)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <DoorOpen className="w-4 h-4" />
                    Check-In
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <Check className="w-4 h-4" /> Checked In
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departures Tab */}
      {activeTab === 'departures' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <DoorClosed className="w-5 h-5 text-amber-500" />
            Today's Departures
          </h3>
          {departures.map(dep => (
            <div key={dep.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {dep.guestName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{dep.guestName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Room {dep.roomNumber}</span>
                  <span>·</span>
                  <span>{dep.roomType}</span>
                  <span>·</span>
                  <span>{dep.nights} nights</span>
                  <span>·</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">${dep.totalBill}</span>
                  {!dep.billSettled && (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" /> Bill pending
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={dep.billSettled ? 'paid' : 'pending'} />
                {dep.status !== 'checked-out' ? (
                  <button
                    onClick={() => setCheckOutModal(dep)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <DoorClosed className="w-4 h-4" />
                    Check-Out
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                    <Check className="w-4 h-4" /> Done
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-House Tab */}
      {activeTab === 'inhouse' && (
        <div className="card overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Type</th>
                <th>Check-Out</th>
                <th>Nights Left</th>
                <th>Tier</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {inHouseGuests.map(g => (
                <tr key={g.room} className="table-row-hover">
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {g.name.charAt(0)}
                      </div>
                      <span className="font-medium">{g.name}</span>
                    </div>
                  </td>
                  <td className="font-semibold">{g.room}</td>
                  <td className="text-gray-500 dark:text-gray-400">{g.type}</td>
                  <td>{g.checkOut}</td>
                  <td>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{g.nights}</span>
                  </td>
                  <td><StatusBadge status={g.tier} /></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => addToast({ type: 'info', title: 'Guest Folio', message: `Opening folio for ${g.name}` })} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Folio</button>
                      <button onClick={() => addToast({ type: 'success', title: 'Message Sent', message: `Housekeeping request for Room ${g.room}` })} className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors">Service</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Check-In Modal */}
      <Modal isOpen={!!checkInModal} onClose={() => setCheckInModal(null)} title="Process Check-In" size="md">
        {checkInModal && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{checkInModal.guestName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{checkInModal.roomType} · {checkInModal.adults} adults · {checkInModal.nights} nights</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign Room *</label>
              <select
                className="input-field"
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
              >
                <option value="">Select available room...</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.number}>
                    Room {r.number} — {r.type} (Floor {r.floor}) · ${r.ratePerNight}/night
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                {(() => {
                  const room = availableRooms.find(r => r.number === selectedRoom);
                  return room ? (
                    <div className="flex items-center gap-2 text-sm">
                      <BedDouble className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Room {room.number} — {room.type} · Floor {room.floor} · {room.view}</span>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="space-y-2">
              {[
                'ID Verification Complete',
                'Payment Pre-Authorization Confirmed',
                'Special Requests Communicated',
                'Digital Key Programmed',
              ].map(step => (
                <div key={step} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {step}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCheckIn}
                disabled={!selectedRoom}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <DoorOpen className="w-5 h-5" />
                Complete Check-In
              </button>
              <button onClick={() => setCheckInModal(null)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Check-Out Modal */}
      <Modal isOpen={!!checkOutModal} onClose={() => setCheckOutModal(null)} title="Process Check-Out" size="md">
        {checkOutModal && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <DoorClosed className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{checkOutModal.guestName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Room {checkOutModal.roomNumber} · {checkOutModal.roomType}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Room charges ({checkOutModal.nights} nights)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${(checkOutModal.totalBill * 0.75).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Extras & Services</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${(checkOutModal.totalBill * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${(checkOutModal.totalBill * 0.10).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${checkOutModal.totalBill}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Card on file: **** **** **** 4242</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Charge ${checkOutModal.totalBill} to this card</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCheckOut}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Settle & Check-Out
              </button>
              <button onClick={() => setCheckOutModal(null)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
