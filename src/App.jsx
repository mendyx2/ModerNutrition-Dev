import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import MemberShop from './pages/MemberShop';
import Orders from './pages/Orders';
import Wallet from './pages/Wallet';
import BinaryTeam from './pages/BinaryTeam';
import Profile from './pages/Profile';
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
  const { user, loading } = useAuth();
  
  // Determine initial view from pathname
  const getInitialView = () => {
    const path = window.location.pathname;
    if (path.includes('register')) return 'register';
    if (path.includes('login')) return 'login';
    if (path.includes('shop')) return 'shop';
    if (path.includes('orders')) return 'orders';
    if (path.includes('wallet')) return 'wallet';
    if (path.includes('team')) return 'team';
    if (path.includes('profile')) return 'profile';
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

  // Navigation helper
  const navigateTo = (view, path) => {
    window.history.pushState({}, '', path);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading splash during initial cache hydration
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center space-y-4">
        <img
          src="/assets/logo_header_landing_page.png"
          alt="ModerNutrition"
          className="w-16 h-16 object-contain rounded-2xl border-2 border-gold shadow-lg animate-pulse"
        />
        <div className="text-xs font-bold text-forest tracking-wider uppercase">Loading Portal...</div>
      </div>
    );
  }

  // Auth / Public Views
  if (currentView === 'register') {
    return (
      <Register
        onNavigateToLogin={() => navigateTo('login', '/login')}
        onRegistered={() => navigateTo('dashboard', '/')}
      />
    );
  }

  if (currentView === 'login' || !user) {
    return (
      <Login
        onNavigateToRegister={() => navigateTo('register', '/register')}
        onLoggedIn={() => navigateTo('dashboard', '/')}
      />
    );
  }

  // ── Authenticated Dedicated Pages ──

  if (currentView === 'shop') {
    return (
      <MemberShop
        onBack={() => navigateTo('dashboard', '/')}
      />
    );
  }

  if (currentView === 'orders') {
    return (
      <Orders
        onBack={() => navigateTo('dashboard', '/')}
        onNavigateToShop={() => navigateTo('shop', '/shop')}
      />
    );
  }

  if (currentView === 'wallet') {
    return (
      <Wallet
        onBack={() => navigateTo('dashboard', '/')}
      />
    );
  }

  if (currentView === 'team') {
    return (
      <BinaryTeam
        onBack={() => navigateTo('dashboard', '/')}
        onNavigateToProfile={() => navigateTo('profile', '/profile')}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <Profile
        onBack={() => navigateTo('dashboard', '/')}
      />
    );
  }

  // Default: Dashboard Overview
  return (
    <Dashboard
      onNavigateToDashboard={() => navigateTo('dashboard', '/')}
      onNavigateToShop={() => navigateTo('shop', '/shop')}
      onNavigateToOrders={() => navigateTo('orders', '/orders')}
      onNavigateToWallet={() => navigateTo('wallet', '/wallet')}
      onNavigateToTeam={() => navigateTo('team', '/team')}
      onNavigateToProfile={() => navigateTo('profile', '/profile')}
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
