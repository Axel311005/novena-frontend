import { ninoApi } from '../api/ninoApi';
import type { Nino } from '../types/nino.interface';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { GetNinosParams } from '../api/ninoApi';

export const getNinos = async (
  params?: GetNinosParams
): Promise<Nino[] | PaginatedResponse<Nino>> => {
  return await ninoApi.getAll(params);
};

