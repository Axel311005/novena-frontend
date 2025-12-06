import { ninoApi } from '../api/ninoApi';
import type { Nino } from '../types/nino.interface';

export const getNinoById = async (id: number): Promise<Nino> => {
  return await ninoApi.getById(id);
};

