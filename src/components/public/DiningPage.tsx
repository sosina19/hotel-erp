import React, { useState } from 'react';
import { Clock, Star, AlertCircle } from 'lucide-react';
import { menuItems } from '../../data/mockData';
import type { MenuItem } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

interface DiningPageProps {
  setCurrentPage: (page: string) => void;
}

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Wines'] as const;

export const DiningPage: React.FC<DiningPageProps> = ({ setCurrentPage }) => {
  const { addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Mains');
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveForm, setReserveForm] = useState({ name: '', email: '', date: '', time: '', guests: '2', notes: '' });
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categoryItems = menuItems.filter(i => i.category === activeCategory);

  const handleReserve = () => {
    addToast({ type: 'success', title: 'Table Reserved', message: `Table for ${reserveForm.guests} on ${reserveForm.date} at ${reserveForm.time}. Confirmation sent to ${reserveForm.email}.` });
    setShowReserveModal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80" alt="Dining" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 flex items-end pb-8 px-6">
          <div>
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-1">Fine Dining</p>
            <h1 className="text-4xl font-bold text-white font-serif mb-2">Ember & Ash Restaurant</h1>
            <p className="text-white/80">An extraordinary culinary journey crafted by Chef Antoine Dupont</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-white/70 text-sm">Michelin Recognized · Open Daily 6PM – 11PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Reserve a Table CTA */}
        <div className="flex items-center justify-between mb-10 p-5 bg-gray-900 dark:bg-gray-800 rounded-2xl">
          <div>
            <h3 className="text-white font-bold text-lg">Reserve Your Table Tonight</h3>
            <p className="text-gray-400 text-sm mt-0.5">Open daily · Lunch 12-3PM · Dinner 6-11PM · Dress code: Smart Casual</p>
          </div>
          <button
            onClick={() => setShowReserveModal(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all hover:scale-105 whitespace-nowrap"
          >
            Reserve a Table
          </button>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categoryItems.map(item => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-luxury transition-all cursor-pointer group ${!item.available ? 'opacity-60' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300" />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">86'd</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">{item.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white flex-shrink-0">${item.price}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />{item.prepTime} min
                  </span>
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chef Note */}
        <div className="mt-10 p-6 bg-gray-900 text-white rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-2xl flex-shrink-0">👨‍🍳</div>
            <div>
              <p className="font-bold text-lg">A Note from Chef Antoine Dupont</p>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed italic">
                "Every dish at Ember & Ash is a story. I source only the finest seasonal ingredients from trusted farmers, crafting menus that celebrate the alchemy between fire, time, and tradition. I invite you to join me on this journey."
              </p>
              <p className="text-amber-400 text-xs mt-2 font-semibold">— Chef Antoine Dupont · Executive Chef, Grand Luxe Palace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.name || ''} size="md">
        {selectedItem && (
          <div className="p-6 space-y-4">
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-52 object-cover rounded-xl" />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">{selectedItem.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItem.category}</p>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${selectedItem.price}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedItem.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Prep: {selectedItem.prepTime} min</span>
              {selectedItem.available ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Available Now</span>
              ) : (
                <span className="text-red-500 font-medium">Currently 86'd</span>
              )}
            </div>
            {selectedItem.allergens && selectedItem.allergens.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">⚠️ Contains Allergens</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">{selectedItem.allergens.join(', ')}</p>
              </div>
            )}
            <button
              onClick={() => { setShowReserveModal(true); setSelectedItem(null); }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
            >
              Reserve a Table
            </button>
          </div>
        )}
      </Modal>

      {/* Reserve Table Modal */}
      <Modal isOpen={showReserveModal} onClose={() => setShowReserveModal(false)} title="Reserve a Table" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input className="input-field" placeholder="Your name" value={reserveForm.name} onChange={e => setReserveForm({ ...reserveForm, name: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <input className="input-field" type="email" placeholder="email@example.com" value={reserveForm.email} onChange={e => setReserveForm({ ...reserveForm, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date *</label>
              <input className="input-field" type="date" value={reserveForm.date} onChange={e => setReserveForm({ ...reserveForm, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Time *</label>
              <select className="input-field" value={reserveForm.time} onChange={e => setReserveForm({ ...reserveForm, time: e.target.value })}>
                <option value="">Select time</option>
                {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guests</label>
              <select className="input-field" value={reserveForm.guests} onChange={e => setReserveForm({ ...reserveForm, guests: e.target.value })}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Occasion</label>
              <select className="input-field">
                <option>Dinner</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Business</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Allergies, celebrations, preferences..." value={reserveForm.notes} onChange={e => setReserveForm({ ...reserveForm, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReserve}
              disabled={!reserveForm.name || !reserveForm.email || !reserveForm.date || !reserveForm.time}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
            >
              Confirm Reservation
            </button>
            <button onClick={() => setShowReserveModal(false)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
