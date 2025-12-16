export interface DashboardStats {
  totalKids: number;
  totalAsistencias: number;
  kidsWithAttendance: number;
  averageDays: number;
}

export interface StatsByDay {
  byDay: {
    day1: number;
    day2: number;
    day3: number;
    day4: number;
    day5: number;
    day6: number;
    day7: number;
    day8: number;
    day9: number;
  };
  byDayArray: Array<{
    day: string;
    dayNumber: number;
    count: number;
  }>;
  total: number;
}

export interface KidsWithoutAttendance {
  count: number;
  kids: Array<{
    id: number;
    primerNombre: string | null;
    segundoNombre?: string | null;
    primerApellido: string | null;
    segundoApellido?: string | null;
    edad: number;
    sexo: string;
    createdAt?: string;
  }>;
}

export interface KidStats {
  kid: {
    id: number;
    primerNombre: string | null;
    segundoNombre?: string | null;
    primerApellido: string | null;
    segundoApellido?: string | null;
    edad: number;
    sexo: string;
  };
  stats: {
    totalAsistencias: number;
    totalDaysAttended: number;
    averageDaysPerRecord: number;
    daysBreakdown: {
      day1: number;
      day2: number;
      day3: number;
      day4: number;
      day5: number;
      day6: number;
      day7: number;
      day8: number;
      day9: number;
    };
    attendanceRate: string;
  };
  asistencias: Array<{
    id: number;
    day1: boolean;
    day2: boolean;
    day3: boolean;
    day4: boolean;
    day5: boolean;
    day6: boolean;
    day7: boolean;
    day8: boolean;
    day9: boolean;
    createdAt?: string;
    updatedAt?: string;
  }>;
}

export interface AttendanceSummary {
  general: {
    totalKids: number;
    totalAsistencias: number;
    kidsWithAttendance: number;
    kidsWithoutAttendance: number;
    totalDaysAttended: number;
    averageDaysPerKid: number;
  };
  byDay: {
    day1: number;
    day2: number;
    day3: number;
    day4: number;
    day5: number;
    day6: number;
    day7: number;
    day8: number;
    day9: number;
  };
  topDays: Array<{
    day: string;
    dayNumber: number;
    count: number;
  }>;
  kidsWithBestAttendance: Array<{
    kid: {
      id: number;
      primerNombre: string | null;
      segundoNombre?: string | null;
      primerApellido: string | null;
      segundoApellido?: string | null;
    };
    totalDaysAttended: number;
    totalRecords: number;
  }>;
}

export interface StatsByAge {
  byAge: Record<string, number>;
  byAgeArray: Array<{
    edad: number;
    count: number;
  }>;
  totalKids: number;
}

