import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Load auth data from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Update user data in context and localStorage without changing token
  const updateUser = useCallback((updatedUserData) => {
    // Merge with existing user to preserve fields like `id` from auth response
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      // Normalize id: keep both id and _id in sync
      if (updatedUserData._id && !updatedUserData.id) {
        merged.id = updatedUserData._id;
      }
      if (updatedUserData.id && !updatedUserData._id) {
        merged._id = updatedUserData.id;
      }
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
  }, [clearAuthState]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthState();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearAuthState]);

  const isAuthenticated = !!token && !!user;
  const hasRole = useCallback(
    (role) => {
      return Boolean(user?.role && user.role === role);
    },
    [user]
  );
  const isAdmin = hasRole('admin');

  const value = {
    user,
    token,
    login,
    updateUser,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
