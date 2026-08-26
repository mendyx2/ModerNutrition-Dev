import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  X, LayoutDashboard, ShoppingBag, ClipboardList, Wallet, Users, GitMerge,
  User, LogOut, Globe, Award, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function SideDrawer({
  isOpen,
  onClose,
  activeView = 'dashboard',
  onNavigateToDashboard,
  onNavigateToShop,
  onNavigateToOrders,
  onNavigateToWallet,
  onNavigateToTeam,
  onNavigateToProfile
}) {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();

  if (!isOpen) return null;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('mn_lang', lang);
  };

  const navLinks = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      desc: 'Commerce, rewards & targets',
      icon: LayoutDashboard,
      onClick: () => {
        onClose();
        if (onNavigateToDashboard) onNavigateToDashboard();
      },
    },
    {
      id: 'shop',
      label: 'Shop Products',
      desc: 'Browse & purchase VitaSeries™',
      icon: ShoppingBag,
      onClick: () => {
        onClose();
        if (onNavigateToShop) onNavigateToShop();
      },
    },
    {
      id: 'orders',
      label: 'My Orders',
      desc: 'Order history, delivery & PV/CV',
      icon: ClipboardList,
      onClick: () => {
        onClose();
        if (onNavigateToOrders) onNavigateToOrders();
      },
    },
    {
      id: 'wallet',
      label: 'My Wallet',
      desc: 'Balances, ledger & payout requests',
      icon: Wallet,
      onClick: () => {
        onClose();
        if (onNavigateToWallet) onNavigateToWallet();
      },
    },
    {
      id: 'team',
      label: 'My Binary Team',
      desc: 'Genealogy tree & GV volumes',
      icon: GitMerge,
      onClick: () => {
        onClose();
        if (onNavigateToTeam) onNavigateToTeam();
      },
    },
    {
      id: 'profile',
      label: 'My Profile & Sponsor',
      desc: 'Referral link & account credentials',
      icon: User,
      special: true,
      onClick: () => {
        onClose();
        if (onNavigateToProfile) onNavigateToProfile();
      },
    },
  ];

  return (
    <>
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Drawer */}
      <aside
        className="fixed inset-y-0 right-0 w-[290px] sm:w-[320px] bg-white z-50 shadow-2xl flex flex-col justify-between border-l border-forest-subtle animate-in slide-in-from-right duration-300"
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Drawer Brand Header */}
          <div className="bg-forest-dark text-white p-4 sm:p-5 border-b-2 border-gold flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <img
                src="/assets/logo_header_landing_page.png"
                alt="ModerNutrition"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg border border-gold bg-white p-0.5"
              />
              <div>
                <span className="font-heading font-extrabold text-sm sm:text-base tracking-wide text-white block leading-tight">
                  Moder<span className="text-gold">N</span>utrition
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                  Member Portal
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Profile Card inside Drawer (clickable to go to Profile) */}
          <div
            onClick={() => {
              onClose();
              if (onNavigateToProfile) onNavigateToProfile();
            }}
            className="p-4 bg-surface border-b border-gray-100 cursor-pointer hover:bg-gold/5 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              {user?.avatar || user?.avatar_path ? (
                <img
                  src={user?.avatar || user?.avatar_path}
                  alt={user?.first_name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-gold flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-forest-dark font-extrabold text-base sm:text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                  {user?.first_name?.[0] || 'M'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted leading-none mb-1">
                  {t('welcome.greeting')}
                </div>
                <div className="font-extrabold text-sm text-forest-dark truncate flex items-center space-x-1">
                  <span className="truncate">{user?.first_name} {user?.last_name}</span>
                  <ShieldCheck className="w-4 h-4 text-leaf inline-block flex-shrink-0" />
                </div>
                <div className="text-[11px] font-mono font-bold text-gray-500 mt-0.5">
                  {user?.member_number || 'MN-884920'}
                </div>
              </div>
            </div>

            {/* Rank & Country Pills */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-gold/15 p-2 rounded-lg border border-gold/30 flex items-center space-x-1.5 text-gold-dark">
                <Award className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[11px] font-extrabold truncate">{user?.current_rank?.name || 'Consumer'}</span>
              </div>
              <div className="bg-forest-subtle p-2 rounded-lg border border-forest/10 flex items-center space-x-1.5 text-forest">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[11px] font-extrabold">{user?.country || 'COD'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 flex-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Main Menu
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              if (item.special) {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-forest-dark transition-colors group text-left my-2 ${
                      isActive
                        ? 'bg-gold text-forest-dark border-gold font-extrabold shadow-sm'
                        : 'bg-gold/15 hover:bg-gold/25 border-gold/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gold text-forest-dark flex items-center justify-center font-bold shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-forest-dark">{item.label}</div>
                        <div className="text-[10px] text-forest">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-forest-dark" />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group text-left ${
                    isActive
                      ? 'bg-forest text-white shadow-sm'
                      : 'hover:bg-forest-subtle text-forest-dark'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-gold'
                        : 'bg-forest/10 text-forest group-hover:bg-forest group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-forest-dark'}`}>{item.label}</div>
                      <div className={`text-[10px] ${isActive ? 'text-gray-200' : 'text-muted'}`}>{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-400 group-hover:text-forest'}`} />
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 bg-surface border-t border-gray-100 space-y-3">
          
          {/* Language Selector inside Drawer */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs">
            <span className="font-bold text-gray-700 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-forest" />
              <span>Language:</span>
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  i18n.language === 'en'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                EN 🇬🇧
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  i18n.language === 'fr'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                FR 🇨🇩
              </button>
            </div>
          </div>

          {/* Logout Button inside Drawer */}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-extrabold border border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>

          <p className="text-[10px] text-center text-muted">
            &copy; 2026 ModerNutrition Platform &bull; v1.0
          </p>
        </div>

      </aside>
    </>
  );
}
