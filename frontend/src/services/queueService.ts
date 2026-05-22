import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { QueueResponse, QueueStatsResponse } from '../types/api.types';

export const queueService = {
  getQueue: async (deptId: string): Promise<QueueResponse> => {
    if (db.demoMode) {
      return mockServer.getQueue(deptId);
    }
    const res = await apiClient.get<QueueResponse>(`/queue/${deptId}`);
    return res.data;
  },

  getEstimate: async (deptId: string, position: number): Promise<{ estimatedWaitMinutes: number }> => {
    if (db.demoMode) {
      // Linear estimate logic in mock server
      return { estimatedWaitMinutes: Math.max(1, position * 8) };
    }
    const res = await apiClient.get<{ estimatedWaitMinutes: number }>(`/queue/${deptId}/estimate`, { params: { position } });
    return res.data;
  },

  getQueueStats: async (deptId: string): Promise<QueueStatsResponse> => {
    if (db.demoMode) {
      return mockServer.getQueueStats(deptId);
    }
    const res = await apiClient.get<QueueStatsResponse>(`/queue/${deptId}/stats`);
    return res.data;
  }
};
