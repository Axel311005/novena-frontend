import { novenaApi } from '@/shared/api/novenaApi';
import type { CreateUserDto, User } from '../types/user.interface';

export const userApi = {
  create: async (user: CreateUserDto): Promise<User> => {
    const { data } = await novenaApi.post<User>('/auth/register', user);
    return data;
  },
};

