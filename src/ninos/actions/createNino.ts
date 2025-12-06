import { ninoApi } from '../api/ninoApi';
import type { Nino, CreateNinoDto } from '../types/nino.interface';

export const createNino = async (nino: CreateNinoDto): Promise<Nino> => {
  return await ninoApi.create(nino);
};

