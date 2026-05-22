import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { StaffProfile } from '../types/auth.types';
import { CreateStaffRequest } from '../types/api.types';

export const staffService = {
  getStaff: async (): Promise<StaffProfile[]> => {
    if (db.demoMode) {
      return mockServer.getStaff();
    }
    const res = await apiClient.get<StaffProfile[]>('/staff');
    return res.data;
  },

  createStaff: async (data: CreateStaffRequest): Promise<StaffProfile> => {
    if (db.demoMode) {
      return mockServer.createStaff(data);
    }
    const res = await apiClient.post<StaffProfile>('/staff', data);
    return res.data;
  },

  updateStaffStatus: async (id: string, isActive: boolean): Promise<StaffProfile> => {
    if (db.demoMode) {
      return mockServer.updateStaffStatus(id, isActive);
    }
    const res = await apiClient.patch<StaffProfile>(`/staff/${id}/status`, { isActive });
    return res.data;
  },

  getMyProfile: async (): Promise<StaffProfile> => {
    if (db.demoMode) {
      // Mock profile fallback - get standard active profile from auth details
      const staffList = db.staff;
      return staffList.find(s => s.isActive) || staffList[0];
    }
    const res = await apiClient.get<StaffProfile>('/staff/me');
    return res.data;
  }
};
