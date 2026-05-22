import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';
import { tokenService } from '../../services/tokenService';
import RegisterForm from '../../components/token/RegisterForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import AppLogo from '../../components/common/AppLogo';
import { Landmark, ArrowLeft, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const { deptSlug } = useParams<{ deptSlug: string }>();
  const navigate = useNavigate();

  // Query departments to find the matching slug
  const { data: departments = [], isLoading, isError } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  const department = departments.find((d) => d.slug === deptSlug);

  const handleRegisterToken = async (formData: { patientName: string; patientPhone: string; departmentId: string }) => {
    try {
      const response = await tokenService.registerToken({
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        departmentId: formData.departmentId,
      });

      toast.success(`Token ${response.tokenNumber} issued successfully!`);
      
      // Save token in sessionStorage to help reload and secure patient state
      sessionStorage.setItem('careq_active_token_id', response.tokenId);
      
      // Redirect to Token Status dashboard
      navigate(`/token/${response.tokenId}`);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please check inputs.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-text-secondary font-bold mt-3 animate-pulse">Loading Clinical Queue Details...</span>
      </div>
    );
  }

  if (isError || !department) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center bg-white border border-red-100 shadow-xl rounded-3xl flex flex-col items-center">
          <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-2xl mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-black text-text-primary">Clinic Registration Closed</h2>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            The clinic slug is invalid or registration is temporarily unavailable. Please scan the QR code at triage again.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Go to Portal Login</span>
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-between p-4 py-8">
      {/* Top logo header */}
      <div className="w-full max-w-md flex flex-col items-center select-none mb-6">
        <AppLogo />
        <div className="mt-4 flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-primary/10 rounded-full shadow-sm text-[10px] font-extrabold uppercase tracking-wider text-primary-dark">
          <Landmark size={12} className="text-primary animate-pulse" />
          <span>{department.name}</span>
        </div>
      </div>

      {/* Main Form container */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <RegisterForm
          fixedDepartmentId={department.id}
          onSubmit={handleRegisterToken}
          isLoading={false}
          className="shadow-lg"
        />
      </div>

      {/* Footer notes */}
      <div className="w-full max-w-md text-center mt-8 select-none">
        <p className="text-[10px] text-text-secondary leading-relaxed max-w-xs mx-auto">
          By registering for a digital token, you will receive real-time SMS status updates. Please remain near the OPD lobby.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
