"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  rating?: number;
  reviewsCount?: number;
  totalSavings?: number;
  totalWasteSaved?: number;
  isVerified?: boolean;
  bankName?: string;
  accountNumber?: string;
  isBusinessDonor?: boolean;
  infoBisnis?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string; userId?: number }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
  isBusinessDonor: boolean;
  infoBisnis: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoBisnis, setInfoBisnis] = useState<any>(null);
  const [isBusinessDonor, setIsBusinessDonor] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      let userData = null;
      if (response.ok) {
        const data = await response.json();
        userData = data.user;
        setUser(userData);
      } else {
        setUser(null);
      }
      // Fetch business donor status
      const statusRes = await fetch('/api/business-donor/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsBusinessDonor(statusData.isBusinessDonor);
        setInfoBisnis(statusData.infoBisnis);
        if (userData) {
          setUser({ ...userData, isBusinessDonor: statusData.isBusinessDonor, infoBisnis: statusData.infoBisnis });
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, userId: data.userId };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user state with new profile data
        setUser(prev => prev ? { ...prev, ...profileData } : null);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An error occurred while updating profile' };
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    checkAuth,
    isBusinessDonor,
    infoBisnis,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 