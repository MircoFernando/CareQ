import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, User, ShieldCheck, Landmark, X } from 'lucide-react';
import { Department } from '../../types/queue.types';
import { CreateStaffRequest } from '../../types/api.types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'nurse', 'doctor']),
  departmentId: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface AddStaffFormProps {
  departments: Department[];
  onSubmit: (data: CreateStaffRequest) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}

export const AddStaffForm: React.FC<AddStaffFormProps> = ({
  departments = [],
  onSubmit,
  onClose,
  isLoading = false,
  className = '',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'doctor',
      departmentId: '',
    },
  });

  const selectedRole = watch('role');

  const handleFormSubmit = async (values: StaffFormValues) => {
    // If admin is selected, assign null to departmentId
    const departmentId = values.role === 'admin' ? null : values.departmentId || null;
    
    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      departmentId,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog Body */}
      <div 
        className={`relative w-full max-w-md bg-white border border-primary/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 animate-slide-up z-10 ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6 select-none">
          <h2 className="text-xl font-extrabold text-text-primary">Add Staff Account</h2>
          <p className="text-xs text-text-secondary mt-1">
            Register a new hospital employee account. A secure temporary login will be set up.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative w-full">
              <Input
                {...register('name')}
                placeholder="e.g. Dr. Dilshan Bandara"
                error={errors.name?.message}
                disabled={isLoading}
                className="pl-10 rounded-xl"
              />
              <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
                <User size={18} />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative w-full">
              <Input
                {...register('email')}
                placeholder="e.g. dilshan@hospital.lk"
                error={errors.email?.message}
                disabled={isLoading}
                className="pl-10 rounded-xl"
              />
              <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
                <Mail size={18} />
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Staff Role
            </label>
            <div className="relative w-full">
              <Select
                {...register('role')}
                options={[
                  { value: 'doctor', label: 'Doctor (Station Consultant)' },
                  { value: 'nurse', label: 'Triage Nurse' },
                  { value: 'admin', label: 'Super Admin' },
                ]}
                error={errors.role?.message}
                disabled={isLoading}
                className="pl-10 rounded-xl"
              />
              <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>

          {/* Department Selection (only shown for Doctors and Nurses) */}
          {selectedRole !== 'admin' && (
            <div className="space-y-1 animate-slide-up">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Assigned OPD Department
              </label>
              <div className="relative w-full">
                <Select
                  {...register('departmentId')}
                  options={[
                    { value: '', label: 'Select Assigned OPD Clinic' },
                    ...departments.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                  error={errors.departmentId?.message}
                  disabled={isLoading}
                  className="pl-10 rounded-xl"
                />
                <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
                  <Landmark size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-default mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl py-2 px-4 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="rounded-xl py-2 px-5 text-xs font-bold shadow-md"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffForm;
