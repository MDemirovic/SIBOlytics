import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  completeOnboarding: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sibolytics_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const users = JSON.parse(localStorage.getItem('sibolytics_users') || '{}');
    if (users[email]) {
      setUser(users[email]);
      localStorage.setItem('sibolytics_user', JSON.stringify(users[email]));
    } else {
      // For MVP, auto-signup if not found
      signup(email, email.split('@')[0]);
    }
  };

  const signup = (email: string, name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      hasCompletedOnboarding: false,
    };
    const users = JSON.parse(localStorage.getItem('sibolytics_users') || '{}');
    users[email] = newUser;
    localStorage.setItem('sibolytics_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('sibolytics_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sibolytics_user');
  };

  const completeOnboarding = (data: any) => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('sibolytics_user', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('sibolytics_users') || '{}');
      users[user.email] = updatedUser;
      localStorage.setItem('sibolytics_users', JSON.stringify(users));
      
      // Save onboarding data
      localStorage.setItem(`sibolytics_onboarding_${user.id}`, JSON.stringify(data));
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding }}>
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
