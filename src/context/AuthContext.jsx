import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI, companyAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LocalStorage-ból betöltés az oldal újratöltésekor
  useEffect(() => {
    const storedUser = localStorage.getItem('reserveit_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('reserveit_user');
      }
    }
    setLoading(false);
  }, []);

  // Bejelentkezés
  const login = async (credentials, role = 'user') => {
    try {
      const api = role === 'company' ? companyAPI : userAPI;
      const response = await api.login(credentials);
      
      if (response.success) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('reserveit_user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        return { success: true, data: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  // Regisztráció
  const register = async (userData, role = 'user') => {
    try {
      const api = role === 'company' ? companyAPI : userAPI;
      const response = await api.register(userData);
      
      if (response.success) {
        const newUser = response.data;
        setUser(newUser);
        localStorage.setItem('reserveit_user', JSON.stringify(newUser));
        localStorage.setItem('token', newUser.token);
        return { success: true, data: newUser };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  };

  // Kijelentkezés
  const logout = () => {
    setUser(null);
    localStorage.removeItem('reserveit_user');
    localStorage.removeItem('token');
  };

  // User adatok frissítése
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('reserveit_user', JSON.stringify(updatedUser));
  };

  // Authentikált-e a felhasználó
  const isAuthenticated = () => {
    return user !== null;
  };

  // Szerepkör ellenőrzése
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
