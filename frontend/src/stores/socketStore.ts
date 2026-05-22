import { create } from 'zustand';
import { createSocket, getSocket } from '../lib/socket';

interface SocketState {
  socket: any | null;
  isConnected: boolean;
  joinedRooms: string[];
  connect: (token: string) => void;
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  joinedRooms: [],

  connect: (token) => {
    // If already connected, do nothing
    if (get().isConnected) return;
    
    const socket = createSocket(token);
    
    // Wire standard listeners
    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));
    
    // Set socket
    set({ socket, isConnected: socket.connected });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false, joinedRooms: [] });
  },

  joinRoom: (room) => {
    const socket = get().socket || getSocket();
    if (socket && !get().joinedRooms.includes(room)) {
      socket.emit('join:room', { room });
      set((state) => ({ joinedRooms: [...state.joinedRooms, room] }));
    }
  },

  leaveRoom: (room) => {
    const socket = get().socket || getSocket();
    if (socket && get().joinedRooms.includes(room)) {
      socket.emit('leave:room', { room });
      set((state) => ({ joinedRooms: state.joinedRooms.filter(r => r !== room) }));
    }
  }
}));
