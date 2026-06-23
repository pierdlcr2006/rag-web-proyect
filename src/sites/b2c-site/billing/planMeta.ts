import type { Plan } from './api/billing.api';

/**
 * Metadata de presentación por plan. El backend (GET /billing/plans) NO devuelve
 * precio ni eslogan — solo límites (maxFiles, maxSizeMB, allowedTypes) y el priceId
 * de Stripe. Estos textos/precios son SOLO para mostrar; el cobro real lo define
 * Stripe en el checkout. Ajusta los precios para que coincidan con tus precios de Stripe.
 */
export interface PlanMeta {
  tagline: string;
  price: string;
  period: string;
  recommended?: boolean;
}

export const PLAN_META: Record<string, PlanMeta> = {
  free: {
    tagline: 'Para empezar a explorar tus documentos con la IA.',
    price: 'S/ 0',
    period: '/mes',
  },
  pro: {
    tagline: 'Trabaja más rápido con límites ampliados y análisis avanzado.',
    price: 'S/ 73.99',
    period: '/mes',
    recommended: true,
  },
  business: {
    tagline: 'Máximo nivel de acceso para equipos y alto volumen.',
    price: 'S/ 359.90',
    period: '/mes',
  },
};

const TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF',
  docx: 'Word',
  image: 'imágenes',
  video: 'video',
  audio: 'audio',
};

function formatTypes(types: string[]): string {
  const labels = types.map((t) => TYPE_LABELS[t] ?? t);
  if (labels.length <= 1) return labels.join('');
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`;
}

/** Genera la lista de beneficios a partir de los límites reales del backend. */
export function planPerks(plan: Pick<Plan, 'maxFiles' | 'maxSizeMB' | 'allowedTypes'>): string[] {
  const files = plan.maxFiles < 0 ? 'Archivos ilimitados' : `Hasta ${plan.maxFiles} archivos`;
  const size =
    plan.maxSizeMB >= 1024
      ? `${Math.round(plan.maxSizeMB / 1024)} GB por archivo`
      : `${plan.maxSizeMB} MB por archivo`;
  return [
    files,
    size,
    `Soporta ${formatTypes(plan.allowedTypes)}`,
    'Citas verificables a la fuente (sin alucinaciones)',
  ];
}
