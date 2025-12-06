import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia } from '../types/asistencia.interface';

export const getAsistenciasByNino = async (ninoId: number): Promise<Asistencia[]> => {
  return await asistenciaApi.getByNino(ninoId);
};

