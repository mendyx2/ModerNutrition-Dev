import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { User, Mail, Lock, Phone, Globe, ShieldCheck, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';

export default function Register({ onNavigateToLogin, onRegistered }) {
  const { t, i18n } = useTranslation();
  const { setDemoUser } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    country: 'COD',
    currency: 'USD',
    sponsor_code: '',
    placement_leg: 'left',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [orderTransferred, setOrderTransferred] = useState(false);

  // 1. Capture sponsor code and placement leg from URL query (?ref= or ?sponsor=&leg=) or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('sponsor');
    const legParam = urlParams.get('leg');
    const storedRef = localStorage.getItem('mn_ref_code') || sessionStorage.getItem('mn_ref_code');
    const activeRef = refParam || storedRef || '';

    if (activeRef || legParam) {
      setFormData(prev => ({
        ...prev,
        sponsor_code: activeRef || prev.sponsor_code,
        placement_leg: (legParam === 'left' || legParam === 'right') ? legParam : prev.placement_leg,
      }));
    }

    // 2. Check for guest cart in localStorage
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

    try {
      // 3. Register member with sponsor code
      const res = await api.post('/auth/register', formData);
      const { token, member, roles, permissions } = res.data;

      // 4. If guest cart exists, convert to authenticated order draft via API
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
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrderTransferred(true);
          // Clear guest cart from localStorage
          localStorage.removeItem('mn_guest_cart');
          localStorage.removeItem('mn_ref_code');
        } catch (orderErr) {
          console.warn('Guest cart transfer error:', orderErr);
        }
      }

      setDemoUser({ ...member, roles, permissions });
      if (onRegistered) onRegistered();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check inputs.');
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
          {t('welcome.greeting') || 'Create Member Account'}
        </h2>
        <p className="mt-1 text-xs text-muted">
          Join the founding community and unlock direct member commerce rewards
        </p>
      </div>

      {/* Guest Cart Handoff Alert */}
      {guestCartItems.length > 0 && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-forest-subtle border border-forest/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 text-forest" />
              <div>
                <strong className="text-xs font-bold text-forest-dark block">Guest Cart Detected ({guestCartItems.length} items)</strong>
                <span className="text-[11px] text-forest">Will automatically convert to member order on completion.</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-forest bg-white px-2 py-1 rounded-md border border-forest/10">
              Active Handoff
            </span>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-forest-subtle sm:px-10">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Jean-Luc"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Kabongo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@modernutrition.cd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                />
              </div>
            </div>

            {/* Sponsor Code (Captured from ?ref=) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Sponsor / Referral Code
                </label>
                {formData.sponsor_code && (
                  <span className="text-[10px] text-forest font-bold bg-forest/10 px-2 py-0.5 rounded-full">
                    ✓ Tracked from Link
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.sponsor_code}
                onChange={(e) => setFormData({ ...formData, sponsor_code: e.target.value })}
                placeholder="e.g. MN-884920 (Optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/60 bg-gold/5 font-mono text-sm font-bold text-forest-dark focus:ring-2 focus:ring-forest outline-none"
              />
            </div>

            {/* Country & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                >
                  <option value="COD">DRC (Congo) 🇨🇩</option>
                  <option value="COG">Congo-Brazzaville 🇨🇬</option>
                  <option value="RWA">Rwanda 🇷🇼</option>
                  <option value="UGA">Uganda 🇺🇬</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Placement Leg</label>
                <select
                  value={formData.placement_leg}
                  onChange={(e) => setFormData({ ...formData, placement_leg: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-forest outline-none"
                >
                  <option value="left">Left Binary Leg</option>
                  <option value="right">Right Binary Leg</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-extrabold text-forest-dark bg-gold hover:bg-gold-dark transition-all cursor-pointer"
              >
                {loading ? (
                  <span>Registering & Initialising Account...</span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Complete Registration & Launch</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-forest hover:text-forest-dark underline"
              >
                Member Sign In
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
