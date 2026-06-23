import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './sites/landing/LandingPage';
import { LoginPage } from './sites/b2c-site/auth/pages/LoginPage';
import { RegisterPage } from './sites/b2c-site/auth/pages/RegisterPage';
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
  const { user, isAuthenticated, fetchMe, logout } = useAuthStore();

  // Al cargar la app: si hay sesión persistida, rehidrata el usuario actual desde
  // el backend (GET /auth/me) para tener rol/plan/createdAt frescos. Si el token
  // expiró, el interceptor de axios intenta /auth/refresh; si todo falla, logout.
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMe().catch(() => logout());

    // Safety: si tras 5s seguimos sin usuario, cerrar sesión para evitar loops.
    const timer = setTimeout(() => {
      const s = useAuthStore.getState();
      if (s.isAuthenticated && !s.user) {
        console.error('fetchMe timeout - forcing logout');
        s.logout();
      }
    }, 5000);
    return () => clearTimeout(timer);
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Route path="/register" element={<RegisterPage />} />
          
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

          {/* Landing pública (TalKent AI) */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
