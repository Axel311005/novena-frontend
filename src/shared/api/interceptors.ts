import { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { isTokenExpired, clearTokenCache } from '@/shared/utils/tokenUtils';

// Caché de verificación de expiración para el interceptor
let lastExpirationCheck: {
  token: string;
  isExpired: boolean;
  checkedAt: number;
} | null = null;
const EXPIRATION_CHECK_CACHE_TTL = 5000;

export const clearExpirationCache = () => {
  lastExpirationCheck = null;
};

// Endpoints públicos que no requieren autenticación
const PUBLIC_ENDPOINTS = [
  '/auth/login',
];

const createRequestInterceptor = () => {
  return (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    const isPublic = isPublicEndpoint(url);

    if (isPublic) {
      return config;
    }

    const token = localStorage.getItem('token');

    if (token && config.url) {
      const now = Date.now();

      let isExpired = false;

      if (lastExpirationCheck && lastExpirationCheck.token !== token) {
        lastExpirationCheck = null;
      }

      if (
        !lastExpirationCheck ||
        now - lastExpirationCheck.checkedAt > EXPIRATION_CHECK_CACHE_TTL
      ) {
        isExpired = isTokenExpired(token);
        lastExpirationCheck = {
          token,
          isExpired,
          checkedAt: now,
        };
      } else {
        isExpired = lastExpirationCheck.isExpired;
      }

      if (isExpired) {
        localStorage.removeItem('token');
        clearTokenCache();
        lastExpirationCheck = null;

        (async () => {
          try {
            const { useAuthStore } = await import('@/auth/store/auth.store');
            useAuthStore.getState().logout();
          } catch (err) {
            // Error al limpiar store de autenticación
          }

          if (
            window.location.pathname.startsWith('/admin') &&
            window.location.pathname !== '/login'
          ) {
            window.location.href = '/login';
          }
        })();

        return Promise.reject(new Error('Token expirado'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };
};

const createResponseInterceptor = () => {
  return async (error: AxiosError) => {
    if (
      error.response?.data &&
      typeof error.response.data === 'string' &&
      error.response.data.trim().startsWith('<')
    ) {
      const htmlError = new Error(
        'El servidor devolvió una respuesta HTML en lugar de JSON.'
      );
      htmlError.name = 'HTMLResponseError';
      return Promise.reject(htmlError);
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/register'];

      const isPublicPath = publicPaths.includes(currentPath);

      if (isPublicPath) {
        return Promise.reject(error);
      }

      const isProtectedPath =
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/ninos') ||
        currentPath.startsWith('/asistencias');

      if (isProtectedPath) {
        setTimeout(async () => {
          const token = localStorage.getItem('token');
          if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            clearTokenCache();
            lastExpirationCheck = null;

            try {
              const { useAuthStore } = await import('@/auth/store/auth.store');
              useAuthStore.getState().logout();
            } catch (err) {
              // Si falla la importación, solo limpiar localStorage
            }

            window.location.href = '/login';
          }
        }, 3000);
      }
    }

    return Promise.reject(error);
  };
};

const setupInterceptorsForInstance = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    createRequestInterceptor(),
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    createResponseInterceptor()
  );
};

const axiosInstances: AxiosInstance[] = [];

export const registerAxiosInstance = (instance: AxiosInstance) => {
  if (!axiosInstances.includes(instance)) {
    axiosInstances.push(instance);
    setupInterceptorsForInstance(instance);
  }
};

export const setupRequestInterceptor = () => {
  // Las instancias se registran automáticamente al importarse
};

export const setupResponseInterceptor = () => {
  // Ya está incluido en setupInterceptorsForInstance
};

const isPublicEndpoint = (url: string): boolean => {
  if (!url) return false;
  const normalizedUrl = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];

  return PUBLIC_ENDPOINTS.some((endpoint) => {
    if (normalizedUrl === endpoint) return true;
    return (
      normalizedUrl.startsWith(endpoint) &&
      (normalizedUrl.length === endpoint.length ||
        normalizedUrl[endpoint.length] === '?')
    );
  });
};

export const hasAdminPanelAccess = (roles: string[]): boolean => {
  const ADMIN_PANEL_ROLES = ['admin', 'usuario'];
  return roles.some((role) => ADMIN_PANEL_ROLES.includes(role));
};

