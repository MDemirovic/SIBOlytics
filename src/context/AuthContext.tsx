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
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

function apiUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

async function parseResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    const loadCurrentUser = async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/me'), {
          credentials: 'include',
          signal: controller.signal,
        });
        const data = await parseResponse<{ user: User | null }>(response);
        if (response.ok) {
          setUser(data?.user ?? null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        window.clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    loadCurrentUser();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await parseResponse<{ user?: User; error?: string; code?: string }>(response);
      if (!response.ok) {
        return { success: false, error: data?.error || 'Login failed.', code: data?.code };
      }
      setUser(data?.user ?? null);
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, name, password }),
      });
      const data = await parseResponse<{ user?: User; error?: string; message?: string; requiresEmailVerification?: boolean }>(response);
      if (!response.ok) {
        return { success: false, error: data?.error || 'Signup failed.' };
      }
      setUser(null);
      return {
        success: true,
        message: data?.message,
        requiresEmailVerification: Boolean(data?.requiresEmailVerification),
      };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors and clear local user state anyway.
    }
    setUser(null);
  };

  const completeOnboarding = async (data: any): Promise<AuthResult> => {
    if (!user) {
      return { success: false, error: 'User not logged in.' };
    }

    try {
      const response = await fetch(apiUrl('/api/auth/onboarding'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data }),
      });
      const payload = await parseResponse<{ user?: User; error?: string }>(response);
      if (!response.ok) {
        return { success: false, error: payload?.error || 'Could not save onboarding.' };
      }
      if (payload?.user) {
        setUser(payload.user);
      }
      localStorage.setItem(`sibolytics_onboarding_${user.id}`, JSON.stringify(data));
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const deleteAccount = async (): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/account'), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const payload = await parseResponse<{ error?: string }>(response);
        return { success: false, error: payload?.error || 'Could not delete account.' };
      }
      setUser(null);
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const resendVerification = async (email: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/resend-verification'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const payload = await parseResponse<{ error?: string; message?: string }>(response);
      if (!response.ok) {
        return { success: false, error: payload?.error || 'Could not resend verification email.' };
      }
      return { success: true, message: payload?.message || 'Verification email sent.' };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const payload = await parseResponse<{ error?: string; message?: string }>(response);
      if (!response.ok) {
        return { success: false, error: payload?.error || 'Could not start password reset.' };
      }
      return { success: true, message: payload?.message || 'Reset email sent.' };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const verifyEmailToken = async (token: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/verify-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });
      const payload = await parseResponse<{ error?: string; message?: string }>(response);
      if (!response.ok) {
        return { success: false, error: payload?.error || 'Could not verify email.' };
      }
      return { success: true, message: payload?.message || 'Email verified.' };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
  };

  const resetPassword = async (token: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      });
      const payload = await parseResponse<{ error?: string; message?: string }>(response);
      if (!response.ok) {
        return { success: false, error: payload?.error || 'Could not reset password.' };
      }
      return { success: true, message: payload?.message || 'Password reset successful.' };
    } catch {
      return { success: false, error: 'Cannot connect to auth server.' };
    }
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
