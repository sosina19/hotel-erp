import React, { useState } from 'react';
import {
  QrCode, Printer, ExternalLink, Copy, Check, Download,
  Sparkles, Smartphone, BedDouble, Utensils, Coffee, DollarSign,
  MessageSquare, ShieldCheck, Wifi, Eye, RefreshCw, Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { propertyConfigs, rooms, guests } from '../../data/mockData';

interface RoomQROption {
  id: string;
  name: string;
  type: string;
  guestName?: string;
  isOccupied: boolean;
}

export const QRCodeHub: React.FC = () => {
  const { propertyMode, addToast } = useApp();
  const config = propertyConfigs[propertyMode];

  // Room selections
  const [selectedRoomId, setSelectedRoomId] = useState('101');
  const [targetService, setTargetService] = useState<'dining' | 'services' | 'overview' | 'billing' | 'communications'>('dining');
  const [domainMode, setDomainMode] = useState<'vercel' | 'local'>('vercel');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'room-grid' | 'batch-print'>('generator');

  // Rooms and tables list
  const roomOptions: RoomQROption[] = [
    { id: '101', name: 'Room 101', type: 'Deluxe King Suite', guestName: 'Lord James Worthington', isOccupied: true },
    { id: '102', name: 'Room 102', type: 'Executive Suite', isOccupied: false },
    { id: '103', name: 'Room 103', type: 'Premier Twin Suite', guestName: 'Lady Elena Rostova', isOccupied: true },
    { id: '201', name: 'Room 201', type: 'Royal Penthouse Suite', guestName: 'Marcus Sterling', isOccupied: true },
    { id: '204', name: 'Room 204', type: 'Panoramic Ocean Suite', guestName: 'Sophie Laurent', isOccupied: true },
    { id: '305', name: 'Room 305', type: 'Junior Garden Suite', isOccupied: false },
    { id: 'Table-01', name: 'Restaurant Table 1', type: 'Le Cirque Fine Dining', isOccupied: true },
    { id: 'Table-05', name: 'Terrace Table 5', type: 'Outdoor Garden Lounge', isOccupied: true },
    { id: 'Cabana-03', name: 'Rooftop Cabana 3', type: 'Infinity Pool Deck', isOccupied: true },
  ];

  const selectedRoom = roomOptions.find(r => r.id === selectedRoomId) || roomOptions[0];

  // Base URL calculation (defaults to live Vercel deployment so phone cameras work instantly)
  const baseUrl = domainMode === 'vercel'
    ? 'https://hotel-erp-psi.vercel.app'
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

  // Generate target URL for QR code
  const generatedUrl = `${baseUrl}/?room=${encodeURIComponent(selectedRoom.id)}&target=${targetService}`;

  // High-resolution scannable QR code image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=10&data=${encodeURIComponent(generatedUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'QR Deep-Link Copied',
      message: 'Scannable URL copied to clipboard: ' + generatedUrl,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
      {/* ─── HEADER BANNER ─── */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>Betora HMS · Smart QR Hub</span>
              </span>
              <span className="text-xs text-gray-400">
                Live Deployment: <strong className="text-emerald-400 font-mono">hotel-erp-psi.vercel.app</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Room QR Codes & In-Room Experience
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Generate scannable QR codes for guestrooms, suites, and restaurant tables. When guests scan with their phone camera, it opens their room's in-room dining menu, hotel services, or digital bill instantly.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Table Tent Stand</span>
            </button>
            <a
              href={generatedUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test on Device</span>
            </a>
          </div>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex gap-2 mt-6 pt-5 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generator'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Live QR Generator & Card Stand
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('room-grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'room-grid'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            All Room QR Codes ({roomOptions.length})
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW 1: LIVE QR GENERATOR & PRINTABLE TENT CARD */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 card p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-500" />
                <span>Configure QR Code Target</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Pick the room or table and the specific guest experience page to launch.
              </p>
            </div>

            {/* 1. Select Room or Table */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                1. Select Guestroom or Dining Location
              </label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(e.target.value)}
                className="input-field text-xs py-2.5 font-medium"
              >
                {roomOptions.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} – {r.type} {r.guestName ? `(${r.guestName})` : '(Available)'}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Destination Action */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                2. On Scan: Launch Destination
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'dining',
                    title: 'In-Room Dining Menu & Food Ordering',
                    desc: 'Opens direct restaurant menu with portion selection & add-ons.',
                    icon: <Utensils className="w-4 h-4 text-amber-500" />
                  },
                  {
                    id: 'services',
                    title: 'Hotel Services & Amenities Directory',
                    desc: 'Spa bookings, gym hours, express laundry, & concierge.',
                    icon: <Coffee className="w-4 h-4 text-indigo-500" />
                  },
                  {
                    id: 'overview',
                    title: 'Full Resident Portal Dashboard',
                    desc: 'Room overview, digital RFID key pass, stay details, & Wi-Fi.',
                    icon: <BedDouble className="w-4 h-4 text-emerald-500" />
                  },
                  {
                    id: 'billing',
                    title: 'My Bill & Folio Settlement',
                    desc: 'Itemized charges, payment simulation, & invoices.',
                    icon: <DollarSign className="w-4 h-4 text-emerald-600" />
                  },
                  {
                    id: 'communications',
                    title: 'Live Reception & Concierge Chat',
                    desc: 'Direct 2-way messaging with duty manager Sarah Mitchell.',
                    icon: <MessageSquare className="w-4 h-4 text-blue-500" />
                  },
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setTargetService(opt.id as any)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      targetService === opt.id
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetService"
                      checked={targetService === opt.id}
                      onChange={() => setTargetService(opt.id as any)}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        {opt.icon}
                        <span>{opt.title}</span>
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Domain Mode */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                3. QR Target Host
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDomainMode('vercel')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    domainMode === 'vercel'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Live Vercel Host</p>
                  <p className="text-[10px] text-gray-500">Scan from ANY phone</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDomainMode('local')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    domainMode === 'local'
                      ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Current Origin</p>
                  <p className="text-[10px] text-gray-500">Localhost / Dev test</p>
                </button>
              </div>
            </div>

            {/* Deep-link URL Box */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-gray-600 dark:text-gray-300">Encoded Deep-Link URL:</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
              <p className="text-[11px] font-mono text-gray-800 dark:text-gray-200 break-all select-all bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                {generatedUrl}
              </p>
            </div>
          </div>

          {/* Luxury Bedside Tent Card & QR Code Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* The Luxury Room Stand Card (Printable) */}
            <div className="w-full max-w-md bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white rounded-3xl p-7 shadow-2xl border-2 border-amber-400/40 text-center space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

              {/* Hotel Header */}
              <div>
                <span className="text-3xl block mb-1">🏰</span>
                <h3 className="text-lg font-bold font-serif tracking-wide text-white uppercase">
                  {config.name}
                </h3>
                <p className="text-[11px] text-amber-300 font-semibold tracking-widest uppercase">
                  Betora HMS · Guest Digital Concierge
                </p>
              </div>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 font-mono">
                <span>{selectedRoom.name}</span>
                <span>·</span>
                <span className="text-white/80 font-sans font-normal">{selectedRoom.type}</span>
              </div>

              {/* Actual Scannable QR Code */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-amber-400/30">
                <img
                  src={qrCodeImageUrl}
                  alt={`QR Code for ${selectedRoom.name}`}
                  className="w-52 h-52 object-contain mx-auto rounded-lg"
                />
              </div>

              {/* Scan Instructions */}
              <div className="space-y-1">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Scan to Order Food & Access Amenities</span>
                </p>
                <p className="text-xs text-gray-300 max-w-xs mx-auto">
                  Point your mobile phone camera at the code. No app download or password required.
                </p>
              </div>

              {/* In-Room Credentials & Services Pills */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-left text-xs bg-white/5 p-3 rounded-xl border border-white/5 font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Wi-Fi Network</span>
                  <span className="font-bold text-white">BetoraGuest-VIP</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Wi-Fi Password</span>
                  <span className="font-bold text-amber-300">Betora2026</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-white/10 text-[10px] text-gray-400 font-sans">
                  Available 24/7: In-Room Dining · Spa & Wellness · Room Cleanup · Reception Chat
                </div>
              </div>
            </div>

            {/* Test Callout Below Card */}
            <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl max-w-md w-full text-center">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Try Scanning With Your Phone Camera Now!</span>
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                Open your iPhone Camera or Android Lens, point at the screen, and tap the link to experience Betora HMS live on your phone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW 2: ALL ROOMS BATCH QR OVERVIEW GRID */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'room-grid' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Multi-Room QR Code Matrix
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Individual smart QR codes assigned for every room in the hotel inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All Room Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {roomOptions.map(room => {
              const roomUrl = `${baseUrl}/?room=${encodeURIComponent(room.id)}&target=dining`;
              const roomQr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(roomUrl)}`;

              return (
                <div
                  key={room.id}
                  className="card p-4 flex flex-col justify-between items-center text-center space-y-3 hover:border-amber-400 transition-colors"
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{room.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      room.isOccupied
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {room.isOccupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
                    <img src={roomQr} alt={room.name} className="w-36 h-36 object-contain" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{room.type}</p>
                    {room.guestName && (
                      <p className="text-[11px] text-gray-400">Resident: {room.guestName}</p>
                    )}
                  </div>

                  <div className="w-full flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setActiveTab('generator');
                      }}
                      className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      View Stand Card
                    </button>
                    <a
                      href={roomUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 hover:text-amber-600 transition-colors flex items-center justify-center"
                      title="Test URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};