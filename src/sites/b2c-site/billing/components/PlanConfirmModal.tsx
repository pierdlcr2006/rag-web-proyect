import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, ShieldCheck, HardDrive } from 'lucide-react';
import type { Plan } from '../api/billing.api';
import { PLAN_META, planPerks } from '../planMeta';

interface Props {
  plan: Plan | null;
  isPending: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const PlanConfirmModal: React.FC<Props> = ({ plan, isPending, error, onConfirm, onClose }) => {
  // Cerrar con Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isPending && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, isPending]);

  const meta = plan ? PLAN_META[plan.id] : undefined;
  const perks = plan ? planPerks(plan) : [];
  const storage = plan ? (plan.maxSizeMB >= 1024 ? `${Math.round(plan.maxSizeMB / 1024)} GB` : `${plan.maxSizeMB} MB`) : '';

  return createPortal(
    <AnimatePresence>
      {plan && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isPending && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0A0A0A] text-[#F4F2ED] border-2 border-[#2563EB]/50 font-body shadow-[10px_10px_0_rgba(37,99,235,0.18)]"
          >
            {/* Cerrar */}
            <button
              onClick={() => !isPending && onClose()}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
              disabled={isPending}
            >
              <X size={18} />
            </button>

            <div className="p-8">
              {meta?.recommended && (
                <span className="inline-block mb-4 px-3 py-1 bg-[#2563EB] text-white font-heading text-[10px] font-bold uppercase tracking-[0.25em]">
                  Recomendado
                </span>
              )}

              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">Plan</p>
              <h2 className="font-heading text-4xl font-bold uppercase tracking-tighter leading-none mt-1">
                {plan.name}
              </h2>
              {meta && <p className="mt-3 font-body text-sm text-white/55 leading-relaxed">{meta.tagline}</p>}

              {/* Chip de almacenamiento */}
              <div className="mt-5 inline-flex items-center gap-2 border border-white/15 px-3 py-1.5">
                <HardDrive size={13} className="text-[#2563EB]" />
                <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-white/70">
                  {storage} por archivo
                </span>
              </div>

              {/* Precio */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-heading text-5xl font-bold tracking-tighter">{meta?.price}</span>
                <span className="font-body text-white/40">{meta?.period}</span>
              </div>

              {/* Beneficios */}
              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-white/70">
                    <Check size={16} className="text-[#2563EB] mt-0.5 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              {error && (
                <p className="mt-5 font-body text-sm text-red-400 border-l-2 border-red-400/60 pl-3">{error}</p>
              )}

              {/* Acciones */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={onConfirm}
                  disabled={isPending}
                  className="w-full bg-[#2563EB] text-white py-4 font-heading font-bold uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Confirmar y continuar</>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="w-full border-2 border-white/15 text-white/60 hover:text-white hover:border-white/30 py-3 font-heading font-bold uppercase text-xs tracking-widest transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 font-body text-[11px] text-white/30 uppercase tracking-widest">
                <ShieldCheck size={13} /> Pago seguro con Stripe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
