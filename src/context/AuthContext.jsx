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
      
      const storedAvatar = localStorage.getItem(`mn_avatar_${member.id}`);
      const fullUser = { 
        ...member, 
        avatar: storedAvatar || member.avatar_path || null,
        roles, 
        permissions 
      };

      setAuthToken(newToken);
      setTokenState(newToken);
      setUser(fullUser);
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

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      if (updatedFields.avatar && prev.id) {
        localStorage.setItem(`mn_avatar_${prev.id}`, updatedFields.avatar);
      }
      return updated;
    });
  };

  // Mock demonstration mode if no live backend is actively running
  const setDemoUser = (demoMemberData) => {
    setAuthToken('demo-token-12345');
    setTokenState('demo-token-12345');
    setUser(demoMemberData);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser, setDemoUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
