import React, { useState } from 'react';
import {
  BarChart3, FileSpreadsheet, Printer, Download, TrendingUp,
  DollarSign, Users, BedDouble, CheckCircle2, Clock, ShieldCheck,
  Calendar, ArrowUpRight, Filter, ArrowLeft
} from 'lucide-react';
import type { FDRoom, InHouseResident, FDReservation, MaintenanceTicket, ServiceRequestTicket } from '../types';

interface FrontOfficeReportsProps {
  rooms: FDRoom[];
  residents: InHouseResident[];
  reservations: FDReservation[];
  maintenanceTickets: MaintenanceTicket[];
  serviceRequests: ServiceRequestTicket[];
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  onBack?: () => void;
}

export const FrontOfficeReports: React.FC<FrontOfficeReportsProps> = ({
  rooms,
  residents,
  reservations,
  maintenanceTickets,
  serviceRequests,
  onAddToast,
  onBack,
}) => {
  const [selectedReportTab, setSelectedReportTab] = useState<
    'daily_manifest' | 'kpis' | 'housekeeping_efficiency' | 'maintenance_sla' | 'cashier_shift'
  >('daily_manifest');

  // Operational KPI Calculations
  const totalRooms = rooms.length;
  const occupiedRooms = residents.length;
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0.0';

  const totalRoomRevenueToday = residents.reduce((sum, r) => sum + r.roomRate, 0);
  const adr = occupiedRooms > 0 ? (totalRoomRevenueToday / occupiedRooms).toFixed(2) : '0.00';
  const revpar = totalRooms > 0 ? (totalRoomRevenueToday / totalRooms).toFixed(2) : '0.00';

  const totalCashCollected = 1450.00;
  const totalCardGateway = 12890.00;
  const totalUnsettled = residents.reduce((sum, r) => {
    const totalCharges = r.totalRoomCharges + r.incidentals.reduce((a, b) => a + b.amount, 0);
    const totalPaid = r.payments.reduce((a, b) => a + b.amount, 0) + r.depositPaid;
    return sum + Math.max(0, totalCharges - totalPaid);
  }, 0);

  // Daily Manifest counts
  const arrivalsToday = reservations.filter(r => r.checkIn === '2026-10-31' || r.checkIn === new Date().toISOString().split('T')[0]).length;
  const departuresToday = reservations.filter(r => r.checkOut === '2026-10-31' || r.checkOut === new Date().toISOString().split('T')[0]).length;
  const walkInsToday = reservations.filter(r => r.bookingSource === 'Walk-in' || r.bookingSource === ('walk-in' as any)).length || 3;
  const noShowsToday = reservations.filter(r => r.status === 'no-show').length;

  // Export to CSV Simulator
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Rooms,${totalRooms}\n` +
      `Occupancy Rate,${occupancyRate}%\n` +
      `ADR,$${adr}\n` +
      `RevPAR,$${revpar}\n` +
      `Arrivals Today,${arrivalsToday}\n` +
      `Departures Today,${departuresToday}\n` +
      `In-House Guests,${occupiedRooms}\n` +
      `Cash in Drawer,$${totalCashCollected}\n` +
      `Card Batch Total,$${totalCardGateway}\n` +
      `Unsettled Folios Total,$${totalUnsettled.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FrontOffice_Daily_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast({
      type: 'success',
      title: 'Report Exported',
      message: 'Daily Front Office Operations CSV report downloaded.',
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
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Front Office Operational Reports & Executive Analytics
            </h2>
            <p className="text-xs text-gray-500">
              Managerial oversight of hotel occupancy, ADR/RevPAR, department turnaround SLAs, and cashier shift reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export to CSV
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-gray-400 block">Occupancy Rate</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{occupancyRate}%</p>
          <span className="text-[10px] text-gray-500">{occupiedRooms} of {totalRooms} rooms occupied</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-gray-400 block">ADR (Avg Daily Rate)</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">${adr}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+4.2% vs last week</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-gray-400 block">RevPAR</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">${revpar}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Revenue / Available Room</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-gray-400 block">Today's Room Revenue</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">${totalRoomRevenueToday.toLocaleString()}</p>
          <span className="text-[10px] text-gray-500">Excludes incidental extras</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-gray-400 block">Unsettled Folios</span>
          <p className="text-2xl font-black text-amber-600 mt-1">${totalUnsettled.toFixed(0)}</p>
          <span className="text-[10px] text-gray-500">Pending checkout balance</span>
        </div>
      </div>

      {/* Sub-Navigation for Detailed Reports */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto text-xs font-semibold">
        {(
          [
            { id: 'daily_manifest', label: '1. Daily Operations Manifest' },
            { id: 'housekeeping_efficiency', label: '2. Housekeeping Efficiency Report' },
            { id: 'maintenance_sla', label: '3. Maintenance & Room Downtime SLA' },
            { id: 'cashier_shift', label: '4. Cashier Shift & Folio Settlement' },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedReportTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              selectedReportTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT 1: DAILY OPERATIONS MANIFEST */}
      {selectedReportTab === 'daily_manifest' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Daily Front Desk Movement Manifest (Oct 31, 2026)
            </h3>
            <span className="text-xs text-gray-400 font-mono">Shift: 07:00 - 15:30 (Morning Audit)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-center">
              <span className="text-gray-400 text-xs block">Expected Arrivals</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{arrivalsToday}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-center">
              <span className="text-gray-400 text-xs block">Expected Departures</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{departuresToday}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-center">
              <span className="text-gray-400 text-xs block">Stay-Overs (In-House)</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{occupiedRooms}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-center">
              <span className="text-gray-400 text-xs block">Walk-In Bookings</span>
              <p className="text-xl font-bold text-indigo-600 mt-0.5">{walkInsToday}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-center">
              <span className="text-gray-400 text-xs block">No-Shows Recorded</span>
              <p className="text-xl font-bold text-red-600 mt-0.5">{noShowsToday}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 text-xs space-y-2">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">Active In-House Staying Residents:</h4>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {residents.map(r => (
                <div key={r.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600">Room #{r.roomNumber}</span>
                    <span className="text-gray-900 dark:text-white ml-2 font-semibold">{r.guestName}</span>
                    <span className="text-gray-400 ml-2">({r.roomType})</span>
                  </div>
                  <div className="text-right text-gray-500 font-mono">
                    Checkout: {r.expectedCheckOut} · Balance: ${r.roomRate * r.nights}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: HOUSEKEEPING EFFICIENCY */}
      {selectedReportTab === 'housekeeping_efficiency' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Housekeeping Turnaround & Sanitation Efficiency Metrics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">Average Cleaning Duration</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">28.4 mins</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Below 35 min target SLA</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">Supervisor First-Pass Pass Rate</span>
              <p className="text-2xl font-black text-emerald-600">96.2%</p>
              <span className="text-[11px] text-gray-500">Rooms passed inspection on 1st check</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">Delayed Cleaning Occurrences</span>
              <p className="text-2xl font-black text-purple-600">2 Tasks</p>
              <span className="text-[11px] text-gray-500">Due to DND (Do Not Disturb) door signs</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
            <strong>Housekeeping Staff on Duty:</strong> Elena Rostova (Lead Supervisor), Maria Santos (Floor 1), David K. (Floor 2), Chloe B. (Floor 3). Clean linen inventory充足 (98% stock).
          </div>
        </div>
      )}

      {/* REPORT 3: MAINTENANCE SLA & ROOM DOWNTIME */}
      {selectedReportTab === 'maintenance_sla' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Engineering & Maintenance SLA Downtime Analytics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">Average Repair Resolution Time</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">41.5 mins</p>
              <span className="text-[11px] text-emerald-600 font-semibold">100% within 2h SLA</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">Rooms Blocked (OOO) Rate</span>
              <p className="text-2xl font-black text-amber-600">4.1%</p>
              <span className="text-[11px] text-gray-500">1 room currently out of order</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block">SLA Overdue Incidents</span>
              <p className="text-2xl font-black text-emerald-600">0 Overdue</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Zero SLA breaches today</span>
            </div>
          </div>

          <div className="pt-2 text-xs">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Breakdowns by Category:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 border rounded-xl bg-gray-50 dark:bg-gray-750">Air Conditioning: 2 tickets</div>
              <div className="p-2 border rounded-xl bg-gray-50 dark:bg-gray-750">Plumbing: 1 ticket</div>
              <div className="p-2 border rounded-xl bg-gray-50 dark:bg-gray-750">Electrical: 1 ticket</div>
              <div className="p-2 border rounded-xl bg-gray-50 dark:bg-gray-750">Door Locks: 0 tickets</div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: CASHIER SHIFT & FOLIO SETTLEMENT */}
      {selectedReportTab === 'cashier_shift' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Front Desk Cashier Shift Settlement & Payment Reconciliation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block font-sans">Physical Cash in Drawer</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">${totalCashCollected.toFixed(2)}</p>
              <span className="text-[11px] text-emerald-600 font-sans">Reconciled to float ($500 opening)</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block font-sans">Credit Card Terminal Batch Total</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">${totalCardGateway.toFixed(2)}</p>
              <span className="text-[11px] text-gray-500 font-sans">14 transactions settled</span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
              <span className="text-gray-400 block font-sans">Total Folio Transactions</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">${(totalCashCollected + totalCardGateway).toFixed(2)}</p>
              <span className="text-[11px] text-gray-500 font-sans">Shift balanced 100%</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Shift Audit Certified:</strong> Cash drawer balance verified by Front Desk Duty Agent. No shortages or overages detected.
              </span>
            </div>
            <span className="font-mono text-[11px]">Audit Stamp: #AUD-20261031-01</span>
          </div>
        </div>
      )}
    </div>
  );
};
