/**
 * Lookup API Service (Public endpoints)
 * Endpoints: /api/Lookup/*
 */

import { api } from './apiClient';
import type { DoctorLookupDTO, SpecializationDTO } from '@/types/api';

export const lookupApi = {
  /** GET /api/Lookup/Doctors */
  getDoctors: () => api.get<DoctorLookupDTO[]>('/api/Lookup/Doctors'),

  /** GET /api/Lookup/DoctorsBySpeciality/{specialityId} */
  getDoctorsBySpeciality: (specialityId: number) =>
    api.get<DoctorLookupDTO[]>(`/api/Lookup/DoctorsBySpeciality/${specialityId}`),

  /** GET /api/Lookup/Specializations */
  getSpecializations: () =>
    api.get<SpecializationDTO[]>('/api/Lookup/Specializations'),
};
