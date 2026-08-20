import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
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

  if (currentView === 'register') {
    return (
      <Register
        onNavigateToLogin={() => {
          window.history.pushState({}, '', '/login');
          setCurrentView('login');
        }}
        onRegistered={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'login' || (!user && currentView === 'dashboard')) {
    return (
      <Login
        onNavigateToRegister={() => {
          window.history.pushState({}, '', '/register');
          setCurrentView('register');
        }}
        onLoggedIn={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // Auth guard: if somehow user is null, show login
  if (!user) {
    return (
      <Login
        onNavigateToRegister={() => {
          window.history.pushState({}, '', '/register');
          setCurrentView('register');
        }}
        onLoggedIn={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('dashboard');
        }}
      />
    );
  }

  return <Dashboard />;
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
