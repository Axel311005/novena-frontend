import { novenaApi } from '@/shared/api/novenaApi';
import type { AuthResponse } from '../types/Auth.response';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  try {
    const { data } = await novenaApi.get<AuthResponse>('/auth/check-status');
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    throw error;
  }
};

