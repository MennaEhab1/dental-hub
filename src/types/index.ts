// Core application types - Ready for API integration

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: MedicalRecord[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: DentalSpecialty;
  qualifications: string[];
  experience: number;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableSlots: TimeSlot[];
  workingDays: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export type DentalSpecialty = 
  | 'general'
  | 'orthodontics'
  | 'periodontics'
  | 'endodontics'
  | 'prosthodontics'
  | 'oral-surgery'
  | 'pediatric'
  | 'cosmetic';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  specialty: DentalSpecialty;
  duration: number;
  price: number;
  image?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  serviceId: string;
  service?: Service;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  prescription?: Prescription;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  attachments?: string[];
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  medications: PrescriptionMedication[];
  instructions: string;
  createdAt: string;
}

export interface PrescriptionMedication {
  medicineId: string;
  medicine?: Medicine;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  unit: string;
  description: string;
  sideEffects?: string[];
  image?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  completedAppointments: number;
  revenue: number;
  pendingAppointments: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  role: 'patient' | 'doctor';
}
