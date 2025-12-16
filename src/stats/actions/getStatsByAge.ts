import { statsApi } from '../api/statsApi';
import type { StatsByAge } from '../types/stats.interface';

export const getStatsByAge = async (): Promise<StatsByAge> => {
  return await statsApi.getStatsByAge();
};
