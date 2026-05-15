import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Check, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { billingApi } from '../api/billing.api';
import { ConversationSidebar } from '../../conversations/components/ConversationSidebar';
import { useAuthStore } from '../../auth/store/authStore';
import { cn } from '@/lib/utils';

export const BillingPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { data: plans, isLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: billingApi.getPlans,
  });

  const checkoutMutation = useMutation({
    mutationFn: (priceId: string) => billingApi.createCheckoutSession(priceId),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const portalMutation = useMutation({
    mutationFn: billingApi.createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeMouseMoveListener?.(); // Cleanup logic simplified
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      <ConversationSidebar />

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Mouse Tracking Glow */}
      <motion.div 
        className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[100px]"
        animate={{ x: mousePosition.x - 400, y: mousePosition.y - 400 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
        {/* Header */}
        <header className="p-12 pb-6 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest"
          >
            <Sparkles size={14} /> Membresía Premium
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-white/90">Elige el plan ideal para tu flujo de trabajo</h1>
          <p className="text-white/40 font-medium max-w-xl mx-auto">Escala tus capacidades de análisis con Gemini 1.5 Pro y almacenamiento ilimitado.</p>
        </header>

        <div className="max-w-6xl mx-auto p-12 pt-0 w-full space-y-12">
          {/* Active Subscription Status */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2.5rem] p-8 border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <ShieldCheck size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-white/30 uppercase tracking-widest">Plan Actual</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white/90 capitalize">{user?.plan}</h2>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-500/20">Activo</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => portalMutation.mutate()}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-sm transition-all group active:scale-95"
            >
              <CreditCard size={18} className="text-white/40 group-hover:text-white transition-colors" />
              Gestionar Pagos y Facturas
              <ExternalLink size={14} className="text-white/20" />
            </button>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
            ) : plans?.map((plan: any, idx: number) => {
              const isCurrent = user?.plan?.toLowerCase() === plan.name.toLowerCase();
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "glass-card rounded-[3rem] p-8 flex flex-col relative group transition-all duration-500",
                    isCurrent ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/5" : "border-white/5 hover:border-white/10"
                  )}
                >
                  {isCurrent && (
                    <div className="absolute top-6 right-8">
                      <div className="p-2 bg-primary/20 text-primary rounded-xl"><Check size={16} /></div>
                    </div>
                  )}

                  <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                      <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">{plan.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white/90">${plan.price}</span>
                        <span className="text-white/30 font-bold text-sm">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      {plan.features?.map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-white/60 font-medium">
                          <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCurrent || checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate(plan.priceId)}
                    className={cn(
                      "mt-10 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
                      isCurrent 
                        ? "bg-white/5 text-white/40 border border-white/5 cursor-default" 
                        : plan.name.toLowerCase() === 'pro' 
                          ? "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary-dark" 
                          : "bg-white text-black hover:bg-slate-200"
                    )}
                  >
                    {isCurrent ? 'Plan Actual' : checkoutMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    {!isCurrent && `Elegir Plan ${plan.name}`}
                  </button>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center pt-8">
            <p className="text-xs text-white/20 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck size={14} /> Pagos seguros procesados por Stripe
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
