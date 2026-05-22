import React, { useState } from 'react';
import { StaffProfile } from '../../types/auth.types';
import { Department } from '../../types/queue.types';
import { CreateStaffRequest } from '../../types/api.types';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import StaffRow from './StaffRow';
import AddStaffForm from './AddStaffForm';
import { Plus, ShieldAlert, Users } from 'lucide-react';

interface StaffTableProps {
  staffList: StaffProfile[];
  departments: Department[];
  onCreateStaff: (data: CreateStaffRequest) => Promise<void>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  staffList = [],
  departments = [],
  onCreateStaff,
  onToggleStatus,
  isLoading = false,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Multi-criteria filtering logic
  const filteredStaff = staffList.filter((s) => {
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') matchesStatus = s.isActive;
    if (statusFilter === 'INACTIVE') matchesStatus = !s.isActive;

    const matchesDept = deptFilter === 'ALL' || s.departmentId === deptFilter;

    return matchesRole && matchesStatus && matchesDept;
  });

  const getDeptName = (deptId: string | null) => {
    if (!deptId) return undefined;
    return departments.find((d) => d.id === deptId)?.name;
  };

  return (
    <Card className={`bg-white border border-primary/10 shadow-lg rounded-3xl p-5 md:p-6 select-none ${className}`}>
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-default pb-5">
        <div className="flex flex-col">
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <Users className="text-primary" size={22} />
            <span>Staff Directory ({filteredStaff.length})</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage hospital staff credentials, assigned clinical departments, and access states.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl flex items-center justify-center gap-1.5 self-start md:self-auto shadow-md py-1.5 px-3.5 text-xs"
        >
          <Plus size={16} />
          <span>Add Employee</span>
        </Button>
      </div>

      {/* Dynamic Filtering Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Role Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Filter by Role
          </label>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Staff Roles' },
              { value: 'doctor', label: 'Doctors Only' },
              { value: 'nurse', label: 'Nurses Only' },
              { value: 'admin', label: 'Administrators Only' },
            ]}
            className="rounded-xl py-1.5 text-xs font-semibold focus:border-primary border-border-default"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Account Status
          </label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active Only' },
              { value: 'INACTIVE', label: 'Inactive / Suspended' },
            ]}
            className="rounded-xl py-1.5 text-xs font-semibold focus:border-primary border-border-default"
          />
        </div>

        {/* Department Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            OPD Clinic
          </label>
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All OPD Clinics' },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
            className="rounded-xl py-1.5 text-xs font-semibold focus:border-primary border-border-default"
          />
        </div>
      </div>

      {/* Staff Listings Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-default text-text-secondary font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 pr-4">Staff Member</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Clinic Clinic Assignment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default/40 font-medium">
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-secondary select-none">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert size={36} className="text-text-secondary mb-2 animate-pulse" />
                    <span className="font-bold">No Staff Profiles Found</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1 max-w-xs leading-relaxed">
                      Try adjusting the search criteria filters above or click "Add Employee" to create a new profile.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <StaffRow
                  key={staff.id}
                  staff={staff}
                  departmentName={getDeptName(staff.departmentId)}
                  onToggleStatus={onToggleStatus}
                  isLoading={isLoading}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Dialog Pop-up */}
      {isModalOpen && (
        <AddStaffForm
          departments={departments}
          onSubmit={onCreateStaff}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
};

export default StaffTable;
