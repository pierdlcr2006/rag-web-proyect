import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/authStore';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Preloader from '../../../../components/landing/Preloader';
import AuthAside from '../components/AuthAside';

const GOOGLE_PATH =
  'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      const path = user?.role === UserRole.ADMIN ? '/admin' : '/chat';
      setTargetPath(path);
      setShowPreloader(true);
    } catch (error) {
      console.error('LoginPage: Login failed', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
      setIsLoading(false);
    }
  };

  const handlePreloaderComplete = () => {
    if (targetPath) navigate(targetPath);
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} duration={1.2} />}
      <div className="min-h-screen flex bg-[#0A0A0A] text-[#F4F2ED] font-body selection:bg-[#2563EB] selection:text-white">
        <AuthAside />

        {/* ── Panel del formulario (derecha) ── */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center justify-between lg:justify-end gap-4 p-6 md:p-8">
            <button
              onClick={() => navigate('/')}
              className="lg:hidden flex items-center cursor-pointer"
              aria-label="TalKent AI — Inicio"
            >
              <img src="/logo-3.png" alt="TalKent AI" className="h-9 w-auto" />
            </button>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-white/50">¿Aún no tienes cuenta?</span>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white/20 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white px-5 py-2 font-heading font-bold uppercase text-xs tracking-widest transition-all cursor-pointer"
              >
                Crea un perfil
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 md:px-12 pb-16">
            <div className="w-full max-w-md">
              <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.95] mb-3">
                Acceso a la
                <br />
                plataforma
              </h1>
              <p className="font-body text-white/50 mb-10">Ingresa tus credenciales para continuar.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-widest text-[#2563EB] mb-2">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#2563EB] outline-none py-3 font-body text-lg placeholder:text-white/25 transition-colors"
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-widest text-[#2563EB] mb-2">
                    <Lock size={14} /> Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#2563EB] outline-none py-3 font-body text-lg placeholder:text-white/25 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-[#2563EB] text-white py-4 font-heading font-bold uppercase text-sm tracking-widest flex items-center justify-center disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight
                        size={18}
                        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <a href="#" className="font-body text-sm text-white/50 hover:text-[#2563EB] transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>

              <div className="mt-12 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">o continúa con</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                aria-label="Continuar con Google"
                onClick={handleGoogleLogin}
                className="mt-6 w-full border-2 border-white/15 hover:border-[#2563EB] hover:bg-[#2563EB]/10 flex items-center justify-center gap-3 py-3.5 font-heading font-bold uppercase text-sm tracking-widest transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d={GOOGLE_PATH} />
                </svg>
                Continuar con Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
