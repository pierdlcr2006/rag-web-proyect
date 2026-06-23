import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, Loader2, ArrowRight, Check } from 'lucide-react';
import Preloader from '../../../../components/landing/Preloader';
import AuthAside from '../components/AuthAside';

const GOOGLE_PATH =
  'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z';

// Reglas del backend (RegisterDto): mín. 8 caracteres, 1 mayúscula y 1 número.
const rules = [
  { id: 'len', label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { id: 'upper', label: 'Una letra mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'num', label: 'Un número', test: (p: string) => /[0-9]/.test(p) },
];

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const passOk = rules.every((r) => r.test(password));
  const match = password.length > 0 && password === confirm;
  const canSubmit = !!email && passOk && match;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!match) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!passOk) {
      setError('La contraseña no cumple los requisitos.');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password);
      // Las cuentas nuevas son plan/rol básico → directo al chat.
      setShowPreloader(true);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string | string[] } } }).response;
      const raw = res?.data?.message;
      const msg = Array.isArray(raw) ? raw[0] : raw;
      if (res?.status === 409) {
        setError('Ese email ya está registrado. Inicia sesión.');
      } else {
        setError(msg || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = '/api/auth/google';
  };

  const inputCls =
    'w-full bg-transparent border-b-2 border-white/15 focus:border-[#2563EB] outline-none py-3 font-body text-lg placeholder:text-white/25 transition-colors';
  const labelCls =
    'flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-widest text-[#2563EB] mb-2';

  return (
    <>
      {showPreloader && <Preloader onComplete={() => navigate('/chat')} duration={1.2} />}
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
              <span className="hidden sm:inline text-sm text-white/50">¿Ya tienes cuenta?</span>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white/20 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white px-5 py-2 font-heading font-bold uppercase text-xs tracking-widest transition-all cursor-pointer"
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 md:px-12 pb-16">
            <div className="w-full max-w-md">
              <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.95] mb-3">
                Crea tu
                <br />
                cuenta
              </h1>
              <p className="font-body text-white/50 mb-10">Empieza a analizar tu información sin inventar nada.</p>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className={labelCls}>
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <Lock size={14} /> Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls}
                    placeholder="••••••••"
                    required
                  />
                  {/* Checklist de requisitos */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    {rules.map((r) => {
                      const ok = r.test(password);
                      return (
                        <span
                          key={r.id}
                          className={`flex items-center gap-1.5 font-body text-xs transition-colors ${
                            ok ? 'text-[#2563EB]' : 'text-white/35'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 flex items-center justify-center rounded-full border ${
                              ok ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-white/25'
                            }`}
                          >
                            {ok && <Check size={9} strokeWidth={3} />}
                          </span>
                          {r.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    <Lock size={14} /> Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputCls}
                    placeholder="••••••••"
                    required
                  />
                  {confirm.length > 0 && !match && (
                    <p className="mt-2 font-body text-xs text-red-400">Las contraseñas no coinciden.</p>
                  )}
                </div>

                {error && (
                  <p className="font-body text-sm text-red-400 border-l-2 border-red-400/60 pl-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="group relative w-full bg-[#2563EB] text-white py-4 font-heading font-bold uppercase text-sm tracking-widest flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Crear cuenta</span>
                      <ArrowRight
                        size={18}
                        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </>
                  )}
                </button>

                <p className="text-center font-body text-xs text-white/40">
                  Al crear tu cuenta aceptas los términos y la política de privacidad.
                </p>
              </form>

              <div className="mt-10 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/30">o regístrate con</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                aria-label="Registrarse con Google"
                onClick={handleGoogleRegister}
                className="mt-6 w-full border-2 border-white/15 hover:border-[#2563EB] hover:bg-[#2563EB]/10 flex items-center justify-center gap-3 py-3.5 font-heading font-bold uppercase text-sm tracking-widest transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d={GOOGLE_PATH} />
                </svg>
                Registrarse con Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
