import { userApi } from '../api/userApi';
import type { CreateUserDto, User } from '../types/user.interface';

export const createUser = async (user: CreateUserDto): Promise<User> => {
  return await userApi.create(user);
};

