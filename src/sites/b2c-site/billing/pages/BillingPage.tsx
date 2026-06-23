import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, CreditCard, Zap, ShieldCheck, ExternalLink, Loader2, HardDrive } from 'lucide-react';
import { billingApi, type Plan } from '../api/billing.api';
import { PLAN_META, planPerks } from '../planMeta';
import { ConversationSidebar } from '../../conversations/components/ConversationSidebar';
import { useAuthStore } from '../../auth/store/authStore';
import { PlanConfirmModal } from '../components/PlanConfirmModal';

export const BillingPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [confirmPlan, setConfirmPlan] = useState<Plan | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: billingApi.getPlans,
  });

  const checkoutMutation = useMutation({
    mutationFn: (plan: string) => billingApi.createCheckoutSession(plan),
    onSuccess: (res) => {
      window.location.href = res.checkoutUrl;
    },
  });

  const portalMutation = useMutation({
    mutationFn: billingApi.createPortalSession,
    onSuccess: (res) => {
      window.location.href = res.portalUrl;
    },
  });

  // Tarjetas a mostrar: Free (base) + planes de pago del backend.
  const cards: Plan[] = data ? [{ ...data.free, priceId: undefined }, ...data.plans] : [];

  const checkoutError =
    checkoutMutation.isError
      ? ((checkoutMutation.error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message as string) ||
        'No se pudo iniciar el pago. Inténtalo de nuevo.'
      : null;

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F4F2ED] font-body overflow-hidden">
      <ConversationSidebar />

      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        {/* Fondo sutil */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] login-grid" />
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-[#2563EB]/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full mx-auto px-8 md:px-12 py-12">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
              Elige tu plan
            </h1>
            <p className="mt-4 font-body text-white/45 max-w-xl mx-auto">
              Escala tus límites de análisis. Cambia o cancela cuando quieras.
            </p>
          </header>

          {/* Plan actual */}
          <div className="mb-12 border-2 border-white/10 bg-white/[0.02] p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">Plan actual</p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-tighter capitalize">{user?.plan}</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-heading text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">
                    Activo
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/15 hover:border-[#2563EB] hover:bg-[#2563EB]/10 font-heading font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer disabled:opacity-50"
            >
              {portalMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
              Gestionar pagos
              <ExternalLink size={13} className="text-white/30" />
            </button>
          </div>

          {/* Grid de planes */}
          {isLoading ? (
            <div className="py-24 flex justify-center">
              <Loader2 className="animate-spin text-[#2563EB]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((plan, idx) => {
                const meta = PLAN_META[plan.id];
                const isCurrent = user?.plan?.toLowerCase() === plan.id.toLowerCase();
                const isFree = plan.id === 'free';
                const recommended = meta?.recommended;
                const storage = plan.maxSizeMB >= 1024 ? `${Math.round(plan.maxSizeMB / 1024)} GB` : `${plan.maxSizeMB} MB`;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`relative flex flex-col p-7 border-2 transition-colors ${
                      recommended ? 'border-[#2563EB] bg-[#2563EB]/[0.06]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                    }`}
                  >
                    {recommended && (
                      <span className="absolute -top-3 left-7 px-3 py-1 bg-[#2563EB] text-white font-heading text-[9px] font-bold uppercase tracking-[0.25em]">
                        Recomendado
                      </span>
                    )}

                    <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">{plan.name}</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-heading text-4xl font-bold tracking-tighter">{meta?.price}</span>
                      <span className="font-body text-white/35 text-sm">{meta?.period}</span>
                    </div>
                    {meta && <p className="mt-3 font-body text-sm text-white/45 leading-relaxed min-h-[40px]">{meta.tagline}</p>}

                    <div className="mt-4 inline-flex self-start items-center gap-2 border border-white/15 px-2.5 py-1">
                      <HardDrive size={12} className="text-[#2563EB]" />
                      <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/60">{storage} / archivo</span>
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {planPerks(plan).map((perk, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-sm text-white/60">
                          <Check size={15} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={isCurrent || isFree}
                      onClick={() => setConfirmPlan(plan)}
                      className={`mt-8 w-full py-3.5 font-heading font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-colors ${
                        isCurrent
                          ? 'border-2 border-white/10 text-white/35 cursor-default'
                          : isFree
                            ? 'border-2 border-white/10 text-white/35 cursor-default'
                            : recommended
                              ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] cursor-pointer'
                              : 'border-2 border-white/20 hover:border-[#2563EB] hover:bg-[#2563EB]/10 cursor-pointer'
                      }`}
                    >
                      {isCurrent ? (
                        'Plan actual'
                      ) : isFree ? (
                        'Incluido'
                      ) : (
                        <>
                          <Zap size={14} /> Elegir plan {plan.name}
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-center font-heading text-[11px] text-white/25 uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={13} /> Pagos seguros procesados por Stripe
          </p>
        </div>
      </main>

      {/* Modal de confirmación por plan */}
      <PlanConfirmModal
        plan={confirmPlan}
        isPending={checkoutMutation.isPending}
        error={checkoutError}
        onConfirm={() => confirmPlan && checkoutMutation.mutate(confirmPlan.id)}
        onClose={() => {
          checkoutMutation.reset();
          setConfirmPlan(null);
        }}
      />
    </div>
  );
};
