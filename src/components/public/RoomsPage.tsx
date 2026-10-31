import React, { useState } from 'react';
import { Star, Users, Maximize, BedDouble, ChevronRight, CheckCircle } from 'lucide-react';
import { rooms } from '../../data/mockData';

interface RoomsPageProps {
  setCurrentPage: (page: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ setCurrentPage }) => {
  const [selected, setSelected] = useState<(typeof rooms)[0] | null>(null);
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Deluxe King', 'Deluxe Twin', 'Junior Suite', 'Executive Suite', 'Presidential Suite', 'Family Suite'];
  const publicRooms = rooms.filter(r => r.status !== 'maintenance');
  const filtered = publicRooms.filter(r => typeFilter === 'All' || r.type === typeFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80" alt="Rooms" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white font-serif mb-2">Rooms & Suites</h1>
            <p className="text-white/80">Discover your perfect sanctuary</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8 justify-center">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${typeFilter === t ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(room => (
            <div
              key={room.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 group cursor-pointer"
              onClick={() => setSelected(room)}
            >
              <div className="relative overflow-hidden">
                <img src={room.image} alt={room.type} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg font-medium">{room.size}</span>
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg font-medium">{room.view}</span>
                </div>
                {room.status === 'occupied' && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500/90 text-white text-xs rounded-lg font-medium">Occupied</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">{room.type}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room {room.number} · Floor {room.floor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${room.ratePerNight}</p>
                    <p className="text-xs text-gray-400">/night</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{room.capacity} guests</span>
                  <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{room.bedType}</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{room.size}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.features.slice(0, 4).map(f => (
                    <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{f}</span>
                  ))}
                  {room.features.length > 4 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">+{room.features.length - 4}</span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage('book-now')}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${room.status === 'occupied' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'}`}
                  disabled={room.status === 'occupied'}
                >
                  {room.status === 'occupied' ? 'Currently Occupied' : (<>Book This Room <ChevronRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-luxury-lg" onClick={e => e.stopPropagation()}>
            <img src={selected.image} alt={selected.type} className="w-full h-64 object-cover rounded-t-2xl" />
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{selected.type}</h2>
                  <p className="text-gray-500 dark:text-gray-400">Floor {selected.floor} · {selected.size} · {selected.view}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${selected.ratePerNight}</p>
                  <p className="text-sm text-gray-400">/night</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{selected.description}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Users className="w-4 h-4" />, label: 'Max Guests', value: `${selected.capacity} people` },
                  { icon: <BedDouble className="w-4 h-4" />, label: 'Bed Type', value: selected.bedType },
                  { icon: <Maximize className="w-4 h-4" />, label: 'Room Size', value: selected.size },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                    <div className="flex justify-center text-gray-500 mb-1">{item.icon}</div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Room Features</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {selected.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setCurrentPage('book-now'); setSelected(null); }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
                >
                  Book Now — From ${selected.ratePerNight}/night
                </button>
                <button onClick={() => setSelected(null)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
