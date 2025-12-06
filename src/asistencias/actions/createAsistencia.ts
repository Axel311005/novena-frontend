import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia, CreateAsistenciaDto } from '../types/asistencia.interface';

export const createAsistencia = async (asistencia: CreateAsistenciaDto): Promise<Asistencia> => {
  return await asistenciaApi.create(asistencia);
};

