import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { DashboardKpisResponse, WaitTrendItem, AnalyticsParams } from '../types/api.types';

export const analyticsService = {
  getDashboardKpis: async (): Promise<DashboardKpisResponse> => {
    if (db.demoMode) {
      return mockServer.getDashboardKpis();
    }
    const res = await apiClient.get<DashboardKpisResponse>('/analytics/dashboard');
    return res.data;
  },

  getWaitTrends: async (params?: AnalyticsParams): Promise<WaitTrendItem[]> => {
    if (db.demoMode) {
      return mockServer.getWaitTrends();
    }
    const res = await apiClient.get<WaitTrendItem[]>('/analytics/wait-trends', { params });
    return res.data;
  },

  generateReport: async (date: string): Promise<Blob> => {
    if (db.demoMode) {
      // Return a dummy PDF blob
      return new Blob([`Dummy PDF Report for Date: ${date}`], { type: 'application/pdf' });
    }
    const res = await apiClient.get<Blob>('/analytics/report', { params: { date }, responseType: 'blob' });
    return res.data;
  },

  exportCsv: async (params?: AnalyticsParams): Promise<Blob> => {
    if (db.demoMode) {
      // Return a dummy CSV blob
      return new Blob([`Date,Department,AverageWait,SlaBreaches\n2026-05-21,General OPD,22 mins,5`], { type: 'text/csv' });
    }
    const res = await apiClient.get<Blob>('/analytics/export', { params, responseType: 'blob' });
    return res.data;
  }
};
