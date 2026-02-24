/**
 * Authentication API Service
 * Endpoints: /api/Account/*
 */

import { api, setTokens, clearTokens, getRefreshToken } from './apiClient';
import type {
  LoginDTO,
  LoginResponseDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '@/types/api';

export const authApi = {
  /** POST /api/Account/login */
  login: (data: LoginDTO) =>
    api.post<LoginResponseDTO>('/api/Account/login', data),

  /** POST /api/Account/register */
  register: (data: RegisterDTO) =>
    api.post<LoginResponseDTO>('/api/Account/register', data),

  /** POST /api/Account/forgot-password */
  forgotPassword: (data: ForgotPasswordDTO) =>
    api.post<void>('/api/Account/forgot-password', data),

  /** POST /api/Account/reset-password */
  resetPassword: (data: ResetPasswordDTO) =>
    api.post<void>('/api/Account/reset-password', data),

  /** POST /api/Account/logout */
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/api/Account/logout', { refreshToken });
      } catch {
        // ignore — clear local session anyway
      }
    }
    clearTokens();
  },

  /** Helper: persist login response to storage */
  persistSession: (response: LoginResponseDTO) => {
    setTokens(response.token!, response.refreshToken!, response.expiration as unknown as string);
    const user = {
      userName: response.userName,
      email: response.email,
      role: response.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
};
