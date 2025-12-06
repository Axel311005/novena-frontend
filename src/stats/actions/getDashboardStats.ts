import { statsApi } from '../api/statsApi';
import type { DashboardStats } from '../types/stats.interface';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await statsApi.getDashboardStats();
};

