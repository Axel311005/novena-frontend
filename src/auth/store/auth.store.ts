import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '../types/Auth.response';
import { clearTokenCache } from '@/shared/utils/tokenUtils';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthResponse | null) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        clearTokenCache();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      hasRole: (role: string) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.includes(role);
      },

      hasAnyRole: (roles: string[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.some((role) => user.roles.includes(role));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

