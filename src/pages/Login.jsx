import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Lock, Mail, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Login({ onNavigateToRegister, onLoggedIn }) {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guestCartItems, setGuestCartItems] = useState([]);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('mn_guest_cart') || '[]');
      if (Array.isArray(cart) && cart.length > 0) {
        setGuestCartItems(cart);
      }
    } catch {
      setGuestCartItems([]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);

    if (res.success) {
      // If guest cart items exist in localStorage, convert them to an authenticated order
      if (guestCartItems.length > 0) {
        try {
          await api.post('/member/orders', {
            items: guestCartItems.map(item => ({
              product_id: item.id,
              sku: item.sku,
              quantity: item.quantity || 1
            })),
            auto_pay: true,
            shipping_address: 'Kinshasa, DRC'
          });
          localStorage.removeItem('mn_guest_cart');
        } catch (orderErr) {
          console.warn('Guest cart transfer error on login:', orderErr);
        }
      }

      if (onLoggedIn) onLoggedIn();
    } else {
      setLoading(false);
      setError(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/assets/logo_header_landing_page.png"
          alt="ModerNutrition"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-4 text-2xl font-extrabold font-heading text-forest-dark">
          Member Sign In
        </h2>
        <p className="mt-1 text-xs text-muted">
          Access your member dashboard, wallet balances, and binary team network
        </p>
      </div>

      {/* Guest Cart Handoff Alert */}
      {guestCartItems.length > 0 && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-forest-subtle border border-forest/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 text-forest" />
              <div>
                <strong className="text-xs font-bold text-forest-dark block">Pending Cart Items ({guestCartItems.length})</strong>
                <span className="text-[11px] text-forest">Your cart will transfer to your member account on sign in.</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-forest bg-white px-2 py-1 rounded-md border border-forest/10">
              Transfer Ready
            </span>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-forest-subtle sm:px-10">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@modernutrition.cd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-extrabold text-forest-dark bg-gold hover:bg-gold-dark transition-all cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-bold text-forest hover:text-forest-dark underline"
              >
                Register as Member
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
