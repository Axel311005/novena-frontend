import { asistenciaApi } from '../api/asistenciaApi';

export const deleteAsistencia = async (id: number): Promise<void> => {
  return await asistenciaApi.delete(id);
};

