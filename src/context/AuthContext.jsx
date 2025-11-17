import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const login = (userData, token) => {
    const userWithRole = {
      ...userData,
      token
    };
    setUser(userWithRole);
    localStorage.setItem('reserveit_user', JSON.stringify(userWithRole));
    localStorage.setItem('reserveit_token', token);
  };

  // Regisztráció
  const register = (userData, token) => {
    login(userData, token);
  };

  // Kijelentkezés
  const logout = () => {
    setUser(null);
    localStorage.removeItem('reserveit_user');
    localStorage.removeItem('reserveit_token');
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
