export type TokenStatus = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW';

export type Priority = 0 | 1 | 2; // 0 = Emergency (Red), 1 = Urgent (Orange), 2 = Normal (Teal)

export interface QueueItem {
  tokenId: string;
  tokenNumber: string;
  patientName: string; // first name only in public queue listings
  priority: Priority;
  position: number; // 1-indexed queue position
  waitMinutes: number; // elapsed wait time
  estimatedWaitMinutes: number;
  issuedAt: string; // ISO string
}

export interface TokenDetail extends QueueItem {
  status: TokenStatus;
  departmentId: string;
  departmentName?: string;
  patientPhone: string; // masked in UI (+94771234***) except inside internal staff views
  stationId: string | null;
  stationName?: string | null;
  calledAt: string | null;
  completedAt: string | null;
}

export interface TokenEvent {
  id: string;
  eventType: 'TOKEN_ISSUED' | 'PRIORITY_CHANGED' | 'PATIENT_CALLED' | 'IN_CONSULTATION_STARTED' | 'CONSULTATION_COMPLETED' | 'NO_SHOW' | 'SLA_BREACHED';
  actorId: string | null;
  actorName: string | null;
  payload: Record<string, any>;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  slaMinutes: number;
  isActive: boolean;
}

export interface Station {
  id: string;
  name: string; // e.g. "Station 12"
  departmentId: string;
  isPaused: boolean;
  activeDoctorId?: string | null;
  activeDoctorName?: string | null;
  currentServedTokenId?: string | null;
  currentServedTokenNumber?: string | null;
  patientsServedCountToday?: number;
  averageServiceMinutesToday?: number;
  slaBreachCountToday?: number;
  efficiencyScore?: number;
}
