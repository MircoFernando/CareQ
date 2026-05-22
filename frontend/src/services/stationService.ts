import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { Station } from '../types/queue.types';
import { NextPatientResponse } from '../types/api.types';

export const stationService = {
  getStations: async (deptId: string): Promise<Station[]> => {
    if (db.demoMode) {
      return mockServer.getStations(deptId);
    }
    const res = await apiClient.get<Station[]>(`/stations/${deptId}`);
    return res.data;
  },

  updateStationStatus: async (stationId: string, isPaused: boolean): Promise<Station> => {
    if (db.demoMode) {
      return mockServer.updateStationStatus(stationId, isPaused);
    }
    const res = await apiClient.patch<Station>(`/stations/${stationId}/status`, { isPaused });
    return res.data;
  },

  getNextPatient: async (stationId: string): Promise<NextPatientResponse | null> => {
    if (db.demoMode) {
      return mockServer.getNextPatient(stationId);
    }
    const res = await apiClient.get<NextPatientResponse | null>(`/stations/${stationId}/next`);
    return res.data;
  }
};
