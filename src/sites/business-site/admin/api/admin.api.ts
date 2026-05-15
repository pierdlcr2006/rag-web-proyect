import api from '@/shared/lib/axios';

export interface BillingStats {
  stripe: {
    totalRevenue: number;
    currency: string;
    activeSubscriptions: number;
    planDistribution: Record<string, number>;
    recentPayments: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      customerEmail: string | null;
      created: string;
    }[];
  };
  aws: {
    totalCost: number;
    currency: string;
    services: { name: string; cost: number }[];
    period: { start: string; end: string };
  };
  gcp: {
    estimatedCost: number;
    currency: string;
    breakdown: {
      service: string;
      calls: number;
      estimatedCost: number;
    }[];
  };
}

export interface ServiceStats {
  users: {
    total: number;
    byPlan: Record<string, number>;
    recentSignups: number;
  };
  files: {
    total: number;
    totalStorageBytes: number;
    totalStorageMB: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  conversations: {
    total: number;
    activeLastWeek: number;
  };
  messages: {
    total: number;
    totalTokensUsed: number;
    byRole: Record<string, number>;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  services: {
    database: { status: string; message: string };
    api: { status: string; uptime: number; version: string };
    ai: { status: string; provider: string };
  };
}

export const adminApi = {
  getBillingStats: async () => {
    const response = await api.get<BillingStats>('/admin/stats/billing');
    return response.data;
  },
  getServiceStats: async () => {
    const response = await api.get<ServiceStats>('/admin/stats/services');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get<AdminUser[]>('/admin/users');
    return response.data;
  },
  getHealth: async () => {
    const response = await api.get<SystemHealth>('/health');
    return response.data;
  },
};
