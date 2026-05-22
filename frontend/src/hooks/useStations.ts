import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService } from '../services/stationService';
import { tokenService } from '../services/tokenService';
import { useSocket } from './useSocket';
import { ROOMS, SOCKET_EVENTS } from '../lib/socket';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useStations(deptId: string | null, stationId?: string | null) {
  const queryClient = useQueryClient();

  // Socket room for doctor station
  const roomName = stationId ? ROOMS.station(stationId) : undefined;
  const { subscribe } = useSocket(roomName);

  // Query station list
  const stationsQuery = useQuery({
    queryKey: ['stations', deptId],
    queryFn: () => stationService.getStations(deptId!),
    enabled: !!deptId,
    staleTime: 15000,
  });

  // Query next patient in queue
  const nextPatientQuery = useQuery({
    queryKey: ['stationNext', stationId],
    queryFn: () => stationService.getNextPatient(stationId!),
    enabled: !!stationId,
    staleTime: 0, // Always fetch fresh
  });

  // Listen to queue updates or station triggers to refetch
  useEffect(() => {
    if (!stationId) return;

    // Trigger refetch when queue changes
    const unsubQueue = subscribe(SOCKET_EVENTS.QUEUE_UPDATED, () => {
      queryClient.invalidateQueries({ queryKey: ['stationNext', stationId] });
    });

    return () => {
      unsubQueue();
    };
  }, [stationId, subscribe, queryClient]);

  // Pause / Resume Station mutation
  const togglePauseMutation = useMutation({
    mutationFn: ({ id, isPaused }: { id: string, isPaused: boolean }) =>
      stationService.updateStationStatus(id, isPaused),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stations', deptId] });
      toast.success(data.isPaused ? 'Station paused successfully.' : 'Station active and resumed.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update station state.');
    }
  });

  // Call Next Patient mutation
  const callNextMutation = useMutation({
    mutationFn: ({ tokenId, status, stationId }: { tokenId: string, status: 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW', stationId: string }) =>
      tokenService.updateStatus(tokenId, { status, stationId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stationNext', stationId] });
      queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
      
      if (variables.status === 'CALLED') {
        toast.success(`Called patient ${data.tokenNumber}!`);
      } else if (variables.status === 'IN_CONSULTATION') {
        toast.success(`Consultation started for ${data.tokenNumber}`);
      } else {
        toast.success(`Consultation complete for ${data.tokenNumber}`);
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Action failed.');
    }
  });

  return {
    stations: stationsQuery.data || [],
    nextPatient: nextPatientQuery.data || null,
    isLoading: stationsQuery.isLoading || nextPatientQuery.isLoading,
    isRefetchingNext: nextPatientQuery.isRefetching,
    togglePause: togglePauseMutation.mutateAsync,
    isTogglingPause: togglePauseMutation.isPending,
    callNextPatient: callNextMutation.mutateAsync,
    isCallingNext: callNextMutation.isPending,
    refetchNext: () => queryClient.invalidateQueries({ queryKey: ['stationNext', stationId] })
  };
}
