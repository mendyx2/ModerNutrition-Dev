import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem('mn_member_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mn_member_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Background session verification on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mn_member_token');
      if (storedToken) {
        setAuthToken(storedToken);
        setTokenState(storedToken);

        try {
          // Fetch freshest user profile from API in background
          const res = await api.get('/auth/me');
          if (res.data?.member) {
            const member = res.data.member;
            const storedAvatar = localStorage.getItem(`mn_avatar_${member.id}`);
            const fullUser = {
              ...member,
              avatar: storedAvatar || member.avatar_path || null,
              roles: res.data.roles || [],
              permissions: res.data.permissions || []
            };
            setUser(fullUser);
            localStorage.setItem('mn_member_user', JSON.stringify(fullUser));
          }
        } catch (err) {
          if (err.response?.status === 401) {
            // Token expired or invalid
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

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
      localStorage.setItem('mn_member_user', JSON.stringify(fullUser));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please verify your credentials.'
      };
    }
  };

  const logout = async () => {
    try {
      if (token || getAuthToken()) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.warn('Logout API notification error:', err);
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
      localStorage.removeItem('mn_member_token');
      localStorage.removeItem('mn_member_user');
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      if (updatedFields.avatar && prev.id) {
        localStorage.setItem(`mn_avatar_${prev.id}`, updatedFields.avatar);
      }
      localStorage.setItem('mn_member_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Mock demonstration mode if no live backend is actively running
  const setDemoUser = (demoMemberData) => {
    setAuthToken('demo-token-12345');
    setTokenState('demo-token-12345');
    setUser(demoMemberData);
    localStorage.setItem('mn_member_user', JSON.stringify(demoMemberData));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser, setDemoUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
