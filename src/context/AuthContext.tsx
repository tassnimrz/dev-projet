import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { authStorage } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isMySqlConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsAdmin: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authStorage.getDemoUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMySqlConnected, setIsMySqlConnected] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    async function checkMySql() {
      const health = await api.checkHealth();
      setIsMySqlConnected(health.connected);
      setIsLoading(false);
    }
    checkMySql();
  }, []);

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.email?.toLowerCase().includes('admin'))
  );

  const login = async (email: string, password?: string) => {
    setIsLoading(true);

    try {
      const result = await api.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        authStorage.setDemoUser(result.user);
        setIsLoading(false);
        closeAuthModal();
        return { success: true };
      } else if (result.error && !result.error.includes('indisponible')) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (e) {
      console.warn('MySQL auth login failed, using fallback:', e);
    }

    // Local fallback
    const role: 'admin' | 'user' = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const demoProfile: UserProfile = {
      id: role === 'admin' ? 'admin-giftly-master' : 'demo-sarah-101',
      email: email || 'sarah@giftly.tn',
      fullName: role === 'admin' ? 'Directeur GIFTLY (Admin)' : (email.split('@')[0].replace('.', ' ') || 'Sarah Mansour'),
      role: role,
      createdAt: new Date().toISOString(),
    };
    authStorage.setDemoUser(demoProfile);
    setUser(demoProfile);
    setIsLoading(false);
    closeAuthModal();
    return { success: true };
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    const role: 'admin' | 'user' = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    try {
      const result = await api.register(email, password, fullName, role);
      if (result.success && result.user) {
        setUser(result.user);
        authStorage.setDemoUser(result.user);
        setIsLoading(false);
        closeAuthModal();
        return { success: true };
      } else if (result.error && !result.error.includes('indisponible')) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (e) {
      console.warn('MySQL auth register failed, using fallback:', e);
    }

    // Local fallback
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || 'New Giftly Member',
      role: role,
      createdAt: new Date().toISOString(),
    };
    authStorage.setDemoUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    closeAuthModal();
    return { success: true };
  };

  const logout = async () => {
    authStorage.setDemoUser(null);
    setUser(null);
  };

  const loginAsDemoUser = async () => {
    await login('sarah.mansour@giftly.tn', 'client123');
  };

  const loginAsAdmin = async () => {
    await login('admin@giftly.tn', 'admin123');
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        isMySqlConnected,
        login,
        signup,
        logout,
        loginAsDemoUser,
        loginAsAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
