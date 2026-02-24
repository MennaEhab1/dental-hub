import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/authApi';
import type { LoginDTO, RegisterDTO, LoginResponseDTO } from '@/types/api';

export interface AuthUser {
  userName: string | null;
  email: string | null;
  role: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<LoginResponseDTO>;
  register: (data: RegisterDTO) => Promise<LoginResponseDTO>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }

    // Listen for token expiry events from apiClient
    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (credentials: LoginDTO): Promise<LoginResponseDTO> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      const sessionUser = authApi.persistSession(response);
      setUser(sessionUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDTO): Promise<LoginResponseDTO> => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const sessionUser = authApi.persistSession(response);
      setUser(sessionUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
