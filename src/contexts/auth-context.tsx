"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getUserData, logoutUser } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuthStatus();
    }
  }, [mounted]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('learniva_token');
      if (token) {
        const userData = await getUserData(token);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token might be invalid, remove it
      localStorage.removeItem('learniva_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loginApiResponse = await loginUser(username, password);
      
      // Attempt to extract token from response.data.token
      const token = loginApiResponse && loginApiResponse.data && loginApiResponse.data.token; 

      if (!token) {
        // Log the actual data object if token is still not found
        console.error('Login failed: Token not found (tried response.data.token). Actual data object:', loginApiResponse.data, 'Full response:', loginApiResponse);
        throw new Error('Login failed: Authentication token not received.');
      }
      
      localStorage.setItem('learniva_token', token);
      
      // Fetch user data using the obtained token
      const userData = await getUserData(token);
      setUser(userData); // Set the user state with fetched data
      
      console.log('Login successful, user data fetched and set:', userData);

    } catch (error) {
      console.error('Login process failed:', error);
      localStorage.removeItem('learniva_token'); // Clean up token if process fails
      setUser(null); // Reset user state
      throw error; // Re-throw for the UI component to handle
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success/failure
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('learniva_token');
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('learniva_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {mounted ? children : null}
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
