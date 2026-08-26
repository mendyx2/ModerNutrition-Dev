import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import MemberShop from './pages/MemberShop';
import Login from './pages/Login';
import Register from './pages/Register';
import './i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  const { user } = useAuth();
  
  // Determine initial view from pathname or query
  const getInitialView = () => {
    const path = window.location.pathname;
    if (path.includes('register')) return 'register';
    if (path.includes('login')) return 'login';
    if (path.includes('shop')) return 'shop';
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Navigation helper ──
  const navigateTo = (view, path) => {
    window.history.pushState({}, '', path);
    setCurrentView(view);
  };

  if (currentView === 'register') {
    return (
      <Register
        onNavigateToLogin={() => navigateTo('login', '/login')}
        onRegistered={() => navigateTo('dashboard', '/')}
      />
    );
  }

  if (currentView === 'login' || (!user && currentView === 'dashboard') || (!user && currentView === 'shop')) {
    return (
      <Login
        onNavigateToRegister={() => navigateTo('register', '/register')}
        onLoggedIn={() => navigateTo('dashboard', '/')}
      />
    );
  }

  // Auth guard: if somehow user is null, show login
  if (!user) {
    return (
      <Login
        onNavigateToRegister={() => navigateTo('register', '/register')}
        onLoggedIn={() => navigateTo('dashboard', '/')}
      />
    );
  }

  // ── Authenticated Views ──
  if (currentView === 'shop') {
    return (
      <MemberShop
        onBack={() => navigateTo('dashboard', '/')}
      />
    );
  }

  return (
    <Dashboard
      onNavigateToShop={() => navigateTo('shop', '/shop')}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}
