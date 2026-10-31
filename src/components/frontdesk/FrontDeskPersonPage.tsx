import React, { useState, useRef } from 'react';
import {
  ConciergeBell, CalendarDays, DoorOpen, DoorClosed, UserCheck,
  MessageSquareWarning, BedDouble, Search, Plus, Filter, Check,
  AlertCircle, KeyRound, ArrowRightLeft, DollarSign, Clock,
  ShieldCheck, Phone, Mail, User, AlertTriangle, Sparkles,
  Printer, CheckCircle2, RefreshCw, X, ChevronRight, ChevronLeft,
  FileText, Building, Wrench, Utensils, HeartHandshake, Eye, Camera,
  Upload, Scan, ShieldAlert, Award, Hash, MapPin, Calendar,
  Edit2, Save, Trash2, GitMerge, CheckSquare, Layers, Lock, Download,
  Receipt, CreditCard, Tag, ArrowUpRight, ArrowDownLeft, Shield, Ban,
  CheckCircle, HelpCircle, Users, Coffee, Bed, LogOut, UserPlus, Briefcase, BarChart3,
  ArrowLeft, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  reservations as initialReservations,
  todayArrivals as initialArrivals,
  todayDepartures as initialDepartures,
  rooms as initialRooms,
  guests as initialGuests,
  activityFeed as initialActivityFeed,
  staffMembers,
  propertyConfigs
} from '../../data/mockData';
import type { Reservation, Guest, Room, Activity } from '../../data/mockData';
import { StatusBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { HousekeepingCoordination } from './modules/HousekeepingCoordination';
import { MaintenanceCoordination } from './modules/MaintenanceCoordination';
import { GuestServicesDesk } from './modules/GuestServicesDesk';
import { RoomTransferModal } from './modules/RoomTransferModal';
import { WalkInDesk } from './modules/WalkInDesk';
import { GroupCorporateDesk } from './modules/GroupCorporateDesk';
import { GuestCommunications } from './modules/GuestCommunications';
import { FrontOfficeReports } from './modules/FrontOfficeReports';
import { NewGuestRegistration } from './modules/NewGuestRegistration';
import type {
  MaintenanceTicket,
  ServiceRequestTicket,
  GroupBooking,
  GuestCommunicationRecord,
  RoomAssignmentRecord
} from './types';


// ============================================================
// EXTENDED DATA TYPES FOR FRONT DESK
// ============================================================
export interface AdditionalOccupant {
  id: string;
  name: string;
  age?: number;
  relationship: string;
  idNumber?: string;
}

export interface FDRoom extends Room {
  roomStatus: 'vacant' | 'occupied' | 'blocked' | 'out_of_order';
  housekeepingStatus: 'clean' | 'inspected' | 'dirty' | 'inspecting';
  blockReason?: string;
  blockReleaseDate?: string;
  maintenanceNote?: string;
  upcomingReservation?: string;
}

export interface FDReservation extends Reservation {
  additionalOccupants?: AdditionalOccupant[];
  isGroup?: boolean;
  groupCode?: string;
  isEarlyArrival?: boolean;
  isLateArrival?: boolean;
  actualArrival?: string;
  actualDeparture?: string;
  notes?: string;
  depositAmount?: number;
}

export interface InHouseResident {
  id: string;
  resId: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkInTime: string;
  expectedCheckOut: string;
  actualCheckOut?: string;
  nights: number;
  adults: number;
  children: number;
  tier: string;
  phone: string;
  email: string;
  additionalOccupants: AdditionalOccupant[];
  roomRate: number;
  totalRoomCharges: number;
  incidentals: { id: string; date: string; category: string; description: string; amount: number }[];
  payments: { id: string; date: string; method: string; amount: number; ref: string; status: 'successful' | 'failed' | 'refunded' }[];
  depositPaid: number;
  notes: string[];
  lateCheckOutGranted?: string;
  vipStatus?: boolean;
  roomAssignmentHistory?: RoomAssignmentRecord[];
}


export type FrontDeskTab =
  | 'overview'
  | 'reservations'
  | 'walkin'
  | 'groups'
  | 'rooms'
  | 'checkin'
  | 'stay-mgmt'
  | 'checkout'
  | 'housekeeping'
  | 'maintenance'
  | 'requests'
  | 'comms'
  | 'search-crm'
  | 'registration'
  | 'scanner'
  | 'reports';

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  guestName: string;
  department: 'Maintenance' | 'Housekeeping' | 'F&B' | 'Front Desk';
  category: string;
  description: string;
  urgency: 'critical' | 'high' | 'normal';
  status: 'open' | 'dispatched' | 'in-progress' | 'resolved';
  loggedAt: string;
  assignedStaff?: string;
  resolutionNotes?: string;
}

// Initial In-House Residents
const initialResidents: InHouseResident[] = [
  {
    id: 'IH01',
    resId: 'RES-2024-001',
    guestId: 'G001',
    guestName: 'James Worthington',
    roomNumber: '101',
    roomType: 'Deluxe King',
    checkInDate: '2026-10-28',
    checkInTime: '14:20',
    expectedCheckOut: '2026-11-02',
    nights: 5,
    adults: 2,
    children: 0,
    tier: 'Platinum VIP',
    phone: '+44 7700 900123',
    email: 'j.worthington@apex-corp.co.uk',
    vipStatus: true,
    additionalOccupants: [
      { id: 'occ-1', name: 'Lady Eleanor Worthington', relationship: 'Spouse', idNumber: 'GBR-882910' }
    ],
    roomRate: 350,
    totalRoomCharges: 1750,
    incidentals: [
      { id: 'inc-1', date: '2026-10-29', category: 'F&B', description: 'VIP Champagne Dom Pérignon', amount: 280.00 },
      { id: 'inc-2', date: '2026-10-30', category: 'Laundry', description: 'Executive Dry Cleaning (3 Suits)', amount: 95.00 },
    ],
    payments: [
      { id: 'pay-1', date: '2026-10-28', method: 'Credit Card', amount: 875.00, ref: 'TXN-STRIPE-8821', status: 'successful' }
    ],
    depositPaid: 875.00,
    notes: ['VIP High Floor preference', 'Allergic to feather pillows'],
  },
  {
    id: 'IH02',
    resId: 'RES-2024-002',
    guestId: 'G002',
    guestName: 'Sophia Chen',
    roomNumber: '201',
    roomType: 'Executive Suite',
    checkInDate: '2026-10-28',
    checkInTime: '15:10',
    expectedCheckOut: '2026-11-04',
    nights: 7,
    adults: 1,
    children: 0,
    tier: 'Gold',
    phone: '+1 415 555 2671',
    email: 'sophia.chen@techventures.io',
    vipStatus: false,
    additionalOccupants: [],
    roomRate: 480,
    totalRoomCharges: 3360,
    incidentals: [
      { id: 'inc-3', date: '2026-10-29', category: 'F&B', description: 'In-Room Dining Dinner & Wine', amount: 145.00 },
      { id: 'inc-4', date: '2026-10-30', category: 'Spa', description: 'Aromatherapy Massage 60min', amount: 190.00 },
    ],
    payments: [
      { id: 'pay-2', date: '2026-10-28', method: 'Credit Card', amount: 1680.00, ref: 'TXN-STRIPE-9904', status: 'successful' }
    ],
    depositPaid: 1680.00,
    notes: ['Quiet room requested away from elevators'],
  },
  {
    id: 'IH03',
    resId: 'RES-2024-003',
    guestId: 'G003',
    guestName: 'Marcus Adeyemi',
    roomNumber: '302',
    roomType: 'Junior Suite',
    checkInDate: '2026-10-30',
    checkInTime: '16:45',
    expectedCheckOut: '2026-11-01',
    nights: 2,
    adults: 2,
    children: 1,
    tier: 'Silver',
    phone: '+234 802 345 6789',
    email: 'm.adeyemi@firstinvest.ng',
    vipStatus: false,
    additionalOccupants: [
      { id: 'occ-2', name: 'Zainab Adeyemi', relationship: 'Spouse', idNumber: 'NGA-99120' },
      { id: 'occ-3', name: 'Tariq Adeyemi', age: 7, relationship: 'Child' }
    ],
    roomRate: 280,
    totalRoomCharges: 560,
    incidentals: [
      { id: 'inc-5', date: '2026-10-31', category: 'Minibar', description: 'Fresh Juices & Snacks', amount: 35.00 }
    ],
    payments: [
      { id: 'pay-3', date: '2026-10-30', method: 'Credit Card', amount: 560.00, ref: 'TXN-STRIPE-4412', status: 'successful' }
    ],
    depositPaid: 560.00,
    notes: ['Baby cot provided in room'],
  },
  {
    id: 'IH04',
    resId: 'RES-2024-004',
    guestId: 'G004',
    guestName: 'The Morrison Family',
    roomNumber: '501',
    roomType: 'Family Suite',
    checkInDate: '2026-10-29',
    checkInTime: '13:50',
    expectedCheckOut: '2026-11-03',
    nights: 5,
    adults: 2,
    children: 2,
    tier: 'Silver',
    phone: '+1 312 555 8920',
    email: 'morrison.fam@gmail.com',
    vipStatus: false,
    additionalOccupants: [
      { id: 'occ-4', name: 'Sarah Morrison', relationship: 'Spouse' },
      { id: 'occ-5', name: 'Leo Morrison', age: 10, relationship: 'Child' },
      { id: 'occ-6', name: 'Maya Morrison', age: 6, relationship: 'Child' }
    ],
    roomRate: 420,
    totalRoomCharges: 2100,
    incidentals: [
      { id: 'inc-6', date: '2026-10-30', category: 'F&B', description: 'Family Buffet Dinner (4 pax)', amount: 220.00 },
      { id: 'inc-7', date: '2026-10-31', category: 'Transport', description: 'City Tour Shuttle Van', amount: 150.00 },
    ],
    payments: [
      { id: 'pay-4', date: '2026-10-29', method: 'Credit Card', amount: 2020.00, ref: 'TXN-STRIPE-3321', status: 'successful' }
    ],
    depositPaid: 2020.00,
    notes: ['Adjoining room preference for family'],
  }
];

export const FrontDeskPersonPage: React.FC = () => {
  const { addToast, propertyMode } = useApp();
  const config = propertyConfigs[propertyMode];

  // Dynamic theme gradient matching the admin navbar
  const gradientClass = propertyMode === 'hotel'
    ? 'luxury-gradient'
    : propertyMode === 'guesthouse'
    ? 'guesthouse-gradient'
    : 'restaurant-gradient';


  // Maintenance Tickets State (Module 10)
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([
    {
      id: 'MNT-401',
      roomNumber: '102',
      locationType: 'room',
      category: 'Air conditioning',
      description: 'Air conditioning cooling fan noisy and blowing ambient air; requested technician diagnosis.',
      priority: 'High',
      status: 'Assigned',
      reportedAt: '10:45 AM',
      reportedBy: 'Housekeeper Maria',
      assignedTechnician: { name: 'Carlos Mendez (HVAC)', phone: '+1 555-0188', etaMins: 20 },
      roomBlocked: true,
      isOverdue: false,
    },
    {
      id: 'MNT-402',
      roomNumber: '205',
      locationType: 'room',
      category: 'Plumbing',
      description: 'Slow bathroom sink drainage and weak hot water pressure.',
      priority: 'Medium',
      status: 'Reported',
      reportedAt: '11:10 AM',
      reportedBy: 'Front Desk Duty Agent',
      assignedTechnician: { name: 'David Kim (Plumber)', phone: '+1 555-0192', etaMins: 45 },
      roomBlocked: false,
      isOverdue: false,
    },
    {
      id: 'MNT-403',
      roomNumber: '302',
      locationType: 'room',
      category: 'Door locks',
      description: 'RFID door reader flashing orange; fails to read standard guest keycards.',
      priority: 'Critical',
      status: 'Technician On-Site',
      reportedAt: '09:30 AM',
      reportedBy: 'Front Desk Duty Agent',
      assignedTechnician: { name: 'Alex Rivera (Locksmith)', phone: '+1 555-0177', etaMins: 5 },
      roomBlocked: true,
      isOverdue: true,
    },
  ]);

  // Guest Service Requests State (Module 11)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestTicket[]>([
    {
      id: 'REQ-501',
      roomNumber: '101',
      guestName: 'James Worthington',
      guestPhone: '+44 7700 900123',
      department: 'Housekeeping',
      category: 'Extra towels',
      description: 'Deliver 2 extra Turkish cotton bath sheets to Room 101.',
      priority: 'High',
      status: 'In Progress',
      loggedAt: '11:20 AM',
      assignedStaff: 'Elena R. (Housekeeping)',
    },
    {
      id: 'REQ-502',
      roomNumber: '201',
      guestName: 'Sophia Chen',
      guestPhone: '+1 555-0199',
      department: 'F&B',
      category: 'Late In-Room Dining',
      description: 'Deliver artisan cheese platter and sparking San Pellegrino water.',
      priority: 'Medium',
      status: 'Assigned',
      loggedAt: '11:45 AM',
      assignedStaff: 'Chef Antoine (Kitchen)',
    },
    {
      id: 'REQ-503',
      roomNumber: '304',
      guestName: 'Marcus Vance',
      guestPhone: '+1 555-0144',
      department: 'Front Desk',
      category: 'Wake-up call',
      description: 'Automated morning telephone wake-up call requested for 06:30 AM.',
      priority: 'Normal' as any,
      status: 'Pending',
      loggedAt: '12:05 PM',
    },
    {
      id: 'REQ-504',
      roomNumber: '202',
      guestName: 'Liam O’Connor',
      guestPhone: '+353 87 123 4567',
      department: 'Housekeeping',
      category: 'Noise Complaint',
      description: 'Guest reports hallway vacuuming noise during business call.',
      priority: 'High',
      status: 'In Progress',
      loggedAt: '11:00 AM',
      isComplaint: true,
      complaintSeverity: 'High',
      assignedStaff: 'Duty Supervisor',
    },
  ]);

  // Group Bookings State (Module 14)
  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>([
    {
      id: 'GB-01',
      groupCode: 'GRP-TECH-2026',
      groupName: 'Global Cloud & AI Summit Delegation',
      groupLeader: {
        name: 'David Miller',
        phone: '+1 (555) 234-9988',
        email: 'd.miller@techsummit.io',
      },
      corporateAccount: {
        companyName: 'Acme Cloud Technologies',
        taxId: 'US-TAX-8829104',
        billingContact: 'David Miller (VP Operations)',
        creditLimit: 75000,
        directBillingApproved: true,
      },
      checkInDate: '2026-10-31',
      checkOutDate: '2026-11-04',
      nights: 4,
      totalRooms: 6,
      roomsAssigned: [
        { roomNumber: '201', roomType: 'Executive Suite', guestName: 'Sophia Chen (Lead Speaker)', adults: 1, isCheckInComplete: true, individualChargesTotal: 120.00 },
        { roomNumber: '202', roomType: 'Deluxe King', guestName: 'Liam O’Connor (Engineer)', adults: 1, isCheckInComplete: true, individualChargesTotal: 45.00 },
        { roomNumber: '203', roomType: 'Deluxe King', guestName: 'Elena Rostova (Keynote)', adults: 1, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '204', roomType: 'Deluxe King', guestName: 'Marcus Vance (Delegate)', adults: 1, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '205', roomType: 'Superior Twin', guestName: 'Hiroshi Tanaka (Researcher)', adults: 2, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '206', roomType: 'Superior Twin', guestName: 'Claire Dubois (Marketing)', adults: 1, isCheckInComplete: false, individualChargesTotal: 0 },
      ],
      billingArrangement: 'Master Covers Room & Tax / Guest Covers Incidentals',
      masterFolioBalance: 7920.00,
      masterPayments: [
        { id: 'PAY-GRP-01', date: '2026-10-25', method: 'Corporate Wire Transfer', amount: 3000.00, ref: 'ACH-WIRE-88910' }
      ],
      status: 'In-House',
    },
    {
      id: 'GB-02',
      groupCode: 'GRP-WED-771',
      groupName: 'Johnson & Smith Wedding Party',
      groupLeader: {
        name: 'Emily Johnson',
        phone: '+1 (555) 782-1144',
        email: 'emily.j@weddingparty.org',
      },
      checkInDate: '2026-11-02',
      checkOutDate: '2026-11-05',
      nights: 3,
      totalRooms: 4,
      roomsAssigned: [
        { roomNumber: '301', roomType: 'Presidential Suite', guestName: 'Bride & Groom Suite', adults: 2, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '302', roomType: 'Deluxe King', guestName: 'Robert Johnson (Father of Bride)', adults: 2, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '303', roomType: 'Superior Twin', guestName: 'Sarah Smith (Bridesmaid)', adults: 2, isCheckInComplete: false, individualChargesTotal: 0 },
        { roomNumber: '304', roomType: 'Deluxe King', guestName: 'Michael Brown (Best Man)', adults: 1, isCheckInComplete: false, individualChargesTotal: 0 },
      ],
      billingArrangement: 'Master Folio Covers All',
      masterFolioBalance: 5280.00,
      masterPayments: [],
      status: 'Confirmed',
    },
  ]);

  // Room Transfer Modal state (Module 12)
  const [transferResident, setTransferResident] = useState<InHouseResident | null>(null);

  // Walk-In Check-In Handler (Module 13)
  const handleCompleteWalkInCheckIn = (payload: {
    guest: Guest;
    room: FDRoom;
    nights: number;
    adults: number;
    children: number;
    additionalOccupants: AdditionalOccupant[];
    depositPaid: number;
    paymentMethod: string;
    specialRequests: string;
  }) => {
    const resId = `RES-WLK-${Date.now().toString().slice(-4)}`;
    const newRes: FDReservation = {
      id: resId,
      guestId: payload.guest.id,
      guestName: `${payload.guest.firstName} ${payload.guest.lastName}`,
      roomId: payload.room.id,
      roomNumber: payload.room.number,
      roomType: payload.room.type,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + payload.nights * 86400000).toISOString().split('T')[0],
      nights: payload.nights,
      adults: payload.adults,
      children: payload.children,
      ratePerNight: payload.room.ratePerNight,
      totalAmount: (payload.room.ratePerNight * payload.nights) * 1.10,
      status: 'checked-in',
      bookingSource: 'Walk-in' as any,
      bookingRef: resId,
      specialRequests: payload.specialRequests,
      paymentStatus: payload.depositPaid >= (payload.room.ratePerNight * payload.nights * 1.10) ? 'paid' : 'partial',
      createdAt: new Date().toISOString(),
      actualArrival: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      additionalOccupants: payload.additionalOccupants,
    };

    const newResident: InHouseResident = {
      id: `IH-WLK-${Date.now().toString().slice(-4)}`,
      resId: newRes.id,
      guestId: payload.guest.id,
      guestName: newRes.guestName,
      roomNumber: payload.room.number,
      roomType: payload.room.type,
      checkInDate: newRes.checkIn,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedCheckOut: newRes.checkOut,
      nights: payload.nights,
      adults: payload.adults,
      children: payload.children,
      tier: payload.guest.tier || 'Standard',
      phone: payload.guest.phone,
      email: payload.guest.email,
      additionalOccupants: payload.additionalOccupants,
      roomRate: payload.room.ratePerNight,
      totalRoomCharges: payload.room.ratePerNight * payload.nights,
      incidentals: [],
      payments: [
        {
          id: `pay-${Date.now()}`,
          date: newRes.checkIn,
          method: payload.paymentMethod,
          amount: payload.depositPaid,
          ref: `TXN-WLK-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'successful',
        }
      ],
      depositPaid: payload.depositPaid,
      notes: ['Walk-in registration at Front Desk Counter #1'],
    };

    setReservationList(prev => [newRes, ...prev]);
    setInHouseList(prev => [newResident, ...prev]);
    setRoomList(prev => prev.map(r => r.number === payload.room.number ? { ...r, roomStatus: 'occupied' } : r));

    if (!guestList.find(g => g.id === payload.guest.id)) {
      setGuestList(prev => [payload.guest, ...prev]);
    }

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        type: 'checkin',
        message: `Walk-in Check-in: ${newRes.guestName} into Room #${payload.room.number} (${payload.nights} nights)`,
        time: 'Just now',
        user: currentAgent.name,
      },
      ...prev,
    ]);
  };

  // Room Transfer Executor with History (Module 12)
  const handleExecuteRoomTransfer = (
    residentId: string,
    newRoomNumber: string,
    reason: string,
    rateDifference: number,
    supervisorAuthorized: boolean
  ) => {
    const resident = inHouseList.find(r => r.id === residentId);
    if (!resident) return;
    const oldRoom = resident.roomNumber;
    const newRoom = roomList.find(r => r.number === newRoomNumber);
    if (!newRoom) return;

    const assignmentRecord: RoomAssignmentRecord = {
      roomNumber: oldRoom,
      roomType: resident.roomType,
      from: resident.checkInDate,
      to: new Date().toISOString().split('T')[0],
      reason,
      authorizedBy: supervisorAuthorized ? 'Supervisor (PIN 8899)' : 'Standard Transfer',
      ratePerNight: resident.roomRate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInHouseList(prev => prev.map(r => {
      if (r.id === residentId) {
        return {
          ...r,
          roomNumber: newRoomNumber,
          roomType: newRoom.type,
          roomRate: newRoom.ratePerNight,
          totalRoomCharges: r.totalRoomCharges + rateDifference,
          roomAssignmentHistory: [...(r.roomAssignmentHistory || []), assignmentRecord],
        };
      }
      return r;
    }));

    setRoomList(prev => prev.map(r => {
      if (r.number === oldRoom) {
        return {
          ...r,
          roomStatus: 'vacant',
          housekeepingStatus: 'dirty',
          cleaningProgress: 0,
          maintenanceNote: `Turnover needed after room transfer to #${newRoomNumber}`,
        };
      }
      if (r.number === newRoomNumber) {
        return {
          ...r,
          roomStatus: 'occupied',
        };
      }
      return r;
    }));

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        type: 'maintenance',
        message: `Room Transfer: ${resident.guestName} moved from #${oldRoom} to #${newRoomNumber} (${reason})`,
        time: 'Just now',
        user: currentAgent.name,
      },
      ...prev,
    ]);
  };

  // On-duty Front Desk agent
  const currentAgent = staffMembers.find(s => s.role === 'Front Desk') || staffMembers[1];

  // Sidebar collapse state
  const [deskSidebarCollapsed, setDeskSidebarCollapsed] = useState(false);

  // Active Primary Tab / Module with Full Navigation History Stack
  const [activeTab, setActiveTabState] = useState<FrontDeskTab>('overview');
  const [tabHistory, setTabHistory] = useState<FrontDeskTab[]>([]);
  const [tabForwardHistory, setTabForwardHistory] = useState<FrontDeskTab[]>([]);

  const setActiveTab = (newTab: FrontDeskTab) => {
    if (newTab === activeTab) return;
    setTabHistory(prev => [...prev, activeTab]);
    setTabForwardHistory([]);
    setActiveTabState(newTab);
  };

  const handleBackTab = () => {
    if (tabHistory.length === 0) return;
    const prevTab = tabHistory[tabHistory.length - 1];
    setTabHistory(prev => prev.slice(0, -1));
    setTabForwardHistory(prev => [activeTab, ...prev]);
    setActiveTabState(prevTab);
  };

  const handleForwardTab = () => {
    if (tabForwardHistory.length === 0) return;
    const nextTab = tabForwardHistory[0];
    setTabForwardHistory(prev => prev.slice(1));
    setTabHistory(prev => [...prev, activeTab]);
    setActiveTabState(nextTab);
  };

  const getTabLabel = (tab: FrontDeskTab): string => {
    switch (tab) {
      case 'overview': return 'Command Center';
      case 'reservations': return 'Reservations';
      case 'walkin': return 'Walk-In Desk';
      case 'groups': return 'Groups & Corporate';
      case 'rooms': return 'Room Inventory';
      case 'checkin': return 'Arrivals & Check-In';
      case 'stay-mgmt': return 'Stay Management';
      case 'checkout': return 'Check-Out & Folios';
      case 'housekeeping': return 'Housekeeping Desk';
      case 'maintenance': return 'Maintenance Coord';
      case 'requests': return 'Requests & Tickets';
      case 'comms': return 'Guest Comms & SMS';
      case 'search-crm': return 'Guest CRM';
      case 'registration': return 'New Registration';
      case 'scanner': return 'ID Scanner & OCR';
      case 'reports': return 'Reports & Analytics';
      default: return tab;
    }
  };

  // Sub-Navigation Tabs per Module
  const [resSubTab, setResSubTab] = useState<'all' | 'upcoming' | 'arrivals-today' | 'groups' | 'history'>('all');
  const [roomsSubTab, setRoomsSubTab] = useState<'grid' | 'assignments' | 'blocked'>('grid');
  const [checkInSubTab, setCheckInSubTab] = useState<'expected' | 'pending' | 'completed'>('pending');
  const [staySubTab, setStaySubTab] = useState<'in-house' | 'extensions' | 'folios'>('in-house');
  const [checkOutSubTab, setCheckOutSubTab] = useState<'departures' | 'pending' | 'settled'>('departures');

  // ============================================================
  // CORE DATA STATES
  // ============================================================
  // Initialize Rooms with separate roomStatus and housekeepingStatus
  const [roomList, setRoomList] = useState<FDRoom[]>(() => {
    return initialRooms.map((r, idx) => {
      let rStatus: FDRoom['roomStatus'] = 'vacant';
      let hkStatus: FDRoom['housekeepingStatus'] = 'clean';
      let blockReason: string | undefined = undefined;
      let maintenanceNote: string | undefined = undefined;

      if (r.status === 'occupied') {
        rStatus = 'occupied';
        hkStatus = 'clean';
      } else if (r.status === 'maintenance') {
        rStatus = 'out_of_order';
        hkStatus = 'inspecting';
        maintenanceNote = 'HVAC sensor replacement scheduled';
      } else if (r.status === 'dirty') {
        rStatus = 'vacant';
        hkStatus = 'dirty';
      } else if (idx === 4) {
        // Room 105 blocked for VIP delegation
        rStatus = 'blocked';
        hkStatus = 'clean';
        blockReason = 'VIP Diplomatic Hold until Nov 02';
      } else if (idx % 3 === 0) {
        rStatus = 'vacant';
        hkStatus = 'inspected';
      }

      return {
        ...r,
        roomStatus: rStatus,
        housekeepingStatus: hkStatus,
        blockReason,
        maintenanceNote,
      };
    });
  });

  // Reservations State with group, occupants & status support
  const [reservationList, setReservationList] = useState<FDReservation[]>(() => {
    return initialReservations.map((r, idx) => ({
      ...r,
      additionalOccupants: idx === 0 ? [{ id: 'occ-01', name: 'Eleanor Bennett', relationship: 'Spouse' }] : [],
      isGroup: idx === 3,
      groupCode: idx === 3 ? 'GRP-2026-VIP' : undefined,
      isEarlyArrival: idx === 1,
      isLateArrival: idx === 2,
    }));
  });

  // In-House Residents State
  const [inHouseList, setInHouseList] = useState<InHouseResident[]>(initialResidents);

  // Today Arrivals and Departures
  const [arrivalList, setArrivalList] = useState(initialArrivals);
  const [departureList, setDepartureList] = useState(initialDepartures);
  const [guestList, setGuestList] = useState<Guest[]>(initialGuests);
  const [activities, setActivities] = useState<Activity[]>(initialActivityFeed);

  // Complaints / Service Requests
  const [complaints, setComplaints] = useState<ServiceRequest[]>([
    {
      id: 'REQ-301',
      roomNumber: '304',
      guestName: 'Isabella Romano',
      department: 'Maintenance',
      category: 'Air Conditioning',
      description: 'Air conditioner blowing ambient air; room temperature at 25°C. Guest requested technician ASAP.',
      urgency: 'critical',
      status: 'in-progress',
      loggedAt: '08:45 AM',
      assignedStaff: 'Marcus Vance (Engineering)',
    },
    {
      id: 'REQ-302',
      roomNumber: '201',
      guestName: 'Sophia Chen',
      department: 'Housekeeping',
      category: 'Linens & Bedding',
      description: 'Extra hypoallergenic foam pillows and 2 additional bath sheets requested.',
      urgency: 'normal',
      status: 'dispatched',
      loggedAt: '09:20 AM',
      assignedStaff: 'Maria Garcia (Housekeeping)',
    },
    {
      id: 'REQ-303',
      roomNumber: '101',
      guestName: 'James Worthington',
      department: 'F&B',
      category: 'Room Service',
      description: 'VIP Champagne bucket with chilled Dom Pérignon requested for check-in.',
      urgency: 'high',
      status: 'resolved',
      loggedAt: '07:30 AM',
      assignedStaff: 'Chef Antoine Dupont',
      resolutionNotes: 'Delivered and chilled on ice with crystal flutes.',
    },
  ]);

  // Filters for sub-views
  const [roomFloorFilter, setRoomFloorFilter] = useState<number | 'all'>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState<'all' | 'vacant' | 'occupied' | 'blocked' | 'out_of_order'>('all');
  const [housekeepingFilter, setHousekeepingFilter] = useState<'all' | 'ready' | 'clean' | 'inspected' | 'dirty' | 'inspecting'>('all');
  const [roomSearchQuery, setRoomSearchQuery] = useState('');

  const [resSearchQuery, setResSearchQuery] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show'>('all');

  const [checkInSearch, setCheckInSearch] = useState('');
  const [checkOutSearch, setCheckOutSearch] = useState('');
  const [checkOutFilter, setCheckOutFilter] = useState<'all' | 'pending' | 'checked-out' | 'unpaid'>('all');

  const [complaintUrgencyFilter, setComplaintUrgencyFilter] = useState<'all' | 'critical' | 'high' | 'normal'>('all');
  const [complaintDeptFilter, setComplaintDeptFilter] = useState<'all' | 'Maintenance' | 'Housekeeping' | 'F&B' | 'Front Desk'>('all');

  // Search in CRM
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [crmSearchField, setCrmSearchField] = useState<'all' | 'name' | 'id' | 'phone' | 'email' | 'passport' | 'nationalId' | 'loyalty'>('all');

  // ============================================================
  // DERIVED STATS & 16 CORE KPI METRICS
  // ============================================================
  const totalRooms = roomList.length; // 14
  // A room is strictly available/ready if vacant AND (clean or inspected)
  const availableRoomsReady = roomList.filter(r => r.roomStatus === 'vacant' && (r.housekeepingStatus === 'clean' || r.housekeepingStatus === 'inspected')).length;
  const occupiedRooms = roomList.filter(r => r.roomStatus === 'occupied').length; // 6
  const reservedRooms = reservationList.filter(r => r.status === 'confirmed').length; // 4
  const dirtyRooms = roomList.filter(r => r.housekeepingStatus === 'dirty').length; // rooms requiring cleaning
  const maintenanceRooms = roomList.filter(r => r.roomStatus === 'out_of_order' || r.roomStatus === 'blocked').length;
  const expectedArrivals = arrivalList.length; // 3
  const expectedDepartures = departureList.length; // 2
  const currentlyStaying = inHouseList.length; // 4
  const pendingCheckIns = arrivalList.filter(a => a.status === 'pending').length; // 2
  const pendingCheckOuts = departureList.filter(d => d.status === 'pending').length; // 1

  // Total balance due across in-house guests and departing folios
  const totalBalanceDue = inHouseList.reduce((acc, curr) => {
    const totalCharges = curr.totalRoomCharges + curr.incidentals.reduce((iAcc, i) => iAcc + i.amount, 0);
    const totalPayments = curr.payments.filter(p => p.status === 'successful').reduce((pAcc, p) => pAcc + p.amount, 0);
    const bal = Math.max(0, totalCharges - totalPayments);
    return acc + bal;
  }, 0);

  const urgentRequests = complaints.filter(c => c.urgency === 'critical' && c.status !== 'resolved');
  const activeUnresolvedRequests = complaints.filter(c => c.status !== 'resolved');
  const housekeepingMaintenanceAlerts = complaints.filter(c => (c.department === 'Housekeeping' || c.department === 'Maintenance') && c.status !== 'resolved').length;

  // Available clean rooms ready for immediate assignment
  const availableCleanRooms = roomList.filter(r => r.roomStatus === 'vacant' && (r.housekeepingStatus === 'clean' || r.housekeepingStatus === 'inspected'));

  // ============================================================
  // MODALS STATE
  // ============================================================
  // 1. Reservation Modals
  const [isNewResOpen, setIsNewResOpen] = useState(false);
  const [resGuestName, setResGuestName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resRoomType, setResRoomType] = useState('Deluxe Suite');
  const [resRoomNumber, setResRoomNumber] = useState('');
  const [resCheckIn, setResCheckIn] = useState('2026-10-31');
  const [resCheckOut, setResCheckOut] = useState('2026-11-03');
  const [resAdults, setResAdults] = useState(2);
  const [resChildren, setResChildren] = useState(0);
  const [resSpecialRequests, setResSpecialRequests] = useState('High floor, quiet room, extra feather pillows');
  const [resDepositStatus, setResDepositStatus] = useState<'paid' | 'deposit' | 'pending'>('deposit');
  const [resSource, setResSource] = useState<'Direct' | 'Phone' | 'Walk-in' | 'Booking.com' | 'Expedia' | 'OTA'>('Direct');
  const [resGroupCode, setResGroupCode] = useState('');
  const [resAdditionalOccupants, setResAdditionalOccupants] = useState<{ name: string; relationship: string; idNumber?: string }[]>([]);
  const [newOccupantName, setNewOccupantName] = useState('');
  const [newOccupantRel, setNewOccupantRel] = useState('Family');

  const [selectedResForDetail, setSelectedResForDetail] = useState<FDReservation | null>(null);
  const [selectedResForModify, setSelectedResForModify] = useState<FDReservation | null>(null);
  const [selectedResForCancel, setSelectedResForCancel] = useState<FDReservation | null>(null);
  const [cancelPolicy, setCancelPolicy] = useState('standard_48h');
  const [cancelReason, setCancelReason] = useState('Guest requested cancellation due to travel plan change');

  // Availability Inspector State
  const [availCheckIn, setAvailCheckIn] = useState('2026-10-31');
  const [availCheckOut, setAvailCheckOut] = useState('2026-11-03');
  const [availRoomType, setAvailRoomType] = useState('Deluxe Suite');

  // 2. Room Management Modals
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<FDRoom | null>(null);
  const [isBlockRoomOpen, setIsBlockRoomOpen] = useState(false);
  const [roomToBlock, setRoomToBlock] = useState<FDRoom | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('Maintenance inspection');
  const [blockReleaseInput, setBlockReleaseInput] = useState('2026-11-02');

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [residentToUpgrade, setResidentToUpgrade] = useState<InHouseResident | null>(null);
  const [upgradeTargetRoom, setUpgradeTargetRoom] = useState('');
  const [upgradeAuthCode, setUpgradeAuthCode] = useState('');
  const [upgradeFee, setUpgradeFee] = useState(0);

  // 3. Check-In Modal
  const [checkInModal, setCheckInModal] = useState<any | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [keycardsCount, setKeycardsCount] = useState(2);
  const [checkInEarlyOverride, setCheckInEarlyOverride] = useState(false);
  const [checkInOccupants, setCheckInOccupants] = useState<{ name: string; relationship: string; idNumber?: string }[]>([]);
  const [checkInNewOccName, setCheckInNewOccName] = useState('');

  // 4. Stay Management Modals
  const [extendStayModal, setExtendStayModal] = useState<InHouseResident | null>(null);
  const [newExtendCheckOut, setNewExtendCheckOut] = useState('');

  const [earlyDepartureModal, setEarlyDepartureModal] = useState<InHouseResident | null>(null);
  const [earlyDepartureDate, setEarlyDepartureDate] = useState('2026-10-31');

  const [roomMoveResident, setRoomMoveResident] = useState<InHouseResident | null>(null);
  const [roomMoveTarget, setRoomMoveTarget] = useState('');
  const [roomMoveReason, setRoomMoveReason] = useState('Guest requested quieter room');

  const [lateCheckOutResident, setLateCheckOutResident] = useState<InHouseResident | null>(null);
  const [lateCheckOutTime, setLateCheckOutTime] = useState('14:00');
  const [lateCheckOutFee, setLateCheckOutFee] = useState(0);

  const [addServiceResident, setAddServiceResident] = useState<InHouseResident | null>(null);
  const [serviceCategory, setServiceCategory] = useState<'F&B' | 'Minibar' | 'Spa' | 'Laundry' | 'Transport'>('F&B');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceAmount, setServiceAmount] = useState<number | ''>('');

  // 5. Check-Out & Folio Settlement Modal
  const [checkOutModalResident, setCheckOutModalResident] = useState<InHouseResident | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number | ''>('');
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<'Credit Card' | 'Cash' | 'Bank Transfer' | 'Apple Pay'>('Credit Card');
  const [paymentRefInput, setPaymentRefInput] = useState('');
  const [isKeyReturned, setIsKeyReturned] = useState(false);
  const [invoiceSuccessModal, setInvoiceSuccessModal] = useState<{ resident: InHouseResident; finalBill: number; txRef: string } | null>(null);

  // 6. Fast Walk-In Modal
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('+1 555-0199');
  const [walkInRoom, setWalkInRoom] = useState('');
  const [walkInNights, setWalkInNights] = useState(1);
  const [walkInPaymentMethod, setWalkInPaymentMethod] = useState<'Credit Card' | 'Cash'>('Credit Card');

  // 7. Complaint / Request Modal
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [compRoom, setCompRoom] = useState('101');
  const [compDept, setCompDept] = useState<'Maintenance' | 'Housekeeping' | 'F&B' | 'Front Desk'>('Maintenance');
  const [compCategory, setCompCategory] = useState('HVAC / Temperature');
  const [compDesc, setCompDesc] = useState('');
  const [compUrgency, setCompUrgency] = useState<'critical' | 'high' | 'normal'>('high');

  // 8. CRM & Profile Drawer
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [editGuestPhone, setEditGuestPhone] = useState('');
  const [editGuestEmail, setEditGuestEmail] = useState('');
  const [editGuestAddress, setEditGuestAddress] = useState('');
  const [editGuestPreferences, setEditGuestPreferences] = useState('');
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [guestToMerge, setGuestToMerge] = useState<Guest | null>(null);

  // 9. ID Scanner & OCR Engine State
  const [selectedDocType, setSelectedDocType] = useState<'Passport' | 'National ID' | 'Driver License'>('Passport');
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(98.8);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedDocImage, setUploadedDocImage] = useState<string | null>(null);
  const [ocrPushedData, setOcrPushedData] = useState<Partial<Guest> | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface OcrDocData {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    address: string;
    idType: 'Passport' | 'National ID' | 'Driver License';
    idNumber: string;
    idExpiryDate: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    mrz1?: string;
    mrz2?: string;
  }

  const docPresets: Record<'Passport' | 'National ID' | 'Driver License', OcrDocData> = {
    Passport: {
      firstName: 'Alexander',
      middleName: 'Thomas',
      lastName: 'Wright',
      email: 'a.wright@summit-cap.com',
      phone: '+1 (555) 782-9912',
      dateOfBirth: '1984-06-18',
      nationality: 'American',
      gender: 'Male',
      address: '450 Lexington Ave, New York, NY 10017',
      idType: 'Passport',
      idNumber: 'USA-992817441',
      idExpiryDate: '2031-10-15',
      emergencyContactName: 'Clara Wright (Wife)',
      emergencyContactPhone: '+1 (555) 782-0044',
      mrz1: 'P<USAWRIGHT<<ALEXANDER<THOMAS<<<<<<<<<<<<<<<<<<',
      mrz2: 'USA992817441USA8406184M3110150<<<<<<<<<<<<<<04',
    },
    'National ID': {
      firstName: 'Marie',
      middleName: 'Claire',
      lastName: 'Laurent',
      email: 'm.laurent@paris-studio.fr',
      phone: '+33 6 12 34 56 78',
      dateOfBirth: '1991-03-24',
      nationality: 'French',
      gender: 'Female',
      address: '18 Rue de la Paix, 75002 Paris, France',
      idType: 'National ID',
      idNumber: 'FRA-849201948',
      idExpiryDate: '2033-04-12',
      emergencyContactName: 'Pierre Laurent (Brother)',
      emergencyContactPhone: '+33 6 98 76 54 32',
      mrz1: 'IDFRAMARIE<<LAURENT<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      mrz2: 'FRA8492019484FRA9103248F3304128<<<<<<<<<<<<<<02',
    },
    'Driver License': {
      firstName: 'David',
      middleName: 'James',
      lastName: 'Vance',
      email: 'david.vance@techcorp.io',
      phone: '+1 (415) 890-2341',
      dateOfBirth: '1988-11-09',
      nationality: 'American',
      gender: 'Male',
      address: '742 Evergreen Terrace, San Francisco, CA 94107',
      idType: 'Driver License',
      idNumber: 'DL-CA-98214470',
      idExpiryDate: '2028-11-09',
      emergencyContactName: 'Sarah Vance (Sister)',
      emergencyContactPhone: '+1 (415) 890-0019',
      mrz1: 'DLUSA CA-98214470-CLASS-C<<<<<<<<<<<<<<<<<<<<<',
      mrz2: 'VANCE<<DAVID<JAMES<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
    },
  };

  const [extractedData, setExtractedData] = useState<OcrDocData>(docPresets.Passport);

  const [ocrAuditLog, setOcrAuditLog] = useState<Array<{
    id: string;
    timestamp: string;
    docType: string;
    docNumber: string;
    guestName: string;
    confidence: number;
    status: 'Verified & Accepted' | 'Flagged For Review' | 'Expired';
    securityHash: string;
  }>>([
    {
      id: 'AUDIT-891',
      timestamp: '15:42:10',
      docType: 'Passport',
      docNumber: 'GBR-7829104',
      guestName: 'Eleanor Vance',
      confidence: 99.4,
      status: 'Verified & Accepted',
      securityHash: 'SHA256: 4f98...c210',
    },
    {
      id: 'AUDIT-890',
      timestamp: '14:15:33',
      docType: 'National ID',
      docNumber: 'FRA-9018442',
      guestName: 'Jean-Luc Dubois',
      confidence: 98.2,
      status: 'Verified & Accepted',
      securityHash: 'SHA256: 91ba...e771',
    }
  ]);

  // Part A: New Registration Form Fields
  const [regGuestId, setRegGuestId] = useState(`G00${initialGuests.length + 1}`);
  const [regFirstName, setRegFirstName] = useState('');
  const [regMiddleName, setRegMiddleName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1990-01-01');
  const [regNationality, setRegNationality] = useState('United States');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [regAddress, setRegAddress] = useState('');
  const [regIdType, setRegIdType] = useState<'Passport' | 'National ID' | 'Driver License'>('Passport');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regIdExpiry, setRegIdExpiry] = useState('2030-01-01');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');

  // ============================================================
  // ACTION HANDLERS
  // ============================================================

  // 1. Create New Reservation
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resGuestName.trim()) {
      addToast({ type: 'warning', title: 'Guest Name Required', message: 'Please enter guest name.' });
      return;
    }

    const checkInDate = new Date(resCheckIn);
    const checkOutDate = new Date(resCheckOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nightlyRate = resRoomType.includes('Villa') ? 600 : resRoomType.includes('Suite') ? 350 : 250;
    const totalAmount = nightlyRate * nights;
    const newResId = `RES-${new Date().getFullYear()}-${String(reservationList.length + 1).padStart(3, '0')}`;

    const assignedRoom = availableCleanRooms.find(r => r.number === resRoomNumber) || availableCleanRooms[0];

    const newRes: FDReservation = {
      id: newResId,
      guestId: `G00${guestList.length + 1}`,
      guestName: resGuestName,
      roomId: assignedRoom?.id || 'r4',
      roomNumber: assignedRoom?.number || '204',
      roomType: resRoomType,
      checkIn: resCheckIn,
      checkOut: resCheckOut,
      nights,
      adults: resAdults,
      children: resChildren,
      ratePerNight: nightlyRate,
      totalAmount,
      status: 'confirmed',
      bookingSource: resSource as any,
      bookingRef: newResId,
      specialRequests: resSpecialRequests || 'None',
      paymentStatus: resDepositStatus === 'paid' ? 'paid' : resDepositStatus === 'deposit' ? 'partial' : 'pending',
      createdAt: new Date().toISOString(),
      isGroup: Boolean(resGroupCode),
      groupCode: resGroupCode || undefined,
      additionalOccupants: resAdditionalOccupants.map((occ, idx) => ({ id: `OCC-${Date.now()}-${idx + 1}`, ...occ })),
    };

    setReservationList(prev => [newRes, ...prev]);

    if (assignedRoom) {
      setRoomList(prev => prev.map(r => r.number === assignedRoom.number ? { ...r, upcomingReservation: newResId } : r));
    }

    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'booking',
      message: `Reservation confirmed for ${resGuestName} (${nights} nights, ${resRoomType}, Ref: ${newResId})`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    setIsNewResOpen(false);
    setSelectedResForDetail(newRes);

    addToast({
      type: 'success',
      title: 'Reservation Created',
      message: `Booking ${newResId} confirmed for ${resGuestName}.`,
    });
  };

  // 2. Modify Reservation
  const handleModifyReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResForModify) return;

    setReservationList(prev => prev.map(r => {
      if (r.id === selectedResForModify.id) {
        return selectedResForModify;
      }
      return r;
    }));

    addToast({
      type: 'info',
      title: 'Reservation Updated',
      message: `Booking ${selectedResForModify.bookingRef} modified successfully.`,
    });
    setSelectedResForModify(null);
  };

  // 3. Cancel Reservation
  const handleCancelReservation = () => {
    if (!selectedResForCancel) return;

    setReservationList(prev => prev.map(r => {
      if (r.id === selectedResForCancel.id) {
        return { ...r, status: 'cancelled' as const };
      }
      return r;
    }));

    // Release room if assigned
    if (selectedResForCancel.roomNumber) {
      setRoomList(prev => prev.map(r => r.number === selectedResForCancel.roomNumber ? { ...r, upcomingReservation: undefined } : r));
    }

    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'booking',
      message: `Reservation ${selectedResForCancel.bookingRef} cancelled: ${cancelReason}`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    addToast({
      type: 'warning',
      title: 'Reservation Cancelled',
      message: `Reservation ${selectedResForCancel.bookingRef} cancelled according to ${cancelPolicy.replace('_', ' ')} policy. Room released.`,
    });
    setSelectedResForCancel(null);
  };

  // 4. No-Show Handler
  const handleNoShow = (res: FDReservation) => {
    setReservationList(prev => prev.map(r => r.id === res.id ? { ...r, status: 'no-show' as const } : r));
    if (res.roomNumber) {
      setRoomList(prev => prev.map(r => r.number === res.roomNumber ? { ...r, upcomingReservation: undefined } : r));
    }
    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'booking',
      message: `Reservation ${res.bookingRef} marked NO-SHOW. 1-night guarantee charged, room released.`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);
    addToast({
      type: 'warning',
      title: 'Marked as No-Show',
      message: `Guest ${res.guestName} marked as No-Show. Guaranteed 1-night penalty fee recorded.`,
    });
  };

  // 5. Early / Late Arrival Handlers
  const handleEarlyArrival = (res: FDReservation) => {
    const assigned = roomList.find(r => r.number === res.roomNumber);
    const isReady = assigned && assigned.roomStatus === 'vacant' && (assigned.housekeepingStatus === 'clean' || assigned.housekeepingStatus === 'inspected');
    if (isReady) {
      setCheckInModal({
        id: res.id,
        guestName: res.guestName,
        roomType: res.roomType,
        checkIn: res.checkIn,
        checkOut: res.checkOut,
        adults: res.adults,
        nights: res.nights,
        bookingRef: res.bookingRef,
        status: 'pending',
        phone: '+1 555-0199',
      });
      setSelectedRoomNumber(res.roomNumber);
      addToast({ type: 'info', title: 'Early Arrival Handled', message: `Room #${res.roomNumber} is ready. Proceeding with early check-in.` });
    } else {
      addToast({
        type: 'warning',
        title: 'Room Not Yet Ready',
        message: `Room #${res.roomNumber || 'TBD'} is currently being prepared. Guest luggage tagged for storage & Housekeeping notified.`,
      });
    }
  };

  const handleLateArrival = (res: FDReservation) => {
    setReservationList(prev => prev.map(r => r.id === res.id ? { ...r, isLateArrival: true } : r));
    addToast({
      type: 'info',
      title: 'Late Arrival Guaranteed',
      message: `Late arrival guaranteed for ${res.guestName}. Room will be held past standard 18:00 release cutoff.`,
    });
  };

  // 6. Block Room Handler
  const handleBlockRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomToBlock) return;
    setRoomList(prev => prev.map(r => r.id === roomToBlock.id ? {
      ...r,
      roomStatus: 'blocked',
      blockReason: blockReasonInput,
      blockReleaseDate: blockReleaseInput,
    } : r));
    addToast({
      type: 'warning',
      title: 'Room Blocked',
      message: `Room #${roomToBlock.number} blocked: ${blockReasonInput} until ${blockReleaseInput}.`,
    });
    setIsBlockRoomOpen(false);
    setRoomToBlock(null);
  };

  const handleUnblockRoom = (room: FDRoom) => {
    setRoomList(prev => prev.map(r => r.id === room.id ? {
      ...r,
      roomStatus: 'vacant',
      blockReason: undefined,
      blockReleaseDate: undefined,
    } : r));
    addToast({
      type: 'success',
      title: 'Room Unblocked',
      message: `Room #${room.number} is now released and vacant.`,
    });
  };

  // 7. Room Upgrade Handler
  const handleUpgradeRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentToUpgrade || !upgradeTargetRoom) return;
    const destRoom = roomList.find(r => r.number === upgradeTargetRoom);
    if (!destRoom) return;

    // Update in-house resident
    setInHouseList(prev => prev.map(res => {
      if (res.id === residentToUpgrade.id) {
        return {
          ...res,
          roomNumber: destRoom.number,
          roomType: destRoom.type,
          roomRate: destRoom.ratePerNight,
          totalRoomCharges: res.totalRoomCharges + (upgradeFee * res.nights),
          notes: [...res.notes, `Upgraded to Room #${destRoom.number} (${destRoom.type}) Auth: ${upgradeAuthCode || 'MGR-OK'}`],
        };
      }
      return res;
    }));

    // Update old room to dirty, new room to occupied
    setRoomList(prev => prev.map(r => {
      if (r.number === residentToUpgrade.roomNumber) {
        return { ...r, roomStatus: 'vacant', housekeepingStatus: 'dirty', currentGuest: undefined };
      }
      if (r.number === destRoom.number) {
        return { ...r, roomStatus: 'occupied', currentGuest: residentToUpgrade.guestName };
      }
      return r;
    }));

    addToast({
      type: 'success',
      title: 'Room Upgrade Executed',
      message: `${residentToUpgrade.guestName} upgraded from #${residentToUpgrade.roomNumber} to #${destRoom.number} (${destRoom.type}).`,
    });
    setIsUpgradeModalOpen(false);
    setResidentToUpgrade(null);
  };

  // 8. Guest Check-In Handler
  const handleCheckIn = () => {
    if (!checkInModal || !selectedRoomNumber) {
      addToast({ type: 'warning', title: 'Room Selection Required', message: 'Please select an available clean/inspected room.' });
      return;
    }

    const assignedRoom = roomList.find(r => r.number === selectedRoomNumber);

    // CRITICAL BUSINESS RULE ENFORCEMENT
    const isReady = assignedRoom && assignedRoom.roomStatus === 'vacant' && (assignedRoom.housekeepingStatus === 'clean' || assignedRoom.housekeepingStatus === 'inspected');
    if (!isReady && !checkInEarlyOverride) {
      addToast({
        type: 'error',
        title: 'Room Not Ready',
        message: `Room #${selectedRoomNumber} is ${assignedRoom?.housekeepingStatus.toUpperCase()} and cannot be assigned without supervisor authorization override.`,
      });
      return;
    }

    // 1. Update arrival list
    setArrivalList(prev => prev.map(a => a.id === checkInModal.id ? { ...a, status: 'completed' as const } : a));

    // 2. Update reservation status
    setReservationList(prev => prev.map(r => (r.bookingRef === checkInModal.bookingRef || r.guestName === checkInModal.guestName) ? {
      ...r,
      status: 'checked-in' as const,
      roomNumber: selectedRoomNumber,
      actualArrival: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    } : r));

    // 3. Update room status to occupied
    setRoomList(prev => prev.map(r => r.number === selectedRoomNumber ? {
      ...r,
      roomStatus: 'occupied',
      currentGuest: checkInModal.guestName,
      checkOut: checkInModal.checkOut,
    } : r));

    // 4. Create new In-House Resident record & Folio
    const newResident: InHouseResident = {
      id: `IH0${inHouseList.length + 1}`,
      resId: checkInModal.bookingRef,
      guestId: `G00${inHouseList.length + 2}`,
      guestName: checkInModal.guestName,
      roomNumber: selectedRoomNumber,
      roomType: checkInModal.roomType,
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedCheckOut: checkInModal.checkOut,
      nights: checkInModal.nights || 3,
      adults: checkInModal.adults || 2,
      children: 0,
      tier: 'Standard',
      phone: checkInModal.phone || '+1 555-0199',
      email: `${checkInModal.guestName.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      additionalOccupants: checkInOccupants.map((occ, idx) => ({ id: `OCC-${Date.now()}-${idx + 1}`, ...occ })),
      roomRate: assignedRoom?.ratePerNight || 350,
      totalRoomCharges: (assignedRoom?.ratePerNight || 350) * (checkInModal.nights || 3),
      incidentals: [],
      payments: [
        {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          method: 'Credit Card (Pre-Auth)',
          amount: Math.round(((assignedRoom?.ratePerNight || 350) * (checkInModal.nights || 3)) * 0.5),
          ref: `AUTH-CC-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'successful',
        }
      ],
      depositPaid: Math.round(((assignedRoom?.ratePerNight || 350) * (checkInModal.nights || 3)) * 0.5),
      notes: idVerified ? ['ID Document verified at check-in'] : [],
    };
    setInHouseList(prev => [newResident, ...prev]);

    // 5. Activity log
    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'checkin',
      message: `${checkInModal.guestName} checked into Room #${selectedRoomNumber} (${keycardsCount} RFID keycards issued)`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    addToast({
      type: 'success',
      title: 'Check-In Complete',
      message: `${checkInModal.guestName} registered in Room #${selectedRoomNumber}. Folio activated & ${keycardsCount} access cards programmed.`,
    });

    setCheckInModal(null);
    setCheckInOccupants([]);
    setIdVerified(false);
  };

  // 9. Fast Walk-In Registration
  const handleWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInRoom) {
      addToast({ type: 'warning', title: 'Fields Required', message: 'Please provide guest name and assign clean room.' });
      return;
    }

    const assignedRoom = roomList.find(r => r.number === walkInRoom);
    const nightlyRate = assignedRoom?.ratePerNight || 350;
    const totalCharges = nightlyRate * walkInNights;

    // Create resident directly
    const walkInResident: InHouseResident = {
      id: `IH0${inHouseList.length + 1}`,
      resId: `WALK-${Date.now().toString().slice(-4)}`,
      guestId: `G00${inHouseList.length + 5}`,
      guestName: walkInName,
      roomNumber: walkInRoom,
      roomType: assignedRoom?.type || 'Deluxe Room',
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedCheckOut: new Date(Date.now() + walkInNights * 86400000).toISOString().split('T')[0],
      nights: walkInNights,
      adults: 1,
      children: 0,
      tier: 'Walk-In Guest',
      phone: walkInPhone,
      email: `${walkInName.toLowerCase().replace(/[^a-z]/g, '')}@walkin.com`,
      additionalOccupants: [],
      roomRate: nightlyRate,
      totalRoomCharges: totalCharges,
      incidentals: [],
      payments: [
        {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          method: walkInPaymentMethod,
          amount: totalCharges,
          ref: `TXN-WALK-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'successful',
        }
      ],
      depositPaid: totalCharges,
      notes: ['Walk-in registration at Front Desk Counter #1'],
    };

    setInHouseList(prev => [walkInResident, ...prev]);

    setRoomList(prev => prev.map(r => r.number === walkInRoom ? {
      ...r,
      roomStatus: 'occupied',
      currentGuest: walkInName,
    } : r));

    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'checkin',
      message: `Walk-in Guest ${walkInName} registered into Room #${walkInRoom} (${walkInNights} nights, paid in full)`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    addToast({
      type: 'success',
      title: 'Walk-In Check-In Complete',
      message: `${walkInName} checked into Room #${walkInRoom}. Payment settled & keys issued.`,
    });

    setIsWalkInOpen(false);
    setWalkInName('');
  };

  // 10. Stay Management: Extend Stay
  const handleExtendStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendStayModal || !newExtendCheckOut) return;

    const oldDate = new Date(extendStayModal.expectedCheckOut);
    const newDate = new Date(newExtendCheckOut);
    const diffDays = Math.ceil((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      addToast({ type: 'warning', title: 'Invalid Extension Date', message: 'New departure date must be after current departure date.' });
      return;
    }

    const additionalCost = diffDays * extendStayModal.roomRate;

    setInHouseList(prev => prev.map(res => {
      if (res.id === extendStayModal.id) {
        return {
          ...res,
          expectedCheckOut: newExtendCheckOut,
          nights: res.nights + diffDays,
          totalRoomCharges: res.totalRoomCharges + additionalCost,
          notes: [...res.notes, `Stay extended by ${diffDays} nights to ${newExtendCheckOut} (+$${additionalCost})`],
        };
      }
      return res;
    }));

    addToast({
      type: 'success',
      title: 'Stay Extended Successfully',
      message: `${extendStayModal.guestName}'s departure updated to ${newExtendCheckOut} (+${diffDays} nights, +$${additionalCost}).`,
    });

    setExtendStayModal(null);
  };

  // 11. Stay Management: Early Departure
  const handleEarlyDepartureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!earlyDepartureModal) return;

    setInHouseList(prev => prev.map(res => {
      if (res.id === earlyDepartureModal.id) {
        return {
          ...res,
          expectedCheckOut: earlyDepartureDate,
          notes: [...res.notes, `Early departure requested for ${earlyDepartureDate}`],
        };
      }
      return res;
    }));

    addToast({
      type: 'info',
      title: 'Early Departure Recorded',
      message: `Departure schedule adjusted to ${earlyDepartureDate}. Ready for folio settlement.`,
    });
    setEarlyDepartureModal(null);
  };

  // 12. Stay Management: Room Move
  const handleRoomMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomMoveResident || !roomMoveTarget) return;

    const dest = roomList.find(r => r.number === roomMoveTarget);
    if (!dest || dest.roomStatus !== 'vacant' || (dest.housekeepingStatus !== 'clean' && dest.housekeepingStatus !== 'inspected')) {
      addToast({ type: 'error', title: 'Target Room Not Available', message: 'Target room must be vacant, clean, and inspected.' });
      return;
    }

    const oldRoom = roomMoveResident.roomNumber;

    // Update resident
    setInHouseList(prev => prev.map(res => {
      if (res.id === roomMoveResident.id) {
        return {
          ...res,
          roomNumber: roomMoveTarget,
          roomType: dest.type,
          notes: [...res.notes, `Room moved from #${oldRoom} to #${roomMoveTarget}: ${roomMoveReason}`],
        };
      }
      return res;
    }));

    // Old room becomes DIRTY, new room becomes occupied
    setRoomList(prev => prev.map(r => {
      if (r.number === oldRoom) {
        return { ...r, roomStatus: 'vacant', housekeepingStatus: 'dirty', currentGuest: undefined };
      }
      if (r.number === roomMoveTarget) {
        return { ...r, roomStatus: 'occupied', currentGuest: roomMoveResident.guestName };
      }
      return r;
    }));

    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'maintenance',
      message: `Room Move: ${roomMoveResident.guestName} moved from #${oldRoom} to #${roomMoveTarget} (${roomMoveReason}). Room #${oldRoom} released as DIRTY.`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    addToast({
      type: 'success',
      title: 'Room Move Executed',
      message: `Guest transferred to Room #${roomMoveTarget}. Room #${oldRoom} released as DIRTY for Housekeeping.`,
    });

    setRoomMoveResident(null);
  };

  // 13. Stay Management: Late Check-Out
  const handleLateCheckOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lateCheckOutResident) return;

    setInHouseList(prev => prev.map(res => {
      if (res.id === lateCheckOutResident.id) {
        const extraIncidentals = lateCheckOutFee > 0 ? [
          ...res.incidentals,
          { id: `late-${Date.now()}`, date: new Date().toISOString().split('T')[0], category: 'Other', description: `Late Checkout Fee (${lateCheckOutTime})`, amount: lateCheckOutFee }
        ] : res.incidentals;

        return {
          ...res,
          lateCheckOutGranted: lateCheckOutTime,
          incidentals: extraIncidentals,
          notes: [...res.notes, `Late checkout granted until ${lateCheckOutTime} (${lateCheckOutFee > 0 ? `$${lateCheckOutFee}` : 'Complimentary VIP waiver'})`],
        };
      }
      return res;
    }));

    addToast({
      type: 'success',
      title: 'Late Checkout Approved',
      message: `Late checkout granted for ${lateCheckOutResident.guestName} until ${lateCheckOutTime}.`,
    });
    setLateCheckOutResident(null);
  };

  // 14. Stay Management: Add Incidentals / Service Charges
  const handleAddIncidentalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addServiceResident || !serviceDescription || !serviceAmount || Number(serviceAmount) <= 0) {
      addToast({ type: 'warning', title: 'Fields Required', message: 'Please provide description and valid charge amount.' });
      return;
    }

    const newInc = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: serviceCategory,
      description: serviceDescription,
      amount: Number(serviceAmount),
    };

    setInHouseList(prev => prev.map(res => {
      if (res.id === addServiceResident.id) {
        return {
          ...res,
          incidentals: [...res.incidentals, newInc],
        };
      }
      return res;
    }));

    addToast({
      type: 'success',
      title: 'Incidental Added to Folio',
      message: `${serviceDescription} (+$${newInc.amount}) charged to Room #${addServiceResident.roomNumber}.`,
    });

    setAddServiceResident(null);
    setServiceDescription('');
    setServiceAmount('');
  };

  // 15. Check-Out & Folio Settlement Handlers
  const handleRecordPayment = (residentId: string, amount: number, method: string, ref: string) => {
    if (amount <= 0) return;
    const txId = ref || `TXN-GW-${Math.floor(100000 + Math.random() * 900000)}`;

    setInHouseList(prev => prev.map(res => {
      if (res.id === residentId) {
        return {
          ...res,
          payments: [
            ...res.payments,
            { id: `pay-${Date.now()}`, date: new Date().toISOString().split('T')[0], method, amount, ref: txId, status: 'successful' }
          ],
        };
      }
      return res;
    }));

    addToast({
      type: 'success',
      title: 'Payment Processed',
      message: `Payment of $${amount.toFixed(2)} (${method}) recorded with reference ${txId}.`,
    });
    setPaymentAmountInput('');
    setPaymentRefInput('');
  };

  // 16. Final Check-Out Execution (Critical Business Rule)
  const handleFinalCheckOut = (resident: InHouseResident) => {
    const totalCharges = resident.totalRoomCharges + resident.incidentals.reduce((a, b) => a + b.amount, 0) + Math.round((resident.totalRoomCharges + resident.incidentals.reduce((a, b) => a + b.amount, 0)) * 0.10);
    const totalPayments = resident.payments.filter(p => p.status === 'successful').reduce((a, b) => a + b.amount, 0);
    const outstanding = Math.max(0, totalCharges - totalPayments);

    if (outstanding > 0.01) {
      addToast({
        type: 'error',
        title: 'Outstanding Balance Unpaid',
        message: `Cannot complete checkout! Outstanding balance of $${outstanding.toFixed(2)} must be settled first.`,
      });
      return;
    }

    if (!isKeyReturned) {
      addToast({
        type: 'warning',
        title: 'Keycards Confirmation Required',
        message: 'Please confirm all room access cards have been returned.',
      });
      return;
    }

    // 1. Remove from in-house list
    setInHouseList(prev => prev.filter(res => res.id !== resident.id));

    // 2. Mark departure as completed
    setDepartureList(prev => prev.map(dep => (dep.roomNumber === resident.roomNumber || dep.guestName === resident.guestName) ? {
      ...dep,
      status: 'checked-out' as const,
      billSettled: true,
    } : dep));

    // 3. Mark reservation as checked-out
    setReservationList(prev => prev.map(r => r.bookingRef === resident.resId ? { ...r, status: 'checked-out' as const } : r));

    // 4. Release room for housekeeping: set roomStatus to vacant, housekeepingStatus to DIRTY
    setRoomList(prev => prev.map(r => r.number === resident.roomNumber ? {
      ...r,
      roomStatus: 'vacant',
      housekeepingStatus: 'dirty',
      currentGuest: undefined,
      checkOut: undefined,
    } : r));

    // 5. Activity log
    const newAct: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'checkout',
      message: `${resident.guestName} checked out of Room #${resident.roomNumber}. Folio finalized, keys returned, Room released as DIRTY.`,
      time: 'Just now',
      user: currentAgent.name,
    };
    setActivities(prev => [newAct, ...prev]);

    setInvoiceSuccessModal({
      resident,
      finalBill: totalCharges,
      txRef: resident.payments[resident.payments.length - 1]?.ref || 'TXN-FINAL-SETTLED',
    });

    setCheckOutModalResident(null);
    setIsKeyReturned(false);

    addToast({
      type: 'success',
      title: 'Checkout Finalized',
      message: `${resident.guestName} checked out successfully. Room #${resident.roomNumber} released to Housekeeping as DIRTY.`,
    });
  };

  // 17. OCR Simulator & Camera Handlers
  const handleSelectDocType = (dt: 'Passport' | 'National ID' | 'Driver License') => {
    setSelectedDocType(dt);
    setExtractedData(docPresets[dt]);
    setUploadedDocImage(null);
    setOcrCompleted(false);
  };

  const startCamera = async () => {
    setScannerMode('camera');
    setCameraActive(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Webcam API not supported in browser environment. Running live viewfinder simulation.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access not permitted. Running interactive viewfinder simulation.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (videoRef.current && cameraStream) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setUploadedDocImage(dataUrl);
          stopCamera();
          setScannerMode('upload');
          handleScanId();
          return;
        }
      } catch (e) {
        console.warn('Canvas capture error:', e);
      }
    }
    stopCamera();
    setScannerMode('upload');
    handleScanId();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedDocImage(reader.result as string);
      stopCamera();
      setScannerMode('upload');
      handleScanId();
      addToast({
        type: 'info',
        title: 'Document Loaded',
        message: `${file.name} loaded into OCR buffer. Running text extraction...`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleScanId = () => {
    setIsScanning(true);
    setScanProgress(0);
    setOcrCompleted(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setOcrCompleted(true);
        setOcrConfidence(98.8);
        addToast({
          type: 'success',
          title: 'OCR Scan Completed',
          message: `${selectedDocType} extracted with 98.8% confidence. Security reference stamped.`,
        });
      }
    }, 180);
  };

  const handlePushOcrToRegistration = () => {
    const pushData: Partial<Guest> = {
      firstName: extractedData.firstName,
      middleName: extractedData.middleName,
      lastName: extractedData.lastName,
      email: extractedData.email,
      phone: extractedData.phone,
      dateOfBirth: extractedData.dateOfBirth,
      nationality: extractedData.nationality,
      gender: extractedData.gender,
      address: extractedData.address,
      idType: extractedData.idType,
      idNumber: extractedData.idNumber,
      passportNumber: extractedData.idNumber,
      idExpiryDate: extractedData.idExpiryDate,
      emergencyContactName: extractedData.emergencyContactName,
      emergencyContactPhone: extractedData.emergencyContactPhone,
    };

    setOcrPushedData(pushData);

    // Record audit entry
    const auditEntry = {
      id: `AUDIT-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      docType: selectedDocType,
      docNumber: extractedData.idNumber,
      guestName: `${extractedData.firstName} ${extractedData.lastName}`,
      confidence: ocrConfidence,
      status: new Date(extractedData.idExpiryDate).getTime() < Date.now() ? ('Expired' as const) : ('Verified & Accepted' as const),
      securityHash: `SHA256: ${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
    };
    setOcrAuditLog(prev => [auditEntry, ...prev]);

    setActiveTab('registration');
    addToast({
      type: 'info',
      title: 'Fields Populated',
      message: 'Verified OCR document fields transferred directly into New Guest Registration form.',
    });
  };

  // 18. New Guest Registration Handler (Part A)
  const handleRegisterGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPhone || !regIdNumber) {
      addToast({ type: 'warning', title: 'Required Fields', message: 'Please complete all required demographic and identity fields.' });
      return;
    }

    const newGuest: Guest = {
      id: regGuestId,
      firstName: regFirstName,
      middleName: regMiddleName || undefined,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      dateOfBirth: regDob,
      nationality: regNationality,
      gender: regGender,
      address: regAddress,
      idType: regIdType,
      idNumber: regIdNumber,
      idExpiryDate: regIdExpiry,
      emergencyContactName: regEmergencyName,
      emergencyContactPhone: regEmergencyPhone,
      passportNumber: regIdType === 'Passport' ? regIdNumber : `PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      vipStatus: false,
      tier: 'Bronze',
      totalStays: 0,
      totalSpend: 0,
      preferences: ['Standard Room'],
      allergies: [],
      notes: 'New guest registered at Front Office reception.',
      lastStay: 'Never',
      joinDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + guestList.length}?w=150&q=80`,
    };

    setGuestList(prev => [newGuest, ...prev]);
    addToast({
      type: 'success',
      title: 'Guest Profile Registered',
      message: `${newGuest.firstName} ${newGuest.lastName} (${newGuest.id}) registered into Guest CRM.`,
    });

    setRegGuestId(`G00${guestList.length + 2}`);
    setRegFirstName('');
    setRegLastName('');
    setRegEmail('');
    setRegPhone('');
    setRegAddress('');
    setActiveTab('search-crm');
  };

  // 19. CRM Save & Merge
  const handleSaveGuestEdit = () => {
    if (!selectedGuest) return;
    setGuestList(prev => prev.map(g => {
      if (g.id === selectedGuest.id) {
        return {
          ...g,
          phone: editGuestPhone,
          email: editGuestEmail,
          address: editGuestAddress,
          preferences: editGuestPreferences.split(',').map(s => s.trim()).filter(Boolean),
        };
      }
      return g;
    }));

    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: `Changes saved for ${selectedGuest.firstName} ${selectedGuest.lastName}.`,
    });
    setIsEditingGuest(false);
    setSelectedGuest(null);
  };

  const handleMergeProfiles = () => {
    if (!selectedGuest || !guestToMerge) return;
    setGuestList(prev => prev.filter(g => g.id !== guestToMerge.id));
    addToast({
      type: 'success',
      title: 'Profiles Consolidated',
      message: `Duplicate profile ${guestToMerge.id} merged into primary profile ${selectedGuest.id}.`,
    });
    setIsMergeModalOpen(false);
    setGuestToMerge(null);
  };

  // 20. Complaints Handlers
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compDesc.trim()) return;

    const newTicket: ServiceRequest = {
      id: `REQ-${Math.floor(300 + complaints.length + 1)}`,
      roomNumber: compRoom,
      guestName: roomList.find(r => r.number === compRoom)?.currentGuest || 'Registered Resident',
      department: compDept,
      category: compCategory,
      description: compDesc,
      urgency: compUrgency,
      status: 'open',
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setComplaints(prev => [newTicket, ...prev]);
    addToast({
      type: 'warning',
      title: 'Ticket Dispatched',
      message: `Ticket ${newTicket.id} dispatched to ${newTicket.department} (${newTicket.urgency.toUpperCase()} urgency).`,
    });
    setIsNewComplaintOpen(false);
    setCompDesc('');
  };

  const handleResolveComplaint = (ticketId: string, notes: string) => {
    setComplaints(prev => prev.map(c => c.id === ticketId ? {
      ...c,
      status: 'resolved' as const,
      resolutionNotes: notes || 'Resolved by duty team',
    } : c));
    addToast({
      type: 'success',
      title: 'Ticket Resolved',
      message: `Ticket ${ticketId} resolved and closed.`,
    });
  };

  // Filtered CRM Guests (Part B: 7 criteria)
  const filteredCrmGuests = guestList.filter(g => {
    if (!crmSearchQuery) return true;
    const q = crmSearchQuery.toLowerCase();
    const fullName = `${g.firstName} ${g.middleName || ''} ${g.lastName}`.toLowerCase();

    switch (crmSearchField) {
      case 'id': return g.id.toLowerCase().includes(q);
      case 'name': return fullName.includes(q);
      case 'phone': return g.phone.toLowerCase().includes(q);
      case 'email': return g.email.toLowerCase().includes(q);
      case 'passport': return g.passportNumber.toLowerCase().includes(q);
      case 'nationalId': return (g.nationalIdNumber || '').toLowerCase().includes(q);
      case 'loyalty': return (g.loyaltyNumber || '').toLowerCase().includes(q);
      default:
        return (
          g.id.toLowerCase().includes(q) ||
          fullName.includes(q) ||
          g.phone.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.passportNumber.toLowerCase().includes(q) ||
          (g.nationalIdNumber || '').toLowerCase().includes(q) ||
          (g.loyaltyNumber || '').toLowerCase().includes(q)
        );
    }
  });

  // Sidebar Menu Items (All 16 Front Desk Modules)
  const menuItems = [
    { id: 'overview', label: 'Command Center', icon: <Layers className="w-4 h-4" />, badge: '16' },
    { id: 'reservations', label: 'Reservations', icon: <CalendarDays className="w-4 h-4" />, badge: reservedRooms },
    { id: 'walkin', label: 'Walk-In Desk', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'groups', label: 'Groups & Corporate', icon: <Briefcase className="w-4 h-4" />, badge: groupBookings.length },
    { id: 'rooms', label: 'Room Inventory', icon: <BedDouble className="w-4 h-4" />, badge: `${availableRoomsReady}` },
    { id: 'checkin', label: 'Arrivals & Check-In', icon: <DoorOpen className="w-4 h-4" />, badge: pendingCheckIns },
    { id: 'stay-mgmt', label: 'Stay Management', icon: <Users className="w-4 h-4" />, badge: currentlyStaying },
    { id: 'checkout', label: 'Check-Out & Folios', icon: <DoorClosed className="w-4 h-4" />, badge: pendingCheckOuts },
    { id: 'housekeeping', label: 'Housekeeping Desk', icon: <Sparkles className="w-4 h-4" />, badge: dirtyRooms },
    { id: 'maintenance', label: 'Maintenance Coord', icon: <Wrench className="w-4 h-4" />, badge: maintenanceTickets.filter(t => t.status !== 'Closed').length },
    { id: 'requests', label: 'Requests & Tickets', icon: <MessageSquareWarning className="w-4 h-4" />, badge: serviceRequests.filter(t => t.status !== 'Completed').length },
    { id: 'comms', label: 'Guest Comms & SMS', icon: <Mail className="w-4 h-4" /> },
    { id: 'search-crm', label: 'Guest CRM', icon: <User className="w-4 h-4" />, badge: guestList.length },
    { id: 'registration', label: 'New Registration', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'scanner', label: 'ID Scanner & OCR', icon: <Scan className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* ─── DYNAMIC LEFT SIDEBAR (Adapts color to propertyMode: luxury, guesthouse, restaurant) ─── */}
      <aside
        className={`${gradientClass} flex flex-col transition-all duration-300 h-full relative z-20 ${
          deskSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setDeskSidebarCollapsed(!deskSidebarCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-30"
        >
          {deskSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Logo & Counter Info */}
        <div className={`px-4 py-4 border-b border-white/10 flex items-center gap-2.5 ${deskSidebarCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <ConciergeBell className="w-5 h-5 text-amber-300" />
          </div>
          {!deskSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm font-serif leading-none truncate">{config.name}</p>
              <p className="text-white/70 text-[11px] mt-0.5">Front Office Console</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-1">
          {!deskSidebarCollapsed && (
            <p className="px-2 text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Front Desk Modules</p>
          )}

          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                title={deskSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm font-bold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                } ${deskSidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!deskSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-white/20 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold leading-none flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent Duty Footnote */}
        <div className={`p-3 border-t border-white/10 ${deskSidebarCollapsed ? 'text-center' : ''}`}>
          {!deskSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 text-white/80">
              <img src={currentAgent.avatar} className="w-7 h-7 rounded-full border border-white/30 object-cover" alt="" />
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold leading-tight truncate text-white">{currentAgent.name}</p>
                <p className="text-[10px] text-white/60">Counter #1 · Float: $1,450.00</p>
              </div>
            </div>
          ) : (
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mx-auto" title="Agent Online: Sarah Mitchell" />
          )}
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE ────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sticky Header with Fast Desk Actions */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Back & Forward History Navigation */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleBackTab}
                  disabled={tabHistory.length === 0}
                  title={tabHistory.length > 0 ? `Back to ${getTabLabel(tabHistory[tabHistory.length - 1])}` : 'No previous tab in history'}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
                    tabHistory.length > 0
                      ? 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 cursor-pointer hover:shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Back</span>
                  {tabHistory.length > 0 && (
                    <span className="hidden md:inline text-[10px] font-medium text-indigo-600 dark:text-indigo-400 max-w-[90px] truncate">
                      ({getTabLabel(tabHistory[tabHistory.length - 1])})
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleForwardTab}
                  disabled={tabForwardHistory.length === 0}
                  title={tabForwardHistory.length > 0 ? `Forward to ${getTabLabel(tabForwardHistory[0])}` : 'No forward tab in history'}
                  className={`p-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
                    tabForwardHistory.length > 0
                      ? 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 cursor-pointer hover:shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                    Front Office Reception
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Active Shift
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    {getTabLabel(activeTab)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Terminal: <strong>FD-01</strong> · Duty Agent: <strong>{currentAgent.name}</strong> · Mode: <strong className="capitalize">{propertyMode}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setResCheckIn(availCheckIn);
                  setResCheckOut(availCheckOut);
                  setIsNewResOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> New Reservation
              </button>
              <button
                onClick={() => setActiveTab('walkin')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <DoorOpen className="w-3.5 h-3.5" /> Walk-In Desk
              </button>
              <button
                onClick={() => setActiveTab('scanner')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold"
              >
                <Scan className="w-3.5 h-3.5 text-indigo-500" /> ID OCR
              </button>
              <button
                onClick={() => setActiveTab('registration')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-500" /> Register Guest
              </button>
            </div>
          </div>

          {/* Item 16: Active Guest Requests Alert Banner */}
          {activeUnresolvedRequests.length > 0 && (
            <div
              onClick={() => setActiveTab('requests')}
              className="mt-2.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="truncate">
                  <strong>Urgent Request Alert ({activeUnresolvedRequests.length} pending):</strong>{' '}
                  {activeUnresolvedRequests[0].description.slice(0, 85)}... (Room #{activeUnresolvedRequests[0].roomNumber})
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 underline flex-shrink-0 ml-2">
                Dispatch Ticket →
              </span>
            </div>
          )}
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW & 16 INTERACTIVE KPI METRICS             */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Front Office Command Center (16 Interactive KPIs)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Click any card below to navigate directly to that operations module with filters pre-applied.
                  </p>
                </div>
              </div>

              {/* 16 KPI Metric Cards - ALL CLICKABLE */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* 1. Total Rooms */}
                <div
                  onClick={() => {
                    setActiveTab('rooms');
                    setRoomStatusFilter('all');
                    setHousekeepingFilter('all');
                    setRoomsSubTab('grid');
                    addToast({ type: 'info', title: 'Room Inventory', message: 'Displaying complete property room inventory.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">1. Total Rooms</span>
                    <BedDouble className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalRooms}</p>
                  <p className="text-[11px] text-gray-500">All property inventory</p>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block mt-1">View floor grid →</span>
                </div>

                {/* 2. Available Rooms */}
                <div
                  onClick={() => {
                    setActiveTab('rooms');
                    setRoomStatusFilter('vacant');
                    setHousekeepingFilter('ready');
                    setRoomsSubTab('grid');
                    addToast({ type: 'success', title: 'Available & Ready', message: 'Filtered to vacant, clean & inspected rooms ready for guests.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">2. Available</span>
                    <Sparkles className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{availableRoomsReady}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Clean & Inspected</p>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">Assign room →</span>
                </div>

                {/* 3. Occupied Rooms */}
                <div
                  onClick={() => {
                    setActiveTab('stay-mgmt');
                    setStaySubTab('in-house');
                    addToast({ type: 'info', title: 'Occupied In-House', message: 'Showing currently staying resident guests.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">3. Occupied</span>
                    <Users className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{occupiedRooms}</p>
                  <p className="text-[11px] text-gray-500">{Math.round((occupiedRooms / totalRooms) * 100)}% Occupancy</p>
                  <span className="text-[10px] text-blue-600 font-bold block mt-1">Manage stays →</span>
                </div>

                {/* 4. Reserved Rooms */}
                <div
                  onClick={() => {
                    setActiveTab('reservations');
                    setResSubTab('all');
                    setResStatusFilter('confirmed');
                    addToast({ type: 'info', title: 'Reserved Bookings', message: 'Showing active confirmed reservations.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">4. Reserved</span>
                    <CalendarDays className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{reservedRooms}</p>
                  <p className="text-[11px] text-gray-500">Confirmed Bookings</p>
                  <span className="text-[10px] text-indigo-600 font-bold block mt-1">Review pipeline →</span>
                </div>

                {/* 5. Rooms Requiring Cleaning */}
                <div
                  onClick={() => {
                    setActiveTab('rooms');
                    setHousekeepingFilter('dirty');
                    setRoomStatusFilter('all');
                    setRoomsSubTab('grid');
                    addToast({ type: 'warning', title: 'Dirty Rooms Queue', message: 'Displaying rooms requiring housekeeping cleaning & turnover.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">5. Dirty (Cleaning)</span>
                    <Sparkles className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">{dirtyRooms}</p>
                  <p className="text-[11px] text-gray-500">Needs Cleaning</p>
                  <span className="text-[10px] text-red-600 font-bold block mt-1">Dispatch HK →</span>
                </div>

                {/* 6. Rooms Under Maintenance */}
                <div
                  onClick={() => {
                    setActiveTab('rooms');
                    setRoomStatusFilter('out_of_order');
                    setRoomsSubTab('blocked');
                    addToast({ type: 'info', title: 'Maintenance & Out of Order', message: 'Showing rooms under engineering repair or blocked.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">6. Out of Order</span>
                    <Wrench className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{maintenanceRooms}</p>
                  <p className="text-[11px] text-gray-500">Engineering Work</p>
                  <span className="text-[10px] text-purple-600 font-bold block mt-1">Review work orders →</span>
                </div>

                {/* 7. Today's Expected Arrivals */}
                <div
                  onClick={() => {
                    setActiveTab('checkin');
                    setCheckInSubTab('expected');
                    addToast({ type: 'info', title: 'Expected Arrivals', message: 'Displaying incoming guests scheduled today.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">7. Arrivals Today</span>
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{expectedArrivals}</p>
                  <p className="text-[11px] text-gray-500">Scheduled Check-Ins</p>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">Check-in desk →</span>
                </div>

                {/* 8. Today's Expected Departures */}
                <div
                  onClick={() => {
                    setActiveTab('checkout');
                    setCheckOutSubTab('departures');
                    addToast({ type: 'info', title: 'Expected Departures', message: 'Displaying departing guests scheduled today.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">8. Departures Today</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{expectedDepartures}</p>
                  <p className="text-[11px] text-gray-500">Scheduled Checkouts</p>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">Settle folios →</span>
                </div>

                {/* 9. Guests Currently Staying */}
                <div
                  onClick={() => {
                    setActiveTab('stay-mgmt');
                    setStaySubTab('in-house');
                    addToast({ type: 'info', title: 'In-House Residents', message: 'Active resident guest directory.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">9. In-House Guests</span>
                    <User className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-teal-600 mt-1">{currentlyStaying}</p>
                  <p className="text-[11px] text-gray-500">Active Residents</p>
                  <span className="text-[10px] text-teal-600 font-bold block mt-1">View folios & notes →</span>
                </div>

                {/* 10. Pending Check-Ins */}
                <div
                  onClick={() => {
                    setActiveTab('checkin');
                    setCheckInSubTab('pending');
                    addToast({ type: 'info', title: 'Pending Check-Ins', message: 'Arrivals waiting for keycard assignment.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">10. Pending Check-In</span>
                    <DoorOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCheckIns}</p>
                  <p className="text-[11px] text-gray-500">Awaiting Arrival</p>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">Execute check-in →</span>
                </div>

                {/* 11. Pending Check-Outs */}
                <div
                  onClick={() => {
                    setActiveTab('checkout');
                    setCheckOutSubTab('pending');
                    addToast({ type: 'info', title: 'Pending Check-Outs', message: 'Folios pending payment collection and key return.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">11. Pending Check-Out</span>
                    <DoorClosed className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCheckOuts}</p>
                  <p className="text-[11px] text-gray-500">Keys Not Returned</p>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">Collect keys & bill →</span>
                </div>

                {/* 12. Guests with Outstanding Balances */}
                <div
                  onClick={() => {
                    setActiveTab('checkout');
                    setCheckOutFilter('unpaid');
                    setCheckOutSubTab('pending');
                    addToast({ type: 'warning', title: 'Outstanding Balances', message: 'Displaying folios with unsettled balance due.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">12. Balances Due</span>
                    <DollarSign className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xl font-bold text-red-600 mt-1">${totalBalanceDue.toLocaleString()}</p>
                  <p className="text-[11px] text-red-500 font-medium">{inHouseList.filter(res => res.totalRoomCharges + res.incidentals.reduce((a, b) => a + b.amount, 0) - res.payments.reduce((a, b) => a + b.amount, 0) > 0).length} folios with balance</p>
                  <span className="text-[10px] text-red-600 font-bold block mt-1">Review folios →</span>
                </div>

                {/* 13. Urgent Guest Requests */}
                <div
                  onClick={() => {
                    setActiveTab('requests');
                    setComplaintUrgencyFilter('critical');
                    addToast({ type: 'warning', title: 'Critical Service Requests', message: 'Filtering urgent guest tickets requiring immediate dispatch.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">13. Urgent Requests</span>
                    <AlertCircle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{urgentRequests.length}</p>
                  <p className="text-[11px] text-rose-500 font-medium">Critical SLA response</p>
                  <span className="text-[10px] text-rose-600 font-bold block mt-1">Dispatch engineering →</span>
                </div>

                {/* 14. Housekeeping & Maintenance Alerts */}
                <div
                  onClick={() => {
                    setActiveTab('requests');
                    setComplaintDeptFilter('all');
                    addToast({ type: 'info', title: 'Department Coordination', message: 'Viewing all Housekeeping and Maintenance coordination tickets.' });
                  }}
                  className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">14. Dept. Alerts</span>
                    <MessageSquareWarning className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{housekeepingMaintenanceAlerts}</p>
                  <p className="text-[11px] text-gray-500">HK & Maintenance</p>
                  <span className="text-[10px] text-purple-600 font-bold block mt-1">Open tickets →</span>
                </div>

                {/* 16. Active Requests Overall */}
                <div
                  onClick={() => {
                    setActiveTab('requests');
                    setComplaintUrgencyFilter('all');
                  }}
                  className="p-3.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm col-span-2 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">16. Active Requests</span>
                    <HelpCircle className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-2xl font-bold text-indigo-950 dark:text-white">{activeUnresolvedRequests.length} Open</p>
                    <span className="text-xs font-bold text-indigo-600 hover:underline">View All →</span>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Total department inquiries</p>
                </div>
              </div>

              {/* 15. Live Activities Feed */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    15. Recent Front Office Activities Feed
                  </h3>
                  <span className="text-xs text-gray-400">{activities.length} Events Recorded</span>
                </div>

                <div className="space-y-2">
                  {activities.slice(0, 8).map(act => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 flex items-center justify-between text-xs hover:bg-gray-100/70 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">{act.message}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span className="font-mono text-[11px] bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">{act.user}</span>
                        <span>·</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: RESERVATIONS WORKSTATION                          */}
          {/* ======================================================== */}
          {activeTab === 'reservations' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-indigo-600" />
                      Reservations Workstation
                    </h2>
                    <p className="text-xs text-gray-500">
                      Search bookings, view upcoming reservations, confirm/modify bookings, handle groups, multi-guests, early/late arrivals and no-shows.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWalkInOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    ⚡ Fast Walk-In
                  </button>
                  <button
                    onClick={() => {
                      setResCheckIn(availCheckIn);
                      setResCheckOut(availCheckOut);
                      setResRoomType(availRoomType);
                      setIsNewResOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> + New Reservation
                  </button>
                </div>
              </div>

              {/* Sub-Nav Tabs for Reservations */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 pb-2">
                {[
                  { id: 'all', label: 'All Reservations', count: reservationList.length },
                  { id: 'upcoming', label: 'Upcoming Bookings', count: reservationList.filter(r => r.status === 'confirmed').length },
                  { id: 'arrivals-today', label: "Today's Expected Arrivals", count: arrivalList.filter(a => a.status === 'pending').length },
                  { id: 'groups', label: 'Group Reservations', count: reservationList.filter(r => r.isGroup).length },
                  { id: 'history', label: 'Reservation History', count: reservationList.filter(r => r.status === 'checked-out' || r.status === 'cancelled' || r.status === 'no-show').length },
                ].map(sub => {
                  const active = resSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setResSubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Room Availability Inspector */}
              <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live Room Availability Engine</h3>
                      <p className="text-[11px] text-gray-500">Query dates, categories, rates, and inspect clean rooms ready for booking</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Engine Synchronized
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Check-In Date</label>
                    <input
                      type="date"
                      value={availCheckIn}
                      onChange={e => setAvailCheckIn(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      value={availCheckOut}
                      onChange={e => setAvailCheckOut(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Room Category</label>
                    <select
                      value={availRoomType}
                      onChange={e => setAvailRoomType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium"
                    >
                      <option value="Deluxe Suite">Deluxe Suite ($350/nt)</option>
                      <option value="Executive King">Executive King ($280/nt)</option>
                      <option value="Ocean View Villa">Ocean View Villa ($600/nt)</option>
                      <option value="Standard Queen">Standard Queen ($180/nt)</option>
                      <option value="Family Suite">Family Suite ($420/nt)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setResCheckIn(availCheckIn);
                        setResCheckOut(availCheckOut);
                        setResRoomType(availRoomType);
                        setIsNewResOpen(true);
                      }}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <DoorOpen className="w-4 h-4" /> Book Selected Category →
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Category Availability: <strong className="text-emerald-600">{availableCleanRooms.length} Clean Rooms Ready</strong>
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Standard Rate: <strong>${availRoomType.includes('Villa') ? 600 : availRoomType.includes('Suite') ? 350 : 250}/night</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500">Clean ready rooms:</span>
                    {availableCleanRooms.slice(0, 4).map(r => (
                      <span key={r.id} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-700">
                        Room #{r.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reservations Search & Filter Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ref (RES-...), guest name, phone, email, room..."
                    value={resSearchQuery}
                    onChange={e => setResSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Filter Status:</span>
                  <select
                    value={resStatusFilter}
                    onChange={e => setResStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending Confirmation</option>
                    <option value="checked-in">Checked-In</option>
                    <option value="checked-out">Checked-Out</option>
                    <option value="no-show">No-Show</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3">Booking Ref / Source</th>
                        <th className="px-4 py-3">Primary Guest & Occupants</th>
                        <th className="px-4 py-3">Room & Category</th>
                        <th className="px-4 py-3">Dates & Nights</th>
                        <th className="px-4 py-3">Financials & Deposit</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Desk Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
                      {reservationList
                        .filter(res => {
                          if (resSubTab === 'upcoming' && res.status !== 'confirmed') return false;
                          if (resSubTab === 'arrivals-today' && res.checkIn !== '2026-10-31') return false;
                          if (resSubTab === 'groups' && !res.isGroup) return false;
                          if (resSubTab === 'history' && !['checked-out', 'cancelled', 'no-show'].includes(res.status)) return false;

                          if (resStatusFilter !== 'all' && res.status !== resStatusFilter) return false;
                          if (!resSearchQuery) return true;
                          const q = resSearchQuery.toLowerCase();
                          return (
                            res.bookingRef.toLowerCase().includes(q) ||
                            res.guestName.toLowerCase().includes(q) ||
                            res.roomType.toLowerCase().includes(q) ||
                            (res.roomNumber && res.roomNumber.toLowerCase().includes(q))
                          );
                        })
                        .map(res => (
                          <tr key={res.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                                {res.bookingRef}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  {res.bookingSource}
                                </span>
                                {res.isGroup && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                    GROUP {res.groupCode}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-900 dark:text-white">{res.guestName}</p>
                              <p className="text-[11px] text-gray-400">
                                {res.adults} Adults {res.children > 0 && `· ${res.children} Children`}
                              </p>
                              {res.additionalOccupants && res.additionalOccupants.length > 0 && (
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400">
                                  +{res.additionalOccupants.length} occupants ({res.additionalOccupants.map(o => o.name).join(', ')})
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-800 dark:text-gray-200">{res.roomType}</p>
                              <span className="text-[11px] text-gray-500 font-mono">
                                Room #{res.roomNumber || 'Unassigned'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-gray-900 dark:text-white font-semibold">
                                {res.checkIn} → {res.checkOut}
                              </p>
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                                {res.nights} Nights
                              </span>
                              {res.isEarlyArrival && (
                                <span className="block text-[10px] text-amber-600 font-bold">Early Arrival Requested</span>
                              )}
                              {res.isLateArrival && (
                                <span className="block text-[10px] text-blue-600 font-bold">Late Arrival Guaranteed</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-900 dark:text-white">${res.totalAmount}</p>
                              <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                res.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : res.paymentStatus === 'partial'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {res.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={res.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedResForDetail(res)}
                                  title="View Full Booking Details"
                                  className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setSelectedResForModify({ ...res })}
                                  title="Modify Permitted Details"
                                  className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 text-gray-600 hover:text-amber-600 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {res.status === 'confirmed' && (
                                  <>
                                    <button
                                      onClick={() => handleEarlyArrival(res)}
                                      title="Handle Early Arrival"
                                      className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold"
                                    >
                                      <DoorOpen className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleLateArrival(res)}
                                      title="Guarantee Late Arrival"
                                      className="p-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-lg font-bold"
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleNoShow(res)}
                                      title="Mark as No-Show & Charge"
                                      className="p-1.5 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-lg font-bold"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                                {res.status !== 'cancelled' && (
                                  <button
                                    onClick={() => setSelectedResForCancel(res)}
                                    title="Cancel Reservation According to Policy"
                                    className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: WALK-IN DESK (Module 13)                            */}
          {/* ======================================================== */}
          {activeTab === 'walkin' && (
            <WalkInDesk
              rooms={roomList}
              guests={guestList}
              onBack={handleBackTab}
              onCompleteWalkInCheckIn={handleCompleteWalkInCheckIn}
              onNavigateToRegistration={() => setActiveTab('registration')}
              onNavigateToScanner={() => setActiveTab('scanner')}
              onAddToast={addToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: GROUP & CORPORATE DESK (Module 14)                  */}
          {/* ======================================================== */}
          {activeTab === 'groups' && (
            <GroupCorporateDesk
              rooms={roomList}
              groups={groupBookings}
              onBack={handleBackTab}
              onAddGroup={grp => setGroupBookings(prev => [grp, ...prev])}
              onUpdateGroup={(id, updates) => setGroupBookings(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))}
              onAddToast={addToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 3: ROOM INVENTORY & STATUS COORDINATION              */}
          {/* ======================================================== */}
          {activeTab === 'rooms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-indigo-600" />
                      Room Inventory & Status Coordination
                    </h2>
                    <p className="text-xs text-gray-500">
                      Separate Room Status (Vacant/Occupied/Blocked/Out of Order) from Housekeeping Status (Clean/Inspected/Dirty). Enforces readiness rules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Nav Tabs for Rooms */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 pb-2">
                {[
                  { id: 'grid', label: 'All Rooms (Floor Grid)', count: totalRooms },
                  { id: 'assignments', label: 'Room Assignments & Readiness', count: availableCleanRooms.length },
                  { id: 'blocked', label: 'Blocked & Maintenance', count: maintenanceRooms },
                ].map(sub => {
                  const active = roomsSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setRoomsSubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filters Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[160px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search room #..."
                      value={roomSearchQuery}
                      onChange={e => setRoomSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                    />
                  </div>

                  <select
                    value={roomFloorFilter}
                    onChange={e => setRoomFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 border rounded-xl font-medium"
                  >
                    <option value="all">All Floors</option>
                    <option value={1}>Floor 1</option>
                    <option value={2}>Floor 2</option>
                    <option value={3}>Floor 3</option>
                    <option value={4}>Floor 4</option>
                    <option value={5}>Floor 5</option>
                  </select>

                  <select
                    value={roomStatusFilter}
                    onChange={e => setRoomStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 border rounded-xl font-medium"
                  >
                    <option value="all">All Room States</option>
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                    <option value="blocked">Temporarily Blocked</option>
                    <option value="out_of_order">Out of Order</option>
                  </select>

                  <select
                    value={housekeepingFilter}
                    onChange={e => setHousekeepingFilter(e.target.value as any)}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 border rounded-xl font-medium"
                  >
                    <option value="all">All Housekeeping States</option>
                    <option value="ready">Clean & Inspected (Ready)</option>
                    <option value="clean">Clean</option>
                    <option value="inspected">Inspected</option>
                    <option value="dirty">Dirty (Needs Turnover)</option>
                    <option value="inspecting">Inspecting</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ready</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Occupied</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Dirty</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Blocked/OOO</span>
                </div>
              </div>

              {/* Room Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {roomList
                  .filter(r => {
                    if (roomsSubTab === 'blocked' && !(r.roomStatus === 'blocked' || r.roomStatus === 'out_of_order')) return false;
                    if (roomsSubTab === 'assignments' && r.roomStatus !== 'vacant') return false;
                    if (roomFloorFilter !== 'all' && r.floor !== roomFloorFilter) return false;
                    if (roomStatusFilter !== 'all' && r.roomStatus !== roomStatusFilter) return false;
                    if (housekeepingFilter === 'ready' && !(r.housekeepingStatus === 'clean' || r.housekeepingStatus === 'inspected')) return false;
                    if (housekeepingFilter !== 'all' && housekeepingFilter !== 'ready' && r.housekeepingStatus !== housekeepingFilter) return false;
                    if (!roomSearchQuery) return true;
                    return r.number.includes(roomSearchQuery) || r.type.toLowerCase().includes(roomSearchQuery.toLowerCase());
                  })
                  .map(room => {
                    const isReady = room.roomStatus === 'vacant' && (room.housekeepingStatus === 'clean' || room.housekeepingStatus === 'inspected');

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomForDetail(room)}
                        className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                          isReady ? 'border-emerald-200 dark:border-emerald-800' : room.roomStatus === 'occupied' ? 'border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                              Room #{room.number}
                            </span>
                            <p className="text-xs text-gray-500 font-medium">{room.type} · Floor {room.floor}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : room.roomStatus === 'occupied'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : room.roomStatus === 'blocked'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          }`}>
                            {isReady ? 'READY' : room.roomStatus.toUpperCase()}
                          </span>
                        </div>

                        {/* Separate Room & Housekeeping status display */}
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs space-y-1">
                          <div className="flex justify-between text-gray-500">
                            <span>Room State:</span>
                            <strong className="text-gray-900 dark:text-white capitalize">{room.roomStatus.replace('_', ' ')}</strong>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Housekeeping:</span>
                            <span className={`font-bold capitalize ${
                              room.housekeepingStatus === 'inspected' ? 'text-emerald-600' : room.housekeepingStatus === 'clean' ? 'text-teal-600' : 'text-red-500'
                            }`}>
                              {room.housekeepingStatus}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Rate / Night:</span>
                            <span className="font-bold text-gray-900 dark:text-white">${room.ratePerNight}</span>
                          </div>
                          {room.currentGuest && (
                            <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-semibold pt-1 border-t">
                              <span>In-House Guest:</span>
                              <span className="truncate max-w-[120px]">{room.currentGuest}</span>
                            </div>
                          )}
                          {room.blockReason && (
                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium pt-1">
                              ⚠️ {room.blockReason}
                            </p>
                          )}
                        </div>

                        {/* Quick action bar */}
                        <div className="mt-3 pt-2 border-t flex items-center justify-between gap-1 text-[11px]">
                          {room.roomStatus === 'blocked' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUnblockRoom(room); }}
                              className="text-purple-600 hover:underline font-bold"
                            >
                              Release Block
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomToBlock(room);
                                setIsBlockRoomOpen(true);
                              }}
                              className="text-gray-500 hover:text-purple-600 font-medium"
                            >
                              Block Room
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoomForDetail(room);
                            }}
                            className="text-indigo-600 hover:underline font-bold ml-auto"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: GUEST ARRIVAL & CHECK-IN DESK                     */}
          {/* ======================================================== */}
          {activeTab === 'checkin' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <DoorOpen className="w-5 h-5 text-emerald-600" />
                      Guest Arrival & Check-In Desk
                    </h2>
                    <p className="text-xs text-gray-500">
                      Retrieve reservations, verify identity, register additional occupants, verify room readiness, issue RFID keycards, and activate folio.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Scan className="w-3.5 h-3.5" /> ID Document OCR
                  </button>
                  <button
                    onClick={() => setIsWalkInOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    ⚡ Walk-In Guest
                  </button>
                </div>
              </div>

              {/* Sub-Nav Tabs for Check-In */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 pb-2">
                {[
                  { id: 'pending', label: "Today's Pending Arrivals", count: arrivalList.filter(a => a.status === 'pending').length },
                  { id: 'expected', label: "All Expected Today", count: arrivalList.length },
                  { id: 'completed', label: "Completed Check-Ins", count: arrivalList.filter(a => a.status === 'completed').length },
                ].map(sub => {
                  const active = checkInSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCheckInSubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find arrival by guest name, ref (LXP-...), phone, room type..."
                    value={checkInSearch}
                    onChange={e => setCheckInSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Ready Clean Rooms: <strong className="text-emerald-600 font-bold">{availableCleanRooms.length} available</strong>
                </div>
              </div>

              {/* Arrivals Cards */}
              <div className="grid grid-cols-1 gap-3">
                {arrivalList
                  .filter(arrival => {
                    if (checkInSubTab === 'pending' && arrival.status !== 'pending') return false;
                    if (checkInSubTab === 'completed' && arrival.status !== 'completed') return false;
                    if (!checkInSearch) return true;
                    const q = checkInSearch.toLowerCase();
                    return (
                      arrival.guestName.toLowerCase().includes(q) ||
                      arrival.bookingRef.toLowerCase().includes(q) ||
                      arrival.phone.toLowerCase().includes(q) ||
                      arrival.roomType.toLowerCase().includes(q)
                    );
                  })
                  .map(arrival => (
                    <div
                      key={arrival.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                          {arrival.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base">{arrival.guestName}</h3>
                            <span className="font-mono text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                              {arrival.bookingRef}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {arrival.roomType} · {arrival.nights} Nights · {arrival.adults} Guests · Tel: {arrival.phone}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Identity Checkpoint
                            </span>
                            <span className="text-[10px] text-gray-400">Scheduled: Today 15:00</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <StatusBadge status={arrival.status} />
                        {arrival.status === 'pending' ? (
                          <button
                            onClick={() => {
                              setCheckInModal(arrival);
                              setSelectedRoomNumber(availableCleanRooms[0]?.number || '');
                              setCheckInEarlyOverride(false);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                          >
                            <DoorOpen className="w-4 h-4" />
                            Process Check-In
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Checked In & Folio Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: GUEST STAY MANAGEMENT (IN-HOUSE RESIDENTS)        */}
          {/* ======================================================== */}
          {activeTab === 'stay-mgmt' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Guest Stay Management (In-House Residents)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Monitor currently staying guests, handle stay extensions, room transfers, early departures, late checkouts, additional occupants, and folios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Nav Tabs for Stay Management */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 pb-2">
                {[
                  { id: 'in-house', label: 'Currently Staying Residents', count: inHouseList.length },
                  { id: 'extensions', label: 'Stay Extensions & Changes', count: inHouseList.filter(r => r.notes.some(n => n.includes('extended') || n.includes('moved'))).length },
                  { id: 'folios', label: 'Folios & Outstanding Balances', count: inHouseList.length },
                ].map(sub => {
                  const active = staySubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setStaySubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* In-House Residents Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3">Room / Type</th>
                        <th className="px-4 py-3">Guest & Occupants</th>
                        <th className="px-4 py-3">Check-In → Expected Checkout</th>
                        <th className="px-4 py-3">Folio Charges & Payments</th>
                        <th className="px-4 py-3">Balance Due</th>
                        <th className="px-4 py-3">Special Status / Notes</th>
                        <th className="px-4 py-3 text-right">Stay Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
                      {inHouseList.map(res => {
                        const totalInc = res.incidentals.reduce((a, b) => a + b.amount, 0);
                        const taxes = Math.round((res.totalRoomCharges + totalInc) * 0.10);
                        const totalCharges = res.totalRoomCharges + totalInc + taxes;
                        const successfulPayments = res.payments.filter(p => p.status === 'successful').reduce((a, b) => a + b.amount, 0);
                        const balance = Math.max(0, totalCharges - successfulPayments);

                        return (
                          <tr key={res.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-mono text-base font-bold text-gray-900 dark:text-white block">
                                #{res.roomNumber}
                              </span>
                              <span className="text-[11px] text-gray-500 font-medium">{res.roomType}</span>
                              <span className="text-[10px] text-indigo-600 block mt-0.5">${res.roomRate}/night</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-gray-900 dark:text-white">{res.guestName}</p>
                                {res.vipStatus && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400">{res.phone}</p>
                              {res.additionalOccupants.length > 0 && (
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                                  Occupants: {res.additionalOccupants.map(o => o.name).join(', ')}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-gray-900 dark:text-white font-semibold">
                                {res.checkInDate} → {res.expectedCheckOut}
                              </p>
                              <span className="text-[10px] text-indigo-600 font-bold block">
                                {res.nights} Nights Total
                              </span>
                              {res.lateCheckOutGranted && (
                                <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                                  Late Checkout: {res.lateCheckOutGranted}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-gray-900 dark:text-white font-semibold">${totalCharges.toFixed(2)}</p>
                              <p className="text-[10px] text-gray-400">
                                Room: ${res.totalRoomCharges} · Incidentals: ${totalInc.toFixed(2)}
                              </p>
                              <p className="text-[10px] text-emerald-600 font-bold">
                                Paid: ${successfulPayments.toFixed(2)}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-bold ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                ${balance.toFixed(2)}
                              </span>
                              <span className={`block text-[10px] font-bold uppercase ${balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {balance > 0 ? 'Payment Due' : 'Folio Settled'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-[11px] text-gray-600 dark:text-gray-300 italic">
                                {res.notes[0] || 'No special requests'}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-wrap items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setExtendStayModal(res);
                                    setNewExtendCheckOut(new Date(new Date(res.expectedCheckOut).getTime() + 2 * 86400000).toISOString().split('T')[0]);
                                  }}
                                  title="Extend Stay (+2 Nights)"
                                  className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-bold"
                                >
                                  + Extend Stay
                                </button>
                                <button
                                  onClick={() => setTransferResident(res)}
                                  title="Execute Room Transfer & Audit"
                                  className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-lg text-[11px] font-bold"
                                >
                                  Room Transfer
                                </button>
                                <button
                                  onClick={() => {
                                    setAddServiceResident(res);
                                    setServiceDescription('');
                                    setServiceAmount('');
                                  }}
                                  title="Add Room Service / Incidental Charge"
                                  className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-lg text-[11px] font-bold"
                                >
                                  + Service
                                </button>
                                <button
                                  onClick={() => {
                                    setLateCheckOutResident(res);
                                    setLateCheckOutTime('14:00');
                                    setLateCheckOutFee(0);
                                  }}
                                  title="Grant Late Checkout"
                                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-bold"
                                >
                                  Late C/O
                                </button>
                                <button
                                  onClick={() => {
                                    setCheckOutModalResident(res);
                                    setIsKeyReturned(false);
                                  }}
                                  title="Settle Folio & Check-Out"
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs"
                                >
                                  Check-Out →
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: CHECK-OUT & FOLIO SETTLEMENT DESK                 */}
          {/* ======================================================== */}
          {activeTab === 'checkout' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <DoorClosed className="w-5 h-5 text-amber-600" />
                      Guest Check-Out & Folio Settlement Desk
                    </h2>
                    <p className="text-xs text-gray-500">
                      Verify all incidentals, room services & laundry, reconcile payments, validate zero balance, collect keycards, and release room to Housekeeping as DIRTY.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Nav Tabs for Check-Out */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 pb-2">
                {[
                  { id: 'departures', label: "Today's Departures Queue", count: departureList.filter(d => d.status === 'pending').length },
                  { id: 'pending', label: "All Pending Settlement", count: inHouseList.length },
                  { id: 'settled', label: "Settled & Released Today", count: departureList.filter(d => d.status === 'checked-out').length },
                ].map(sub => {
                  const active = checkOutSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCheckOutSubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find departing guest by name or room #..."
                    value={checkOutSearch}
                    onChange={e => setCheckOutSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Total Outstanding Across In-House: <strong className="text-red-600 font-bold">${totalBalanceDue.toLocaleString()}</strong>
                </div>
              </div>

              {/* In-House Guests Ready for Checkout */}
              <div className="grid grid-cols-1 gap-3">
                {inHouseList
                  .filter(res => {
                    if (!checkOutSearch) return true;
                    const q = checkOutSearch.toLowerCase();
                    return res.guestName.toLowerCase().includes(q) || res.roomNumber.includes(q);
                  })
                  .map(res => {
                    const totalInc = res.incidentals.reduce((a, b) => a + b.amount, 0);
                    const taxes = Math.round((res.totalRoomCharges + totalInc) * 0.10);
                    const totalBill = res.totalRoomCharges + totalInc + taxes;
                    const paid = res.payments.filter(p => p.status === 'successful').reduce((a, b) => a + b.amount, 0);
                    const bal = Math.max(0, totalBill - paid);

                    return (
                      <div
                        key={res.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                            {res.guestName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 dark:text-white text-base">{res.guestName}</h3>
                              <span className="font-bold text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200 font-mono">
                                Room #{res.roomNumber}
                              </span>
                              <span className="text-xs text-gray-400 font-mono">Ref: {res.resId}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {res.roomType} · {res.nights} Nights · Total Bill: <strong className="text-gray-900 dark:text-white font-bold">${totalBill.toFixed(2)}</strong> · Paid: <strong className="text-emerald-600 font-bold">${paid.toFixed(2)}</strong>
                            </p>
                            <p className="text-xs mt-1">
                              Outstanding Balance:{' '}
                              <strong className={bal > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                                ${bal.toFixed(2)}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <button
                            onClick={() => {
                              setCheckOutModalResident(res);
                              setIsKeyReturned(false);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                          >
                            <DoorClosed className="w-4 h-4" />
                            Open Folio & Check-Out
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: GUEST DIRECTORY & CRM (Parts A, B & C)            */}
          {/* ======================================================== */}
          {activeTab === 'search-crm' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Guest Directory & CRM (7-Criteria Search & 360° Profiles)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Search by Guest ID, Name, Phone, Email, Passport, National ID, or Loyalty Number. Inspect full profiles, preferences, past stays, and duplicate merges.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('registration' as any)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Register New Guest
                </button>
              </div>

              {/* 7-Criteria Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search across all criteria or select specific field..."
                      value={crmSearchQuery}
                      onChange={e => setCrmSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                    />
                  </div>

                  <select
                    value={crmSearchField}
                    onChange={e => setCrmSearchField(e.target.value as any)}
                    className="w-full md:w-auto px-3 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">Search All 7 Criteria</option>
                    <option value="id">1. Guest ID (e.g. G001)</option>
                    <option value="name">2. Full Name</option>
                    <option value="phone">3. Phone Number</option>
                    <option value="email">4. Email Address</option>
                    <option value="passport">5. Passport Number</option>
                    <option value="nationalId">6. National ID Number</option>
                    <option value="loyalty">7. Loyalty Membership Number</option>
                  </select>
                </div>
              </div>

              {/* Guest Profiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCrmGuests.map(guest => {
                  const isDuplicate = Boolean(guest.isDuplicateOf);

                  return (
                    <div
                      key={guest.id}
                      onClick={() => {
                        setSelectedGuest(guest);
                        setEditGuestPhone(guest.phone);
                        setEditGuestEmail(guest.email);
                        setEditGuestAddress(guest.address || '');
                        setEditGuestPreferences(guest.preferences.join(', '));
                        setIsEditingGuest(false);
                      }}
                      className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                        isDuplicate ? 'border-amber-400 dark:border-amber-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {isDuplicate && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Duplicate
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <img src={guest.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-gray-200" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                              {guest.firstName} {guest.middleName ? `${guest.middleName} ` : ''}{guest.lastName}
                            </h3>
                            {guest.vipStatus && (
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{guest.id}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs space-y-1 text-gray-600 dark:text-gray-300">
                        <p className="truncate"><span className="text-gray-400">Tel:</span> {guest.phone}</p>
                        <p className="truncate"><span className="text-gray-400">Email:</span> {guest.email}</p>
                        <p className="truncate"><span className="text-gray-400">ID ({guest.idType}):</span> {guest.idNumber || guest.passportNumber}</p>
                        <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
                          <span>{guest.totalStays} Stays · ${guest.totalSpend.toLocaleString()}</span>
                          <span className="text-indigo-600 font-bold">View 360° Profile →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: ID DOCUMENT SCANNER & OCR ENGINE (12 Features)     */}
          {/* ======================================================== */}
          {activeTab === 'scanner' && (() => {
            const isDocExpired = new Date(extractedData.idExpiryDate).getTime() < Date.now();
            const matchedBooking = reservationList.find(res =>
              res.guestName.toLowerCase().includes(extractedData.lastName.toLowerCase()) ||
              (extractedData.firstName && res.guestName.toLowerCase().includes(extractedData.firstName.toLowerCase()))
            );

            return (
              <div className="space-y-5 animate-fade-in">
                {/* Header with Back Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackTab}
                    title="Return to previous screen"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
                      <Scan className="w-5 h-5 text-indigo-600" />
                      Identity Document Scanner & OCR Engine (All 12 Capabilities)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Live camera capture, document upload, auto-OCR extraction, expiry certification, booking matching, and audit tracking.
                    </p>
                  </div>
                </div>

                {/* Hidden File Input for Real Document Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Input Source & Live Capture Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-4">
                      {/* Document Type Selector */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-gray-500">1. Document Type</span>
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl text-xs">
                          {(['Passport', 'National ID', 'Driver License'] as const).map(dt => (
                            <button
                              key={dt}
                              type="button"
                              onClick={() => handleSelectDocType(dt)}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                                selectedDocType === dt ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-xs' : 'text-gray-500'
                              }`}
                            >
                              {dt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input Mode Selector */}
                      <div className="flex items-center justify-between pt-2 border-t text-xs">
                        <span className="font-bold uppercase text-gray-500">2. Document Input</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              stopCamera();
                              setScannerMode('upload');
                              fileInputRef.current?.click();
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              scannerMode === 'upload' && !cameraActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload File
                          </button>
                          <button
                            type="button"
                            onClick={startCamera}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                              cameraActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" /> Live Camera
                          </button>
                        </div>
                      </div>

                      {/* Visual Document Preview Frame */}
                      <div className="relative rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 p-4 bg-gray-900 text-white overflow-hidden min-h-[240px] flex flex-col justify-between">
                        {isScanning && (
                          <div
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-30"
                            style={{ top: `${scanProgress}%`, transition: 'top 0.2s linear' }}
                          />
                        )}

                        <div className="flex justify-between items-center text-[11px] opacity-80 z-20">
                          <span className="font-mono uppercase">{selectedDocType} · OCR Engine v4.2</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" /> SECURE AUDIT CHECKPOINT
                          </span>
                        </div>

                        {/* View Mode 1: Live Camera Stream */}
                        {cameraActive ? (
                          <div className="my-3 relative rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-44 object-cover rounded-xl"
                            />
                            {cameraError && (
                              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-3 text-center text-xs text-amber-300">
                                <Camera className="w-8 h-8 mb-1 opacity-70" />
                                <span>{cameraError}</span>
                                <span className="text-[10px] text-gray-300 mt-1">Ready to simulate frame snapshot.</span>
                              </div>
                            )}
                            <div className="absolute inset-0 border-2 border-dashed border-cyan-400/60 rounded-xl pointer-events-none" />
                            <div className="absolute bottom-2 flex gap-2 z-10">
                              <button
                                type="button"
                                onClick={captureCameraFrame}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
                              >
                                <Camera className="w-3.5 h-3.5" /> Capture Snapshot & Run OCR
                              </button>
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="px-2 py-1.5 bg-gray-800/80 hover:bg-gray-800 text-white rounded-lg text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : uploadedDocImage ? (
                          /* View Mode 2: Uploaded Real File Preview */
                          <div className="my-3 relative rounded-xl overflow-hidden bg-black/50 p-2 flex flex-col items-center">
                            <img
                              src={uploadedDocImage}
                              alt="Uploaded Document"
                              className="max-h-40 object-contain rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => setUploadedDocImage(null)}
                              className="mt-2 text-[11px] text-gray-300 hover:text-white underline"
                            >
                              Clear & Switch to Standard Template
                            </button>
                          </div>
                        ) : (
                          /* View Mode 3: Template Graphic Preview */
                          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/15 my-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-white/20 rounded-lg flex items-center justify-center font-bold text-[10px] text-center uppercase tracking-wider text-gray-300 border border-white/20">
                                PHOTO
                              </div>
                              <div className="space-y-1 font-mono text-[11px] min-w-0">
                                <p className="font-bold text-amber-300 truncate">
                                  {docPresets[selectedDocType].mrz1}
                                </p>
                                <p className="text-gray-300 truncate font-bold">
                                  {extractedData.idNumber} · EXP: {extractedData.idExpiryDate}
                                </p>
                                <p className="text-gray-400 text-[10px]">
                                  DOB: {extractedData.dateOfBirth} · {extractedData.nationality}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono z-20">
                          <span>TOKEN: SEC-REF-SHA256-88F4</span>
                          <span>CONFIDENCE: {ocrConfidence}%</span>
                        </div>
                      </div>

                      {/* Scan Execution & Presets */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={isScanning}
                          onClick={handleScanId}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          {isScanning ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Scanning Document & Extracting OCR ({scanProgress}%)...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4" />
                              Run OCR Text Recognition
                            </>
                          )}
                        </button>

                        {/* Quick Preset Buttons for Instant Verification */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                          <span>Sample Demo Profiles:</span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectDocType('Passport')}
                              className="underline text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              US Passport
                            </button>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => handleSelectDocType('National ID')}
                              className="underline text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              French ID
                            </button>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => handleSelectDocType('Driver License')}
                              className="underline text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              CA Driver Lic
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Staff Review & OCR Form */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>Staff Review & Extracted OCR Data</span>
                            {ocrCompleted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                OCR Live Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-500">Correct any information before verifying and transferring to registration.</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          {ocrConfidence}% Confidence
                        </span>
                      </div>

                      {/* Demographic Fields */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">First Name</label>
                          <input
                            type="text"
                            value={extractedData.firstName}
                            onChange={e => setExtractedData({ ...extractedData, firstName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Middle Name</label>
                          <input
                            type="text"
                            value={extractedData.middleName}
                            onChange={e => setExtractedData({ ...extractedData, middleName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Last Name</label>
                          <input
                            type="text"
                            value={extractedData.lastName}
                            onChange={e => setExtractedData({ ...extractedData, lastName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      {/* ID Details & Expiry */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">ID Number</label>
                          <input
                            type="text"
                            value={extractedData.idNumber}
                            onChange={e => setExtractedData({ ...extractedData, idNumber: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Expiry Date</label>
                          <input
                            type="date"
                            value={extractedData.idExpiryDate}
                            onChange={e => setExtractedData({ ...extractedData, idExpiryDate: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Nationality</label>
                          <input
                            type="text"
                            value={extractedData.nationality}
                            onChange={e => setExtractedData({ ...extractedData, nationality: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Contact Email</label>
                          <input
                            type="email"
                            value={extractedData.email}
                            onChange={e => setExtractedData({ ...extractedData, email: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Contact Phone</label>
                          <input
                            type="tel"
                            value={extractedData.phone}
                            onChange={e => setExtractedData({ ...extractedData, phone: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Permanent Address</label>
                        <input
                          type="text"
                          value={extractedData.address}
                          onChange={e => setExtractedData({ ...extractedData, address: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                        />
                      </div>

                      {/* Expiry Certification Banner (Requirement 9) */}
                      {isDocExpired ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex items-center justify-between text-xs text-red-800 dark:text-red-200">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>
                              <strong>DOCUMENT EXPIRED ({extractedData.idExpiryDate}):</strong> Cannot be accepted for legal guest check-in. Request alternative identification.
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded font-bold">STATUS: REJECTED</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>
                              <strong>Document Expiry Certified:</strong> Valid through {extractedData.idExpiryDate}. Legally certified for guest accommodation.
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded font-bold text-emerald-800 dark:text-emerald-300">AUDIT: CERTIFIED</span>
                        </div>
                      )}

                      {/* Booking Match Verification (Requirement 10) */}
                      {matchedBooking ? (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
                          <div className="min-w-0 pr-3">
                            <p className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              Matched Booking: {matchedBooking.id} ({matchedBooking.guestName})
                            </p>
                            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                              Assigned Room #{matchedBooking.roomNumber || 'Pending'} · {matchedBooking.nights} Nights · Status: {matchedBooking.status}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('checkin');
                              addToast({
                                type: 'success',
                                title: 'Identity Verified Against Booking',
                                message: `Opening check-in console for ${matchedBooking.guestName} with certified ID documents.`,
                              });
                            }}
                            className="flex-shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Proceed to Check-In →
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                          <span>No existing booking under this name. Ready to proceed with New Registration or Fast Walk-In.</span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('walkin')}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-2"
                          >
                            Open Walk-In Desk →
                          </button>
                        </div>
                      )}

                      {/* Action Bar (Requirement 11) */}
                      <div className="flex flex-wrap justify-end gap-2 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => {
                            setExtractedData(docPresets[selectedDocType]);
                            setUploadedDocImage(null);
                            addToast({ type: 'info', title: 'Reset', message: 'OCR buffer cleared.' });
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold"
                        >
                          Reset Form
                        </button>
                        <button
                          type="button"
                          onClick={handlePushOcrToRegistration}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          1-Click Transfer to New Guest Registration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Verification Immutable Audit Trail (Requirement 12) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        12. Immutable Document Verification & Security Audit Trail
                      </h3>
                      <p className="text-xs text-gray-500">
                        Cryptographic ledger of all ID cards, passports, and driver's licenses verified at Terminal FD-01.
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      Duty Agent: <strong>{currentAgent.name}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Audit ID</th>
                          <th className="p-2.5">Timestamp</th>
                          <th className="p-2.5">Doc Type</th>
                          <th className="p-2.5">Document Number</th>
                          <th className="p-2.5">Guest Legal Name</th>
                          <th className="p-2.5">OCR Confidence</th>
                          <th className="p-2.5">Security Checksum</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {ocrAuditLog.map(audit => (
                          <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{audit.id}</td>
                            <td className="p-2.5 text-gray-500">{audit.timestamp}</td>
                            <td className="p-2.5 font-semibold text-gray-900 dark:text-white">{audit.docType}</td>
                            <td className="p-2.5 font-mono text-gray-600 dark:text-gray-300">{audit.docNumber}</td>
                            <td className="p-2.5 font-bold text-gray-900 dark:text-white">{audit.guestName}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                {audit.confidence}%
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[10px] text-gray-400">{audit.securityHash}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                audit.status === 'Verified & Accepted'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {audit.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* TAB 9: HOUSEKEEPING COORDINATION & OPERATIONAL VISIBILITY */}
          {/* ======================================================== */}
          {activeTab === 'housekeeping' && (
            <HousekeepingCoordination
              rooms={roomList}
              onBack={handleBackTab}
              onUpdateRoom={(roomNumber, updates) =>
                setRoomList(prev => prev.map(r => (r.number === roomNumber ? { ...r, ...updates } : r)))
              }
              onAddToast={addToast}
              onSimulateRoomReady={roomNumber => {
                addToast({
                  type: 'success',
                  title: '10. Room-Ready Alert',
                  message: `Room #${roomNumber} is certified Inspected and ready for guest arrival. Automated guest notification queued.`,
                });
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 10: MAINTENANCE COORDINATION & WORK ORDERS            */}
          {/* ======================================================== */}
          {activeTab === 'maintenance' && (
            <MaintenanceCoordination
              rooms={roomList}
              tickets={maintenanceTickets}
              onBack={handleBackTab}
              onAddTicket={t => setMaintenanceTickets(prev => [t, ...prev])}
              onUpdateTicket={(id, updates) =>
                setMaintenanceTickets(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
              }
              onUpdateRoom={(roomNumber, updates) =>
                setRoomList(prev => prev.map(r => (r.number === roomNumber ? { ...r, ...updates } : r)))
              }
              onAddToast={addToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 11: GUEST REQUESTS & SERVICE COORDINATION             */}
          {/* ======================================================== */}
          {activeTab === 'requests' && (
            <GuestServicesDesk
              tickets={serviceRequests}
              residents={inHouseList}
              onBack={handleBackTab}
              onAddTicket={t => setServiceRequests(prev => [t, ...prev])}
              onUpdateTicket={(id, updates) =>
                setServiceRequests(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
              }
              onAddToast={addToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 15: GUEST COMMUNICATIONS & NOTIFICATIONS              */}
          {/* ======================================================== */}
          {activeTab === 'comms' && (
            <GuestCommunications
              residents={inHouseList}
              guests={guestList}
              onBack={handleBackTab}
              onAddToast={addToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: NEW GUEST REGISTRATION (Part A: 14 Fields)           */}
          {/* ======================================================== */}
          {activeTab === 'registration' && (
            <NewGuestRegistration
              initialValues={ocrPushedData || undefined}
              onRegisterGuest={newGuest => {
                setGuestList(prev => [newGuest, ...prev]);
                setOcrPushedData(null);
              }}
              onNavigateToScanner={() => setActiveTab('scanner')}
              onNavigateToCrm={() => setActiveTab('search-crm')}
              onAddToast={addToast}
              onBack={handleBackTab}
              nextGuestId={`G00${guestList.length + 1}`}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 16: OPERATIONAL REPORTS & EXECUTIVE ANALYTICS         */}
          {/* ======================================================== */}
          {activeTab === 'reports' && (
            <FrontOfficeReports
              rooms={roomList}
              residents={inHouseList}
              reservations={reservationList}
              maintenanceTickets={maintenanceTickets}
              serviceRequests={serviceRequests}
              onBack={handleBackTab}
              onAddToast={addToast}
            />
          )}
        </div>
      </main>

      {/* 12. Room Transfer Modal (Immutable History & Supervisor Approval) */}
      <RoomTransferModal
        isOpen={Boolean(transferResident)}
        onClose={() => setTransferResident(null)}
        resident={transferResident}
        rooms={roomList}
        onExecuteTransfer={handleExecuteRoomTransfer}
        onAddToast={addToast}
      />

      {/* ============================================================ */}
      {/* 1. CREATE RESERVATION MODAL                                  */}
      {/* ============================================================ */}
      <Modal isOpen={isNewResOpen} onClose={() => setIsNewResOpen(false)} title="Create Guest Reservation">
        <form onSubmit={handleCreateReservation} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Primary Guest Full Name *</label>
              <input
                type="text"
                required
                value={resGuestName}
                onChange={e => setResGuestName(e.target.value)}
                placeholder="e.g. Jonathan Hayes"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={resEmail}
                onChange={e => setResEmail(e.target.value)}
                placeholder="j.hayes@example.com"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Primary Phone Number</label>
              <input
                type="tel"
                value={resPhone}
                onChange={e => setResPhone(e.target.value)}
                placeholder="+1 555-0144"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Check-In Date *</label>
              <input
                type="date"
                required
                value={resCheckIn}
                onChange={e => setResCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Check-Out Date *</label>
              <input
                type="date"
                required
                value={resCheckOut}
                onChange={e => setResCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Room Category *</label>
              <select
                value={resRoomType}
                onChange={e => setResRoomType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="Deluxe Suite">Deluxe Suite ($350/nt)</option>
                <option value="Executive King">Executive King ($280/nt)</option>
                <option value="Ocean View Villa">Ocean View Villa ($600/nt)</option>
                <option value="Standard Queen">Standard Queen ($180/nt)</option>
                <option value="Family Suite">Family Suite ($420/nt)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Assign Clean Room</label>
              <select
                value={resRoomNumber}
                onChange={e => setResRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="">Auto-assign or at Check-in</option>
                {availableCleanRooms.map(r => (
                  <option key={r.id} value={r.number}>Room #{r.number} — {r.type} (Floor {r.floor})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Occupants (Adults / Children)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={resAdults}
                  onChange={e => setResAdults(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={resChildren}
                  onChange={e => setResChildren(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Booking Source *</label>
              <select
                value={resSource}
                onChange={e => setResSource(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-medium"
              >
                <option value="Direct">Direct Front Desk</option>
                <option value="Phone">Phone Call Inquiry</option>
                <option value="Walk-in">Walk-In Reception</option>
                <option value="Booking.com">Booking.com</option>
                <option value="Expedia">Expedia</option>
                <option value="OTA">Corporate Travel Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Deposit Payment Status</label>
              <select
                value={resDepositStatus}
                onChange={e => setResDepositStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-medium"
              >
                <option value="deposit">50% Deposit Collected</option>
                <option value="paid">Fully Paid In Advance</option>
                <option value="pending">Pay on Arrival at Property</option>
              </select>
            </div>
          </div>

          {/* Group code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Group Booking Code (Optional)</label>
              <input
                type="text"
                value={resGroupCode}
                onChange={e => setResGroupCode(e.target.value)}
                placeholder="e.g. GRP-2026-WEDDING"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Special Booking Requests</label>
              <input
                type="text"
                value={resSpecialRequests}
                onChange={e => setResSpecialRequests(e.target.value)}
                placeholder="e.g. Feather-free pillows, quiet high floor, anniversary..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Additional Occupants Manager */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 space-y-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
              Multi-Guest Support: Additional Occupants ({resAdditionalOccupants.length})
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Occupant full name..."
                value={newOccupantName}
                onChange={e => setNewOccupantName(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white dark:bg-gray-700 border rounded-lg text-xs"
              />
              <select
                value={newOccupantRel}
                onChange={e => setNewOccupantRel(e.target.value)}
                className="px-2.5 py-1.5 bg-white dark:bg-gray-700 border rounded-lg text-xs"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Colleague">Colleague</option>
                <option value="Guest">Guest</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (newOccupantName.trim()) {
                    setResAdditionalOccupants(prev => [...prev, { name: newOccupantName.trim(), relationship: newOccupantRel }]);
                    setNewOccupantName('');
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                + Add Occupant
              </button>
            </div>
            {resAdditionalOccupants.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resAdditionalOccupants.map((occ, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium flex items-center gap-1 border">
                    {occ.name} ({occ.relationship})
                    <button type="button" onClick={() => setResAdditionalOccupants(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={() => setIsNewResOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">
              Confirm & Create Reservation
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* 2. RESERVATION DETAILS & CONFIRMATION VOUCHER MODAL          */}
      {/* ============================================================ */}
      <Modal isOpen={!!selectedResForDetail} onClose={() => setSelectedResForDetail(null)} title="Reservation Details & Confirmation Voucher">
        {selectedResForDetail && (
          <div className="p-6 space-y-4">
            <div className="bg-white dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white font-serif">{config.name}</h3>
                  <p className="text-xs text-gray-500">{config.address} · Tel: {config.phone}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg">
                    {selectedResForDetail.bookingRef}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{selectedResForDetail.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Primary Guest</span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedResForDetail.guestName}</p>
                  <p className="text-gray-500">{selectedResForDetail.adults} Adults · Source: {selectedResForDetail.bookingSource}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned Room</span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedResForDetail.roomType}</p>
                  <p className="text-gray-500 font-mono">Room #{selectedResForDetail.roomNumber || 'At Check-In'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Check-In Date</span>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedResForDetail.checkIn}</p>
                  <p className="text-gray-500">From 15:00 hrs</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Check-Out Date</span>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedResForDetail.checkOut}</p>
                  <p className="text-gray-500">Until 11:00 hrs ({selectedResForDetail.nights} Nights)</p>
                </div>
              </div>

              {selectedResForDetail.additionalOccupants && selectedResForDetail.additionalOccupants.length > 0 && (
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Additional Registered Occupants:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedResForDetail.additionalOccupants.map(o => (
                      <span key={o.id} className="font-medium text-gray-800 dark:text-gray-200">
                        • {o.name} ({o.relationship})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-500">Total Accommodation Charges</p>
                  <p className="text-[11px] text-gray-400">Special Requests: {selectedResForDetail.specialRequests || 'None'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">${selectedResForDetail.totalAmount}</span>
                  <span className="block text-[10px] font-bold text-emerald-600">
                    PAYMENT: {selectedResForDetail.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Barcode Simulation */}
              <div className="pt-1 text-center">
                <div className="h-8 w-44 mx-auto bg-repeat-x opacity-70 dark:invert" style={{
                  backgroundImage: 'repeating-linear-gradient(to right, #000 0, #000 2px, transparent 2px, transparent 5px, #000 5px, #000 8px, transparent 8px, transparent 10px)'
                }} />
                <p className="text-[9px] font-mono text-gray-400 mt-0.5">{selectedResForDetail.bookingRef} · VERIFIED OFFICIAL VOUCHER</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  addToast({ type: 'info', title: 'Voucher Printed', message: `Confirmation voucher for ${selectedResForDetail.bookingRef} sent to printer.` });
                  setSelectedResForDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" /> Print Confirmation Voucher
              </button>
              <button
                onClick={() => setSelectedResForDetail(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 3. MODIFY RESERVATION MODAL                                  */}
      {/* ============================================================ */}
      <Modal isOpen={!!selectedResForModify} onClose={() => setSelectedResForModify(null)} title="Modify Reservation Details">
        {selectedResForModify && (
          <form onSubmit={handleModifyReservation} className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 dark:text-white">Ref: {selectedResForModify.bookingRef}</span>
              <span className="text-gray-500">Guest: {selectedResForModify.guestName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Check-In Date</label>
                <input
                  type="date"
                  value={selectedResForModify.checkIn}
                  onChange={e => setSelectedResForModify({ ...selectedResForModify, checkIn: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Check-Out Date</label>
                <input
                  type="date"
                  value={selectedResForModify.checkOut}
                  onChange={e => setSelectedResForModify({ ...selectedResForModify, checkOut: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Room Category</label>
                <select
                  value={selectedResForModify.roomType}
                  onChange={e => setSelectedResForModify({ ...selectedResForModify, roomType: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive King">Executive King</option>
                  <option value="Ocean View Villa">Ocean View Villa</option>
                  <option value="Standard Queen">Standard Queen</option>
                  <option value="Family Suite">Family Suite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Assigned Room</label>
                <select
                  value={selectedResForModify.roomNumber}
                  onChange={e => setSelectedResForModify({ ...selectedResForModify, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="">Unassigned</option>
                  {availableCleanRooms.map(r => (
                    <option key={r.id} value={r.number}>Room #{r.number} — {r.type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Special Requests</label>
              <input
                type="text"
                value={selectedResForModify.specialRequests}
                onChange={e => setSelectedResForModify({ ...selectedResForModify, specialRequests: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setSelectedResForModify(null)} className="px-4 py-2 border rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">
                Save Modifications
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 4. CANCEL RESERVATION MODAL                                  */}
      {/* ============================================================ */}
      <Modal isOpen={!!selectedResForCancel} onClose={() => setSelectedResForCancel(null)} title="Cancel Reservation According to Policy">
        {selectedResForCancel && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 text-xs space-y-1">
              <p className="font-bold text-red-900 dark:text-red-300">
                Cancel Booking {selectedResForCancel.bookingRef}?
              </p>
              <p className="text-red-700 dark:text-red-400">
                Guest: {selectedResForCancel.guestName} · {selectedResForCancel.roomType} · {selectedResForCancel.nights} Nights
              </p>
              <p className="text-gray-500 pt-1">
                Room #{selectedResForCancel.roomNumber || 'assigned'} will immediately be released back to available inventory.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Cancellation Policy</label>
                <select
                  value={cancelPolicy}
                  onChange={e => setCancelPolicy(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border rounded-xl"
                >
                  <option value="standard_48h">Standard (Free &gt; 48h, 1-Night &lt; 48h)</option>
                  <option value="non_refundable">Non-Refundable (100% Retained)</option>
                  <option value="flexible_same_day">Flexible (Free until 14:00 Day-of)</option>
                  <option value="force_majeure">Force Majeure / Emergency (Full Refund)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border rounded-xl"
                >
                  <option value="Guest requested cancellation due to travel plan change">Travel schedule change</option>
                  <option value="Flight cancellation / Travel disruption">Flight cancellation</option>
                  <option value="Duplicate booking detected">Duplicate booking</option>
                  <option value="Personal emergency">Personal emergency</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setSelectedResForCancel(null)} className="px-4 py-2 border rounded-xl text-xs font-semibold">
                Keep Reservation
              </button>
              <button
                onClick={handleCancelReservation}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Confirm Cancellation & Release Room
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 5. ROOM DETAIL & READINESS MODAL                             */}
      {/* ============================================================ */}
      <Modal isOpen={!!selectedRoomForDetail} onClose={() => setSelectedRoomForDetail(null)} title="Room Inspection & Assignment Details">
        {selectedRoomForDetail && (() => {
          const isReady = selectedRoomForDetail.roomStatus === 'vacant' && (selectedRoomForDetail.housekeepingStatus === 'clean' || selectedRoomForDetail.housekeepingStatus === 'inspected');

          return (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white font-serif">
                    Room #{selectedRoomForDetail.number} — {selectedRoomForDetail.type}
                  </h3>
                  <p className="text-xs text-gray-500">Floor {selectedRoomForDetail.floor} · Capacity: {selectedRoomForDetail.capacity} Guests · ${selectedRoomForDetail.ratePerNight}/Night</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isReady ? 'READY FOR CHECK-IN' : 'NOT READY'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Front Office Room Status</span>
                  <p className="font-bold text-gray-900 dark:text-white capitalize">{selectedRoomForDetail.roomStatus.replace('_', ' ')}</p>
                  {selectedRoomForDetail.currentGuest && (
                    <p className="text-indigo-600 font-semibold">Guest: {selectedRoomForDetail.currentGuest}</p>
                  )}
                </div>
                <div className="p-3 border rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Housekeeping Status</span>
                  <p className={`font-bold capitalize ${selectedRoomForDetail.housekeepingStatus === 'inspected' ? 'text-emerald-600' : selectedRoomForDetail.housekeepingStatus === 'clean' ? 'text-teal-600' : 'text-red-500'}`}>
                    {selectedRoomForDetail.housekeepingStatus}
                  </p>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => {
                        setRoomList(prev => prev.map(r => r.id === selectedRoomForDetail.id ? { ...r, housekeepingStatus: 'inspected' } : r));
                        addToast({ type: 'success', title: 'Room Inspected', message: `Room #${selectedRoomForDetail.number} marked Inspected & Ready.` });
                        setSelectedRoomForDetail(null);
                      }}
                      className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold"
                    >
                      Mark Inspected
                    </button>
                    <button
                      onClick={() => {
                        setRoomList(prev => prev.map(r => r.id === selectedRoomForDetail.id ? { ...r, housekeepingStatus: 'dirty' } : r));
                        addToast({ type: 'warning', title: 'Room Dirty', message: `Room #${selectedRoomForDetail.number} marked Dirty for turnover.` });
                        setSelectedRoomForDetail(null);
                      }}
                      className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold"
                    >
                      Mark Dirty
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button onClick={() => setSelectedRoomForDetail(null)} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Done
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ============================================================ */}
      {/* 6. BLOCK ROOM MODAL                                          */}
      {/* ============================================================ */}
      <Modal isOpen={isBlockRoomOpen} onClose={() => setIsBlockRoomOpen(false)} title="Temporarily Block Room">
        <form onSubmit={handleBlockRoomSubmit} className="p-6 space-y-4">
          <p className="text-xs text-gray-500">
            Blocking Room #{roomToBlock?.number} temporarily prevents assignment to reservations or walk-ins.
          </p>

          <div>
            <label className="block text-xs font-semibold mb-1">Reason for Blocking *</label>
            <input
              type="text"
              required
              value={blockReasonInput}
              onChange={e => setBlockReasonInput(e.target.value)}
              placeholder="e.g. VIP Diplomatic Delegation Hold / Deep Maintenance"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Release Date *</label>
            <input
              type="date"
              required
              value={blockReleaseInput}
              onChange={e => setBlockReleaseInput(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={() => setIsBlockRoomOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md">
              Confirm Block
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* 7. ROOM UPGRADE MODAL                                        */}
      {/* ============================================================ */}
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} title="Execute Authorized Room Upgrade">
        <form onSubmit={handleUpgradeRoomSubmit} className="p-6 space-y-4">
          {residentToUpgrade && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
              <p className="font-bold text-gray-900 dark:text-white">{residentToUpgrade.guestName}</p>
              <p className="text-gray-500">Current Room #{residentToUpgrade.roomNumber} ({residentToUpgrade.roomType})</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Target Clean Room *</label>
              <select
                required
                value={upgradeTargetRoom}
                onChange={e => setUpgradeTargetRoom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="">Select available room...</option>
                {availableCleanRooms.map(r => (
                  <option key={r.id} value={r.number}>Room #{r.number} — {r.type} (${r.ratePerNight}/nt)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Upgrade Fee / Night ($)</label>
              <input
                type="number"
                value={upgradeFee}
                onChange={e => setUpgradeFee(Number(e.target.value))}
                placeholder="0 for complimentary"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Supervisor Authorization Passcode / Code *</label>
            <input
              type="password"
              required
              value={upgradeAuthCode}
              onChange={e => setUpgradeAuthCode(e.target.value)}
              placeholder="e.g. MGR-8891"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={() => setIsUpgradeModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">
              Authorize & Apply Upgrade
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* 8. CHECK-IN MODAL (With Room Readiness Business Rule)        */}
      {/* ============================================================ */}
      <Modal isOpen={!!checkInModal} onClose={() => setCheckInModal(null)} title="Process Guest Arrival & Check-In">
        {checkInModal && (() => {
          const assignedRoom = roomList.find(r => r.number === selectedRoomNumber);
          const isReady = assignedRoom && assignedRoom.roomStatus === 'vacant' && (assignedRoom.housekeepingStatus === 'clean' || assignedRoom.housekeepingStatus === 'inspected');

          return (
            <div className="p-6 space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white font-serif">{checkInModal.guestName}</p>
                  <p className="text-xs text-gray-500">Ref: {checkInModal.bookingRef} · {checkInModal.roomType} · {checkInModal.nights} Nights</p>
                </div>
                <span className="font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                  ARRIVING TODAY
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Assign Ready Clean / Inspected Room *
                </label>
                <select
                  required
                  value={selectedRoomNumber}
                  onChange={e => setSelectedRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-semibold"
                >
                  <option value="">Select an available room...</option>
                  {roomList.filter(r => r.roomStatus === 'vacant').map(r => (
                    <option key={r.id} value={r.number}>
                      Room #{r.number} — {r.type} (Floor {r.floor}, HK: {r.housekeepingStatus.toUpperCase()}) {r.housekeepingStatus === 'clean' || r.housekeepingStatus === 'inspected' ? '✓ READY' : '⚠️ NOT READY'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Readiness Warning if Dirty */}
              {assignedRoom && !isReady && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs space-y-1.5">
                  <p className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Important Business Rule: Room #{assignedRoom.number} is NOT READY!
                  </p>
                  <p className="text-red-700 dark:text-red-400">
                    Housekeeping status is <strong>{assignedRoom.housekeepingStatus.toUpperCase()}</strong>. A guest cannot be checked in until cleaned and inspected, unless an explicit manager exception is authorized.
                  </p>
                  <label className="flex items-center gap-2 pt-1 font-semibold text-red-800 dark:text-red-300">
                    <input
                      type="checkbox"
                      checked={checkInEarlyOverride}
                      onChange={e => setCheckInEarlyOverride(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span>Authorize manager emergency override to check-in early</span>
                  </label>
                </div>
              )}

              {/* Multi-Occupants Registration */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider block">Register Additional Occupants ({checkInOccupants.length}):</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Accompanying guest name..."
                    value={checkInNewOccName}
                    onChange={e => setCheckInNewOccName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-gray-700 border rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (checkInNewOccName.trim()) {
                        setCheckInOccupants(prev => [...prev, { name: checkInNewOccName.trim(), relationship: 'Guest' }]);
                        setCheckInNewOccName('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    + Add
                  </button>
                </div>
                {checkInOccupants.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {checkInOccupants.map((occ, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[11px] font-medium flex items-center gap-1">
                        {occ.name}
                        <button type="button" onClick={() => setCheckInOccupants(prev => prev.filter((_, i) => i !== idx))} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={idVerified}
                    onChange={e => setIdVerified(e.target.checked)}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span>Physical Passport / National ID inspected & validated</span>
                </label>
                <div className="flex items-center justify-between">
                  <span>Program RFID Keycards:</span>
                  <select
                    value={keycardsCount}
                    onChange={e => setKeycardsCount(Number(e.target.value))}
                    className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border rounded text-xs"
                  >
                    <option value={1}>1 Keycard</option>
                    <option value={2}>2 Keycards</option>
                    <option value={3}>3 Keycards</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button onClick={() => setCheckInModal(null)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Cancel</button>
                <button
                  disabled={!selectedRoomNumber || (!isReady && !checkInEarlyOverride)}
                  onClick={handleCheckIn}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <DoorOpen className="w-4 h-4" />
                  Activate Folio & Complete Check-In
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ============================================================ */}
      {/* 9. FAST WALK-IN MODAL                                        */}
      {/* ============================================================ */}
      <Modal isOpen={isWalkInOpen} onClose={() => setIsWalkInOpen(false)} title="Fast Walk-In Registration & Check-In">
        <form onSubmit={handleWalkIn} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                value={walkInName}
                onChange={e => setWalkInName(e.target.value)}
                placeholder="e.g. David Sterling"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Contact Phone</label>
              <input
                type="tel"
                value={walkInPhone}
                onChange={e => setWalkInPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Assign Clean Room *</label>
              <select
                required
                value={walkInRoom}
                onChange={e => setWalkInRoom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="">Select clean room...</option>
                {availableCleanRooms.map(r => (
                  <option key={r.id} value={r.number}>Room #{r.number} (${r.ratePerNight}/nt) — {r.type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Nights</label>
              <input
                type="number"
                min={1}
                max={30}
                value={walkInNights}
                onChange={e => setWalkInNights(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={() => setIsWalkInOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md">
              Complete Walk-In Check-In
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* 10. EXTEND STAY MODAL                                        */}
      {/* ============================================================ */}
      <Modal isOpen={!!extendStayModal} onClose={() => setExtendStayModal(null)} title="Extend Resident Stay">
        {extendStayModal && (
          <form onSubmit={handleExtendStaySubmit} className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-1">
              <p className="font-bold text-gray-900 dark:text-white">{extendStayModal.guestName} · Room #{extendStayModal.roomNumber}</p>
              <p className="text-gray-500">Current Departure: <strong>{extendStayModal.expectedCheckOut}</strong> ({extendStayModal.nights} nights total)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">New Departure Date *</label>
              <input
                type="date"
                required
                value={newExtendCheckOut}
                onChange={e => setNewExtendCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setExtendStayModal(null)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">
                Confirm Stay Extension
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 11. ROOM MOVE MODAL                                          */}
      {/* ============================================================ */}
      <Modal isOpen={!!roomMoveResident} onClose={() => setRoomMoveResident(null)} title="Execute Resident Room Move">
        {roomMoveResident && (
          <form onSubmit={handleRoomMoveSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
              <p className="font-bold text-gray-900 dark:text-white">{roomMoveResident.guestName}</p>
              <p className="text-gray-500">Moving from Room #{roomMoveResident.roomNumber} ({roomMoveResident.roomType})</p>
              <p className="text-red-500 font-semibold pt-1">* Room #{roomMoveResident.roomNumber} will automatically be marked DIRTY for Housekeeping.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Destination Clean Room *</label>
                <select
                  required
                  value={roomMoveTarget}
                  onChange={e => setRoomMoveTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="">Select clean room...</option>
                  {availableCleanRooms.map(r => (
                    <option key={r.id} value={r.number}>Room #{r.number} — {r.type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Reason for Move *</label>
                <select
                  value={roomMoveReason}
                  onChange={e => setRoomMoveReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="Guest requested quieter room">Guest requested quieter room</option>
                  <option value="AC / HVAC malfunction in room">AC / HVAC issue</option>
                  <option value="Plumbing maintenance requirement">Plumbing issue</option>
                  <option value="Room upgrade courtesy">Room upgrade courtesy</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setRoomMoveResident(null)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md">
                Execute Move & Release Old Room
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 12. LATE CHECKOUT MODAL                                      */}
      {/* ============================================================ */}
      <Modal isOpen={!!lateCheckOutResident} onClose={() => setLateCheckOutResident(null)} title="Grant Late Check-Out">
        {lateCheckOutResident && (
          <form onSubmit={handleLateCheckOutSubmit} className="p-6 space-y-4">
            <p className="text-xs text-gray-500">
              Extend standard departure time (11:00) for {lateCheckOutResident.guestName} (Room #{lateCheckOutResident.roomNumber}).
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Requested Departure Time *</label>
                <select
                  value={lateCheckOutTime}
                  onChange={e => setLateCheckOutTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="13:00">13:00 hrs (+2 hours)</option>
                  <option value="14:00">14:00 hrs (+3 hours)</option>
                  <option value="16:00">16:00 hrs (+5 hours)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Late Checkout Fee ($)</label>
                <input
                  type="number"
                  value={lateCheckOutFee}
                  onChange={e => setLateCheckOutFee(Number(e.target.value))}
                  placeholder="0 for complimentary VIP waiver"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setLateCheckOutResident(null)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md">
                Approve Late Checkout
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 13. ADD INCIDENTALS / SERVICE CHARGES MODAL                  */}
      {/* ============================================================ */}
      <Modal isOpen={!!addServiceResident} onClose={() => setAddServiceResident(null)} title="Post Incidental Charge to Folio">
        {addServiceResident && (
          <form onSubmit={handleAddIncidentalsSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
              <p className="font-bold text-gray-900 dark:text-white">{addServiceResident.guestName} · Room #{addServiceResident.roomNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Service Category</label>
                <select
                  value={serviceCategory}
                  onChange={e => setServiceCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                >
                  <option value="F&B">In-Room Dining / Restaurant</option>
                  <option value="Minibar">Minibar Refreshment</option>
                  <option value="Spa">Spa & Wellness</option>
                  <option value="Laundry">Valet & Dry Cleaning</option>
                  <option value="Transport">Airport Shuttle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={serviceAmount}
                  onChange={e => setServiceAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 65.00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Item Description *</label>
              <input
                type="text"
                required
                value={serviceDescription}
                onChange={e => setServiceDescription(e.target.value)}
                placeholder="e.g. Prime Ribeye Steak & Vintage Red Wine"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onClick={() => setAddServiceResident(null)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md">
                Post Charge to Folio
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 14. COMPREHENSIVE CHECK-OUT & FOLIO SETTLEMENT MODAL         */}
      {/* ============================================================ */}
      <Modal isOpen={!!checkOutModalResident} onClose={() => setCheckOutModalResident(null)} title="Guest Check-Out & Final Folio Settlement">
        {checkOutModalResident && (() => {
          const roomCharges = checkOutModalResident.totalRoomCharges;
          const incidentalsTotal = checkOutModalResident.incidentals.reduce((a, b) => a + b.amount, 0);
          const taxes = Math.round((roomCharges + incidentalsTotal) * 0.10);
          const totalCharges = roomCharges + incidentalsTotal + taxes;
          const successfulPayments = checkOutModalResident.payments.filter(p => p.status === 'successful').reduce((a, b) => a + b.amount, 0);
          const outstandingBalance = Math.max(0, totalCharges - successfulPayments);

          return (
            <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
              {/* Part A: Comprehensive Accommodation & Stay Details */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-gray-900 dark:text-white font-serif">{checkOutModalResident.guestName}</p>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-mono">
                      Room #{checkOutModalResident.roomNumber}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ref: {checkOutModalResident.resId} · {checkOutModalResident.roomType} · Check-In: {checkOutModalResident.checkInDate} {checkOutModalResident.checkInTime}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Expected: {checkOutModalResident.expectedCheckOut} · Actual Checkout: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({checkOutModalResident.nights} Nights)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase font-bold block">Outstanding Balance</span>
                  <span className={`text-2xl font-bold ${outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${outstandingBalance.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 block">Total: ${totalCharges.toFixed(2)}</span>
                </div>
              </div>

              {/* Itemized Folio Breakdown */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/60 font-bold text-gray-600 dark:text-gray-300 flex justify-between">
                  <span>Itemized Charges & Services</span>
                  <span>Amount ($)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>Room Accommodation Charges ({checkOutModalResident.nights} nights @ ${checkOutModalResident.roomRate}/nt)</span>
                  <span className="font-bold">${roomCharges.toFixed(2)}</span>
                </div>
                {checkOutModalResident.incidentals.map(inc => (
                  <div key={inc.id} className="p-2.5 flex justify-between text-gray-600 dark:text-gray-300">
                    <span>[{inc.category}] {inc.description} ({inc.date})</span>
                    <span className="font-semibold">${inc.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="p-2.5 flex justify-between text-gray-500">
                  <span>Hospitality Tax & State Tourism Levy (10%)</span>
                  <span>+${taxes.toFixed(2)}</span>
                </div>
                <div className="p-2.5 flex justify-between font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/30">
                  <span>Total Charges Folio</span>
                  <span>${totalCharges.toFixed(2)}</span>
                </div>
              </div>

              {/* Previous Payments Ledger */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 block">
                  Payment History & Credits ({checkOutModalResident.payments.length})
                </span>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                  {checkOutModalResident.payments.map(p => (
                    <div key={p.id} className="p-2 flex items-center justify-between text-emerald-600">
                      <span>✓ {p.method} ({p.date}) — Ref: {p.ref}</span>
                      <span className="font-bold">-${p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Processing Form (Parts B, C & D) */}
              {outstandingBalance > 0.01 && (
                <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      Process Payment to Settle Balance (${outstandingBalance.toFixed(2)})
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaymentAmountInput(outstandingBalance)}
                      className="text-[11px] font-bold text-indigo-600 underline"
                    >
                      Fill Full Balance
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Payment Method</label>
                      <select
                        value={paymentMethodSelected}
                        onChange={e => setPaymentMethodSelected(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-700 border rounded-lg text-xs"
                      >
                        <option value="Credit Card">Credit Card (EMV/Contactless)</option>
                        <option value="Cash">Cash at Reception</option>
                        <option value="Bank Transfer">Bank Wire Transfer</option>
                        <option value="Apple Pay">Apple Pay / Mobile Wallet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Payment Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={paymentAmountInput}
                        onChange={e => setPaymentAmountInput(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder={`e.g. ${outstandingBalance.toFixed(2)}`}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-700 border rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (paymentAmountInput && Number(paymentAmountInput) > 0) {
                            handleRecordPayment(checkOutModalResident.id, Number(paymentAmountInput), paymentMethodSelected, paymentRefInput);
                          }
                        }}
                        className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Authorize & Settle
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation & Keycards Return Confirmation (Part D) */}
              <div className="pt-2 border-t space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={isKeyReturned}
                    onChange={e => setIsKeyReturned(e.target.checked)}
                    className="rounded text-amber-600 w-4 h-4"
                  />
                  <span>All physical RFID access keycards retrieved and verified</span>
                </label>
                <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                  * Critical Rule: Room #{checkOutModalResident.roomNumber} will automatically transition to <strong>DIRTY</strong> for Housekeeping. It is not available for guests until cleaned & inspected.
                </p>
              </div>

              {/* Actions (Part E) */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button onClick={() => setCheckOutModalResident(null)} className="px-4 py-2 border rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button
                  disabled={outstandingBalance > 0.01 || !isKeyReturned}
                  onClick={() => handleFinalCheckOut(checkOutModalResident)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <DoorClosed className="w-4 h-4" />
                  Complete Final Check-Out & Release Room
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ============================================================ */}
      {/* 15. FINAL INVOICE SUCCESS MODAL                              */}
      {/* ============================================================ */}
      <Modal isOpen={!!invoiceSuccessModal} onClose={() => setInvoiceSuccessModal(null)} title="Final Invoice & Folio Settlement Receipt">
        {invoiceSuccessModal && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">Stay Completed & Folio Finalized</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Guest: <strong>{invoiceSuccessModal.resident.guestName}</strong> · Room #{invoiceSuccessModal.resident.roomNumber}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Final Settled Bill: <strong>${invoiceSuccessModal.finalBill.toFixed(2)}</strong> · Ref: <strong>{invoiceSuccessModal.txRef}</strong>
              </p>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                ✓ Room #{invoiceSuccessModal.resident.roomNumber} successfully released to Housekeeping as DIRTY.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  addToast({ type: 'info', title: 'Invoice Printed', message: 'Final tax invoice sent to desk printer.' });
                  setInvoiceSuccessModal(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
              </button>
              <button
                onClick={() => {
                  addToast({ type: 'success', title: 'Invoice Emailed', message: `Final invoice emailed to ${invoiceSuccessModal.resident.email}.` });
                  setInvoiceSuccessModal(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                <Mail className="w-3.5 h-3.5" /> Email to Guest
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 16. LOG SERVICE REQUEST / COMPLAINT MODAL                    */}
      {/* ============================================================ */}
      <Modal isOpen={isNewComplaintOpen} onClose={() => setIsNewComplaintOpen(false)} title="Log Complaint or Service Request">
        <form onSubmit={handleCreateComplaint} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Room #</label>
              <select
                value={compRoom}
                onChange={e => setCompRoom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                {roomList.map(r => (
                  <option key={r.id} value={r.number}>Room #{r.number} {r.currentGuest ? `(${r.currentGuest})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Target Department *</label>
              <select
                value={compDept}
                onChange={e => setCompDept(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="Maintenance">Maintenance (Engineering)</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="F&B">F&B / In-Room Dining</option>
                <option value="Front Desk">Front Desk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <input
                type="text"
                value={compCategory}
                onChange={e => setCompCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Urgency / SLA</label>
              <select
                value={compUrgency}
                onChange={e => setCompUrgency(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
              >
                <option value="critical">Critical (Immediate SLA)</option>
                <option value="high">High Priority</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={compDesc}
              onChange={e => setCompDesc(e.target.value)}
              placeholder="e.g. AC unit in room not cooling; technician required ASAP..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={() => setIsNewComplaintOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md">
              Dispatch Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* 17. 360° GUEST PROFILE DRAWER / MODAL (Part C)               */}
      {/* ============================================================ */}
      <Modal isOpen={!!selectedGuest} onClose={() => setSelectedGuest(null)} title="360° Comprehensive Guest Profile & History">
        {selectedGuest && (
          <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin text-xs">
            {selectedGuest.isDuplicateOf && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center justify-between">
                <span className="font-bold text-amber-900 dark:text-amber-200">Duplicate Profile Detected</span>
                <button
                  onClick={() => {
                    setGuestToMerge(selectedGuest);
                    setIsMergeModalOpen(true);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  Authorize Merge →
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <img src={selectedGuest.avatar} alt="" className="w-14 h-14 rounded-full object-cover border" />
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {selectedGuest.firstName} {selectedGuest.middleName ? `${selectedGuest.middleName} ` : ''}{selectedGuest.lastName}
                </h3>
                <p className="text-gray-500">{selectedGuest.id} · {selectedGuest.nationality} · DOB: {selectedGuest.dateOfBirth}</p>
                <p className="text-indigo-600 font-bold">{selectedGuest.totalStays} Lifetime Stays · ${selectedGuest.totalSpend.toLocaleString()} Total Spend</p>
              </div>
            </div>

            {/* Editable Info */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300 uppercase">Contact & Demographics</span>
                {!isEditingGuest ? (
                  <button onClick={() => setIsEditingGuest(true)} className="text-indigo-600 font-bold underline">Edit Info</button>
                ) : (
                  <button onClick={handleSaveGuestEdit} className="text-emerald-600 font-bold underline">Save Changes</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block">Phone:</span>
                  {isEditingGuest ? (
                    <input type="tel" value={editGuestPhone} onChange={e => setEditGuestPhone(e.target.value)} className="w-full p-1 border rounded" />
                  ) : (
                    <strong className="text-gray-900 dark:text-white">{selectedGuest.phone}</strong>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 block">Email:</span>
                  {isEditingGuest ? (
                    <input type="email" value={editGuestEmail} onChange={e => setEditGuestEmail(e.target.value)} className="w-full p-1 border rounded" />
                  ) : (
                    <strong className="text-gray-900 dark:text-white">{selectedGuest.email}</strong>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-1 pt-2 border-t">
              <span className="font-bold text-gray-700 dark:text-gray-300 uppercase block">Recorded Preferences</span>
              <p className="text-gray-600 dark:text-gray-300 italic">{selectedGuest.preferences.join(' · ') || 'None'}</p>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1 pt-2 border-t">
              <span className="font-bold text-gray-700 dark:text-gray-300 uppercase block">Emergency Contact</span>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedGuest.emergencyContactName} ({selectedGuest.emergencyContactPhone})
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setSelectedGuest(null)} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/* 18. AUTHORIZED DUPLICATE PROFILE MERGE WIZARD (Part C.12)     */}
      {/* ============================================================ */}
      <Modal isOpen={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)} title="Authorized Duplicate Profile Merge">
        {selectedGuest && guestToMerge && (
          <div className="p-6 space-y-4 text-xs">
            <p className="text-gray-600 dark:text-gray-300">
              You are consolidating duplicate profile <strong>{guestToMerge.id}</strong> into primary profile <strong>{selectedGuest.id}</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <span className="text-emerald-600 font-bold block uppercase text-[10px]">Primary Target</span>
                <p className="font-bold">{selectedGuest.firstName} {selectedGuest.lastName} ({selectedGuest.id})</p>
                <p className="text-gray-500">{selectedGuest.totalStays} Stays · ${selectedGuest.totalSpend.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-amber-600 font-bold block uppercase text-[10px]">Duplicate to Archive</span>
                <p className="font-bold">{guestToMerge.firstName} {guestToMerge.lastName} ({guestToMerge.id})</p>
                <p className="text-gray-500">{guestToMerge.totalStays} Stays · ${guestToMerge.totalSpend.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setIsMergeModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
              <button onClick={handleMergeProfiles} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md">
                Confirm & Consolidate Profiles
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
