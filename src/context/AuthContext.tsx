import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
}

interface AuthResult {
  success: boolean;
  error?: string;
  code?: string;
  message?: string;
  requiresEmailVerification?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, name: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<AuthResult>;
  deleteAccount: () => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  verifyEmailToken: (token: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, password: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_USER_KEY = 'sibolytics_auth_user';
const AUTH_USERS_KEY = 'sibolytics_auth_users';

function loadUsers(): User[] {
  const stored = localStorage.getItem(AUTH_USERS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as User[];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function deriveNameFromEmail(email: string): string {
  const prefix = email.split('@')[0] || 'User';
  const cleaned = prefix.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'User';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function createUser(email: string, name?: string): User {
  const trimmedEmail = email.trim();
  const displayName = name?.trim() || deriveNameFromEmail(trimmedEmail);
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: trimmedEmail,
    name: displayName,
    hasCompletedOnboarding: false,
    emailVerified: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = loadUsers();
    let existing = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

    if (!existing) {
      existing = createUser(email);
      users.unshift(existing);
      saveUsers(users);
    }

    setUser(existing);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(existing));
    return { success: true };
  };

  const signup = async (email: string, name: string, password: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const existingIndex = users.findIndex((entry) => entry.email.toLowerCase() === normalizedEmail);

    if (existingIndex >= 0) {
      const updated = { ...users[existingIndex], name: name.trim() || users[existingIndex].name };
      users[existingIndex] = updated;
      saveUsers(users);
      return { success: true, requiresEmailVerification: false };
    }

    const newUser = createUser(email, name);
    saveUsers([newUser, ...users]);
    return { success: true, requiresEmailVerification: false };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const completeOnboarding = async (data: any): Promise<AuthResult> => {
    if (!user) {
      return { success: false, error: 'User not logged in.' };
    }

    const users = loadUsers();
    const updatedUser = { ...user, hasCompletedOnboarding: true };
    const nextUsers = users.map((entry) => (entry.id === user.id ? updatedUser : entry));
    saveUsers(nextUsers);
    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    localStorage.setItem(`sibolytics_onboarding_${user.id}`, JSON.stringify(data));
    return { success: true };
  };

  const deleteAccount = async (): Promise<AuthResult> => {
    if (!user) return { success: true };
    const users = loadUsers().filter((entry) => entry.id !== user.id);
    saveUsers(users);
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    return { success: true };
  };

  const resendVerification = async (email: string): Promise<AuthResult> => {
    return { success: true, message: 'Verification email sent.' };
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    return { success: true, message: 'Reset email sent.' };
  };

  const verifyEmailToken = async (token: string): Promise<AuthResult> => {
    return { success: true, message: 'Email verified.' };
  };

  const resetPassword = async (token: string, password: string): Promise<AuthResult> => {
    return { success: true, message: 'Password reset successful.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        completeOnboarding,
        deleteAccount,
        resendVerification,
        verifyEmailToken,
        requestPasswordReset,
        resetPassword,
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
