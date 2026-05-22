import { io } from 'socket.io-client';
import { db } from './mockServer';

let socketInstance: any = null;

// Mock socket client representing socket.io interface
class MockSocket {
  private listeners: Record<string, Function[]> = {};
  private channel = typeof window !== 'undefined' ? new BroadcastChannel('careq_mock_realtime') : null;
  public connected = true;

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen to channel messages from other tabs
      if (this.channel) {
        this.channel.onmessage = (event) => {
          const { event: evName, payload } = event.data;
          this.trigger(evName, payload);
        };
      }

      // Listen to custom window events from the current tab
      window.addEventListener('careq_mock_socket_event', (e: any) => {
        const { event: evName, payload } = e.detail;
        this.trigger(evName, payload);
      });
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      delete this.listeners[event];
    } else if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  emit(event: string, payload: any) {
    // Console log for visibility in demo mode
    console.log(`[MockSocket Emit] Event: "${event}"`, payload);
    
    // Simulate room joining logic
    if (event === 'join:room') {
      console.log(`[MockSocket] Patient joined room: ${payload.room}`);
    } else if (event === 'leave:room') {
      console.log(`[MockSocket] Patient left room: ${payload.room}`);
    }
    return this;
  }

  disconnect() {
    this.connected = false;
    return this;
  }

  connect() {
    this.connected = true;
    return this;
  }

  private trigger(event: string, payload: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(payload);
        } catch (e) {
          console.error(`Error in mock socket callback for "${event}":`, e);
        }
      });
    }
  }
}

export function createSocket(token: string): any {
  if (db.demoMode) {
    console.log('[Socket] Initializing in Demo Mode with mock socket');
    socketInstance = new MockSocket();
    return socketInstance;
  }

  const socketUrl = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3001';
  console.log(`[Socket] Connecting to server at ${socketUrl}`);
  
  socketInstance = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socketInstance;
}

export function getSocket(): any {
  if (!socketInstance) {
    socketInstance = db.demoMode ? new MockSocket() : null;
  }
  return socketInstance;
}

// Room names helper
export const ROOMS = {
  deptQueue: (deptId: string) => `dept:${deptId}:queue`,
  station: (stationId: string) => `station:${stationId}`,
  token: (tokenId: string) => `token:${tokenId}`,
  adminAlerts: () => `admin:alerts`,
  display: (deptId: string) => `display:${deptId}`,
};

export const SOCKET_EVENTS = {
  QUEUE_UPDATED: 'queue:updated',
  SLA_BREACH: 'sla:breach',
  PATIENT_CALLED: 'patient:called',
  PRIORITY_CHANGED: 'priority:changed',
  STATION_STATUS: 'station:status:changed',
  DISPLAY_CALLED: 'display:called',
} as const;
