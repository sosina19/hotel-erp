import React, { useState } from 'react';
import {
  Mail, MessageSquare, Send, Bell, CheckCircle2, Clock,
  Smartphone, User, Search, RefreshCw, AlertCircle, FileText, Check, ArrowLeft
} from 'lucide-react';
import type { GuestCommunicationRecord, InHouseResident } from '../types';
import type { Guest } from '../../../data/mockData';

interface GuestCommunicationsProps {
  residents: InHouseResident[];
  guests: Guest[];
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const GuestCommunications: React.FC<GuestCommunicationsProps> = ({
  residents,
  guests,
  onAddToast,
  onBack,
}) => {
  // Communication Outbox log
  const [commsLog, setCommsLog] = useState<GuestCommunicationRecord[]>([
    {
      id: 'MSG-901',
      guestName: 'James Worthington',
      guestContact: '+44 7700 900123',
      type: 'Check-in Confirmation',
      channel: 'SMS',
      subject: 'Welcome to LuxeStay Hotel',
      content: 'Welcome Lord Worthington! Your check-in to Room #101 is confirmed. Your mobile key pass is ready in the app.',
      sentAt: '14:22',
      sentBy: 'Front Desk System',
      status: 'Delivered',
    },
    {
      id: 'MSG-902',
      guestName: 'Sophia Chen',
      guestContact: 'sophia.chen@innovate.tech',
      type: 'Room-Ready Alert',
      channel: 'Email',
      subject: 'Your Suite #201 is Ready for You',
      content: 'Dear Sophia, Housekeeping has certified Executive Suite #201 ready for your stay. You may proceed directly to your room.',
      sentAt: '15:12',
      sentBy: 'Elena Rostova (Housekeeping)',
      status: 'Delivered',
    },
    {
      id: 'MSG-903',
      guestName: 'Marcus Vance',
      guestContact: '+1 555-0144',
      type: 'Payment Receipt',
      channel: 'SMS',
      subject: 'Payment Receipt - $450.00',
      content: 'Payment of $450.00 received for Room #304. Ref: TXN-STRIPE-8819. Thank you!',
      sentAt: 'Yesterday',
      sentBy: 'Front Desk Cashier',
      status: 'Delivered',
    },
  ]);

  // Composer State
  const [selectedRecipientId, setSelectedRecipientId] = useState(residents[0]?.id || '');
  const [selectedType, setSelectedType] = useState<GuestCommunicationRecord['type']>('Check-in Confirmation');
  const [selectedChannel, setSelectedChannel] = useState<'Email' | 'SMS' | 'WhatsApp'>('SMS');
  const [customSubject, setCustomSubject] = useState('Check-In Confirmation & Key Access');
  const [customMessage, setCustomMessage] = useState(
    'Welcome to LuxeStay Hotel! Your check-in is complete. We wish you an exceptional stay.'
  );

  // Quick Templates (All 8 types required by user prompt)
  const templates: Record<GuestCommunicationRecord['type'], { subject: string; body: string }> = {
    'Check-in Confirmation': {
      subject: 'Welcome to LuxeStay Hotel - Check-In Confirmation',
      body: 'Welcome {guest_name}! Your check-in to Room #{room_number} is complete. Your digital RFID key is now active. Dial 0 for Concierge.',
    },
    'Reservation Confirmation': {
      subject: 'Reservation Confirmed - LuxeStay Hotel',
      body: 'Dear {guest_name}, your reservation is confirmed. We look forward to welcoming you. Check-in starts at 14:00.',
    },
    'Checkout Reminder': {
      subject: 'Express Check-Out Reminder - LuxeStay Hotel',
      body: 'Dear {guest_name}, checkout is scheduled for today at 11:00 AM. For express folio settlement or late checkout inquiries, please reply or dial 0.',
    },
    'Payment Receipt': {
      subject: 'Payment Receipt - LuxeStay Hotel',
      body: 'Thank you {guest_name}. Your folio payment has been processed successfully. Transaction reference: TXN-REC-{rand}.',
    },
    'Cancellation Notice': {
      subject: 'Reservation Cancellation Notice',
      body: 'Dear {guest_name}, your reservation has been cancelled per your request according to hotel cancellation policies.',
    },
    'Room-Ready Alert': {
      subject: 'Your Room is Ready! - LuxeStay Hotel',
      body: 'Good news {guest_name}! Room #{room_number} has been inspected and sanitized. It is 100% ready for your arrival.',
    },
    'Request Update': {
      subject: 'Guest Service Request Update',
      body: 'Dear {guest_name}, your recent request has been fulfilled by our duty team. Please let us know if we can assist further.',
    },
    'Hotel Announcement': {
      subject: 'Important Guest Announcement - LuxeStay Hotel',
      body: 'Notice to all guests: Complimentary cocktail hour is hosted at the Panorama Lounge from 17:30 to 19:00 today. We look forward to seeing you.',
    },
  };

  const handleSelectType = (type: GuestCommunicationRecord['type']) => {
    setSelectedType(type);
    const tmpl = templates[type];
    const res = residents.find(r => r.id === selectedRecipientId);
    const name = res ? res.guestName : 'Valued Guest';
    const room = res ? res.roomNumber : 'Suite';

    setCustomSubject(tmpl.subject);
    setCustomMessage(
      tmpl.body
        .replace('{guest_name}', name)
        .replace('{room_number}', room)
        .replace('{rand}', `${Math.floor(1000 + Math.random() * 9000)}`)
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find(r => r.id === selectedRecipientId);
    const name = res ? res.guestName : 'Broadcast / All Guests';
    const contact = res ? (selectedChannel === 'Email' ? res.email : res.phone) : 'All In-House Channels';

    const newRecord: GuestCommunicationRecord = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: name,
      guestContact: contact,
      type: selectedType,
      channel: selectedChannel,
      subject: customSubject,
      content: customMessage,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentBy: 'Front Desk Duty Agent',
      status: 'Delivered',
    };

    setCommsLog(prev => [newRecord, ...prev]);
    onAddToast({
      type: 'success',
      title: `${selectedChannel} Dispatched`,
      message: `${selectedType} delivered to ${name} via ${selectedChannel}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Return to previous screen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Guest Communication & Notification Center (Email / SMS / WhatsApp)
            </h2>
            <p className="text-xs text-gray-500">
              Dispatch confirmations, checkout reminders, payment receipts, room-ready alerts, and hotel-wide announcements.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Message Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Compose & Dispatch Message
              </h3>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl text-xs font-semibold">
                {(['SMS', 'Email', 'WhatsApp'] as const).map(ch => (
                  <button
                    type="button"
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedChannel === ch ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-xs font-bold' : 'text-gray-500'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selector (All 8 Types) */}
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                Select Notification Template (All 8 PMS Standards):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(
                  [
                    'Check-in Confirmation',
                    'Reservation Confirmation',
                    'Checkout Reminder',
                    'Payment Receipt',
                    'Cancellation Notice',
                    'Room-Ready Alert',
                    'Request Update',
                    'Hotel Announcement',
                  ] as const
                ).map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleSelectType(t)}
                    className={`p-2 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                      selectedType === t
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Select In-House Recipient *</label>
                <select
                  value={selectedRecipientId}
                  onChange={e => setSelectedRecipientId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                >
                  <option value="broadcast">Broadcast to All In-House Guests</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>
                      Room #{r.roomNumber} - {r.guestName} ({r.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Subject Header</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase text-gray-500">Message Body *</label>
                <span className="text-[10px] text-gray-400 font-mono">{customMessage.length} characters</span>
              </div>
              <textarea
                required
                rows={4}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch {selectedChannel} Notification
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Delivery History / Outbox Log (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                Communication Delivery Log ({commsLog.length})
              </h4>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                100% Delivered
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60 pr-1">
              {commsLog.map(msg => (
                <div key={msg.id} className="pt-2.5 first:pt-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      {msg.channel === 'Email' ? <Mail className="w-3.5 h-3.5 text-blue-500" /> : <Smartphone className="w-3.5 h-3.5 text-emerald-500" />}
                      {msg.guestName}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.2 rounded">
                      {msg.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{msg.type} · {msg.subject}</p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-750 p-2 rounded-lg font-mono leading-tight">
                    "{msg.content}"
                  </p>
                  <p className="text-[10px] text-gray-400 flex justify-between">
                    <span>To: {msg.guestContact}</span>
                    <span>{msg.sentAt} by {msg.sentBy}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
