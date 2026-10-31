import React from 'react';
import { Star, ChevronRight, Wifi, Car, Dumbbell, Waves } from 'lucide-react';
import { propertyConfigs, hotelAmenities, guesthouseRooms } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { propertyMode } = useApp();
  const config = propertyConfigs[propertyMode];

  const reviews = [
    { name: 'James W.', rating: 5, text: 'Absolutely magnificent. The suite was beyond our expectations. Butler service was impeccable.', date: 'Oct 2026' },
    { name: 'Sophia C.', rating: 5, text: 'World-class spa and dining. The staff remembered my dietary preferences from my previous visit.', date: 'Oct 2026' },
    { name: 'Isabella R.', rating: 5, text: 'The most breathtaking city views I\'ve ever seen from a hotel room. Perfection.', date: 'Sep 2026' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={config.heroImage}
          alt={config.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: config.stars }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-serif mb-4 drop-shadow-2xl">
            {config.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-3 font-light italic">
            {config.tagline}
          </p>
          <p className="text-white/70 text-sm mb-8">{config.address}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('book-now')}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all shadow-luxury hover:shadow-luxury-lg hover:scale-105"
            >
              Reserve Now
            </button>
            <button
              onClick={() => setCurrentPage('rooms')}
              className="px-8 py-3.5 bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/30 text-white rounded-xl font-semibold text-lg transition-all"
            >
              Explore Rooms
            </button>
          </div>
        </div>

        {/* Floating Quick Info */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
          {[
            { label: 'Check-In', value: config.checkInTime },
            { label: 'Check-Out', value: config.checkOutTime },
            { label: 'Currency', value: config.currency },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-white/60 text-xs">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">World-Class Facilities</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif">Experience Unmatched Luxury</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {hotelAmenities.map(amenity => (
            <div key={amenity.title} className="group p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-luxury transition-all duration-300 text-center cursor-pointer">
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-200">{amenity.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{amenity.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{amenity.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Accommodations</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif">Our Finest Rooms & Suites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Deluxe King Room', price: 350, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', features: ['City View', 'King Bed', '42m²', 'Mini Bar'], tag: 'Most Popular' },
              { title: 'Executive Suite', price: 650, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', features: ['Ocean View', 'Jacuzzi', '85m²', 'Butler Service'], tag: 'Best Value' },
              { title: 'Presidential Suite', price: 1200, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', features: ['Panoramic View', 'Private Pool', '220m²', 'Full Floor'], tag: 'Ultimate Luxury' },
            ].map(room => (
              <div key={room.title} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-shadow group">
                <div className="relative overflow-hidden">
                  <img src={room.image} alt={room.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">{room.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif mb-2">{room.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.features.map(f => (
                      <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${room.price}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                    </div>
                    <button
                      onClick={() => setCurrentPage('book-now')}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Book <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setCurrentPage('rooms')} className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              View All Rooms →
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Guest Reviews</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">What Our Guests Say</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">4.9/5 · 2,847 reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card">
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic mb-4 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 luxury-gradient">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">Ready for an Extraordinary Stay?</h2>
          <p className="text-white/80 mb-8 text-lg">Book directly for the best rates and exclusive benefits</p>
          <button
            onClick={() => setCurrentPage('book-now')}
            className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all shadow-luxury hover:scale-105"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white font-bold font-serif mb-2">{config.name}</p>
            <p className="text-sm">{config.address}</p>
            <p className="text-sm mt-1">{config.phone}</p>
            <p className="text-sm">{config.email}</p>
          </div>
          {[
            { title: 'Explore', links: ['Rooms & Suites', 'Restaurant & Bar', 'Spa & Wellness', 'Events & Meetings'] },
            { title: 'Services', links: ['Airport Transfer', 'Concierge', 'Valet Parking', 'Room Service'] },
            { title: 'Legal', links: ['Privacy Policy', 'Cookie Policy', 'Terms of Use', 'GDPR'] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-semibold mb-3">{col.title}</p>
              <ul className="space-y-1.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-xs">
          © 2026 {config.name}. All rights reserved. · Powered by LuxeStay ERP
        </div>
      </footer>
    </div>
  );
};
