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

    // Si hay parámetros de paginación, el backend devuelve un objeto con data y total
    if (params?.limit !== undefined || params?.offset !== undefined) {
      if (typeof response.data === 'object' && 'data' in response.data) {
        return response.data as PaginatedResponse<Nino>;
      }
      // Si devuelve array cuando se espera paginación, convertir
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
        };
      }
    }

    // Sin paginación, devolver array directamente
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
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

