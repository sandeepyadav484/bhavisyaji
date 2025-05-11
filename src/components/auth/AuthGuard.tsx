import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireProfile }) => {
  const { user, loading, profile } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth-onboarding" state={{ from: location }} replace />;
  }

  if (requireProfile) {
    if (
      !profile ||
      !profile.name ||
      !profile.gender ||
      !profile.birthDetails ||
      !profile.birthDetails.date ||
      !profile.birthDetails.time ||
      !profile.birthDetails.location ||
      !profile.birthDetails.location.name
    ) {
      return <Navigate to="/auth-onboarding" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard; 