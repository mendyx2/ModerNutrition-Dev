import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Token stays in memory state ONLY
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, member, roles, permissions } = res.data;
      
      setAuthToken(newToken);
      setTokenState(newToken);
      setUser({ ...member, roles, permissions });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    }
  };

  // Mock demonstration mode if no live backend is actively running
  const setDemoUser = (demoMemberData) => {
    setAuthToken('demo-token-12345');
    setTokenState('demo-token-12345');
    setUser(demoMemberData);
  };

  useEffect(() => {
    // No hardcoded user — real auth via login() or demo via setDemoUser()
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setDemoUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
