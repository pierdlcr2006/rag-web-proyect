import api from '../../../../shared/lib/axios';

// Shape real devuelto por GET /billing/plans (ver billing.service.getPlans del backend).
export interface Plan {
  id: string; // 'pro' | 'business' (valor de UserPlan) — es lo que espera el checkout
  name: string; // 'Pro' | 'Business'
  maxFiles: number; // -1 = ilimitado
  maxSizeMB: number;
  allowedTypes: string[];
  priceId?: string;
}

export interface PlansResponse {
  free: Omit<Plan, 'priceId'>;
  plans: Plan[];
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export const billingApi = {
  getPlans: async () => {
    const response = await api.get<PlansResponse>('/billing/plans');
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get<SubscriptionInfo>('/billing/subscription');
    return response.data;
  },

  // El backend espera { plan: 'pro' | 'business' } y devuelve { checkoutUrl }.
  createCheckoutSession: async (plan: string) => {
    const response = await api.post<{ checkoutUrl: string }>('/billing/create-checkout-session', { plan });
    return response.data;
  },

  // El backend devuelve { portalUrl }.
  createPortalSession: async () => {
    const response = await api.post<{ portalUrl: string }>('/billing/create-portal-session');
    return response.data;
  },
};
