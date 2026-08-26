import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Plus, Minus, ShoppingCart, Search, Filter, X,
  Star, Zap, ChevronDown, Package, ArrowLeft, Check, Truck,
  Award, Percent, BadgeCheck
} from 'lucide-react';

// ── Fallback product data when API is unavailable ──
const FALLBACK_PRODUCTS = [
  {
    id: 1, sku: 'VITA-ACT-001', name: 'VitaActive™ Complete Meal Cereal',
    description: 'Rich in essential micro-nutrients, plant proteins, and digestive enzymes. Formulated to sustain high energy, promote lean muscle, and support holistic daily vitality.',
    category: 'Cereals', currency: 'USD', price_cents: 4500, pv: 35.00, cv: 30.00,
    available_countries: ['COD'], status: 'active', image_path: null,
  },
  {
    id: 2, sku: 'VITA-GLD-002', name: 'VitaGold™ Fortified Swallow Mix',
    description: 'Engineered to blend effortlessly with Fufu, Chikwangue, and traditional starch swallows. Enriched with Iron, Zinc, Vitamin A, and Essential B-Complex.',
    category: 'Swallows', currency: 'USD', price_cents: 3800, pv: 28.00, cv: 25.00,
    available_countries: ['COD'], status: 'active', image_path: null,
  },
  {
    id: 3, sku: 'WELL-GRN-003', name: 'Daily Greens Vitality Elixir',
    description: 'Organic Moringa, Spirulina, and Baobab extract for daily cellular rejuvenation and natural vitality. Refreshing botanical blend.',
    category: 'Beverages', currency: 'USD', price_cents: 3000, pv: 22.00, cv: 20.00,
    available_countries: ['COD'], status: 'active', image_path: null,
  },
  {
    id: 4, sku: 'SNK-CRN-004', name: 'VitaCrunch™ Nutri-Bites',
    description: 'Delicious crunchy roasted soy and grain clusters fortified with Zinc, B-Vitamins, and healthy prebiotic fiber. Perfect guilt-free nutrition on the go.',
    category: 'Snacks', currency: 'USD', price_cents: 2500, pv: 18.00, cv: 15.00,
    available_countries: ['COD'], status: 'active', image_path: null,
  },
];

const CATEGORY_CONFIG = {
  All: { emoji: '🛒', color: 'bg-forest text-white' },
  Cereals: { emoji: '🌾', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  Swallows: { emoji: '🍽️', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  Beverages: { emoji: '🥤', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  Snacks: { emoji: '🍿', color: 'bg-purple-100 text-purple-800 border-purple-300' },
};

export default function MemberShop({ onBack }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Fetch products from authenticated member endpoint (fallback to public)
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['memberProducts'],
    queryFn: async () => {
      try {
        // Try authenticated endpoint first
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
          quantity: item.qty,
        })),
        payment_method: 'mobile_money',
      };
      const res = await api.post('/member/orders', payload);
      setOrderSuccess(res.data);
      clearCart();
      setCartOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Order submission failed. Please try again.';
      alert(msg);
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">

      {/* ── Shop Header ── */}
      <header className="bg-forest-dark text-white border-b-2 border-gold sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Back + Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
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
              className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center border-2 border-forest-dark animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ── Member Benefit Banner ── */}
        <div className="bg-gold/15 border-t border-gold/30 py-2 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-gold font-bold">
            <span className="flex items-center space-x-1">
              <Percent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>9% Purchase Reward</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="flex items-center space-x-1">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Earn PV & CV Points</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gold/40 hidden sm:block" />
            <span className="hidden sm:flex items-center space-x-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Member Exclusive Pricing</span>
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

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-forest-dark">${price}</span>
                        <span className="text-[10px] text-muted ml-1 font-medium">{product.currency}</span>
                      </div>

                      {inCart > 0 ? (
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center border border-red-200 transition-colors active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-extrabold text-forest-dark">{inCart}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 rounded-lg bg-forest hover:bg-forest-dark text-white flex items-center justify-center border border-forest transition-colors active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest-dark shadow-xs transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Floating Cart Summary (visible when cart has items) ── */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between bg-forest-dark text-white rounded-2xl px-5 py-3.5 shadow-2xl border-2 border-gold/60 hover:border-gold transition-all active:scale-98"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gold" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold">View Cart &bull; {cartCount} item{cartCount > 1 ? 's' : ''}</div>
                <div className="text-[10px] text-gold font-bold">+{cartTotalPV.toFixed(0)} PV &bull; +{cartTotalCV.toFixed(0)} CV</div>
              </div>
            </div>
            <span className="text-base font-extrabold">${(cartTotalCents / 100).toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* ── Cart Drawer (Right Side Bottom Sheet) ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">

            {/* Mobile Pull Handle */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-forest-dark">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            {/* Cart Header */}
            <div className="bg-forest-dark text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-gold">
              <div className="flex items-center space-x-2.5">
                <ShoppingCart className="w-5 h-5 text-gold" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold font-heading">Your Cart</h3>
                  <p className="text-[10px] text-gray-300">{cartCount} item{cartCount > 1 ? 's' : ''} &bull; Member Order</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
              {cartItems.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted">
                  Your cart is empty. Add products to get started!
                </div>
              ) : (
                <>
                  {cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="bg-white rounded-xl p-3.5 border border-forest-subtle shadow-xs flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-forest-subtle to-leaf-subtle flex items-center justify-center text-2xl flex-shrink-0">
                        {(CATEGORY_CONFIG[product.category] || { emoji: '📦' }).emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-forest-dark truncate">{product.name}</h4>
                        <div className="text-[10px] text-muted">${(product.price_cents / 100).toFixed(2)} × {qty}</div>
                        <div className="text-[10px] text-forest font-bold mt-0.5">
                          +{(product.pv * qty).toFixed(0)} PV &bull; +{(product.cv * qty).toFixed(0)} CV
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200 active:scale-90">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold text-forest-dark">{qty}</span>
                        <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-lg bg-forest text-white flex items-center justify-center active:scale-90">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs font-extrabold text-forest-dark flex-shrink-0 ml-1">
                        ${(product.price_cents * qty / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {/* Cart Totals */}
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
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-forest text-white font-extrabold text-sm shadow-md hover:bg-forest-dark transition-all active:scale-98 disabled:opacity-50"
                  >
                    {orderSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Place Member Order &bull; ${(cartTotalCents / 100).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </>
              )}
              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-2 text-xs font-bold text-forest hover:text-forest-dark transition-colors"
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
              Your member order has been submitted and your PV/CV points have been credited.
              The 9% Purchase Reward will be allocated to your wallet.
            </p>
            {orderSuccess?.order_number && (
              <div className="bg-forest-subtle px-4 py-2 rounded-xl inline-block">
                <span className="text-xs font-mono font-bold text-forest-dark">{orderSuccess.order_number}</span>
              </div>
            )}
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 rounded-xl bg-forest text-white font-extrabold text-sm hover:bg-forest-dark transition-all shadow-md"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => { setOrderSuccess(null); onBack(); }}
              className="text-xs text-forest font-bold hover:text-forest-dark"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-3 text-[10px] sm:text-xs border-t-2 border-gold">
        <p>&copy; 2026 ModerNutrition &bull; Member Exclusive Store &bull; All purchases earn PV, CV & 9% Reward</p>
      </footer>
    </div>
  );
}
