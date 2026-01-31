'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { graphqlRequest } from '@/lib/graphql-client';
import { DEMO_LOGIN_QUERY, GET_ME_QUERY } from '@/lib/queries';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  demoLogin: (role: 'admin' | 'employee') => Promise<void>;
  logout: () => void;
}

interface DemoLoginResponse {
  demoLogin: {
    token: string;
    user: User;
  };
}

interface GetMeResponse {
  me: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await graphqlRequest<GetMeResponse>(GET_ME_QUERY);
        if (data?.me) {
          setUser(data.me);
        }
      } catch {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const demoLogin = async (role: 'admin' | 'employee') => {
    const data = await graphqlRequest<DemoLoginResponse>(DEMO_LOGIN_QUERY, { role });
    if (data?.demoLogin) {
      localStorage.setItem('token', data.demoLogin.token);
      setUser(data.demoLogin.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        demoLogin,
        logout,
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
