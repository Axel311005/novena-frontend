import { novenaApi } from '@/shared/api/novenaApi';
import type { Asistencia, CreateAsistenciaDto, UpdateAsistenciaDto } from '../types/asistencia.interface';
import type { PaginatedResponse } from '@/shared/types/pagination';

export interface GetAsistenciasParams {
  limit?: number;
  offset?: number;
  q?: string;
  kidId?: number;
}

export const asistenciaApi = {
  getAll: async (params?: GetAsistenciasParams): Promise<Asistencia[] | PaginatedResponse<Asistencia>> => {
    const queryParams = params
      ? {
          limit: params.limit,
          offset: params.offset,
          ...(params.q && { q: params.q }),
          ...(params.kidId && { kidId: params.kidId }),
        }
      : undefined;

    const response = await novenaApi.get<PaginatedResponse<Asistencia> | Asistencia[]>('/asistencias', {
      params: queryParams,
    });

    // Si hay parámetros de paginación, el backend devuelve un objeto con data y total
    if (params?.limit !== undefined || params?.offset !== undefined) {
      if (typeof response.data === 'object' && 'data' in response.data) {
        return response.data as PaginatedResponse<Asistencia>;
      }
      // Si devuelve array cuando se espera paginación, convertir
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          limit: params.limit || 10,
          offset: params.offset || 0,
        };
      }
    }

    // Sin paginación, devolver array directamente
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },

  getById: async (id: number): Promise<Asistencia> => {
    const { data } = await novenaApi.get<Asistencia>(`/asistencias/${id}`);
    return data;
  },

  getByKid: async (kidId: number): Promise<Asistencia[]> => {
    const { data } = await novenaApi.get<Asistencia[]>(`/asistencias?kidId=${kidId}`);
    return data;
  },

  getByNino: async (ninoId: number): Promise<Asistencia[]> => {
    const { data } = await novenaApi.get<Asistencia[]>(`/asistencias?kidId=${ninoId}`);
    return data;
  },

  getByFecha: async (fecha: string): Promise<Asistencia[]> => {
    const { data } = await novenaApi.get<Asistencia[]>(`/asistencias?fecha=${fecha}`);
    return data;
  },

  create: async (asistencia: CreateAsistenciaDto): Promise<Asistencia> => {
    const { data } = await novenaApi.post<Asistencia>('/asistencias', asistencia);
    return data;
  },

  update: async (id: number, asistencia: UpdateAsistenciaDto): Promise<Asistencia> => {
    const { data } = await novenaApi.patch<Asistencia>(`/asistencias/${id}`, asistencia);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await novenaApi.delete(`/asistencias/${id}`);
  },
};

