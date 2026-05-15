import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import api from '../../../../shared/lib/axios';

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

interface User {
  id: string;
  email: string;
  plan: UserPlan;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<User>;
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
          console.log('LOGIN ATTEMPT:', email);
          const response = await api.post('/auth/login', { email, password });
          console.log('LOGIN RESPONSE:', response.data);
          const { user, accessToken } = response.data;
          set({ user, accessToken, isAuthenticated: true });
          console.log('LOGIN SUCCESS: User role is', user.role);
          return user;
        } catch (error) {
          console.error('LOGIN ERROR:', error);
          throw error;
        }
      },

      refreshToken: async () => {
        try {
          console.log('REFRESHING SESSION...');
          const response = await api.post('/auth/refresh', {});
          console.log('REFRESH RESPONSE:', response.data);
          const { user, accessToken } = response.data;
          
          if (!user) {
            console.error('REFRESH FAILED: No user in response');
            get().logout();
            return;
          }
          
          set({ user, accessToken, isAuthenticated: true });
          console.log('SESSION REFRESHED SUCCESSFULLY');
        } catch (error) {
          console.error('REFRESH ERROR:', error);
          get().logout();
          throw error;
        }
      },

      logout: async () => {
        console.log('LOGOUT ATTEMPT...');
        try {
          await api.post('/auth/logout', {});
          console.log('LOGOUT SUCCESS');
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
