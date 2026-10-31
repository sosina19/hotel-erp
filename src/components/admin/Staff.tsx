import React, { useState } from 'react';
import { UserCog, Check, X, Plus, Shield } from 'lucide-react';
import { staffMembers, rbacMatrix } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export const Staff: React.FC = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'staff' | 'rbac'>('staff');

  const roleColors: Record<string, string> = {
    'General Manager': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    'Front Desk': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    'Night Auditor': 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
    'Maintenance Engineer': 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
    'Housekeeping': 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
    'Restaurant Manager': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    'Chef': 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
    'Server': 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
    'Accountant': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    'Concierge': 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
    'Security': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Staff & RBAC</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Role-Based Access Control · {staffMembers.length} employees</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setActiveTab('staff')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'staff' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              <UserCog className="w-4 h-4" />Staff
            </button>
            <button onClick={() => setActiveTab('rbac')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'rbac' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              <Shield className="w-4 h-4" />Permissions
            </button>
          </div>
          <button
            onClick={() => addToast({ type: 'info', title: 'Add Employee', message: 'Employee onboarding in full version.' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {activeTab === 'staff' && (
        <>
          {/* Staff Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'On Duty', value: staffMembers.filter(s => s.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Off Duty', value: staffMembers.filter(s => s.status === 'off-duty').length, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' },
              { label: 'On Leave', value: staffMembers.filter(s => s.status === 'on-leave').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Departments', value: [...new Set(staffMembers.map(s => s.department))].length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {staffMembers.map(staff => (
                  <tr key={staff.id} className="table-row-hover">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{staff.name}</p>
                          <p className="text-xs text-gray-400">{staff.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[staff.role] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="text-gray-600 dark:text-gray-400 text-sm">{staff.department}</td>
                    <td className="text-gray-500 dark:text-gray-400 text-xs font-mono">{staff.email}</td>
                    <td>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{staff.shift}</span>
                    </td>
                    <td><StatusBadge status={staff.status} /></td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => addToast({ type: 'info', title: `Edit ${staff.name}`, message: 'Profile editing in full version.' })} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Role-Based Access Control Matrix</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Green ✓ = Permitted. Red ✗ = Denied. Changes are audit-logged and require admin approval.</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-48">Permission</th>
                    {rbacMatrix.roles.map(role => (
                      <th key={role} className="px-4 py-3 text-center text-xs font-semibold whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-lg text-xs ${roleColors[role] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{role}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {rbacMatrix.permissions.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {row.permission}
                      </td>
                      {rbacMatrix.roles.map(role => {
                        const hasPermission = row[role as keyof typeof row] as boolean;
                        return (
                          <td key={role} className="px-4 py-3 text-center">
                            <button
                              onClick={() => addToast({
                                type: hasPermission ? 'warning' : 'info',
                                title: 'Permission Change',
                                message: `Requires admin approval to ${hasPermission ? 'revoke' : 'grant'} "${row.permission}" for ${role}.`
                              })}
                              className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-all hover:scale-110 ${hasPermission ? 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200' : 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200'}`}
                            >
                              {hasPermission
                                ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                : <X className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                              }
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            🔒 All permission changes are audit-logged with timestamp and user ID for compliance.
          </p>
        </div>
      )}
    </div>
  );
};
