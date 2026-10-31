export type GuestPortalTab =
  | 'overview'
  | 'stay'
  | 'billing'
  | 'communications'
  | 'dining'
  | 'services'
  | 'housekeeping'
  | 'maintenance'
  | 'reviews'
  | 'history'
  | 'profile';

export interface GuestStayInfo {
  name: string;
  avatar: string;
  guestId: string;
  room: string;
  roomType: string;
  floor: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  nightsRemaining: number;
  bookingRef: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond VIP';
  balance: number;
  wifiNetwork: string;
  wifiPassword: string;
  server: string;
  adults: number;
  children: number;
  roomImages: string[];
  roomAmenities: string[];
  includedServices: string[];
  specialRequests: string;
  status: 'Confirmed' | 'Checked-In' | 'Completed';
  paymentStatus: 'Paid in Full' | 'Deposit Paid · Incidentals Open' | 'Unsettled';
  assignedProperty: string;
}

export interface GuestProfileData {
  fullName: string;
  guestId: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  identification: {
    type: 'Passport' | 'National ID' | 'Driver License';
    maskedNumber: string;
    fullNumber: string;
    expiryDate: string;
    verified: boolean;
    verificationDate: string;
    verifyingAgent: string;
  };
  language: string;
  commPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  loyaltyPoints: number;
  tier: string;
}

export interface DiningOrderItemAddOn {
  name: string;
  price: number;
}

export interface DiningOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  preparationOption?: string;
  addOns?: DiningOrderItemAddOn[];
  cutleryCount?: number;
  condiments?: string[];
  specialInstructions?: string;
}

export interface GuestDiningOrder {
  id: string;
  orderTime: string;
  restaurantName: string;
  items: DiningOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'Room Delivery' | 'Restaurant Pickup' | 'Open Table Dine-in';
  roomNumber: string;
  tableNumber?: string;
  deliveryTime: string;
  specialInstructions: string;
  paymentMethod: 'Charge to Room Folio' | 'Credit Card' | 'Pay at Table';
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  assignedServer: string;
  estimatedMinutes: number;
}

export interface GuestHousekeepingRequest {
  id: string;
  requestType:
    | 'Clean my room'
    | 'Change bedsheets & linens'
    | 'Replace towels & robes'
    | 'Refill luxury toiletries'
    | 'Empty trash & recycling'
    | 'Extra down pillows'
    | 'Extra blankets / duvet'
    | 'Extra mineral water'
    | 'Turndown & room preparation'
    | 'Scheduled cleaning';
  scheduledTime?: string;
  customNotes?: string;
  submittedAt: string;
  status: 'Submitted' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedStaff: string;
  estimatedMinutes: number;
}

export interface GuestMaintenanceRequest {
  id: string;
  category:
    | 'Air conditioning'
    | 'Television & Media'
    | 'Water leakage & Plumbing'
    | 'Electrical & Outlets'
    | 'Broken furniture'
    | 'Bathroom & Shower'
    | 'Wi-Fi & Connectivity'
    | 'Door lock & RFID'
    | 'Lighting & Bulbs'
    | 'Other';
  description: string;
  photoUrl?: string;
  roomNumber: string;
  reportedAt: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
  assignedTechnician?: string;
  staffResponse?: string;
  resolutionTime?: string;
}

export interface PastStayRecord {
  id: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomNumber: string;
  roomType: string;
  totalBill: number;
  status: 'Completed' | 'Cancelled' | 'No-show';
  servicesUsed: string[];
  paymentMethod: string;
  reviewGiven?: {
    stars: number;
    comment: string;
    createdAt: string;
  };
}

export interface HotelServiceItem {
  id: string;
  name: string;
  category: 'Wellness & Spa' | 'Fitness & Recreation' | 'Dining & Drinks' | 'Transport & Travel' | 'In-Room & Concierge';
  description: string;
  image: string;
  price: string;
  hours: string;
  estimatedTime: string;
  availability: 'Available Now' | 'Requires Reservation' | 'Seasonal';
  rules?: string;
  actionType: 'book' | 'request' | 'order' | 'info';
}

// ============================================================
// BILLING, PAYMENTS, FOLIO & DISPUTES
// ============================================================
export type FolioCategory =
  | 'Accommodation'
  | 'Dining & Room Service'
  | 'Laundry'
  | 'Additional Services'
  | 'Taxes & Fees'
  | 'Discounts'
  | 'Deposits'
  | 'Other';

export interface FolioChargeItem {
  id: string;
  date: string;
  category: FolioCategory;
  description: string;
  reference: string;
  amount: number;
  isCredit?: boolean; // if true, subtracts from balance (e.g. deposit or discount)
  status: 'Finalized' | 'Pending Verification';
  serviceDepartment?: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  transactionRef: string;
  method:
    | 'Credit Card (Visa •••• 4242)'
    | 'Mastercard (•••• 8821)'
    | 'Apple Pay'
    | 'Google Pay'
    | 'Bank Wire Transfer'
    | 'Loyalty Points';
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  failureReason?: string;
  refundReason?: string;
  receiptNumber: string;
}

export interface ChargeDispute {
  id: string;
  chargeId: string;
  chargeDescription: string;
  disputedAmount: number;
  category: 'Incorrect Amount' | 'Service Not Provided' | 'Duplicate Charge' | 'Quality Issue' | 'Other';
  reason: string;
  submittedAt: string;
  status: 'Under Review' | 'Investigating' | 'Credit Approved' | 'Declined';
  managementNote?: string;
}

// ============================================================
// GUEST COMMUNICATIONS & MESSAGING
// ============================================================
export interface ChatMessage {
  id: string;
  sender: 'guest' | 'staff';
  senderName: string;
  senderRole?: string;
  avatar?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface GeneralServiceRequest {
  id: string;
  ticketRef: string;
  type:
    | 'General Inquiry'
    | 'Compliment / Question'
    | 'Service Complaint'
    | 'Assistance Request'
    | 'Lost Property'
    | 'Special Occasion';
  title: string;
  details: string;
  department: 'Front Desk' | 'Concierge' | 'Housekeeping' | 'Food & Beverage' | 'Engineering' | 'Management';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'In Review' | 'In Progress' | 'Resolved';
  submittedAt: string;
  staffResponse?: string;
  resolvedAt?: string;
}

export interface LostPropertyReport {
  id: string;
  reportRef: string;
  itemName: string;
  approxLocation: string;
  lostDate: string;
  description: string;
  status: 'Reported' | 'Searching' | 'Located in Housekeeping' | 'Ready for Collection' | 'Returned';
  contactPhone: string;
  staffNotes?: string;
}

export interface PortalNotification {
  id: string;
  type:
    | 'room_ready'
    | 'order_accepted'
    | 'cleaning_progress'
    | 'maintenance_resolved'
    | 'checkout_approaching'
    | 'payment_success'
    | 'reservation_updated'
    | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLinkTab?: GuestPortalTab;
}

// ============================================================
// MULTI-CATEGORY REVIEWS & FEEDBACK
// ============================================================
export interface StayReview {
  id: string;
  bookingRef: string;
  stayDates: string;
  roomNumber: string;
  overallRating: number;
  roomRating: number;
  restaurantRating: number;
  housekeepingRating: number;
  staffRating: number;
  writtenFeedback: string;
  reportedDissatisfaction?: string;
  submittedAt: string;
  managementResponse?: {
    respondedBy: string;
    responseDate: string;
    message: string;
  };
}