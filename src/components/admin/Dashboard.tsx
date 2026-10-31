import React from 'react';
import {
  TrendingUp, TrendingDown, Users, DoorOpen, DoorClosed,
  BedDouble, Activity, ArrowUpRight, Download, Printer
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { revenueData, roomStatusData, kpiData, activityFeed } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { downloadRawCSV, getReportDateStamp } from '../../utils/exportUtils';

const activityIcons: Record<string, string> = {
  checkin: '🛎️',
  checkout: '🚪',
  order: '🍽️',
  housekeeping: '🧹',
  maintenance: '🔧',
  booking: '📋',
  payment: '💳',
};

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  prefix?: string;
  suffix?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, iconBg, prefix = '', suffix = '' }) => (
  <div className="kpi-card animate-slide-up">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <span className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {Math.abs(change)}%
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
      {prefix}{value}{suffix}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">vs. yesterday</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-luxury p-3 border border-gray-100 dark:border-gray-700 text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400 capitalize">{entry.name}:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-luxury p-3 border border-gray-100 dark:border-gray-700 text-xs">
        <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
        <p className="text-gray-600 dark:text-gray-300">{payload[0].value} rooms</p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const { addToast, setAdminPage } = useApp();

  const handleExportReport = () => {
    const dateStamp = getReportDateStamp();
    const csvContent = 
      "BETORA HMS - OPERATIONS EXECUTIVE REPORT\r\n" +
      `Report Generated,${dateStamp}\r\n` +
      `Property,Betora Grand Palace Hotel\r\n` +
      `System,Betora PMS Operations Engine\r\n\r\n` +
      "OPERATIONS KEY METRICS,TODAY,CHANGE / STATUS\r\n" +
      `Total Revenue Today,$13650,+8.2% vs yesterday\r\n` +
      `Occupancy Rate,${kpiData.occupancyRate}%,+5.1% vs yesterday\r\n` +
      `Arrivals Scheduled,${kpiData.arrivalsToday},12 completed\r\n` +
      `Departures Scheduled,${kpiData.departuresTeday},18 completed\r\n` +
      `Average Daily Rate (ADR),$524,Per room / night\r\n` +
      `RevPAR,$356,Revenue per available room\r\n\r\n` +
      "ROOM INVENTORY BREAKDOWN,ROOMS COUNT,PERCENTAGE\r\n" +
      roomStatusData.map(r => `${r.name},${r.value},${((r.value / 40) * 100).toFixed(1)}%`).join("\r\n") + "\r\n\r\n" +
      "7-DAY REVENUE PERFORMANCE,ROOMS REVENUE,RESTAURANT REVENUE,SPA REVENUE,DAILY TOTAL\r\n" +
      revenueData.map(d => `${d.date},$${d.rooms},$${d.restaurant},$${d.spa},$${d.total}`).join("\r\n") + "\r\n\r\n" +
      "LATEST OPERATIONAL AUDIT LOG,TIME,CATEGORY,STAFF / AGENT,DETAILS\r\n" +
      activityFeed.map(a => `${a.time},${a.type},"${a.user}","${a.message.replace(/"/g, '""')}"`).join("\r\n");

    downloadRawCSV(`Betora_Operations_Report_${dateStamp}.csv`, csvContent);

    addToast({
      type: 'success',
      title: 'Operations Report Exported',
      message: `Downloaded Betora_Operations_Report_${dateStamp}.csv with full KPI, revenue & room statistics.`,
    });
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Operations Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Friday, October 30, 2026 · Live Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold transition-colors border border-gray-200 dark:border-gray-700"
            title="Print Executive Daily Summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Summary</span>
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            title="Download complete Operations CSV report"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue Today"
          value="13,650"
          change={kpiData.revenueChange}
          prefix="$"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <KPICard
          title="Occupancy Rate"
          value={`${kpiData.occupancyRate}`}
          change={kpiData.occupancyChange}
          suffix="%"
          icon={<BedDouble className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <KPICard
          title="Arrivals Today"
          value={`${kpiData.arrivalsToday}`}
          change={0}
          icon={<DoorOpen className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <KPICard
          title="Departures Today"
          value={`${kpiData.departuresTeday}`}
          change={-15}
          icon={<DoorClosed className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Avg Daily Rate', value: '$524', sub: 'per room · night', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'RevPAR', value: '$356', sub: 'revenue per available room', color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Restaurant Covers', value: '47', sub: 'dining guests today', color: 'text-amber-600 dark:text-amber-400' },
        ].map(item => (
          <div key={item.label} className="kpi-card text-center py-4">
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{item.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 7 days · All revenue streams</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Activity className="w-4 h-4" />
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="rooms" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Rooms" />
              <Line type="monotone" dataKey="restaurant" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Restaurant" />
              <Line type="monotone" dataKey="spa" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Spa" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Status Pie */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Room Status</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">10 total rooms</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={roomStatusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {roomStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {roomStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.value} rooms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bar */}
        <div className="lg:col-span-2 card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Revenue Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">By revenue stream</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="rooms" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Rooms" />
              <Bar dataKey="restaurant" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Restaurant" />
              <Bar dataKey="spa" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Spa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">Live Activity</h3>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 scrollbar-thin" style={{ maxHeight: 220 }}>
            {activityFeed.map(item => (
              <div key={item.id} className="flex items-start gap-2.5">
                <span className="text-base flex-shrink-0 mt-0.5">{activityIcons[item.type] || '📌'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">{item.message}</p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400">{item.time}</span>
                    {item.user && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs text-gray-400">{item.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setAdminPage('reservations')}
            className="mt-3 w-full text-center text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex-shrink-0"
          >
            View all activity →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Reservation', icon: '📋', page: 'reservations' as const, color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700' },
            { label: 'Walk-in Check-In', icon: '🛎️', page: 'frontdesk' as const, color: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700' },
            { label: 'Restaurant POS', icon: '🍽️', page: 'restaurant-pos' as const, color: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700' },
            { label: 'Housekeeping Board', icon: '🧹', page: 'housekeeping' as const, color: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => setAdminPage(action.page)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200 ${action.color} hover:scale-105 hover:shadow-sm cursor-pointer`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
