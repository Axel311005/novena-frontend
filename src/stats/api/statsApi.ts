import { novenaApi } from '@/shared/api/novenaApi';
import type {
  DashboardStats,
  StatsByDay,
  KidsWithoutAttendance,
  KidStats,
  AttendanceSummary,
} from '../types/stats.interface';

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await novenaApi.get<DashboardStats>('/stats/dashboard');
    return data;
  },

  getStatsByDay: async (): Promise<StatsByDay> => {
    const { data } = await novenaApi.get<StatsByDay>('/stats/by-day');
    return data;
  },

  getKidsWithoutAttendance: async (): Promise<KidsWithoutAttendance> => {
    const { data } = await novenaApi.get<KidsWithoutAttendance>('/stats/kids-without-attendance');
    return data;
  },

  getKidStats: async (id: number): Promise<KidStats> => {
    const { data } = await novenaApi.get<KidStats>(`/stats/kid/${id}`);
    return data;
  },

  getAttendanceSummary: async (): Promise<AttendanceSummary> => {
    const { data } = await novenaApi.get<AttendanceSummary>('/stats/attendance-summary');
    return data;
  },
};

