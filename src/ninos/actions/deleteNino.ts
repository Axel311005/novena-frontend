import { ninoApi } from '../api/ninoApi';

export const deleteNino = async (id: number): Promise<void> => {
  return await ninoApi.delete(id);
};

