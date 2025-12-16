import { statsApi } from '../api/statsApi';
import type { StatsBySex } from '../types/stats.interface';

export const getStatsBySex = async (): Promise<StatsBySex> => {
  return await statsApi.getStatsBySex();
};
