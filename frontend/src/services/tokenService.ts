import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { useAuthStore } from '../stores/authStore';
import { RegisterTokenRequest, RegisterTokenResponse, UpdatePriorityRequest, UpdateStatusRequest } from '../types/api.types';
import { TokenDetail, TokenEvent } from '../types/queue.types';

export const tokenService = {
  registerToken: async (data: RegisterTokenRequest): Promise<RegisterTokenResponse> => {
    if (db.demoMode) {
      return mockServer.registerToken(data);
    }
    const res = await apiClient.post<RegisterTokenResponse>('/tokens', data);
    return res.data;
  },

  getToken: async (id: string): Promise<TokenDetail> => {
    if (db.demoMode) {
      return mockServer.getToken(id);
    }
    const res = await apiClient.get<TokenDetail>(`/tokens/${id}`);
    return res.data;
  },

  updatePriority: async (id: string, data: UpdatePriorityRequest): Promise<TokenDetail> => {
    if (db.demoMode) {
      const actor = useAuthStore.getState().staffProfile;
      if (!actor) throw new Error('Unauthenticated');
      return mockServer.updatePriority(id, data, actor);
    }
    const res = await apiClient.patch<TokenDetail>(`/tokens/${id}/priority`, data);
    return res.data;
  },

  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<TokenDetail> => {
    if (db.demoMode) {
      const actor = useAuthStore.getState().staffProfile;
      if (!actor) throw new Error('Unauthenticated');
      return mockServer.updateStatus(id, data, actor);
    }
    const res = await apiClient.patch<TokenDetail>(`/tokens/${id}/status`, data);
    return res.data;
  },

  getTokenEvents: async (id: string): Promise<TokenEvent[]> => {
    if (db.demoMode) {
      return mockServer.getTokenEvents(id);
    }
    const res = await apiClient.get<TokenEvent[]>(`/tokens/${id}/events`);
    return res.data;
  }
};
