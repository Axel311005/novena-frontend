import { ninoApi } from '../api/ninoApi';
import type { Nino, UpdateNinoDto } from '../types/nino.interface';

export const updateNino = async (id: number, nino: UpdateNinoDto): Promise<Nino> => {
  return await ninoApi.update(id, nino);
};

