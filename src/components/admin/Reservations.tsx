import React, { useState } from 'react';
import {
  Search, Filter, Plus, ChevronDown, Calendar, Users,
  BedDouble, Clock, Download, Eye, Edit2, X, CheckCircle
} from 'lucide-react';
import { reservations, guests, rooms, generateBookingRef } from '../../data/mockData';
import type { Reservation } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const FILTERS = ['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled', 'Pending'];
const SOURCES = ['All Sources', 'Direct', 'Booking.com', 'Expedia', 'Walk-in', 'Phone'];

export const Reservations: React.FC = () => {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [source, setSource] = useState('All Sources');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ guestName: '', roomType: '', checkIn: '', checkOut: '', adults: 2, children: 0 });
  const [showGantt, setShowGantt] = useState(false);

  const filtered = reservations.filter(r => {
    const matchSearch = r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.includes(search);
    const matchFilter = filter === 'All' || r.status.replace('-', ' ').toLowerCase() === filter.toLowerCase() ||
      (filter === 'Checked-In' && r.status === 'checked-in') ||
      (filter === 'Checked-Out' && r.status === 'checked-out');
    const matchSource = source === 'All Sources' || r.bookingSource === source;
    return matchSearch && matchFilter && matchSource;
  });

  const handleCreateBooking = () => {
    const ref = generateBookingRef();
    addToast({ type: 'success', title: 'Reservation Created', message: `Booking ${ref} confirmed.` });
    setShowNewModal(false);
    setNewBooking({ guestName: '', roomType: '', checkIn: '', checkOut: '', adults: 2, children: 0 });
  };

  const ganttDays = ['Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5'];
  const ganttColors: Record<string, string> = {
    'checked-in': '#3b82f6', 'confirmed': '#10b981', 'checked-out': '#9ca3af',
    'cancelled': '#ef4444', 'pending': '#f59e0b',
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Reservations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{reservations.length} total · {reservations.filter(r => r.status === 'checked-in').length} active stays</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGantt(!showGantt)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showGantt ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Calendar className="w-4 h-4" />
            {showGantt ? 'Table View' : 'Calendar View'}
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Checked In', count: reservations.filter(r => r.status === 'checked-in').length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Pending', count: reservations.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Total Value', count: `$${reservations.reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Gantt Chart */}
      {showGantt && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reservation Calendar</h3>
          <div className="overflow-x-auto">
            <div style={{ minWidth: 700 }}>
              {/* Header */}
              <div className="flex">
                <div className="w-32 flex-shrink-0 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Room</div>
                {ganttDays.map(d => (
                  <div key={d} className={`flex-1 py-2 text-center text-xs font-semibold ${d === 'Oct 30' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} border-l border-gray-100 dark:border-gray-700`}>{d}</div>
                ))}
              </div>
              {/* Rows */}
              {rooms.slice(0, 8).map(room => {
                const res = reservations.filter(r => r.roomNumber === room.number);
                return (
                  <div key={room.id} className="flex items-center border-t border-gray-100 dark:border-gray-700" style={{ height: 40 }}>
                    <div className="w-32 flex-shrink-0 flex items-center gap-1.5 pr-2">
                      <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Room {room.number}</p>
                        <p className="text-xs text-gray-400" style={{ fontSize: 10 }}>{room.type}</p>
                      </div>
                    </div>
                    <div className="flex-1 relative flex h-full">
                      {ganttDays.map((_, di) => (
                        <div key={di} className="flex-1 border-l border-gray-100 dark:border-gray-700 h-full relative">
                          {res.map(r => {
                            const checkInIdx = ganttDays.indexOf(
                              new Date(r.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            );
                            const checkOutIdx = ganttDays.indexOf(
                              new Date(r.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            );
                            if (di === checkInIdx && checkInIdx !== -1) {
                              const span = Math.max(1, checkOutIdx - checkInIdx);
                              return (
                                <div
                                  key={r.id}
                                  className="absolute top-1 bottom-1 rounded-md flex items-center px-2 text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity shadow-sm overflow-hidden whitespace-nowrap"
                                  style={{ left: 2, width: `calc(${span * 100}% - 4px)`, background: ganttColors[r.status] || '#3b82f6' }}
                                  onClick={() => setSelected(r)}
                                  title={r.guestName}
                                >
                                  {r.guestName}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Legend */}
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                {Object.entries(ganttColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-3 h-3 rounded" style={{ background: color }} />
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, reference, or room..."
            className="input-field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="input-field w-auto text-xs py-1.5"
          >
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Status</th>
                <th>Payment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(res => (
                <tr key={res.id} className="table-row-hover">
                  <td>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{res.bookingRef}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {res.guestName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{res.guestName}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Rm {res.roomNumber}</p>
                      <p className="text-xs text-gray-400">{res.roomType}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-400">{res.checkIn}</td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-400">{res.checkOut}</td>
                  <td className="text-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{res.nights}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">${res.totalAmount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{res.bookingSource}</span>
                  </td>
                  <td><StatusBadge status={res.status} /></td>
                  <td><StatusBadge status={res.paymentStatus} /></td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelected(res)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToast({ type: 'info', title: 'Edit Reservation', message: 'Feature available in full version.' })}
                        className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No reservations found</p>
          </div>
        )}
      </div>

      {/* Reservation Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Reservation — ${selected?.bookingRef}`} size="lg">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.guestName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selected.roomType} · Room {selected.roomNumber}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Check-In', value: selected.checkIn, icon: <Calendar className="w-4 h-4" /> },
                { label: 'Check-Out', value: selected.checkOut, icon: <Calendar className="w-4 h-4" /> },
                { label: 'Guests', value: `${selected.adults} adults, ${selected.children} children`, icon: <Users className="w-4 h-4" /> },
                { label: 'Duration', value: `${selected.nights} nights`, icon: <Clock className="w-4 h-4" /> },
                { label: 'Rate', value: `$${selected.ratePerNight}/night`, icon: <BedDouble className="w-4 h-4" /> },
                { label: 'Total', value: `$${selected.totalAmount.toLocaleString()}`, icon: <CheckCircle className="w-4 h-4" /> },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-400">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {selected.specialRequests && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Special Requests</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">{selected.specialRequests}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Booking Source</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{selected.bookingSource}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Status</p>
                <StatusBadge status={selected.paymentStatus} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {selected.status === 'confirmed' && (
                <button
                  onClick={() => { addToast({ type: 'success', title: 'Check-In Processed', message: `${selected.guestName} checked in to Room ${selected.roomNumber}` }); setSelected(null); }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  ✓ Check-In Guest
                </button>
              )}
              <button
                onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Full edit functionality in production.' })}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit Reservation
              </button>
              <button
                onClick={() => addToast({ type: 'info', title: 'Confirmation Sent', message: `Email sent to ${selected.guestName}` })}
                className="p-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Send Email"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Reservation Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="New Reservation" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guest Name *</label>
              <input className="input-field" placeholder="Full name" value={newBooking.guestName} onChange={e => setNewBooking({ ...newBooking, guestName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Check-In *</label>
              <input type="date" className="input-field" value={newBooking.checkIn} onChange={e => setNewBooking({ ...newBooking, checkIn: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Check-Out *</label>
              <input type="date" className="input-field" value={newBooking.checkOut} onChange={e => setNewBooking({ ...newBooking, checkOut: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
              <select className="input-field" value={newBooking.roomType} onChange={e => setNewBooking({ ...newBooking, roomType: e.target.value })}>
                <option value="">Select room type</option>
                {['Deluxe King', 'Deluxe Twin', 'Junior Suite', 'Executive Suite', 'Family Suite', 'Presidential Suite'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Adults</label>
              <input type="number" min={1} max={6} className="input-field" value={newBooking.adults} onChange={e => setNewBooking({ ...newBooking, adults: +e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreateBooking}
              disabled={!newBooking.guestName || !newBooking.checkIn || !newBooking.checkOut}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
            >
              Create Reservation
            </button>
            <button onClick={() => setShowNewModal(false)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
