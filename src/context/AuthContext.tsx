import React, {createContext, useContext, useEffect, useState} from 'react';

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

type AuthApiResponse = {
  success: boolean;
  user?: User;
  error?: string;
  code?: string;
  message?: string;
  requiresEmailVerification?: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, '') || '';

function apiUrl(path: string) {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
}

async function apiRequest(path: string, init: RequestInit = {}): Promise<AuthApiResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...headers,
      ...(init.headers ?? {}),
    },
    credentials: 'include',
  });

  const text = await response.text();
  let data: AuthApiResponse = {success: response.ok};

  if (text) {
    try {
      data = JSON.parse(text) as AuthApiResponse;
    } catch {
      data = {success: response.ok};
    }
  }

  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'Request failed.',
      code: data.code,
      message: data.message,
      requiresEmailVerification: data.requiresEmailVerification,
    };
  }

  return data;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const result = await apiRequest('/api/auth/me', {method: 'GET'});
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadCurrentUser().catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
      });

      if (!result.success || !result.user) {
        return {success: false, error: result.error || 'Sign in failed.', code: result.code};
      }

      setUser(result.user);
      return {success: true};
    } catch {
      return {success: false, error: 'Server is unavailable. Please try again.'};
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<AuthResult> => {
    try {
      const result = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({email, name, password}),
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Could not create account.',
          code: result.code,
          message: result.message,
        };
      }

      if (result.user) {
        setUser(result.user);
      }

      return {
        success: true,
        requiresEmailVerification: Boolean(result.requiresEmailVerification),
      };
    } catch {
      return {success: false, error: 'Server is unavailable. Please try again.'};
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', {method: 'POST'});
    } finally {
      setUser(null);
    }
  };

  const completeOnboarding = async (data: any): Promise<AuthResult> => {
    try {
      const result = await apiRequest('/api/auth/complete-onboarding', {
        method: 'POST',
        body: JSON.stringify(data ?? {}),
      });

      if (!result.success) {
        return {success: false, error: result.error || 'Could not complete onboarding.'};
      }

      if (result.user) {
        setUser(result.user);
      }

      return {success: true};
    } catch {
      return {success: false, error: 'Server is unavailable. Please try again.'};
    }
  };

  const deleteAccount = async (): Promise<AuthResult> => {
    try {
      const result = await apiRequest('/api/auth/account', {method: 'DELETE'});
      if (!result.success) {
        return {success: false, error: result.error || 'Could not delete account.'};
      }

      setUser(null);
      return {success: true};
    } catch {
      return {success: false, error: 'Server is unavailable. Please try again.'};
    }
  };

  const resendVerification = async (_email: string): Promise<AuthResult> => {
    return {success: true, message: 'Verification email is not enabled yet.'};
  };

  const requestPasswordReset = async (_email: string): Promise<AuthResult> => {
    return {success: true, message: 'Password reset is not enabled yet.'};
  };

  const verifyEmailToken = async (_token: string): Promise<AuthResult> => {
    return {success: true, message: 'Email verification is not enabled yet.'};
  };

  const resetPassword = async (_token: string, _password: string): Promise<AuthResult> => {
    return {success: true, message: 'Password reset is not enabled yet.'};
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
