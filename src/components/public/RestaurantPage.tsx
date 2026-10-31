import React, { useState } from 'react';
import { Star, Clock, ChefHat, Phone, MapPin, Instagram, ArrowRight } from 'lucide-react';
import { menuItems, propertyConfigs } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

interface RestaurantPageProps {
  setCurrentPage: (page: string) => void;
}

const GALLERY = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
];

export const RestaurantPage: React.FC<RestaurantPageProps> = ({ setCurrentPage }) => {
  const { addToast } = useApp();
  const config = propertyConfigs['restaurant'];
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: '2', occasion: 'Dinner' });

  const signature = menuItems.filter(i => i.tags.includes("Signature") || i.tags.includes("Chef's Pick")).slice(0, 6);

  const handleReserve = () => {
    addToast({ type: 'success', title: 'Table Reserved!', message: `Reservation for ${form.guests} on ${form.date} at ${form.time} confirmed.` });
    setShowReserveModal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero */}
      <section className="relative h-[90vh] overflow-hidden">
        <img src={config.heroImage} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-[0.3em] mb-4">Fine Dining Experience</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-4 drop-shadow-2xl">{config.name}</h1>
          <p className="text-xl text-white/80 font-light italic mb-2">{config.tagline}</p>
          <p className="text-white/60 text-sm mb-8 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {config.address}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowReserveModal(true)}
              className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all shadow-luxury hover:scale-105"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => setCurrentPage('menu')}
              className="px-10 py-4 bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 text-white rounded-xl font-semibold text-lg transition-all"
            >
              View Menu
            </button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div>
            <span className="text-white/70 text-sm">Michelin Recognized · 4.9/5 · 1,240 reviews</span>
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '🕕', label: 'Lunch', value: '12:00 – 15:00' },
            { icon: '🕖', label: 'Dinner', value: '18:00 – 23:00' },
            { icon: '📅', label: 'Open', value: 'Tue – Sun' },
            { icon: '👔', label: 'Dress Code', value: 'Smart Casual' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <div className="text-left">
                <p className="text-gray-400 text-xs">{item.label}</p>
                <p className="font-semibold text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chef Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Philosophy</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif mb-4 leading-tight">
              Flavour Born from<br />Fire & Passion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              At Ember & Ash, every dish is a meditation. Chef Antoine Dupont — trained at Le Cordon Bleu Paris and elBulli — leads a kitchen where classical French technique meets bold global inspiration. We source only from artisan farmers and sustainable fisheries.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: '14+', label: 'Years of Excellence' },
                { value: '3', label: 'Michelin Stars' },
                { value: '98%', label: 'Guest Satisfaction' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentPage('menu')} className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all">
              Explore Full Menu <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
              alt="Chef Antoine"
              className="rounded-2xl shadow-luxury-lg w-full h-96 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-luxury">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Chef Antoine Dupont</p>
                  <p className="text-xs text-gray-500">Executive Chef & Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Culinary Icons</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Signature Dishes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {signature.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-shadow group cursor-pointer" onClick={() => setCurrentPage('menu')}>
                <div className="relative overflow-hidden h-44">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <p className="text-white font-bold">{item.name}</p>
                    <span className="text-white font-bold text-lg">${item.price}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Visual Story</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Gallery</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" style={{ height: i === 0 ? '340px' : '160px' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="py-16 restaurant-gradient">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white font-serif mb-4">Join Us This Evening</h2>
          <p className="text-white/80 text-lg mb-8">Tables are limited. Reserve yours before they're gone.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowReserveModal(true)} className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-105">
              Reserve Now
            </button>
            <a href={`tel:${config.phone}`} className="flex items-center justify-center gap-2 px-10 py-4 bg-white/15 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/25 transition-all">
              <Phone className="w-5 h-5" /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold font-serif text-lg">🔥 {config.name}</p>
            <p className="text-sm">{config.address}</p>
            <p className="text-sm">{config.phone}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></button>
            <div className="text-sm text-center">
              <p>Open Tue – Sun</p>
              <p>Lunch 12–3 · Dinner 6–11</p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-800 text-center text-xs">
          © 2026 {config.name}. All rights reserved. · Powered by LuxeStay ERP
        </div>
      </footer>

      {/* Reservation Modal */}
      <Modal isOpen={showReserveModal} onClose={() => setShowReserveModal(false)} title="Reserve a Table — Ember & Ash" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input className="input-field" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date *</label>
              <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Time *</label>
              <select className="input-field" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">Select...</option>
                {['12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guests</label>
              <select className="input-field" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Occasion</label>
              <select className="input-field" value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
                {['Dinner', 'Birthday', 'Anniversary', 'Business', 'Celebration'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReserve}
              disabled={!form.name || !form.email || !form.date || !form.time}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
            >
              Confirm Reservation
            </button>
            <button onClick={() => setShowReserveModal(false)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
