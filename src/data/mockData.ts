// ============================================================
// HOSPITALITY ERP - COMPREHENSIVE MOCK DATA
// ============================================================

export type PropertyMode = 'hotel' | 'guesthouse' | 'restaurant';

// ─── PROPERTY CONFIGURATIONS ────────────────────────────────
export const propertyConfigs = {
  hotel: {
    name: 'Betora Grand Palace Hotel',
    tagline: 'Betora HMS · Modern Hospitality Management Platform',
    address: '1 Betora Boulevard, Luxury District',
    phone: '+1 (800) 555-BETORA',
    email: 'reservations@betorahms.com',
    theme: 'navy',
    accentColor: '#c9a84c',
    primaryColor: '#1e3a5f',
    stars: 5,
    heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80',
    logo: '🏰',
    currency: 'USD',
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  guesthouse: {
    name: 'The Willow Retreat',
    tagline: 'Your Home Away From Home',
    address: '42 Garden Lane, Cotswolds, UK',
    phone: '+44 1234 567890',
    email: 'hello@willowretreat.co.uk',
    theme: 'emerald',
    accentColor: '#10b981',
    primaryColor: '#059669',
    stars: 4,
    heroImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80',
    logo: '🌿',
    currency: 'GBP',
    checkInTime: '14:00',
    checkOutTime: '10:00',
  },
  restaurant: {
    name: 'Ember & Ash',
    tagline: 'A Culinary Journey Without Limits',
    address: '55 Rue de la Paix, Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'reservations@emberandash.fr',
    theme: 'crimson',
    accentColor: '#c9a84c',
    primaryColor: '#8b1a1a',
    stars: 1,
    heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    logo: '🔥',
    currency: 'EUR',
    checkInTime: '18:00',
    checkOutTime: '23:00',
  },
};

// ─── ROOMS ────────────────────────────────────────────────────
export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  capacity: number;
  bedType: string;
  ratePerNight: number;
  status: 'clean' | 'dirty' | 'occupied' | 'maintenance' | 'inspecting';
  features: string[];
  image: string;
  description: string;
  size: string;
  view: string;
  currentGuest?: string;
  checkOut?: string;
}

export const rooms: Room[] = [
  {
    id: 'R101', number: '101', type: 'Deluxe King', floor: 1, capacity: 2, bedType: 'King',
    ratePerNight: 350, status: 'occupied', features: ['City View', 'Mini Bar', 'Smart TV', 'Rain Shower'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'A spacious deluxe room with panoramic city views, featuring a plush king bed and marble bathroom.',
    size: '42 m²', view: 'City View', currentGuest: 'James Worthington', checkOut: '2026-11-02',
  },
  {
    id: 'R102', number: '102', type: 'Deluxe Twin', floor: 1, capacity: 2, bedType: 'Twin',
    ratePerNight: 320, status: 'clean', features: ['Garden View', 'Mini Bar', 'Smart TV'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    description: 'Elegant twin-bedded room overlooking our serene garden, perfect for friends or colleagues.',
    size: '38 m²', view: 'Garden View',
  },
  {
    id: 'R201', number: '201', type: 'Executive Suite', floor: 2, capacity: 2, bedType: 'King',
    ratePerNight: 650, status: 'occupied', features: ['Ocean View', 'Jacuzzi', 'Living Room', 'Butler Service', 'Mini Bar'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    description: 'Our flagship executive suite with a separate living area, premium amenities, and dedicated butler service.',
    size: '85 m²', view: 'Ocean View', currentGuest: 'Sophia Chen', checkOut: '2026-11-04',
  },
  {
    id: 'R202', number: '202', type: 'Deluxe King', floor: 2, capacity: 2, bedType: 'King',
    ratePerNight: 380, status: 'dirty', features: ['City View', 'Mini Bar', 'Smart TV', 'Bathtub'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'Premium king room on second floor with enhanced city views and deluxe amenities.',
    size: '45 m²', view: 'City View',
  },
  {
    id: 'R301', number: '301', type: 'Presidential Suite', floor: 3, capacity: 4, bedType: 'King + Sofa',
    ratePerNight: 1200, status: 'clean', features: ['Panoramic View', 'Private Pool', 'Kitchen', 'Dining Room', 'Butler 24/7', 'Jacuzzi'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    description: 'The pinnacle of luxury. A full-floor suite with private pool, panoramic views, and unmatched privacy.',
    size: '220 m²', view: 'Panoramic',
  },
  {
    id: 'R302', number: '302', type: 'Junior Suite', floor: 3, capacity: 2, bedType: 'King',
    ratePerNight: 520, status: 'occupied', features: ['Sea View', 'Lounge Area', 'Premium Bar', 'Smart TV'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    description: 'Sophisticated junior suite with an integrated lounge area and breathtaking sea views.',
    size: '68 m²', view: 'Sea View', currentGuest: 'Marcus Adeyemi', checkOut: '2026-11-01',
  },
  {
    id: 'R401', number: '401', type: 'Deluxe King', floor: 4, capacity: 2, bedType: 'King',
    ratePerNight: 420, status: 'maintenance', features: ['Mountain View', 'Mini Bar', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'Top-floor king room with private balcony and mountain vistas.',
    size: '48 m²', view: 'Mountain View',
  },
  {
    id: 'R402', number: '402', type: 'Executive Suite', floor: 4, capacity: 3, bedType: 'King',
    ratePerNight: 700, status: 'clean', features: ['City Panorama', 'Jacuzzi', 'Living Room', 'Kitchenette'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    description: 'Elevated executive suite with floor-to-ceiling windows and city panorama.',
    size: '90 m²', view: 'City Panorama',
  },
  {
    id: 'R501', number: '501', type: 'Family Suite', floor: 5, capacity: 5, bedType: 'King + 2 Twin',
    ratePerNight: 850, status: 'occupied', features: ['Garden View', '2 Bathrooms', 'Living Room', 'Kids Area'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    description: 'Designed for families, featuring multiple sleeping areas, two bathrooms, and a dedicated kids play corner.',
    size: '130 m²', view: 'Garden View', currentGuest: 'The Morrison Family', checkOut: '2026-11-03',
  },
  {
    id: 'R502', number: '502', type: 'Deluxe Twin', floor: 5, capacity: 2, bedType: 'Twin',
    ratePerNight: 340, status: 'inspecting', features: ['Pool View', 'Mini Bar', 'Smart TV'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    description: 'Light and airy twin room with direct views of our award-winning pool.',
    size: '40 m²', view: 'Pool View',
  },
];

// ─── GUESTS / CRM ─────────────────────────────────────────────
export interface GuestVerificationRecord {
  date: string;
  verifiedBy: string;
  docType: 'Passport' | 'National ID' | 'Driver License';
  docRef: string;
  expiryDate: string;
  status: 'verified' | 'expired' | 'pending';
}

export interface Guest {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  passportNumber: string;
  nationalIdNumber?: string;
  idType?: 'Passport' | 'National ID' | 'Driver License';
  idNumber?: string;
  idExpiryDate?: string;
  loyaltyNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dateOfBirth: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalStays: number;
  totalSpend: number;
  preferences: string[];
  allergies: string[];
  notes: string;
  lastStay: string;
  joinDate: string;
  address: string;
  avatar: string;
  verificationHistory?: GuestVerificationRecord[];
  isDuplicateOf?: string;
  vipStatus?: boolean;
  createdAt?: string;
}

export const guests: Guest[] = [
  {
    id: 'G001', firstName: 'James', lastName: 'Worthington',
    email: 'j.worthington@sterling.co.uk', phone: '+44 7700 900123',
    nationality: 'British', passportNumber: 'GB12345678',
    dateOfBirth: '1978-03-15', tier: 'Platinum', totalStays: 28, totalSpend: 84500,
    preferences: ['High Floor', 'Extra Pillows', 'Late Checkout', 'Champagne on arrival'],
    allergies: ['Shellfish'], notes: 'VIP client. CEO of Sterling Capital. Prefers absolute discretion.',
    lastStay: '2026-10-15', joinDate: '2019-06-01',
    address: '14 Park Lane, Mayfair, London W1K 1QY',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 'G002', firstName: 'Sophia', lastName: 'Chen',
    email: 'sophia.c@techventures.sg', phone: '+65 8888 1234',
    nationality: 'Singaporean', passportNumber: 'SG98765432',
    dateOfBirth: '1985-11-22', tier: 'Gold', totalStays: 12, totalSpend: 31200,
    preferences: ['Ocean View', 'Vegan Menu', 'Yoga Mat', 'Early Check-in'],
    allergies: ['Peanuts', 'Dairy'], notes: 'Regular business traveler. Always requests the 201 suite.',
    lastStay: '2026-10-28', joinDate: '2021-03-14',
    address: '88 Marina Boulevard, Singapore 018981',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'G003', firstName: 'Marcus', lastName: 'Adeyemi',
    email: 'm.adeyemi@gmail.com', phone: '+234 803 456 7890',
    nationality: 'Nigerian', passportNumber: 'NG11223344',
    dateOfBirth: '1990-07-08', tier: 'Silver', totalStays: 5, totalSpend: 9800,
    preferences: ['Ground Floor', 'Quiet Room', 'Extra Towels'],
    allergies: [], notes: 'Traveling for medical conference. Needs early breakfast.',
    lastStay: '2026-10-30', joinDate: '2023-01-20',
    address: '45 Victoria Island, Lagos, Nigeria',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'G004', firstName: 'Isabella', lastName: 'Romano',
    email: 'isabella.romano@vogue.it', phone: '+39 02 1234 5678',
    nationality: 'Italian', passportNumber: 'IT55667788',
    dateOfBirth: '1992-04-30', tier: 'Gold', totalStays: 9, totalSpend: 22400,
    preferences: ['Fashion Week', 'Full-Length Mirror', 'Express Laundry', 'Wine Selection'],
    allergies: ['Gluten'], notes: 'Fashion editor. Very particular about room aesthetics.',
    lastStay: '2026-10-18', joinDate: '2022-09-05',
    address: 'Via della Spiga 12, Milan 20121, Italy',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'G005', firstName: 'David', lastName: 'Morrison',
    email: 'd.morrison@family.com', phone: '+1 (555) 234-5678',
    nationality: 'American', passportNumber: 'US99887766',
    dateOfBirth: '1975-12-01', tier: 'Silver', totalStays: 3, totalSpend: 8500,
    preferences: ['Family Suite', 'Kids Menu', 'Crib', 'Adjacent Rooms'],
    allergies: ['Nuts'], notes: 'Traveling with wife and 3 children (ages 4, 7, 10).',
    lastStay: '2026-10-30', joinDate: '2024-07-11',
    address: '123 Maple Street, Greenwich, CT 06830',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 'G006', firstName: 'Yuki', lastName: 'Tanaka',
    email: 'yuki.tanaka@tokyocorp.jp', phone: '+81 3 1234 5678',
    nationality: 'Japanese', passportNumber: 'JP44332211',
    dateOfBirth: '1988-08-14', tier: 'Bronze', totalStays: 2, totalSpend: 2800,
    preferences: ['Japanese Tea', 'Quiet Room', 'Western Breakfast'],
    allergies: ['Lactose'], notes: 'First-time visitor. Very polite. Gave 5-star feedback.',
    lastStay: '2026-09-22', joinDate: '2026-09-01',
    address: '1-1 Marunouchi, Chiyoda, Tokyo 100-0005',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
  {
    id: 'G007', firstName: 'James', middleName: 'A.', lastName: 'Worthington',
    email: 'j.worthington@sterling.co.uk', phone: '+44 7700 900123',
    nationality: 'British', gender: 'Male', passportNumber: 'GB12345678',
    nationalIdNumber: 'NID-UK-88291', idType: 'Passport', idNumber: 'GB12345678', idExpiryDate: '2029-08-15',
    loyaltyNumber: '', dateOfBirth: '1978-03-15', tier: 'Bronze',
    totalStays: 1, totalSpend: 1540, preferences: ['Extra Pillows'], allergies: [],
    notes: 'Secondary profile created through third-party Expedia booking.',
    lastStay: '2026-10-29', joinDate: '2026-10-28', address: 'London, UK',
    avatar: 'https://i.pravatar.cc/150?img=11',
    isDuplicateOf: 'G001',
  },
];

// ─── RESERVATIONS ─────────────────────────────────────────────
export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  ratePerNight: number;
  totalAmount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show' | 'pending';
  bookingSource: 'Direct' | 'Booking.com' | 'Expedia' | 'Walk-in' | 'Phone' | 'OTA';
  bookingRef: string;
  specialRequests: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'refunded';
  createdAt: string;
}

export const reservations: Reservation[] = [
  {
    id: 'RES001', guestId: 'G001', guestName: 'James Worthington',
    roomId: 'R101', roomNumber: '101', roomType: 'Deluxe King',
    checkIn: '2026-10-29', checkOut: '2026-11-02', nights: 4, adults: 2, children: 0,
    ratePerNight: 350, totalAmount: 1540, status: 'checked-in',
    bookingSource: 'Direct', bookingRef: 'LXP-2026-001',
    specialRequests: 'Champagne on arrival, extra pillows',
    paymentStatus: 'paid', createdAt: '2026-10-01',
  },
  {
    id: 'RES002', guestId: 'G002', guestName: 'Sophia Chen',
    roomId: 'R201', roomNumber: '201', roomType: 'Executive Suite',
    checkIn: '2026-10-28', checkOut: '2026-11-04', nights: 7, adults: 1, children: 0,
    ratePerNight: 650, totalAmount: 4745, status: 'checked-in',
    bookingSource: 'Direct', bookingRef: 'LXP-2026-002',
    specialRequests: 'Vegan meals only, yoga mat in room',
    paymentStatus: 'partial', createdAt: '2026-09-15',
  },
  {
    id: 'RES003', guestId: 'G003', guestName: 'Marcus Adeyemi',
    roomId: 'R302', roomNumber: '302', roomType: 'Junior Suite',
    checkIn: '2026-10-30', checkOut: '2026-11-01', nights: 2, adults: 1, children: 0,
    ratePerNight: 520, totalAmount: 1092, status: 'checked-in',
    bookingSource: 'Booking.com', bookingRef: 'LXP-2026-003',
    specialRequests: 'Quiet room, early breakfast at 6:30am',
    paymentStatus: 'paid', createdAt: '2026-10-10',
  },
  {
    id: 'RES004', guestId: 'G004', guestName: 'Isabella Romano',
    roomId: 'R402', roomNumber: '402', roomType: 'Executive Suite',
    checkIn: '2026-11-01', checkOut: '2026-11-05', nights: 4, adults: 1, children: 0,
    ratePerNight: 700, totalAmount: 2940, status: 'confirmed',
    bookingSource: 'Direct', bookingRef: 'LXP-2026-004',
    specialRequests: 'Gluten-free menu, full-length mirror',
    paymentStatus: 'paid', createdAt: '2026-10-05',
  },
  {
    id: 'RES005', guestId: 'G005', guestName: 'The Morrison Family',
    roomId: 'R501', roomNumber: '501', roomType: 'Family Suite',
    checkIn: '2026-10-29', checkOut: '2026-11-03', nights: 5, adults: 2, children: 3,
    ratePerNight: 850, totalAmount: 4462, status: 'checked-in',
    bookingSource: 'Expedia', bookingRef: 'LXP-2026-005',
    specialRequests: 'Crib for youngest child, nut-free meals',
    paymentStatus: 'partial', createdAt: '2026-09-20',
  },
  {
    id: 'RES006', guestId: 'G006', guestName: 'Yuki Tanaka',
    roomId: 'R102', roomNumber: '102', roomType: 'Deluxe Twin',
    checkIn: '2026-11-02', checkOut: '2026-11-05', nights: 3, adults: 2, children: 0,
    ratePerNight: 320, totalAmount: 1009, status: 'confirmed',
    bookingSource: 'Booking.com', bookingRef: 'LXP-2026-006',
    specialRequests: 'Japanese tea selection, quiet room',
    paymentStatus: 'pending', createdAt: '2026-10-25',
  },
  {
    id: 'RES007', guestId: 'G001', guestName: 'Elena Vasquez',
    roomId: 'R301', roomNumber: '301', roomType: 'Presidential Suite',
    checkIn: '2026-11-05', checkOut: '2026-11-10', nights: 5, adults: 2, children: 0,
    ratePerNight: 1200, totalAmount: 6300, status: 'confirmed',
    bookingSource: 'Phone', bookingRef: 'LXP-2026-007',
    specialRequests: 'Flowers on arrival, airport transfer',
    paymentStatus: 'paid', createdAt: '2026-10-28',
  },
];

// ─── TODAY'S ARRIVALS / DEPARTURES ───────────────────────────
export const todayArrivals = [
  { id: 'A001', guestName: 'Oliver Bennett', roomType: 'Deluxe King', checkIn: '2026-10-30', checkOut: '2026-11-03', adults: 2, nights: 4, bookingRef: 'LXP-2026-008', status: 'pending', phone: '+44 7911 123456' },
  { id: 'A002', guestName: 'Priya Sharma', roomType: 'Executive Suite', checkIn: '2026-10-30', checkOut: '2026-11-07', adults: 1, nights: 8, bookingRef: 'LXP-2026-009', status: 'pending', phone: '+91 98765 43210' },
  { id: 'A003', guestName: 'Lucas Mueller', roomType: 'Junior Suite', checkIn: '2026-10-30', checkOut: '2026-11-02', adults: 2, nights: 3, bookingRef: 'LXP-2026-010', status: 'checked-in', phone: '+49 30 123456' },
];

export const todayDepartures = [
  { id: 'D001', guestName: 'Anna Kowalski', roomNumber: '204', roomType: 'Deluxe Twin', checkOut: '2026-10-30', nights: 5, totalBill: 1750, status: 'pending', billSettled: false },
  { id: 'D002', guestName: 'Chen Wei', roomNumber: '108', roomType: 'Deluxe King', checkOut: '2026-10-30', nights: 2, totalBill: 840, status: 'checked-out', billSettled: true },
];

// ─── REVENUE DATA ─────────────────────────────────────────────
export const revenueData = [
  { date: 'Oct 24', rooms: 8200, restaurant: 2100, spa: 890, total: 11190 },
  { date: 'Oct 25', rooms: 9100, restaurant: 2450, spa: 1200, total: 12750 },
  { date: 'Oct 26', rooms: 7800, restaurant: 3100, spa: 950, total: 11850 },
  { date: 'Oct 27', rooms: 10200, restaurant: 2800, spa: 1450, total: 14450 },
  { date: 'Oct 28', rooms: 11500, restaurant: 3200, spa: 1600, total: 16300 },
  { date: 'Oct 29', rooms: 12800, restaurant: 3800, spa: 1800, total: 18400 },
  { date: 'Oct 30', rooms: 9600, restaurant: 2950, spa: 1100, total: 13650 },
];

export const roomStatusData = [
  { name: 'Occupied', value: 5, color: '#3b82f6' },
  { name: 'Clean', value: 3, color: '#10b981' },
  { name: 'Dirty', value: 1, color: '#ef4444' },
  { name: 'Maintenance', value: 1, color: '#f59e0b' },
];

export const kpiData = {
  totalRevenueToday: 13650,
  revenueChange: 12.4,
  occupancyRate: 68,
  occupancyChange: 5.2,
  arrivalsToday: 3,
  departuresTeday: 2,
  avgDailyRate: 524,
  revPAR: 356,
};

// ─── ACTIVITY FEED ─────────────────────────────────────────────
export interface Activity {
  id: string;
  type: 'checkin' | 'checkout' | 'order' | 'housekeeping' | 'maintenance' | 'booking' | 'payment';
  message: string;
  time: string;
  user?: string;
  icon?: string;
}

export const activityFeed: Activity[] = [
  { id: 'ACT001', type: 'checkin', message: 'Room 302 checked in — Marcus Adeyemi', time: '2 min ago', user: 'Front Desk: Sarah' },
  { id: 'ACT002', type: 'order', message: 'Table 4 ordered: 2x Beef Steak, 1x Lobster Bisque', time: '8 min ago', user: 'Server: Tom' },
  { id: 'ACT003', type: 'housekeeping', message: 'Room 202 marked Dirty → In Progress', time: '15 min ago', user: 'HK: Maria' },
  { id: 'ACT004', type: 'payment', message: 'Folio settled for Room 108 — $840.00', time: '22 min ago', user: 'Cashier: James' },
  { id: 'ACT005', type: 'booking', message: 'New booking LXP-2026-007 — Presidential Suite', time: '35 min ago', user: 'System' },
  { id: 'ACT006', type: 'maintenance', message: 'Room 401 flagged for maintenance — AC unit', time: '1 hr ago', user: 'Eng: Rob' },
  { id: 'ACT007', type: 'order', message: 'Spa appointment booked — Sophia Chen, 3:00 PM', time: '1 hr ago', user: 'Spa: Lisa' },
  { id: 'ACT008', type: 'checkout', message: 'Room 108 checked out — Chen Wei', time: '2 hrs ago', user: 'Front Desk: Sarah' },
];

// ─── RESTAURANT / POS ─────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Mains' | 'Desserts' | 'Drinks' | 'Wines' | 'Specials';
  price: number;
  description: string;
  image: string;
  tags: string[];
  available: boolean;
  prepTime: number; // minutes
  allergens?: string[];
}

export const menuItems: MenuItem[] = [
  // Starters
  { id: 'M001', name: 'Lobster Bisque', category: 'Starters', price: 24, description: 'Velvety Maine lobster bisque with cognac cream and chives', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', tags: ['Signature', 'Shellfish'], available: true, prepTime: 12, allergens: ['Shellfish', 'Dairy'] },
  { id: 'M002', name: 'Foie Gras Terrine', category: 'Starters', price: 38, description: 'Pan-seared duck foie gras with fig compote and toasted brioche', image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80', tags: ['Chef\'s Pick'], available: true, prepTime: 10, allergens: ['Gluten'] },
  { id: 'M003', name: 'Burrata Caprese', category: 'Starters', price: 19, description: 'Fresh burrata with heirloom tomatoes, basil oil, and aged balsamic', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=80', tags: ['Vegetarian'], available: true, prepTime: 8, allergens: ['Dairy'] },
  { id: 'M004', name: 'Wagyu Tartare', category: 'Starters', price: 45, description: 'Hand-cut A5 Wagyu beef tartare with truffle aioli and quail egg', image: 'https://images.unsplash.com/photo-1611171711791-b34fa42e6ee1?w=400&q=80', tags: ['Premium', 'Raw'], available: true, prepTime: 10 },
  // Mains
  { id: 'M005', name: 'Châteaubriand', category: 'Mains', price: 125, description: '400g center-cut beef tenderloin with béarnaise, seasonal vegetables', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', tags: ['Signature', 'For 2'], available: true, prepTime: 25, allergens: ['Dairy'] },
  { id: 'M006', name: 'Wagyu Beef Steak', category: 'Mains', price: 89, description: 'A4 Wagyu sirloin with roasted bone marrow, black truffle butter', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', tags: ['Premium', 'Chef\'s Pick'], available: true, prepTime: 22 },
  { id: 'M007', name: 'Pan-Seared Sea Bass', category: 'Mains', price: 58, description: 'Chilean sea bass with saffron beurre blanc, samphire, and caviar', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', tags: ['Signature', 'Pescatarian'], available: true, prepTime: 18, allergens: ['Fish', 'Dairy'] },
  { id: 'M008', name: 'Truffle Risotto', category: 'Mains', price: 48, description: 'Black truffle Arborio risotto with aged parmesan and herb oil', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80', tags: ['Vegetarian'], available: true, prepTime: 20, allergens: ['Dairy', 'Gluten'] },
  { id: 'M009', name: 'Rack of Lamb', category: 'Mains', price: 72, description: 'French-trimmed lamb rack with pistachio crust, rosemary jus, gratin potatoes', image: 'https://images.unsplash.com/photo-1602335490202-f59eb62d7d34?w=400&q=80', tags: ['Chef\'s Pick'], available: false, prepTime: 28 },
  // Desserts
  { id: 'M010', name: 'Valrhona Chocolate Soufflé', category: 'Desserts', price: 22, description: 'Warm dark chocolate soufflé with vanilla bean ice cream (20 min)', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', tags: ['Signature', 'Must Order 20 min early'], available: true, prepTime: 20, allergens: ['Dairy', 'Gluten', 'Eggs'] },
  { id: 'M011', name: 'Crème Brûlée', category: 'Desserts', price: 18, description: 'Classic vanilla crème brûlée with caramelized sugar and fresh berries', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80', tags: ['Classic'], available: true, prepTime: 5, allergens: ['Dairy', 'Eggs'] },
  { id: 'M012', name: 'Mango Panna Cotta', category: 'Desserts', price: 16, description: 'Coconut panna cotta with mango coulis and passion fruit', image: 'https://images.unsplash.com/photo-1488477181228-c84def77a40d?w=400&q=80', tags: ['Tropical', 'GF option'], available: true, prepTime: 5, allergens: ['Dairy'] },
  // Drinks
  { id: 'M013', name: 'Artisan Coffee', category: 'Drinks', price: 8, description: 'Single-origin pour-over or espresso blend', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', tags: ['Hot', 'Cold Brew available'], available: true, prepTime: 4 },
  { id: 'M014', name: 'Fresh Juice Selection', category: 'Drinks', price: 12, description: 'Cold-pressed seasonal fruit and vegetable juices', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80', tags: ['Vegan', 'Fresh'], available: true, prepTime: 6 },
  { id: 'M015', name: 'Cocktail of the Day', category: 'Drinks', price: 22, description: 'Ask your server for today\'s signature cocktail creation', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80', tags: ['Signature', 'Ask Server'], available: true, prepTime: 8 },
  // Wines
  { id: 'M016', name: 'Château Margaux 2018', category: 'Wines', price: 280, description: 'Premier Grand Cru Classé. Bordeaux, France. Full-bodied, elegant tannins.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80', tags: ['Red', 'Bordeaux', 'Premium'], available: true, prepTime: 2 },
  { id: 'M017', name: 'Opus One 2019', category: 'Wines', price: 320, description: 'Napa Valley, California. Rothschild & Mondavi collaboration. Exceptional.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80', tags: ['Red', 'California', 'Premium'], available: true, prepTime: 2 },
  { id: 'M018', name: 'Dom Pérignon 2013', category: 'Wines', price: 395, description: 'Vintage Champagne. Blanc de blancs, brioche notes, extraordinary length.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80', tags: ['Champagne', 'Celebration'], available: true, prepTime: 3 },
];

// ─── RESTAURANT TABLES ────────────────────────────────────────
export interface RestaurantTable {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  guestName?: string;
  covers?: number;
  openedAt?: string;
  linkedRoomId?: string;
  linkedRoomNumber?: string;
  currentOrder?: OrderItem[];
  totalBill?: number;
  server?: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export const restaurantTables: RestaurantTable[] = [
  { id: 'T01', number: 1, seats: 2, status: 'available', server: 'Tom' },
  { id: 'T02', number: 2, seats: 4, status: 'occupied', guestName: 'Emma Thompson', covers: 3, openedAt: '19:15', currentOrder: [
    { menuItemId: 'M006', menuItemName: 'Wagyu Beef Steak', quantity: 2, unitPrice: 89, total: 178 },
    { menuItemId: 'M003', menuItemName: 'Burrata Caprese', quantity: 1, unitPrice: 19, total: 19 },
    { menuItemId: 'M013', menuItemName: 'Artisan Coffee', quantity: 3, unitPrice: 8, total: 24 },
  ], totalBill: 221, server: 'Sophie' },
  { id: 'T03', number: 3, seats: 2, status: 'reserved', guestName: 'Reservation: 8:00PM', server: 'Tom' },
  { id: 'T04', number: 4, seats: 6, status: 'occupied', guestName: 'Corporate: McKinsey', covers: 5, openedAt: '19:00', linkedRoomId: 'R201', linkedRoomNumber: '201', currentOrder: [
    { menuItemId: 'M005', menuItemName: 'Châteaubriand', quantity: 1, unitPrice: 125, total: 125 },
    { menuItemId: 'M006', menuItemName: 'Wagyu Beef Steak', quantity: 2, unitPrice: 89, total: 178 },
    { menuItemId: 'M001', menuItemName: 'Lobster Bisque', quantity: 3, unitPrice: 24, total: 72 },
    { menuItemId: 'M016', menuItemName: 'Château Margaux 2018', quantity: 1, unitPrice: 280, total: 280 },
  ], totalBill: 655, server: 'James' },
  { id: 'T05', number: 5, seats: 4, status: 'available', server: 'Sophie' },
  { id: 'T06', number: 6, seats: 8, status: 'cleaning', server: 'James' },
  { id: 'T07', number: 7, seats: 2, status: 'occupied', guestName: 'Sophia Chen', covers: 1, openedAt: '20:10', linkedRoomId: 'R201', linkedRoomNumber: '201', currentOrder: [
    { menuItemId: 'M008', menuItemName: 'Truffle Risotto', quantity: 1, unitPrice: 48, total: 48 },
    { menuItemId: 'M012', menuItemName: 'Mango Panna Cotta', quantity: 1, unitPrice: 16, total: 16 },
    { menuItemId: 'M014', menuItemName: 'Fresh Juice Selection', quantity: 2, unitPrice: 12, total: 24 },
  ], totalBill: 88, server: 'Tom' },
  { id: 'T08', number: 8, seats: 4, status: 'available', server: 'Sophie' },
  { id: 'T09', number: 9, seats: 6, status: 'reserved', guestName: 'Reservation: 9:00PM', server: 'James' },
  { id: 'T10', number: 10, seats: 10, status: 'available', server: 'Tom' },
  { id: 'T11', number: 11, seats: 2, status: 'occupied', guestName: 'Walk-in', covers: 2, openedAt: '20:30', currentOrder: [
    { menuItemId: 'M007', menuItemName: 'Pan-Seared Sea Bass', quantity: 2, unitPrice: 58, total: 116 },
    { menuItemId: 'M015', menuItemName: 'Cocktail of the Day', quantity: 2, unitPrice: 22, total: 44 },
  ], totalBill: 160, server: 'Sophie' },
  { id: 'T12', number: 12, seats: 4, status: 'available', server: 'Tom' },
];

// ─── HOUSEKEEPING ─────────────────────────────────────────────
export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  status: 'dirty' | 'in-progress' | 'clean' | 'inspecting';
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  estimatedTime?: number;
  startedAt?: string;
  completedAt?: string;
  type: 'checkout' | 'stayover' | 'deep-clean';
}

export const housekeepingTasks: HousekeepingTask[] = [
  { id: 'HK001', roomNumber: '202', roomType: 'Deluxe King', floor: 2, status: 'in-progress', assignedTo: 'Maria Garcia', priority: 'high', notes: 'Checkout cleaning', estimatedTime: 45, startedAt: '10:15', type: 'checkout' },
  { id: 'HK002', roomNumber: '108', roomType: 'Deluxe King', floor: 1, status: 'dirty', priority: 'high', notes: 'Just checked out. Guest left items — check & report', type: 'checkout' },
  { id: 'HK003', roomNumber: '304', roomType: 'Deluxe Twin', floor: 3, status: 'dirty', priority: 'medium', notes: 'Stayover service', type: 'stayover' },
  { id: 'HK004', roomNumber: '502', roomType: 'Deluxe Twin', floor: 5, status: 'inspecting', assignedTo: 'Carlos Ruiz', priority: 'low', notes: 'Ready for inspection', completedAt: '11:30', type: 'stayover' },
  { id: 'HK005', roomNumber: '203', roomType: 'Junior Suite', floor: 2, status: 'clean', assignedTo: 'Aisha Patel', priority: 'medium', notes: 'Completed', completedAt: '09:45', type: 'stayover' },
  { id: 'HK006', roomNumber: '101', roomType: 'Deluxe King', floor: 1, status: 'clean', assignedTo: 'Maria Garcia', priority: 'high', notes: 'VIP arrival today — extra flowers added', completedAt: '08:00', type: 'checkout' },
  { id: 'HK007', roomNumber: '103', roomType: 'Deluxe Twin', floor: 1, status: 'dirty', priority: 'low', type: 'deep-clean' },
  { id: 'HK008', roomNumber: '401', roomType: 'Deluxe King', floor: 4, status: 'dirty', priority: 'medium', notes: 'Maintenance complete, full clean needed', type: 'checkout' },
];

// ─── FINANCE / FOLIOS ─────────────────────────────────────────
export interface FolioItem {
  id: string;
  description: string;
  category: 'Room' | 'Restaurant' | 'Spa' | 'Bar' | 'Minibar' | 'Laundry' | 'Phone' | 'Misc' | 'Tax' | 'Discount';
  date: string;
  amount: number;
  quantity?: number;
}

export interface Folio {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  items: FolioItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discounts: number;
  total: number;
  paid: number;
  balance: number;
  status: 'open' | 'settled' | 'partial';
  creditCard?: string;
}

export const folios: Folio[] = [
  {
    id: 'FOL001', reservationId: 'RES001', guestName: 'James Worthington', roomNumber: '101',
    checkIn: '2026-10-29', checkOut: '2026-11-02',
    items: [
      { id: 'FI001', description: 'Room Rate — Deluxe King (4 nights)', category: 'Room', date: '2026-10-29', amount: 1400, quantity: 4 },
      { id: 'FI002', description: 'Welcome Champagne', category: 'Bar', date: '2026-10-29', amount: 85 },
      { id: 'FI003', description: 'Restaurant Dinner (Table 4)', category: 'Restaurant', date: '2026-10-29', amount: 320 },
      { id: 'FI004', description: 'Spa: Swedish Massage', category: 'Spa', date: '2026-10-30', amount: 180 },
      { id: 'FI005', description: 'Minibar Consumption', category: 'Minibar', date: '2026-10-30', amount: 65 },
      { id: 'FI006', description: 'Laundry Service', category: 'Laundry', date: '2026-10-31', amount: 45 },
      { id: 'FI007', description: 'Restaurant Breakfast x2', category: 'Restaurant', date: '2026-10-31', amount: 95 },
    ],
    subtotal: 2190, taxRate: 0.12, taxAmount: 262.8, discounts: 200, total: 2252.8, paid: 1400, balance: 852.8,
    status: 'partial', creditCard: '**** **** **** 4242',
  },
  {
    id: 'FOL002', reservationId: 'RES002', guestName: 'Sophia Chen', roomNumber: '201',
    checkIn: '2026-10-28', checkOut: '2026-11-04',
    items: [
      { id: 'FI011', description: 'Room Rate — Executive Suite (7 nights)', category: 'Room', date: '2026-10-28', amount: 4550, quantity: 7 },
      { id: 'FI012', description: 'In-room Dining (Vegan Set)', category: 'Restaurant', date: '2026-10-28', amount: 88 },
      { id: 'FI013', description: 'Spa: Deep Tissue + Hot Stone', category: 'Spa', date: '2026-10-29', amount: 240 },
      { id: 'FI014', description: 'Restaurant — Truffle Risotto, Panna Cotta', category: 'Restaurant', date: '2026-10-30', amount: 88 },
      { id: 'FI015', description: 'Airport Transfer (Return)', category: 'Misc', date: '2026-10-28', amount: 120 },
    ],
    subtotal: 5086, taxRate: 0.12, taxAmount: 610.32, discounts: 0, total: 5696.32, paid: 2000, balance: 3696.32,
    status: 'partial', creditCard: '**** **** **** 8881',
  },
  {
    id: 'FOL003', reservationId: 'RES003', guestName: 'Marcus Adeyemi', roomNumber: '302',
    checkIn: '2026-10-30', checkOut: '2026-11-01',
    items: [
      { id: 'FI021', description: 'Room Rate — Junior Suite (2 nights)', category: 'Room', date: '2026-10-30', amount: 1040, quantity: 2 },
      { id: 'FI022', description: 'Room Service Breakfast', category: 'Restaurant', date: '2026-10-30', amount: 45 },
    ],
    subtotal: 1085, taxRate: 0.12, taxAmount: 130.2, discounts: 0, total: 1215.2, paid: 1215.2, balance: 0,
    status: 'settled', creditCard: '**** **** **** 3344',
  },
];

// ─── STAFF & RBAC ─────────────────────────────────────────────
export interface StaffMember {
  id: string;
  name: string;
  role: 'General Manager' | 'Front Desk' | 'Housekeeping' | 'Restaurant Manager' | 'Chef' | 'Server' | 'Accountant' | 'Security' | 'Night Auditor' | 'Maintenance Engineer' | 'Concierge' | 'Revenue Manager';
  department: string;
  email: string;
  phone: string;
  shift: 'Morning' | 'Afternoon' | 'Night' | 'Split';
  status: 'active' | 'off-duty' | 'on-leave';
  joinDate: string;
  avatar: string;
}

export const staffMembers: StaffMember[] = [
  { id: 'S001', name: 'Victoria Hartley', role: 'General Manager', department: 'Management', email: 'v.hartley@grandluxe.com', phone: '+1 555-001', shift: 'Morning', status: 'active', joinDate: '2018-04-01', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'S002', name: 'Sarah Mitchell', role: 'Front Desk', department: 'Front Office', email: 's.mitchell@grandluxe.com', phone: '+1 555-002', shift: 'Morning', status: 'active', joinDate: '2021-06-15', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'S003', name: 'James Thompson', role: 'Front Desk', department: 'Front Office', email: 'j.thompson@grandluxe.com', phone: '+1 555-003', shift: 'Night', status: 'active', joinDate: '2022-01-10', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 'S004', name: 'Maria Garcia', role: 'Housekeeping', department: 'Housekeeping', email: 'm.garcia@grandluxe.com', phone: '+1 555-004', shift: 'Morning', status: 'active', joinDate: '2020-03-22', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 'S005', name: 'Carlos Ruiz', role: 'Housekeeping', department: 'Housekeeping', email: 'c.ruiz@grandluxe.com', phone: '+1 555-005', shift: 'Afternoon', status: 'active', joinDate: '2023-07-01', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 'S006', name: 'Chef Antoine Dupont', role: 'Chef', department: 'F&B', email: 'a.dupont@grandluxe.com', phone: '+1 555-006', shift: 'Split', status: 'active', joinDate: '2019-12-01', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 'S007', name: 'Sophie Williams', role: 'Server', department: 'F&B', email: 's.williams@grandluxe.com', phone: '+1 555-007', shift: 'Afternoon', status: 'active', joinDate: '2022-09-15', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 'S008', name: 'Robert Chen', role: 'Accountant', department: 'Finance', email: 'r.chen@grandluxe.com', phone: '+1 555-008', shift: 'Morning', status: 'active', joinDate: '2020-08-01', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'S009', name: 'Daniel Park', role: 'Restaurant Manager', department: 'F&B', email: 'd.park@grandluxe.com', phone: '+1 555-009', shift: 'Afternoon', status: 'off-duty', joinDate: '2021-02-14', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 'S010', name: 'David Miller', role: 'Night Auditor', department: 'Audit & Finance', email: 'd.miller@grandluxe.com', phone: '+1 555-010', shift: 'Night', status: 'active', joinDate: '2021-04-12', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'S011', name: 'Marcus Vance', role: 'Maintenance Engineer', department: 'Engineering', email: 'm.vance@grandluxe.com', phone: '+1 555-011', shift: 'Morning', status: 'active', joinDate: '2020-11-05', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'S012', name: 'Elena Rostova', role: 'Concierge', department: 'Guest Services', email: 'e.rostova@grandluxe.com', phone: '+1 555-012', shift: 'Afternoon', status: 'active', joinDate: '2023-01-20', avatar: 'https://i.pravatar.cc/150?img=13' },
];

export const rbacMatrix = {
  roles: ['General Manager', 'Front Desk', 'Night Auditor', 'Maintenance Engineer', 'Housekeeping', 'Restaurant Manager', 'Chef', 'Server', 'Accountant', 'Concierge'],
  permissions: [
    { permission: 'Check-In / Check-Out', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': false },
    { permission: 'View Reservations', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': true, 'Chef': false, 'Server': true, 'Accountant': true, 'Concierge': true },
    { permission: 'Modify Reservations', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': false },
    { permission: 'Night Audit Execution', 'General Manager': true, 'Front Desk': false, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': true, 'Concierge': false },
    { permission: 'Maintenance Work Orders', 'General Manager': true, 'Front Desk': true, 'Night Auditor': false, 'Maintenance Engineer': true, 'Housekeeping': true, 'Restaurant Manager': true, 'Chef': true, 'Server': false, 'Accountant': false, 'Concierge': true },
    { permission: 'Process Refunds', 'General Manager': true, 'Front Desk': false, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': true, 'Concierge': false },
    { permission: 'View Guest PII', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': true },
    { permission: 'Access Finance Reports', 'General Manager': true, 'Front Desk': false, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': true, 'Concierge': false },
    { permission: 'Manage Staff / RBAC', 'General Manager': true, 'Front Desk': false, 'Night Auditor': false, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': false },
    { permission: 'Restaurant POS Access', 'General Manager': true, 'Front Desk': false, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': true, 'Chef': true, 'Server': true, 'Accountant': false, 'Concierge': false },
    { permission: 'Post to Room Folio', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': true, 'Chef': false, 'Server': true, 'Accountant': false, 'Concierge': true },
    { permission: 'Housekeeping Tasks', 'General Manager': true, 'Front Desk': false, 'Night Auditor': false, 'Maintenance Engineer': false, 'Housekeeping': true, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': false },
    { permission: 'Inventory Management', 'General Manager': true, 'Front Desk': false, 'Night Auditor': false, 'Maintenance Engineer': true, 'Housekeeping': true, 'Restaurant Manager': true, 'Chef': true, 'Server': false, 'Accountant': true, 'Concierge': false },
    { permission: 'Concierge & Guest Requests', 'General Manager': true, 'Front Desk': true, 'Night Auditor': true, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': true },
    { permission: 'System Settings', 'General Manager': true, 'Front Desk': false, 'Night Auditor': false, 'Maintenance Engineer': false, 'Housekeeping': false, 'Restaurant Manager': false, 'Chef': false, 'Server': false, 'Accountant': false, 'Concierge': false },
  ],
};

// ─── INVENTORY ─────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  category: 'Linen' | 'Toiletries' | 'F&B' | 'Cleaning' | 'Maintenance' | 'Office';
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  supplier: string;
  lastOrdered: string;
  status: 'ok' | 'low' | 'critical' | 'overstock';
}

export const inventoryItems: InventoryItem[] = [
  { id: 'INV001', name: 'Premium Bath Towels', category: 'Linen', unit: 'pcs', currentStock: 240, minStock: 100, maxStock: 500, reorderPoint: 120, unitCost: 28, supplier: 'LuxLinen Co.', lastOrdered: '2026-10-01', status: 'ok' },
  { id: 'INV002', name: 'Bed Sheets (King)', category: 'Linen', unit: 'sets', currentStock: 85, minStock: 60, maxStock: 200, reorderPoint: 70, unitCost: 65, supplier: 'LuxLinen Co.', lastOrdered: '2026-10-15', status: 'low' },
  { id: 'INV003', name: 'Shampoo (50ml)', category: 'Toiletries', unit: 'bottles', currentStock: 1200, minStock: 500, maxStock: 2000, reorderPoint: 600, unitCost: 2.5, supplier: 'AquaLux', lastOrdered: '2026-10-20', status: 'ok' },
  { id: 'INV004', name: 'Wagyu Beef A4 (kg)', category: 'F&B', unit: 'kg', currentStock: 12, minStock: 10, maxStock: 50, reorderPoint: 15, unitCost: 180, supplier: 'Prime Meats Ltd.', lastOrdered: '2026-10-28', status: 'critical' },
  { id: 'INV005', name: 'Bordeaux Wines (case)', category: 'F&B', unit: 'cases', currentStock: 8, minStock: 5, maxStock: 30, reorderPoint: 8, unitCost: 420, supplier: 'Vintage Imports', lastOrdered: '2026-10-10', status: 'low' },
  { id: 'INV006', name: 'All-Purpose Cleaner (5L)', category: 'Cleaning', unit: 'bottles', currentStock: 45, minStock: 20, maxStock: 100, reorderPoint: 25, unitCost: 12, supplier: 'CleanPro', lastOrdered: '2026-10-05', status: 'ok' },
  { id: 'INV007', name: 'Champagne Veuve Clicquot', category: 'F&B', unit: 'bottles', currentStock: 24, minStock: 12, maxStock: 60, reorderPoint: 15, unitCost: 65, supplier: 'Vintage Imports', lastOrdered: '2026-10-22', status: 'ok' },
  { id: 'INV008', name: 'Bath Robes (M/L)', category: 'Linen', unit: 'pcs', currentStock: 38, minStock: 40, maxStock: 120, reorderPoint: 45, unitCost: 85, supplier: 'LuxLinen Co.', lastOrdered: '2026-09-15', status: 'critical' },
];

// ─── GUESTHOUSE SPECIFIC ROOMS ───────────────────────────────
export const guesthouseRooms = [
  { id: 'GR01', name: 'The Rose Room', type: 'Classic Double', price: 95, capacity: 2, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', features: ['Garden View', 'Free WiFi', 'Tea/Coffee'], status: 'occupied' },
  { id: 'GR02', name: 'The Lavender Suite', type: 'Deluxe Suite', price: 165, capacity: 2, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', features: ['Countryside View', 'Jacuzzi Bath', 'Fireplace', 'Sitting Room'], status: 'available' },
  { id: 'GR03', name: 'The Oak Room', type: 'Superior Twin', price: 120, capacity: 2, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', features: ['Forest View', 'Four-Poster Beds', 'Vintage Furniture'], status: 'available' },
  { id: 'GR04', name: 'The Meadow Cottage', type: 'Self-Catering Cottage', price: 240, capacity: 4, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', features: ['Private Garden', 'Kitchen', 'BBQ', 'Pet Friendly'], status: 'occupied' },
];

// ─── AMENITIES FOR WEBSITE ────────────────────────────────────
export const hotelAmenities = [
  { icon: '🏊', title: 'Infinity Pool', description: 'Olympic-sized rooftop infinity pool with panoramic views', category: 'Wellness' },
  { icon: '💆', title: 'Grand Spa', description: '8-treatment room spa with sauna, steam room, and hydrotherapy', category: 'Wellness' },
  { icon: '🍽️', title: 'Fine Dining', description: 'Award-winning Ember & Ash restaurant with Michelin-starred chef', category: 'Dining' },
  { icon: '🏋️', title: 'Fitness Center', description: '24/7 state-of-the-art gym with personal trainers available', category: 'Wellness' },
  { icon: '🎾', title: 'Tennis Courts', description: 'Two floodlit hard courts with equipment rental', category: 'Recreation' },
  { icon: '🚗', title: 'Valet Parking', description: 'Complimentary valet parking for all hotel guests', category: 'Services' },
  { icon: '✈️', title: 'Airport Transfer', description: 'Luxury chauffeur service to/from all major airports', category: 'Services' },
  { icon: '📡', title: 'High-Speed WiFi', description: 'Complimentary 1Gbps WiFi throughout the property', category: 'Technology' },
];

// ─── SETTINGS DATA ───────────────────────────────────────────
export const systemSettings = {
  general: {
    hotelName: 'Grand Luxe Palace',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
  },
  booking: {
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: '48 hours',
    depositRequired: true,
    depositPercent: 30,
    autoConfirm: false,
  },
  notifications: {
    emailOnBooking: true,
    emailOnCancellation: true,
    smsOnCheckIn: true,
    dailyReport: true,
    reportTime: '07:00',
  },
};

export const generateBookingRef = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'LXP-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  const maskedLocal = local[0] + '***';
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0][0] + '***.' + domainParts.slice(1).join('.');
  return `${maskedLocal}@${maskedDomain}`;
};

export const maskPassport = (passport: string): string => {
  return passport.slice(0, 2) + '***' + passport.slice(-2);
};

// ─── MAINTENANCE & WORK ORDERS ────────────────────────────────
export interface WorkOrder {
  id: string;
  roomNumber: string;
  location?: string;
  category: 'HVAC' | 'Plumbing' | 'Electrical' | 'Furniture' | 'Locks & Keycards' | 'General';
  title: string;
  description: string;
  priority: 'emergency' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'waiting-parts' | 'completed';
  assignedTo: string;
  reportedBy: string;
  createdAt: string;
  estimatedCost: number;
  actualCost?: number;
  affectsRoomAvailability: boolean;
}

export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'WO-101',
    roomNumber: '304',
    category: 'HVAC',
    title: 'AC unit failing to cool / temperature sensor fault',
    description: 'Guest reported room temperature stuck at 26°C despite thermostat set to 20°C. Compressor fan inspected; needs coolant valve replacement.',
    priority: 'emergency',
    status: 'in-progress',
    assignedTo: 'Marcus Vance',
    reportedBy: 'Housekeeping (Maria Garcia)',
    createdAt: '2026-10-31 08:30',
    estimatedCost: 180,
    affectsRoomAvailability: true,
  },
  {
    id: 'WO-102',
    roomNumber: '108',
    category: 'Plumbing',
    title: 'Bathroom vanity sink slow drainage',
    description: 'Drain line partially clogged after checkout. Requires chemical snake and P-trap inspection before next check-in.',
    priority: 'high',
    status: 'open',
    assignedTo: 'Marcus Vance',
    reportedBy: 'Front Desk (Sarah Mitchell)',
    createdAt: '2026-10-31 11:15',
    estimatedCost: 65,
    affectsRoomAvailability: false,
  },
  {
    id: 'WO-103',
    roomNumber: '502',
    category: 'Locks & Keycards',
    title: 'Balcony sliding door deadbolt sticky',
    description: 'RFID reader battery low warning triggered on lock controller. Replace 4x AA lithium cells and lubricate sliding latch.',
    priority: 'medium',
    status: 'waiting-parts',
    assignedTo: 'Marcus Vance',
    reportedBy: 'Inspection Team',
    createdAt: '2026-10-30 16:45',
    estimatedCost: 40,
    affectsRoomAvailability: false,
  },
  {
    id: 'WO-104',
    roomNumber: '203',
    category: 'Electrical',
    title: 'Smart TV wall bracket loose & HDMI passthrough reset',
    description: 'Secured wall mount bracket with heavy-duty anchors. Replaced damaged high-speed HDMI cord and tested streaming portal.',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Marcus Vance',
    reportedBy: 'Front Desk (James Thompson)',
    createdAt: '2026-10-29 14:00',
    estimatedCost: 50,
    actualCost: 45,
    affectsRoomAvailability: false,
  },
  {
    id: 'WO-105',
    roomNumber: 'Lobby',
    location: 'Main Executive Lounge',
    category: 'Furniture',
    title: 'Leather Chesterfield arm rest seam repair',
    description: 'Leather upholstery seam on armchair #3 loosening. Dispatched to local master leather artisan for restitching.',
    priority: 'medium',
    status: 'open',
    assignedTo: 'Elena Rostova',
    reportedBy: 'Concierge Team',
    createdAt: '2026-10-30 09:20',
    estimatedCost: 120,
    affectsRoomAvailability: false,
  },
];

// ─── NIGHT AUDIT DATA ──────────────────────────────────────────
export interface NightAuditValidationItem {
  id: string;
  label: string;
  description: string;
  status: 'passed' | 'warning' | 'pending';
  actionRequired?: string;
  details?: string;
}

export const initialNightAuditChecklist: NightAuditValidationItem[] = [
  {
    id: 'NA-01',
    label: 'Pending Arrivals Reconciliation',
    description: 'Verify all expected arrivals have checked in or processed as No-Show',
    status: 'warning',
    actionRequired: '1 Pending Arrival: RES005 (Alexander Wright, Room 402)',
    details: 'Auto-charge 1st night guarantee if marked No-Show.',
  },
  {
    id: 'NA-02',
    label: 'Departures & Guest Folio Zero-Balance',
    description: 'Ensure departing guests have returned keys and folios are settled to zero',
    status: 'passed',
    details: 'All 3 departed rooms settled and archived successfully.',
  },
  {
    id: 'NA-03',
    label: 'F&B Restaurant & POS Terminal Closeout',
    description: 'Verify all table checks are paid or charged to guest room folios',
    status: 'passed',
    details: 'Ember & Ash POS shift closed. All checks settled or posted to rooms.',
  },
  {
    id: 'NA-04',
    label: 'Cash Drawer & Terminal Reconciliation',
    description: 'Front desk cash float ($1,450.00) matches physical count and card batch ($12,840.50)',
    status: 'passed',
    details: '0.00 ledger variance detected. Ready for batch transmission.',
  },
];
