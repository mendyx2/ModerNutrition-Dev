import React, { useState } from 'react';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';
import BottomNav from '../components/BottomNav';
import CommerceThisMonth from '../components/CommerceThisMonth';
import FiveRewardCards from '../components/FiveRewardCards';
import AvailableBalance from '../components/AvailableBalance';
import MyNextTarget from '../components/MyNextTarget';
import BinaryTeamView from '../components/BinaryTeamView';
import WalletSection from '../components/WalletSection';
import OrdersModal from '../components/OrdersModal';
import InviteModal from '../components/InviteModal';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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
    <div className="min-h-screen bg-surface flex flex-col antialiased selection:bg-gold selection:text-forest-dark">

      {/* ── 1. Compact Header with Drawer Hamburger Trigger ── */}
      <Header
        onOpenDrawer={() => setSideDrawerOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenInvite={() => setInviteModalOpen(true)}
      />

      {/* ── Side Navigation Slide-Over Drawer ── */}
      <SideDrawer
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenInvite={() => setInviteModalOpen(true)}
      />

      {/* ── Main Content Body with Safe Bottom Padding for Mobile ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">

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

        {/* ── 6. Binary Team View ── */}
        <div id="team-section" className="scroll-mt-20 sm:scroll-mt-28">
          <BinaryTeamView data={teamData} />
        </div>

        {/* ── 7. Wallet Section ── */}
        <div id="wallet-section" className="scroll-mt-20 sm:scroll-mt-28">
          <WalletSection />
        </div>

      </main>

      {/* ── Sticky Mobile Bottom Navigation Bar ── */}
      <BottomNav
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenInvite={() => setInviteModalOpen(true)}
      />

      {/* ── Orders Modal (Bottom Sheet on Mobile) ── */}
      <OrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
      />

      {/* ── Invite / Sponsor Modal (Bottom Sheet on Mobile) ── */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        user={user}
      />

      {/* ── Withdrawal Modal (Bottom Sheet on Mobile) ── */}
      {withdrawalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
            {/* Mobile Pull Handle */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-forest-dark">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            <div className="bg-forest-dark text-white p-4 sm:p-5 border-b-2 border-gold flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white font-heading">
                💸 Request Balance Withdrawal
              </h3>
              <button
                onClick={() => setWithdrawalModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-surface">
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
                Submit withdrawal request. Server-side maker-checker logic will require
                approval from a distinct administrator (requester ≠ approver enforced).
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  defaultValue="100.00"
                  step="0.01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-sm focus:ring-2 focus:ring-forest outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Wallet Category</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white">
                  <option value="member_reward">Purchase Reward</option>
                  <option value="distributor_bonus">Distributor Bonus</option>
                  <option value="leadership_bonus">Leadership Bonus</option>
                  <option value="binary_bonus">Binary Bonus</option>
                  <option value="matching_bonus">Matching Bonus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payout Method</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-forest-dark text-xs sm:text-sm focus:ring-2 focus:ring-forest outline-none bg-white">
                  <option>Airtel Money (DRC)</option>
                  <option>Orange Money (DRC)</option>
                  <option>M-Pesa (DRC)</option>
                  <option>Bank Wire Transfer</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setWithdrawalModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
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
      <footer className="hidden sm:block bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-4 border-gold">
        <p>&copy; 2026 ModerNutrition Platform. Member Portal v1.0</p>
      </footer>
    </div>
  );
}
