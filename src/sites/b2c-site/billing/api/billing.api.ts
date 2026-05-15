import api from '../../../../shared/lib/axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  priceId?: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export const billingApi = {
  getPlans: async () => {
    const response = await api.get<{ plans: Plan[] }>('/billing/plans');
    return response.data.plans;
  },

  getSubscription: async () => {
    const response = await api.get<SubscriptionInfo>('/billing/subscription');
    return response.data;
  },

  createCheckoutSession: async (priceId: string) => {
    const response = await api.post<{ url: string }>('/billing/create-checkout-session', { priceId });
    return response.data;
  },

  createPortalSession: async () => {
    const response = await api.post<{ url: string }>('/billing/create-portal-session');
    return response.data;
  }
};
