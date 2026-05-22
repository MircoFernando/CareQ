import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { useSocket } from './useSocket';
import { ROOMS, SOCKET_EVENTS } from '../lib/socket';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useAnalytics(view: 'dashboard' | 'trends' = 'dashboard', deptId?: string | null) {
  const queryClient = useQueryClient();
  const { subscribe } = useSocket(ROOMS.adminAlerts());

  // Dashboard live KPIs query
  const dashboardQuery = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsService.getDashboardKpis(),
    enabled: view === 'dashboard',
    staleTime: 30000, // 30s stale
  });

  // Historical Trends query
  const trendsQuery = useQuery({
    queryKey: ['analytics', 'waitTrends', deptId],
    queryFn: () => analyticsService.getWaitTrends({ deptId: deptId || undefined }),
    enabled: view === 'trends',
    staleTime: 300000, // 5 minutes stale for historical trends
  });

  // Listen to SLA breaches or alerts to invalidate KPIs live
  useEffect(() => {
    if (view !== 'dashboard') return;

    const unsubSla = subscribe(SOCKET_EVENTS.SLA_BREACH, () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
    });

    const unsubStation = subscribe(SOCKET_EVENTS.STATION_STATUS, () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
    });

    return () => {
      unsubSla();
      unsubStation();
    };
  }, [view, subscribe, queryClient]);

  return {
    kpis: dashboardQuery.data || null,
    waitTrends: trendsQuery.data || [],
    isLoading: dashboardQuery.isLoading || trendsQuery.isLoading,
    isRefetching: dashboardQuery.isRefetching || trendsQuery.isRefetching,
    refetchDashboard: () => queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] }),
    refetchTrends: () => queryClient.invalidateQueries({ queryKey: ['analytics', 'waitTrends', deptId] })
  };
}
