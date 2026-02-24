/**
 * HTTP API Client
 * 
 * Centralized HTTP client with JWT auth, token refresh, and error handling.
 * Base URL points to the SmartTeethCare backend.
 */

const BASE_URL = 'https://smart-teeth-care.runasp.net';

// ── Token helpers ──────────────────────────────────────────────
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export function setTokens(token: string, refreshToken: string, expiration: string) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('token_expiration', expiration);
}

export function clearTokens() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiration');
  localStorage.removeItem('user');
}

// ── Refresh logic ──────────────────────────────────────────────
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const rt = getRefreshToken();
    if (!rt) return false;

    try {
      const res = await fetch(`${BASE_URL}/api/Account/RefreshToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) return false;

      const data = await res.json();
      setTokens(data.token, data.refreshToken, data.expiration);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Core request function ──────────────────────────────────────
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 → try refresh once
  if (response.status === 401 && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, false);
    }
    // Refresh failed → clear session
    clearTokens();
    window.dispatchEvent(new Event('auth:expired'));
    throw { status: 401, message: 'Session expired. Please log in again.' } as ApiError;
  }

  // Handle no-content responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  let data: T;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = (await response.text()) as unknown as T;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: typeof data === 'string' ? data : (data as any)?.message || `Error ${response.status}`,
      errors: (data as any)?.errors,
    } as ApiError;
  }

  return data;
}

// Convenience wrappers
export const api = {
  get: <T>(url: string) => apiRequest<T>(url),
  post: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};
