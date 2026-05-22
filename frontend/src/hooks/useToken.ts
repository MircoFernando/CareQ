import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenService } from '../services/tokenService';
import { useSocket } from './useSocket';
import { ROOMS, SOCKET_EVENTS } from '../lib/socket';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useToken(tokenId: string | null) {
  const queryClient = useQueryClient();

  // Socket connection to patient's personal token channel
  const roomName = tokenId ? ROOMS.token(tokenId) : undefined;
  const { subscribe } = useSocket(roomName);

  // TanStack Query for token details
  const tokenQuery = useQuery({
    queryKey: ['token', tokenId],
    queryFn: () => tokenService.getToken(tokenId!),
    enabled: !!tokenId,
    staleTime: 5000, // Stale after 5s (patient status views require fresh state)
    refetchInterval: 10000, // Fallback poll every 10s if socket disconnects
  });

  // TanStack Query for token events log
  const eventsQuery = useQuery({
    queryKey: ['tokenEvents', tokenId],
    queryFn: () => tokenService.getTokenEvents(tokenId!),
    enabled: !!tokenId,
    staleTime: 30000,
  });

  // Register socket notifications
  useEffect(() => {
    if (!tokenId) return;

    // Called alert handler
    const unsubCalled = subscribe(SOCKET_EVENTS.PATIENT_CALLED, (data: any) => {
      queryClient.setQueryData(['token', tokenId], (old: any) => {
        if (!old) return old;
        return { ...old, status: 'CALLED', stationId: data.stationId, stationName: data.stationName };
      });
      queryClient.invalidateQueries({ queryKey: ['token', tokenId] });
      queryClient.invalidateQueries({ queryKey: ['tokenEvents', tokenId] });
      
      // Native audio chime beep in browser to wow the user!
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.warn('Audio play failed', e);
      }

      toast.success(`You are being called! Proceed to ${data.stationName} immediately.`, {
        icon: '🔔',
        duration: 10000
      });
    });

    // Priority changed alert handler
    const unsubPriority = subscribe(SOCKET_EVENTS.PRIORITY_CHANGED, () => {
      queryClient.invalidateQueries({ queryKey: ['token', tokenId] });
      queryClient.invalidateQueries({ queryKey: ['tokenEvents', tokenId] });
      toast(`Your queue priority has been updated!`);
    });

    return () => {
      unsubCalled();
      unsubPriority();
    };
  }, [tokenId, subscribe, queryClient]);

  // Register token mutation
  const registerMutation = useMutation({
    mutationFn: (data: { patientName?: string, patientPhone: string, departmentId: string }) =>
      tokenService.registerToken(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['token', data.tokenId], data);
      toast.success('Successfully joined the waiting queue!');
    }
  });

  return {
    token: tokenQuery.data || null,
    events: eventsQuery.data || [],
    isLoading: tokenQuery.isLoading,
    isLoadingEvents: eventsQuery.isLoading,
    isError: tokenQuery.isError,
    error: tokenQuery.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending
  };
}
