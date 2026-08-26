import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Package, ShoppingBag, Calendar, Clock, CheckCircle2,
  Search, Filter, ArrowLeft, ChevronRight, ExternalLink,
  DollarSign, Award, RefreshCw, X, AlertCircle
} from 'lucide-react';

export default function Orders({ onBack, onNavigateToShop }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['memberOrdersPage'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/orders');
        return res.data?.data || res.data || [];
      } catch {
        return [];
      }
    },
  });

  const orders = Array.isArray(ordersData) ? ordersData : [];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchSearch =
        !searchQuery ||
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some((i) =>
          (i.product_name || i.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Aggregate stats
  const totalOrders = orders.length;
  const totalSpentCents = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const totalPVEarned = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.total_pv) || 0), 0);
  const totalCVEarned = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.total_cv) || 0), 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      
      {/* ── Top Header ── */}
      <header className="bg-forest-dark text-white border-b-2 border-gold sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95 cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </button>
              <div>
                <h1 className="font-heading font-extrabold text-sm sm:text-lg text-white leading-tight flex items-center space-x-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>My Orders</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">View order history, status & earned PV/CV points</p>
              </div>
            </div>

            <button
              onClick={onNavigateToShop}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gold hover:bg-gold-light text-forest-dark font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop More</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">

        {/* ── Statistics Overview Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Total Orders
            </span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-forest-dark">
              {totalOrders}
            </div>
            <span className="text-[10px] text-muted block mt-0.5">Lifetime purchases</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Total Spent
            </span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-forest-dark">
              ${(totalSpentCents / 100).toFixed(2)}
            </div>
            <span className="text-[10px] text-muted block mt-0.5">Product value</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Total PV Earned
            </span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-gold-dark">
              +{totalPVEarned.toFixed(1)} PV
            </div>
            <span className="text-[10px] text-muted block mt-0.5">Rank qualification</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block mb-1">
              Total CV Earned
            </span>
            <div className="text-xl sm:text-2xl font-heading font-extrabold text-leaf">
              +{totalCVEarned.toFixed(1)} CV
            </div>
            <span className="text-[10px] text-muted block mt-0.5">Reward allocations</span>
          </div>
        </div>

        {/* ── Filters & Search ── */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-forest-subtle shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or product name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-gray-200 text-xs sm:text-sm font-medium text-forest-dark placeholder-gray-400 focus:ring-2 focus:ring-forest outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'pending', 'paid', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-surface text-muted hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* ── Orders List ── */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-forest-subtle space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest-subtle mx-auto flex items-center justify-center text-forest">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-forest-dark">No orders found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}".`
                : statusFilter !== 'all'
                ? `No orders currently in "${statusFilter}" status.`
                : "You haven't placed any member orders yet. Explore our VitaSeries™ product collection to earn your 9% purchase rewards."}
            </p>
            <button
              onClick={onNavigateToShop}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-forest text-white font-bold text-xs shadow hover:bg-forest-dark transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span>Browse VitaSeries™ Shop</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-forest-subtle shadow-xs hover:shadow-card hover:border-forest/30 transition-all space-y-3"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-sm font-mono font-extrabold text-forest-dark">{order.order_number}</strong>
                        <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : order.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status === 'pending' ? 'Pending Confirmation' : order.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-muted mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.payment_method && (
                          <>
                            <span>&bull;</span>
                            <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-extrabold text-forest-dark">
                      ${((order.total_cents || 0) / 100).toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-forest flex items-center justify-end space-x-1">
                      <span className="text-gold-dark">+{order.total_pv || 0} PV</span>
                      <span>&bull;</span>
                      <span className="text-leaf">+{order.total_cv || 0} CV</span>
                    </div>
                  </div>
                </div>

                {/* Pending notice */}
                {order.status === 'pending' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center space-x-2 text-[11px] text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Awaiting Admin payment confirmation. Once verified, your PV/CV points and 9% Reward will be credited to your wallet.</span>
                  </div>
                )}

                {/* Line Items */}
                {order.items && order.items.length > 0 && (
                  <div className="bg-surface rounded-xl p-3 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                          <span className="w-5 h-5 rounded-md bg-white text-forest-dark font-bold text-[10px] flex items-center justify-center border border-gray-200">
                            {item.quantity || 1}×
                          </span>
                          <span className="font-semibold text-gray-800 truncate">
                            {item.product_name || item.product?.name || 'VitaActive Nutrition Product'}
                          </span>
                          {item.sku && (
                            <span className="text-[10px] font-mono text-muted hidden sm:inline">({item.sku})</span>
                          )}
                        </div>
                        <span className="font-bold text-forest-dark flex-shrink-0">
                          ${(((item.unit_price_cents || item.line_total_cents || 0)) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-2 border-gold mt-auto">
        <p>&copy; 2026 ModerNutrition Platform &bull; Member Order Management</p>
      </footer>
    </div>
  );
}
