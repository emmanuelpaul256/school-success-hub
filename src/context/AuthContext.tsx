import { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '@/services';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'sale_manager' | 'sales_assistant';
}

interface StoredAuth {
  access: string;
  refresh: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setAuth: (auth: StoredAuth) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'educonnect_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<StoredAuth | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const res: any = await authService.login(email, password);
      const access = res?.tokens?.access;
      const refresh = res?.tokens?.refresh;
      const userData = res?.user;
      
      if (!access || !userData) {
        throw new Error('Invalid response from server');
      }

      const user: AuthUser = {
        id: String(userData.id),
        email: userData.email,
        fullName: `${userData.first_name} ${userData.last_name}`,
        role: userData.role,
      };

      const stored: StoredAuth = { access, refresh, user };
      localStorage.setItem(AUTH_KEY, JSON.stringify(stored));
      setAuthState(stored);
    } catch (error) {
      localStorage.removeItem(AUTH_KEY);
      setAuthState(null);
      throw error;
    }
  };

  const setAuth = (data: StoredAuth) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuthState(data);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthState(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: auth?.user ?? null, token: auth?.access ?? null, refreshToken: auth?.refresh ?? null, isAuthenticated: !!auth, isLoading, login, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
