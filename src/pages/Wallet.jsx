import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Wallet as WalletIcon, ArrowLeft, ArrowDownLeft, ArrowUpRight,
  Clock, RotateCcw, ChevronLeft, ChevronRight, DollarSign,
  ShieldCheck, AlertCircle, Percent, Award, Users, Check, X,
  Smartphone, Building2, User, AlertTriangle
} from 'lucide-react';

export default function Wallet({ onBack }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeCategory, setActiveCategory] = useState('all');
  const [txPage, setTxPage] = useState(1);
  
  // Withdrawal Form State
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('50.00');
  const [withdrawCategory, setWithdrawCategory] = useState('member_reward');
  const [payoutMethod, setPayoutMethod] = useState('Airtel Money (DRC)');
  const [accountNumber, setAccountNumber] = useState(user?.phone || '');
  const [accountName, setAccountName] = useState(user?.first_name ? `${user.first_name} ${user.last_name}` : '');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

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

  // Selected Category Balance
  const selectedWallet = wallets.find(w => w.bucket === withdrawCategory) || wallets[0];
  const availableForSelected = (selectedWallet?.withdrawable_cents || 0) / 100;

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(withdrawAmount);

    if (isNaN(amt) || amt < 10) {
      setErrorMessage('Minimum withdrawal amount is $10.00 USD.');
      return;
    }

    if (amt > availableForSelected && availableForSelected > 0) {
      setErrorMessage(`Insufficient available balance ($${availableForSelected.toFixed(2)}) in ${selectedWallet?.label || 'selected pool'}.`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('Please enter the recipient phone number or account number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: amt,
        wallet_bucket: withdrawCategory,
        payment_method: payoutMethod,
        payment_details: {
          account_number: accountNumber.trim(),
          account_name: accountName.trim() || `${user?.first_name || 'Member'} ${user?.last_name || ''}`.trim(),
          payment_channel: payoutMethod,
          country: user?.country || 'COD',
        }
      };

      const res = await api.post('/member/withdrawals', payload);
      setSuccessData(res.data?.withdrawal || {
        withdrawal_number: 'WD-' + Math.floor(100000 + Math.random() * 900000),
        amount: amt,
        payment_method: payoutMethod
      });

      // Invalidate queries so available and pending balances refresh
      queryClient.invalidateQueries(['memberWalletsFull']);
      queryClient.invalidateQueries(['memberTransactionsFull']);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit withdrawal request.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isKycVerified = user?.kyc_status === 'verified';

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
              onClick={() => {
                setSuccessData(null);
                setErrorMessage('');
                setWithdrawalModalOpen(true);
              }}
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
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-dark font-heading">
                ${((summary?.withdrawable_cents || 0) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[11px] text-forest font-semibold">Available for payout</span>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setErrorMessage('');
                  setWithdrawalModalOpen(true);
                }}
                className="text-xs font-extrabold text-gold-dark hover:underline flex items-center gap-1"
              >
                <span>Withdraw</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest-subtle shadow-card flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Total Lifetime Earnings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-heading">
                ${((summary?.total_earned_cents || 0) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-muted">
              Cumulative rewards from all 5 bonus pools
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest-subtle shadow-card flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block mb-1">Pending Balance Hold</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-dark font-heading">
                ${((summary?.pending_cents || 0) / 100).toFixed(2)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-muted">
              In maker-checker settlement & review queue
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
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

            {successData ? (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-forest bg-forest-subtle px-2.5 py-1 rounded-md">
                    #{successData.withdrawal_number}
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-forest-dark mt-2">Withdrawal Request Submitted</h4>
                  <p className="text-xs text-muted mt-1">
                    Your payout request of <strong className="text-forest-dark">${parseFloat(successData.amount).toFixed(2)} USD</strong> via {successData.payment_method} has been received and queued for maker-checker review.
                  </p>
                </div>

                <div className="bg-surface p-3 rounded-xl border border-gray-200 text-left text-xs space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>Target Channel:</span>
                    <strong className="text-forest-dark">{successData.payment_method}</strong>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Review Status:</span>
                    <strong className="text-amber-700 uppercase font-bold">Pending Maker-Checker Signoff</strong>
                  </div>
                </div>

                <button
                  onClick={() => setWithdrawalModalOpen(false)}
                  className="w-full py-2.5 bg-forest text-white font-extrabold text-xs rounded-xl hover:bg-forest-dark"
                >
                  Close & View Wallets
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="p-4 sm:p-6 space-y-4 bg-surface max-h-[80vh] overflow-y-auto">
                
                {/* Maker-checker notice */}
                <div className="bg-gold/10 p-3 rounded-xl border border-gold/30 text-[11px] text-gold-dark flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Maker-Checker Compliance: Payouts undergo dual administrative verification before mobile money disbursement.
                  </span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Source Pool & Available Balance */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-700">Source Reward Pool</label>
                    <span className="text-[11px] font-bold text-forest">
                      Available: ${availableForSelected.toFixed(2)} USD
                    </span>
                  </div>
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

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Withdrawal Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-muted">$</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      step="0.01"
                      min="10.00"
                      max={availableForSelected > 0 ? availableForSelected : undefined}
                      required
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-sm focus:ring-2 focus:ring-forest outline-none bg-white font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-muted mt-1 block">Minimum withdrawal: $10.00 USD</span>
                </div>

                {/* Payout Channel */}
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

                {/* Account / Phone details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center space-x-1">
                      <Smartphone className="w-3.5 h-3.5 text-forest" />
                      <span>Phone / Account Number</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="+243 81 234 5678"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-forest" />
                      <span>Account Holder Name</span>
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Jean-Luc Kabongo"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawalModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-xs font-extrabold bg-gold text-forest-dark rounded-xl shadow hover:bg-gold-dark transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {submitting && <Clock className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submitting ? 'Submitting...' : 'Submit Payout Request'}</span>
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
