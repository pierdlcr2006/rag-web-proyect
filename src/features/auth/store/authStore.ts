import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
}

interface User {
  id: string;
  email: string;
  plan: UserPlan;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, accessToken: token, isAuthenticated: true });
      },

      login: async (email, password) => {
        try {
          const response = await axios.post('/api/auth/login', { email, password });
          const { user, accessToken } = response.data;
          set({ user, accessToken, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      refreshToken: async () => {
        try {
          const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          const { user, accessToken } = response.data;
          set({ user, accessToken, isAuthenticated: true });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      logout: async () => {
        try {
          await axios.post('/api/auth/logout', {}, { withCredentials: true });
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
