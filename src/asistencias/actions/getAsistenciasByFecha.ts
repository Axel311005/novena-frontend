import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia } from '../types/asistencia.interface';

export const getAsistenciasByFecha = async (fecha: string): Promise<Asistencia[]> => {
  return await asistenciaApi.getByFecha(fecha);
};

