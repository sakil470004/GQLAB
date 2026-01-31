'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { DEMO_LOGIN, GET_ME } from '@/graphql/queries';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: meData, refetch } = useQuery(GET_ME, {
    skip: typeof window === 'undefined' || !localStorage.getItem('token'),
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem('token');
      setLoading(false);
    },
  });

  const [demoLoginMutation] = useMutation(DEMO_LOGIN);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
    } else if (meData?.me) {
      setUser(meData.me);
      setLoading(false);
    }
  }, [meData]);

  const demoLogin = async (role: 'admin' | 'employee') => {
    try {
      const { data } = await demoLoginMutation({ variables: { role } });
      if (data?.demoLogin) {
        localStorage.setItem('token', data.demoLogin.token);
        setUser(data.demoLogin.user);
        await refetch();
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
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
