import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  User, Award, Globe, LogOut, ShieldCheck,
  LayoutDashboard, ShoppingBag, ClipboardList, Wallet, Users, UserPlus,
  ExternalLink, Share2, Menu
} from 'lucide-react';

export default function Header({ onOpenDrawer, onOpenOrders, onOpenInvite }) {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('mn_lang', lang);
  };

  const publicShopUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173/catalogue.html'
    : 'https://modernutrition-public.vercel.app/catalogue.html';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => {
        setActiveTab('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'shop',
      label: 'Shop Products',
      icon: ShoppingBag,
      href: publicShopUrl,
      external: true,
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: ClipboardList,
      onClick: () => {
        setActiveTab('orders');
        if (onOpenOrders) onOpenOrders();
      },
    },
    {
      id: 'wallet',
      label: 'My Wallet',
      icon: Wallet,
      onClick: () => {
        setActiveTab('wallet');
        const el = document.getElementById('wallet-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'team',
      label: 'My Team',
      icon: Users,
      onClick: () => {
        setActiveTab('team');
        const el = document.getElementById('team-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'invite',
      label: 'Invite / Sponsor',
      icon: UserPlus,
      special: true,
      onClick: () => {
        if (onOpenInvite) onOpenInvite();
      },
    },
  ];

  return (
    <header className="bg-forest-dark text-white border-b-2 sm:border-b-4 border-gold sticky top-0 z-40 shadow-lg">
      
      {/* ── Top Bar: Logo (Left) and Actions + Menu (Right) ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Left: Logo & Brand */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/assets/logo_header_landing_page.png" 
              alt="ModerNutrition" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-lg border border-gold bg-white p-0.5 shadow-xs" 
            />
            <div>
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-wide text-white block leading-tight">
                Moder<span className="text-gold">N</span>utrition
              </span>
              <span className="bg-gold text-forest-dark text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.2 rounded-full uppercase tracking-wider hidden xs:inline-block">
                Member Portal
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation Menu Bar ── */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-gold" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                );
              }

              if (item.special) {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gold text-forest-dark hover:bg-gold-dark shadow-sm transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-forest-dark" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-forest-light text-white border border-gold/40 shadow-xs'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Invite Button, Language Selector & Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Invite Button */}
            <button
              onClick={onOpenInvite}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-[11px] sm:text-xs shadow-sm hover:bg-gold-dark active:scale-95 transition-all"
              title="Share Referral Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>

            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-forest-light text-white text-[11px] sm:text-xs font-bold px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl border border-white/20 outline-none cursor-pointer hover:border-gold transition-colors"
            >
              <option value="en">EN 🇬🇧</option>
              <option value="fr">FR 🇨🇩</option>
            </select>

            {/* Menu (☰) Button on the Right */}
            <button
              onClick={onOpenDrawer}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/10 active:scale-95 ml-1"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-gold" />
            </button>

          </div>

        </div>
      </div>

      {/* ── Compact Mobile-First Member Identity Banner ── */}
      <div className="bg-forest border-t border-white/10 py-2.5 sm:py-3 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
          
          {/* Member Name & Welcome */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-extrabold text-sm sm:text-lg flex-shrink-0">
              {user?.first_name?.[0] || 'M'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs text-gray-300 font-semibold leading-none mb-0.5">{t('welcome.greeting')}</div>
              <h1 className="text-sm sm:text-lg font-extrabold text-white flex items-center space-x-1.5 truncate">
                <span className="truncate">{user?.first_name} {user?.last_name}</span>
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-leaf inline-block flex-shrink-0" />
              </h1>
            </div>
          </div>

          {/* Member Identity Pills */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs overflow-x-auto pb-0.5 no-scrollbar">
            
            {/* Member ID */}
            <div className="bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 flex items-center space-x-1 flex-shrink-0">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
              <span className="text-gray-300 hidden xs:inline">{t('welcome.member_id')}:</span>
              <strong className="text-white font-mono">{user?.member_number || 'MN-XXXXXX'}</strong>
            </div>

            {/* Rank Badge */}
            <div className="bg-gold/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-gold/40 flex items-center space-x-1 text-gold flex-shrink-0">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-gold-light hidden xs:inline">{t('welcome.rank')}:</span>
              <strong className="text-white">{user?.current_rank?.name || 'Consumer'}</strong>
            </div>

            {/* Country Pill */}
            <div className="bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 flex items-center space-x-1 flex-shrink-0">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-leaf" />
              <strong className="text-white">{user?.country || 'COD'}</strong>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
