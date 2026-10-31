import React, { useState } from 'react';
import {
  MessageSquare, Bell, Search, Plus, Send, CheckCircle2,
  Clock, AlertCircle, HelpCircle, ShieldAlert, Sparkles,
  Phone, User, Check, ArrowRight, Eye, RefreshCw, PackageSearch,
  MessageCircle, Filter, Calendar
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import type {
  GuestStayInfo,
  ChatMessage,
  GeneralServiceRequest,
  LostPropertyReport,
  PortalNotification
} from '../types';

interface CommunicationsTabProps {
  stay: GuestStayInfo;
}

type CommSubTab = 'chat' | 'requests' | 'notifications' | 'lostfound';

export const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ stay }) => {
  const [subTab, setSubTab] = useState<CommSubTab>('chat');

  // Interactive Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-01',
      sender: 'staff',
      senderName: 'Sarah Mitchell',
      senderRole: 'Front Office Duty Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      message: `Good day, Lord Worthington! Welcome back to ${stay.assignedProperty}. I am your dedicated front office host during your stay. If you require any reservations, transport, or room adjustments, please message me directly here anytime.`,
      timestamp: 'Today, 10:00 AM',
      read: true,
    },
    {
      id: 'MSG-02',
      sender: 'guest',
      senderName: stay.name,
      message: 'Thank you Sarah. Could you please confirm if my private dining reservation at Le Cirque is confirmed for 8:00 PM tonight?',
      timestamp: 'Today, 10:14 AM',
      read: true,
    },
    {
      id: 'MSG-03',
      sender: 'staff',
      senderName: 'Sarah Mitchell',
      senderRole: 'Front Office Duty Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      message: 'Yes, absolutely! Table 12 with wine pairing has been reserved under your name. The Sommelier has already decanted your preferred vintage.',
      timestamp: 'Today, 10:16 AM',
      read: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Service requests tickets
  const [requests, setRequests] = useState<GeneralServiceRequest[]>([
    {
      id: 'SRQ-001',
      ticketRef: 'REQ-2026-1049',
      type: 'Special Occasion',
      title: 'Anniversary Flowers & Champagne Setup',
      details: 'Please arrange red roses and chilled vintage champagne in Room 101 for tomorrow evening at 7:00 PM.',
      department: 'Concierge',
      priority: 'High',
      status: 'In Progress',
      submittedAt: '2026-10-30 16:30',
      staffResponse: 'Concierge team ordered Dutch long-stem roses; sommelier assigned Dom Pérignon 2013.',
    },
    {
      id: 'SRQ-002',
      ticketRef: 'REQ-2026-1032',
      type: 'Assistance Request',
      title: 'Airport Chauffeur Transfer for Friday Departure',
      details: 'Requesting Mercedes S-Class transfer to Terminal 5 at 08:30 AM on Friday.',
      department: 'Front Desk',
      priority: 'Medium',
      status: 'Resolved',
      submittedAt: '2026-10-29 18:20',
      staffResponse: 'Chauffeur James Henderson scheduled. Vehicle plate: LX26-VIP.',
      resolvedAt: '2026-10-29 19:00',
    },
  ]);

  // Lost & Found reports
  const [lostItems, setLostItems] = useState<LostPropertyReport[]>([
    {
      id: 'LST-001',
      reportRef: 'LF-2026-042',
      itemName: 'Black Montblanc Fountain Pen',
      approxLocation: 'Lobby Library Lounge or Executive Terrace',
      lostDate: '2026-10-30',
      description: 'Engraved with initials "J.W." on gold clip.',
      status: 'Located in Housekeeping',
      contactPhone: '+44 7700 900123',
      staffNotes: 'Found by Housekeeping team member during evening sweep. Safe-kept in Duty Manager vault.',
    },
  ]);

  // Notifications feed
  const [notifications, setNotifications] = useState<PortalNotification[]>([
    {
      id: 'NTF-01',
      type: 'room_ready',
      title: 'Your Room is Ready',
      message: 'Room #101 (Deluxe King Suite) has passed executive inspection and is ready for key access.',
      timestamp: 'Oct 29, 02:00 PM',
      read: true,
      actionLinkTab: 'stay',
    },
    {
      id: 'NTF-02',
      type: 'order_accepted',
      title: 'Food Order Accepted',
      message: 'Your In-Room Dining order (#ORD-4921) has been accepted and sent to the culinary kitchen.',
      timestamp: 'Oct 30, 07:15 PM',
      read: true,
      actionLinkTab: 'dining',
    },
    {
      id: 'NTF-03',
      type: 'cleaning_progress',
      title: 'Housekeeping in Progress',
      message: 'Housekeeper Elena has commenced scheduled linen renewal for Room #101.',
      timestamp: 'Today, 09:30 AM',
      read: false,
      actionLinkTab: 'housekeeping',
    },
    {
      id: 'NTF-04',
      type: 'maintenance_resolved',
      title: 'Maintenance Issue Resolved',
      message: 'Technician Marcus resolved the balcony AC sensor reading.',
      timestamp: 'Today, 11:20 AM',
      read: false,
      actionLinkTab: 'maintenance',
    },
    {
      id: 'NTF-05',
      type: 'payment_success',
      title: 'Payment Successful',
      message: 'Folio settlement payment of $400.00 was authorized (Ref: TXN-2026-88192).',
      timestamp: 'Oct 25, 11:20 AM',
      read: true,
      actionLinkTab: 'billing',
    },
    {
      id: 'NTF-06',
      type: 'checkout_approaching',
      title: 'Checkout Approaching',
      message: 'Your scheduled departure is in 2 days (Nov 2, 11:00 AM). You can request late checkout or room extension anytime.',
      timestamp: 'Today, 12:00 PM',
      read: false,
      actionLinkTab: 'stay',
    },
    {
      id: 'NTF-07',
      type: 'reservation_updated',
      title: 'Reservation Updated',
      message: 'Late checkout request confirmed until 1:00 PM courtesy of Platinum VIP tier.',
      timestamp: 'Today, 01:10 PM',
      read: false,
      actionLinkTab: 'stay',
    },
  ]);

  // Request modal state
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [reqType, setReqType] = useState<GeneralServiceRequest['type']>('General Inquiry');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDetails, setReqDetails] = useState('');
  const [reqDepartment, setReqDepartment] = useState<GeneralServiceRequest['department']>('Front Desk');
  const [reqPriority, setReqPriority] = useState<GeneralServiceRequest['priority']>('Medium');

  // Lost & Found modal state
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [lostItemName, setLostItemName] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostDate, setLostDate] = useState(new Date().toISOString().substring(0, 10));
  const [lostDescription, setLostDescription] = useState('');

  // Send chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'guest',
      senderName: stay.name,
      message: inputMessage.trim(),
      timestamp: 'Just now',
      read: true,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulated instant staff reply from receptionist
    setTimeout(() => {
      const staffReply: ChatMessage = {
        id: `MSG-REP-${Date.now()}`,
        sender: 'staff',
        senderName: 'Sarah Mitchell',
        senderRole: 'Front Office Duty Manager',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
        message: `Thank you, Lord Worthington. We have noted this immediately for Room #${stay.room} and our team is handling it right away.`,
        timestamp: 'Just now',
        read: true,
      };
      setChatMessages(prev => [...prev, staffReply]);
      setIsTyping(false);
    }, 1500);
  };

  // Submit new service request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: GeneralServiceRequest = {
      id: `SRQ-${Date.now()}`,
      ticketRef: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: reqType,
      title: reqTitle,
      details: reqDetails,
      department: reqDepartment,
      priority: reqPriority,
      status: 'Submitted',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      staffResponse: 'Ticket received and queued for department manager review.',
    };

    setRequests(prev => [newReq, ...prev]);
    setIsNewRequestModalOpen(false);
    setReqTitle('');
    setReqDetails('');
    setSubTab('requests');
  };

  // Submit lost property report
  const handleCreateLostReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LostPropertyReport = {
      id: `LST-${Date.now()}`,
      reportRef: `LF-2026-${Math.floor(100 + Math.random() * 900)}`,
      itemName: lostItemName,
      approxLocation: lostLocation,
      lostDate: lostDate,
      description: lostDescription,
      status: 'Reported',
      contactPhone: '+44 7700 900123',
      staffNotes: 'Security and Housekeeping teams alerted to check sweep logs.',
    };

    setLostItems(prev => [newReport, ...prev]);
    setIsLostModalOpen(false);
    setLostItemName('');
    setLostLocation('');
    setLostDescription('');
    setSubTab('lostfound');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-luxury border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Guest Concierge Communications</span>
              </span>
              <span className="text-xs text-gray-400">
                Direct Host: <strong className="text-white">Sarah Mitchell (Ext. 0)</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Requests & Concierge Hub
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Direct two-way messaging with front desk, request tracking, notification updates, and lost property dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-4 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] border border-blue-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Request / Inquiry</span>
            </button>
            <a
              href="tel:0"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dial Reception (0)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setSubTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'chat'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Direct Chat with Reception</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'requests'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Service Requests ({requests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'notifications'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-purple-500" />
          <span>Notifications & Updates</span>
          {unreadNotifsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-600 text-white font-bold animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('lostfound')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'lostfound'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <PackageSearch className="w-3.5 h-3.5 text-emerald-500" />
          <span>Lost & Found ({lostItems.length})</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: DIRECT CHAT WITH RECEPTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'chat' && (
        <div className="card h-[540px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
                  alt="Sarah Mitchell"
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-gray-800" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Sarah Mitchell</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Front Office Duty Manager · Live Online</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold">
                Room #{stay.room} Direct Line
              </span>
            </div>
          </div>

          {/* Chat Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {chatMessages.map(msg => {
              const isMe = msg.sender === 'guest';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.avatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                  )}
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs ${
                      isMe
                        ? 'bg-[#1e3a5f] text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-700/80 text-gray-900 dark:text-white rounded-tl-none border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {!isMe && (
                      <p className="font-bold text-[10px] text-blue-600 dark:text-blue-400 mb-1">
                        {msg.senderName} ({msg.senderRole})
                      </p>
                    )}
                    <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 text-right ${
                        isMe ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Sarah Mitchell is typing a response...</span>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-800">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask reception a question, request assistance, or inform staff..."
              className="input-field flex-1 text-xs py-2.5"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: SERVICE REQUESTS & TICKETS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'requests' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Guest Service Requests & Tickets
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Submit questions, special arrangements, or service complaints.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-3.5 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>

          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#1e3a5f] dark:text-blue-400">
                        {req.ticketRef}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        {req.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {req.department}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Submitted: {req.submittedAt}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.priority === 'Urgent' || req.priority === 'High'
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {req.priority} Priority
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'Resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                        : req.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {req.details}
                </p>

                {req.staffResponse && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Department Response:</strong> {req.staffResponse}
                      {req.resolvedAt && (
                        <span className="block text-[10px] text-blue-500 mt-0.5">Resolved: {req.resolvedAt}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: NOTIFICATIONS CENTER */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'notifications' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Resident Notifications & Activity Feed
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time alerts regarding room readiness, dining preparation, cleaning, and billing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-xs font-bold text-[#1e3a5f] dark:text-blue-400 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 flex items-start gap-3.5 transition-colors ${
                  !notif.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/40'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'room_ready' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                  notif.type === 'order_accepted' ? 'bg-blue-100 text-[#1e3a5f] dark:bg-blue-900/30' :
                  notif.type === 'cleaning_progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                  notif.type === 'maintenance_resolved' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                  notif.type === 'payment_success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{notif.title}</p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{notif.message}</p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#1e3a5f] flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 4: LOST & FOUND PROPERTY */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'lostfound' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Lost Belongings & Property Tracing
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Report misplaced belongings in hotel restaurants, pools, lobbies, or transport vehicles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLostModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Report Lost Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {lostItems.map(item => (
              <div key={item.id} className="card p-5 space-y-3 border-l-4 border-l-emerald-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {item.reportRef}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        {item.itemName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Approx Location: <strong>{item.approxLocation}</strong> · Date: {item.lostDate}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>

                {item.staffNotes && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300">
                    <strong>Housekeeping & Security Log:</strong> {item.staffNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* NEW SERVICE REQUEST MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        title="Submit Concierge Request or Inquiry"
        size="md"
      >
        <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Request Type
            </label>
            <select
              value={reqType}
              onChange={e => setReqType(e.target.value as any)}
              className="input-field text-xs"
            >
              <option value="General Inquiry">General Inquiry / Question</option>
              <option value="Assistance Request">Assistance Request (Luggage, Transfer, Accessibility)</option>
              <option value="Special Occasion">Special Occasion (Birthday, Anniversary, Flowers)</option>
              <option value="Service Complaint">Service Complaint / Grievance</option>
              <option value="Compliment / Question">Compliment or Note to Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Responsible Department
            </label>
            <select
              value={reqDepartment}
              onChange={e => setReqDepartment(e.target.value as any)}
              className="input-field text-xs"
            >
              <option value="Front Desk">Front Desk Reception</option>
              <option value="Concierge">Chief Concierge</option>
              <option value="Food & Beverage">Food & Beverage Management</option>
              <option value="Housekeeping">Housekeeping Supervisor</option>
              <option value="Management">General Manager's Office</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Request Title / Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anniversary Cake & Late Arrival Request"
              value={reqTitle}
              onChange={e => setReqTitle(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Details & Specific Instructions
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact timings, dietary preferences, or specific needs..."
              value={reqDetails}
              onChange={e => setReqDetails(e.target.value)}
              className="input-field text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Priority Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Urgent'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setReqPriority(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    reqPriority === lvl
                      ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Submit Ticket
            </button>
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* REPORT LOST ITEM MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isLostModalOpen}
        onClose={() => setIsLostModalOpen(false)}
        title="Report Lost Belonging"
        size="md"
      >
        <form onSubmit={handleCreateLostReport} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Item Name / Category
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gold Watch, Sunglasses, Laptop Charger..."
              value={lostItemName}
              onChange={e => setLostItemName(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Estimated Date Lost
              </label>
              <input
                type="date"
                required
                value={lostDate}
                onChange={e => setLostDate(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Approximate Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rooftop Pool Cabana #3"
                value={lostLocation}
                onChange={e => setLostLocation(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Description & Distinguishing Marks
            </label>
            <textarea
              required
              rows={3}
              placeholder="Brand, color, serial number, distinguishing scratches or engravings..."
              value={lostDescription}
              onChange={e => setLostDescription(e.target.value)}
              className="input-field text-xs resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Broadcast to Housekeeping & Security
            </button>
            <button
              type="button"
              onClick={() => setIsLostModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};