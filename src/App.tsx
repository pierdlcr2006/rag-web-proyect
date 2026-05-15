import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './sites/b2c-site/auth/pages/LoginPage';
import { ChatPage } from './sites/b2c-site/chat/pages/ChatPage';
import { BillingPage } from './sites/b2c-site/billing/pages/BillingPage';
import { AdminDashboardPage } from './sites/business-site/admin/pages/AdminDashboardPage';
import { AdminBillingPage } from './sites/business-site/admin/pages/AdminBillingPage';
import { AdminUsersPage } from './sites/business-site/admin/pages/AdminUsersPage';
import { AdminStatusPage } from './sites/business-site/admin/pages/AdminStatusPage';
import { AdminLogsPage } from './sites/business-site/admin/pages/AdminLogsPage';
import { AdminLayout } from './sites/business-site/admin/components/AdminLayout';
import { AdminPlaceholderPage } from './sites/business-site/admin/pages/placeholders/AdminPlaceholderPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { useEffect } from 'react';
import { Zap, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { useAuthStore, UserRole } from './sites/b2c-site/auth/store/authStore';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isAuthenticated, refreshToken, logout } = useAuthStore();

  // Fix stale sessions missing the 'role' field
  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshToken().catch(() => {
        logout();
      });
      
      // Safety timeout: if after 5 seconds we still have no user, force logout
      const timer = setTimeout(() => {
        if (isAuthenticated && !user) {
          console.error('Refresh timeout - forcing logout');
          logout();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, refreshToken, logout]);

  // If we're authenticated but user data isn't loaded yet, show a loader to prevent redirect loops
  if (isAuthenticated && !user) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<div className="p-8 text-center">Implementación de registro pendiente...</div>} />
          
          {/* General Protected Routes (Restricted for Admins) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute requiredRole={UserRole.ADMIN} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/billing" element={<AdminBillingPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/logs" element={<AdminLogsPage />} />
              <Route path="/admin/status" element={<AdminStatusPage />} />
            </Route>
          </Route>

          <Route path="/" element={<NavigateWithRole />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const NavigateWithRole = () => {
  const { user, isAuthenticated } = useAuthStore();
  console.log('NavigateWithRole:', { isAuthenticated, role: user?.role });
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (user?.role === UserRole.ADMIN) {
    console.log('Redirecting to ADMIN');
    return <Navigate to="/admin" replace />;
  }
  
  console.log('Redirecting to CHAT');
  return <Navigate to="/chat" replace />;
};

export default App;
