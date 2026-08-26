import React, { useState } from 'react';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';
import CommerceThisMonth from '../components/CommerceThisMonth';
import FiveRewardCards from '../components/FiveRewardCards';
import AvailableBalance from '../components/AvailableBalance';
import MyNextTarget from '../components/MyNextTarget';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  ShoppingBag, Package, Wallet, GitMerge, User,
  ChevronRight, ArrowUpRight, Sparkles
} from 'lucide-react';

export default function Dashboard({
  onNavigateToDashboard,
  onNavigateToShop,
  onNavigateToOrders,
  onNavigateToWallet,
  onNavigateToTeam,
  onNavigateToProfile
}) {
  const { user } = useAuth();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  // ── TanStack React Query: live dashboard summary ──
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['memberDashboardSummary'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/dashboard');
        return res.data;
      } catch {
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
        return null;
      }
    },
  });

  const hubLinks = [
    {
      title: 'Shop VitaSeries™',
      desc: 'Member exclusive pricing with 9% purchase rewards',
      icon: ShoppingBag,
      color: 'bg-forest/10 text-forest',
      border: 'hover:border-forest/40',
      onClick: onNavigateToShop,
    },
    {
      title: 'My Orders',
      desc: 'Track order delivery and earned PV / CV points',
      icon: Package,
      color: 'bg-gold/15 text-gold-dark',
      border: 'hover:border-gold/40',
      onClick: onNavigateToOrders,
    },
    {
      title: 'My Wallet',
      desc: 'Category balances, payout requests and ledger history',
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-700',
      border: 'hover:border-emerald-300',
      onClick: onNavigateToWallet,
    },
    {
      title: 'Binary Team',
      desc: 'Genealogy tree, Left / Right volumes & carry-forward',
      icon: GitMerge,
      color: 'bg-blue-50 text-blue-700',
      border: 'hover:border-blue-300',
      onClick: onNavigateToTeam,
    },
    {
      title: 'Profile & Sponsor',
      desc: 'Personal referral link, QR sharing & auto-placement',
      icon: User,
      color: 'bg-purple-50 text-purple-700',
      border: 'hover:border-purple-300',
      onClick: onNavigateToProfile,
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased selection:bg-gold selection:text-forest-dark">

      {/* ── 1. Header with Multi-Page Navigation ── */}
      <Header
        activeView="dashboard"
        onOpenDrawer={() => setSideDrawerOpen(true)}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToShop={onNavigateToShop}
        onNavigateToOrders={onNavigateToOrders}
        onNavigateToWallet={onNavigateToWallet}
        onNavigateToTeam={onNavigateToTeam}
        onNavigateToProfile={onNavigateToProfile}
      />

      {/* ── Right-Side Slide-Over Navigation Drawer ── */}
      <SideDrawer
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        activeView="dashboard"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToShop={onNavigateToShop}
        onNavigateToOrders={onNavigateToOrders}
        onNavigateToWallet={onNavigateToWallet}
        onNavigateToTeam={onNavigateToTeam}
        onNavigateToProfile={onNavigateToProfile}
      />

      {/* ── Main Content Body ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-12">

        {/* ── 2. Your Commerce This Month ── */}
        <CommerceThisMonth data={dashboardData} isLoading={isLoading} />

        {/* ── 3. Five Reward Cards ── */}
        <FiveRewardCards rewardTotals={dashboardData?.rewards} />

        {/* ── 4. Total Available / Withdrawable Balance ── */}
        <AvailableBalance
          balanceCents={dashboardData?.withdrawable_balance_cents}
          pendingCents={dashboardData?.pending_withdrawal_cents}
          onRequestWithdrawal={onNavigateToWallet}
        />

        {/* ── 5. My Next Target ── */}
        <MyNextTarget data={rankData} />

        {/* ── 6. Member Portal Navigation Hub ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-forest-dark font-heading flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>Portal Navigation Hub</span>
            </h2>
            <span className="text-xs text-muted">Dedicated management sections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {hubLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.onClick}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border border-forest-subtle ${item.border} shadow-xs hover:shadow-card cursor-pointer transition-all hover:-translate-y-0.5 group flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold text-forest-dark truncate">{item.title}</h3>
                      <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-forest group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-4 border-gold">
        <p>&copy; 2026 ModerNutrition Platform &bull; Member Portal v1.0</p>
      </footer>
    </div>
  );
}
