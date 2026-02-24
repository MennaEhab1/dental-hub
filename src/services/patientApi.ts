/**
 * Patient API Service (Authenticated — Patient role)
 * Endpoints: /api/PatientAppointment/*, /api/PatientMedicalHistory/*, /api/PatientPrescriptions/*, /api/PatientReviews/*
 */

import { api } from './apiClient';
import type {
  BookAppointmentDto,
  AddReviewDTO,
  UpdateReviewDTO,
  PrescriptionDetailsDTO,
} from '@/types/api';

export const patientAppointmentApi = {
  /** POST /api/PatientAppointment/BookAppointment */
  book: (data: BookAppointmentDto) =>
    api.post('/api/PatientAppointment/BookAppointment', data),

  /** PATCH /api/PatientAppointment/CancelAppointment/{id} */
  cancel: (appointmentId: number) =>
    api.patch(`/api/PatientAppointment/CancelAppointment/${appointmentId}`),

  /** GET /api/PatientAppointment/GetMyAppointments */
  getMyAppointments: () =>
    api.get('/api/PatientAppointment/GetMyAppointments'),

  /** GET /api/PatientAppointment/GetAppointmentDetails/{id} */
  getDetails: (appointmentId: number) =>
    api.get(`/api/PatientAppointment/GetAppointmentDetails/${appointmentId}`),
};

export const patientMedicalHistoryApi = {
  /** GET /api/PatientMedicalHistory/GetMyMedicalHistory */
  getMyHistory: () =>
    api.get('/api/PatientMedicalHistory/GetMyMedicalHistory'),
};

export const patientPrescriptionApi = {
  /** GET /api/PatientPrescriptions/GetMyPrescriptions */
  getMyPrescriptions: () =>
    api.get<PrescriptionDetailsDTO[]>('/api/PatientPrescriptions/GetMyPrescriptions'),

  /** GET /api/PatientPrescriptions/GetPrescriptionByAppointment/{appointmentId} */
  getByAppointment: (appointmentId: number) =>
    api.get<PrescriptionDetailsDTO>(`/api/PatientPrescriptions/GetPrescriptionByAppointment/${appointmentId}`),
};

export const patientReviewApi = {
  /** POST /api/PatientReviews/AddReview */
  add: (data: AddReviewDTO) =>
    api.post('/api/PatientReviews/AddReview', data),

  /** PUT /api/PatientReviews/UpdateReview/{reviewId} */
  update: (reviewId: number, data: UpdateReviewDTO) =>
    api.put(`/api/PatientReviews/UpdateReview/${reviewId}`, data),

  /** DELETE /api/PatientReviews/DeleteReview/{reviewId} */
  delete: (reviewId: number) =>
    api.delete(`/api/PatientReviews/DeleteReview/${reviewId}`),

  /** GET /api/PatientReviews/GetMyReviews */
  getMyReviews: () =>
    api.get('/api/PatientReviews/GetMyReviews'),

  /** GET /api/PatientReviews/GetMyReviewsForDoctor/{doctorId} */
  getForDoctor: (doctorId: number) =>
    api.get(`/api/PatientReviews/GetMyReviewsForDoctor/${doctorId}`),
};
