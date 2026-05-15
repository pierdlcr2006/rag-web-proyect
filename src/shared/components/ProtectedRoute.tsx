import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, UserRole } from '../../sites/b2c-site/auth/store/authStore';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  console.log('ProtectedRoute Check:', { 
    path: window.location.pathname,
    isAuthenticated, 
    userRole: user?.role, 
    requiredRole 
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 1. If route requires ADMIN and user is NOT ADMIN
  if (requiredRole === UserRole.ADMIN && user?.role !== UserRole.ADMIN) {
    console.log('Access Denied: Not an Admin');
    return <Navigate to="/chat" replace />;
  }

  // 2. If route is for USERS (no requiredRole) and user IS ADMIN
  if (!requiredRole && user?.role === UserRole.ADMIN) {
    console.log('Redirecting Admin to Dashboard');
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
