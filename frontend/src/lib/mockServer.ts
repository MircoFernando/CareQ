import { Department, Station, TokenDetail, TokenEvent, Priority, TokenStatus } from '../types/queue.types';
import { StaffProfile } from '../types/auth.types';
import { DashboardKpisResponse, WaitTrendItem, CreateStaffRequest } from '../types/api.types';

// Native browser-based cross-tab communication for demo mode
const realtimeChannel = typeof window !== 'undefined' ? new BroadcastChannel('careq_mock_realtime') : null;

// Initial Seeding Data
const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept-opd', name: 'General OPD', slug: 'general-opd', slaMinutes: 20, isActive: true },
  { id: 'dept-cardio', name: 'Cardiology', slug: 'cardiology', slaMinutes: 30, isActive: true },
  { id: 'dept-peds', name: 'Pediatrics', slug: 'pediatrics', slaMinutes: 15, isActive: true },
];

const DEFAULT_STATIONS: Station[] = [
  { id: 'st-1', name: 'Station 1', departmentId: 'dept-opd', isPaused: false, activeDoctorName: 'Dr. Aris P.', patientsServedCountToday: 18, averageServiceMinutesToday: 8, slaBreachCountToday: 2, efficiencyScore: 92 },
  { id: 'st-2', name: 'Station 2', departmentId: 'dept-opd', isPaused: false, activeDoctorName: 'Dr. John Doe', patientsServedCountToday: 14, averageServiceMinutesToday: 11, slaBreachCountToday: 4, efficiencyScore: 84 },
  { id: 'st-3', name: 'Station 3', departmentId: 'dept-opd', isPaused: true, activeDoctorName: 'Dr. Sarah Connor', patientsServedCountToday: 8, averageServiceMinutesToday: 9, slaBreachCountToday: 1, efficiencyScore: 88 },
  { id: 'st-4', name: 'Station 4', departmentId: 'dept-cardio', isPaused: false, activeDoctorName: 'Dr. Elizabeth Blackwell', patientsServedCountToday: 12, averageServiceMinutesToday: 15, slaBreachCountToday: 0, efficiencyScore: 96 },
  { id: 'st-5', name: 'Station 5', departmentId: 'dept-cardio', isPaused: false, activeDoctorName: 'Dr. Robert Liston', patientsServedCountToday: 9, averageServiceMinutesToday: 22, slaBreachCountToday: 3, efficiencyScore: 78 },
  { id: 'st-6', name: 'Station 6', departmentId: 'dept-peds', isPaused: false, activeDoctorName: 'Dr. Virginia Apgar', patientsServedCountToday: 21, averageServiceMinutesToday: 6, slaBreachCountToday: 1, efficiencyScore: 94 },
];

const DEFAULT_STAFF: StaffProfile[] = [
  { id: 'staff-admin', firebaseUid: 'uid-admin', name: 'Super Admin', email: 'admin@hospital.lk', role: 'admin', departmentId: null, hospitalId: 'hosp-1', isActive: true },
  { id: 'staff-nurse-1', firebaseUid: 'uid-nurse-1', name: 'Nurse Nimalee', email: 'nurse@hospital.lk', role: 'nurse', departmentId: 'dept-opd', hospitalId: 'hosp-1', isActive: true },
  { id: 'staff-doctor-1', firebaseUid: 'uid-doctor-1', name: 'Dr. Aris P.', email: 'doctor@hospital.lk', role: 'doctor', departmentId: 'dept-opd', hospitalId: 'hosp-1', isActive: true },
];

// Seed initial waiting patients with relative timestamps
const now = new Date();
const minutesAgo = (min: number) => new Date(now.getTime() - min * 60 * 1000).toISOString();

const DEFAULT_TOKENS: TokenDetail[] = [
  {
    tokenId: 'tok-1',
    tokenNumber: 'TKN-101',
    patientName: 'Kavindu',
    patientPhone: '+94771234101',
    priority: 0, // Emergency
    position: 1,
    status: 'WAITING',
    waitMinutes: 12,
    estimatedWaitMinutes: 3,
    issuedAt: minutesAgo(12),
    departmentId: 'dept-opd',
    stationId: null,
    calledAt: null,
    completedAt: null
  },
  {
    tokenId: 'tok-2',
    tokenNumber: 'TKN-102',
    patientName: 'Priyantha',
    patientPhone: '+94771234102',
    priority: 1, // Urgent
    position: 2,
    status: 'WAITING',
    waitMinutes: 28, // Breaches General OPD SLA (20m)
    estimatedWaitMinutes: 8,
    issuedAt: minutesAgo(28),
    departmentId: 'dept-opd',
    stationId: null,
    calledAt: null,
    completedAt: null
  },
  {
    tokenId: 'tok-3',
    tokenNumber: 'TKN-103',
    patientName: 'Dilani',
    patientPhone: '+94771234103',
    priority: 2, // Normal
    position: 3,
    status: 'WAITING',
    waitMinutes: 15,
    estimatedWaitMinutes: 14,
    issuedAt: minutesAgo(15),
    departmentId: 'dept-opd',
    stationId: null,
    calledAt: null,
    completedAt: null
  },
  {
    tokenId: 'tok-4',
    tokenNumber: 'TKN-104',
    patientName: 'Mohamed',
    patientPhone: '+94771234104',
    priority: 2,
    position: 4,
    status: 'WAITING',
    waitMinutes: 5,
    estimatedWaitMinutes: 19,
    issuedAt: minutesAgo(5),
    departmentId: 'dept-opd',
    stationId: null,
    calledAt: null,
    completedAt: null
  },
  {
    tokenId: 'tok-cardio-1',
    tokenNumber: 'TKN-201',
    patientName: 'Suresh',
    patientPhone: '+94771234201',
    priority: 1,
    position: 1,
    status: 'WAITING',
    waitMinutes: 8,
    estimatedWaitMinutes: 15,
    issuedAt: minutesAgo(8),
    departmentId: 'dept-cardio',
    stationId: null,
    calledAt: null,
    completedAt: null
  }
];

const DEFAULT_EVENTS: TokenEvent[] = [
  { id: 'evt-1', eventType: 'TOKEN_ISSUED', actorId: null, actorName: null, payload: {}, createdAt: minutesAgo(12) },
  { id: 'evt-2', eventType: 'PRIORITY_CHANGED', actorId: 'staff-nurse-1', actorName: 'Nurse Nimalee', payload: { oldPriority: 2, newPriority: 0, reason: 'Severe breathing difficulties' }, createdAt: minutesAgo(10) }
];

// Helper database manager (wraps localStorage with fallback)
class MockDatabase {
  private get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const val = localStorage.getItem(`careq_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  }

  private set(key: string, data: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`careq_${key}`, JSON.stringify(data));
    }
  }

  get departments(): Department[] { return this.get('departments', DEFAULT_DEPARTMENTS); }
  set departments(val: Department[]) { this.set('departments', val); }

  get stations(): Station[] { return this.get('stations', DEFAULT_STATIONS); }
  set stations(val: Station[]) { this.set('stations', val); }

  get staff(): StaffProfile[] { return this.get('staff', DEFAULT_STAFF); }
  set staff(val: StaffProfile[]) { this.set('staff', val); }

  get tokens(): TokenDetail[] { return this.get('tokens', DEFAULT_TOKENS); }
  set tokens(val: TokenDetail[]) { this.set('tokens', val); }

  get events(): TokenEvent[] { return this.get('events', DEFAULT_EVENTS); }
  set events(val: TokenEvent[]) { this.set('events', val); }

  get demoMode(): boolean { return this.get('demo_mode', true); }
  set demoMode(val: boolean) { this.set('demo_mode', val); }

  reset() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('careq_departments');
      localStorage.removeItem('careq_stations');
      localStorage.removeItem('careq_staff');
      localStorage.removeItem('careq_tokens');
      localStorage.removeItem('careq_events');
    }
  }
}

export const db = new MockDatabase();

// Centralized Socket Broadcast Helper
export function broadcastEvent(event: string, payload: any) {
  if (realtimeChannel) {
    realtimeChannel.postMessage({ event, payload });
  }
  // Dispatch local window event so the active tab handles it immediately
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent('careq_mock_socket_event', { detail: { event, payload } });
    window.dispatchEvent(customEvent);
  }
}

// Recalculates waiting queue position index and wait estimations
export function recalculateQueuePositions(deptId: string) {
  const allTokens = db.tokens;
  
  // Filter active waiting queue
  const waitingQueue = allTokens
    .filter(t => t.departmentId === deptId && t.status === 'WAITING')
    .sort((a, b) => {
      // 1. Priority sorting (0: Emergency, 1: Urgent, 2: Normal)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // 2. FIFO sorting by issue timestamp within same priority
      return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
    });

  // Re-map position and estimated wait times
  const activeStations = db.stations.filter(s => s.departmentId === deptId && !s.isPaused).length || 1;
  const minutesPerPatient = 8; // average consultation duration assumption

  waitingQueue.forEach((token, index) => {
    token.position = index + 1;
    // Estimated wait time formula: (Position / Active Stations) * 8 mins
    token.estimatedWaitMinutes = Math.max(1, Math.ceil(((index + 1) / activeStations) * minutesPerPatient));
  });

  // Save back to db
  db.tokens = allTokens.map(t => {
    const updated = waitingQueue.find(wq => wq.tokenId === t.tokenId);
    return updated ? updated : t;
  });

  // Broadcast updated queue state
  const totalWaiting = waitingQueue.length;
  broadcastEvent('queue:updated', {
    departmentId: deptId,
    queue: waitingQueue.map(t => ({
      tokenId: t.tokenId,
      tokenNumber: t.tokenNumber,
      patientName: t.patientName,
      priority: t.priority,
      position: t.position,
      waitMinutes: Math.floor((Date.now() - new Date(t.issuedAt).getTime()) / 60000),
      estimatedWaitMinutes: t.estimatedWaitMinutes,
      issuedAt: t.issuedAt
    })),
    totalWaiting,
    timestamp: new Date().toISOString()
  });
}

// Background Task SLA Breach Checker Loop
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (!db.demoMode) return;
    
    const allTokens = db.tokens;
    const allDepts = db.departments;
    let updated = false;

    allTokens.forEach(t => {
      if (t.status === 'WAITING') {
        const dept = allDepts.find(d => d.id === t.departmentId);
        if (dept) {
          const elapsedMin = Math.floor((Date.now() - new Date(t.issuedAt).getTime()) / 60000);
          t.waitMinutes = elapsedMin;
          
          const breachedAlready = db.events.some(e => e.eventType === 'SLA_BREACHED' && e.payload.tokenId === t.tokenId);
          
          if (elapsedMin > dept.slaMinutes && !breachedAlready) {
            // Trigger SLA Breach!
            const newEvent: TokenEvent = {
              id: `evt-sla-${Date.now()}-${t.tokenId}`,
              eventType: 'SLA_BREACHED',
              actorId: null,
              actorName: null,
              payload: { tokenId: t.tokenId, tokenNumber: t.tokenNumber, waitMinutes: elapsedMin },
              createdAt: new Date().toISOString()
            };
            db.events = [newEvent, ...db.events];
            
            // Broadcast Breach Event
            broadcastEvent('sla:breach', {
              tokenId: t.tokenId,
              tokenNumber: t.tokenNumber,
              patientName: t.patientName,
              waitMinutes: elapsedMin,
              departmentId: t.departmentId
            });
            updated = true;
          }
        }
      }
    });

    if (updated) {
      db.tokens = allTokens;
    }
  }, 15000); // Check every 15 seconds
}

// Mock Endpoint Actions Implementation
export const mockServer = {
  // --- AUTH ENDPOINTS ---
  login: async (email: string): Promise<{ user: any, profile: StaffProfile }> => {
    const profile = db.staff.find(s => s.email === email && s.isActive);
    if (!profile) {
      throw { code: 'auth/user-not-found', message: 'User account deactivated or not found.' };
    }
    const user = { uid: profile.firebaseUid, email: profile.email, displayName: profile.name };
    return { user, profile };
  },

  // --- TOKEN ENDPOINTS ---
  registerToken: async (data: { patientName?: string, patientPhone: string, departmentId: string }): Promise<any> => {
    const allTokens = db.tokens;
    const dept = db.departments.find(d => d.id === data.departmentId);
    if (!dept) throw { code: 'DEPT_NOT_FOUND', message: 'Department not found' };

    // Find highest token number for this department today
    const deptTokens = allTokens.filter(t => t.departmentId === data.departmentId);
    const count = deptTokens.length + 101; // sequence starting at TKN-101
    const tokenNumber = `TKN-${count}`;
    const tokenId = `tok-${Date.now()}`;

    const newToken: TokenDetail = {
      tokenId,
      tokenNumber,
      patientName: data.patientName || 'Anonymous',
      patientPhone: data.patientPhone,
      priority: 2, // Normal default
      position: 99, // Temp, recalculated below
      status: 'WAITING',
      waitMinutes: 0,
      estimatedWaitMinutes: 10,
      issuedAt: new Date().toISOString(),
      departmentId: data.departmentId,
      stationId: null,
      calledAt: null,
      completedAt: null
    };

    db.tokens = [...allTokens, newToken];
    
    // Add issuance event
    const newEvent: TokenEvent = {
      id: `evt-${Date.now()}`,
      eventType: 'TOKEN_ISSUED',
      actorId: null,
      actorName: null,
      payload: { tokenNumber },
      createdAt: newToken.issuedAt
    };
    db.events = [newEvent, ...db.events];

    recalculateQueuePositions(data.departmentId);

    const reloaded = db.tokens.find(t => t.tokenId === tokenId)!;

    return {
      tokenId: reloaded.tokenId,
      tokenNumber: reloaded.tokenNumber,
      position: reloaded.position,
      estimatedWaitMinutes: reloaded.estimatedWaitMinutes,
      departmentId: reloaded.departmentId,
      issuedAt: reloaded.issuedAt
    };
  },

  getToken: async (id: string): Promise<TokenDetail> => {
    const t = db.tokens.find(token => token.tokenId === id);
    if (!t) throw { code: 'TOKEN_NOT_FOUND', message: 'Token not found' };
    t.waitMinutes = Math.floor((Date.now() - new Date(t.issuedAt).getTime()) / 60000);
    return t;
  },

  updatePriority: async (id: string, data: { priority: Priority, reason: string }, actor: StaffProfile): Promise<TokenDetail> => {
    const all = db.tokens;
    const idx = all.findIndex(t => t.tokenId === id);
    if (idx === -1) throw { code: 'TOKEN_NOT_FOUND', message: 'Token not found' };

    const oldPri = all[idx].priority;
    all[idx].priority = data.priority;
    db.tokens = all;

    const event: TokenEvent = {
      id: `evt-${Date.now()}`,
      eventType: 'PRIORITY_CHANGED',
      actorId: actor.id,
      actorName: actor.name,
      payload: { oldPriority: oldPri, newPriority: data.priority, reason: data.reason },
      createdAt: new Date().toISOString()
    };
    db.events = [event, ...db.events];

    recalculateQueuePositions(all[idx].departmentId);

    // Broadcast priority change event
    broadcastEvent('priority:changed', {
      tokenId: id,
      oldPriority: oldPri,
      newPriority: data.priority
    });

    if (data.priority === 0) {
      // Broadcast emergency alert to admin alerts room
      broadcastEvent('sla:breach', {
        tokenId: id,
        tokenNumber: all[idx].tokenNumber,
        patientName: all[idx].patientName,
        waitMinutes: all[idx].waitMinutes,
        departmentId: all[idx].departmentId
      });
    }

    return all[idx];
  },

  updateStatus: async (id: string, data: { status: TokenStatus, stationId?: string }, actor: StaffProfile): Promise<TokenDetail> => {
    const all = db.tokens;
    const idx = all.findIndex(t => t.tokenId === id);
    if (idx === -1) throw { code: 'TOKEN_NOT_FOUND', message: 'Token not found' };

    const token = all[idx];
    token.status = data.status;

    if (data.status === 'CALLED') {
      token.calledAt = new Date().toISOString();
      token.stationId = data.stationId || actor.departmentId; // Fallback or direct stationId assignment

      const station = db.stations.find(s => s.id === data.stationId);
      if (station) {
        token.stationName = station.name;
        // Associate the token to the station
        db.stations = db.stations.map(s => s.id === station.id ? { ...s, currentServedTokenId: id, currentServedTokenNumber: token.tokenNumber } : s);
      }

      // Add event
      const event: TokenEvent = {
        id: `evt-${Date.now()}`,
        eventType: 'PATIENT_CALLED',
        actorId: actor.id,
        actorName: actor.name,
        payload: { stationId: token.stationId, stationName: token.stationName },
        createdAt: new Date().toISOString()
      };
      db.events = [event, ...db.events];

      // Broadcast events
      broadcastEvent('patient:called', {
        tokenId: id,
        tokenNumber: token.tokenNumber,
        stationId: token.stationId || '',
        stationName: token.stationName || 'Consultation Station'
      });

      broadcastEvent('display:called', {
        tokenNumber: token.tokenNumber,
        stationName: token.stationName || 'Consultation Station'
      });
    } else if (data.status === 'IN_CONSULTATION') {
      // consultation started
      const event: TokenEvent = {
        id: `evt-${Date.now()}`,
        eventType: 'IN_CONSULTATION_STARTED',
        actorId: actor.id,
        actorName: actor.name,
        payload: {},
        createdAt: new Date().toISOString()
      };
      db.events = [event, ...db.events];
    } else if (data.status === 'COMPLETED' || data.status === 'NO_SHOW') {
      token.completedAt = new Date().toISOString();
      
      // Clear station association
      if (token.stationId) {
        const station = db.stations.find(s => s.id === token.stationId);
        if (station) {
          db.stations = db.stations.map(s => {
            if (s.id === station.id) {
              const currentServed = s.currentServedTokenId === id;
              const count = currentServed && data.status === 'COMPLETED' ? (s.patientsServedCountToday || 0) + 1 : (s.patientsServedCountToday || 0);
              return {
                ...s,
                currentServedTokenId: currentServed ? null : s.currentServedTokenId,
                currentServedTokenNumber: currentServed ? null : s.currentServedTokenNumber,
                patientsServedCountToday: count
              };
            }
            return s;
          });
        }
      }

      // Add audit event
      const event: TokenEvent = {
        id: `evt-${Date.now()}`,
        eventType: data.status === 'COMPLETED' ? 'CONSULTATION_COMPLETED' : 'NO_SHOW',
        actorId: actor.id,
        actorName: actor.name,
        payload: {},
        createdAt: new Date().toISOString()
      };
      db.events = [event, ...db.events];
    }

    db.tokens = all;
    recalculateQueuePositions(token.departmentId);

    return token;
  },

  getTokenEvents: async (id: string): Promise<TokenEvent[]> => {
    return db.events.filter(e => {
      // Find event related to token: matching by tokenNumber in payload or standard SLA logs
      return e.payload.tokenId === id || e.payload.tokenNumber === db.tokens.find(t => t.tokenId === id)?.tokenNumber || (e.eventType === 'TOKEN_ISSUED' && db.tokens.find(t => t.tokenId === id)?.issuedAt === e.createdAt);
    });
  },

  // --- QUEUE ENDPOINTS ---
  getQueue: async (deptId: string): Promise<any> => {
    const list = db.tokens.filter(t => t.departmentId === deptId && t.status === 'WAITING')
      .map(t => ({
        tokenId: t.tokenId,
        tokenNumber: t.tokenNumber,
        patientName: t.patientName,
        priority: t.priority,
        position: t.position,
        waitMinutes: Math.floor((Date.now() - new Date(t.issuedAt).getTime()) / 60000),
        estimatedWaitMinutes: t.estimatedWaitMinutes,
        issuedAt: t.issuedAt
      }))
      .sort((a, b) => a.position - b.position);

    const activeStations = db.stations.filter(s => s.departmentId === deptId && !s.isPaused).length;

    return {
      departmentId: deptId,
      totalWaiting: list.length,
      activeStations,
      queue: list
    };
  },

  getQueueStats: async (deptId: string): Promise<any> => {
    const tokens = db.tokens.filter(t => t.departmentId === deptId);
    const waiting = tokens.filter(t => t.status === 'WAITING');
    const stations = db.stations.filter(s => s.departmentId === deptId);
    const activeStations = stations.filter(s => !s.isPaused).length;
    const pausedStations = stations.filter(s => s.isPaused).length;

    const completed = tokens.filter(t => t.status === 'COMPLETED' && t.completedAt && t.calledAt);
    let avgWait = 25; // fallback standard
    if (completed.length > 0) {
      const sum = completed.reduce((acc, current) => {
        const wait = Math.floor((new Date(current.calledAt!).getTime() - new Date(current.issuedAt).getTime()) / 60000);
        return acc + wait;
      }, 0);
      avgWait = Math.round(sum / completed.length);
    }

    const dept = db.departments.find(d => d.id === deptId);
    const slaLimit = dept?.slaMinutes || 20;
    const slaBreachCountToday = tokens.filter(t => {
      const elapsed = Math.floor(((t.calledAt ? new Date(t.calledAt).getTime() : Date.now()) - new Date(t.issuedAt).getTime()) / 60000);
      return elapsed > slaLimit;
    }).length;

    const maxWait = waiting.reduce((max, current) => {
      const elapsed = Math.floor((Date.now() - new Date(current.issuedAt).getTime()) / 60000);
      return elapsed > max ? elapsed : max;
    }, 0);

    return {
      totalWaiting: waiting.length,
      activeStations,
      pausedStations,
      avgWaitMinutesLastHour: Math.max(1, avgWait),
      slaBreachCountToday,
      longestCurrentWaitMinutes: maxWait
    };
  },

  // --- STATIONS ENDPOINTS ---
  getStations: async (deptId: string): Promise<Station[]> => {
    return db.stations.filter(s => s.departmentId === deptId);
  },

  updateStationStatus: async (stationId: string, isPaused: boolean): Promise<Station> => {
    db.stations = db.stations.map(s => {
      if (s.id === stationId) {
        const updated = { ...s, isPaused };
        broadcastEvent('station:status:changed', { stationId, stationName: s.name, isPaused });
        setTimeout(() => recalculateQueuePositions(s.departmentId), 100);
        return updated;
      }
      return s;
    });

    return db.stations.find(s => s.id === stationId)!;
  },

  getNextPatient: async (stationId: string): Promise<any> => {
    const station = db.stations.find(s => s.id === stationId);
    if (!station) throw { code: 'STATION_NOT_FOUND', message: 'Station not found' };

    const waiting = db.tokens.filter(t => t.departmentId === station.departmentId && t.status === 'WAITING')
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      });

    if (waiting.length === 0) return null;

    const next = waiting[0];
    return {
      tokenId: next.tokenId,
      tokenNumber: next.tokenNumber,
      patientName: next.patientName,
      priority: next.priority,
      isEmergency: next.priority === 0,
      waitMinutes: Math.floor((Date.now() - new Date(next.issuedAt).getTime()) / 60000),
      position: 1
    };
  },

  // --- DEPARTMENT ENDPOINTS ---
  getDepartments: async (): Promise<Department[]> => {
    return db.departments;
  },

  updateDepartmentSla: async (id: string, slaMinutes: number): Promise<Department> => {
    db.departments = db.departments.map(d => d.id === id ? { ...d, slaMinutes } : d);
    return db.departments.find(d => d.id === id)!;
  },

  // --- STAFF ENDPOINTS ---
  getStaff: async (): Promise<StaffProfile[]> => {
    return db.staff;
  },

  createStaff: async (data: CreateStaffRequest): Promise<StaffProfile> => {
    const newStaff: StaffProfile = {
      id: `staff-${Date.now()}`,
      firebaseUid: `uid-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      departmentId: data.departmentId,
      hospitalId: 'hosp-1',
      isActive: true
    };
    db.staff = [...db.staff, newStaff];
    return newStaff;
  },

  updateStaffStatus: async (id: string, isActive: boolean): Promise<StaffProfile> => {
    db.staff = db.staff.map(s => s.id === id ? { ...s, isActive } : s);
    return db.staff.find(s => s.id === id)!;
  },

  // --- ANALYTICS ENDPOINTS ---
  getDashboardKpis: async (): Promise<DashboardKpisResponse> => {
    const depts = db.departments;
    const stations = db.stations;
    const tokens = db.tokens;

    const activeQueues = depts.filter(d => d.isActive).length;
    const activeStations = stations.filter(s => !s.isPaused).length;
    const totalPatientsToday = tokens.length;
    
    // Average wait calculation
    const completed = tokens.filter(t => t.status === 'COMPLETED' && t.calledAt);
    let avgWait = 18; // default
    if (completed.length > 0) {
      avgWait = Math.round(
        completed.reduce((acc, curr) => acc + Math.floor((new Date(curr.calledAt!).getTime() - new Date(curr.issuedAt).getTime()) / 60000), 0) / completed.length
      );
    }

    const departmentQueueDepths = depts.map(d => ({
      departmentName: d.name,
      waiting: tokens.filter(t => t.departmentId === d.id && t.status === 'WAITING').length
    }));

    // Generate simulated alerts
    const liveAlerts = [
      {
        type: 'SLA_BREACH' as const,
        message: 'SLA Breach: TKN-102 waiting longer than 20 minutes in General OPD',
        timestamp: minutesAgo(2),
        tokenId: 'tok-2'
      }
    ];

    return {
      activeQueues,
      activeStations,
      totalPatientsToday,
      avgWaitMinutesToday: Math.max(1, avgWait),
      departmentQueueDepths,
      liveAlerts
    };
  },

  getWaitTrends: async (): Promise<WaitTrendItem[]> => {
    return [
      { hour: '08:00', morning: 12, afternoon: 0, evening: 0 },
      { hour: '09:00', morning: 18, afternoon: 0, evening: 0 },
      { hour: '10:00', morning: 25, afternoon: 0, evening: 0 },
      { hour: '11:00', morning: 32, afternoon: 0, evening: 0 },
      { hour: '12:00', morning: 0, afternoon: 15, evening: 0 },
      { hour: '13:00', morning: 0, afternoon: 22, evening: 0 },
      { hour: '14:00', morning: 0, afternoon: 28, evening: 0 },
      { hour: '15:00', morning: 0, afternoon: 19, evening: 0 },
      { hour: '16:00', morning: 0, afternoon: 0, evening: 10 },
      { hour: '17:00', morning: 0, afternoon: 0, evening: 18 },
      { hour: '18:00', morning: 0, afternoon: 0, evening: 22 },
    ];
  }
};
