import React, { useState } from 'react';
import {
  Moon, CheckCircle2, AlertTriangle, Play, RefreshCw, FileText,
  DollarSign, BedDouble, ShieldCheck, Printer, Check, ArrowRight,
  Sparkles, Clock, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { rooms, initialNightAuditChecklist, folios } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';

export const NightAudit: React.FC = () => {
  const { addToast } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [checklist, setChecklist] = useState(initialNightAuditChecklist);
  const [hasResolvedArrival, setHasResolvedArrival] = useState(false);
  const [batchPosted, setBatchPosted] = useState(false);
  const [cashierBalanced, setCashierBalanced] = useState(false);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [businessDate, setBusinessDate] = useState('October 31, 2026');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '[23:00:15] Night Audit session initiated by David Miller (Night Auditor).',
    '[23:15:22] System integrity check passed. DB connection latency: 12ms.',
    '[23:30:00] POS terminal batch feed received from Ember & Ash.',
  ]);

  // Occupied rooms for batch posting
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const totalRoomRevenue = occupiedRooms.reduce((acc, r) => acc + r.ratePerNight, 0);
  const totalTax = Math.round(totalRoomRevenue * 0.12 * 100) / 100;
  const totalResortFees = occupiedRooms.length * 25;
  const grandBatchTotal = totalRoomRevenue + totalTax + totalResortFees;

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setAuditLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  const handleResolveArrival = (action: 'checkin' | 'noshow') => {
    setHasResolvedArrival(true);
    setChecklist(prev =>
      prev.map(item =>
        item.id === 'NA-01'
          ? {
              ...item,
              status: 'passed',
              actionRequired: undefined,
              details: action === 'checkin'
                ? 'Alexander Wright checked in to Room 402.'
                : 'RES005 processed as No-Show. Guaranteed 1st night fee posted to folio.',
            }
          : item
      )
    );
    addLog(action === 'checkin' ? 'Late arrival RES005 manually checked in.' : 'RES005 flagged No-Show; 1-night guarantee posted.');
    addToast({
      type: 'success',
      title: 'Arrival Reconciled',
      message: action === 'checkin' ? 'Guest checked in successfully.' : 'No-Show fee recorded.',
    });
  };

  const handleRunBatchPost = () => {
    setBatchPosted(true);
    addLog(`Batch posted room charges ($${totalRoomRevenue.toLocaleString()}) and tax ($${totalTax.toLocaleString()}) across ${occupiedRooms.length} occupied rooms.`);
    addToast({
      type: 'success',
      title: 'Batch Posting Complete',
      message: `Posted $${grandBatchTotal.toLocaleString()} to ${occupiedRooms.length} active room folios.`,
    });
    setCurrentStep(3);
  };

  const handleBalanceCashier = () => {
    setCashierBalanced(true);
    addLog('Cashier drawers reconciled. Terminal batch settled with payment gateway. Variance: $0.00.');
    addToast({
      type: 'success',
      title: 'Shift Balanced',
      message: 'All registers and credit card batches reconciled with zero variance.',
    });
    setCurrentStep(4);
  };

  const handleCompleteAudit = () => {
    setAuditCompleted(true);
    setBusinessDate('November 01, 2026');
    addLog('NIGHT AUDIT COMPLETED SUCCESSFULLY. PMS Business Date advanced to November 01, 2026.');
    addLog('Manager Daily Flash Report generated and archived for General Manager review.');
    addToast({
      type: 'success',
      title: 'Night Audit Completed!',
      message: 'Business date rolled over to November 01, 2026. Daily Flash Report ready.',
    });
  };

  const canProceedToStep2 = checklist.every(c => c.status === 'passed') || hasResolvedArrival;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center text-white shadow-md">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                Night Audit & Date Roll
                {auditCompleted && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Day Closed
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Current PMS Business Date: <strong className="text-indigo-600 dark:text-indigo-400">{businessDate}</strong> · Duty Auditor: David Miller (Shift 23:00 - 07:00)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Audit Report Printed',
                message: 'Night audit batch logs sent to secure accounting printer.',
              });
            }}
            className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Flash Report
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Occupied Rooms</span>
            <BedDouble className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{occupiedRooms.length} <span className="text-xs font-normal text-gray-400">/ {rooms.length}</span></p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">87.5% Occupancy Rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Revenue to Post</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${totalRoomRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Base Room Night Charges</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Taxes & Fees Batch</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${(totalTax + totalResortFees).toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">12% Tax + $25 Resort Fees</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audit Balancing Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">$0.00</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Ledger Variance (Balanced)</p>
        </div>
      </div>

      {/* 4-Step Interactive Workflow */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Step Navigation Header */}
        <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold bg-gray-50 dark:bg-gray-800/60">
          {[
            { num: 1, title: '1. Pre-Audit Checklist', done: canProceedToStep2 },
            { num: 2, title: '2. Room & Tax Batch Post', done: batchPosted },
            { num: 3, title: '3. Cashier & Terminal Balance', done: cashierBalanced },
            { num: 4, title: '4. Date Roll & Flash Report', done: auditCompleted },
          ].map(s => {
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 font-bold'
                    : s.done
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {s.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {s.num}
                  </span>
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* STEP 1: PRE-AUDIT CHECKLIST */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">Step 1: End-of-Day Operations Verification</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Ensure all front desk arrivals, departures, and restaurant POS shifts are resolved before closing the books.
                </p>
              </div>

              <div className="space-y-3">
                {checklist.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      item.status === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40'
                        : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                        {item.details && (
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">{item.details}</p>
                        )}
                      </div>
                    </div>

                    {item.status === 'warning' && !hasResolvedArrival && (
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => handleResolveArrival('checkin')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                        >
                          Check In Guest
                        </button>
                        <button
                          onClick={() => handleResolveArrival('noshow')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                        >
                          Process No-Show
                        </button>
                      </div>
                    )}

                    {item.status === 'passed' && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 self-end md:self-auto">
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  disabled={!canProceedToStep2}
                  onClick={() => setCurrentStep(2)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    canProceedToStep2
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Room & Tax Batch Post
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ROOM & TAX BATCH POST */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">Step 2: Room & Tax Automated Batch Posting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Posts the nightly lodging charge, occupancy taxes, and mandatory fees to all in-house occupied room folios.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5">Room</th>
                        <th className="px-4 py-2.5">Guest</th>
                        <th className="px-4 py-2.5">Room Type</th>
                        <th className="px-4 py-2.5 text-right">Nightly Rate</th>
                        <th className="px-4 py-2.5 text-right">Tax (12%)</th>
                        <th className="px-4 py-2.5 text-right">Resort Fee</th>
                        <th className="px-4 py-2.5 text-right font-bold">Total Posting</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {occupiedRooms.map(room => {
                        const tax = Math.round(room.ratePerNight * 0.12 * 100) / 100;
                        const total = room.ratePerNight + tax + 25;
                        return (
                          <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="px-4 py-2.5 font-bold text-gray-900 dark:text-white">#{room.number}</td>
                            <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{room.currentGuest || 'Registered In-House Guest'}</td>
                            <td className="px-4 py-2.5 text-gray-500">{room.type}</td>
                            <td className="px-4 py-2.5 text-right font-medium">${room.ratePerNight}</td>
                            <td className="px-4 py-2.5 text-right text-gray-500">${tax}</td>
                            <td className="px-4 py-2.5 text-right text-gray-500">$25</td>
                            <td className="px-4 py-2.5 text-right font-bold text-indigo-600 dark:text-indigo-400">${total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold uppercase">Batch Total ({occupiedRooms.length} Rooms)</p>
                    <p className="text-xl font-bold text-indigo-950 dark:text-white">
                      ${grandBatchTotal.toLocaleString()} <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400">(Room ${totalRoomRevenue} + Tax ${totalTax} + Fees ${totalResortFees})</span>
                    </p>
                  </div>

                  <button
                    disabled={batchPosted}
                    onClick={handleRunBatchPost}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                      batchPosted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {batchPosted ? (
                      <>
                        <Check className="w-4 h-4" /> Batch Posted
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Execute Batch Post
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
                >
                  Back
                </button>
                {batchPosted && (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md"
                  >
                    Continue to Cashier Balance
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CASHIER & LEDGER RECONCILIATION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">Step 3: Shift Balancing & Credit Card Settlement</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Verify drawer cash counts, credit card batch capture, and city ledger receivables before locking transactions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Front Desk Cash Drawer</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">$1,450.00</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Balanced ($0.00)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Opening float $500.00 + Cash receipts $950.00</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Payment Gateway Batch</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">$12,840.50</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 38 TXNs Captured
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Visa, MasterCard, Amex settled via Stripe/Shift4</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">City Ledger (Direct Bill)</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">$3,200.00</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Corporate Invoiced
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">McKinsey Corp & BCG corporate folios transferred</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">All Financial Ledgers Balanced</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">Total verified transactions: $17,490.50 · Overall variance: $0.00.</p>
                  </div>
                </div>

                <button
                  disabled={cashierBalanced}
                  onClick={handleBalanceCashier}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md ${
                    cashierBalanced ? 'bg-emerald-600 text-white cursor-default' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {cashierBalanced ? 'Shift Balanced' : 'Confirm & Lock Shift'}
                </button>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
                >
                  Back
                </button>
                {cashierBalanced && (
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md"
                  >
                    Proceed to Date Roll
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: DATE ROLL & DAILY FLASH REPORT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">Step 4: Roll PMS Business Date & Flash Report</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Roll the PMS system clock to tomorrow, archive yesterday's books, and produce the General Manager's Flash Report.
                </p>
              </div>

              {!auditCompleted ? (
                <div className="p-8 text-center bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white font-serif">Ready to Roll Business Date</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mt-1">
                      Rolling the date will advance the active PMS operational calendar from <strong>October 31, 2026</strong> to <strong>November 01, 2026</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteAudit}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-base shadow-lg transition-transform hover:scale-105"
                  >
                    🚀 Roll Business Date to November 01, 2026
                  </button>
                </div>
              ) : (
                /* FLASH REPORT SUMMARY */
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 space-y-5">
                  <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">Official PMS Report</span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white font-serif">Daily Manager Flash Report</h4>
                      <p className="text-xs text-gray-500">Business Date Closed: October 31, 2026 · Audited by David Miller</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-bold">
                      Audit Certified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Room Revenue</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${totalRoomRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400">F&B Dining Revenue</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">$2,410.00</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ancillary & Spa</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">$950.00</p>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                      <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold">Total Net Revenue</p>
                      <p className="text-lg font-bold text-indigo-900 dark:text-white mt-1">${(totalRoomRevenue + 2410 + 950).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs border-t pt-4 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="block font-semibold text-gray-900 dark:text-white">ADR (Average Daily Rate):</span>
                      ${Math.round(totalRoomRevenue / occupiedRooms.length)}
                    </div>
                    <div>
                      <span className="block font-semibold text-gray-900 dark:text-white">RevPAR:</span>
                      ${Math.round(totalRoomRevenue / rooms.length)}
                    </div>
                    <div>
                      <span className="block font-semibold text-gray-900 dark:text-white">Occupancy:</span>
                      {Math.round((occupiedRooms.length / rooms.length) * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Audit Log Terminal */}
      <div className="bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl p-4 shadow-inner space-y-1">
        <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2 mb-2 font-sans font-semibold">
          <span className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Night Audit Live Execution Log
          </span>
          <span className="text-[10px] text-gray-500">Auto-Refreshed</span>
        </div>
        <div className="max-h-36 overflow-y-auto space-y-1 scrollbar-thin">
          {auditLogs.map((log, i) => (
            <p key={i} className="leading-relaxed opacity-90">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
