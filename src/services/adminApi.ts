/**
 * Admin API Service (Authenticated — Admin role)
 * Endpoints: /api/admin/*, /api/AdminSpeciality/*
 */

import { api } from './apiClient';
import type {
  CreateAppointmentByAdminDTO,
  AppointmentStatusEnum,
  CreateDoctorDto,
  UpdateDoctorDto,
  CreatePatientByAdminDTO,
  SpecialityDTO,
} from '@/types/api';

// ── Admin Appointments ─────────────────────────────────────────
export const adminAppointmentApi = {
  /** POST /api/admin/appointments */
  create: (data: CreateAppointmentByAdminDTO) =>
    api.post('/api/admin/appointments', data),

  /** GET /api/admin/appointments */
  getAll: () => api.get('/api/admin/appointments'),

  /** GET /api/admin/appointments/{id} */
  getById: (id: number) => api.get(`/api/admin/appointments/${id}`),

  /** PATCH /api/admin/appointments/{id}/cancel */
  cancel: (id: number) => api.patch(`/api/admin/appointments/${id}/cancel`),

  /** PATCH /api/admin/appointments/{id}/status */
  updateStatus: (id: number, status: AppointmentStatusEnum) =>
    api.patch(`/api/admin/appointments/${id}/status`, status),
};

// ── Admin Doctors ──────────────────────────────────────────────
export const adminDoctorApi = {
  /** GET /api/admin/doctors */
  getAll: () => api.get('/api/admin/doctors'),

  /** POST /api/admin/doctors */
  create: (data: CreateDoctorDto) => api.post('/api/admin/doctors', data),

  /** GET /api/admin/doctors/{id} */
  getById: (id: number) => api.get(`/api/admin/doctors/${id}`),

  /** PUT /api/admin/doctors/{id} */
  update: (id: number, data: UpdateDoctorDto) =>
    api.put(`/api/admin/doctors/${id}`, data),

  /** DELETE /api/admin/doctors/{id} */
  delete: (id: number) => api.delete(`/api/admin/doctors/${id}`),

  /** PATCH /api/admin/doctors/{id}/toggle-status */
  toggleStatus: (id: number) =>
    api.patch(`/api/admin/doctors/${id}/toggle-status`),
};

// ── Admin Patients ─────────────────────────────────────────────
export const adminPatientApi = {
  /** POST /api/admin/CreatePatients */
  create: (data: CreatePatientByAdminDTO) =>
    api.post('/api/admin/CreatePatients', data),
};

// ── Admin Specialities ─────────────────────────────────────────
export const adminSpecialityApi = {
  /** GET /api/AdminSpeciality */
  getAll: () => api.get<SpecialityDTO[]>('/api/AdminSpeciality'),

  /** POST /api/AdminSpeciality */
  create: (data: SpecialityDTO) =>
    api.post('/api/AdminSpeciality', data),

  /** GET /api/AdminSpeciality/{id} */
  getById: (id: number) => api.get<SpecialityDTO>(`/api/AdminSpeciality/${id}`),

  /** PUT /api/AdminSpeciality/{id} */
  update: (id: number, data: SpecialityDTO) =>
    api.put(`/api/AdminSpeciality/${id}`, data),

  /** DELETE /api/AdminSpeciality/{id} */
  delete: (id: number) => api.delete(`/api/AdminSpeciality/${id}`),
};
