import { Priority, TokenStatus, QueueItem } from './queue.types';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiResponseEnvelope<T> {
  data: T;
  error?: ApiError;
}

export interface RegisterTokenRequest {
  patientName?: string;
  patientPhone: string; // +94... E.164 format
  departmentId: string;
  fcmToken?: string;
}

export interface RegisterTokenResponse {
  tokenId: string;
  tokenNumber: string;
  position: number;
  estimatedWaitMinutes: number;
  departmentId: string;
  issuedAt: string;
}

export interface UpdatePriorityRequest {
  priority: Priority;
  reason: string;
}

export interface UpdateStatusRequest {
  status: TokenStatus;
  stationId?: string;
}

export interface QueueResponse {
  departmentId: string;
  totalWaiting: number;
  activeStations: number;
  queue: QueueItem[];
}

export interface QueueStatsResponse {
  totalWaiting: number;
  activeStations: number;
  pausedStations: number;
  avgWaitMinutesLastHour: number;
  slaBreachCountToday: number;
  longestCurrentWaitMinutes: number;
}

export interface NextPatientResponse {
  tokenId: string;
  tokenNumber: string;
  patientName: string;
  priority: Priority;
  isEmergency: boolean;
  waitMinutes: number;
  position: number;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  role: 'admin' | 'nurse' | 'doctor';
  departmentId: string | null;
}

export interface UpdateStaffRequest {
  name: string;
  role?: 'admin' | 'nurse' | 'doctor';
  departmentId?: string | null;
}

export interface AnalyticsParams {
  deptId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
}

export interface DashboardKpisResponse {
  activeQueues: number;
  activeStations: number;
  totalPatientsToday: number;
  avgWaitMinutesToday: number;
  departmentQueueDepths: Array<{
    departmentName: string;
    waiting: number;
  }>;
  liveAlerts: Array<{
    type: 'SLA_BREACH' | 'EMERGENCY_ESCALATION' | 'STATION_ALERT';
    message: string;
    timestamp: string;
    tokenId?: string;
  }>;
}

export interface WaitTrendItem {
  hour: string; // e.g. "08:00", "09:00"
  morning: number; // minutes
  afternoon: number; // minutes
  evening: number; // minutes
}

export interface VolumeItem {
  date: string; // e.g. "2026-05-21"
  count: number;
}

export interface SlaBreachStatsResponse {
  breachCount: number;
  totalCount: number;
  breachPercentage: number;
}
