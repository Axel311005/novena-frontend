import { novenaApi } from '@/shared/api/novenaApi';
import type { AuthResponse } from '../types/Auth.response';
import { clearTokenCache } from '@/shared/utils/tokenUtils';
import { clearExpirationCache } from '@/shared/api/interceptors';

export interface LoginDto {
  email: string;
  password: string;
}

export const loginAction = async (loginData: LoginDto): Promise<AuthResponse> => {
  try {
    const { data } = await novenaApi.post<AuthResponse>('/auth/login', loginData);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      clearTokenCache();
      clearExpirationCache();
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      let errorMessage: string = '';
      const allMessages: string[] = [];
      
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join('. ');
        allMessages.push(...errorData.message);
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
        allMessages.push(errorData.message);
      }
      
      if (typeof errorData.error === 'string') {
        if (!errorMessage) {
          errorMessage = errorData.error;
        }
        allMessages.push(errorData.error);
      }
      
      if (errorData.details) {
        const details = typeof errorData.details === 'string' 
          ? errorData.details 
          : Array.isArray(errorData.details)
          ? errorData.details.join('. ')
          : String(errorData.details);
        if (!errorMessage) {
          errorMessage = details;
        }
        allMessages.push(details);
      }
      
      if (!errorMessage) {
        const status = error.response.status;
        if (status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (status === 403) {
          errorMessage = 'Acceso denegado';
        } else if (status === 429) {
          errorMessage = 'Demasiados intentos. Por favor, espera un momento';
        } else {
          errorMessage = `Error ${status}: ${error.response.statusText || 'Error al iniciar sesión'}`;
        }
      }
      
      if (allMessages.length > 1) {
        const uniqueMessages = [...new Set(allMessages)];
        errorMessage = uniqueMessages.join('. ');
      }
      
      const customError = new Error(errorMessage);
      (customError as any).response = error.response;
      (customError as any).status = error.response.status;
      throw customError;
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error al iniciar sesión. Por favor, intenta nuevamente.');
  }
};

