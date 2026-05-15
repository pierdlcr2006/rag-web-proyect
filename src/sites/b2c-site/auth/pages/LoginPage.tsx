import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/authStore';
import { Sparkles, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('LoginPage: Submitting login...');
      const user = await login(email, password);
      console.log('LoginPage: Login successful, user role:', user?.role);
      
      // Redirect based on role
      if (user?.role === UserRole.ADMIN) {
        console.log('LoginPage: Redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('LoginPage: Redirecting to /chat');
        navigate('/chat');
      }
    } catch (error) {
      console.error('LoginPage: Login failed', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-anthropic-bg p-6 relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200 rounded-[2rem] flex items-center justify-center mx-auto text-primary border border-slate-50">
            <Sparkles size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-slate-500 font-medium">Ingresa tus credenciales para acceder al RAG AI</p>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/40 shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900"
                  placeholder="tu@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Iniciar Sesión <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              ¿No tienes cuenta? <a href="#" className="text-primary font-black hover:underline">Regístrate gratis</a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-green-500" /> Seguro SSL
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-primary" /> Gemini 1.5 Pro
          </div>
        </div>
      </div>
    </div>
  );
};
