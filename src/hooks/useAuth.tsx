import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, AuthContextType } from '@/types';
import { users } from '@/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((login: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.login === login && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser: User = {
      id: 0,
      login: 'guest',
      password: '',
      role: 'guest',
      fullName: 'Гость',
    };
    setUser(guestUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAsGuest }}>
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
