import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, ShoppingCart, Search } from 'lucide-react';
import { inventoryItems } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export const Inventory: React.FC = () => {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Linen', 'Toiletries', 'F&B', 'Cleaning', 'Maintenance', 'Office'];

  const filtered = inventoryItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || item.category === category;
    return matchSearch && matchCat;
  });

  const critical = inventoryItems.filter(i => i.status === 'critical');
  const low = inventoryItems.filter(i => i.status === 'low');

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Inventory & Stock</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{inventoryItems.length} items tracked</p>
        </div>
        <button
          onClick={() => addToast({ type: 'success', title: 'PO Created', message: 'Purchase order sent to suppliers.' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          Create PO
        </button>
      </div>

      {/* Alerts */}
      {(critical.length > 0 || low.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {critical.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Critical Stock Alert</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {critical.map(i => i.name).join(', ')} — urgent reorder required
                </p>
              </div>
            </div>
          )}
          {low.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Low Stock Warning</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {low.map(i => i.name).join(', ')} — below reorder point
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Items', value: inventoryItems.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'OK Stock', value: inventoryItems.filter(i => i.status === 'ok').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Low Stock', value: low.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Critical', value: critical.length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items or suppliers..." className="input-field pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${category === cat ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min / Max</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Supplier</th>
              <th>Last Ordered</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(item => {
              const stockPct = (item.currentStock / item.maxStock) * 100;
              const totalValue = item.currentStock * item.unitCost;
              return (
                <tr key={item.id} className="table-row-hover">
                  <td>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{item.category}</span>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{item.currentStock} <span className="text-xs text-gray-400">{item.unit}</span></p>
                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.status === 'critical' ? 'bg-red-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, stockPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500 dark:text-gray-400">{item.minStock} / {item.maxStock}</td>
                  <td className="font-semibold text-gray-700 dark:text-gray-300">${item.unitCost}</td>
                  <td className="font-semibold text-gray-800 dark:text-gray-200">${totalValue.toFixed(2)}</td>
                  <td className="text-gray-600 dark:text-gray-400 text-xs">{item.supplier}</td>
                  <td className="text-gray-400 text-xs">{item.lastOrdered}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => addToast({ type: 'success', title: 'Order Sent', message: `Reorder for ${item.name} initiated.` })}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${item.status === 'critical' || item.status === 'low' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                      >
                        {item.status === 'critical' || item.status === 'low' ? '⚡ Reorder' : 'Reorder'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
