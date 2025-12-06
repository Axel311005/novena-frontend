import { novenaApi } from '@/shared/api/novenaApi';
import type { AuthResponse } from '../types/Auth.response';
import { clearTokenCache } from '@/shared/utils/tokenUtils';

export interface RegisterDto {
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
}

export const registerAction = async (registerData: RegisterDto): Promise<AuthResponse> => {
  try {
    const { data } = await novenaApi.post<AuthResponse>('/auth/register', registerData);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      clearTokenCache();
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      let errorMessage: string;
      
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ');
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else {
        errorMessage = 'Error al crear la cuenta';
      }
      
      const customError = new Error(errorMessage);
      (customError as any).response = error.response;
      (customError as any).status = error.response.status;
      throw customError;
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error al crear la cuenta. Por favor, intenta nuevamente.');
  }
};

