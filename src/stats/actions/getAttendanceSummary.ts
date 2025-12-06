import { statsApi } from '../api/statsApi';
import type { AttendanceSummary } from '../types/stats.interface';

export const getAttendanceSummary = async (): Promise<AttendanceSummary> => {
  return await statsApi.getAttendanceSummary();
};

