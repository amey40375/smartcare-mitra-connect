
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  mitraData: any;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mitraData, setMitraData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedMitra = localStorage.getItem('smartcare_mitra');
      if (storedMitra) {
        const mitra = JSON.parse(storedMitra);
        // Verify with Supabase
        const { data, error } = await supabase
          .from('mitras')
          .select('*')
          .eq('email', mitra.email)
          .single();

        if (data && !error) {
          setMitraData(data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('smartcare_mitra');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('smartcare_mitra');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll use simple email/password check
      // In production, implement proper authentication
      const { data, error } = await supabase
        .from('mitras')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { success: false, message: 'Email atau password salah' };
      }

      // Store in localStorage
      localStorage.setItem('smartcare_mitra', JSON.stringify(data));
      setMitraData(data);
      setIsAuthenticated(true);

      return { success: true, message: 'Login berhasil' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Terjadi kesalahan sistem' };
    }
  };

  const register = async (userData: any) => {
    try {
      const { data, error } = await supabase
        .from('calon_mitra')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Gagal mendaftar: ' + error.message };
      }

      return { success: true, message: 'Pendaftaran berhasil! Tunggu verifikasi admin.' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Terjadi kesalahan sistem' };
    }
  };

  const logout = () => {
    localStorage.removeItem('smartcare_mitra');
    setIsAuthenticated(false);
    setMitraData(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      mitraData,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
