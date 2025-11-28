import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { getStoredUser, loginUser, logoutUser, signupUser } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (email: string, password: string) => {
    try {
        const user = await loginUser(email, password);
        setUser(user);
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // Re-throw to let the component handle UI feedback if needed
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
        const user = await signupUser(email, name, password);
        setUser(user);
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};