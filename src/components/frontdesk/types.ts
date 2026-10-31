import type { Room, Reservation, Guest } from '../../data/mockData';

export interface AdditionalOccupant {
  id: string;
  name: string;
  age?: number;
  relationship: string;
  idNumber?: string;
}

export interface RoomAssignmentRecord {
  roomNumber: string;
  roomType: string;
  from: string;
  to: string;
  reason: string;
  authorizedBy?: string;
  ratePerNight: number;
  timestamp: string;
}

export interface FDRoom extends Room {
  roomStatus: 'vacant' | 'occupied' | 'blocked' | 'out_of_order';
  housekeepingStatus: 'clean' | 'inspected' | 'dirty' | 'inspecting';
  cleaningProgress?: number; // 0 to 100%
  assignedHousekeeper?: string;
  cleaningStartTime?: string;
  cleaningEtaMins?: number;
  isCleaningDelayed?: boolean;
  delayReason?: string;
  specialPrepRequested?: string; // e.g. "VIP Package", "Honeymoon", "Baby Cot", "Hypoallergenic"
  urgentCleaningRequested?: boolean;
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
  corporateAccount?: string;
  groupCode?: string;
  roomAssignmentHistory?: RoomAssignmentRecord[];
}

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  locationType: 'room' | 'public_area';
  category: 'Air conditioning' | 'Electricity' | 'Plumbing' | 'Furniture' | 'Internet' | 'Door locks' | 'Bathroom equipment';
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Reported' | 'Assigned' | 'Technician On-Site' | 'Repaired' | 'Inspection Requested' | 'Closed';
  reportedAt: string;
  reportedBy: string;
  assignedTechnician?: {
    name: string;
    phone: string;
    etaMins: number;
  };
  photoUrl?: string;
  roomBlocked: boolean;
  repairNotes?: string;
  repairedAt?: string;
  inspectionStatus?: 'Pending Inspection' | 'Passed' | 'Failed';
  inspectedBy?: string;
  isOverdue?: boolean;
}

export interface ServiceRequestTicket {
  id: string;
  roomNumber: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  department: 'Housekeeping' | 'Maintenance' | 'F&B' | 'Front Desk' | 'Concierge';
  category: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rejected';
  loggedAt: string;
  assignedStaff?: string;
  completionTime?: string;
  completionNotes?: string;
  cancelReason?: string;
  rejectionReason?: string;
  isComplaint?: boolean;
  complaintSeverity?: 'Low' | 'Medium' | 'High' | 'Severe';
  serviceRecoveryComp?: string;
  guestNotified?: boolean;
}

export interface GroupBooking {
  id: string;
  groupCode: string;
  groupName: string;
  groupLeader: {
    name: string;
    phone: string;
    email: string;
  };
  corporateAccount?: {
    companyName: string;
    taxId: string;
    billingContact: string;
    creditLimit: number;
    directBillingApproved: boolean;
  };
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalRooms: number;
  roomsAssigned: {
    roomNumber: string;
    roomType: string;
    guestName: string;
    adults: number;
    isCheckInComplete: boolean;
    individualChargesTotal: number;
  }[];
  billingArrangement: 'Master Folio Covers All' | 'Master Covers Room & Tax / Guest Covers Incidentals' | 'Individual Settlement';
  masterFolioBalance: number;
  masterPayments: { id: string; date: string; method: string; amount: number; ref: string }[];
  status: 'Confirmed' | 'In-House' | 'Departed';
}

export interface GuestCommunicationRecord {
  id: string;
  guestName: string;
  guestContact: string;
  type:
    | 'Check-in Confirmation'
    | 'Reservation Confirmation'
    | 'Checkout Reminder'
    | 'Payment Receipt'
    | 'Cancellation Notice'
    | 'Room-Ready Alert'
    | 'Request Update'
    | 'Hotel Announcement';
  channel: 'Email' | 'SMS' | 'WhatsApp';
  subject: string;
  content: string;
  sentAt: string;
  sentBy: string;
  status: 'Delivered' | 'Sent' | 'Failed';
}
