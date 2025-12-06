export interface AuthResponse {
  id: string;
  email: string;
  loginAttempts: number;
  blockedUntil: null | string;
  estado: string;
  roles: string[];
  token: string;
  usuario?: {
    id: number;
    nombre: string;
    apellido?: string;
  };
}

