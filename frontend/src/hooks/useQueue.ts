import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueService } from '../services/queueService';
import { tokenService } from '../services/tokenService';
import { useQueueStore } from '../stores/queueStore';
import { useSocket } from './useSocket';
import { ROOMS, SOCKET_EVENTS } from '../lib/socket';
import { useEffect } from 'react';
import { Priority } from '../types/queue.types';
import toast from 'react-hot-toast';

export function useQueue(deptId: string | null) {
  const queryClient = useQueryClient();
  const applyQueueUpdate = useQueueStore(state => state.applyQueueUpdate);
  const addSlaBreach = useQueueStore(state => state.addSlaBreach);
  const clearSlaBreach = useQueueStore(state => state.clearSlaBreach);
  const slaBreaches = useQueueStore(state => state.slaBreaches);

  // Bind to socket room for department queue updates
  const roomName = deptId ? ROOMS.deptQueue(deptId) : undefined;
  const { subscribe } = useSocket(roomName);

  // TanStack Query for full queue list
  const queueQuery = useQuery({
    queryKey: ['queue', deptId],
    queryFn: () => queueService.getQueue(deptId!),
    enabled: !!deptId,
    staleTime: 0, // Always pull fresh data; socket signals updates
  });

  // TanStack Query for live stats
  const statsQuery = useQuery({
    queryKey: ['queueStats', deptId],
    queryFn: () => queueService.getQueueStats(deptId!),
    enabled: !!deptId,
    staleTime: 10000, // 10 seconds stale
  });

  // Handle Socket Events for live invalidation and Zustand synchronizations
  useEffect(() => {
    if (!deptId) return;

    // Queue update handler
    const unsubQueue = subscribe(SOCKET_EVENTS.QUEUE_UPDATED, (data: any) => {
      if (data.departmentId === deptId) {
        applyQueueUpdate(data);
        queryClient.setQueryData(['queue', deptId], data);
        queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
      }
    });

    // SLA breach handler
    const unsubSla = subscribe(SOCKET_EVENTS.SLA_BREACH, (event: any) => {
      if (event.departmentId === deptId) {
        addSlaBreach(event.tokenId);
        toast(`[SLA BREACH] ${event.tokenNumber} (${event.patientName}) elapsed wait time: ${event.waitMinutes}m!`, {
          icon: '⚠️',
          duration: 6000,
          style: { border: '1px solid #D9363E', color: '#D9363E', backgroundColor: '#FEF2F2' }
        });
        queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
        queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      }
    });

    // Priority change handler
    const unsubPriority = subscribe(SOCKET_EVENTS.PRIORITY_CHANGED, () => {
      queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
    });

    return () => {
      unsubQueue();
      unsubSla();
      unsubPriority();
    };
  }, [deptId, subscribe, queryClient, applyQueueUpdate, addSlaBreach]);

  // Priority mutation
  const priorityMutation = useMutation({
    mutationFn: ({ tokenId, priority, reason }: { tokenId: string, priority: Priority, reason: string }) =>
      tokenService.updatePriority(tokenId, { priority, reason }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
      toast.success(`Priority updated for ${data.tokenNumber}!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update priority.');
    }
  });

  // Status mutation (Nurse actions, e.g. marking patient as NO_SHOW)
  const statusMutation = useMutation({
    mutationFn: ({ tokenId, status, stationId }: { tokenId: string, status: any, stationId?: string }) =>
      tokenService.updateStatus(tokenId, { status, stationId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
      clearSlaBreach(data.tokenId);
      toast.success(`Token status updated to ${data.status}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status.');
    }
  });

  // Register on behalf mutation
  const registerMutation = useMutation({
    mutationFn: (data: { patientName?: string, patientPhone: string }) =>
      tokenService.registerToken({ ...data, departmentId: deptId! }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['queue', deptId] });
      queryClient.invalidateQueries({ queryKey: ['queueStats', deptId] });
      toast.success(`Successfully registered ${data.tokenNumber}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to register patient.');
    }
  });

  return {
    queueItems: queueQuery.data?.queue || [],
    totalWaiting: queueQuery.data?.totalWaiting || 0,
    stats: statsQuery.data || { totalWaiting: 0, activeStations: 0, pausedStations: 0, avgWaitMinutesLastHour: 0, slaBreachCountToday: 0, longestCurrentWaitMinutes: 0 },
    isLoading: queueQuery.isLoading || statsQuery.isLoading,
    isError: queueQuery.isError,
    error: queueQuery.error,
    updatePriority: priorityMutation.mutateAsync,
    isUpdatingPriority: priorityMutation.isPending,
    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
    registerPatient: registerMutation.mutateAsync,
    isRegisteringPatient: registerMutation.isPending,
    slaBreaches
  };
}
