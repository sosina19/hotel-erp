import React, { useState } from 'react';
import {
  Utensils, Search, Plus, Minus, ShoppingBag, Clock, CheckCircle2,
  AlertTriangle, Filter, Sparkles, X, ChevronRight, Check, Heart,
  Flame, Leaf, ShieldAlert, Award, Coffee, Wine, Package, ThumbsUp,
  DollarSign, ArrowRight
} from 'lucide-react';
import type { DiningOrderItem, DiningOrderItemAddOn, GuestDiningOrder } from '../types';
import { menuItems } from '../../../data/mockData';
import { Modal } from '../../ui/Modal';

interface DiningMenuTabProps {
  roomNumber: string;
  onChargeFolio: (amount: number, description: string) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

const RESTAURANTS = [
  { id: 'grand-dining', name: 'The Grand Dining Room', cuisine: 'Contemporary Fine Dining', hours: '18:00 – 22:30' },
  { id: 'letoile', name: 'L’Étoile Bistro & Wine Bar', cuisine: 'French Bistro & Grill', hours: '11:30 – 23:00' },
  { id: 'skyline', name: 'Skyline Terrace Lounge', cuisine: 'Tapas, Sushi & Cocktails', hours: '16:00 – 01:00' },
];

// Available sides and extras ("Do you need anything else?")
const ACCOMPANIMENTS: DiningOrderItemAddOn[] = [
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

export const DiningMenuTab: React.FC<DiningMenuTabProps> = ({
  roomNumber,
  onChargeFolio,
  onAddToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'active-orders' | 'history'>('menu');
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANTS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  // Cart Tray
  const [cart, setCart] = useState<DiningOrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'Room Delivery' | 'Restaurant Pickup'>('Room Delivery');
  const [deliveryTime, setDeliveryTime] = useState('Immediate (~20-25 min)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Charge to Room Folio' | 'Credit Card'>('Charge to Room Folio');

  // Interactive Item Customization Modal ("Ask Amount & Other Things")
  const [customizingItem, setCustomizingItem] = useState<any | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [selectedDoneness, setSelectedDoneness] = useState<string>('Medium-Rare');
  const [selectedDressing, setSelectedDressing] = useState<string>('Chef Signature Dressing');
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>("Chef's Balanced");
  const [selectedDrinkTemp, setSelectedDrinkTemp] = useState<string>('Chilled with Crystal Ice');
  const [selectedAddOns, setSelectedAddOns] = useState<DiningOrderItemAddOn[]>([]);
  const [cutleryCount, setCutleryCount] = useState<number>(2);
  const [selectedCondiments, setSelectedCondiments] = useState<string[]>(['Dijon & Wholegrain Mustard']);
  const [dishSpecialNote, setDishSpecialNote] = useState<string>('');

  // Orders List
  const [orders, setOrders] = useState<GuestDiningOrder[]>([
    {
      id: 'ORD-8812',
      orderTime: '13:15',
      restaurantName: 'The Grand Dining Room',
      items: [
        {
          id: 'M001',
          name: 'Lobster Bisque',
          price: 24,
          quantity: 1,
          category: 'Starters',
          addOns: [{ name: 'Warm Artisanal Baguette & Truffle Butter', price: 5.00 }],
          cutleryCount: 1,
        },
        {
          id: 'M005',
          name: 'Châteaubriand Prime Cut',
          price: 125,
          quantity: 1,
          category: 'Mains',
          preparationOption: 'Medium-Rare',
          addOns: [
            { name: 'Hand-Cut Truffle Parmesan Fries', price: 9.00 },
            { name: 'Sommelier Reserve Wine Glass Pairing', price: 18.00 },
          ],
          cutleryCount: 2,
          condiments: ['Dijon & Wholegrain Mustard', 'Smoked Sea Salt & Peppercorn Grinder'],
          specialInstructions: 'Warm plates please',
        },
      ],
      subtotal: 181.00,
      tax: 18.10,
      deliveryFee: 5.00,
      total: 204.10,
      deliveryType: 'Room Delivery',
      roomNumber,
      deliveryTime: 'Immediate',
      specialInstructions: 'Room 101 – Leave on private terrace dining table',
      paymentMethod: 'Charge to Room Folio',
      status: 'Delivered',
      assignedServer: 'Pierre (Runner #3 · Ext. 402)',
      estimatedMinutes: 0,
    },
  ]);

  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks', 'Wines'];

  // Enhanced menu items
  const enhancedItems = menuItems.map(item => ({
    ...item,
    ingredients: item.category === 'Starters'
      ? ['Cognac Reduction', 'Crème Fraîche', 'Fresh Chives', 'Artisan Sea Salt']
      : item.category === 'Mains'
      ? ['Prime Reserve Cut', 'Black Truffle Butter', 'Heirloom Baby Carrots', 'Fleur de Sel']
      : item.category === 'Desserts'
      ? ['Valrhona Dark Chocolate', 'Tahitian Vanilla Pod', 'Farm Cream', 'Gold Leaf']
      : ['Botanical Infusion', 'Alpine Spring Water'],
    isVegetarian: item.tags?.includes('Vegetarian') || item.category === 'Desserts',
    isVegan: item.tags?.includes('Vegan'),
    isHalal: !item.tags?.includes('Pork') && item.category !== 'Wines',
    isGlutenFree: item.tags?.includes('GF option') || item.category === 'Wines',
  }));

  // Filtering
  const filteredItems = enhancedItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (dietaryFilter === 'veg' && !item.isVegetarian) return false;
    if (dietaryFilter === 'vgn' && !item.isVegan) return false;
    if (dietaryFilter === 'halal' && !item.isHalal) return false;
    if (dietaryFilter === 'gf' && !item.isGlutenFree) return false;
    return true;
  });

  // Open item customizer modal
  const handleOpenCustomizer = (item: any) => {
    setCustomizingItem(item);
    setItemQuantity(1);
    setSelectedDoneness('Medium-Rare');
    setSelectedDressing('Chef Signature Dressing');
    setSelectedSpiceLevel("Chef's Balanced");
    setSelectedDrinkTemp('Chilled with Crystal Ice');
    setSelectedAddOns([]);
    setCutleryCount(2);
    setSelectedCondiments(['Dijon & Wholegrain Mustard']);
    setDishSpecialNote('');
  };

  // Toggle add-on accompaniments
  const handleToggleAddOn = (addon: DiningOrderItemAddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.name === addon.name);
      if (exists) {
        return prev.filter(a => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Toggle condiment
  const handleToggleCondiment = (condiment: string) => {
    setSelectedCondiments(prev =>
      prev.includes(condiment)
        ? prev.filter(c => c !== condiment)
        : [...prev, condiment]
    );
  };

  // Calculate customized item total
  const singleAddOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const customizedItemSinglePrice = (customizingItem?.price || 0) + singleAddOnsPrice;
  const customizedItemTotalPrice = customizedItemSinglePrice * itemQuantity;

  // Add customized item to cart tray
  const handleAddCustomizedToCart = () => {
    if (!customizingItem) return;

    let prepOption: string | undefined = undefined;
    if (customizingItem.category === 'Mains') {
      prepOption = selectedDoneness;
    } else if (customizingItem.category === 'Starters') {
      prepOption = selectedDressing;
    } else if (customizingItem.category === 'Drinks' || customizingItem.category === 'Wines') {
      prepOption = selectedDrinkTemp;
    }

    const newItem: DiningOrderItem = {
      id: `${customizingItem.id}-${Date.now()}`,
      name: customizingItem.name,
      price: customizedItemSinglePrice,
      quantity: itemQuantity,
      category: customizingItem.category,
      preparationOption: prepOption,
      addOns: [...selectedAddOns],
      cutleryCount: cutleryCount,
      condiments: [...selectedCondiments],
      specialInstructions: dishSpecialNote.trim() || undefined,
    };

    setCart(prev => [...prev, newItem]);
    setCustomizingItem(null);

    onAddToast({
      type: 'success',
      title: 'Added to Dining Tray',
      message: `${itemQuantity}x ${customizingItem.name} configured with your selections.`,
    });
  };

  // Cart totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * 0.10;
  const cartDeliveryFee = deliveryType === 'Room Delivery' ? 5.00 : 0.00;
  const cartTotal = cartSubtotal + cartTax + cartDeliveryFee;

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0)
    );
  };

  // Place final order
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder: GuestDiningOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      restaurantName: RESTAURANTS.find(r => r.id === selectedRestaurant)?.name || 'In-Room Dining',
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      deliveryType,
      roomNumber,
      deliveryTime,
      specialInstructions: deliveryNotes.trim() || 'Knock gently upon delivery',
      paymentMethod,
      status: 'Pending',
      assignedServer: 'Executive Kitchen Dispatch',
      estimatedMinutes: 25,
    };

    setOrders(prev => [newOrder, ...prev]);

    if (paymentMethod === 'Charge to Room Folio') {
      onChargeFolio(cartTotal, `In-Room Dining (${newOrder.id})`);
    }

    onAddToast({
      type: 'success',
      title: 'Order Transmitted to Kitchen',
      message: `Your food order (${newOrder.id}) is now in preparation. Tracking live!`,
    });

    setCart([]);
    setIsCartOpen(false);
    setDeliveryNotes('');
    setActiveSubTab('active-orders');

    // Simulate turn-by-turn pipeline
    setTimeout(() => {
      setOrders(cur =>
        cur.map(o => (o.id === newOrder.id ? { ...o, status: 'Accepted' as const } : o))
      );
    }, 4000);

    setTimeout(() => {
      setOrders(cur =>
        cur.map(o => (o.id === newOrder.id ? { ...o, status: 'Preparing' as const } : o))
      );
    }, 10000);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'Cancelled' as const } : o))
    );
    onAddToast({
      type: 'warning',
      title: 'Order Cancelled',
      message: `Order ${orderId} has been cancelled in accordance with hotel policy.`,
    });
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── TOP CHEF'S DAILY SPECIAL BANNER ─── */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#1e3a5f] to-[#0a1628] rounded-3xl p-6 text-white shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-xs">
            <Flame className="w-7 h-7 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/25">
                Executive Chef Special
              </span>
              <span className="text-xs text-blue-200 font-semibold">Available for In-Room Dining</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif mt-0.5">
              Wild Pan-Seared Chilean Sea Bass with Saffron Emulsion & Oscietra Caviar
            </h3>
            <p className="text-xs text-white/90 max-w-xl">
              Freshly landed today. Served with butter-poached green asparagus and sea samphire ($58.00).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const seaBass = enhancedItems.find(i => i.id === 'M007') || enhancedItems[0];
            handleOpenCustomizer(seaBass);
          }}
          className="flex-shrink-0 px-5 py-3 bg-white text-[#1e3a5f] hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Customize & Order Special ($58)</span>
        </button>
      </div>

      {/* ─── SUB-NAVIGATION BAR ─── */}
      <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'menu'
                ? 'bg-[#1e3a5f] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-blue-300" />
            <span>Browse Restaurant Menus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('active-orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'active-orders'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active Orders & Tracking</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-500" />
            <span>Order History ({orders.length})</span>
          </button>
        </div>

        {/* Floating Cart Tray Button */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-300" />
          <span>Tray</span>
          {cartCount > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-white text-[#1e3a5f] font-bold">
              {cartCount} (${cartSubtotal.toFixed(0)})
            </span>
          )}
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW 1: BROWSE RESTAURANT MENUS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'menu' && (
        <div className="space-y-5">
          {/* Restaurant Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {RESTAURANTS.map(res => (
              <button
                key={res.id}
                type="button"
                onClick={() => setSelectedRestaurant(res.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedRestaurant === res.id
                    ? 'bg-[#1e3a5f] text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{res.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({res.hours})</span>
              </button>
            ))}
          </div>

          {/* Search, Dietary & Category Filters */}
          <div className="card p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients, or allergens..."
                  className="input-field pl-9 text-xs py-2"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto scrollbar-thin">
                {[
                  { id: 'all', label: 'All Diets' },
                  { id: 'veg', label: 'Vegetarian' },
                  { id: 'vgn', label: 'Vegan' },
                  { id: 'halal', label: 'Halal' },
                  { id: 'gf', label: 'Gluten-Free' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDietaryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      dietaryFilter === f.id
                        ? 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/40 dark:text-blue-200 font-bold'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pt-2 border-t border-gray-100 dark:border-gray-700">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#1e3a5f] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="card overflow-hidden flex flex-col justify-between hover:shadow-luxury transition-all duration-300 group"
              >
                <div>
                  <div className="relative h-44 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                        {item.category}
                      </span>
                      {item.isVegetarian && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                          <Leaf className="w-2.5 h-2.5" /> Veg
                        </span>
                      )}
                      {item.isHalal && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e3a5f] text-white">
                          Halal
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white shadow-md font-mono">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> ~{item.prepTime} min
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Allergen Tag Flags */}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-[#1e3a5f] dark:text-blue-400 pt-1 font-semibold">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>Allergens: {item.allergens.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {item.available ? (
                    <button
                      type="button"
                      onClick={() => handleOpenCustomizer(item)}
                      className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Amount & Customize</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl text-xs font-semibold text-center">
                      Currently Sold Out
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW 2: ACTIVE ORDERS & LIVE TRACKING */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'active-orders' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Live Kitchen Dispatch & Order Tracking
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Turn-by-turn status updates from kitchen confirmation to heated room cart delivery.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Assigned to Room #{roomNumber}
            </span>
          </div>

          {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length === 0 ? (
            <div className="card p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Active Food Orders</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                All previous orders have been completed and delivered. Browse our menus to place a new order.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('menu')}
                className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Browse Restaurant Menu
              </button>
            </div>
          ) : (
            orders
              .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
              .map(order => {
                const steps = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered'];
                const currentStepIndex = steps.indexOf(order.status);

                return (
                  <div key={order.id} className="card p-6 space-y-5 border-l-4 border-l-[#1e3a5f]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-gray-100 dark:border-gray-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#1e3a5f] dark:text-blue-400">
                            {order.id}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {order.restaurantName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {order.deliveryType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Ordered at {order.orderTime} · Timing: <strong>{order.deliveryTime}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Charged to Folio</span>
                        <span className="text-base font-mono font-extrabold text-gray-900 dark:text-white">
                          ${order.total.toFixed(2)} USD
                        </span>
                      </div>
                    </div>

                    {/* 5-Step Pipeline */}
                    <div>
                      <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold mb-2">
                        {steps.map((st, i) => (
                          <span
                            key={st}
                            className={
                              i <= currentStepIndex
                                ? 'text-[#1e3a5f] dark:text-blue-400 font-extrabold'
                                : 'text-gray-400'
                            }
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden flex">
                        {steps.map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 transition-all duration-500 ${
                              i <= currentStepIndex ? 'bg-[#1e3a5f]' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Itemized Order Breakdown */}
                    <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl text-xs space-y-2 border border-gray-100 dark:border-gray-700">
                      <p className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">
                        Order Items & Customizations
                      </p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700/60 pb-2">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {it.quantity}x {it.name}
                            </span>
                            {it.preparationOption && (
                              <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold">
                                {it.preparationOption}
                              </span>
                            )}
                            {it.addOns && it.addOns.length > 0 && (
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Add-ons: {it.addOns.map(a => `${a.name} (+$${a.price})`).join(', ')}
                              </p>
                            )}
                            {it.cutleryCount && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Cutlery: {it.cutleryCount} set(s) included
                              </p>
                            )}
                          </div>
                          <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {order.specialInstructions && (
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 italic pt-1">
                          <strong>Note for Runner:</strong> "{order.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Runner & Cancel Option */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Package className="w-4 h-4 text-blue-500" />
                        <span>Assigned Dispatch: <strong>{order.assignedServer}</strong></span>
                      </div>

                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 border border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
                        >
                          Cancel Order Before Kitchen Starts
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW 3: ORDER HISTORY & REORDER */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'history' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Historical Dining Orders & Receipts
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Itemized history of all delivered room service and restaurant orders.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Total Recorded: {orders.length}
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.map(order => (
              <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">{order.id}</span>
                    <span className="text-xs text-gray-500">({order.orderTime})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {order.restaurantName} · {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block">Total</span>
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCart(order.items);
                      setIsCartOpen(true);
                      onAddToast({
                        type: 'info',
                        title: 'Items Re-added to Tray',
                        message: `Order ${order.id} configuration loaded into dining tray.`,
                      });
                    }}
                    className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-xs font-bold rounded-xl transition-colors"
                  >
                    Reorder Dishes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ITEM ORDER & CUSTOMIZATION ("ASK AMOUNT & OTHER THINGS") */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        title={customizingItem ? `Configure Order: ${customizingItem.name}` : ''}
        size="lg"
      >
        {customizingItem && (
          <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto scrollbar-thin">
            {/* Dish Header Info */}
            <div className="flex gap-4 items-start border-b border-gray-100 dark:border-gray-700 pb-4">
              <img
                src={customizingItem.image}
                alt={customizingItem.name}
                className="w-24 h-24 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {customizingItem.name}
                  </h3>
                  <span className="text-base font-mono font-extrabold text-[#1e3a5f] dark:text-blue-400">
                    ${customizingItem.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {customizingItem.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
                    {customizingItem.category}
                  </span>
                  {customizingItem.allergens && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-semibold">
                      Contains: {customizingItem.allergens.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 1. ASK THE AMOUNT / QUANTITY */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                    1. Select Quantity / Portions
                  </label>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    How many servings would you like prepared?
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-mono font-extrabold text-base text-gray-900 dark:text-white">
                    {itemQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItemQuantity(Math.min(10, itemQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-[#1e3a5f] hover:bg-[#2b5182] flex items-center justify-center font-bold text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. COOKING & PREPARATION PREFERENCES */}
            {customizingItem.category === 'Mains' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  2. Meat Doneness / Cooking Temperature
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
                          ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/20 shadow-xs'
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

            {customizingItem.category === 'Starters' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  2. Dressing & Finishing Sauce
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Chef Signature Dressing',
                    'Black Truffle Vinaigrette',
                    'Extra Virgin Olive Oil & Modena Balsamic',
                    'Dressing Served on the Side',
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedDressing(opt)}
                      className={`p-2.5 rounded-xl text-left border-2 text-xs font-semibold transition-all ${
                        selectedDressing === opt
                          ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(customizingItem.category === 'Drinks' || customizingItem.category === 'Wines') && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  2. Serving Temperature & Ice
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Chilled with Crystal Ice', 'No Ice (Room Temperature)', 'Extra Chilled'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedDrinkTemp(opt)}
                      className={`p-2.5 rounded-xl text-left border-2 text-xs font-semibold transition-all ${
                        selectedDrinkTemp === opt
                          ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. "DO YOU NEED ANYTHING ELSE?" (ACCOMPANIMENTS, SIDES & EXTRAS) */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                  3. Do You Need Anything Else? (Accompaniments & Extras)
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Select recommended side pairings, artisan bread, or beverage additions:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACCOMPANIMENTS.map(addon => {
                  const isChecked = selectedAddOns.some(a => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#1e3a5f] bg-blue-50/50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
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

            {/* 4. TABLEWARE, CUTLERY & COMPLIMENTARY CONDIMENTS */}
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                    4. Table Cutlery & Setup
                  </label>
                  <span className="text-[11px] text-gray-500">How many dining sets do you require?</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCutleryCount(num)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        cutleryCount === num
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {num} {num === 1 ? 'Set' : 'Sets'}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCutleryCount(0)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      cutleryCount === 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    No Cutlery
                  </button>
                </div>
              </div>

              {/* Condiments */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                  Complimentary Condiments & Table Essentials:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMPLIMENTARY_CONDIMENTS.map(cond => {
                    const isSelected = selectedCondiments.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => handleToggleCondiment(cond)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/40 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#1e3a5f]" />}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. CHEF INSTRUCTIONS */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                5. Special Dietary Or Preparation Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra hot plates, allergy to sesame seeds, sauce served on the side..."
                value={dishSpecialNote}
                onChange={e => setDishSpecialNote(e.target.value)}
                className="input-field text-xs py-2.5"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleAddCustomizedToCart}
                className="flex-1 py-3.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-blue-300" />
                <span>
                  Add {itemQuantity}x to Tray • ${customizedItemTotalPrice.toFixed(2)} USD
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: CART TRAY & CHECKOUT DRAWER */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`In-Room Dining Tray (${cartCount} items configured)`}
        size="md"
      >
        <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto scrollbar-thin">
          {cart.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-500">Your dining tray is currently empty.</p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Explore Menus
              </button>
            </div>
          ) : (
            <>
              {/* Configured Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-gray-700">
                {cart.map(item => (
                  <div key={item.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">{item.name}</span>
                          {item.preparationOption && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold">
                              {item.preparationOption}
                            </span>
                          )}
                        </div>
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

                    {/* Extras & Add-ons list */}
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        + {item.addOns.map(a => a.name).join(', ')}
                      </p>
                    )}

                    {item.cutleryCount && (
                      <p className="text-[10px] text-gray-400">
                        Cutlery: {item.cutleryCount} set(s) · Condiments: {item.condiments?.join(', ') || 'Standard'}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#1e3a5f] dark:text-blue-400 italic">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* QUICK ADD EXTRAS BEFORE CHECKOUT CAROUSEL */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Would You Like Anything Else Before Placing Order?</span>
                </span>
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { name: 'Sparkling Pellegrino 750ml', price: 7.00 },
                    { name: 'Warm Bread Basket', price: 5.00 },
                    { name: 'Espresso Macchiato', price: 6.00 },
                    { name: 'Chocolate Lava Cake', price: 14.00 },
                  ].map(quick => (
                    <button
                      key={quick.name}
                      type="button"
                      onClick={() => {
                        setCart(prev => [
                          ...prev,
                          {
                            id: `QCK-${Date.now()}-${Math.random()}`,
                            name: quick.name,
                            price: quick.price,
                            quantity: 1,
                            category: 'Extras',
                          },
                        ]);
                        onAddToast({
                          type: 'info',
                          title: 'Item Added',
                          message: `${quick.name} added to dining tray.`,
                        });
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-xl text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3 text-[#1e3a5f]" />
                      <span>{quick.name} (+${quick.price})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Configuration */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Delivery Location</label>
                  <select
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value as any)}
                    className="input-field text-xs py-2"
                  >
                    <option value="Room Delivery">Room Delivery (Room #{roomNumber})</option>
                    <option value="Restaurant Pickup">Pickup at Restaurant Host Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Delivery Timing</label>
                  <select
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="input-field text-xs py-2"
                  >
                    <option value="Immediate (~20-25 min)">Immediate (~20-25 min)</option>
                    <option value="In 45 Minutes">In 45 Minutes</option>
                    <option value="Scheduled for 19:30">Scheduled for 19:30</option>
                    <option value="Scheduled for 20:30">Scheduled for 20:30</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Delivery & Placement Instructions</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave on the balcony table, knock softly please..."
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="input-field text-xs py-2"
                >
                  <option value="Charge to Room Folio">Charge directly to Room #{roomNumber} Folio</option>
                  <option value="Credit Card">Card on File (Visa ending in 4242)</option>
                </select>
              </div>

              {/* Financial Totals */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl space-y-1.5 text-xs border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxes (10% VAT)</span>
                  <span className="font-mono">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tray Delivery Service</span>
                  <span className="font-mono">${cartDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#1e3a5f] dark:text-blue-400 font-extrabold text-base">
                    ${cartTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400"
                >
                  Keep Browsing
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-300" />
                  <span>Confirm & Place Order (${cartTotal.toFixed(2)})</span>
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};