import React, { useState } from 'react';
import {
  Clock, Star, AlertCircle, Utensils, BedDouble, Plus, Minus,
  ShoppingBag, CheckCircle2, ChevronRight, Check, Sparkles,
  Calendar, Users, MapPin, Coffee, Wine, Package, Flame, Leaf, X
} from 'lucide-react';
import { menuItems } from '../../data/mockData';
import type { MenuItem } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

interface DiningPageProps {
  setCurrentPage: (page: string) => void;
}

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks', 'Wines'] as const;

// Open restaurant dining tables available for selection
const OPEN_TABLES = [
  { id: 'Table 1', name: 'Table 1 – Main Fine Dining Room', capacity: '2-4 Guests' },
  { id: 'Table 2', name: 'Table 2 – Garden Terrace Patio', capacity: '2-4 Guests' },
  { id: 'Table 3', name: 'Table 3 – Panoramic Sea View Window', capacity: '2 Guests (Romantic)' },
  { id: 'Table 4', name: 'Table 4 – Rooftop Infinity Pool Deck', capacity: '4-6 Guests' },
  { id: 'Table 5', name: 'Table 5 – Skyline Lounge & Wine Bar', capacity: '2-4 Guests' },
  { id: 'Cabana 1', name: 'Cabana 1 – VIP Poolside Cabana', capacity: 'Up to 6 Guests' },
  { id: 'Other', name: 'Other / Enter Specific Table #', capacity: 'Any Table' },
];

// Available accompaniments and add-ons ("Do you need anything else?")
const ACCOMPANIMENTS = [
  { name: 'Warm Artisanal Baguette & Truffle Butter', price: 5.00 },
  { name: 'Hand-Cut Truffle Parmesan Fries', price: 9.00 },
  { name: 'Organic Baby Spinach & Herb Salad', price: 8.00 },
  { name: 'Sommelier Reserve Wine Glass Pairing', price: 18.00 },
  { name: 'San Pellegrino Sparkling Mineral Water (750ml)', price: 7.00 },
  { name: 'Tahitian Vanilla Bean Panna Cotta', price: 12.00 },
];

const COMPLIMENTARY_CONDIMENTS = [
  'Dijon & Wholegrain Mustard',
  'Smoked Sea Salt & Peppercorn Grinder',
  'Extra Virgin Olive Oil & Aged Balsamic',
  'Crushed Red Pepper Flakes',
  'Heinz Ketchup & Truffle Aioli',
];

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  servingLocation: 'room' | 'table';
  targetLocation: string;
  doneness?: string;
  dressing?: string;
  temperature?: string;
  addOns: { name: string; price: number }[];
  cutleryCount: number;
  condiments: string[];
  specialInstructions?: string;
}

interface PlacedOrder {
  id: string;
  orderTime: string;
  servingLocation: 'room' | 'table';
  targetLocation: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Delivered';
  paymentMethod: string;
  estimatedMinutes: number;
}

export const DiningPage: React.FC<DiningPageProps> = ({ setCurrentPage }) => {
  const { addToast, scannedRoom } = useApp();

  // Sub-Navigation Tabs: Browse Menu vs Reserve Table vs Active Orders
  const [activeSubNav, setActiveSubNav] = useState<'menu' | 'reserve' | 'orders'>('menu');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Serving Location state (defaults to room if scanned via room QR, or open table if table)
  const isTableInitial = scannedRoom?.toLowerCase().includes('table') || scannedRoom?.toLowerCase().includes('cabana');
  const [servingLocation, setServingLocation] = useState<'room' | 'table'>(
    isTableInitial ? 'table' : 'room'
  );
  const [destinationRoom, setDestinationRoom] = useState<string>(
    isTableInitial ? '101' : (scannedRoom || '101')
  );
  const [destinationTable, setDestinationTable] = useState<string>(
    isTableInitial ? scannedRoom : 'Table 1 – Main Fine Dining Room'
  );
  const [customTableNumber, setCustomTableNumber] = useState<string>('');

  // Dish Customizer & Order Modal
  const [orderingItem, setOrderingItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [selectedDoneness, setSelectedDoneness] = useState<string>('Medium-Rare');
  const [selectedDressing, setSelectedDressing] = useState<string>('Chef Signature Dressing');
  const [selectedDrinkTemp, setSelectedDrinkTemp] = useState<string>('Chilled with Crystal Ice');
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [cutleryCount, setCutleryCount] = useState<number>(2);
  const [selectedCondiments, setSelectedCondiments] = useState<string[]>(['Dijon & Wholegrain Mustard']);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Cart Tray
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [deliveryTiming, setDeliveryTiming] = useState('Immediate (~20-25 min)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Charge to Room Folio' | 'Credit Card' | 'Pay at Table'>('Charge to Room Folio');

  // Active Placed Orders
  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>([
    {
      id: 'ORD-7291',
      orderTime: '13:30',
      servingLocation: 'room',
      targetLocation: `Room #${scannedRoom || '101'}`,
      items: [
        {
          id: 'C1',
          menuItemId: 'M005',
          name: 'Châteaubriand Prime Cut',
          price: 125,
          quantity: 1,
          category: 'Mains',
          servingLocation: 'room',
          targetLocation: `Room #${scannedRoom || '101'}`,
          doneness: 'Medium-Rare',
          addOns: [{ name: 'Hand-Cut Truffle Parmesan Fries', price: 9.00 }],
          cutleryCount: 2,
          condiments: ['Dijon & Wholegrain Mustard'],
        },
      ],
      subtotal: 134.00,
      tax: 13.40,
      deliveryFee: 5.00,
      total: 152.40,
      status: 'Delivered',
      paymentMethod: 'Charge to Room Folio',
      estimatedMinutes: 0,
    },
  ]);

  // Reserve Table Form State
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    name: 'Lord James Worthington',
    email: 'guest@betorahms.com',
    date: '2026-10-31',
    time: '19:30',
    guests: '2',
    tableLocation: 'Table 1 – Main Fine Dining Room',
    notes: 'Window table preferred if available.',
  });

  const categoryItems = menuItems.filter(i => {
    if (activeCategory !== 'All' && i.category !== activeCategory) return false;
    if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase()) && !i.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Open Dish Customizer Modal
  const handleOpenOrderModal = (item: MenuItem) => {
    setOrderingItem(item);
    setItemQuantity(1);
    setSelectedDoneness('Medium-Rare');
    setSelectedDressing('Chef Signature Dressing');
    setSelectedDrinkTemp('Chilled with Crystal Ice');
    setSelectedAddOns([]);
    setCutleryCount(2);
    setSelectedCondiments(['Dijon & Wholegrain Mustard']);
    setSpecialInstructions('');
  };

  // Toggle Add-on
  const handleToggleAddOn = (addon: { name: string; price: number }) => {
    setSelectedAddOns(prev =>
      prev.some(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  // Toggle Condiment
  const handleToggleCondiment = (cond: string) => {
    setSelectedCondiments(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  // Pricing calculations
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singleItemPrice = (orderingItem?.price || 0) + addOnsTotal;
  const configuredItemTotal = singleItemPrice * itemQuantity;

  // Add Item to Cart Tray
  const handleAddToCart = () => {
    if (!orderingItem) return;

    const targetLoc = servingLocation === 'room'
      ? `Room #${destinationRoom.trim() || '101'}`
      : (destinationTable.includes('Other') && customTableNumber ? customTableNumber.trim() : destinationTable.split('–')[0].trim());

    const newItem: CartItem = {
      id: `${orderingItem.id}-${Date.now()}`,
      menuItemId: orderingItem.id,
      name: orderingItem.name,
      price: singleItemPrice,
      quantity: itemQuantity,
      category: orderingItem.category,
      servingLocation,
      targetLocation: targetLoc,
      doneness: orderingItem.category === 'Mains' ? selectedDoneness : undefined,
      dressing: orderingItem.category === 'Starters' ? selectedDressing : undefined,
      temperature: orderingItem.category === 'Drinks' || orderingItem.category === 'Wines' ? selectedDrinkTemp : undefined,
      addOns: [...selectedAddOns],
      cutleryCount,
      condiments: [...selectedCondiments],
      specialInstructions: specialInstructions.trim() || undefined,
    };

    setCart(prev => [...prev, newItem]);
    setOrderingItem(null);

    addToast({
      type: 'success',
      title: 'Added to Dining Tray',
      message: `${itemQuantity}x ${orderingItem.name} configured for ${targetLoc}.`,
    });
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0)
    );
  };

  // Cart Totals
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartTax = cartSubtotal * 0.10;
  const cartDeliveryFee = servingLocation === 'room' ? 5.00 : 0.00;
  const cartTotal = cartSubtotal + cartTax + cartDeliveryFee;

  // Place Order
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const targetLoc = servingLocation === 'room'
      ? `Room #${destinationRoom.trim() || '101'}`
      : (destinationTable.includes('Other') && customTableNumber ? customTableNumber.trim() : destinationTable.split('–')[0].trim());

    const newOrder: PlacedOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingLocation,
      targetLocation: targetLoc,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      status: 'Pending',
      paymentMethod,
      estimatedMinutes: servingLocation === 'room' ? 25 : 18,
    };

    setPlacedOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsTrayOpen(false);
    setActiveSubNav('orders');

    addToast({
      type: 'success',
      title: 'Order Transmitted to Kitchen',
      message: `Your food order (${newOrder.id}) is placed for ${targetLoc}! Tracking live.`,
    });

    // Simulate status progression
    setTimeout(() => {
      setPlacedOrders(cur =>
        cur.map(o => (o.id === newOrder.id ? { ...o, status: 'Accepted' } : o))
      );
    }, 4000);

    setTimeout(() => {
      setPlacedOrders(cur =>
        cur.map(o => (o.id === newOrder.id ? { ...o, status: 'Preparing' } : o))
      );
    }, 10000);
  };

  // Reserve Table Form Submit
  const handleReserveTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Table Reserved Successfully',
      message: `${reserveForm.tableLocation} reserved for ${reserveForm.guests} guests on ${reserveForm.date} at ${reserveForm.time}.`,
    });
    setShowReserveModal(false);
  };

  const activeOrdersCount = placedOrders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* LUXURY BLUE HERO BANNER                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-r from-[#0a1628] via-[#1e3a5f] to-[#0a1628] text-white">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
          alt="Fine Dining"
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Betora Grand Palace · In-Room & Restaurant Dining
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                  ))}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-1">
                Le Cirque & Grand Dining
              </h1>
              <p className="text-sm text-blue-100/90 max-w-xl">
                Order hot gourmet cuisine delivered directly to your guest suite, or select an open table in our sea-view dining terrace.
              </p>
            </div>

            {/* Scanned Room Badge */}
            {scannedRoom && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-xs">
                  <span className="text-blue-200 block text-[10px] uppercase font-bold tracking-wider">Connected Suite</span>
                  <strong className="text-white font-mono text-sm">Room #{scannedRoom}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ──────────────────────────────────────────────────────────── */}
        {/* SUB-NAVIGATION BAR (LUXURY NAVY BLUE STYLING)                */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {/* 1. Menu & Order Sub-nav */}
            <button
              type="button"
              onClick={() => setActiveSubNav('menu')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubNav === 'menu'
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Utensils className="w-4 h-4 text-blue-400" />
              <span>Browse Menu & Order</span>
            </button>

            {/* 2. Reserve a Table Sub-nav */}
            <button
              type="button"
              onClick={() => setActiveSubNav('reserve')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubNav === 'reserve'
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Reserve a Table</span>
            </button>

            {/* 3. Kitchen Live Tracking Sub-nav */}
            <button
              type="button"
              onClick={() => setActiveSubNav('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubNav === 'orders'
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Orders & Tracking</span>
              {activeOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold animate-pulse">
                  {activeOrdersCount} Active
                </span>
              )}
            </button>
          </div>

          {/* Cart Tray Shortcut Button */}
          <button
            type="button"
            onClick={() => setIsTrayOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-blue-300" />
            <span>Order Tray</span>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#1e3a5f] font-extrabold">
                {cartCount} (${cartSubtotal.toFixed(0)})
              </span>
            )}
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW 1: BROWSE DISHES & ORDER                                 */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeSubNav === 'menu' && (
          <div className="space-y-6">
            {/* Serving Destination Selector Card */}
            <div className="p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1e3a5f] dark:text-blue-400" />
                    <span>Serving Destination: Deliver to Room or Select Open Table</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Choose whether you would like dishes delivered to your room or served at an open restaurant table.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setServingLocation('room')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      servingLocation === 'room'
                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>To the Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServingLocation('table')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      servingLocation === 'table'
                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Select Open Table</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Destination Field */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-3">
                {servingLocation === 'room' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      Room Number for Delivery:
                    </span>
                    <input
                      type="text"
                      value={destinationRoom}
                      onChange={e => setDestinationRoom(e.target.value)}
                      placeholder="e.g. 101, 204, Suite 3"
                      className="input-field text-xs py-1.5 font-bold font-mono max-w-xs"
                    />
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hidden sm:inline">
                      ✓ Thermal room cart dispatch
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      Select Open Restaurant Table:
                    </span>
                    <select
                      value={destinationTable}
                      onChange={e => setDestinationTable(e.target.value)}
                      className="input-field text-xs py-1.5 font-semibold max-w-md"
                    >
                      {OPEN_TABLES.map(tab => (
                        <option key={tab.id} value={tab.name}>
                          {tab.name} · ({tab.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Category Pills & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-thin w-full sm:w-auto pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search dishes & ingredients..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-base font-bold font-mono text-[#1e3a5f] dark:text-blue-400">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-blue-500" /> ~{item.prepTime} min
                        </span>
                        {item.allergens && item.allergens.length > 0 && (
                          <span className="text-blue-700 dark:text-blue-300 font-medium truncate">
                            Allergens: {item.allergens.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {servingLocation === 'room' ? `To Room #${destinationRoom}` : destinationTable.split('–')[0].trim()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenOrderModal(item)}
                      className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Amount & Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW 2: RESERVE A TABLE                                       */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeSubNav === 'reserve' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                Restaurant Seating Reservation
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mt-2">
                Reserve Your Restaurant Table
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Book a table in advance for fine dining dinner, business luncheon, or romantic terrace evenings.
              </p>
            </div>

            <form onSubmit={handleReserveTableSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={reserveForm.name}
                    onChange={e => setReserveForm({ ...reserveForm, name: e.target.value })}
                    className="input-field text-xs py-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Reservation Date *</label>
                  <input
                    type="date"
                    required
                    value={reserveForm.date}
                    onChange={e => setReserveForm({ ...reserveForm, date: e.target.value })}
                    className="input-field text-xs py-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Dining Time *</label>
                  <select
                    value={reserveForm.time}
                    onChange={e => setReserveForm({ ...reserveForm, time: e.target.value })}
                    className="input-field text-xs py-2.5 font-medium"
                  >
                    {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Party Size *</label>
                  <select
                    value={reserveForm.guests}
                    onChange={e => setReserveForm({ ...reserveForm, guests: e.target.value })}
                    className="input-field text-xs py-2.5 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Preferred Seating Table</label>
                  <select
                    value={reserveForm.tableLocation}
                    onChange={e => setReserveForm({ ...reserveForm, tableLocation: e.target.value })}
                    className="input-field text-xs py-2.5 font-medium"
                  >
                    {OPEN_TABLES.map(tab => (
                      <option key={tab.id} value={tab.name}>{tab.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Special Occasion or Dietary Requests</label>
                  <textarea
                    rows={2}
                    value={reserveForm.notes}
                    onChange={e => setReserveForm({ ...reserveForm, notes: e.target.value })}
                    placeholder="Celebrations, anniversary, allergies, window seat preference..."
                    className="input-field text-xs py-2 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Table Reservation</span>
              </button>
            </form>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* VIEW 3: ACTIVE ORDERS & LIVE KITCHEN TRACKING                */}
        {/* ──────────────────────────────────────────────────────────── */}
        {activeSubNav === 'orders' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Live Kitchen Turn-by-Turn Status
                </h3>
                <p className="text-xs text-gray-500">
                  Tracking active room deliveries and seated restaurant table service.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubNav('menu')}
                className="px-3.5 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-bold"
              >
                + Order More
              </button>
            </div>

            {placedOrders.map(order => {
              const steps = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered'];
              const currentStepIndex = steps.indexOf(order.status);

              return (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-l-[#1e3a5f] border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1e3a5f] dark:text-blue-400">
                          {order.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                          {order.servingLocation === 'room' ? <BedDouble className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                          <span>{order.targetLocation}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed at {order.orderTime} · Method: {order.paymentMethod}
                      </p>
                    </div>

                    <span className="font-mono font-extrabold text-base text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)} USD
                    </span>
                  </div>

                  {/* 5-Step Pipeline in Luxury Blue */}
                  <div>
                    <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold mb-1.5">
                      {steps.map((st, i) => (
                        <span
                          key={st}
                          className={i <= currentStepIndex ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-gray-400'}
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden flex">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 transition-all duration-500 ${
                            i <= currentStepIndex ? 'bg-[#1e3a5f] dark:bg-blue-500' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Itemized List */}
                  <div className="bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-xl space-y-1.5 text-xs border border-gray-100 dark:border-gray-700">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {it.quantity}x {it.name} {it.doneness ? `(${it.doneness})` : ''}
                        </span>
                        <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
                          ${(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ORDER DISH ("CHOOSE ROOM OR TABLE & AMOUNT")       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!orderingItem}
        onClose={() => setOrderingItem(null)}
        title={orderingItem ? `Order: ${orderingItem.name}` : ''}
        size="lg"
      >
        {orderingItem && (
          <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto scrollbar-thin">
            {/* Dish Info Header */}
            <div className="flex gap-4 items-start border-b border-gray-100 dark:border-gray-700 pb-4">
              <img
                src={orderingItem.image}
                alt={orderingItem.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {orderingItem.name}
                  </h3>
                  <span className="text-base font-mono font-extrabold text-[#1e3a5f] dark:text-blue-400">
                    ${orderingItem.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {orderingItem.description}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold inline-block">
                  {orderingItem.category} · ~{orderingItem.prepTime} min
                </span>
              </div>
            </div>

            {/* 1. CHOOSE SERVING LOCATION: TO THE ROOM OR SELECT OPEN TABLE */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                  1. Choose Serving Location: To the Room or Open Table
                </label>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Where should we serve this dish?
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setServingLocation('room')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    servingLocation === 'room'
                      ? 'border-[#1e3a5f] bg-blue-50/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BedDouble className="w-4 h-4 text-[#1e3a5f] dark:text-blue-400" />
                    <span className="text-xs font-bold">To the Room</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    In-Room Private Dining
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setServingLocation('table')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    servingLocation === 'table'
                      ? 'border-[#1e3a5f] bg-blue-50/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Utensils className="w-4 h-4 text-[#1e3a5f] dark:text-blue-400" />
                    <span className="text-xs font-bold">Select Open Table</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Restaurant Dine-in Table
                  </span>
                </button>
              </div>

              {/* Conditional Location Input */}
              {servingLocation === 'room' ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Enter Room Number for Delivery
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <BedDouble className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={destinationRoom}
                        onChange={e => setDestinationRoom(e.target.value)}
                        placeholder="e.g. 101, 204"
                        className="input-field pl-9 text-xs py-2 font-bold font-mono"
                      />
                    </div>
                    <span className="text-[11px] px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-lg font-bold">
                      Room #{destinationRoom || '101'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    Food will be delivered hot directly to Room #{destinationRoom || '101'}.
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Select Open Restaurant Table
                  </label>
                  <select
                    value={destinationTable}
                    onChange={e => setDestinationTable(e.target.value)}
                    className="input-field text-xs py-2 font-semibold"
                  >
                    {OPEN_TABLES.map(tab => (
                      <option key={tab.id} value={tab.name}>
                        {tab.name} · ({tab.capacity})
                      </option>
                    ))}
                  </select>
                  {destinationTable.includes('Other') && (
                    <input
                      type="text"
                      value={customTableNumber}
                      onChange={e => setCustomTableNumber(e.target.value)}
                      placeholder="Type table # (e.g. Table 14)"
                      className="input-field text-xs py-2 mt-1.5"
                    />
                  )}
                  <p className="text-[10px] text-gray-400 italic">
                    Our waitstaff will serve this dish directly to your seated table.
                  </p>
                </div>
              )}
            </div>

            {/* 2. HOW MUCH THEY WANT TO ORDER (QUANTITY / PORTIONS) */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                    2. How Much Would You Like to Order? (Quantity)
                  </label>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Select number of servings for your party
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    disabled={itemQuantity <= 1}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 disabled:opacity-40 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-mono font-extrabold text-base text-gray-900 dark:text-white">
                    {itemQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItemQuantity(Math.min(20, itemQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-[#1e3a5f] hover:bg-[#2b5182] flex items-center justify-center font-bold text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Portions Pills */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-blue-200/60 dark:border-blue-900/60">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mr-1">Quick:</span>
                {[1, 2, 3, 4, 5].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setItemQuantity(qty)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      itemQuantity === qty
                        ? 'bg-[#1e3a5f] text-white shadow-xs'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    {qty}x
                  </button>
                ))}
                <div className="ml-auto text-right">
                  <span className="text-xs font-mono font-bold text-[#1e3a5f] dark:text-blue-300">
                    Total: ${configuredItemTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. COOKING DONENESS / TEMPERATURE (MAINS / STARTERS) */}
            {orderingItem.category === 'Mains' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  3. Meat Doneness / Cooking Temperature
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Rare', label: 'Rare', desc: 'Cool red center' },
                    { id: 'Medium-Rare', label: 'Medium-Rare', desc: 'Warm red center (Chef Pick)' },
                    { id: 'Medium', label: 'Medium', desc: 'Warm pink center' },
                    { id: 'Medium-Well', label: 'Medium-Well', desc: 'Slight pink' },
                    { id: 'Well-Done', label: 'Well-Done', desc: 'Cooked through' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedDoneness(opt.id)}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all ${
                        selectedDoneness === opt.id
                          ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/30 shadow-xs'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{opt.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ACCOMPANIMENTS ("DO YOU NEED ANYTHING ELSE?") */}
            <div className="space-y-2.5">
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                  4. Do You Need Anything Else? (Accompaniments & Sides)
                </label>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Select recommended pairings, artisan bread, or beverage additions:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ACCOMPANIMENTS.map(addon => {
                  const isChecked = selectedAddOns.some(a => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#1e3a5f] bg-blue-50/70 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white' : 'border-gray-400'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#1e3a5f] dark:text-blue-400 ml-2">
                        +${addon.price.toFixed(2)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. TABLE CUTLERY & CONDIMENTS */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-2 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  5. Dining Cutlery Sets
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCutleryCount(n)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        cutleryCount === n
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {n} {n === 1 ? 'Set' : 'Sets'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons in Luxury Blue */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-300" />
                  <span>
                    Add {itemQuantity}x to Tray • ${configuredItemTotal.toFixed(2)} USD
                  </span>
                </div>
                <span className="text-[10px] opacity-80 font-normal">
                  {servingLocation === 'room'
                    ? `Delivery to Room #${destinationRoom || '101'}`
                    : `Serve at ${destinationTable.split('–')[0].trim()}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderingItem(null)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: CART TRAY & CHECKOUT                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        title={`Your In-Room & Table Dining Tray (${cartCount} items)`}
        size="md"
      >
        <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto scrollbar-thin">
          {cart.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-500">Your dining tray is currently empty.</p>
              <button
                type="button"
                onClick={() => setIsTrayOpen(false)}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-xs font-bold"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Itemized Cart List with Quantity Adjusters */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-gray-700">
                {cart.map(item => (
                  <div key={item.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">{item.name}</span>
                        {item.doneness && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold">
                            {item.doneness}
                          </span>
                        )}
                        <p className="text-[11px] text-gray-400 font-mono">
                          ${item.price.toFixed(2)} portion
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {item.addOns.length > 0 && (
                      <p className="text-[10px] text-gray-500">
                        + {item.addOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Serving Location in Cart Tray */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider block">Serving Location</label>
                  <span className="text-[10px] text-gray-400">
                    {servingLocation === 'room' ? 'In-Room Dining' : 'Restaurant Dine-In'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServingLocation('room')}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      servingLocation === 'room'
                        ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600'
                    }`}
                  >
                    <BedDouble className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>To the Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServingLocation('table')}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      servingLocation === 'table'
                        ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>Select Open Table</span>
                  </button>
                </div>

                {servingLocation === 'room' ? (
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Enter Room Number:</label>
                    <input
                      type="text"
                      value={destinationRoom}
                      onChange={e => setDestinationRoom(e.target.value)}
                      placeholder="e.g. 101, 204"
                      className="input-field text-xs py-2 font-bold font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Select Open Table:</label>
                    <select
                      value={destinationTable}
                      onChange={e => setDestinationTable(e.target.value)}
                      className="input-field text-xs py-2"
                    >
                      {OPEN_TABLES.map(tab => (
                        <option key={tab.id} value={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Delivery Timing & Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Timing</label>
                  <select
                    value={deliveryTiming}
                    onChange={e => setDeliveryTiming(e.target.value)}
                    className="input-field text-xs py-2"
                  >
                    <option value="Immediate (~20-25 min)">Immediate (~20 min)</option>
                    <option value="In 45 Minutes">In 45 Minutes</option>
                    <option value="Scheduled for 19:30">Scheduled 19:30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Payment</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="input-field text-xs py-2"
                  >
                    {servingLocation === 'room' ? (
                      <>
                        <option value="Charge to Room Folio">Room #{destinationRoom || '101'} Folio</option>
                        <option value="Credit Card">Credit Card</option>
                      </>
                    ) : (
                      <>
                        <option value="Charge to Room Folio">Room Folio</option>
                        <option value="Pay at Table">Pay at Table (POS)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl space-y-1 text-xs border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxes (10% VAT)</span>
                  <span className="font-mono">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{servingLocation === 'room' ? 'In-Room Cart Delivery' : 'Table Service'}</span>
                  <span className="font-mono">{cartDeliveryFee > 0 ? `$${cartDeliveryFee.toFixed(2)}` : 'Complimentary'}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#1e3a5f] dark:text-blue-400 font-extrabold text-base">
                    ${cartTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Submit Order Button in Luxury Blue */}
              <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsTrayOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600"
                >
                  Keep Browsing
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-300" />
                  <span>
                    Confirm & Place Order ({servingLocation === 'room' ? `Room #${destinationRoom || '101'}` : destinationTable.split('–')[0].trim()}) • ${cartTotal.toFixed(2)}
                  </span>
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
