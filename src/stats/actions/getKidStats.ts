import { statsApi } from '../api/statsApi';
import type { KidStats } from '../types/stats.interface';

export const getKidStats = async (id: number): Promise<KidStats> => {
  return await statsApi.getKidStats(id);
};

