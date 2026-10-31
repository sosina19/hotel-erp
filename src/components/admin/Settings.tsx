import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, CreditCard, Globe, Lock, Building2 } from 'lucide-react';
import { systemSettings, propertyConfigs } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const tabs = [
  { id: 'general', label: 'General', icon: <Building2 className="w-4 h-4" /> },
  { id: 'booking', label: 'Booking', icon: <Globe className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
];

export const Settings: React.FC = () => {
  const { addToast, propertyMode } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const config = propertyConfigs[propertyMode];

  const handleSave = () => addToast({ type: 'success', title: 'Settings Saved', message: 'Your changes have been saved.' });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">System configuration for {config.name}</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-44 flex-shrink-0">
          <div className="space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'general' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">General Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Property Name', value: config.name },
                  { label: 'Currency', value: config.currency },
                  { label: 'Timezone', value: systemSettings.general.timezone },
                  { label: 'Language', value: systemSettings.general.language },
                  { label: 'Date Format', value: systemSettings.general.dateFormat },
                  { label: 'Address', value: config.address },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                    <input type="text" defaultValue={field.value} className="input-field" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Booking Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Check-In Time', value: systemSettings.booking.checkInTime },
                  { label: 'Check-Out Time', value: systemSettings.booking.checkOutTime },
                  { label: 'Cancellation Policy', value: systemSettings.booking.cancellationPolicy },
                  { label: 'Deposit %', value: String(systemSettings.booking.depositPercent) },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                    <input type="text" defaultValue={field.value} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Require Deposit on Booking', key: 'depositRequired', value: systemSettings.booking.depositRequired },
                  { label: 'Auto-Confirm Reservations', key: 'autoConfirm', value: systemSettings.booking.autoConfirm },
                ].map(toggle => (
                  <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{toggle.label}</span>
                    <button
                      onClick={handleSave}
                      className={`relative w-10 h-5 rounded-full transition-colors ${toggle.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggle.value ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Email on New Booking', value: systemSettings.notifications.emailOnBooking },
                  { label: 'Email on Cancellation', value: systemSettings.notifications.emailOnCancellation },
                  { label: 'SMS on Check-In', value: systemSettings.notifications.smsOnCheckIn },
                  { label: 'Send Daily Report', value: systemSettings.notifications.dailyReport },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <button
                      onClick={handleSave}
                      className={`relative w-10 h-5 rounded-full transition-colors ${item.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Daily Report Time</label>
                <input type="time" defaultValue={systemSettings.notifications.reportTime} className="input-field w-32" />
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Payment Gateway</h3>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">Stripe Connected</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Live mode · acct_1234****abcd</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map(method => (
                  <div key={method} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{method}</span>
                    <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                      <span className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Security & Compliance</h3>
              <div className="space-y-3">
                {[
                  { label: '2-Factor Authentication (2FA)', enabled: true, desc: 'Required for all manager logins' },
                  { label: 'PII Data Masking', enabled: true, desc: 'Guest personal data masked in UI' },
                  { label: 'Audit Logging', enabled: true, desc: 'All data access is logged' },
                  { label: 'GDPR Compliance Mode', enabled: true, desc: 'Data retention & deletion policies active' },
                  { label: 'Session Timeout (30 min)', enabled: true, desc: 'Auto-logout after 30 mins idle' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={handleSave}
                      className={`relative w-10 h-5 rounded-full transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.enabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
