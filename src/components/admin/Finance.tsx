import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, Check, Eye, TrendingUp, ArrowDownRight } from 'lucide-react';
import { folios } from '../../data/mockData';
import type { Folio } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const categoryIcons: Record<string, string> = {
  Room: '🛏️', Restaurant: '🍽️', Spa: '💆', Bar: '🍾',
  Minibar: '🥤', Laundry: '👗', Phone: '📞', Misc: '📦',
  Tax: '📊', Discount: '🏷️',
};

export const Finance: React.FC = () => {
  const { addToast } = useApp();
  const [folioList, setFolioList] = useState(folios);
  const [selected, setSelected] = useState<Folio | null>(null);
  const [settling, setSettling] = useState(false);

  const totalOpen = folioList.filter(f => f.status !== 'settled').reduce((s, f) => s + f.balance, 0);
  const totalSettled = folioList.filter(f => f.status === 'settled').reduce((s, f) => s + f.total, 0);
  const totalRevenue = folioList.reduce((s, f) => s + f.total, 0);

  const handleSettle = () => {
    if (!selected) return;
    setSettling(true);
    setTimeout(() => {
      setFolioList(prev => prev.map(f =>
        f.id === selected.id ? { ...f, status: 'settled', balance: 0, paid: f.total } : f
      ));
      setSelected(prev => prev ? { ...prev, status: 'settled', balance: 0, paid: prev.total } : null);
      addToast({ type: 'success', title: 'Payment Settled', message: `Folio ${selected.id} — $${selected.balance.toFixed(2)} charged.` });
      setSettling(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Finance & Folios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{folioList.length} active folios · GDPR compliant billing</p>
        </div>
        <button onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Financial reports export in full version.' })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          Export Report
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (Open Folios)', value: `$${totalRevenue.toFixed(2)}`, icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100 dark:bg-emerald-900/30', change: '+12.4%' },
          { label: 'Outstanding Balance', value: `$${totalOpen.toFixed(2)}`, icon: <ArrowDownRight className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-100 dark:bg-amber-900/30', change: '3 folios' },
          { label: 'Settled Today', value: `$${totalSettled.toFixed(2)}`, icon: <Check className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100 dark:bg-blue-900/30', change: `${folioList.filter(f => f.status === 'settled').length} folios` },
          { label: 'Avg Folio Value', value: `$${(totalRevenue / folioList.length).toFixed(2)}`, icon: <DollarSign className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100 dark:bg-purple-900/30', change: 'per stay' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{kpi.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Folios Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Active & Recent Folios</h3>
        </div>
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Folio ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Balance Due</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {folioList.map(folio => (
              <tr key={folio.id} className="table-row-hover">
                <td><span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{folio.id}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">
                      {folio.guestName.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{folio.guestName}</span>
                  </div>
                </td>
                <td className="font-semibold">{folio.roomNumber}</td>
                <td className="text-gray-500 dark:text-gray-400 text-xs">{folio.checkIn}</td>
                <td className="text-gray-500 dark:text-gray-400 text-xs">{folio.checkOut}</td>
                <td>${folio.subtotal.toFixed(2)}</td>
                <td className="text-gray-500 dark:text-gray-400">${folio.taxAmount.toFixed(2)}</td>
                <td className="font-semibold">${folio.total.toFixed(2)}</td>
                <td>
                  <span className={`font-bold ${folio.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    ${folio.balance.toFixed(2)}
                  </span>
                </td>
                <td><StatusBadge status={folio.status} /></td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setSelected(folio)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {folio.status !== 'settled' && (
                      <button
                        onClick={() => { setSelected(folio); }}
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Settle
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Folio Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Folio ${selected?.id} — ${selected?.guestName}`} size="lg">
        {selected && (
          <div className="p-6 space-y-5">
            {/* Folio Summary */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Guest', value: selected.guestName },
                { label: 'Room', value: selected.roomNumber },
                { label: 'Check-In', value: selected.checkIn },
                { label: 'Check-Out', value: selected.checkOut },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Itemized Charges
              </h4>
              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {selected.items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</td>
                        <td className="px-4 py-2">
                          <span className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <span>{categoryIcons[item.category]}</span>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400">{item.date}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-800 dark:text-gray-200">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span><span>${selected.subtotal.toFixed(2)}</span>
              </div>
              {selected.discounts > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Discount / Loyalty</span><span>-${selected.discounts.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax ({(selected.taxRate * 100).toFixed(0)}%)</span><span>${selected.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg border-t border-gray-200 dark:border-gray-600 pt-2">
                <span>Total</span><span>${selected.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Paid</span><span className="text-emerald-600 dark:text-emerald-400">${selected.paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">Balance Due</span>
                <span className={selected.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  ${selected.balance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Actions */}
            {selected.status !== 'settled' && (
              <div className="space-y-3">
                {selected.creditCard && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Card on file: {selected.creditCard}</p>
                      <p className="text-xs text-blue-500">Tap to charge ${selected.balance.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSettle}
                    disabled={settling}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                  >
                    {settling ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Settle ${selected.balance.toFixed(2)}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Partial payment in full version.' })}
                    className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Partial Pay
                  </button>
                  <button
                    onClick={() => addToast({ type: 'warning', title: 'Refund Initiated', message: 'Requires Manager approval.' })}
                    className="px-4 py-3 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Refund
                  </button>
                </div>
              </div>
            )}

            {selected.status === 'settled' && (
              <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Folio fully settled</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
