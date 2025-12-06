import { asistenciaApi } from '../api/asistenciaApi';
import type { Asistencia, UpdateAsistenciaDto } from '../types/asistencia.interface';

export const updateAsistencia = async (id: number, asistencia: UpdateAsistenciaDto): Promise<Asistencia> => {
  return await asistenciaApi.update(id, asistencia);
};

