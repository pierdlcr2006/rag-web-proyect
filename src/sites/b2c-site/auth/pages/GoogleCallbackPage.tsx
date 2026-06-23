import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore, UserRole } from '../store/authStore';

export const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const completeGoogleLogin = useAuthStore((state) => state.completeGoogleLogin);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (!accessToken) {
      setError('Google no devolvió una sesión válida.');
      return;
    }

    completeGoogleLogin(accessToken)
      .then((user) => {
        navigate(user.role === UserRole.ADMIN ? '/admin' : '/chat', {
          replace: true,
        });
      })
      .catch(() => {
        setError('No se pudo completar el inicio de sesión con Google.');
      });
  }, [completeGoogleLogin, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#F4F2ED] font-body">
      <div className="w-full max-w-md border-2 border-white/10 bg-white/[0.02] p-8 text-center space-y-4">
        {error ? (
          <>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-red-300">
              Error de autenticación
            </h1>
            <p className="text-sm text-white/55">{error}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-6 py-3 bg-[#2563EB] text-white font-heading text-xs font-bold uppercase tracking-widest"
            >
              Volver al login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2563EB]" />
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
              Conectando con Google
            </h1>
            <p className="text-sm text-white/45">
              Estamos preparando tu sesión.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
