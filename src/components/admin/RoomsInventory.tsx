import React, { useState } from 'react';
import { BedDouble, Grid, List, Search, Wrench } from 'lucide-react';
import { rooms } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export const RoomsInventory: React.FC = () => {
  const { addToast } = useApp();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<(typeof rooms)[0] | null>(null);

  const statuses = ['All', 'Clean', 'Occupied', 'Dirty', 'Maintenance', 'Inspecting'];

  const filtered = rooms.filter(r => {
    const matchSearch = r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const statusBg: Record<string, string> = {
    clean: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10',
    occupied: 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10',
    dirty: 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10',
    maintenance: 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10',
    inspecting: 'border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10',
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Rooms & Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{rooms.length} rooms · {rooms.filter(r => r.status === 'occupied').length} occupied</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Clean', value: rooms.filter(r => r.status === 'clean').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Dirty', value: rooms.filter(r => r.status === 'dirty').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Inspecting', value: rooms.filter(r => r.status === 'inspecting').length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setStatusFilter(s.label === statusFilter ? 'All' : s.label)}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by room number or type..." className="input-field pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === s ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(room => (
            <div key={room.id} onClick={() => setSelected(room)} className={`border-2 rounded-xl p-3 cursor-pointer hover:shadow-luxury transition-all duration-200 hover:scale-105 ${statusBg[room.status] || 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-bold text-gray-900 dark:text-white text-lg">#{room.number}</span>
                <span className="text-xs font-semibold">{room.floor}F</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{room.type}</p>
              <StatusBadge status={room.status} />
              {room.currentGuest && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 truncate font-medium">{room.currentGuest}</p>
              )}
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">${room.ratePerNight}/n</p>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Rate/Night</th>
                <th>View</th>
                <th>Features</th>
                <th>Status</th>
                <th>Current Guest</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(room => (
                <tr key={room.id} className="table-row-hover cursor-pointer" onClick={() => setSelected(room)}>
                  <td className="font-bold text-lg text-gray-800 dark:text-gray-200">#{room.number}</td>
                  <td className="font-medium">{room.type}</td>
                  <td className="text-gray-500 dark:text-gray-400">Floor {room.floor}</td>
                  <td>{room.capacity} guests</td>
                  <td className="font-semibold text-gray-800 dark:text-gray-200">${room.ratePerNight}</td>
                  <td className="text-gray-500 dark:text-gray-400 text-xs">{room.view}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {room.features.slice(0, 2).map(f => (
                        <span key={f} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td><StatusBadge status={room.status} /></td>
                  <td className="text-gray-600 dark:text-gray-400 text-sm">{room.currentGuest || '—'}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); addToast({ type: 'info', title: 'Maintenance Request', message: `Room ${room.number} flagged for maintenance.` }); }} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                        <Wrench className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Room Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `Room ${selected.number} — ${selected.type}` : ''} size="md">
        {selected && (
          <div className="p-6 space-y-4">
            <img src={selected.image} alt={selected.type} className="w-full h-48 object-cover rounded-xl" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.type}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Floor {selected.floor} · {selected.size} · {selected.view}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-400">Rate per Night</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">${selected.ratePerNight}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-400">Bed Type</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{selected.bedType}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-400">Max Capacity</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{selected.capacity} guests</p>
              </div>
              {selected.currentGuest && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-400">Current Guest</p>
                  <p className="font-semibold text-blue-700 dark:text-blue-300">{selected.currentGuest}</p>
                  <p className="text-xs text-blue-500">Checkout: {selected.checkOut}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Features</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.features.map(f => (
                  <span key={f} className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">{f}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => addToast({ type: 'success', title: 'Block Updated', message: `Room ${selected.number} status updated.` })} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                Update Status
              </button>
              <button onClick={() => { addToast({ type: 'warning', title: 'Maintenance', message: `Room ${selected.number} flagged for maintenance.` }); setSelected(null); }} className="flex items-center gap-2 px-4 py-2.5 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg font-medium text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                <Wrench className="w-4 h-4" />
                Flag
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
