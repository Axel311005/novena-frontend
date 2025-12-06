export interface CreateUserDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  estado: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

