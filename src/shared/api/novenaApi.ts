import axios from 'axios';
import { registerAxiosInstance } from './interceptors';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl || 'http://localhost:3000';
};

const BASE_URL = getBaseURL();
const API_BASE_URL = `${BASE_URL}/api`;

export const novenaApi = axios.create({
  baseURL: API_BASE_URL,
});

// Registrar la instancia para aplicar interceptores
registerAxiosInstance(novenaApi);

