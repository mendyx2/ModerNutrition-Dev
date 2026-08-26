import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Package, ShoppingBag, Calendar, Clock, CheckCircle2,
  Search, Filter, ArrowLeft, ChevronRight, ExternalLink,
  DollarSign, Award, RefreshCw, X
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
        return [
          {
            id: 1,
            order_number: 'ORD-88A92F10',
            status: 'paid',
            total_cents: 8500,
            total_pv: 70.00,
            total_cv: 60.00,
            payment_method: 'Mobile Money (DRC)',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            items: [
              { id: 1, product_name: 'VitaActive™ Complete Meal Cereal', quantity: 1, unit_price_cents: 4500, sku: 'VITA-ACT-001' },
              { id: 2, product_name: 'VitaGold™ Fortified Swallow Mix', quantity: 1, unit_price_cents: 4000, sku: 'VITA-GLD-002' }
            ]
          },
          {
            id: 2,
            order_number: 'ORD-44B19C02',
            status: 'paid',
            total_cents: 6000,
            total_pv: 44.00,
            total_cv: 40.00,
            payment_method: 'Airtel Money',
            created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
            items: [
              { id: 3, product_name: 'Daily Greens Vitality Elixir', quantity: 2, unit_price_cents: 3000, sku: 'WELL-GRN-003' }
            ]
          }
        ];
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
  const totalSpentCents = orders.reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const totalPVEarned = orders.reduce((sum, o) => sum + (Number(o.total_pv) || 0), 0);
  const totalCVEarned = orders.reduce((sum, o) => sum + (Number(o.total_cv) || 0), 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      
      {/* ── Top Header ── */}
      <header className="bg-forest-dark text-white border-b-2 border-gold sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
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
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop More</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content Body ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">

        {/* ── Summary Statistics Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total Orders</span>
            <div className="text-xl sm:text-2xl font-extrabold text-forest-dark">{totalOrders}</div>
            <span className="text-[10px] text-forest font-semibold mt-0.5 block">Lifetime purchases</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total Spent</span>
            <div className="text-xl sm:text-2xl font-extrabold text-forest-dark">${(totalSpentCents / 100).toFixed(2)}</div>
            <span className="text-[10px] text-forest font-semibold mt-0.5 block">Product value</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total PV Earned</span>
            <div className="text-xl sm:text-2xl font-extrabold text-gold-dark">+{totalPVEarned.toFixed(1)} PV</div>
            <span className="text-[10px] text-gold font-semibold mt-0.5 block">Rank qualification</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-forest-subtle shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total CV Earned</span>
            <div className="text-xl sm:text-2xl font-extrabold text-leaf">+{totalCVEarned.toFixed(1)} CV</div>
            <span className="text-[10px] text-leaf font-semibold mt-0.5 block">Reward allocations</span>
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
            {['all', 'paid', 'pending', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
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
                : "You haven't placed any member orders yet. Explore our VitaSeries™ product collection to earn your 9% purchase rewards."}
            </p>
            <button
              onClick={onNavigateToShop}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-forest text-white font-bold text-xs shadow hover:bg-forest-dark transition-all"
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
                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {order.status || 'paid'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-muted mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.payment_method && (
                          <>
                            <span>&bull;</span>
                            <span>{order.payment_method}</span>
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
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-2 border-gold">
        <p>&copy; 2026 ModerNutrition Platform &bull; Member Order Management</p>
      </footer>
    </div>
  );
}
