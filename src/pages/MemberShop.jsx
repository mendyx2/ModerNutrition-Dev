import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Plus, Minus, ShoppingCart, Search, Filter, X,
  Star, Zap, ChevronDown, Package, ArrowLeft, Check, Truck,
  Award, Percent, BadgeCheck, CreditCard, Smartphone, Building
} from 'lucide-react';

// ── Fallback product data when API is unavailable ──
const FALLBACK_PRODUCTS = [
  {
    id: 1, sku: 'VITA-ACT-001', name: 'VitaActive™ Complete Meal Cereal',
    description: 'Rich in essential micro-nutrients, plant proteins, and digestive enzymes. Formulated to sustain high energy, promote lean muscle, and support holistic daily vitality.',
    category: 'Cereals', currency: 'USD', price_cents: 4500, pv: 35.00, cv: 30.00,
    available_countries: ['COD'], status: 'active', image_path: '/assets/products/protein-mix.png',
  },
  {
    id: 2, sku: 'VITA-GLD-002', name: 'VitaGold™ Fortified Swallow Mix',
    description: 'Engineered to blend effortlessly with Fufu, Chikwangue, and traditional starch swallows. Enriched with Iron, Zinc, Vitamin A, and Essential B-Complex.',
    category: 'Swallows', currency: 'USD', price_cents: 3800, pv: 28.00, cv: 25.00,
    available_countries: ['COD'], status: 'active', image_path: '/assets/products/family-nutrition.png',
  },
  {
    id: 3, sku: 'WELL-GRN-003', name: 'Daily Greens Vitality Elixir',
    description: 'Organic Moringa, Spirulina, and Baobab extract for daily cellular rejuvenation and natural vitality. Refreshing botanical blend.',
    category: 'Beverages', currency: 'USD', price_cents: 3000, pv: 22.00, cv: 20.00,
    available_countries: ['COD'], status: 'active', image_path: '/assets/products/daily-greens.png',
  },
  {
    id: 4, sku: 'SNK-CRN-004', name: 'VitaCrunch™ Nutri-Bites',
    description: 'Delicious crunchy roasted soy and grain clusters fortified with Zinc, B-Vitamins, and healthy prebiotic fiber. Perfect guilt-free nutrition on the go.',
    category: 'Snacks', currency: 'USD', price_cents: 2500, pv: 18.00, cv: 15.00,
    available_countries: ['COD'], status: 'active', image_path: '/assets/products/vitamin-pack.png',
  },
];

const CATEGORY_CONFIG = {
  All: { emoji: '🛒', color: 'bg-forest text-white' },
  Cereals: { emoji: '🌾', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  Swallows: { emoji: '🍽️', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  Beverages: { emoji: '🥤', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  Snacks: { emoji: '🍿', color: 'bg-purple-100 text-purple-800 border-purple-300' },
};

const PAYMENT_METHODS = [
  { id: 'airtel_money', name: 'Airtel Money (DRC)', icon: Smartphone },
  { id: 'orange_money', name: 'Orange Money (DRC)', icon: Smartphone },
  { id: 'mpesa', name: 'M-Pesa (Vodacom DRC)', icon: Smartphone },
  { id: 'cash_delivery', name: 'Cash on Pickup / Store', icon: Building },
];

export default function MemberShop({ onBack }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('airtel_money');
  const [shippingAddress, setShippingAddress] = useState(user?.address || 'Kinshasa, DRC');

  // Fetch products from public/member catalogue
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['memberProducts'],
    queryFn: async () => {
      try {
        const res = await api.get('/public/products');
        const data = res.data?.data || res.data;
        return Array.isArray(data) ? data : FALLBACK_PRODUCTS;
      } catch {
        return FALLBACK_PRODUCTS;
      }
    },
  });

  // ── Derived data ──
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const isActive = !p.status || p.status === 'active';
      return matchCategory && matchSearch && isActive;
    });
  }, [products, activeCategory, searchQuery]);

  // ── Cart Helpers ──
  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        product,
        qty: (prev[product.id]?.qty || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[productId]?.qty > 1) {
        updated[productId] = { ...updated[productId], qty: updated[productId].qty - 1 };
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotalCents = cartItems.reduce((sum, item) => sum + item.product.price_cents * item.qty, 0);
  const cartTotalPV = cartItems.reduce((sum, item) => sum + (item.product.pv || 0) * item.qty, 0);
  const cartTotalCV = cartItems.reduce((sum, item) => sum + (item.product.cv || 0) * item.qty, 0);
  const memberReward = cartTotalCents * 0.09; // 9% Member Purchase Reward

  // ── Submit Order ──
  const submitOrder = async () => {
    if (cartItems.length === 0) return;
    setOrderSubmitting(true);
    try {
      const payload = {
        items: cartItems.map(item => ({
          product_id: item.product.id,
          sku: item.product.sku,
          quantity: item.qty,
        })),
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      };

      const res = await api.post('/member/orders', payload);
      const createdOrder = res.data?.order || res.data;
      
      // Invalidate queries so orders and wallets update immediately
      queryClient.invalidateQueries({ queryKey: ['memberOrdersPage'] });
      queryClient.invalidateQueries({ queryKey: ['memberWalletsFull'] });
      queryClient.invalidateQueries({ queryKey: ['memberTransactionsFull'] });
      queryClient.invalidateQueries({ queryKey: ['memberDashboardSummary'] });

      setOrderSuccess(createdOrder);
      clearCart();
      setCartOpen(false);
    } catch (err) {
      console.error('Order submission error:', err);
      const msg = err.response?.data?.message || err.message || 'Order submission failed. Please check your network or try again.';
      alert(msg);
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased pb-12">

      {/* ── Shop Header ── */}
      <header className="bg-forest-dark text-white border-b-2 border-gold sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Back + Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </button>
              <div>
                <h1 className="font-heading font-extrabold text-sm sm:text-lg text-white leading-tight flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>Member Shop</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">Exclusive member pricing &bull; Earn PV & CV on every purchase</p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center space-x-2 bg-gold hover:bg-gold-light text-forest-dark font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-forest-dark text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Reward Highlight Strip */}
        <div className="bg-forest-dark/95 border-t border-white/10 py-1.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
            <span className="text-gold flex items-center space-x-1 font-bold">
              <Percent className="w-3.5 h-3.5" />
              <span>9% Purchase Reward</span>
            </span>
            <span className="text-gray-300 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span>Earn PV & CV Points</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Search & Filter Bar ── */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-6 space-y-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-forest-dark font-medium placeholder-gray-400 focus:ring-2 focus:ring-forest focus:border-forest outline-none shadow-xs transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills (Responsive wrap - No scrolling required) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map(cat => {
            const config = CATEGORY_CONFIG[cat] || { emoji: '📦', color: 'bg-gray-100 text-gray-700 border-gray-300' };
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-forest text-white border-forest shadow-xs scale-105'
                    : `${config.color} hover:opacity-90`
                }`}
              >
                <span>{config.emoji}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── Product Grid ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
                <div className="w-full h-36 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-forest-subtle mx-auto flex items-center justify-center">
              <Package className="w-7 h-7 text-forest" />
            </div>
            <h3 className="text-sm font-bold text-forest-dark">No products found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different keyword.`
                : `No products available in the "${activeCategory}" category yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const inCart = cart[product.id]?.qty || 0;
              const price = (product.price_cents / 100).toFixed(2);
              const catConfig = CATEGORY_CONFIG[product.category] || { emoji: '📦', color: 'bg-gray-100 text-gray-700' };

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-forest-subtle shadow-xs hover:shadow-card hover:border-forest/30 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Product Image Area */}
                  <div className="relative bg-gradient-to-br from-forest-subtle to-leaf-subtle h-36 sm:h-40 flex items-center justify-center p-2">
                    {product.image_path ? (
                      <img
                        src={product.image_path.startsWith('/') ? product.image_path : (product.image_path.startsWith('http') || product.image_path.startsWith('data:') ? product.image_path : `/${product.image_path}`)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-5xl opacity-80">
                        {catConfig.emoji}
                      </div>
                    )}

                    {/* Category Badge */}
                    <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${catConfig.color} border shadow-xs`}>
                      {product.category}
                    </span>

                    {/* SKU Badge */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/80 text-[10px] font-mono font-bold text-forest-dark border border-white/50">
                      {product.sku}
                    </span>

                    {/* PV/CV Badges at Bottom */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-forest-dark/80 text-gold text-[10px] font-bold backdrop-blur-sm">
                        +{product.pv} PV
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-forest-dark/80 text-leaf text-[10px] font-bold backdrop-blur-sm">
                        +{product.cv} CV
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-extrabold text-forest-dark mb-1 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    {/* Member Reward Preview */}
                    <div className="bg-gold/10 rounded-lg px-2.5 py-1.5 mb-3 flex items-center justify-between text-[10px] border border-gold/20">
                      <span className="text-gold-dark font-bold flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>9% Purchase Reward</span>
                      </span>
                      <span className="font-extrabold text-forest-dark">
                        +${(product.price_cents * 0.09 / 100).toFixed(2)}
                      </span>
                    </div>

                    {/* Price + Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-muted">Member Price</span>
                        <div className="text-base sm:text-lg font-extrabold text-forest-dark font-mono">
                          ${price}
                        </div>
                      </div>

                      {inCart === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-forest text-white text-xs font-extrabold hover:bg-forest-dark transition-all active:scale-95 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1.5 bg-forest-subtle rounded-xl p-1 border border-forest/20">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-forest-dark font-bold text-xs shadow-xs hover:bg-forest hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold text-forest-dark">
                            {inCart}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-forest-dark font-bold text-xs shadow-xs hover:bg-forest hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">

            {/* Cart Header */}
            <div className="bg-forest-dark text-white p-4 flex items-center justify-between border-b-2 border-gold">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-gold" />
                <h2 className="font-heading font-extrabold text-base text-white">Member Cart ({cartCount})</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-muted mx-auto" />
                  <p className="text-sm font-bold text-forest-dark">Your cart is empty</p>
                  <p className="text-xs text-muted">Add some products to earn PV & CV points!</p>
                </div>
              ) : (
                <>
                  {cartItems.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="bg-surface rounded-xl p-3 border border-forest-subtle flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="text-xs font-extrabold text-forest-dark truncate">{product.name}</h4>
                        <span className="text-[10px] text-muted font-mono">{product.sku}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-extrabold text-forest-dark font-mono">
                            ${((product.price_cents * qty) / 100).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gold-dark font-bold">
                            +{(product.pv * qty).toFixed(1)} PV
                          </span>
                          <span className="text-[10px] text-leaf font-bold">
                            +{(product.cv * qty).toFixed(1)} CV
                          </span>
                        </div>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-forest-dark font-bold text-xs hover:bg-forest hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-forest-dark">{qty}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-forest-dark font-bold text-xs hover:bg-forest hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Payment Method Selector */}
                  <div className="bg-surface rounded-xl p-3 border border-forest-subtle space-y-2 mt-3">
                    <label className="block text-xs font-extrabold text-forest-dark">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((pm) => {
                        const Icon = pm.icon;
                        const isSel = paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setPaymentMethod(pm.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                              isSel
                                ? 'border-forest bg-forest text-white shadow-xs'
                                : 'border-gray-200 bg-white text-forest-dark hover:border-forest/40'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-[11px] font-bold leading-tight truncate">{pm.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Address Input */}
                  <div className="bg-surface rounded-xl p-3 border border-forest-subtle space-y-1.5">
                    <label className="block text-xs font-extrabold text-forest-dark">
                      Delivery / Pickup Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="e.g. Kinshasa, Gombe / Pickup Station"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-forest-dark focus:ring-1 focus:ring-forest outline-none"
                    />
                  </div>

                  {/* Cart Totals Summary */}
                  <div className="bg-white rounded-xl p-4 border border-forest-subtle shadow-xs space-y-2.5 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-bold text-forest-dark">${(cartTotalCents / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Total PV Earned</span>
                      <span className="font-bold text-forest">+{cartTotalPV.toFixed(2)} PV</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Total CV Earned</span>
                      <span className="font-bold text-leaf">+{cartTotalCV.toFixed(2)} CV</span>
                    </div>
                    <div className="border-t border-dashed border-gold/40 pt-2 flex justify-between text-xs">
                      <span className="text-gold-dark font-bold flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>9% Member Purchase Reward</span>
                      </span>
                      <span className="font-extrabold text-forest-dark">+${(memberReward / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span className="font-extrabold text-sm text-forest-dark">Total to Pay</span>
                      <span className="text-lg font-extrabold text-forest-dark">${(cartTotalCents / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-100 space-y-2.5">
              {cartItems.length > 0 && (
                <>
                  <button
                    onClick={submitOrder}
                    disabled={orderSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-forest text-white font-extrabold text-sm shadow-md hover:bg-forest-dark transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {orderSubmitting ? (
                      <span>Placing Order on Server...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Place Member Order &bull; ${(cartTotalCents / 100).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </>
              )}
              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-2 text-xs font-bold text-forest hover:text-forest-dark transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Order Success Modal ── */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 border border-forest-subtle shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold text-forest-dark font-heading">Order Placed Successfully!</h3>
            <p className="text-xs text-muted leading-relaxed">
              Your order has been recorded in the platform ledger. The 10-tier allocation and 9% Member Purchase Reward have been computed.
            </p>
            {orderSuccess?.order_number && (
              <div className="bg-forest-subtle px-4 py-2.5 rounded-xl inline-block border border-forest/20">
                <span className="text-xs font-mono font-bold text-forest-dark">{orderSuccess.order_number}</span>
                <span className="block text-[10px] text-muted capitalize mt-0.5">Status: {orderSuccess.status || 'Paid'}</span>
              </div>
            )}
            
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  window.history.pushState({}, '', '/orders');
                  window.location.pathname = '/orders';
                }}
                className="w-full py-3 rounded-xl bg-forest text-white font-extrabold text-xs sm:text-sm hover:bg-forest-dark transition-all shadow-md cursor-pointer"
              >
                View in My Orders
              </button>
              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-forest-dark font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-3 text-[10px] sm:text-xs border-t-2 border-gold mt-auto">
        <p>&copy; 2026 ModerNutrition &bull; Member Exclusive Store &bull; All purchases earn PV, CV & 9% Reward</p>
      </footer>
    </div>
  );
}
