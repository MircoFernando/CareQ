import { QueueItem, Priority } from './queue.types';

export interface QueueUpdatedEvent {
  departmentId: string;
  queue: QueueItem[];
  totalWaiting: number;
  timestamp: string;
}

export interface SlaBreachEvent {
  tokenId: string;
  tokenNumber: string;
  patientName: string;
  waitMinutes: number;
  departmentId: string;
}

export interface PatientCalledEvent {
  tokenId: string;
  tokenNumber: string;
  stationId: string;
  stationName: string;
}

export interface PriorityChangedEvent {
  tokenId: string;
  oldPriority: Priority;
  newPriority: Priority;
}

export interface StationStatusChangedEvent {
  stationId: string;
  stationName: string;
  isPaused: boolean;
}

export interface DisplayCalledEvent {
  tokenNumber: string;
  stationName: string;
}

export type SocketEventPayloadMap = {
  'queue:updated': QueueUpdatedEvent;
  'sla:breach': SlaBreachEvent;
  'patient:called': PatientCalledEvent;
  'priority:changed': PriorityChangedEvent;
  'station:status:changed': StationStatusChangedEvent;
  'display:called': DisplayCalledEvent;
};
