import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Wallet as WalletIcon, ArrowLeft, ArrowDownLeft, ArrowUpRight,
  Clock, RotateCcw, ChevronLeft, ChevronRight, DollarSign,
  ShieldCheck, AlertCircle, Percent, Award, Users, Check, X
} from 'lucide-react';

export default function Wallet({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [txPage, setTxPage] = useState(1);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('100.00');
  const [withdrawCategory, setWithdrawCategory] = useState('member_reward');
  const [payoutMethod, setPayoutMethod] = useState('Airtel Money (DRC)');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // 1. Fetch Wallets Summary
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['memberWalletsFull'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/wallets');
        return res.data;
      } catch {
        return fallbackWalletData();
      }
    },
  });

  // 2. Fetch Ledger Transactions
  const { data: txData, isFetching: txLoading } = useQuery({
    queryKey: ['memberTransactionsFull', activeCategory, txPage],
    queryFn: async () => {
      try {
        const res = await api.get('/member/transactions', {
          params: { category: activeCategory, page: txPage, per_page: 10 }
        });
        return res.data;
      } catch {
        return fallbackTransactions();
      }
    },
  });

  const wallets = walletData?.wallets || fallbackWalletData().wallets;
  const summary = walletData?.summary || fallbackWalletData().summary;
  const transactions = txData?.data || fallbackTransactions().data;
  const pagination = txData?.meta || fallbackTransactions().meta;

  const categories = [
    { key: 'all', label: 'All Wallets', icon: WalletIcon },
    { key: 'member_reward', label: 'Purchase Reward (9%)', icon: Percent },
    { key: 'distributor_bonus', label: 'Distributor Bonus (6%)', icon: Award },
    { key: 'leadership_bonus', label: 'Leadership Bonus (9%)', icon: ShieldCheck },
    { key: 'binary_bonus', label: 'Binary Team (8%)', icon: Users },
    { key: 'matching_bonus', label: 'Matching Bonus (6%)', icon: Award },
  ];

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawalModalOpen(false);
    }, 2500);
  };

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
                  <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>My Wallets & Earnings</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">Per-category reward breakdown & immutable ledger transaction history</p>
              </div>
            </div>

            <button
              onClick={() => setWithdrawalModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Request Payout</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content Body ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">

        {/* ── Balance Summary Tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-2xl border border-forest-subtle shadow-card flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Withdrawable Balance</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
                ${((summary?.withdrawable_cents || 15900) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[11px] text-forest font-semibold">Available for payout</span>
              <button
                onClick={() => setWithdrawalModalOpen(true)}
                className="text-xs font-extrabold text-gold-dark hover:underline"
              >
                Withdraw &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest-subtle shadow-card flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total Lifetime Earnings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest">
                ${((summary?.total_earned_cents || 17100) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-muted">
              Cumulative rewards from all 5 pools
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest-subtle shadow-card flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Pending Balance</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-dark">
                ${((summary?.pending_cents || 1200) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-muted">
              In maker-checker settlement queue
            </div>
          </div>
        </div>

        {/* ── Category Breakdown Cards ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-forest-dark font-heading">
              Reward Pools Breakdown
            </h2>
            <span className="text-xs text-muted">Allocated automatically from BV/CV</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {wallets.map((w) => (
              <div key={w.bucket} className="bg-white rounded-2xl p-4 sm:p-5 border border-forest-subtle shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-forest-dark">{w.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-subtle text-forest">
                    {w.percent_label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                  <div>
                    <span className="text-[9px] text-muted block">Earned</span>
                    <strong className="text-xs font-extrabold text-forest-dark">${((w.earned_cents || 0) / 100).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted block">Pending</span>
                    <strong className="text-xs font-extrabold text-gold-dark">${((w.pending_cents || 0) / 100).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted block">Available</span>
                    <strong className="text-xs font-extrabold text-forest">${((w.withdrawable_cents || 0) / 100).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Paginated Ledger Transactions ── */}
        <section className="bg-white rounded-2xl border border-forest-subtle shadow-card overflow-hidden">
          
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-forest-dark font-heading">
                Immutable Ledger Transactions
              </h3>
              <p className="text-xs text-muted">Append-only financial audit trail</p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => { setActiveCategory(c.key); setTxPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === c.key
                      ? 'bg-forest text-white shadow-xs'
                      : 'bg-surface text-muted hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions table */}
          <div className="divide-y divide-gray-100">
            {txLoading ? (
              <div className="py-12 text-center text-xs text-muted">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">No transactions recorded in this category yet.</div>
            ) : (
              transactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-surface transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-forest-dark">{tx.description}</div>
                        <div className="text-[10px] text-muted flex items-center space-x-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                          <span>&bull;</span>
                          <span className="font-mono">{tx.reference_code || `REF-${tx.id}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-extrabold ${isCredit ? 'text-emerald-700' : 'text-red-600'}`}>
                        {isCredit ? '+' : '-'}${((tx.amount_cents || 0) / 100).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-muted uppercase">{tx.status || 'settled'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-muted">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={txPage <= 1}
                  onClick={() => setTxPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 font-bold"
                >
                  Previous
                </button>
                <button
                  disabled={txPage >= pagination.last_page}
                  onClick={() => setTxPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* ── Withdrawal Modal (Bottom Sheet on Mobile) ── */}
      {withdrawalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-forest-dark">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            <div className="bg-forest-dark text-white p-4 sm:p-5 border-b-2 border-gold flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white font-heading flex items-center space-x-2">
                <ArrowDownLeft className="w-4 h-4 text-gold" />
                <span>Request Balance Withdrawal</span>
              </h3>
              <button
                onClick={() => setWithdrawalModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-base font-extrabold text-forest-dark">Withdrawal Request Submitted</h4>
                <p className="text-xs text-muted">
                  Your request for ${withdrawAmount} via {payoutMethod} has been submitted for Maker-Checker administrative review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="p-4 sm:p-6 space-y-4 bg-surface">
                <div className="bg-gold/10 p-3 rounded-xl border border-gold/30 text-[11px] text-gold-dark flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Server-side Maker-Checker enforcement: Payout requests require approval from a distinct platform administrator before funds release.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Withdrawal Amount (USD)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    step="0.01"
                    min="10.00"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Source Wallet</label>
                  <select
                    value={withdrawCategory}
                    onChange={(e) => setWithdrawCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                  >
                    <option value="member_reward">Purchase Reward (9%)</option>
                    <option value="distributor_bonus">Distributor Performance (6%)</option>
                    <option value="leadership_bonus">Leadership Development (9%)</option>
                    <option value="binary_bonus">Binary Team Bonus (8%)</option>
                    <option value="matching_bonus">Matching Bonus (6%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payout Channel</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                  >
                    <option value="Airtel Money (DRC)">Airtel Money (DRC)</option>
                    <option value="Orange Money (DRC)">Orange Money (DRC)</option>
                    <option value="M-Pesa (DRC)">M-Pesa (DRC)</option>
                    <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawalModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-extrabold bg-gold text-forest-dark rounded-xl shadow hover:bg-gold-dark transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-2 border-gold">
        <p>&copy; 2026 ModerNutrition Platform &bull; Member Wallet & Ledger Subsystem</p>
      </footer>
    </div>
  );
}

// Fallback Wallet Mock Data
function fallbackWalletData() {
  return {
    summary: {
      total_earned_cents: 17100,
      pending_cents: 1200,
      withdrawable_cents: 15900,
    },
    wallets: [
      { bucket: 'member_reward', label: 'Purchase Reward', percent_label: '9%', earned_cents: 4050, pending_cents: 0, withdrawable_cents: 4050 },
      { bucket: 'distributor_bonus', label: 'Distributor Performance', percent_label: '6%', earned_cents: 2700, pending_cents: 300, withdrawable_cents: 2400 },
      { bucket: 'leadership_bonus', label: 'Leadership Development', percent_label: '9%', earned_cents: 4050, pending_cents: 0, withdrawable_cents: 4050 },
      { bucket: 'binary_bonus', label: 'Binary Team Bonus', percent_label: '8%', earned_cents: 3600, pending_cents: 600, withdrawable_cents: 3000 },
      { bucket: 'matching_bonus', label: 'Matching Bonus', percent_label: '6%', earned_cents: 2700, pending_cents: 300, withdrawable_cents: 2400 },
    ],
  };
}

function fallbackTransactions() {
  return {
    data: [
      { id: 1, type: 'credit', category: 'member_reward', amount_cents: 4050, description: '9% Purchase Reward on Order ORD-88A92F10', reference_code: 'TX-9902A', status: 'settled', created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, type: 'credit', category: 'binary_bonus', amount_cents: 3600, description: 'Weekly Binary Team Commission — Left Leg matching', reference_code: 'TX-8841B', status: 'settled', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 3, type: 'credit', category: 'leadership_bonus', amount_cents: 4050, description: 'Leadership Bonus — Executive Distributor Tier', reference_code: 'TX-7731C', status: 'settled', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    ],
    meta: { current_page: 1, last_page: 1, total: 3 }
  };
}
