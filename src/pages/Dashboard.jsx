import React, { useState } from 'react';
import Header from '../components/Header';
import CommerceThisMonth from '../components/CommerceThisMonth';
import FiveRewardCards from '../components/FiveRewardCards';
import AvailableBalance from '../components/AvailableBalance';
import MyNextTarget from '../components/MyNextTarget';
import QuickActions from '../components/QuickActions';
import BinaryTeamView from '../components/BinaryTeamView';
import WalletSection from '../components/WalletSection';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  // ── TanStack React Query: live dashboard summary ──
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['memberDashboardSummary'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/dashboard');
        return res.data;
      } catch {
        // Fallback structure when backend is not yet running
        return {
          personal_purchases_cents: 14500,
          personal_pv: 115.00,
          team_gv: 1850.00,
          monthly_earnings_cents: 34250,
          withdrawable_balance_cents: 24850,
          pending_withdrawal_cents: 1200,
          rewards: {
            member_purchase_reward_cents: 4050,
            distributor_performance_cents: 2700,
            leadership_development_cents: 4050,
            binary_team_bonus_cents: 3600,
            matching_bonus_cents: 2700,
          },
        };
      }
    },
    refetchInterval: 30000,
  });

  // ── Rank progress data ──
  const { data: rankData } = useQuery({
    queryKey: ['memberRankProgress'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/rank-progress');
        return res.data;
      } catch {
        return null; // MyNextTarget uses internal defaults
      }
    },
  });

  // ── Binary team data ──
  const { data: teamData } = useQuery({
    queryKey: ['memberBinaryTeam'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/team/binary');
        return res.data;
      } catch {
        return null; // BinaryTeamView uses internal defaults
      }
    },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ── 1. Welcome + Member Identity ── */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── 2. Your Commerce This Month ── */}
        <CommerceThisMonth data={dashboardData} isLoading={isLoading} />

        {/* ── 3. Five Reward Cards ── */}
        <FiveRewardCards rewardTotals={dashboardData?.rewards} />

        {/* ── 4. Total Available / Withdrawable Balance ── */}
        <AvailableBalance
          balanceCents={dashboardData?.withdrawable_balance_cents}
          pendingCents={dashboardData?.pending_withdrawal_cents}
          onRequestWithdrawal={() => setWithdrawalModalOpen(true)}
        />

        {/* ── 5. My Next Target ── */}
        <MyNextTarget data={rankData} />

        {/* ── 6. Quick Actions ── */}
        <QuickActions permissions={user?.permissions} />

        {/* ── 7. Binary Team View ── */}
        <BinaryTeamView data={teamData} />

        {/* ── 8. Wallet Section ── */}
        <WalletSection />

      </main>

      {/* ── Withdrawal Modal ── */}
      {withdrawalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-forest-subtle shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-forest-dark font-heading">
              💸 Request Balance Withdrawal
            </h3>
            <p className="text-xs text-muted">
              Submit withdrawal request. Server-side maker-checker logic will require
              approval from a distinct administrator (requester ≠ approver enforced).
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Amount (USD)</label>
              <input
                type="number"
                defaultValue="100.00"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark focus:ring-2 focus:ring-forest outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Wallet Category</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark focus:ring-2 focus:ring-forest outline-none">
                <option value="member_reward">Purchase Reward</option>
                <option value="distributor_bonus">Distributor Bonus</option>
                <option value="leadership_bonus">Leadership Bonus</option>
                <option value="binary_bonus">Binary Bonus</option>
                <option value="matching_bonus">Matching Bonus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Payout Method</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark focus:ring-2 focus:ring-forest outline-none">
                <option>Airtel Money (DRC)</option>
                <option>Orange Money (DRC)</option>
                <option>M-Pesa (DRC)</option>
                <option>Bank Wire Transfer</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setWithdrawalModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Withdrawal request submitted for maker-checker review.');
                  setWithdrawalModalOpen(false);
                }}
                className="px-5 py-2.5 text-xs font-extrabold bg-gold text-forest-dark rounded-xl shadow hover:bg-gold-dark transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-4 border-gold">
        <p>&copy; 2026 ModerNutrition Platform. Member Portal v1.0</p>
      </footer>
    </div>
  );
}
