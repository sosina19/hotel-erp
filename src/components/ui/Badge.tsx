import React from 'react';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'purple' | 'gray' | 'gold' | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  gold: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
  gold: 'bg-amber-500',
  blue: 'bg-blue-500',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant]} ${sizeClass}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    'confirmed': { variant: 'info', label: 'Confirmed' },
    'checked-in': { variant: 'success', label: 'Checked In' },
    'checked-out': { variant: 'gray', label: 'Checked Out' },
    'cancelled': { variant: 'error', label: 'Cancelled' },
    'no-show': { variant: 'error', label: 'No Show' },
    'pending': { variant: 'warning', label: 'Pending' },
    'clean': { variant: 'success', label: 'Clean' },
    'dirty': { variant: 'error', label: 'Dirty' },
    'occupied': { variant: 'blue', label: 'Occupied' },
    'maintenance': { variant: 'warning', label: 'Maintenance' },
    'inspecting': { variant: 'purple', label: 'Inspecting' },
    'available': { variant: 'success', label: 'Available' },
    'reserved': { variant: 'info', label: 'Reserved' },
    'cleaning': { variant: 'warning', label: 'Cleaning' },
    'paid': { variant: 'success', label: 'Paid' },
    'partial': { variant: 'warning', label: 'Partial' },
    'open': { variant: 'info', label: 'Open' },
    'settled': { variant: 'success', label: 'Settled' },
    'active': { variant: 'success', label: 'Active' },
    'off-duty': { variant: 'gray', label: 'Off Duty' },
    'on-leave': { variant: 'warning', label: 'On Leave' },
    'ok': { variant: 'success', label: 'OK' },
    'low': { variant: 'warning', label: 'Low Stock' },
    'critical': { variant: 'error', label: 'Critical' },
    'overstock': { variant: 'purple', label: 'Overstock' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    'Platinum': { variant: 'purple', label: 'Platinum' },
    'Gold': { variant: 'gold', label: 'Gold' },
    'Silver': { variant: 'gray', label: 'Silver' },
    'Bronze': { variant: 'warning', label: 'Bronze' },
  };

  const c = config[status] || { variant: 'gray' as BadgeVariant, label: status };
  return <Badge variant={c.variant} dot>{c.label}</Badge>;
};
