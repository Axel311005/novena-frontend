import { statsApi } from '../api/statsApi';
import type { StatsByDay } from '../types/stats.interface';

export const getStatsByDay = async (): Promise<StatsByDay> => {
  return await statsApi.getStatsByDay();
};

