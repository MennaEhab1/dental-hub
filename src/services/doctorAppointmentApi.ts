/**
 * Doctor API Service (Authenticated — Doctor role)
 * Endpoints: /api/doctor/*, /api/Prescription/*
 */

import { api } from './apiClient';
import type { AppointmentStatusEnum, CreatePrescriptionDto } from '@/types/api';

export const doctorAppointmentApi = {
  /** GET /api/doctor/appointments?status=&date=&search= */
  getAppointments: (params?: {
    status?: AppointmentStatusEnum;
    date?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status !== undefined) query.set('status', String(params.status));
    if (params?.date) query.set('date', params.date);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return api.get(`/api/doctor/appointments${qs ? `?${qs}` : ''}`);
  },

  /** PUT /api/doctor/appointments/{id}/complete */
  complete: (id: number) =>
    api.put(`/api/doctor/appointments/${id}/complete`),

  /** PUT /api/doctor/appointments/{id}/cancel */
  cancel: (id: number) =>
    api.put(`/api/doctor/appointments/${id}/cancel`),

  /** GET /api/doctor/dashboard */
  getDashboard: () =>
    api.get('/api/doctor/dashboard'),
};

export const prescriptionApi = {
  /** POST /api/Prescription */
  create: (data: CreatePrescriptionDto) =>
    api.post('/api/Prescription', data),

  /** GET /api/Prescription/patient/{patientId} */
  getByPatient: (patientId: number) =>
    api.get(`/api/Prescription/patient/${patientId}`),
};
