/**
 * API Service Layer
 * 
 * This file contains all API calls for the dental center application.
 * Currently using mock data, but structured to easily connect to real endpoints.
 * 
 * To connect to real API:
 * 1. Update BASE_URL to your backend URL
 * 2. Remove mock data imports
 * 3. Uncomment the actual fetch calls
 * 4. Add proper error handling and authentication headers
 */

import { ApiResponse, PaginatedResponse } from '@/types';
import { 
  mockDoctors, 
  mockPatients, 
  mockAppointments, 
  mockServices, 
  mockMedicines,
  mockConversations,
  mockMessages,
  mockDashboardStats 
} from './mockData';
import type { 
  Doctor, 
  Patient, 
  Appointment, 
  Service, 
  Medicine,
  Conversation,
  Message,
  DashboardStats,
  AuthCredentials,
  RegisterData,
  User
} from '@/types';

// TODO: Replace with actual backend URL
const BASE_URL = '/api';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function for API calls (ready for real backend)
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  // TODO: Uncomment when connecting to real backend
  // const response = await fetch(`${BASE_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     ...options?.headers,
  //   },
  // });
  // 
  // if (!response.ok) {
  //   throw new Error(`API Error: ${response.statusText}`);
  // }
  // 
  // return response.json();

  // Mock implementation
  await delay(500);
  return { data: {} as T, success: true };
}

// Authentication Services
export const authService = {
  async login(credentials: AuthCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800);
    // Mock login - find user by email
    const user = [...mockDoctors, ...mockPatients].find(u => u.email === credentials.email);
    if (user) {
      return {
        data: { user, token: 'mock-jwt-token' },
        success: true,
        message: 'Login successful',
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800);
    const newUser: Patient = {
      id: `patient-${Date.now()}`,
      ...data,
      role: 'patient',
      dateOfBirth: '',
      gender: 'other',
      address: '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      data: { user: newUser, token: 'mock-jwt-token' },
      success: true,
      message: 'Registration successful',
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(300);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return { data: JSON.parse(userStr), success: true };
    }
    throw new Error('Not authenticated');
  },
};

// Doctor Services
export const doctorService = {
  async getAll(): Promise<ApiResponse<Doctor[]>> {
    await delay(600);
    return { data: mockDoctors, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Doctor>> {
    await delay(400);
    const doctor = mockDoctors.find(d => d.id === id);
    if (!doctor) throw new Error('Doctor not found');
    return { data: doctor, success: true };
  },

  async getBySpecialty(specialty: string): Promise<ApiResponse<Doctor[]>> {
    await delay(500);
    const doctors = mockDoctors.filter(d => d.specialty === specialty);
    return { data: doctors, success: true };
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<ApiResponse<string[]>> {
    await delay(400);
    // Mock available time slots
    const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];
    return { data: slots, success: true };
  },
};

// Patient Services
export const patientService = {
  async getAll(): Promise<PaginatedResponse<Patient>> {
    await delay(600);
    return {
      data: mockPatients,
      total: mockPatients.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  },

  async getById(id: string): Promise<ApiResponse<Patient>> {
    await delay(400);
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return { data: patient, success: true };
  },

  async update(id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> {
    await delay(500);
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return { data: { ...patient, ...data }, success: true };
  },
};

// Appointment Services
export const appointmentService = {
  async getAll(): Promise<ApiResponse<Appointment[]>> {
    await delay(600);
    return { data: mockAppointments, success: true };
  },

  async getByPatient(patientId: string): Promise<ApiResponse<Appointment[]>> {
    await delay(500);
    const appointments = mockAppointments.filter(a => a.patientId === patientId);
    return { data: appointments, success: true };
  },

  async getByDoctor(doctorId: string): Promise<ApiResponse<Appointment[]>> {
    await delay(500);
    const appointments = mockAppointments.filter(a => a.doctorId === doctorId);
    return { data: appointments, success: true };
  },

  async create(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appointment>> {
    await delay(700);
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { data: newAppointment, success: true, message: 'Appointment booked successfully' };
  },

  async update(id: string, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    await delay(500);
    const appointment = mockAppointments.find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    return { data: { ...appointment, ...data }, success: true };
  },

  async cancel(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    return { data: undefined, success: true, message: 'Appointment cancelled' };
  },
};

// Service Services
export const serviceService = {
  async getAll(): Promise<ApiResponse<Service[]>> {
    await delay(500);
    return { data: mockServices, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Service>> {
    await delay(300);
    const service = mockServices.find(s => s.id === id);
    if (!service) throw new Error('Service not found');
    return { data: service, success: true };
  },

  async getBySpecialty(specialty: string): Promise<ApiResponse<Service[]>> {
    await delay(400);
    const services = mockServices.filter(s => s.specialty === specialty);
    return { data: services, success: true };
  },
};

// Pharmacy/Medicine Services
export const pharmacyService = {
  async getAll(): Promise<PaginatedResponse<Medicine>> {
    await delay(600);
    return {
      data: mockMedicines,
      total: mockMedicines.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  },

  async getById(id: string): Promise<ApiResponse<Medicine>> {
    await delay(300);
    const medicine = mockMedicines.find(m => m.id === id);
    if (!medicine) throw new Error('Medicine not found');
    return { data: medicine, success: true };
  },

  async search(query: string): Promise<ApiResponse<Medicine[]>> {
    await delay(400);
    const results = mockMedicines.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.genericName.toLowerCase().includes(query.toLowerCase())
    );
    return { data: results, success: true };
  },

  async checkAvailability(id: string): Promise<ApiResponse<{ available: boolean; stock: number }>> {
    await delay(300);
    const medicine = mockMedicines.find(m => m.id === id);
    if (!medicine) throw new Error('Medicine not found');
    return { data: { available: medicine.stock > 0, stock: medicine.stock }, success: true };
  },
};

// Messaging Services
export const messageService = {
  async getConversations(userId: string): Promise<ApiResponse<Conversation[]>> {
    await delay(500);
    const conversations = mockConversations.filter(c => c.participants.includes(userId));
    return { data: conversations, success: true };
  },

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    await delay(400);
    const messages = mockMessages.filter(m => 
      m.senderId.includes(conversationId) || m.receiverId.includes(conversationId)
    );
    return { data: messages, success: true };
  },

  async sendMessage(data: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Promise<ApiResponse<Message>> {
    await delay(300);
    const newMessage: Message = {
      ...data,
      id: `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    return { data: newMessage, success: true };
  },

  async markAsRead(messageId: string): Promise<ApiResponse<void>> {
    await delay(200);
    return { data: undefined, success: true };
  },
};

// Dashboard Services
export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(600);
    return { data: mockDashboardStats, success: true };
  },

  async getRecentAppointments(limit: number = 5): Promise<ApiResponse<Appointment[]>> {
    await delay(400);
    return { data: mockAppointments.slice(0, limit), success: true };
  },

  async getRecentPatients(limit: number = 5): Promise<ApiResponse<Patient[]>> {
    await delay(400);
    return { data: mockPatients.slice(0, limit), success: true };
  },
};
