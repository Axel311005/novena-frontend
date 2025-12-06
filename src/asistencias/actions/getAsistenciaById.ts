import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia } from '../types/asistencia.interface';

export const getAsistenciaById = async (id: number): Promise<Asistencia> => {
  return await asistenciaApi.getById(id);
};

