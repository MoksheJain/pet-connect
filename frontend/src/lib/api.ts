import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('petcare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('petcare_token');
      localStorage.removeItem('petcare_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
};

// ─── Pets ────────────────────────────────────────────────────────────────────
export const petApi = {
  getAll: () => api.get('/pet'),
  create: (data: { name: string; breed: string; age: number }) =>
    api.post('/pet', data),
  getFullProfile: (id: string) => api.get(`/pet/${id}/full-profile`),
  addVaccination: (id: string, data: VaccinationPayload) =>
    api.post(`/pet/${id}/vaccination`, data),
  addReminder: (id: string, data: ReminderPayload) =>
    api.post(`/pet/${id}/reminder`, data),
  addHistory: (id: string, data: HistoryPayload) =>
    api.post(`/pet/${id}/history`, data),
};

// ─── Payload types ────────────────────────────────────────────────────────────
export interface VaccinationPayload {
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  notes?: string;
}

export interface ReminderPayload {
  title: string;
  dueDate: string;
  description?: string;
}

export interface HistoryPayload {
  date: string;
  description: string;
  veterinarian?: string;
}
