import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import { departmentService } from '../../services/departmentService';
import StaffTable from '../../components/staff/StaffTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import { CreateStaffRequest } from '../../types/api.types';
import toast from 'react-hot-toast';

export const StaffPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Load employee directory
  const { data: staffList = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getStaff(),
  });

  // Load departments for assignment drop-downs
  const { data: departments = [], isLoading: deptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  // Create Staff Mutation
  const createStaffMutation = useMutation({
    mutationFn: (data: CreateStaffRequest) => staffService.createStaff(data),
    onSuccess: (newStaff) => {
      queryClient.setQueryData(['staff'], (old: any) => [...(old || []), newStaff]);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success(`Staff account for ${newStaff.name} created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create staff account.');
    },
  });

  // Toggle Staff Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      staffService.updateStaffStatus(id, isActive),
    onSuccess: (updatedStaff) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success(
        updatedStaff.isActive
          ? `Account for ${updatedStaff.name} activated.`
          : `Account for ${updatedStaff.name} suspended.`
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to change staff status.');
    },
  });

  const handleCreateStaff = async (data: CreateStaffRequest) => {
    await createStaffMutation.mutateAsync(data);
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    await toggleStatusMutation.mutateAsync({ id, isActive });
  };

  if (staffLoading || deptLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center select-none">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Launching Staff Management Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      
      {/* Staff Page Header */}
      <PageHeader
        title="Hospital Employee Staff Management"
        subtitle="Provision employee accounts, assign clinical desks, and restrict portal dashboard permissions."
      />

      {/* Staff List Grid table */}
      <div className="animate-slide-up">
        <StaffTable
          staffList={staffList}
          departments={departments}
          onCreateStaff={handleCreateStaff}
          onToggleStatus={handleToggleStatus}
          isLoading={createStaffMutation.isPending || toggleStatusMutation.isPending}
          className="shadow-md"
        />
      </div>

    </div>
  );
};

export default StaffPage;
