import React, { useState } from 'react';
import {
  Calendar, Users, BedDouble, CheckCircle, ChevronRight,
  ChevronLeft, Star, CreditCard, Lock, Copy
} from 'lucide-react';
import { rooms, generateBookingRef, propertyConfigs } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface BookingEngineProps {
  setCurrentPage: (page: string) => void;
}

type Step = 1 | 2 | 3;

export const BookingEngine: React.FC<BookingEngineProps> = ({ setCurrentPage }) => {
  const { propertyMode, addToast } = useApp();
  const config = propertyConfigs[propertyMode];

  const [step, setStep] = useState<Step>(1);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '', adults: 2, children: 0 });
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[0] | null>(null);
  const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '', phone: '', country: 'United States', requests: '' });
  const [bookingRef, setBookingRef] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const nights = dates.checkIn && dates.checkOut
    ? Math.max(0, Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const availableRooms = rooms.filter(r => r.status !== 'occupied' && r.status !== 'maintenance');

  const totalAmount = selectedRoom ? selectedRoom.ratePerNight * Math.max(nights, 1) : 0;
  const taxes = totalAmount * 0.12;
  const grandTotal = totalAmount + taxes;

  const handleStep1 = () => {
    if (!dates.checkIn || !dates.checkOut) {
      addToast({ type: 'warning', title: 'Select Dates', message: 'Please select both check-in and check-out dates.' });
      return;
    }
    if (nights < 1) {
      addToast({ type: 'error', title: 'Invalid Dates', message: 'Check-out must be after check-in.' });
      return;
    }
    setStep(2);
  };

  const handleStep2 = () => {
    if (!selectedRoom) {
      addToast({ type: 'warning', title: 'Select a Room', message: 'Please choose a room to continue.' });
      return;
    }
    setStep(3);
  };

  const handleConfirm = () => {
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      addToast({ type: 'warning', title: 'Complete Your Details', message: 'Please fill in all required fields.' });
      return;
    }
    const ref = generateBookingRef();
    setBookingRef(ref);
    setShowSuccess(true);
  };

  const copyRef = () => {
    navigator.clipboard?.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradientClass = propertyMode === 'hotel'
    ? 'luxury-gradient'
    : propertyMode === 'guesthouse'
    ? 'guesthouse-gradient'
    : 'restaurant-gradient';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className={`${gradientClass} py-10 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">Complete Your Reservation</h1>
          <p className="text-white/80">{config.name} · Best Rate Guaranteed</p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-lg mx-auto mt-8">
          <div className="flex items-center justify-between">
            {[
              { n: 1, label: 'Select Dates' },
              { n: 2, label: 'Choose Room' },
              { n: 3, label: 'Your Details' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step > s.n ? 'bg-emerald-500 text-white' : step === s.n ? 'bg-white text-gray-900' : 'bg-white/20 text-white/60'}`}>
                    {step > s.n ? <CheckCircle className="w-5 h-5" /> : s.n}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.n ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full ${step > s.n ? 'bg-emerald-500' : 'bg-white/20'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* STEP 1: Dates & Guests */}
            {step === 1 && (
              <div className="card p-6 space-y-6 animate-slide-up">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Select Your Dates & Guests</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">All rates are per night, inclusive of breakfast</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      <Calendar className="w-4 h-4 inline mr-1.5 text-blue-500" />
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      value={dates.checkIn}
                      onChange={e => setDates({ ...dates, checkIn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      <Calendar className="w-4 h-4 inline mr-1.5 text-blue-500" />
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      min={dates.checkIn || new Date().toISOString().split('T')[0]}
                      value={dates.checkOut}
                      onChange={e => setDates({ ...dates, checkOut: e.target.value })}
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      {nights} night{nights > 1 ? 's' : ''} · {dates.checkIn} → {dates.checkOut}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Users className="w-4 h-4 inline mr-1.5 text-blue-500" />
                    Number of Guests
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Adults', key: 'adults', min: 1, max: 8 },
                      { label: 'Children (under 12)', key: 'children', min: 0, max: 6 },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDates(prev => ({ ...prev, [field.key]: Math.max(field.min, prev[field.key as keyof typeof prev] as number - 1) }))}
                            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-lg transition-colors"
                          >−</button>
                          <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                            {dates[field.key as keyof typeof dates]}
                          </span>
                          <button
                            onClick={() => setDates(prev => ({ ...prev, [field.key]: Math.min(field.max, prev[field.key as keyof typeof prev] as number + 1) }))}
                            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-lg transition-colors"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStep1}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-sm"
                >
                  Search Available Rooms
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 2: Room Selection */}
            {step === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Your Room</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{availableRooms.length} rooms available for {nights} night{nights !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {availableRooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-luxury ${selectedRoom?.id === room.id ? 'ring-2 ring-amber-500 shadow-luxury' : ''}`}
                  >
                    <div className="flex gap-4">
                      <img src={room.image} alt={room.type} className="w-28 h-24 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{room.type}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Floor {room.floor} · {room.size} · {room.view}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">${room.ratePerNight}</p>
                            <p className="text-xs text-gray-400">/night</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {room.features.slice(0, 4).map(f => (
                            <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{f}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {room.capacity}</span>
                            <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{room.bedType}</span>
                          </div>
                          {nights > 0 && (
                            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                              Total: ${(room.ratePerNight * nights).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${selectedRoom?.id === room.id ? 'border-amber-500 bg-amber-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedRoom?.id === room.id && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleStep2}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
                >
                  Continue with {selectedRoom?.type || 'Selected Room'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 3: Guest Details */}
            {step === 3 && (
              <div className="card p-6 space-y-5 animate-slide-up">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Almost there — secure your reservation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First Name *</label>
                    <input className="input-field" placeholder="James" value={guestInfo.firstName} onChange={e => setGuestInfo({ ...guestInfo, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last Name *</label>
                    <input className="input-field" placeholder="Worthington" value={guestInfo.lastName} onChange={e => setGuestInfo({ ...guestInfo, lastName: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                    <input type="email" className="input-field" placeholder="you@example.com" value={guestInfo.email} onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
                    <input type="tel" className="input-field" placeholder="+1 555 000 0000" value={guestInfo.phone} onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Country</label>
                    <select className="input-field" value={guestInfo.country} onChange={e => setGuestInfo({ ...guestInfo, country: e.target.value })}>
                      {['United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Singapore', 'Australia', 'Canada', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Special Requests</label>
                    <textarea
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Dietary requirements, room preferences, celebrations..."
                      value={guestInfo.requests}
                      onChange={e => setGuestInfo({ ...guestInfo, requests: e.target.value })}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Card Number</label>
                      <input className="input-field font-mono" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Expiry</label>
                      <input className="input-field" placeholder="MM/YY" defaultValue="12/28" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">CVV</label>
                      <input className="input-field" type="password" placeholder="•••" defaultValue="123" maxLength={4} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit SSL encrypted · PCI DSS compliant · Your data is safe</span>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-md"
                >
                  <Lock className="w-5 h-5" />
                  Confirm & Pay ${grandTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-lg">{config.logo}</span>
                <span className="font-medium">{config.name}</span>
              </div>

              {/* Dates */}
              {dates.checkIn && dates.checkOut && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Check-In</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{dates.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Check-Out</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{dates.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{nights} night{nights !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Guests</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{dates.adults} adults{dates.children > 0 ? `, ${dates.children} children` : ''}</span>
                  </div>
                </div>
              )}

              {/* Room */}
              {selectedRoom && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <img src={selectedRoom.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{selectedRoom.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Room {selectedRoom.number} · {selectedRoom.view}</p>
                </div>
              )}

              {/* Pricing */}
              {selectedRoom && nights > 0 && (
                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>${selectedRoom.ratePerNight} × {nights} nights</span>
                    <span>${totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Taxes & fees (12%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Free cancellation before 48 hours</p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-center">
                {['🔒 Secure', '✈️ Free Cancel', '🏆 Best Rate'].map(badge => (
                  <div key={badge} className="text-xs text-gray-500 dark:text-gray-400 font-medium">{badge}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 text-center shadow-luxury-lg animate-slide-up">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Welcome, {guestInfo.firstName}! Your reservation at {config.name} is confirmed.
              A confirmation has been sent to <strong>{guestInfo.email}</strong>.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-medium">Booking Reference</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-widest">{bookingRef}</p>
                <button
                  onClick={copyRef}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copy"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              {[
                { label: 'Check-In', value: dates.checkIn },
                { label: 'Check-Out', value: dates.checkOut },
                { label: 'Room', value: selectedRoom?.type || '' },
                { label: 'Total Paid', value: `$${grandTotal.toFixed(2)}` },
              ].map(item => (
                <div key={item.label} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => { setShowSuccess(false); setCurrentPage('guest-portal'); }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
              >
                View My Booking
              </button>
              <button
                onClick={() => { setShowSuccess(false); setCurrentPage('home'); }}
                className="w-full py-2.5 text-gray-600 dark:text-gray-400 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
