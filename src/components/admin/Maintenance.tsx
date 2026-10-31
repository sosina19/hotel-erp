import React, { useState } from 'react';
import {
  Wrench, AlertTriangle, CheckCircle2, Clock, Plus, Filter,
  Search, ShieldAlert, ArrowUpRight, DollarSign, BedDouble, User, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initialWorkOrders, rooms } from '../../data/mockData';
import type { WorkOrder } from '../../data/mockData';
import { Modal } from '../ui/Modal';

export const Maintenance: React.FC = () => {
  const { addToast } = useApp();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [roomNumber, setRoomNumber] = useState('101');
  const [category, setCategory] = useState<WorkOrder['category']>('HVAC');
  const [priority, setPriority] = useState<WorkOrder['priority']>('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Marcus Vance');
  const [estimatedCost, setEstimatedCost] = useState('75');
  const [affectsAvailability, setAffectsAvailability] = useState(true);

  const priorityStyles: Record<WorkOrder['priority'], { bg: string; text: string; dot: string }> = {
    emergency: { bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', text: 'Emergency', dot: 'bg-red-500' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800', text: 'High', dot: 'bg-orange-500' },
    medium: { bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', text: 'Medium', dot: 'bg-amber-500' },
    low: { bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', text: 'Low', dot: 'bg-blue-500' },
  };

  const statusStyles: Record<WorkOrder['status'], { bg: string; text: string }> = {
    'open': { bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', text: 'Open' },
    'in-progress': { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', text: 'In Progress' },
    'waiting-parts': { bg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', text: 'Waiting on Parts' },
    'completed': { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', text: 'Completed' },
  };

  const filteredOrders = workOrders.filter(wo => {
    if (statusFilter !== 'all' && wo.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && wo.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        wo.title.toLowerCase().includes(q) ||
        wo.roomNumber.toLowerCase().includes(q) ||
        wo.description.toLowerCase().includes(q) ||
        wo.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newOrder: WorkOrder = {
      id: `WO-${100 + workOrders.length + 1}`,
      roomNumber,
      category,
      priority,
      title,
      description,
      assignedTo,
      reportedBy: 'Front Desk / Staff',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      estimatedCost: Number(estimatedCost) || 50,
      status: 'open',
      affectsRoomAvailability: affectsAvailability,
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');

    addToast({
      type: 'success',
      title: 'Work Order Created',
      message: `Work Order ${newOrder.id} logged for Room ${roomNumber}.`,
    });
  };

  const handleUpdateStatus = (id: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev =>
      prev.map(wo => (wo.id === id ? { ...wo, status: newStatus } : wo))
    );
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Work Order ${id} is now ${newStatus}.`,
    });
  };

  const emergencyCount = workOrders.filter(wo => wo.priority === 'emergency' && wo.status !== 'completed').length;
  const inProgressCount = workOrders.filter(wo => wo.status === 'in-progress').length;
  const oooCount = workOrders.filter(wo => wo.affectsRoomAvailability && wo.status !== 'completed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 dark:bg-amber-700 flex items-center justify-center text-white shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
                Maintenance & Engineering
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Work Orders, Preventative Maintenance & Out-of-Order (OOO) Management
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Work Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Tickets</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {workOrders.filter(w => w.status !== 'completed').length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{inProgressCount} in progress now</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emergency Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{emergencyCount}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">Requires immediate response</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rooms Out-of-Order</span>
            <BedDouble className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{oooCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blocked from check-in</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Resolution Time</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">2.4 hrs</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Within SLA target</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search work orders, rooms, issues..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
          {['all', 'open', 'in-progress', 'waiting-parts', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {st === 'all' ? 'All' : st.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(wo => {
          const priorityMeta = priorityStyles[wo.priority];
          const statusMeta = statusStyles[wo.status];

          return (
            <div
              key={wo.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              <div className="space-y-3">
                {/* Top Badge row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{wo.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Room #{wo.roomNumber}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${priorityMeta.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dot}`} />
                    {priorityMeta.text}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{wo.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{wo.description}</p>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                  <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    Category: <strong>{wo.category}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    Est. Cost: <strong>${wo.estimatedCost}</strong>
                  </span>
                  {wo.affectsRoomAvailability && (
                    <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800">
                      OOO Blocked
                    </span>
                  )}
                </div>

                {/* Assigned Technician */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tech: <strong className="text-gray-900 dark:text-white">{wo.assignedTo}</strong></span>
                  <span className="text-[10px] text-gray-400 ml-auto">{wo.createdAt}</span>
                </div>
              </div>

              {/* Status Action Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusMeta.bg}`}>
                  {statusMeta.text}
                </span>

                <div className="flex items-center gap-1.5">
                  {wo.status === 'open' && (
                    <button
                      onClick={() => handleUpdateStatus(wo.id, 'in-progress')}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Start Work
                    </button>
                  )}
                  {wo.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus(wo.id, 'completed')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Mark Complete
                    </button>
                  )}
                  {wo.status === 'waiting-parts' && (
                    <button
                      onClick={() => handleUpdateStatus(wo.id, 'in-progress')}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Parts Arrived
                    </button>
                  )}
                  {wo.status === 'completed' && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Work Order */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Work Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Room / Area
              </label>
              <select
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.number}>Room {r.number} ({r.type})</option>
                ))}
                <option value="Lobby">Main Lobby & Reception</option>
                <option value="Restaurant">Ember & Ash Restaurant Kitchen</option>
                <option value="Spa">Grand Spa & Hydrotherapy</option>
                <option value="Gym">Fitness Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as WorkOrder['category'])}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="HVAC">HVAC & Climate Control</option>
                <option value="Plumbing">Plumbing & Drains</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Locks & Keycards">Locks, RFID & Security</option>
                <option value="Furniture">Furniture & Carpentry</option>
                <option value="General">General Facility</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as WorkOrder['priority'])}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="emergency">🚨 Emergency (Immediate dispatch)</option>
                <option value="high">⚠️ High Priority (Within 4 hrs)</option>
                <option value="medium">🟡 Medium Priority (Same day)</option>
                <option value="low">🔵 Low Priority (Routine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Assigned Technician
              </label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="Marcus Vance">Marcus Vance (Lead Engineer)</option>
                <option value="David Miller">David Miller (Duty Staff)</option>
                <option value="Elena Rostova">Elena Rostova (Guest Relations)</option>
                <option value="External HVAC Specialist">External HVAC Contractor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Master bathroom hot water pressure low"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Description & Symptoms
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe symptoms, location of shutoff valves, guest comments..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 font-medium">
              <input
                type="checkbox"
                checked={affectsAvailability}
                onChange={e => setAffectsAvailability(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Mark Room as <strong>Out of Order (OOO)</strong></span>
            </label>

            <div className="w-32">
              <label className="block text-[10px] text-gray-400 uppercase">Est. Cost ($)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={e => setEstimatedCost(e.target.value)}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Dispatch Work Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
