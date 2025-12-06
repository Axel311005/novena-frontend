import type { Nino } from '@/ninos/types/nino.interface';

export interface Asistencia {
  id: number;
  kidId: number;
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
  createdByUserId?: string;
  updatedByUserId?: string | null;
  kid?: Nino;
}

export interface CreateAsistenciaDto {
  kidId: number;
  day1?: boolean;
  day2?: boolean;
  day3?: boolean;
  day4?: boolean;
  day5?: boolean;
  day6?: boolean;
  day7?: boolean;
  day8?: boolean;
  day9?: boolean;
}

export interface UpdateAsistenciaDto {
  day1?: boolean;
  day2?: boolean;
  day3?: boolean;
  day4?: boolean;
  day5?: boolean;
  day6?: boolean;
  day7?: boolean;
  day8?: boolean;
  day9?: boolean;
}

