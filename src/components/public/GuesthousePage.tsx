import React, { useState } from 'react';
import { Star, Leaf, Heart, MapPin, Coffee, Wifi, Car, PawPrint, ChevronRight } from 'lucide-react';
import { guesthouseRooms, propertyConfigs } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

interface GuesthousePageProps {
  setCurrentPage: (page: string) => void;
}

export const GuesthousePage: React.FC<GuesthousePageProps> = ({ setCurrentPage }) => {
  const { addToast } = useApp();
  const config = propertyConfigs['guesthouse'];
  const [selectedRoom, setSelectedRoom] = useState<(typeof guesthouseRooms)[0] | null>(null);

  const amenities = [
    { icon: <Coffee className="w-5 h-5" />, title: 'Homemade Breakfast', desc: 'Freshly baked goods and farm eggs every morning' },
    { icon: <Wifi className="w-5 h-5" />, title: 'Free High-Speed WiFi', desc: 'Stay connected throughout your visit' },
    { icon: <Leaf className="w-5 h-5" />, title: 'Organic Gardens', desc: 'Stroll through our award-winning cottage gardens' },
    { icon: <PawPrint className="w-5 h-5" />, title: 'Pet Friendly', desc: 'Well-behaved pets welcome (£10/night supplement)' },
    { icon: <Car className="w-5 h-5" />, title: 'Free Parking', desc: 'Secure off-road parking for all guests' },
    { icon: <Heart className="w-5 h-5" />, title: 'Personal Service', desc: 'Your hosts live on-site and are always available' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <img src={config.heroImage} alt={config.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 px-4 py-1.5 rounded-full mb-6">
            <Leaf className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200 text-sm font-medium">Eco-Certified · Cotswolds, UK</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-4 drop-shadow-2xl">{config.name}</h1>
          <p className="text-2xl text-white/90 font-light italic mb-2">{config.tagline}</p>
          <div className="flex items-center gap-1 mb-8">
            {Array.from({ length: config.stars }).map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            <span className="text-white/70 text-sm ml-2">4.9/5 · 847 reviews</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('book-now')}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-luxury hover:scale-105"
            >
              Check Availability
            </button>
            <button
              onClick={() => setCurrentPage('rooms')}
              className="px-8 py-3.5 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-xl font-semibold text-lg hover:bg-white/30 transition-all"
            >
              Our Rooms
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-white/60 text-sm">
          <MapPin className="w-4 h-4" /> {config.address}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">A Warm Welcome Awaits</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif mb-4 leading-tight">
              More Than a Stay —<br />A Genuine Escape
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Nestled in the heart of the Cotswolds, The Willow Retreat is a family-run guest house where every detail is personal. We believe that true hospitality is about making you feel at home — with freshly brewed tea, homemade scones, and genuine conversation.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Our four unique rooms each have their own character and charm, set amidst acres of organic gardens and rolling countryside views.
            </p>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl">🌿</span>
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">Eco Certified Property</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Solar-powered · Organic gardens · Zero single-use plastic</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
              'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
            ].map((img, i) => (
              <img key={i} src={img} alt="" className="rounded-xl object-cover w-full h-36 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-2">Accommodations</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Our Unique Rooms</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {guesthouseRooms.map(room => (
              <div
                key={room.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-shadow group cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="relative overflow-hidden h-52">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${room.status === 'available' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {room.status === 'available' ? 'Available' : 'Occupied'}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">{room.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">£{room.price}</p>
                      <p className="text-xs text-gray-400">/night</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.features.map(f => (
                      <span key={f} className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">{f}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage('book-now')}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${room.status === 'occupied' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                    disabled={room.status === 'occupied'}
                  >
                    {room.status === 'occupied' ? 'Currently Occupied' : <>Book This Room <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-2">What's Included</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map(item => (
              <div key={item.title} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-luxury transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 guesthouse-gradient">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white font-serif mb-4">Ready for Your Countryside Escape?</h2>
          <p className="text-white/80 mb-8">Book directly for the best rates and a complimentary cream tea on arrival</p>
          <button onClick={() => setCurrentPage('book-now')} className="px-10 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all hover:scale-105 shadow-luxury">
            Check Availability
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold font-serif text-lg">🌿 {config.name}</p>
            <p className="text-sm">{config.address}</p>
            <p className="text-sm">{config.phone}</p>
          </div>
          <p className="text-xs text-center">© 2026 {config.name}. All rights reserved. · Powered by LuxeStay ERP</p>
        </div>
      </footer>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={selectedRoom.name} size="md">
          <div className="p-6 space-y-4">
            <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-52 object-cover rounded-xl" />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">{selectedRoom.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedRoom.type} · Up to {selectedRoom.capacity} guests</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">£{selectedRoom.price}</p>
                <p className="text-xs text-gray-400">/night incl. breakfast</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedRoom.features.map(f => (
                <span key={f} className="text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full">{f}</span>
              ))}
            </div>
            <button onClick={() => { setCurrentPage('book-now'); setSelectedRoom(null); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              Book {selectedRoom.name}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
