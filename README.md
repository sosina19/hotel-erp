# LuxeStay ERP — Hospitality Management System

A high-fidelity, fully interactive hospitality ERP demo built with **React + Vite + Tailwind CSS + Recharts**.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | Recharts 2 |
| Language | TypeScript 5 |
| Data | Hardcoded Mock JSON |

---

## 🎭 Demo Mode Switcher

Three property modes are available from the **top navbar**:

| Mode | Property | Theme |
|---|---|---|
| 🏰 Luxury Hotel | Grand Luxe Palace | Navy & Gold |
| 🌿 Boutique Guest House | The Willow Retreat | Emerald & Cream |
| 🔥 Fine Dining Restaurant | Ember & Ash | Crimson & Gold |

Each mode adapts: **sidebar navigation, public website, data, branding and color scheme**.

---

## 🌐 Part 1 — Public Guest Website

| Page | Route | Description |
|---|---|---|
| Home | `home` | Hero, amenities, featured rooms, reviews, CTA |
| Rooms | `rooms` | Grid of rooms with filters, detail modal |
| Dining | `dining` | Full menu with categories, reserve-a-table modal |
| Book Now | `book-now` | 3-step booking engine with success modal |
| Guest Portal | `guest-portal` | Mock login, stay info, room service requests |
| Restaurant Home | (restaurant mode) | Full restaurant landing page |
| Guesthouse Home | (guesthouse mode) | Cotswolds guest house landing page |

**Booking Engine Steps:**
1. Select dates & guest count
2. Choose available room (live pricing, photos)
3. Guest details + payment → generates booking reference

---

## 🖥️ Part 2 — Admin PMS Dashboard

### Sidebar Pages

| Page | Key Features |
|---|---|
| **Dashboard** | 4 KPI cards, Revenue line chart, Room status pie, Bar chart, Live activity feed, Quick actions |
| **Reservations** | Filterable table, Gantt calendar view, New reservation modal, Detail/check-in modal |
| **Front Desk** | Arrivals with check-in modal (room assignment), Departures with checkout + billing, In-house guests |
| **Guest CRM** | Searchable table, PII masking with Reveal button, Side drawer with full profile, stay history |
| **Rooms & Inventory** | Grid + List view, Status filter, Room detail modal, Maintenance flagging |
| **Housekeeping** | Kanban board (Dirty → In Progress → Clean → Inspecting), Staff assignments |
| **Restaurant POS** | Visual table grid, Full order screen, Menu categories, **Post to Room Folio** feature |
| **Finance & Folios** | Folio table, Itemized charge breakdown, Settle payment animation |
| **Inventory & Stock** | Stock level bars, Critical/Low alerts, Reorder buttons |
| **Staff & RBAC** | Employee table, Permission matrix (12 permissions × 7 roles) |
| **Settings** | 5 tabs: General, Booking, Notifications, Payments, Security |

### ⭐ Killer Features

1. **Restaurant POS → Post to Room Folio** — Restaurant charges post directly to a hotel guest's running bill
2. **PII Masking** — Guest emails and passport numbers are masked by default with audit-logged "Reveal"
3. **Gantt Reservation Calendar** — Rooms on Y-axis, dates on X-axis, color-coded by status
4. **Live Activity Feed** — Real-time operations log on the dashboard
5. **Kanban Housekeeping** — Drag-friendly status cards with one-click advancement

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root with splash screen
├── context/
│   └── AppContext.tsx          # Global state (mode, view, toasts, dark mode)
├── data/
│   └── mockData.ts             # All mock data (rooms, guests, reservations…)
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx          # Global nav bar with mode switcher
│   │   ├── Sidebar.tsx         # Admin sidebar (mode-adaptive)
│   │   ├── AdminLayout.tsx     # Admin shell
│   │   └── PublicLayout.tsx    # Public website shell
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Reservations.tsx
│   │   ├── FrontDesk.tsx
│   │   ├── GuestCRM.tsx
│   │   ├── RoomsInventory.tsx
│   │   ├── Housekeeping.tsx
│   │   ├── RestaurantPOS.tsx
│   │   ├── Finance.tsx
│   │   ├── Inventory.tsx
│   │   ├── Staff.tsx
│   │   └── Settings.tsx
│   ├── public/
│   │   ├── PublicNav.tsx
│   │   ├── HomePage.tsx        # Luxury hotel home
│   │   ├── GuesthousePage.tsx  # Cotswolds guest house home
│   │   ├── RestaurantPage.tsx  # Fine dining restaurant home
│   │   ├── RoomsPage.tsx
│   │   ├── DiningPage.tsx
│   │   ├── BookingEngine.tsx   # 3-step booking wizard
│   │   └── GuestPortal.tsx    # Self-service portal
│   └── ui/
│       ├── Modal.tsx           # Modal + Drawer
│       ├── Badge.tsx           # StatusBadge + Badge variants
│       ├── Toast.tsx           # Toast notification system
│       └── SplashScreen.tsx    # Demo welcome screen
```

---

## 🎨 Design System

- **Font:** Inter (UI) + Playfair Display (headings)
- **Hotel theme:** Navy `#1e3a5f` + Gold `#c9a84c`
- **Guesthouse theme:** Emerald `#059669`
- **Restaurant theme:** Crimson `#8b1a1a`
- **Dark mode:** Full support via Tailwind `dark:` classes
- **Animations:** fade-in, slide-up, slide-in, pulse

---

## 📊 Mock Data Includes

- **10 rooms** across 5 floors with statuses
- **6 guest profiles** with full PII, preferences, allergen alerts
- **7 reservations** across all statuses
- **12 restaurant tables** with live orders
- **18 menu items** across 5 categories
- **8 housekeeping tasks** for Kanban board
- **3 detailed folios** with itemized charges
- **9 staff members** with RBAC matrix (12 permissions × 7 roles)
- **8 inventory items** with stock levels and supplier info
- **7 days of revenue data** for charts

---

*Built as a sales demo. All data is simulated. No backend required.*
