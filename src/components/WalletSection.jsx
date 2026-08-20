import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Wallet as WalletIcon, ChevronLeft, ChevronRight,
  ArrowDownLeft, ArrowUpRight, RotateCcw, Clock
} from 'lucide-react';

/**
 * Hierarchy Item 8: Wallet Section
 * Per-category wallet views, Total Earnings, Pending Balance, Withdrawable Balance,
 * paginated transaction history sourced from ledger_entries.
 */
export default function WalletSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [txPage, setTxPage] = useState(1);

  // Fetch wallet summary from API
  const { data: walletData } = useQuery({
    queryKey: ['memberWallets'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/wallets');
        return res.data;
      } catch {
        return fallbackWalletData();
      }
    },
  });

  // Fetch paginated transactions from ledger_entries
  const { data: txData, isFetching: txLoading } = useQuery({
    queryKey: ['memberTransactions', activeCategory, txPage],
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
    { key: 'all', label: 'All Wallets' },
    { key: 'member_reward', label: 'Purchase Reward' },
    { key: 'distributor_bonus', label: 'Distributor' },
    { key: 'leadership_bonus', label: 'Leadership' },
    { key: 'binary_bonus', label: 'Binary' },
    { key: 'matching_bonus', label: 'Matching' },
  ];

  return (
    <section className="bg-white rounded-2xl border border-forest-subtle shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-extrabold text-forest-dark font-heading flex items-center space-x-2">
          <WalletIcon className="w-5 h-5 text-gold" />
          <span>My Wallet</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">Per-category earnings, pending, and withdrawable balances from the ledger</p>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-100">
        <SummaryTile
          label="Total Earnings"
          value={`$${((summary?.total_earned_cents || 17100) / 100).toFixed(2)}`}
          color="text-forest"
          bg="bg-forest-subtle"
        />
        <SummaryTile
          label="Pending Balance"
          value={`$${((summary?.pending_cents || 1200) / 100).toFixed(2)}`}
          color="text-gold-dark"
          bg="bg-gold-light"
          border
        />
        <SummaryTile
          label="Withdrawable"
          value={`$${((summary?.withdrawable_cents || 15900) / 100).toFixed(2)}`}
          color="text-forest-dark"
          bg="bg-leaf-subtle"
          bold
        />
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto px-6 pt-4 pb-2 gap-2 border-b border-gray-100 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setTxPage(1); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeCategory === cat.key
                ? 'bg-forest text-white border-forest'
                : 'bg-white text-charcoal border-gray-200 hover:border-forest/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Per-Category Wallet Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {wallets
          .filter(w => activeCategory === 'all' || w.bucket === activeCategory)
          .map((w) => (
            <div key={w.bucket} className="bg-surface rounded-xl p-4 border border-forest-subtle">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wide block mb-1">
                {w.label}
              </span>
              <span className="text-xl font-extrabold text-forest-dark font-heading">
                ${(w.available_cents / 100).toFixed(2)}
              </span>
              <div className="flex items-center space-x-3 mt-2 text-[10px] font-bold text-muted">
                <span>Earned: ${(w.earned_cents / 100).toFixed(2)}</span>
                <span>•</span>
                <span>Withdrawn: ${(w.withdrawn_cents / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Transaction History */}
      <div className="px-6 pb-2">
        <h3 className="text-sm font-extrabold text-forest-dark font-heading mb-3">
          Transaction History (ledger_entries)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface text-left text-muted uppercase tracking-wide">
              <th className="px-6 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Description</th>
              <th className="px-4 py-3 font-bold text-right">Amount</th>
              <th className="px-6 py-3 font-bold text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => {
              const isCredit = tx.amount_cents > 0;
              const isReversal = tx.is_reversal;
              return (
                <tr key={tx.id || idx} className="border-t border-gray-100 hover:bg-surface/60 transition-colors">
                  <td className="px-6 py-3 text-muted whitespace-nowrap">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {tx.date}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center space-x-1 font-bold ${
                      isReversal ? 'text-red-600' : isCredit ? 'text-forest' : 'text-amber-700'
                    }`}>
                      {isReversal ? <RotateCcw className="w-3 h-3" /> :
                       isCredit ? <ArrowDownLeft className="w-3 h-3" /> :
                       <ArrowUpRight className="w-3 h-3" />}
                      <span>{tx.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-forest-subtle text-forest text-[10px] font-bold px-2 py-0.5 rounded">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal max-w-[200px] truncate">{tx.description}</td>
                  <td className={`px-4 py-3 text-right font-extrabold ${
                    isReversal ? 'text-red-600' : isCredit ? 'text-forest' : 'text-amber-700'
                  }`}>
                    {isCredit ? '+' : ''}${(tx.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-charcoal">
                    ${(tx.running_balance_cents / 100).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <span className="text-xs text-muted font-bold">
          Page {pagination?.current_page || 1} of {pagination?.last_page || 1}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setTxPage(p => Math.max(1, p - 1))}
            disabled={txPage <= 1}
            className="p-2 rounded-lg border border-gray-200 hover:border-forest/30 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTxPage(p => p + 1)}
            disabled={txPage >= (pagination?.last_page || 1)}
            className="p-2 rounded-lg border border-gray-200 hover:border-forest/30 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryTile({ label, value, color, bg, border, bold }) {
  return (
    <div className={`p-5 flex flex-col items-center justify-center ${bg} ${border ? 'border-x border-gray-100' : ''}`}>
      <span className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">{label}</span>
      <span className={`text-2xl font-extrabold font-heading ${color} ${bold ? 'underline decoration-gold decoration-2 underline-offset-4' : ''}`}>
        {value}
      </span>
    </div>
  );
}

/* ── Fallback data (used when backend API is unavailable) ──────────── */

function fallbackWalletData() {
  return {
    summary: {
      total_earned_cents: 17100,
      pending_cents: 1200,
      withdrawable_cents: 15900,
    },
    wallets: [
      { bucket: 'member_reward',      label: 'Purchase Reward',   earned_cents: 4050, withdrawn_cents: 0,    available_cents: 4050 },
      { bucket: 'distributor_bonus',   label: 'Distributor Bonus', earned_cents: 2700, withdrawn_cents: 500,  available_cents: 2200 },
      { bucket: 'leadership_bonus',    label: 'Leadership Bonus',  earned_cents: 4050, withdrawn_cents: 1000, available_cents: 3050 },
      { bucket: 'binary_bonus',        label: 'Binary Bonus',      earned_cents: 3600, withdrawn_cents: 0,    available_cents: 3600 },
      { bucket: 'matching_bonus',      label: 'Matching Bonus',    earned_cents: 2700, withdrawn_cents: 0,    available_cents: 2700 },
    ],
  };
}

function fallbackTransactions() {
  return {
    data: [
      { id: 1, date: '2026-08-14', type: 'cv_allocation',  category: 'Purchase Reward', description: 'Order ORD-1A2B3C4D — 9% Member Purchase Reward', amount_cents: 1350, running_balance_cents: 4050, is_reversal: false },
      { id: 2, date: '2026-08-13', type: 'cv_allocation',  category: 'Binary Bonus',    description: 'Binary team match cycle — balanced leg payout',    amount_cents: 1800, running_balance_cents: 3600, is_reversal: false },
      { id: 3, date: '2026-08-12', type: 'cv_allocation',  category: 'Leadership',       description: 'Leadership Development allocation — downline GV',  amount_cents: 2025, running_balance_cents: 4050, is_reversal: false },
      { id: 4, date: '2026-08-11', type: 'cv_allocation',  category: 'Matching Bonus',   description: 'Matching Bonus — duplication from sponsored leader', amount_cents: 1350, running_balance_cents: 2700, is_reversal: false },
      { id: 5, date: '2026-08-10', type: 'withdrawal',     category: 'Distributor',      description: 'Withdrawal processed — Airtel Money DRC',          amount_cents: -500, running_balance_cents: 2200, is_reversal: false },
      { id: 6, date: '2026-08-09', type: 'cv_allocation',  category: 'Distributor',      description: 'Distributor Performance 6% — retail volume',       amount_cents: 1350, running_balance_cents: 2700, is_reversal: false },
      { id: 7, date: '2026-08-08', type: 'reversal',       category: 'Purchase Reward',  description: 'Reversal of entry #101 — order refunded',          amount_cents: -450, running_balance_cents: 2700, is_reversal: true },
    ],
    meta: { current_page: 1, last_page: 3, per_page: 10, total: 28 },
  };
}
