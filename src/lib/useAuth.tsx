"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login as apiLogin } from './api';
import { setToken, getToken, clearToken, setUser, getUser } from './auth';
import type { Identity } from './types';

interface AuthContextType {
  user: Identity | null;
  token: string | null;
  login: (external_id: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<Identity | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
    }
  }, []);

  const login = async (external_id: string, password?: string) => {
    const res = await apiLogin(external_id, password);
    setToken(res.access_token);
    setUser(res.identity);
    setTokenState(res.access_token);
    setUserState(res.identity);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUserState(null);
    // Force a page reload to ensure all state is cleared
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
