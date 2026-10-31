import React, { useState } from 'react';
import {
  UtensilsCrossed, Plus, Minus, Trash2, CreditCard, Building2,
  X, ChefHat, Users, Clock, Check, ShoppingCart
} from 'lucide-react';
import { restaurantTables, menuItems } from '../../data/mockData';
import type { RestaurantTable, OrderItem, MenuItem } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const tableStatusColors: Record<string, string> = {
  available: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200',
  occupied: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 hover:bg-red-200',
  reserved: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-200',
  cleaning: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400',
};

const tableStatusDot: Record<string, string> = {
  available: 'bg-emerald-500',
  occupied: 'bg-red-500',
  reserved: 'bg-amber-500',
  cleaning: 'bg-gray-400',
};

const MENU_CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks', 'Wines'];

export const RestaurantPOS: React.FC = () => {
  const { addToast } = useApp();
  const [tables, setTables] = useState(restaurantTables);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [menuCategory, setMenuCategory] = useState('All');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPostRoomModal, setShowPostRoomModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');

  const openTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    setOrderItems(table.currentOrder ? [...table.currentOrder] : []);
  };

  const closeTable = () => {
    setSelectedTable(null);
    setOrderItems([]);
    setMenuCategory('All');
  };

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(o => o.menuItemId === item.id);
      if (existing) {
        return prev.map(o => o.menuItemId === item.id
          ? { ...o, quantity: o.quantity + 1, total: (o.quantity + 1) * o.unitPrice }
          : o
        );
      }
      return [...prev, {
        menuItemId: item.id,
        menuItemName: item.name,
        quantity: 1,
        unitPrice: item.price,
        total: item.price,
      }];
    });
  };

  const updateQty = (itemId: string, delta: number) => {
    setOrderItems(prev =>
      prev
        .map(o => o.menuItemId === itemId ? { ...o, quantity: o.quantity + delta, total: (o.quantity + delta) * o.unitPrice } : o)
        .filter(o => o.quantity > 0)
    );
  };

  const orderTotal = orderItems.reduce((s, i) => s + i.total, 0);
  const tax = orderTotal * 0.12;
  const grandTotal = orderTotal + tax;

  const filteredMenu = menuItems.filter(item =>
    (menuCategory === 'All' || item.category === menuCategory) && item.available
  );

  const handlePayment = () => {
    if (!selectedTable) return;
    setTables(prev => prev.map(t =>
      t.id === selectedTable.id ? { ...t, status: 'cleaning', currentOrder: undefined, totalBill: undefined, guestName: undefined } : t
    ));
    addToast({ type: 'success', title: 'Payment Processed', message: `Table ${selectedTable.number} — $${grandTotal.toFixed(2)} charged.` });
    setShowPayModal(false);
    closeTable();
  };

  const handlePostToRoom = () => {
    if (!roomNumber) return;
    setTables(prev => prev.map(t =>
      t.id === selectedTable?.id ? { ...t, linkedRoomNumber: roomNumber } : t
    ));
    addToast({
      type: 'success',
      title: 'Posted to Room Folio',
      message: `$${grandTotal.toFixed(2)} posted to Room ${roomNumber}'s folio. Guest will settle at checkout.`,
    });
    setShowPostRoomModal(false);
    closeTable();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Restaurant POS</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ember & Ash · Live Table Management</p>
        </div>
        <div className="flex items-center gap-3">
          {['available', 'occupied', 'reserved', 'cleaning'].map(s => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className={`w-2.5 h-2.5 rounded-full ${tableStatusDot[s]}`} />
              <span className="capitalize">{s} ({tables.filter(t => t.status === s).length})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Occupied Tables', value: tables.filter(t => t.status === 'occupied').length, color: 'text-red-600', icon: '🍽️' },
          { label: 'Available Tables', value: tables.filter(t => t.status === 'available').length, color: 'text-emerald-600', icon: '✅' },
          { label: 'Active Covers', value: tables.filter(t => t.status === 'occupied').reduce((a, b) => a + (b.covers || 0), 0), color: 'text-blue-600', icon: '👥' },
          { label: 'Open Revenue', value: `$${tables.filter(t => t.status === 'occupied').reduce((a, b) => a + (b.totalBill || 0), 0).toLocaleString()}`, color: 'text-purple-600', icon: '💰' },
        ].map(s => (
          <div key={s.label} className="kpi-card flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Grid */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Floor Plan</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => table.status !== 'cleaning' && openTable(table)}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left ${tableStatusColors[table.status]} ${table.status === 'cleaning' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md hover:scale-105'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base">T{table.number}</span>
                <span className={`w-2 h-2 rounded-full ${tableStatusDot[table.status]}`} />
              </div>
              <p className="text-xs opacity-70">{table.seats} seats</p>
              {table.status === 'occupied' && (
                <>
                  <p className="text-xs font-medium mt-1 truncate">{table.guestName}</p>
                  {table.totalBill && (
                    <p className="text-xs font-bold mt-0.5">${table.totalBill}</p>
                  )}
                  {table.linkedRoomNumber && (
                    <span className="absolute top-1.5 right-1.5 text-xs">🏨</span>
                  )}
                </>
              )}
              {table.status === 'reserved' && (
                <p className="text-xs mt-1 truncate opacity-80">{table.guestName}</p>
              )}
              {table.status === 'cleaning' && (
                <p className="text-xs mt-1 opacity-70">Cleaning</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Order Screen Modal */}
      <Modal isOpen={!!selectedTable} onClose={closeTable} size="xl" title={selectedTable ? `Table ${selectedTable.number} — ${selectedTable.status === 'occupied' ? `${selectedTable.guestName} · ${selectedTable.covers} covers` : 'New Order'}` : ''}>
        {selectedTable && (
          <div className="flex h-[70vh]">
            {/* Left: Menu */}
            <div className="flex-1 flex flex-col border-r border-gray-100 dark:border-gray-700">
              {/* Category Tabs */}
              <div className="flex gap-1 p-3 border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin flex-shrink-0">
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMenuCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${menuCategory === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredMenu.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToOrder(item)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left group"
                    >
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${item.price}</span>
                          <div className="flex gap-1 flex-wrap">
                            {item.tags.slice(0, 1).map(tag => (
                              <span key={tag} className="text-xs px-1 py-0.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-500 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-64 flex flex-col flex-shrink-0">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Current Order</span>
                <span className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-semibold">{orderItems.length}</span>
              </div>

              {/* Order Items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No items yet</p>
                    <p className="text-xs mt-0.5">Click menu items to add</p>
                  </div>
                ) : (
                  orderItems.map(item => (
                    <div key={item.menuItemId} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.menuItemName}</p>
                        <p className="text-xs text-gray-400">${item.unitPrice} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.menuItemId, -1)} className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                          <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        <button onClick={() => updateQty(item.menuItemId, 1)} className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors">
                          <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-12 text-right">${item.total}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {orderItems.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-3 space-y-2 flex-shrink-0">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span><span>${orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Tax (12%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white text-sm border-t border-gray-100 dark:border-gray-700 pt-2">
                    <span>Total</span><span>${grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    {/* ⭐ KILLER FEATURE */}
                    <button
                      onClick={() => setShowPostRoomModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-xs transition-all shadow-sm"
                    >
                      <Building2 className="w-4 h-4" />
                      Post to Room Folio
                    </button>
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold text-xs transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Charge Now
                    </button>
                    <button
                      onClick={() => addToast({ type: 'success', title: 'Order Sent to Kitchen', message: `${orderItems.length} items sent to Chef Dupont.` })}
                      className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChefHat className="w-4 h-4" />
                      Send to Kitchen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Post to Room Modal */}
      <Modal isOpen={showPostRoomModal} onClose={() => setShowPostRoomModal(false)} title="Post to Room Folio" size="sm">
        <div className="p-6 space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">⭐ Integrated Hotel Billing</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Restaurant charges will be added directly to the guest's room folio and settled at checkout.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Room Number *</label>
            <input
              type="text"
              placeholder="e.g. 101, 201..."
              className="input-field"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex justify-between text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span>Amount to post</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{orderItems.length} items · Table {selectedTable?.number}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePostToRoom}
              disabled={!roomNumber}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Post ${grandTotal.toFixed(2)} to Room {roomNumber || '___'}
            </button>
            <button onClick={() => setShowPostRoomModal(false)} className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Process Payment" size="sm">
        <div className="p-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span><span>${orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tax (12%)</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg border-t border-gray-200 dark:border-gray-600 pt-2">
              <span>Total</span><span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Card', icon: <CreditCard className="w-5 h-5" /> },
              { label: 'Cash', icon: <span className="text-lg font-bold">$</span> },
              { label: 'Room', icon: <Building2 className="w-5 h-5" /> },
            ].map(method => (
              <button
                key={method.label}
                onClick={() => { handlePayment(); }}
                className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
              >
                {method.icon}
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{method.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Card number .... .... .... ...."
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-full placeholder:text-gray-400"
                defaultValue="**** **** **** 4242"
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Check className="w-5 h-5" />
            Charge ${grandTotal.toFixed(2)}
          </button>
        </div>
      </Modal>
    </div>
  );
};
