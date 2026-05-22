import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, User, Landmark, Sparkles } from 'lucide-react';
import { Department } from '../../types/queue.types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

// E.164 regex: + followed by country code and digits (e.g. +94771234567)
const e164Regex = /^\+[1-9]\d{1,14}$/;

const registerSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientPhone: z.string().refine((val) => {
    // If it doesn't start with +, let's assume +94 if it starts with 7 or 07 (Sri Lanka fallback) or just check regex
    let formatted = val.trim();
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('0')) {
        formatted = '+94' + formatted.slice(1);
      } else if (formatted.startsWith('7')) {
        formatted = '+94' + formatted;
      } else {
        formatted = '+' + formatted;
      }
    }
    return e164Regex.test(formatted);
  }, {
    message: 'Invalid phone number. Must be in E.164 format (e.g., +94771234567)',
  }),
  departmentId: z.string().min(1, 'Please select a department'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  departments?: Department[];
  fixedDepartmentId?: string;
  onSubmit: (data: { patientName: string; patientPhone: string; departmentId: string }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  departments = [],
  fixedDepartmentId,
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      patientName: '',
      patientPhone: '',
      departmentId: fixedDepartmentId || '',
    },
  });

  React.useEffect(() => {
    if (fixedDepartmentId) {
      setValue('departmentId', fixedDepartmentId);
    }
  }, [fixedDepartmentId, setValue]);

  const handleFormSubmit = async (values: RegisterFormValues) => {
    // Ensure E.164 format mapping before submitting
    let phone = values.patientPhone.trim();
    if (!phone.startsWith('+')) {
      if (phone.startsWith('0')) {
        phone = '+94' + phone.slice(1);
      } else if (phone.startsWith('7')) {
        phone = '+94' + phone;
      } else {
        phone = '+' + phone;
      }
    }
    
    await onSubmit({
      patientName: values.patientName.trim(),
      patientPhone: phone,
      departmentId: values.departmentId,
    });
    
    // Reset if it's not fixed dept (e.g. public kiosk or nurse console, ready for next register)
    if (!fixedDepartmentId) {
      reset({
        patientName: '',
        patientPhone: '',
        departmentId: '',
      });
    } else {
      reset({
        patientName: '',
        patientPhone: '',
        departmentId: fixedDepartmentId,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-5 bg-white p-6 md:p-8 rounded-3xl border border-primary/10 shadow-xl ${className}`}
    >
      <div className="text-center select-none pb-2">
        <h2 className="text-2xl font-extrabold text-text-primary flex items-center justify-center gap-2">
          <Sparkles className="text-primary animate-pulse shrink-0" size={24} />
          <span>New Token Registration</span>
        </h2>
        <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
          Create a secure digital OPD queue token. Live waiting estimates will be generated instantly.
        </p>
      </div>

      {/* Patient Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Patient Name
        </label>
        <div className="relative w-full">
          <Input
            {...register('patientName')}
            placeholder="Enter patient full name"
            error={errors.patientName?.message}
            disabled={isLoading}
            className="pl-10 rounded-xl border-border-default focus:border-primary"
          />
          <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
            <User size={18} />
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex justify-between">
          <span>Mobile Phone Number</span>
          <span className="text-[10px] text-text-secondary font-medium lowercase">e.g. +94771234567</span>
        </label>
        <div className="relative w-full">
          <Input
            {...register('patientPhone')}
            placeholder="e.g. 0771234567 or +94771234567"
            error={errors.patientPhone?.message}
            disabled={isLoading}
            className="pl-10 rounded-xl border-border-default focus:border-primary"
          />
          <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
            <Phone size={18} />
          </div>
        </div>
      </div>

      {/* Department Dropdown (only visible if not fixed) */}
      {!fixedDepartmentId ? (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
            OPD Department
          </label>
          <div className="relative w-full">
            <Select
              {...register('departmentId')}
              options={[
                { value: '', label: 'Select OPD Department' },
                ...departments.map((d) => ({ value: d.id, label: `${d.name} (SLA: ${d.slaMinutes}m)` })),
              ]}
              error={errors.departmentId?.message}
              disabled={isLoading}
              className="pl-10 rounded-xl border-border-default focus:border-primary"
            />
            <div className="absolute left-3.5 top-[11px] text-text-secondary pointer-events-none">
              <Landmark size={18} />
            </div>
          </div>
        </div>
      ) : (
        <input type="hidden" {...register('departmentId')} />
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full mt-6 py-3.5 shadow-md shadow-primary/20 rounded-xl hover:shadow-lg font-bold text-sm"
      >
        Generate Token & Join Queue
      </Button>
    </form>
  );
};

export default RegisterForm;
