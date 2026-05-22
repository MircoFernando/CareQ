# CareQ — Frontend Architecture

**Project:** CareQ — Hospital OPD Smart Queue System  
**Version:** MVP v1.0  
**Framework:** React 18 + TypeScript + Vite  
**Tooling:** Antigravity

---

## 1. Technology Stack

| Layer | Library | Version | Purpose |
|-------|---------|---------|---------|
| Framework | React | 18.x | UI rendering |
| Language | TypeScript | 5.x | Type safety across all files |
| Build tool | Vite | 5.x | Dev server + production bundler |
| Routing | React Router DOM | 6.x | Client-side navigation, route guards |
| State management | Zustand | 4.x | Global stores per domain (auth, queue, socket) |
| Server state | TanStack Query (React Query) | 5.x | API data fetching, caching, background refetch |
| Forms | React Hook Form + Zod | 7.x + 3.x | Controlled forms with schema validation |
| Real-time | Socket.io-client | 4.x | WebSocket connection to backend |
| Auth | Firebase JS SDK | 10.x | Email/password login, JWT token, FCM push |
| HTTP client | Axios | 1.x | REST API calls, interceptors for auth header |
| Styling | Tailwind CSS | 3.x | Utility-first; design tokens match wireframes |
| Charts | Recharts | 2.x | Admin analytics charts (line, bar, pie) |
| Icons | Lucide React | 0.x | Consistent icon set across all UIs |
| Date handling | date-fns | 3.x | Wait time calculations, timestamp formatting |
| Toast notifications | React Hot Toast | 2.x | Non-blocking alert feedback |
| Modals / overlays | Radix UI (Dialog, AlertDialog) | 1.x | Accessible confirmation dialogs |

---

## 2. Folder Structure

```
apps/web/
├── src/
│   ├── main.tsx                        # Vite entry — React root, QueryClient, Router
│   ├── App.tsx                         # Root router, auth guard wrapper
│   │
│   ├── layouts/                        # Shell layouts (persistent chrome)
│   │   ├── AdminLayout.tsx             # Sidebar + topbar for admin role
│   │   ├── NurseLayout.tsx             # Sidebar + topbar for triage nurse role
│   │   ├── DoctorLayout.tsx            # Minimal topbar for doctor station view
│   │   └── PublicLayout.tsx            # Bare shell for patient pages (no nav)
│   │
│   ├── pages/                          # One file per route segment
│   │   ├── auth/
│   │   │   └── LoginPage.tsx           # Staff login — Firebase email/password
│   │   ├── patient/
│   │   │   ├── RegisterPage.tsx        # QR landing — patient token registration
│   │   │   └── TokenStatusPage.tsx     # Live queue position + wait time view
│   │   ├── display/
│   │   │   └── PublicDisplayPage.tsx   # Fullscreen waiting room display
│   │   ├── nurse/
│   │   │   └── TriageConsolePage.tsx   # Live queue list + emergency actions
│   │   ├── doctor/
│   │   │   └── StationPage.tsx         # Doctor station — call/complete/pause
│   │   └── admin/
│   │       ├── DashboardPage.tsx       # Live KPI cards + charts overview
│   │       ├── AnalyticsPage.tsx       # Historical charts, date range filters
│   │       ├── ReportsPage.tsx         # PDF report generation
│   │       ├── StationsPage.tsx        # Station status + throughput
│   │       ├── ConfigurationPage.tsx   # SLA thresholds + station management
│   │       ├── StaffPage.tsx           # Staff account list + add/deactivate
│   │       └── AuditLogPage.tsx        # Token event history lookup
│   │
│   ├── components/                     # Reusable UI components
│   │   ├── common/                     # App-wide shared components
│   │   │   ├── AppLogo.tsx             # CareQ logo with cross icon + wordmark
│   │   │   ├── Avatar.tsx              # Staff avatar circle with initials fallback
│   │   │   ├── Badge.tsx               # Status/priority/SLA badge chip
│   │   │   ├── Button.tsx              # Variant-based button (primary, secondary, danger, ghost)
│   │   │   ├── Card.tsx                # Content card with optional header/footer
│   │   │   ├── ConfirmDialog.tsx       # Radix AlertDialog for destructive actions
│   │   │   ├── EmptyState.tsx          # Illustration + message for empty lists
│   │   │   ├── ErrorBoundary.tsx       # React error boundary with fallback UI
│   │   │   ├── Input.tsx               # Controlled input with label + error message
│   │   │   ├── KpiCard.tsx             # Dashboard stat card (label + large number)
│   │   │   ├── LoadingSpinner.tsx      # Centred spinner for async states
│   │   │   ├── PageHeader.tsx          # Page title + optional action slot
│   │   │   ├── Select.tsx              # Accessible select dropdown
│   │   │   ├── Sidebar.tsx             # Role-based navigation sidebar
│   │   │   ├── StatusPill.tsx          # Coloured pill for token status display
│   │   │   ├── Table.tsx               # Generic sortable/scrollable data table
│   │   │   ├── Toggle.tsx              # On/off toggle switch (station active/pause)
│   │   │   └── Topbar.tsx              # Top navigation bar with user info + alerts
│   │   │
│   │   ├── queue/                      # Queue-domain components
│   │   │   ├── QueueTable.tsx          # Full waiting queue list (nurse view)
│   │   │   ├── QueueRow.tsx            # Single row in queue table
│   │   │   ├── PriorityBadge.tsx       # Emergency / Urgent / Normal visual indicator
│   │   │   ├── SlaAlertBadge.tsx       # Red SLA breach alert badge
│   │   │   ├── WaitTimer.tsx           # Live elapsed wait time counter
│   │   │   └── EmergencyActionButton.tsx # Confirm-gated emergency escalation button
│   │   │
│   │   ├── token/                      # Token-domain components
│   │   │   ├── TokenCard.tsx           # Large token number display for patient view
│   │   │   ├── PositionIndicator.tsx   # "Position 11 / Est. Wait 42 min" widget
│   │   │   ├── TokenStatusBanner.tsx   # Called / Completed / No Show banner
│   │   │   └── RegisterForm.tsx        # Patient self-registration form
│   │   │
│   │   ├── station/                    # Doctor station components
│   │   │   ├── CurrentPatientCard.tsx  # "Currently Serving TKN-315 [Liam Johnson]"
│   │   │   ├── NextPatientPreview.tsx  # Upcoming patient with emergency flag
│   │   │   ├── ConsultationTimer.tsx   # Live HH:MM:SS consultation duration
│   │   │   ├── StationActionBar.tsx    # Call Next / Hold / Completed / End / Referral buttons
│   │   │   └── StationStatusBadge.tsx  # Active / Paused pill
│   │   │
│   │   ├── analytics/                  # Admin analytics components
│   │   │   ├── WaitTimeTrendChart.tsx  # Recharts LineChart — Morning/Afternoon/Evening
│   │   │   ├── QueueDepthChart.tsx     # Recharts BarChart — depth by department
│   │   │   ├── VolumeByDayChart.tsx    # Recharts BarChart — patient volume over date range
│   │   │   ├── TopStationsTable.tsx    # Rank, station, throughput, avg consult time
│   │   │   └── DepartmentPieChart.tsx  # Recharts PieChart — volume distribution
│   │   │
│   │   ├── staff/                      # Staff management components
│   │   │   ├── StaffTable.tsx          # Name / Role / Department / Status / Actions
│   │   │   ├── StaffRow.tsx            # Single staff table row
│   │   │   └── AddStaffForm.tsx        # React Hook Form — new staff creation
│   │   │
│   │   └── display/                    # Public display components
│   │       ├── DisplayBoard.tsx        # Fullscreen token + station number
│   │       └── CalledTokenAnnounce.tsx # Animated token reveal on call event
│   │
│   ├── stores/                         # Zustand global state stores
│   │   ├── authStore.ts                # currentUser, role, departmentId, firebaseUser
│   │   ├── queueStore.ts               # queueItems[], slaBreaches[], lastUpdated
│   │   ├── socketStore.ts              # socket instance, connectionStatus, roomList
│   │   └── uiStore.ts                  # sidebarOpen, activeModal, toastQueue
│   │
│   ├── services/                       # API service layer (all Axios calls live here)
│   │   ├── apiClient.ts                # Axios instance — baseURL, auth interceptor, error interceptor
│   │   ├── tokenService.ts             # POST /tokens, GET /tokens/:id, PATCH priority/status, GET events
│   │   ├── queueService.ts             # GET /queue/:deptId, GET /queue/:deptId/estimate, GET /queue/:deptId/stats
│   │   ├── stationService.ts           # GET /stations/:deptId, PATCH /stations/:id/status, GET /stations/:id/next
│   │   ├── departmentService.ts        # GET/POST/PATCH /departments
│   │   ├── staffService.ts             # GET/POST/PATCH /staff
│   │   └── analyticsService.ts         # GET /analytics/dashboard, /analytics/report, /analytics/export
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAuth.ts                  # Auth state subscription from authStore
│   │   ├── useSocket.ts                # Socket.io connection lifecycle + room subscription
│   │   ├── useQueue.ts                 # TanStack Query wrapper for queue data + socket invalidation
│   │   ├── useToken.ts                 # TanStack Query wrapper for single token polling
│   │   ├── useStations.ts              # TanStack Query wrapper for station list
│   │   └── useAnalytics.ts             # TanStack Query wrapper for analytics endpoints
│   │
│   ├── lib/                            # Pure utilities and configuration
│   │   ├── firebase.ts                 # Firebase app init + auth instance + FCM setup (PLACEHOLDER)
│   │   ├── socket.ts                   # Socket.io-client factory — createSocket() (PLACEHOLDER)
│   │   ├── queryClient.ts              # TanStack QueryClient singleton + staleTime defaults
│   │   └── utils.ts                    # formatWaitTime(), getPriorityLabel(), maskPhone(), cn()
│   │
│   ├── types/                          # TypeScript type definitions
│   │   ├── api.types.ts                # API request/response shapes (mirrored from shared package)
│   │   ├── auth.types.ts               # UserRole, FirebaseUser, StaffProfile
│   │   ├── queue.types.ts              # QueueItem, TokenStatus, Priority, SlaBreachEvent
│   │   └── socket.types.ts             # SocketEvent union types, room names
│   │
│   ├── router/                         # React Router configuration
│   │   ├── index.tsx                   # createBrowserRouter — all route definitions
│   │   ├── ProtectedRoute.tsx          # Role-based route guard component
│   │   └── routes.ts                   # Route path constants
│   │
│   └── styles/
│       └── index.css                   # Tailwind base + custom CSS variables
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Design System & Theming

All visual decisions are derived directly from the high-fidelity wireframes. Do not deviate.

### 3.1 Color Tokens

Define these in `tailwind.config.ts` under `theme.extend.colors` and mirror in CSS variables inside `index.css`:

```css
:root {
  /* Brand */
  --color-primary:        #1A8C7A;   /* Teal — CareQ brand, CTAs, active nav */
  --color-primary-dark:   #156D5F;   /* Teal dark — hover state */
  --color-primary-light:  #E6F4F2;   /* Teal tint — active sidebar item bg */

  /* Accent / Surface */
  --color-surface:        #FFFFFF;
  --color-bg:             #F4F6F8;   /* Page background — light grey */
  --color-sidebar-bg:     #FFFFFF;   /* White sidebar */
  --color-sidebar-active: #E6F4F2;   /* Teal tint for active nav item */

  /* Typography */
  --color-text-primary:   #1A1A2E;   /* Near-black headlines */
  --color-text-secondary: #5A6472;   /* Muted body text / labels */
  --color-text-inverse:   #FFFFFF;

  /* Semantic States */
  --color-emergency:      #D9363E;   /* Emergency red — priority 0 */
  --color-urgent:         #E87A2F;   /* Urgent orange — priority 1 */
  --color-normal:         #1A8C7A;   /* Normal teal — priority 2 */
  --color-sla-warning:    #F0A500;   /* SLA breach amber */
  --color-active:         #2ECC71;   /* Active/Online green */
  --color-inactive:       #95A5A6;   /* Inactive/Paused grey */
  --color-deactivated:    #E74C3C;   /* Deactivated account red */

  /* Borders */
  --color-border:         #E2E8F0;
  --color-border-focus:   #1A8C7A;

  /* Charts */
  --color-chart-morning:  #1A8C7A;
  --color-chart-afternoon:#2196F3;
  --color-chart-evening:  #9C27B0;
}
```

### 3.2 Typography

```css
/* Wireframe typeface: clean, medical-grade sans-serif */
font-family: 'DM Sans', 'Nunito Sans', system-ui, sans-serif;

/* Scale (Tailwind classes) */
/* Page titles        */  text-2xl font-bold text-[--color-text-primary]
/* Section headers    */  text-lg font-semibold text-[--color-text-primary]
/* Table headers      */  text-xs font-semibold uppercase tracking-wider text-[--color-text-secondary]
/* Body               */  text-sm text-[--color-text-primary]
/* Muted / labels     */  text-xs text-[--color-text-secondary]
/* Token number hero  */  text-6xl font-black tracking-tight text-[--color-text-primary]
/* KPI card number    */  text-4xl font-bold text-[--color-text-primary]
```

### 3.3 Component Patterns

#### Button Variants

```
Primary:    bg-[--color-primary] text-white hover:bg-[--color-primary-dark] rounded-md px-4 py-2
Secondary:  border border-[--color-border] bg-white text-[--color-text-primary] hover:bg-[--color-bg]
Danger:     bg-[--color-emergency] text-white
Ghost:      text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg]
Icon:       p-2 rounded-md ghost styles
```

#### Badge / Pill Variants

```
Emergency:  bg-red-100 text-red-700 border border-red-300        font-semibold text-xs
Urgent:     bg-orange-100 text-orange-700 border border-orange-300
Normal:     bg-teal-100 text-teal-700 border border-teal-300
SLA Warning: bg-amber-50 text-amber-700 border border-amber-300
Active:     bg-green-100 text-green-700 border border-green-300
Paused:     bg-gray-100 text-gray-600 border border-gray-300
Deactivated: bg-red-100 text-red-600 border border-red-200
```

#### Card

```
bg-white rounded-lg border border-[--color-border] shadow-sm p-6
```

#### Sidebar Item (Active)

```
bg-[--color-sidebar-active] text-[--color-primary] font-medium rounded-md
```

#### Table Row (SLA Breach)

```
bg-red-50 border-l-4 border-red-500          /* highlighted row */
```

#### Table Row (Emergency patient)

```
bg-orange-50 border-l-4 border-orange-400
```

### 3.4 Layout Grid

- Sidebar width: `w-56` (224px) — fixed, not collapsible in MVP
- Content area: `flex-1 overflow-y-auto p-6`
- Topbar height: `h-16`
- Content max-width: `max-w-screen-2xl mx-auto`
- Dashboard KPI row: 4-column grid `grid grid-cols-4 gap-4`
- Analytics split: left 60% charts / right 40% top-stations table

---

## 4. Routing

### 4.1 Route Definitions

```
/login                          → LoginPage          (public)
/register/:deptSlug             → RegisterPage        (public — patient QR landing)
/token/:tokenId                 → TokenStatusPage     (public — patient live view)
/display/:deptId                → PublicDisplayPage   (public — fullscreen TV display)

/nurse/triage                   → TriageConsolePage   (protected: role=nurse)

/doctor/station                 → StationPage         (protected: role=doctor)

/admin                          → redirect → /admin/dashboard
/admin/dashboard                → DashboardPage       (protected: role=admin)
/admin/analytics                → AnalyticsPage       (protected: role=admin)
/admin/reports                  → ReportsPage         (protected: role=admin)
/admin/stations                 → StationsPage        (protected: role=admin)
/admin/configuration            → ConfigurationPage   (protected: role=admin)
/admin/staff                    → StaffPage           (protected: role=admin)
/admin/audit                    → AuditLogPage        (protected: role=admin)
```

### 4.2 ProtectedRoute Logic

```typescript
// router/ProtectedRoute.tsx
// 1. Check authStore.currentUser — if null → redirect to /login
// 2. Check authStore.role against allowedRoles prop
// 3. If role mismatch → redirect to role's home route
// 4. Render <Outlet /> if authorised
```

### 4.3 Role Home Routes

```
admin  → /admin/dashboard
nurse  → /nurse/triage
doctor → /doctor/station
```

---

## 5. State Management (Zustand Stores)

### 5.1 authStore

```typescript
interface AuthStore {
  firebaseUser: FirebaseUser | null;
  staffProfile: StaffProfile | null;     // fetched from DB after Firebase login
  role: 'admin' | 'nurse' | 'doctor' | null;
  departmentId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: FirebaseUser, profile: StaffProfile) => void;
  clearUser: () => void;
}
```

### 5.2 queueStore

```typescript
interface QueueStore {
  queueItems: QueueItem[];               // current waiting list for department
  slaBreaches: string[];                 // tokenIds with active SLA breach
  lastUpdatedAt: Date | null;

  // Actions
  setQueue: (items: QueueItem[]) => void;
  applyQueueUpdate: (event: QueueUpdatedEvent) => void;
  addSlaBreach: (tokenId: string) => void;
  clearSlaBreach: (tokenId: string) => void;
}
```

### 5.3 socketStore

```typescript
interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  joinedRooms: string[];

  // Actions
  connect: (token: string) => void;       // PLACEHOLDER — initialises socket with auth
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}
```

### 5.4 uiStore

```typescript
interface UIStore {
  isSidebarOpen: boolean;
  activeModal: string | null;

  // Actions
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}
```

---

## 6. Service Layer

All HTTP calls are made **exclusively through the service layer**. Pages and components never call Axios directly.

### 6.1 apiClient.ts

```typescript
// PLACEHOLDER
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // e.g. http://localhost:3001/api/v1
  timeout: 10000,
});

// Request interceptor — attach Firebase JWT
apiClient.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error.response?.data?.error ?? error)
);
```

### 6.2 tokenService.ts

```typescript
// PLACEHOLDER — all functions return Promises; implement with apiClient
export const registerToken   = (data: RegisterTokenRequest) => apiClient.post('/tokens', data)
export const getToken        = (id: string) => apiClient.get(`/tokens/${id}`)
export const updatePriority  = (id: string, data: UpdatePriorityRequest) => apiClient.patch(`/tokens/${id}/priority`, data)
export const updateStatus    = (id: string, data: UpdateStatusRequest) => apiClient.patch(`/tokens/${id}/status`, data)
export const getTokenEvents  = (id: string) => apiClient.get(`/tokens/${id}/events`)
```

### 6.3 queueService.ts

```typescript
// PLACEHOLDER
export const getQueue        = (deptId: string) => apiClient.get(`/queue/${deptId}`)
export const getEstimate     = (deptId: string, position: number) => apiClient.get(`/queue/${deptId}/estimate`, { params: { position } })
export const getQueueStats   = (deptId: string) => apiClient.get(`/queue/${deptId}/stats`)
```

### 6.4 analyticsService.ts

```typescript
// PLACEHOLDER
export const getDashboard    = () => apiClient.get('/analytics/dashboard')
export const getWaitTrends   = (params: AnalyticsParams) => apiClient.get('/analytics/wait-trends', { params })
export const getSlaBreaches  = (params: AnalyticsParams) => apiClient.get('/analytics/sla-breaches', { params })
export const generateReport  = (date: string) => apiClient.get('/analytics/report', { params: { date }, responseType: 'blob' })
export const exportCsv       = (params: AnalyticsParams) => apiClient.get('/analytics/export', { params, responseType: 'blob' })
```

---

## 7. TanStack Query Usage

### 7.1 Query Key Conventions

```typescript
// Organised as [resource, ...identifiers, ...filters]
['token', tokenId]
['queue', deptId]
['queueStats', deptId]
['stations', deptId]
['stationNext', stationId]
['analytics', 'dashboard']
['analytics', 'waitTrends', { deptId, dateFrom, dateTo }]
['staff', hospitalId]
['tokenEvents', tokenId]
```

### 7.2 Stale Time Defaults (queryClient.ts)

```typescript
defaultOptions: {
  queries: {
    staleTime: 30_000,         // 30 seconds default
    gcTime: 5 * 60_000,        // 5 minutes cache
    retry: 1,
    refetchOnWindowFocus: false,
  }
}

// Overrides per query type:
// Token status page:      staleTime: 5_000   (5s — patient is watching)
// Queue list (nurse):     staleTime: 0        (always fresh; socket handles updates)
// Analytics charts:       staleTime: 300_000  (5 minutes — historical data)
// Dashboard KPIs:         staleTime: 30_000   (30 seconds — live but not real-time)
```

### 7.3 Socket + Query Integration Pattern

When a socket event arrives, invalidate the relevant query key so TanStack Query refetches:

```typescript
// useQueue.ts
socket.on('queue:updated', () => {
  queryClient.invalidateQueries({ queryKey: ['queue', deptId] })
})

socket.on('sla:breach', (event: SlaBreachEvent) => {
  queueStore.addSlaBreach(event.tokenId)
  queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] })
})
```

---

## 8. Firebase & Socket.io Placeholders

### 8.1 Firebase (lib/firebase.ts)

```typescript
// PLACEHOLDER — replace values with real Firebase project config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            'PLACEHOLDER_API_KEY',
  authDomain:        'PLACEHOLDER.firebaseapp.com',
  projectId:         'PLACEHOLDER_PROJECT_ID',
  storageBucket:     'PLACEHOLDER.appspot.com',
  messagingSenderId: 'PLACEHOLDER_SENDER_ID',
  appId:             'PLACEHOLDER_APP_ID',
};

const app       = initializeApp(firebaseConfig);
export const auth      = getAuth(app);
export const messaging = getMessaging(app);  // Used for FCM push tokens

// Auth flow:
// 1. signInWithEmailAndPassword(auth, email, password)
// 2. On success: auth.currentUser.getIdToken() → send to backend /staff/me for profile
// 3. Store profile + role in authStore
// 4. onAuthStateChanged listener persists session across refresh
```

### 8.2 Socket.io (lib/socket.ts)

```typescript
// PLACEHOLDER — replace URL with real backend socket endpoint
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function createSocket(token: string): Socket {
  // PLACEHOLDER — real implementation connects with Firebase JWT in auth header
  socketInstance = io('PLACEHOLDER_SOCKET_URL', {
    auth: { token },                       // Sent as handshake auth data
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  return socketInstance;
}

export function getSocket(): Socket | null {
  return socketInstance;
}

// Room subscription helpers
export const joinRoom  = (socket: Socket, room: string) => socket.emit('join:room', { room });
export const leaveRoom = (socket: Socket, room: string) => socket.emit('leave:room', { room });

// Socket event names (must match server constants)
export const SOCKET_EVENTS = {
  QUEUE_UPDATED:       'queue:updated',
  SLA_BREACH:          'sla:breach',
  PATIENT_CALLED:      'patient:called',
  PRIORITY_CHANGED:    'priority:changed',
  STATION_STATUS:      'station:status:changed',
} as const;

// Room name builders (must match server room naming)
export const ROOMS = {
  deptQueue:     (deptId: string) => `dept:${deptId}:queue`,
  station:       (stationId: string) => `station:${stationId}`,
  token:         (tokenId: string) => `token:${tokenId}`,
  adminAlerts:   () => `admin:alerts`,
  display:       (deptId: string) => `display:${deptId}`,
};
```

---

## 9. Page-by-Page Component Breakdown

### 9.1 LoginPage

```
<PublicLayout>
  └── <Card>
      ├── <AppLogo />
      ├── <form> (React Hook Form)
      │   ├── <Input name="email" />
      │   ├── <Input name="password" type="password" />
      │   └── <Button type="submit">Sign In</Button>
      └── error message slot
```

### 9.2 RegisterPage (Patient QR Landing)

```
<PublicLayout>
  └── Department name header (from URL param)
      └── <RegisterForm>         ← react-hook-form + zod
          ├── <Input name="patientPhone" />   (E.164 format with country picker)
          ├── <Input name="patientName" optional />
          └── <Button>Join Queue</Button>
              → on success: navigate to /token/:tokenId
```

### 9.3 TokenStatusPage (Patient Live View)

```
<PublicLayout>
  ├── <TokenCard tokenNumber="TKN-315" />          ← large hero display
  ├── <PositionIndicator position={11} estWait={42} />
  ├── <TokenStatusBanner status="WAITING" />        ← updates on socket event
  └── Notification opt-in toggle (FCM permission request)
      useToken(tokenId) — TanStack Query, staleTime 5s
      useSocket → joins room token:{tokenId}
```

### 9.4 PublicDisplayPage

```
No layout — fullscreen
├── <AppLogo /> (top-left, small)
├── <DisplayBoard>
│   ├── "Now Calling" label
│   ├── Token number (giant — text-[10rem] font-black)
│   └── "Please proceed to Station X"
└── useSocket → joins room display:{deptId}
    on PATIENT_CALLED event → <CalledTokenAnnounce /> plays animated reveal
```

### 9.5 TriageConsolePage

```
<NurseLayout>
  <PageHeader title="Triage Console — General OPD">
    <Button variant="primary">Register Patient</Button>
  </PageHeader>
  ├── <QueueTable>
  │   ├── columns: Token, Patient Name, Wait Time, SLA, Emergency, Triage Pri, Actions
  │   ├── <QueueRow> per patient
  │   │   ├── <WaitTimer startedAt={token.issuedAt} />
  │   │   ├── <SlaAlertBadge /> (shown if tokenId in slaBreaches)
  │   │   ├── <PriorityBadge priority={token.priority} />
  │   │   └── action icons: call, hold, notes
  │   └── emergency rows: bg-orange-50 border-l-4 border-orange-400
  └── <EmergencyActionButton />  → opens <ConfirmDialog> before PATCH /priority
  useQueue(deptId) — socket-invalidated
  useSocket → joins dept:{deptId}:queue + admin:alerts
```

### 9.6 StationPage (Doctor)

```
<DoctorLayout>
  <PageHeader>
    Station 12: General OPD Consultation
    <StatusPill>Active</StatusPill>
    <Button>Call Next Patient</Button>
    <Button variant="secondary">Log Out Station</Button>
  </PageHeader>
  ├── Left col (45%): <QueueTable waiting list, read-only for doctor>
  ├── Centre col (35%): <CurrentPatientCard>
  │   ├── Token number + patient name (large)
  │   ├── Priority badge (Emergency if applicable)
  │   ├── Vitals placeholder grid
  │   ├── Assessment notes textarea
  │   ├── <ConsultationTimer />
  │   └── <StationActionBar>
  │       Hold | Completed | Start Consultation | End Consultation | Referral
  └── Right col (20%): <StationPerformancePanel>
      KPIs: Patients Served Today, Avg Service Time, SLA Breaches, Efficiency Score
      Quick links: Station Settings, Station History, Logout
      <RecentAlertsFeed />  ← latest emergency/SLA events
  useStations, useQueue — TanStack Query
  useSocket → joins station:{stationId}
```

### 9.7 DashboardPage (Admin)

```
<AdminLayout>
  <PageHeader title="CareQ Admin Dashboard - Live Overview" />
  ├── KPI row (4 cards): Active Queues, Active Stations, Total Patients Today, Avg. Wait Time
  │   <KpiCard> × 4
  ├── Bottom row (2 panels):
  │   ├── Left: <QueueDepthChart />   (Recharts BarChart — horizontal)
  │   └── Right: <LiveAlertsFeed />   (SLA + Emergency escalation events)
  useAnalytics('dashboard') — TanStack Query, staleTime 30s
  useSocket → joins admin:alerts (for live alert feed)
```

### 9.8 AnalyticsPage (Admin)

```
<AdminLayout>
  <PageHeader title="Historical Performance & Reporting">
    <DateRangePicker />
    <Select name="dateShift" />
    <Button>Report</Button>
    <Button>PDF/CSV</Button>
  </PageHeader>
  ├── <WaitTimeTrendChart />             (Line — Morning / Afternoon / Evening)
  ├── Bottom row:
  │   ├── Left: <DepartmentPieChart />
  │   └── Right: <TopStationsTable />
  useAnalytics('waitTrends', filters) — TanStack Query
```

### 9.9 ConfigurationPage (Admin)

```
<AdminLayout>
  <PageHeader title="System Settings & SLA Configuration" />
  ├── Section: OPD Departments
  │   <Table>
  │   columns: Department | SLA Wait Time Threshold (min) | Save
  │   each row: <Input type="number" /> + <Button>Save</Button>
  └── Section: Doctor Station Management
      <Table>
      columns: Station | Active (toggle) | Inactive
      <Toggle /> per station row
```

### 9.10 StaffPage (Admin)

```
<AdminLayout>
  <PageHeader title="Staff Accounts & User Management">
    <Button variant="primary">+ Add New Staff</Button>
  </PageHeader>
  ├── <Input type="search" placeholder="Search" />
  └── <StaffTable>
      columns: Name ↑↓ | Role ↑↓ | Department ↑↓ | Status ↑↓ | Actions
      <StaffRow> per staff member
        Status: <StatusPill> Active / Deactivated
        Actions: Edit | Deactivate buttons
      → "Add New Staff" opens <AddStaffForm> in a modal (Radix Dialog)
```

---

## 10. Data Flow Summary

```
User action
  → Page/Component calls hook (useQueue, useToken, etc.)
    → Hook calls service function (queueService.getQueue)
      → Service calls apiClient (Axios → Express API)
        → Server responds
          → TanStack Query caches response
            → Component re-renders with new data

Parallel real-time path:
  Socket.io server broadcasts event (e.g. queue:updated)
    → useSocket listener fires
      → invalidates TanStack Query key
        → Query refetches from API
          → Zustand store updated (queueStore.applyQueueUpdate)
            → Component re-renders
```

---

## 11. Environment Variables

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_SOCKET_URL=http://localhost:3001

# Firebase (PLACEHOLDER — fill from Firebase console)
VITE_FIREBASE_API_KEY=PLACEHOLDER
VITE_FIREBASE_AUTH_DOMAIN=PLACEHOLDER
VITE_FIREBASE_PROJECT_ID=PLACEHOLDER
VITE_FIREBASE_STORAGE_BUCKET=PLACEHOLDER
VITE_FIREBASE_MESSAGING_SENDER_ID=PLACEHOLDER
VITE_FIREBASE_APP_ID=PLACEHOLDER
```

---

## 12. Key Conventions

- **No inline API calls.** Every HTTP request goes through the service layer.
- **No direct Zustand store writes in components.** Components call actions only.
- **TanStack Query owns server state.** Zustand stores own UI state and socket-derived state only.
- **Socket events invalidate queries.** Never manually merge socket payloads into query cache.
- **React Hook Form + Zod for all forms.** Never use uncontrolled `useState` for form fields.
- **Shared components are in `components/common/`.** Never duplicate layout primitives in page files.
- **Role guards at router level.** Never hide nav items as the only protection; always guard routes too.
- **TypeScript strict mode.** No `any`. All API response shapes typed in `types/api.types.ts`.
