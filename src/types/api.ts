/**
 * API DTOs — matches the SmartTeethCare backend Swagger schemas exactly.
 * These types are used by the service layer (src/services/*Api.ts).
 */

// ── Enums ──────────────────────────────────────────────────────
/** 0=Pending, 1=Confirmed, 2=InProgress, 3=Completed, 4=Cancelled */
export type AppointmentStatusEnum = 0 | 1 | 2 | 3 | 4;

/** 1=Cash, 2=Card */
export type AppointmentPaymentMethod = 1 | 2;

/** 1=Pending, 2=Paid, 3=Partial, 4=Refunded, 5=Failed */
export type AppointmentPaymentStatus = 1 | 2 | 3 | 4 | 5;

// ── Auth DTOs ──────────────────────────────────────────────────
export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  userName: string | null;
  email: string | null;
  role: string | null;
  token: string | null;
  refreshToken: string | null;
  expiration: string; // ISO date-time
}

export interface RegisterDTO {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string | null;
  role?: string | null;
  gender?: string | null;
  dateOfBirth?: string; // ISO date-time
}

export interface AuthResponseDTO {
  token: string | null;
  refreshToken: string | null;
  expiration: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string | null;
}

export interface ForgotPasswordDTO {
  email: string | null;
}

export interface ResetPasswordDTO {
  email: string | null;
  token: string | null;
  newPassword: string | null;
}

export interface RevokeTokenDTO {
  refreshToken: string | null;
}

// ── Lookup DTOs ────────────────────────────────────────────────
export interface DoctorLookupDTO {
  id: number;
  name: string | null;
  specializationId: number | null;
  specializationName: string | null;
}

export interface SpecializationDTO {
  id: number;
  name: string | null;
}

// ── Appointment DTOs ───────────────────────────────────────────
export interface BookAppointmentDto {
  dentistId: number;
  appointmentDate: string; // ISO date-time
}

export interface CreateAppointmentByAdminDTO {
  doctorID: number;
  patientID: number;
  date: string; // ISO date-time
  amount: number;
  paymentMethod: AppointmentPaymentMethod;
  paymentStatus?: AppointmentPaymentStatus;
}

// ── Doctor DTOs ────────────────────────────────────────────────
export interface CreateDoctorDto {
  fullName: string | null;
  email: string | null;
  password: string | null;
  salary: number;
  workingHours: number;
  hiringDate: string; // ISO date-time
  specialityID?: number | null;
}

export interface UpdateDoctorDto {
  salary: number;
  workingHours: number;
  specialityID?: number | null;
}

// ── Patient DTOs ───────────────────────────────────────────────
export interface CreatePatientByAdminDTO {
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
}

// ── Speciality DTOs ────────────────────────────────────────────
export interface SpecialityDTO {
  id?: number | null;
  name: string | null;
  description: string | null;
}

// ── Prescription DTOs ──────────────────────────────────────────
export interface PrescriptionMedicineDto {
  medicineId: number;
  dosage: string | null;
  frequency: string | null;
  durationInDays: number;
  quantity: number;
  instructions: string | null;
}

export interface CreatePrescriptionDto {
  appointmentId: number;
  medicines: PrescriptionMedicineDto[] | null;
}

export interface PrescriptionMedicineDetailsDto {
  medicineName: string | null;
  dosage: string | null;
  frequency: string | null;
  durationInDays: number;
  quantity: number;
  instructions: string | null;
}

export interface PrescriptionDetailsDTO {
  prescriptionId: number;
  date: string; // ISO date-time
  doctorName: string | null;
  patientName: string | null;
  medicines: PrescriptionMedicineDetailsDto[] | null;
}

// ── Review DTOs ────────────────────────────────────────────────
export interface AddReviewDTO {
  doctorId: number;
  appointmentId: number;
  rating: number;
  comment: string | null;
}

export interface UpdateReviewDTO {
  rating: number;
  comment: string | null;
}
