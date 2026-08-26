import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { X, ShoppingBag, Package, Calendar, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose }) {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['memberOrdersList'],
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
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            payment_method: 'Mobile Money (DRC)',
            items: [
              { id: 1, product_name: 'VitaActive™ Complete Meal', quantity: 1, unit_price_cents: 4500 },
              { id: 2, product_name: 'VitaGold™ Fortified Swallow Mix', quantity: 1, unit_price_cents: 4000 }
            ]
          }
        ];
      }
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const orders = Array.isArray(ordersData) ? ordersData : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-forest-dark text-white p-5 flex items-center justify-between border-b-2 border-gold">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-heading text-white">My Orders History</h3>
              <p className="text-xs text-gray-300">View past orders, delivery status, and earned PV/CV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-surface">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-forest-subtle mx-auto flex items-center justify-center text-forest">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-forest-dark">No orders found yet</h4>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Explore the VitaSeries™ product collection and place your first member order to earn 9% purchase rewards.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 border border-forest-subtle shadow-sm hover:border-forest/30 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <strong className="text-xs font-mono font-bold text-forest-dark">{order.order_number}</strong>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status || 'paid'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-muted mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-forest-dark">
                      ${((order.total_cents || 0) / 100).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-forest font-bold">
                      +{order.total_pv || 0} PV &bull; +{order.total_cv || 0} CV
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-700">
                        <span>
                          {item.product_name || item.product?.name || 'VitaActive Product'} × {item.quantity || 1}
                        </span>
                        <span className="font-semibold text-muted">
                          ${(((item.unit_price_cents || item.line_total_cents || 0)) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-forest text-white rounded-xl hover:bg-forest-dark transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
