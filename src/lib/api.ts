import axios from 'axios';
import type { AuthResponse, Identity, Memory, Policy, AuditLog } from './types';
import { config } from './config';

// Log configuration in development
if (config.debug.enabled && typeof window !== 'undefined') {
  console.log('🔧 API Configuration:', {
    baseURL: config.api.baseURL,
    debug: config.debug.enabled
  });
}

const api = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.api.timeout,
});

// Attach JWT token if present
api.interceptors.request.use((requestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  if (config.debug.enabled) {
    console.log('🚀 API Request:', {
      method: requestConfig.method?.toUpperCase(),
      url: requestConfig.url,
      baseURL: requestConfig.baseURL
    });
  }
  
  return requestConfig;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (config.debug.enabled) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  (error) => {
    if (config.debug.enabled) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.response?.data?.detail || error.message,
        url: error.config?.url
      });
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (external_id: string, password?: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/v1/identity/', { external_id, password, role: 'agent' });
  return res.data;
};

// Identities
export const getIdentities = async (): Promise<Identity[]> => {
  const res = await api.get<Identity[]>('/v1/identity/');
  return res.data;
};

export const createIdentity = async (external_id: string, role: string = 'agent'): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/v1/identity/', { external_id, role });
  return res.data;
};

// Memories
export const getMemories = async (): Promise<Memory[]> => {
  const res = await api.get<Memory[]>('/v1/memory/');
  return res.data;
};

export const searchMemories = async (query: string): Promise<Memory[]> => {
  const res = await api.post<Memory[]>('/v1/memory/search', { query });
  return res.data;
};

export const createMemory = async (memory: { text: string; type: string; meta_data?: Record<string, any> }): Promise<Memory> => {
  const res = await api.post<Memory>('/v1/memory/', memory);
  return res.data;
};

export const deleteMemory = async (id: string): Promise<void> => {
  await api.delete(`/v1/memory/${id}/`);
};

// Policies
export const getPolicies = async (): Promise<Policy[]> => {
  const res = await api.get<Policy[]>('/v1/policy/');
  return res.data;
};

export const createPolicy = async (policy: Partial<Policy>): Promise<Policy> => {
  const res = await api.post<Policy>('/v1/policy/', policy);
  return res.data;
};

// Audit Logs
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const res = await api.get<AuditLog[]>('/v1/audit/');
    return res.data;
  } catch (error: any) {
    // If audit endpoint is not available, return mock data for testing
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      const { getMockAuditLogs } = await import('./mockData');
      return getMockAuditLogs();
    }
    throw error;
  }
};
