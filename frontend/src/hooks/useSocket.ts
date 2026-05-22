import { useEffect, useRef } from 'react';
import { useSocketStore } from '../stores/socketStore';
import { getSocket } from '../lib/socket';

export function useSocket(room?: string) {
  const socket = useSocketStore(state => state.socket) || getSocket();
  const joinRoom = useSocketStore(state => state.joinRoom);
  const leaveRoom = useSocketStore(state => state.leaveRoom);
  const roomRef = useRef<string | undefined>(room);

  // Manage room subscription lifecycle
  useEffect(() => {
    const currentRoom = roomRef.current;
    if (socket && room) {
      joinRoom(room);
      roomRef.current = room;
    }

    return () => {
      if (socket && currentRoom) {
        leaveRoom(currentRoom);
      }
    };
  }, [socket, room, joinRoom, leaveRoom]);

  // Hook handles event registrations inside components cleanly
  const subscribe = (event: string, callback: Function) => {
    const activeSocket = socket || getSocket();
    if (activeSocket) {
      activeSocket.on(event, callback);
    }
    
    // Return unsubscribe callback
    return () => {
      if (activeSocket) {
        activeSocket.off(event, callback);
      }
    };
  };

  return {
    socket,
    subscribe,
    isConnected: socket?.connected || false,
    joinRoom: (r: string) => socket && joinRoom(r),
    leaveRoom: (r: string) => socket && leaveRoom(r)
  };
}
