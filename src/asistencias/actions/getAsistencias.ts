import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia } from '../types/asistencia.interface';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { GetAsistenciasParams } from '../api/asistenciaApi';

export const getAsistencias = async (
  params?: GetAsistenciasParams
): Promise<Asistencia[] | PaginatedResponse<Asistencia>> => {
  return await asistenciaApi.getAll(params);
};

