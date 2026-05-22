# CareQ — Project Context

**For:** Antigravity AI  
**Project:** CareQ — Hospital OPD Smart Queue System  
**Role of this document:** Full system context for generating production-quality React frontend code

---

## 1. What Is CareQ?

CareQ is a real-time patient queue management system for government hospital Outpatient Departments (OPDs) in Sri Lanka. It replaces paper tokens and manual queue management with a digital platform that gives patients live visibility into their wait time, enables clinical staff to dynamically manage queue priority, and gives hospital administrators operational analytics.

**The core problem:** Government OPD patients wait 2–4 hours with zero information about their position or estimated wait time. Emergency patients have no systematic escalation path. Staff have no data to optimise throughput.

**The solution:** A web-based system where patients scan a QR code to join a digital queue (no app download), staff manage the queue from a real-time console, and administrators view live dashboards and historical analytics.

---

## 2. Users

| Role | Who They Are | What They Use |
|------|-------------|---------------|
| **Patient** | Any person seeking OPD consultation | Mobile browser (QR scan) — no login required |
| **Triage Nurse** | Clinical staff at OPD intake | Staff web console — authenticated |
| **Doctor** | Medical officer at consultation station | Station interface — authenticated |
| **Administrator** | Hospital management | Full dashboard — authenticated |

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router DOM v6 |
| Global state | Zustand 4 |
| Server state / data fetching | TanStack Query (React Query) v5 |
| Forms | React Hook Form 7 + Zod 3 |
| HTTP client | Axios 1 (all calls via service layer) |
| Real-time | Socket.io-client 4 (placeholder stubs included) |
| Auth | Firebase JS SDK 10 — email/password (placeholder stubs included) |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Modals | Radix UI Dialog + AlertDialog |
| Toasts | React Hot Toast |
| Date utils | date-fns 3 |

---

## 4. Application Pages & Roles

### Public (no login)

| Route | Page | Purpose |
|-------|------|---------|
| `/register/:deptSlug` | RegisterPage | Patient QR landing — enter phone + name, join queue |
| `/token/:tokenId` | TokenStatusPage | Live queue position + wait time for patient |
| `/display/:deptId` | PublicDisplayPage | Fullscreen waiting room TV display |

### Staff (authenticated via Firebase)

| Route | Role | Page |
|-------|------|------|
| `/login` | All | LoginPage |
| `/nurse/triage` | Nurse | TriageConsolePage |
| `/doctor/station` | Doctor | StationPage |
| `/admin/dashboard` | Admin | DashboardPage |
| `/admin/analytics` | Admin | AnalyticsPage |
| `/admin/reports` | Admin | ReportsPage |
| `/admin/stations` | Admin | StationsPage |
| `/admin/configuration` | Admin | ConfigurationPage |
| `/admin/staff` | Admin | StaffPage |
| `/admin/audit` | Admin | AuditLogPage |

---

## 5. Design System

### Visual Reference
All styling must exactly match the high-fidelity wireframes provided separately as PNG images. Do not invent new visual styles.

### Colour Palette

```
Primary (CareQ brand teal):   #1A8C7A
Primary dark (hover):         #156D5F
Primary light (bg tint):      #E6F4F2
Page background:              #F4F6F8
Card / surface:               #FFFFFF
Text primary:                 #1A1A2E
Text secondary:               #5A6472
Border:                       #E2E8F0

Emergency (priority 0):       #D9363E  — red badge
Urgent (priority 1):          #E87A2F  — orange badge
Normal (priority 2):          #1A8C7A  — teal badge
SLA warning:                  #F0A500  — amber
Active:                       #2ECC71  — green
Inactive / paused:            #95A5A6  — grey
Deactivated account:          #E74C3C  — red pill

Chart — Morning line:         #1A8C7A
Chart — Afternoon line:       #2196F3
Chart — Evening line:         #9C27B0
```

### Typography

Font: **DM Sans** or **Nunito Sans** (clean, medical-grade sans-serif — matches wireframe aesthetic)

```
Hero token number:   text-6xl font-black
KPI card number:     text-4xl font-bold
Page title:          text-2xl font-bold
Section header:      text-lg font-semibold
Table header:        text-xs font-semibold uppercase tracking-wider text-secondary
Body:                text-sm
Labels / muted:      text-xs text-secondary
```

### Key Component Styling Rules

**Sidebar:** White background, left border on active item, `#E6F4F2` background for active nav item, `#1A8C7A` text on active item. `w-56`.

**Topbar:** White, `h-16`, contains: app logo + hospital name left, bell icon + staff avatar + name + dropdown right.

**Page header:** Bold page title left, action buttons (primary teal CTA) right.

**KPI cards:** White card, muted label above, large bold number. 4-column grid on dashboard.

**Queue table rows:**
- Emergency patient row: `bg-orange-50` + `border-l-4 border-orange-400`
- SLA breached row: `bg-red-50` + `border-l-4 border-red-500`
- Normal row: white bg

**Priority badge chips:**
- Priority 0 (Emergency): red bg, bold
- Priority 1 (Urgent): orange bg
- Priority 2 (Normal): teal bg
- Shown as numbered pill in wireframe (1, 2, 3 circles)

**Emergency action button:** Large teal CTA with arrow icon — "→ Call Next Patient"

**Station status badge:** `● Active` in green pill

**Staff status pills:** Active = green pill, Deactivated = red pill

---

## 6. API Reference (Backend — Express.js)

**Base URL:** `http://localhost:3001/api/v1` (development)  
**Auth:** Firebase JWT in `Authorization: Bearer <token>` header  
**All errors:** `{ error: { code: string, message: string, details?: object } }`

### Token Endpoints

```
POST   /tokens                        Register new patient token (PUBLIC)
GET    /tokens/:id                    Get token state + position (PUBLIC)
PATCH  /tokens/:id/priority           Change priority (nurse/admin)
PATCH  /tokens/:id/status             Advance token status (doctor/nurse)
GET    /tokens/:id/events             Full audit event history (nurse/admin)
```

**POST /tokens request:**
```json
{
  "patientName": "Liam Johnson",
  "patientPhone": "+94771234567",
  "departmentId": "uuid",
  "fcmToken": "optional-fcm-token"
}
```

**POST /tokens 201 response:**
```json
{
  "tokenId": "uuid",
  "tokenNumber": "TKN-315",
  "position": 11,
  "estimatedWaitMinutes": 42,
  "departmentId": "uuid",
  "issuedAt": "2026-05-21T10:15:00Z"
}
```

**GET /tokens/:id 200 response:**
```json
{
  "tokenId": "uuid",
  "tokenNumber": "TKN-315",
  "position": 6,
  "estimatedWaitMinutes": 22,
  "status": "WAITING",
  "priority": 2,
  "issuedAt": "2026-05-21T10:15:00Z",
  "calledAt": null,
  "stationId": null,
  "departmentId": "uuid"
}
```

**PATCH /tokens/:id/priority request:**
```json
{ "priority": 0, "reason": "Chest pain, acute presentation" }
```

**PATCH /tokens/:id/status request:**
```json
{ "status": "CALLED", "stationId": "uuid" }
```
Status values: `WAITING | CALLED | IN_CONSULTATION | COMPLETED | NO_SHOW`

### Queue Endpoints

```
GET  /queue/:deptId               Full waiting queue (nurse/doctor/admin)
GET  /queue/:deptId/estimate      Wait estimate for a position (PUBLIC)
GET  /queue/:deptId/stats         Live stats (nurse/doctor/admin)
```

**GET /queue/:deptId 200 response:**
```json
{
  "departmentId": "uuid",
  "totalWaiting": 12,
  "activeStations": 3,
  "queue": [
    {
      "tokenId": "uuid",
      "tokenNumber": "TKN-316",
      "patientName": "Sarah",
      "priority": 0,
      "position": 1,
      "waitMinutes": 41,
      "estimatedWaitMinutes": 5
    }
  ]
}
```

**GET /queue/:deptId/stats 200 response:**
```json
{
  "totalWaiting": 12,
  "activeStations": 3,
  "pausedStations": 1,
  "avgWaitMinutesLastHour": 28,
  "slaBreachCountToday": 15,
  "longestCurrentWaitMinutes": 41
}
```

### Station Endpoints

```
GET   /stations/:deptId           List stations for department
PATCH /stations/:id/status        Pause or resume station (doctor/admin)
GET   /stations/:id/next          Next patient at station (doctor)
```

**GET /stations/:id/next 200 response:**
```json
{
  "tokenId": "uuid",
  "tokenNumber": "TKN-315",
  "patientName": "Liam",
  "priority": 0,
  "isEmergency": true,
  "waitMinutes": 12,
  "position": 1
}
```

### Department Endpoints

```
GET    /departments                List all departments (admin)
POST   /departments                Create department (admin)
PATCH  /departments/:id            Update SLA threshold (admin)
PATCH  /departments/:id/status     Activate/deactivate (admin)
```

**PATCH /departments/:id request:**
```json
{ "slaMinutes": 45 }
```

### Staff Endpoints

```
GET    /staff                      List all staff (admin)
POST   /staff                      Create staff account (admin)
PATCH  /staff/:id                  Update staff details (admin)
PATCH  /staff/:id/status           Activate/deactivate (admin)
```

**POST /staff request:**
```json
{
  "name": "Dr. Aris P.",
  "email": "aris@hospital.lk",
  "role": "doctor",
  "departmentId": "uuid"
}
```

### Analytics Endpoints

```
GET  /analytics/dashboard          Live KPIs (admin)
GET  /analytics/wait-trends        Line chart data, params: deptId, dateFrom, dateTo (admin)
GET  /analytics/volume             Bar chart data, params: deptId, dateFrom, dateTo (admin)
GET  /analytics/sla-breaches       SLA breach stats, params: deptId, dateFrom, dateTo (admin)
GET  /analytics/report             PDF download, params: date (admin)
GET  /analytics/export             CSV download, params: deptId, dateFrom, dateTo (admin)
```

**GET /analytics/dashboard 200 response:**
```json
{
  "activeQueues": 6,
  "activeStations": 12,
  "totalPatientsToday": 245,
  "avgWaitMinutesToday": 28,
  "departmentQueueDepths": [
    { "departmentName": "General OPD", "waiting": 235 },
    { "departmentName": "Cardiology", "waiting": 125 }
  ],
  "liveAlerts": [
    {
      "type": "SLA_BREACH",
      "message": "SLA Breach: Station 4 (General OPD)",
      "timestamp": "2026-05-21T10:03:00Z"
    }
  ]
}
```

---

## 7. Socket.io Events

**PLACEHOLDER** — frontend stubs should subscribe to these; server will emit them.

### Server → Client Events

| Event | Room | Payload |
|-------|------|---------|
| `queue:updated` | `dept:{deptId}:queue` | `{ departmentId, queue[], totalWaiting, timestamp }` |
| `sla:breach` | `admin:alerts` | `{ tokenId, tokenNumber, patientName, waitMinutes, departmentId }` |
| `patient:called` | `token:{tokenId}` | `{ tokenId, tokenNumber, stationId, stationName }` |
| `priority:changed` | `token:{tokenId}` | `{ tokenId, oldPriority, newPriority }` |
| `station:status:changed` | `admin:alerts` | `{ stationId, stationName, isPaused }` |
| `display:called` | `display:{deptId}` | `{ tokenNumber, stationName }` |

### Client → Server Events (room join/leave)

```typescript
socket.emit('join:room', { room: 'dept:uuid:queue' })
socket.emit('leave:room', { room: 'dept:uuid:queue' })
```

### Room Names

```
dept:{deptId}:queue        → triage nurses, doctors, public display (queue events)
station:{stationId}        → doctor at this station only
token:{tokenId}            → patient's own personal notifications
admin:alerts               → nurses + admins (SLA breaches, station alerts)
display:{deptId}           → public TV display screen
```

---

## 8. Firebase Auth Placeholder

```typescript
// Staff login flow (PLACEHOLDER)
import { signInWithEmailAndPassword } from 'firebase/auth';

async function login(email: string, password: string) {
  // Step 1: Sign in with Firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Step 2: Get JWT token
  const idToken = await userCredential.user.getIdToken();
  
  // Step 3: Fetch staff profile from backend (role + department assignment)
  const profile = await staffService.getMyProfile();  // GET /staff/me with Bearer token
  
  // Step 4: Store in authStore
  authStore.setUser(userCredential.user, profile);
  
  // Step 5: Connect socket with token
  socketStore.connect(idToken);
}

// Session persistence: Firebase handles this automatically
// onAuthStateChanged fires on page refresh if session is still valid
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const profile = await staffService.getMyProfile();
    authStore.setUser(user, profile);
  } else {
    authStore.clearUser();
  }
});
```

---

## 9. TypeScript Types Reference

```typescript
// auth.types.ts
type UserRole = 'admin' | 'nurse' | 'doctor';

interface StaffProfile {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string | null;
  hospitalId: string;
  isActive: boolean;
}

// queue.types.ts
type TokenStatus = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW';
type Priority = 0 | 1 | 2;  // 0=Emergency, 1=Urgent, 2=Normal

interface QueueItem {
  tokenId: string;
  tokenNumber: string;
  patientName: string;        // first name only in queue listings
  priority: Priority;
  position: number;           // 1-indexed
  waitMinutes: number;
  estimatedWaitMinutes: number;
  issuedAt: string;           // ISO timestamp
}

interface TokenDetail extends QueueItem {
  status: TokenStatus;
  departmentId: string;
  stationId: string | null;
  calledAt: string | null;
  completedAt: string | null;
}

interface TokenEvent {
  id: string;
  eventType: 'TOKEN_ISSUED' | 'PRIORITY_CHANGED' | 'PATIENT_CALLED' | 'IN_CONSULTATION_STARTED' | 'CONSULTATION_COMPLETED' | 'NO_SHOW' | 'SLA_BREACHED';
  actorId: string | null;
  actorName: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

// socket.types.ts
interface QueueUpdatedEvent {
  departmentId: string;
  queue: QueueItem[];
  totalWaiting: number;
  timestamp: string;
}

interface SlaBreachEvent {
  tokenId: string;
  tokenNumber: string;
  patientName: string;
  waitMinutes: number;
  departmentId: string;
}
```

---

## 10. Key Business Rules (Must Know)

1. **Priority ordering:** Emergency (0) always before Urgent (1) always before Normal (2). Within same priority: FIFO by `issuedAt`.

2. **Emergency insertion:** Changing a token to priority 0 immediately moves it to position 1 in the queue. All other positions shift down. This must be reflected in real-time on all connected clients.

3. **SLA breach detection:** Server-side BullMQ timer fires when a token has been `WAITING` longer than the department's `slaMinutes` threshold. Frontend receives `sla:breach` event on `admin:alerts` room. Red badge appears on that token row in triage console. Badge persists until token is called or nurse dismisses.

4. **Station pause:** When a doctor pauses their station, no new patients are assigned to it. Queue distribution shifts to remaining active stations. Pause state shown prominently in station header.

5. **No patient login:** The patient pages (`/register`, `/token/:id`) require zero authentication. The only session data stored client-side is the `tokenId` in `sessionStorage` after registration.

6. **Phone number privacy:** Patient phone numbers must never appear in the queue list, the public display, or any shared staff view. They are masked (`+94771234***`) everywhere except internal staff-only token detail drawers for nurse/admin.

7. **Immutable audit log:** The `GET /tokens/:id/events` endpoint returns the complete history of a token. This is read-only. Visible to nurse and admin roles only.

8. **Token numbers reset daily:** Token numbers are sequential per department per calendar day (midnight reset). Format: `TKN-{number}` e.g. `TKN-315`.

9. **Doctor scope:** A doctor can only see and act on their assigned station's queue. They cannot see other stations or other departments.

10. **Deactivated staff:** A deactivated staff member cannot log in. Their `firebase_uid` is still in the database for audit trail integrity, but the backend returns `ACCOUNT_DEACTIVATED` (403) on any authenticated request.

---

## 11. Folder Structure Summary

```
src/
├── layouts/          AdminLayout, NurseLayout, DoctorLayout, PublicLayout
├── pages/            auth/, patient/, display/, nurse/, doctor/, admin/
├── components/
│   ├── common/       AppLogo, Badge, Button, Card, ConfirmDialog, Input, KpiCard,
│   │                 LoadingSpinner, PageHeader, Sidebar, StatusPill, Table, Toggle, Topbar
│   ├── queue/        QueueTable, QueueRow, PriorityBadge, SlaAlertBadge, WaitTimer, EmergencyActionButton
│   ├── token/        TokenCard, PositionIndicator, TokenStatusBanner, RegisterForm
│   ├── station/      CurrentPatientCard, NextPatientPreview, ConsultationTimer, StationActionBar, StationStatusBadge
│   ├── analytics/    WaitTimeTrendChart, QueueDepthChart, VolumeByDayChart, TopStationsTable, DepartmentPieChart
│   ├── staff/        StaffTable, StaffRow, AddStaffForm
│   └── display/      DisplayBoard, CalledTokenAnnounce
├── stores/           authStore, queueStore, socketStore, uiStore
├── services/         apiClient, tokenService, queueService, stationService, departmentService, staffService, analyticsService
├── hooks/            useAuth, useSocket, useQueue, useToken, useStations, useAnalytics
├── lib/              firebase.ts (PLACEHOLDER), socket.ts (PLACEHOLDER), queryClient.ts, utils.ts
├── types/            api.types.ts, auth.types.ts, queue.types.ts, socket.types.ts
├── router/           index.tsx, ProtectedRoute.tsx, routes.ts
└── styles/           index.css (Tailwind + CSS variables)
```

---

## 12. What to Generate

When building any screen, follow this hierarchy:

1. **Layout first** — wrap the page in the correct Layout component for the role
2. **PageHeader** — title + action buttons as per wireframe
3. **Break into sections** — each visual block is a component, not inline JSX in the page file
4. **Data via hooks** — call `useQueue`, `useToken`, `useAnalytics` etc. from the page; pass data down as props
5. **Forms via React Hook Form** — never `useState` for form fields
6. **Mutations via TanStack Query `useMutation`** — call service functions, invalidate query keys on success
7. **Real-time via useSocket** — subscribe to relevant socket events in the hook, invalidate queries on event
8. **Placeholder stubs for Firebase + Socket** — use `lib/firebase.ts` and `lib/socket.ts` as the only integration points; never call Firebase SDK directly in components

Generate **one file per component**. Never put multiple exported components in one file. Common components must be reused — never duplicated.
