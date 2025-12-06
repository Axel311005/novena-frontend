import { statsApi } from '../api/statsApi';
import type { KidsWithoutAttendance } from '../types/stats.interface';

export const getKidsWithoutAttendance = async (): Promise<KidsWithoutAttendance> => {
  return await statsApi.getKidsWithoutAttendance();
};

