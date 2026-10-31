import React, { useState } from 'react';
import { Search, Star, Eye, EyeOff, Phone, Mail, MapPin, Shield, Clock, TrendingUp } from 'lucide-react';
import { guests, reservations, maskEmail, maskPassport } from '../../data/mockData';
import type { Guest } from '../../data/mockData';
import { StatusBadge, Badge } from '../ui/Badge';
import { Drawer } from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export const GuestCRM: React.FC = () => {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [revealedPII, setRevealedPII] = useState<Record<string, boolean>>({});

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.nationality.toLowerCase().includes(q);
    const matchTier = tierFilter === 'All' || g.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const toggleReveal = (guestId: string, field: string) => {
    const key = `${guestId}-${field}`;
    setRevealedPII(prev => ({ ...prev, [key]: !prev[key] }));
    addToast({ type: 'warning', title: 'PII Accessed', message: 'This access has been logged for compliance.' });
  };

  const isRevealed = (guestId: string, field: string) => revealedPII[`${guestId}-${field}`] || false;

  const tierColors: Record<string, string> = {
    Platinum: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Gold: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    Silver: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    Bronze: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };

  const guestReservations = selectedGuest
    ? reservations.filter(r => r.guestId === selectedGuest.id)
    : [];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Guest CRM</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{guests.length} guest profiles · GDPR compliant</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', title: 'Import Guests', message: 'CSV import feature coming soon.' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Guest
        </button>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { tier: 'Platinum', count: guests.filter(g => g.tier === 'Platinum').length, spend: '$84,500', color: 'text-purple-600' },
          { tier: 'Gold', count: guests.filter(g => g.tier === 'Gold').length, spend: '$53,600', color: 'text-amber-600' },
          { tier: 'Silver', count: guests.filter(g => g.tier === 'Silver').length, spend: '$18,300', color: 'text-gray-600' },
          { tier: 'Bronze', count: guests.filter(g => g.tier === 'Bronze').length, spend: '$2,800', color: 'text-orange-600' },
        ].map(t => (
          <div key={t.tier} className="kpi-card text-center">
            <p className={`text-xl font-bold ${t.color}`}>{t.count}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.tier} Members</p>
            <p className="text-xs text-gray-400 mt-0.5">Avg spend: {t.spend}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name, email, or nationality..."
            className="input-field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tierFilter === tier ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="card overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Nationality</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Stays</th>
              <th>Total Spend</th>
              <th>Last Stay</th>
              <th>Preferences</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(guest => (
              <tr key={guest.id} className="table-row-hover cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <img src={guest.avatar} alt={guest.firstName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{guest.firstName} {guest.lastName}</p>
                      <p className="text-xs text-gray-400">{guest.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="text-gray-600 dark:text-gray-400">{guest.nationality}</td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{maskEmail(guest.email)}</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleReveal(guest.id, 'email'); }}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Reveal"
                    >
                      {isRevealed(guest.id, 'email') ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {isRevealed(guest.id, 'email') && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{guest.email}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${tierColors[guest.tier]}`}>
                    <Star className="w-3 h-3" />
                    {guest.tier}
                  </span>
                </td>
                <td className="text-center font-semibold text-gray-700 dark:text-gray-300">{guest.totalStays}</td>
                <td className="font-semibold text-gray-800 dark:text-gray-200">${guest.totalSpend.toLocaleString()}</td>
                <td className="text-gray-500 dark:text-gray-400 text-xs">{guest.lastStay}</td>
                <td>
                  <div className="flex gap-1 flex-wrap max-w-xs">
                    {guest.allergies.map(a => (
                      <span key={a} className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">⚠️ {a}</span>
                    ))}
                    {guest.preferences.slice(0, 1).map(p => (
                      <span key={p} className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">{p}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedGuest(guest); }}
                      className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guest Profile Drawer */}
      <Drawer
        isOpen={!!selectedGuest}
        onClose={() => setSelectedGuest(null)}
        title={selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : ''}
        width="max-w-lg"
      >
        {selectedGuest && (
          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img src={selectedGuest.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGuest.firstName} {selectedGuest.lastName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedGuest.tier} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Member since {selectedGuest.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Stays', value: selectedGuest.totalStays, icon: <Clock className="w-4 h-4 text-blue-500" /> },
                { label: 'Total Spend', value: `$${selectedGuest.totalSpend.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
                { label: 'Nationality', value: selectedGuest.nationality, icon: <MapPin className="w-4 h-4 text-amber-500" /> },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Contact Information (PII Protected)
              </h4>

              {[
                { label: 'Email', value: selectedGuest.email, masked: maskEmail(selectedGuest.email), field: 'email', icon: <Mail className="w-4 h-4" /> },
                { label: 'Phone', value: selectedGuest.phone, masked: selectedGuest.phone.slice(0, 4) + '****' + selectedGuest.phone.slice(-4), field: 'phone', icon: <Phone className="w-4 h-4" /> },
                { label: 'Passport', value: selectedGuest.passportNumber, masked: maskPassport(selectedGuest.passportNumber), field: 'passport', icon: <Shield className="w-4 h-4" /> },
              ].map(item => (
                <div key={item.field} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    {item.icon}
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {isRevealed(selectedGuest.id, item.field) ? item.value : item.masked}
                    </span>
                    <button
                      onClick={() => toggleReveal(selectedGuest.id, item.field)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {isRevealed(selectedGuest.id, item.field) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedGuest.address}</p>
                </div>
              </div>
            </div>

            {/* Preferences & Allergies */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preferences & Alerts</h4>
              {selectedGuest.allergies.length > 0 && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">⚠️ ALLERGY ALERTS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGuest.allergies.map(a => (
                      <span key={a} className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {selectedGuest.preferences.map(p => (
                  <span key={p} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full">{p}</span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedGuest.notes && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Staff Notes</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">{selectedGuest.notes}</p>
              </div>
            )}

            {/* Stay History */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Stay History</h4>
              {guestReservations.length > 0 ? (
                <div className="space-y-2">
                  {guestReservations.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.roomType} — Room {r.roomNumber}</p>
                        <p className="text-xs text-gray-400">{r.checkIn} → {r.checkOut} · {r.nights} nights</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">${r.totalAmount.toLocaleString()}</p>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No recorded stays.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              <button onClick={() => addToast({ type: 'success', title: 'Email Sent', message: `Message sent to ${selectedGuest.firstName}` })} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                Send Email
              </button>
              <button onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Note editing in full version.' })} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Add Note
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
