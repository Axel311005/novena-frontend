import { novenaApi } from '@/shared/api/novenaApi';
import type { Nino, CreateNinoDto, UpdateNinoDto } from '../types/nino.interface';
import type { PaginatedResponse } from '@/shared/types/pagination';

export interface GetNinosParams {
  limit?: number;
  offset?: number;
  q?: string;
}

export const ninoApi = {
  getAll: async (params?: GetNinosParams): Promise<Nino[] | PaginatedResponse<Nino>> => {
    const queryParams = params
      ? {
          limit: params.limit,
          offset: params.offset,
          ...(params.q && { q: params.q }),
        }
      : undefined;

    const response = await novenaApi.get<PaginatedResponse<Nino> | Nino[]>('/kids', {
      params: queryParams,
    });

    // El backend siempre devuelve un objeto paginado cuando hay parámetros
    // Verificar si response.data es un objeto paginado (tiene 'data' y 'total')
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'total' in response.data) {
      // Asegurar que el array data mantenga el orden original del backend
      const paginated = response.data as PaginatedResponse<Nino>;
      return {
        ...paginated,
        data: paginated.data || [], // Mantener orden exacto del backend
      };
    }

    // Si es un array (sin paginación), devolverlo directamente
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback: retornar estructura vacía
    return {
      data: [],
      total: 0,
      limit: params?.limit || 10,
      offset: params?.offset || 0,
    };
  },

  getById: async (id: number): Promise<Nino> => {
    const { data } = await novenaApi.get<Nino>(`/kids/${id}`);
    return data;
  },

  create: async (nino: CreateNinoDto): Promise<Nino> => {
    const { data } = await novenaApi.post<Nino>('/kids', nino);
    return data;
  },

  update: async (id: number, nino: UpdateNinoDto): Promise<Nino> => {
    const { data } = await novenaApi.patch<Nino>(`/kids/${id}`, nino);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await novenaApi.delete(`/kids/${id}`);
  },
};

