import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './authContextValue.js';

const AUTH_STORAGE_KEY = 'xavalux.auth.v1';

const DEMO_USERS = [
  {
    email: 'xav.aholou@xavalux.com',
    password: 'admin123',
    firstName: 'Xavier',
    lastName: 'Aholou',
    role: 'Warehouse Supervisor',
  },
  {
    email: 'demo@xavalux.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'Viewer',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((email, password) => {
    const matchedByEmail = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!matchedByEmail) {
      return { success: false, error: 'email_not_found' };
    }
    if (matchedByEmail.password !== password) {
      return { success: false, error: 'wrong_password' };
    }
    const { password: _pw, ...userData } = matchedByEmail;
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
