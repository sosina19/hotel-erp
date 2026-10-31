import React, { useState } from 'react';
import {
  CreditCard, DollarSign, Download, AlertCircle, CheckCircle2,
  Clock, ShieldAlert, ArrowUpRight, Receipt, FileText, RefreshCw,
  Search, Filter, ChevronRight, HelpCircle, Check, X, Ban,
  Building, Wallet, Sparkles, Send, ShieldCheck
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import type {
  GuestStayInfo,
  FolioChargeItem,
  PaymentTransaction,
  ChargeDispute,
  FolioCategory
} from '../types';

interface BillingTabProps {
  stay: GuestStayInfo;
  onPaymentSuccess: (amount: number, txnRef: string, method: string) => void;
}

type BillingSubTab = 'folio' | 'pay' | 'history' | 'disputes';

export const BillingTab: React.FC<BillingTabProps> = ({ stay, onPaymentSuccess }) => {
  const [subTab, setSubTab] = useState<BillingSubTab>('folio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive charges state
  const [charges, setCharges] = useState<FolioChargeItem[]>([
    {
      id: 'CHG-1001',
      date: '2026-10-29',
      category: 'Accommodation',
      description: 'Deluxe King Suite (Night 1 of 4)',
      reference: 'RM-NIGHT-01',
      amount: 350.00,
      status: 'Finalized',
      serviceDepartment: 'Front Office',
    },
    {
      id: 'CHG-1002',
      date: '2026-10-30',
      category: 'Accommodation',
      description: 'Deluxe King Suite (Night 2 of 4)',
      reference: 'RM-NIGHT-02',
      amount: 350.00,
      status: 'Finalized',
      serviceDepartment: 'Front Office',
    },
    {
      id: 'CHG-1003',
      date: '2026-10-29',
      category: 'Dining & Room Service',
      description: 'Le Cirque – A5 Wagyu Tenderloin & Pinot Noir',
      reference: 'POS-CHK-4821',
      amount: 185.00,
      status: 'Finalized',
      serviceDepartment: 'Food & Beverage',
    },
    {
      id: 'CHG-1004',
      date: '2026-10-30',
      category: 'Additional Services',
      description: 'Lotus Spa – 90min Deep Tissue Aromatherapy',
      reference: 'SPA-TRT-0914',
      amount: 160.00,
      status: 'Finalized',
      serviceDepartment: 'Spa & Wellness',
    },
    {
      id: 'CHG-1005',
      date: '2026-10-30',
      category: 'Laundry',
      description: 'Express Dry Cleaning & Shirt Pressing (3 items)',
      reference: 'LND-EXP-0291',
      amount: 45.00,
      status: 'Finalized',
      serviceDepartment: 'Housekeeping',
    },
    {
      id: 'CHG-1006',
      date: '2026-10-31',
      category: 'Other',
      description: 'In-Room Minibar – Artisan Gin & Pellegrino',
      reference: 'MB-BAR-101',
      amount: 38.00,
      status: 'Pending Verification',
      serviceDepartment: 'Minibar',
    },
    {
      id: 'CHG-1007',
      date: '2026-10-31',
      category: 'Dining & Room Service',
      description: 'In-Room Breakfast – French Toast & Double Espresso',
      reference: 'POS-CHK-5109',
      amount: 42.00,
      status: 'Pending Verification',
      serviceDepartment: 'In-Room Dining',
    },
    {
      id: 'CHG-1008',
      date: '2026-10-29',
      category: 'Taxes & Fees',
      description: 'Local Municipal Tourism Levy (Fixed Room Tax)',
      reference: 'TAX-LEVY-01',
      amount: 25.00,
      status: 'Finalized',
      serviceDepartment: 'Finance',
    },
    {
      id: 'CHG-1009',
      date: '2026-10-29',
      category: 'Taxes & Fees',
      description: 'State Value Added Tax (VAT 10%)',
      reference: 'TAX-VAT-10',
      amount: 117.00,
      status: 'Finalized',
      serviceDepartment: 'Finance',
    },
    {
      id: 'CHG-1010',
      date: '2026-10-29',
      category: 'Discounts',
      description: 'Platinum VIP Membership Loyalty Discount (10% off suite rate)',
      reference: 'VIP-DISC-10',
      amount: 70.00,
      isCredit: true,
      status: 'Finalized',
      serviceDepartment: 'Loyalty Desk',
    },
    {
      id: 'CHG-1011',
      date: '2026-10-25',
      category: 'Deposits',
      description: 'Pre-Arrival Authorization Deposit via Card',
      reference: 'DEP-PREAUTH-01',
      amount: 400.00,
      isCredit: true,
      status: 'Finalized',
      serviceDepartment: 'Reservations',
    },
  ]);

  // Payment transactions history
  const [payments, setPayments] = useState<PaymentTransaction[]>([
    {
      id: 'TXN-001',
      date: '2026-10-25 11:20',
      transactionRef: 'TXN-2026-88192',
      method: 'Credit Card (Visa •••• 4242)',
      amount: 400.00,
      status: 'Successful',
      receiptNumber: 'RCPT-2026-00412',
    },
    {
      id: 'TXN-002',
      date: '2026-10-29 14:35',
      transactionRef: 'TXN-2026-89410',
      method: 'Mastercard (•••• 8821)',
      amount: 150.00,
      status: 'Failed',
      failureReason: 'Transaction declined by issuer bank (temporary security freeze).',
      receiptNumber: 'N/A',
    },
    {
      id: 'TXN-003',
      date: '2026-10-30 09:15',
      transactionRef: 'TXN-2026-90145',
      method: 'Apple Pay',
      amount: 50.00,
      status: 'Refunded',
      refundReason: 'Duplicate minibar charge reversed by Front Desk duty manager.',
      receiptNumber: 'RFND-2026-00019',
    },
  ]);

  // Active disputes state
  const [disputes, setDisputes] = useState<ChargeDispute[]>([
    {
      id: 'DSP-01',
      chargeId: 'CHG-1006',
      chargeDescription: 'In-Room Minibar – Artisan Gin & Pellegrino',
      disputedAmount: 38.00,
      category: 'Service Not Provided',
      reason: 'The minibar was unopened; bottles were inventoried mistakenly.',
      submittedAt: '2026-10-31 10:15',
      status: 'Under Review',
      managementNote: 'Front office contacted Housekeeping supervisor to conduct physical recount.',
    },
  ]);

  // Make Payment form state
  const [payAmountType, setPayAmountType] = useState<'full' | 'custom'>('full');
  const [customPayAmount, setCustomPayAmount] = useState<string>('');
  const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentTransaction['method']>('Credit Card (Visa •••• 4242)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState<PaymentTransaction | null>(null);

  // Dispute modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeChargeId, setDisputeChargeId] = useState<string>('');
  const [disputeCategory, setDisputeCategory] = useState<ChargeDispute['category']>('Incorrect Amount');
  const [disputeReason, setDisputeReason] = useState<string>('');

  // ----------------------------------------------------------------
  // FINANCIAL CALCULATIONS (Strict Business Rules Enforced)
  // ----------------------------------------------------------------
  // Calculate debits (charges)
  const accommodationTotal = charges
    .filter(c => c.category === 'Accommodation' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const diningTotal = charges
    .filter(c => c.category === 'Dining & Room Service' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const laundryTotal = charges
    .filter(c => c.category === 'Laundry' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const additionalServicesTotal = charges
    .filter(c => c.category === 'Additional Services' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const otherChargesTotal = charges
    .filter(c => c.category === 'Other' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const taxesTotal = charges
    .filter(c => c.category === 'Taxes & Fees' && !c.isCredit)
    .reduce((sum, c) => sum + c.amount, 0);

  const grossCharges = accommodationTotal + diningTotal + laundryTotal + additionalServicesTotal + otherChargesTotal + taxesTotal;

  // Calculate credits
  const discountsTotal = charges
    .filter(c => c.category === 'Discounts')
    .reduce((sum, c) => sum + c.amount, 0);

  const depositsTotal = charges
    .filter(c => c.category === 'Deposits')
    .reduce((sum, c) => sum + c.amount, 0);

  // Strict Rule 1 & 2: Only SUCCESSFUL payments reduce outstanding balance!
  const successfulPaymentsTotal = payments
    .filter(p => p.status === 'Successful')
    .reduce((sum, p) => sum + p.amount, 0);

  // Net calculated balance
  // Note: Deposits are already factored in either via initial credit or successful payments
  const totalCredits = discountsTotal + depositsTotal;
  const netOutstandingBalance = Math.max(0, grossCharges - totalCredits);

  // Process payment handler
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToPay = payAmountType === 'full' ? netOutstandingBalance : parseFloat(customPayAmount || '0');

    if (amountToPay <= 0 || isNaN(amountToPay)) {
      alert('Please enter a valid payment amount greater than $0.00.');
      return;
    }

    if (amountToPay > netOutstandingBalance) {
      alert(`Payment cannot exceed the current outstanding balance ($${netOutstandingBalance.toFixed(2)}).`);
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newTxnRef = `TXN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newRcpt = `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTxn: PaymentTransaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        transactionRef: newTxnRef,
        method: selectedPayMethod,
        amount: amountToPay,
        status: 'Successful', // Verified successful
        receiptNumber: newRcpt,
      };

      // Add as credit entry to charges ledger
      const newCreditEntry: FolioChargeItem = {
        id: `PAY-${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        category: 'Deposits',
        description: `Direct Payment Received (${selectedPayMethod})`,
        reference: newTxnRef,
        amount: amountToPay,
        isCredit: true,
        status: 'Finalized',
        serviceDepartment: 'Front Office Settlement',
      };

      setPayments(prev => [newTxn, ...prev]);
      setCharges(prev => [...prev, newCreditEntry]);
      setIsProcessingPayment(false);
      setPaymentSuccessModal(newTxn);
      setCustomPayAmount('');

      // Notify parent to update global state
      onPaymentSuccess(amountToPay, newTxnRef, selectedPayMethod);
    }, 1200);
  };

  // Submit dispute handler
  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCharge = charges.find(c => c.id === disputeChargeId);
    if (!targetCharge) return;

    const newDispute: ChargeDispute = {
      id: `DSP-0${disputes.length + 1}`,
      chargeId: targetCharge.id,
      chargeDescription: targetCharge.description,
      disputedAmount: targetCharge.amount,
      category: disputeCategory,
      reason: disputeReason,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Under Review',
      managementNote: 'Ticket dispatched to Front Desk Financial Auditor for audit review.',
    };

    setDisputes(prev => [newDispute, ...prev]);
    setIsDisputeModalOpen(false);
    setDisputeReason('');
    setDisputeChargeId('');
    setSubTab('disputes');
  };

  // Download itemized tax invoice as text file
  const handleDownloadInvoice = () => {
    const textContent = `
========================================================================
                      ${stay.assignedProperty.toUpperCase()}
                        OFFICIAL GUEST TAX FOLIO & INVOICE
========================================================================
Invoice Reference:  INV-2026-LXP001
Booking Reference:  ${stay.bookingRef}
Resident Name:      ${stay.name}
Room Number:        #${stay.room} (${stay.roomType})
Check-In Date:      ${stay.checkIn}
Check-Out Date:     ${stay.checkOut}
Tax Registration:   VAT-GB-8849-0129-LXP
Date of Issuance:   ${new Date().toLocaleString()}

------------------------------------------------------------------------
ITEMIZED CHARGES BREAKDOWN
------------------------------------------------------------------------
${charges.map(c => {
  const sign = c.isCredit ? '(-)' : '   ';
  return `${c.date} | ${c.reference.padEnd(16)} | ${c.description.padEnd(38)} | ${sign} $${c.amount.toFixed(2)}`;
}).join('\n')}

------------------------------------------------------------------------
FINANCIAL SUMMARY
------------------------------------------------------------------------
Accommodation Total:               $${accommodationTotal.toFixed(2)}
Restaurant & Food Orders:          $${diningTotal.toFixed(2)}
Laundry Services:                  $${laundryTotal.toFixed(2)}
Additional Services:               $${additionalServicesTotal.toFixed(2)}
Other Charges & Minibar:           $${otherChargesTotal.toFixed(2)}
Taxes & Municipal Fees:            $${taxesTotal.toFixed(2)}
------------------------------------------------------------------------
GROSS CHARGES:                     $${grossCharges.toFixed(2)}
VIP Discounts Applied:           - $${discountsTotal.toFixed(2)}
Deposits & Payments Credited:    - $${depositsTotal.toFixed(2)}
------------------------------------------------------------------------
NET OUTSTANDING BALANCE DUE:       $${netOutstandingBalance.toFixed(2)}
Settlement Status:                 ${netOutstandingBalance === 0 ? 'PAID IN FULL - SETTLED' : 'OPEN - PAYMENT REQUIRED'}

------------------------------------------------------------------------
VERIFIED PAYMENT TRANSACTIONS
------------------------------------------------------------------------
${payments.map(p => `${p.date} | ${p.transactionRef} | ${p.method.padEnd(30)} | $${p.amount.toFixed(2)} [${p.status}]`).join('\n')}

Notice: Only verified successful payments are credited to the guest ledger.
Inquiries and billing disputes may be raised via the Guest Portal or reception.
Thank you for staying with ${stay.assignedProperty}.
========================================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Folio_Invoice_${stay.bookingRef}_Room${stay.room}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download individual transaction receipt
  const handleDownloadReceipt = (txn: PaymentTransaction) => {
    const textContent = `
========================================================================
                    OFFICIAL PAYMENT RECEIPT
========================================================================
Receipt Number:     ${txn.receiptNumber}
Transaction Ref:    ${txn.transactionRef}
Date & Time:        ${txn.date}
Property:           ${stay.assignedProperty}
Resident:           ${stay.name} (Room #${stay.room})
Payment Method:     ${txn.method}
Transaction Status: ${txn.status}
Amount Processed:   $${txn.amount.toFixed(2)}
Settlement Type:    Guest Folio Credit
------------------------------------------------------------------------
Authorization Code: AUTH-${Math.floor(100000 + Math.random() * 900000)}
Merchant ID:        LXP-MERCHANT-01
========================================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${txn.transactionRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered charges
  const filteredCharges = charges.filter(c => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesQuery = c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-2xl p-6 sm:p-7 shadow-luxury border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" />
                <span>Guest Folio & Billing</span>
              </span>
              <span className="text-xs text-gray-400">
                Booking: <strong className="text-white font-mono">{stay.bookingRef}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              My Bill & Settlement
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Transparent, itemized breakdown of accommodation, dining, wellness, taxes, and payments.
            </p>
          </div>

          {/* Outstanding Balance KPI Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[210px]">
              <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider block">
                Outstanding Balance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-extrabold ${netOutstandingBalance > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                  ${netOutstandingBalance.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">USD</span>
              </div>
              <span className={`inline-block text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${netOutstandingBalance === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {netOutstandingBalance === 0 ? '✓ Paid in Full' : 'Settlement Required'}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {netOutstandingBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setSubTab('pay')}
                  className="px-4 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] border border-blue-400/30"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Balance Now</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Folio (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Core Financial Categories Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-gray-400 block">Accommodation</span>
            <span className="text-sm font-bold text-white">${accommodationTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-gray-400 block">Dining & Orders</span>
            <span className="text-sm font-bold text-white">${diningTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-gray-400 block">Spa & Services</span>
            <span className="text-sm font-bold text-white">${(additionalServicesTotal + laundryTotal).toFixed(2)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-gray-400 block">Taxes & Fees</span>
            <span className="text-sm font-bold text-white">${taxesTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-emerald-400 block">Discounts Applied</span>
            <span className="text-sm font-bold text-emerald-300">-${discountsTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-[11px] text-emerald-400 block">Payments/Deposits</span>
            <span className="text-sm font-bold text-emerald-300">-${depositsTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setSubTab('folio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'folio'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-blue-500" />
          <span>Folio & Charges ({charges.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('pay')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'pay'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          <span>Make a Payment</span>
          {netOutstandingBalance > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1e3a5f] text-white font-bold">
              ${netOutstandingBalance.toFixed(0)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Payment History & Receipts ({payments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('disputes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'disputes'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Billing Disputes & Inquiries ({disputes.length})</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 1: FOLIO SUMMARY & ITEMIZED CHARGES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'folio' && (
        <div className="space-y-4">
          {/* Controls: Search, Filter, Dispute trigger */}
          <div className="card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search charges by description or reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field pl-9 text-xs py-2"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="input-field text-xs py-2 w-44"
              >
                <option value="all">All Categories</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Dining & Room Service">Dining & Food</option>
                <option value="Laundry">Laundry</option>
                <option value="Additional Services">Spa & Transport</option>
                <option value="Taxes & Fees">Taxes & Fees</option>
                <option value="Discounts">Discounts</option>
                <option value="Deposits">Deposits & Payments</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(true)}
                className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Dispute a Charge</span>
              </button>
            </div>
          </div>

          {/* Charges Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Itemized Folio Transactions
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Business Rule: Guests cannot edit bills. Every entry is audited by Front Office finance.
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                Showing {filteredCharges.length} of {charges.length} entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Category & Department</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredCharges.map(charge => (
                    <tr key={charge.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {charge.date}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-500 whitespace-nowrap">
                        {charge.reference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                          {charge.category}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {charge.serviceDepartment || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                        {charge.description}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          charge.status === 'Finalized'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-[#1e3a5f] dark:text-blue-300'
                        }`}>
                          {charge.status === 'Finalized' ? '✓ Finalized' : '⏳ Pending Audit'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                        charge.isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {charge.isCredit ? `- $${charge.amount.toFixed(2)}` : `$${charge.amount.toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Balance Footer Bar */}
            <div className="bg-gray-50 dark:bg-gray-800/80 p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>All charges certified by Hotel Settlement Audit Protocol.</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">Net Due:</span>
                <span className="text-base font-extrabold text-[#1e3a5f] dark:text-blue-400 font-mono">
                  ${netOutstandingBalance.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 2: MAKE A PAYMENT */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form (2 cols) */}
          <div className="lg:col-span-2 card p-6 space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1e3a5f] dark:text-blue-400" />
                <span>Settle Folio Balance</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Rule: Only verified successful payments reduce your outstanding balance. Pending or failed transactions are never credited.
              </p>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-5">
              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Select Payment Amount
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayAmountType('full')}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      payAmountType === 'full'
                        ? 'border-[#1e3a5f] bg-blue-50/50 dark:bg-blue-900/20 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Pay Full Balance</span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white font-mono">
                      ${netOutstandingBalance.toFixed(2)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayAmountType('custom')}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      payAmountType === 'custom'
                        ? 'border-[#1e3a5f] bg-blue-50/50 dark:bg-blue-900/20 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Pay Partial Amount</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Specify Custom Amount
                    </span>
                  </button>
                </div>

                {payAmountType === 'custom' && (
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Enter Custom Amount (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max={netOutstandingBalance}
                        required
                        placeholder="0.00"
                        value={customPayAmount}
                        onChange={e => setCustomPayAmount(e.target.value)}
                        className="input-field pl-9 font-mono font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Choose Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'Credit Card (Visa •••• 4242)', label: 'Visa Card on File', desc: 'Card ending in 4242 · Exp 08/28', icon: '💳' },
                    { id: 'Mastercard (•••• 8821)', label: 'Corporate Mastercard', desc: 'Card ending in 8821 · Exp 11/27', icon: '💳' },
                    { id: 'Apple Pay', label: 'Apple Pay', desc: 'Biometric 1-click tokenized payment', icon: '🍎' },
                    { id: 'Google Pay', label: 'Google Pay', desc: 'Instant Google Wallet checkout', icon: '🌐' },
                    { id: 'Bank Wire Transfer', label: 'Bank Wire Transfer', desc: 'Verified BACS / SEPA IBAN settlement', icon: '🏦' },
                    { id: 'Loyalty Points', label: 'Redeem Loyalty Points', desc: 'Available balance: 14,850 pts ($148.50 value)', icon: '⭐' },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayMethod === method.id
                          ? 'border-[#1e3a5f] bg-blue-50/40 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{method.label}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">{method.desc}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        value={method.id}
                        checked={selectedPayMethod === method.id}
                        onChange={() => setSelectedPayMethod(method.id as any)}
                        className="text-[#1e3a5f] focus:ring-[#1e3a5f] h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                disabled={isProcessingPayment || (payAmountType === 'full' && netOutstandingBalance <= 0)}
                className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#2b5182] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-blue-400/30"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Gateway Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      Authorize & Pay ${payAmountType === 'full' ? netOutstandingBalance.toFixed(2) : (parseFloat(customPayAmount || '0')).toFixed(2)} USD
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Settlement Policy & Business Rules Box (1 col) */}
          <div className="space-y-4">
            <div className="card p-5 bg-gradient-to-br from-slate-900 to-gray-900 text-white border-slate-700">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Hotel Settlement Policy</span>
              </h3>
              <ul className="text-xs text-gray-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span><strong>Instant Folio Reduction:</strong> Only confirmed successful authorizations decrease your outstanding ledger.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span><strong>Failed Payments:</strong> Declined or pending authorizations are isolated and not treated as settled funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span><strong>Digital Checkout:</strong> Express digital departure requires a zero outstanding balance before room keys are revoked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span><strong>Verifiable Receipts:</strong> Each transaction generates a digitally signed receipt number for expense filing.</span>
                </li>
              </ul>
            </div>

            <div className="card p-4 border-dashed border-2 border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>Corporate Billing & Expense Help</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Need your company VAT number or purchase order stamped on the invoice? Request an amended invoice through the reception chat.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 3: PAYMENT HISTORY & RECEIPTS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'history' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Payment Transactions & Digital Receipts
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Audit log of all settled, pending, failed, and refunded payments.
              </p>
            </div>
            <span className="text-xs text-gray-400">
              Total Recorded: {payments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Transaction Ref</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {payments.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {txn.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {txn.transactionRef}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      {txn.method}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                          txn.status === 'Successful'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                            : txn.status === 'Failed'
                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'
                            : txn.status === 'Refunded'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-[#1e3a5f] dark:text-blue-300'
                        }`}>
                          {txn.status === 'Successful' && '✓ Successful'}
                          {txn.status === 'Failed' && '✕ Failed'}
                          {txn.status === 'Refunded' && '↺ Refunded'}
                          {txn.status === 'Pending' && '⏳ Pending'}
                        </span>
                        {txn.failureReason && (
                          <span className="text-[10px] text-rose-500 mt-1 max-w-xs">
                            Reason: {txn.failureReason}
                          </span>
                        )}
                        {txn.refundReason && (
                          <span className="text-[10px] text-blue-500 mt-1 max-w-xs">
                            Audit: {txn.refundReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      ${txn.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {txn.status === 'Successful' ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(txn)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-[11px] font-bold text-gray-700 dark:text-gray-200 inline-flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 4: BILLING DISPUTES & INQUIRIES */}
      {/* ──────────────────────────────────────────────────────────── */}
      {subTab === 'disputes' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Disputed Charges & Inquiries
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track formal review tickets submitted for incorrect or unrecognized line items.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDisputeModalOpen(true)}
              className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Raise New Dispute</span>
            </button>
          </div>

          <div className="space-y-3">
            {disputes.length === 0 ? (
              <div className="card p-8 text-center text-gray-400 text-xs">
                No active billing disputes on record.
              </div>
            ) : (
              disputes.map(disp => (
                <div key={disp.id} className="card p-5 border-l-4 border-l-rose-500 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">{disp.id}</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{disp.chargeDescription}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-gray-700 font-semibold text-gray-600 dark:text-gray-300">
                          {disp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">Submitted: {disp.submittedAt}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                        ${disp.disputedAmount.toFixed(2)}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-[#1e3a5f] dark:text-blue-300">
                        {disp.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl">
                    <strong>Guest Note:</strong> "{disp.reason}"
                  </p>

                  {disp.managementNote && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                      <strong>Staff Response / Audit Action:</strong> {disp.managementNote}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DISPUTE CREATION MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="Dispute a Folio Charge"
        size="md"
      >
        <form onSubmit={handleCreateDispute} className="p-6 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Submit a formal investigation ticket to the Front Office audit team. Disputed amounts are reviewed within 2 hours.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Select Affected Charge
            </label>
            <select
              required
              value={disputeChargeId}
              onChange={e => setDisputeChargeId(e.target.value)}
              className="input-field text-xs"
            >
              <option value="">Choose a charge line item...</option>
              {charges.filter(c => !c.isCredit).map(c => (
                <option key={c.id} value={c.id}>
                  {c.date} – {c.description} (${c.amount.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Dispute Category
            </label>
            <select
              value={disputeCategory}
              onChange={e => setDisputeCategory(e.target.value as any)}
              className="input-field text-xs"
            >
              <option value="Incorrect Amount">Incorrect Amount</option>
              <option value="Service Not Provided">Service Not Provided</option>
              <option value="Duplicate Charge">Duplicate Charge</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Reason & Explanation
            </label>
            <textarea
              required
              rows={3}
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              placeholder="Please explain why this charge is being disputed..."
              className="input-field text-xs resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Submit Dispute Ticket
            </button>
            <button
              type="button"
              onClick={() => setIsDisputeModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* PAYMENT SUCCESS CONFIRMATION MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!paymentSuccessModal}
        onClose={() => setPaymentSuccessModal(null)}
        title="Payment Authorized & Confirmed"
        size="sm"
      >
        {paymentSuccessModal && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Payment Received Successfully
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your payment has been cleared by the gateway and posted directly to Room #{stay.room} folio.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl text-left text-xs space-y-2 border border-gray-100 dark:border-gray-700 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Ref:</span>
                <span className="font-bold text-gray-900 dark:text-white">{paymentSuccessModal.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Receipt Number:</span>
                <span className="font-bold text-gray-900 dark:text-white">{paymentSuccessModal.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${paymentSuccessModal.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-gray-700 dark:text-gray-300">{paymentSuccessModal.method}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(paymentSuccessModal)}
                className="flex-1 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentSuccessModal(null)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};