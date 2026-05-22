import { apiClient } from './apiClient';
import { db, mockServer } from '../lib/mockServer';
import { Department } from '../types/queue.types';

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    if (db.demoMode) {
      return mockServer.getDepartments();
    }
    const res = await apiClient.get<Department[]>('/departments');
    return res.data;
  },

  updateDepartmentSla: async (id: string, slaMinutes: number): Promise<Department> => {
    if (db.demoMode) {
      return mockServer.updateDepartmentSla(id, slaMinutes);
    }
    const res = await apiClient.patch<Department>(`/departments/${id}`, { slaMinutes });
    return res.data;
  }
};
