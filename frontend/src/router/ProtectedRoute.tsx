import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth.types';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Authorized -> Render outlets
  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // 3. Role Unauthorized -> Redirect to role default home route
  switch (role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'nurse':
      return <Navigate to="/nurse/triage" replace />;
    case 'doctor':
      return <Navigate to="/doctor/station" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};
export default ProtectedRoute;
