'use client';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('substrato_token');
    if (stored) {
      setToken(stored);
      api.auth.me(stored)
        .then((u: any) => setUser(u))
        .catch(() => localStorage.removeItem('substrato_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res: any = await api.auth.login({ email, password });
    localStorage.setItem('substrato_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('substrato_token');
    setToken(null);
    setUser(null);
  };

  return { user, token, loading, login, logout };
}