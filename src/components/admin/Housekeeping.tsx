import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, AlertCircle, User, Plus } from 'lucide-react';
import { housekeepingTasks } from '../../data/mockData';
import type { HousekeepingTask } from '../../data/mockData';
import { StatusBadge, Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

const COLUMNS = [
  { id: 'dirty', label: 'Dirty', color: 'border-t-red-500', bg: 'bg-red-50 dark:bg-red-900/10', dot: 'bg-red-500', count_color: 'text-red-600' },
  { id: 'in-progress', label: 'In Progress', color: 'border-t-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', dot: 'bg-blue-500', count_color: 'text-blue-600' },
  { id: 'clean', label: 'Clean / Inspecting', color: 'border-t-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', dot: 'bg-emerald-500', count_color: 'text-emerald-600' },
];

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  medium: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  low: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

const typeLabels: Record<string, string> = {
  checkout: 'Checkout',
  stayover: 'Stayover',
  'deep-clean': 'Deep Clean',
};

export const Housekeeping: React.FC = () => {
  const { addToast } = useApp();
  const [tasks, setTasks] = useState(housekeepingTasks);

  const advanceTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      let next: HousekeepingTask['status'] = t.status;
      if (t.status === 'dirty') next = 'in-progress';
      else if (t.status === 'in-progress') next = 'clean';
      else if (t.status === 'clean') next = 'inspecting';
      addToast({
        type: 'success',
        title: 'Task Updated',
        message: `Room ${t.roomNumber} moved to ${next.replace('-', ' ')}.`,
      });
      return { ...t, status: next, startedAt: next === 'in-progress' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.startedAt, completedAt: next === 'clean' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.completedAt };
    }));
  };

  const getColumnTasks = (colId: string) => {
    if (colId === 'clean') return tasks.filter(t => t.status === 'clean' || t.status === 'inspecting');
    return tasks.filter(t => t.status === colId);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Housekeeping</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tasks.length} tasks today · {tasks.filter(t => t.status === 'clean' || t.status === 'inspecting').length} completed</p>
        </div>
        <button
          onClick={() => addToast({ type: 'success', title: 'Task Assigned', message: 'New housekeeping task created.' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Dirty Rooms', value: tasks.filter(t => t.status === 'dirty').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Clean', value: tasks.filter(t => t.status === 'clean').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Inspecting', value: tasks.filter(t => t.status === 'inspecting').length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff Summary */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          Today's HK Staff
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Maria Garcia', tasks: 3, status: 'active', floor: 'Floors 1-2' },
            { name: 'Carlos Ruiz', tasks: 2, status: 'active', floor: 'Floors 4-5' },
            { name: 'Aisha Patel', tasks: 2, status: 'active', floor: 'Floors 2-3' },
            { name: 'Tom Briggs', tasks: 1, status: 'break', floor: 'Floor 3' },
          ].map(staff => (
            <div key={staff.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{staff.name}</p>
                <p className="text-xs text-gray-400">{staff.floor} · {staff.tasks} tasks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Kanban Board
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map(col => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div key={col.id} className="kanban-column min-w-[260px]">
                <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${col.color.replace('border-t', 'border-b')}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{col.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${col.count_color}`}>{colTasks.length}</span>
                </div>

                {colTasks.map(task => (
                  <div key={task.id} className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-card border border-gray-100 dark:border-gray-600 hover:shadow-luxury transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Room {task.roomNumber}</p>
                        <p className="text-xs text-gray-400">{task.roomType} · Floor {task.floor}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">{typeLabels[task.type]}</span>
                      {(task.status === 'clean' || task.status === 'inspecting') && (
                        <StatusBadge status={task.status} />
                      )}
                    </div>

                    {task.assignedTo && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignedTo}</span>
                      </div>
                    )}

                    {task.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        {task.notes}
                      </p>
                    )}

                    {(task.startedAt || task.completedAt) && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3" />
                        {task.startedAt && <span>Started {task.startedAt}</span>}
                        {task.completedAt && <span>Done {task.completedAt}</span>}
                      </div>
                    )}

                    {task.status !== 'inspecting' && task.status !== 'clean' && (
                      <button
                        onClick={() => advanceTask(task.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {task.status === 'dirty' ? 'Start Cleaning' : 'Mark Clean'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {task.status === 'clean' && (
                      <button
                        onClick={() => advanceTask(task.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Send for Inspection
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {task.status === 'inspecting' && (
                      <button
                        onClick={() => addToast({ type: 'success', title: 'Room Approved', message: `Room ${task.roomNumber} is ready for guests.` })}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        ✓ Approve & Release
                      </button>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
