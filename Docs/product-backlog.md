# CareQ — MVP Product Backlog

**Project:** CareQ — Hospital OPD Smart Queue System  
**Version:** MVP v1.0  
**Domain:** Healthcare — Sri Lanka Public Hospital System  
**Scope:** Single hospital, multi-department OPD queue management

---

## Overview

CareQ replaces paper-based token distribution and manual OPD queue management with a real-time digital platform. The MVP covers four user roles — **Patient**, **Triage Nurse**, **Doctor**, and **Administrator** — across a web-based staff dashboard and a patient-facing browser experience (no app install required).

---

## Epic 1 — Patient Token Registration & Queue Tracking

### Must Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-P01 | As a patient, I want to scan a QR code to open the registration page without installing an app | QR links to `careq.com/register/:deptSlug` and opens in any mobile browser |
| US-P02 | As a patient, I want to enter my phone number and name to receive a digital token | Form has exactly 2 required inputs (phone in E.164 format, name optional) + department shown as read-only header |
| US-P03 | As a patient, I want to see my token number, position, and estimated wait time immediately after registering | Token confirmation screen renders within 3 seconds; shows TKN-XXX, position, and estimated minutes |
| US-P04 | As a patient, I want my position and estimated wait to update live without refreshing | Socket.io `queue:updated` event updates UI within 2 seconds of any queue change |
| US-P05 | As a patient, I want a browser push notification when I am 2 positions from the front | Notification fires at position ≤ 2 via FCM; text: "You are almost up — please be ready" |
| US-P06 | As a patient, I want to see which station I should go to when called | Push notification and on-screen banner show "Proceed to Station X" with station name |
| US-P08 | As a patient, I want the waiting room public display to update with my token when called | Public display page shows called token + station number within 2 seconds |
| US-P10 | As a patient, I want a simple, minimal registration flow | Max 3 user interactions from page load to token issued |

### Should Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-P07 | As a patient without data, I want an SMS notification at the same trigger points | SMS sent via provider when FCM token is absent; falls back gracefully |
| US-P09 | As a patient with limited mobility, I want a family member to register on my behalf | Registration page is accessible and does not require account login |

---

## Epic 2 — Triage Nurse Console

### Must Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-N01 | As a triage nurse, I want a live list of all waiting patients sorted by priority then arrival | Sorted set rendered from `GET /queue/:deptId`; updates on `queue:updated` socket event |
| US-N02 | As a triage nurse, I want each patient row to show their elapsed wait time | Wait time displayed in minutes next to patient name; colour-coded when approaching SLA |
| US-N03 | As a triage nurse, I want to mark a patient as Emergency priority with one confirmed action | Single button click opens confirmation dialog; on confirm, PATCH `/tokens/:id/priority` with `priority: 0` |
| US-N04 | As a triage nurse, I want to register a new token on behalf of a patient who cannot self-register | "Register on behalf" button in triage console opens inline token creation form |
| US-N05 | As a triage nurse, I want to mark a patient as No Show | Action available from patient row; triggers PATCH `/tokens/:id/status` with `status: NO_SHOW` |
| US-N06 | As a triage nurse, I want a red SLA alert badge on any patient who has exceeded the threshold | `sla:breach` socket event adds red badge; badge persists until nurse acknowledges or patient is called |
| US-N08 | As a triage nurse, I want the console to update in real time without page refresh | All queue changes delivered via Socket.io; no polling |

### Should Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-N07 | As a triage nurse, I want to assign a patient to a specific doctor station | Station assignment dropdown on patient row; calls PATCH `/tokens/:id/status` with `stationId` |
| US-N09 | As a triage nurse, I want to set Urgent priority (between Normal and Emergency) | Priority selector supports values 0 (Emergency), 1 (Urgent), 2 (Normal) |

### Could Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-N10 | As a triage nurse, I want to view patient registration details by clicking a token row | Drawer/modal shows full name, phone (masked), issuance time, current status |

---

## Epic 3 — Doctor Station Interface

### Must Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-D01 | As a doctor, I want to see the next patient in my station queue | `GET /stations/:id/next` displays token number, first name, and priority flag |
| US-D02 | As a doctor, I want to call the next patient with a single button | "Call Next Patient" button calls PATCH `/tokens/:id/status` with `status: CALLED` and triggers FCM push + public display update |
| US-D03 | As a doctor, I want to see a prominent Emergency flag before calling an emergency patient | Red "EMERGENCY" badge shown on next-patient card; visible before call button is pressed |
| US-D04 | As a doctor, I want to mark a consultation as complete with one click | "Consultation Complete" button calls PATCH `/tokens/:id/status` with `status: COMPLETED` |
| US-D05 | As a doctor, I want to pause my station when taking a break | "Pause Station" toggle calls PATCH `/stations/:id/status` with `isPaused: true`; station receives no new assignments while paused |

### Should Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-D06 | As a doctor, I want to see how many patients are waiting in my station's queue | Patient count badge shown in station header from `GET /queue/:deptId/stats` |
| US-D07 | As a doctor, I want to mark a no-show directly from the station view | "No Show" secondary action available on current patient card |

---

## Epic 4 — Administrator Dashboard

### Must Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-A01 | As an admin, I want a live dashboard showing queue depth across all active departments | KPI cards: Active Queues, Active Stations, Total Patients Today, Avg. Wait Time; bar chart of queue depth by department |
| US-A02 | As an admin, I want analytics on average wait time by hour for a selected date range | Line chart with Morning / Afternoon / Evening series; filterable by department and date range |
| US-A03 | As an admin, I want to see the SLA breach rate by department and date | Stats section: breach count + percentage; filterable by department and date range |
| US-A04 | As an admin, I want to generate a PDF daily report | "Generate Report" button triggers `GET /analytics/report?date=...`; downloads PDF covering all key metrics |
| US-A05 | As an admin, I want to configure the SLA threshold for each department | Configuration table: department name + editable SLA minutes input + Save button per row |
| US-A06 | As an admin, I want to create staff accounts with assigned roles | "Add New Staff" button opens form: name, email, role (nurse/doctor/admin), department |
| US-A07 | As an admin, I want to deactivate staff accounts | Deactivate action on each staff row in the staff table; account access revoked immediately |
| US-A08 | As an admin, I want to view the full event history for any patient token | Audit log search: enter token ID, returns chronological event list from `GET /tokens/:id/events` |

### Should Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-A09 | As an admin, I want to see which doctor stations are active and their throughput today | Stations page shows active/paused status per station with patients-served-today count |

### Could Have

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-A10 | As an admin, I want to export analytics data as CSV | Export button on analytics page; calls `GET /analytics/export?format=csv` |

---

## Epic 5 — Authentication & Access Control

### Must Have

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-AC-01 | Patients must not be required to log in to register or view their queue status | Public routes: `/register/:deptSlug`, `/token/:tokenId` |
| FR-AC-02 | Staff must authenticate via Firebase email/password before accessing any staff interface | Firebase Auth → JWT → server RBAC middleware |
| FR-AC-03 | A doctor may only see queue data for their assigned station and department | RBAC enforced at API level; frontend hides non-relevant navigation |
| FR-AC-04 | A triage nurse may only view and manage their assigned department | Department scoped on login; passed in API calls |
| FR-AC-05 | Only admin may create or deactivate staff accounts | "Staff" nav item hidden for nurse/doctor roles |
| FR-AC-06 | Only admin may change SLA threshold configuration | "Configuration" nav item hidden for nurse/doctor roles |
| FR-AC-07 | Triage nurse may not access analytics or generate reports | Route-level guard redirects to triage console |
| FR-AC-08 | Doctor may not access triage console, audit log, or analytics | Route-level guard redirects to station page |

---

## Epic 6 — Public Waiting Room Display

### Must Have

| ID | Requirement | Notes |
|----|-------------|-------|
| PD-01 | A public display page renders the current token being called and the station number | Route: `/display/:deptId`; no auth required; fullscreen optimised |
| PD-02 | Display updates within 2 seconds of patient being called | Subscribes to `display:{deptId}` socket room |
| PD-03 | Display must be readable at 5 metres | Large typography (minimum 10rem for token number); high contrast |

---

## Epic 7 — Real-Time Infrastructure (Placeholder Scope)

### Must Have

| ID | Requirement | Notes |
|----|-------------|-------|
| RT-01 | Socket.io client connects on staff login and patient token page load | Placeholder: `socket.connect()` with auth token header |
| RT-02 | Client joins relevant rooms on connection | Staff: `dept:{deptId}:queue`, `admin:alerts`; Patient: `token:{tokenId}`, `display:{deptId}` |
| RT-03 | Queue updates broadcast within 2 seconds of server-side change | Handled by server; frontend listens for `queue:updated` |
| RT-04 | SLA breach alerts appear on triage console without page refresh | Client listens for `sla:breach` event on `admin:alerts` room |

---

## Functional Requirements Traceability (MVP Must Haves)

| FR ID | Description | Epic |
|-------|-------------|------|
| FR-TM-01 to FR-TM-10 | Full token lifecycle: create, priority change, status transitions, timestamps | Epic 1, 2, 3 |
| FR-QM-01 to FR-QM-06, FR-QM-08 | Queue ordering, position updates, wait time estimation, station pause, department isolation | Epic 2, 3 |
| FR-NC-01 to FR-NC-07 | Push notifications, SMS fallback, public display updates, SLA alerts | Epic 1, 6 |
| FR-SL-01 to FR-SL-07 | SLA threshold config, breach detection, audit recording, triage alerts | Epic 2, 4 |
| FR-AU-01 to FR-AU-05 | Immutable audit log, event recording, admin access only | Epic 4 |
| FR-AR-01 to FR-AR-05 | Live dashboard, wait time charts, SLA breach analytics, PDF report | Epic 4 |
| FR-AC-01 to FR-AC-08 | Role-based access control across all interfaces | Epic 5 |

---

## Non-Functional Requirements (MVP Constraints)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PF-01 | Queue updates propagate within 2 seconds | ≤ 2s |
| NFR-PF-03 | Token registration completes within 3 seconds | ≤ 3s |
| NFR-PF-04 | Support 200 concurrent patient sessions per department | 200 concurrent |
| NFR-US-01 | Patient registration requires ≤ 3 user inputs | 3 fields |
| NFR-US-02 | Patient page works on any mobile browser without app install | PWA / browser-native |
| NFR-US-04 | Nurse can mark emergency within 3 interactions | ≤ 3 clicks |
| NFR-US-05 | Doctor can call next and mark complete in 1 click each | 1 click each |
| NFR-US-06 | All staff interfaces work on 10-inch tablet without horizontal scroll | Responsive |
| NFR-SP-01 | Patient phone numbers never shown on public display | Masked/hidden |
| NFR-SP-02 | All traffic over TLS | HTTPS + WSS |
| NFR-SP-03 | Staff auth tokens expire after 8 hours of inactivity | Firebase session |

---

## Out of Scope (MVP v1)

- Inpatient ward management
- Medical records, prescriptions, lab orders
- Billing and payment processing
- Multi-hospital federation
- Appointment scheduling
- National Health Information System integration
- Sinhala language localisation (deferred to post-MVP)
- CSV analytics export (Could Have — deferred)
