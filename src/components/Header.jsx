import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  User, Award, Globe, LogOut, ShieldCheck,
  LayoutDashboard, ShoppingBag, ClipboardList, Wallet, Users, UserPlus,
  ExternalLink, Menu, X
} from 'lucide-react';

export default function Header({ onOpenOrders, onOpenInvite }) {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="bg-forest-dark text-white border-b-4 border-gold sticky top-0 z-40 shadow-lg">
      
      {/* ── Top Bar: Logo, Menu Items & Account Actions ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo_header_landing_page.png" 
              alt="ModerNutrition Logo" 
              className="h-10 w-10 object-contain rounded-lg border border-gold bg-white p-0.5" 
            />
            <div>
              <span className="font-heading font-extrabold text-base tracking-wide text-white block leading-tight">
                Moder<span className="text-gold">N</span>utrition
              </span>
              <span className="bg-gold text-forest-dark text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                Member Portal
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation Menu Bar ── */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
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

          {/* User Identity & Lang Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-forest-light text-white text-xs font-bold px-2.5 py-1.5 rounded-full border border-white/20 outline-none cursor-pointer hover:border-gold transition-colors"
            >
              <option value="en">EN 🇬🇧</option>
              <option value="fr">FR 🇨🇩</option>
            </select>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-gray-300 hover:text-gold transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout')}</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-gray-200 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest border-t border-white/10 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10"
                  >
                    <Icon className="w-4 h-4 text-gold" />
                    <span>{item.label}</span>
                  </a>
                );
              }

              if (item.special) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.onClick();
                    }}
                    className="col-span-2 flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-gold text-forest-dark font-extrabold text-xs shadow"
                  >
                    <Icon className="w-4 h-4 text-forest-dark" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.onClick();
                  }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 text-left"
                >
                  <Icon className="w-4 h-4 text-gold" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-end">
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 text-xs font-bold text-red-300 hover:text-red-100 py-1"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Member Identity Banner (HIERARCHY ITEM 1) */}
      <div className="bg-forest border-t border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Member Name & Welcome */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-extrabold text-lg">
              {user?.first_name?.[0] || 'M'}
            </div>
            <div>
              <div className="text-xs text-gray-300 font-semibold">{t('welcome.greeting')}</div>
              <h1 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <span>{user?.first_name} {user?.last_name}</span>
                <ShieldCheck className="w-4 h-4 text-leaf inline-block" />
              </h1>
            </div>
          </div>

          {/* Member Identity Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Member ID */}
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-gold" />
              <span className="text-gray-300">{t('welcome.member_id')}</span>
              <strong className="text-white font-mono">{user?.member_number || 'MN-XXXXXX'}</strong>
            </div>

            {/* Rank Badge */}
            <div className="bg-gold/20 px-3 py-1.5 rounded-lg border border-gold/40 flex items-center space-x-1.5 text-gold">
              <Award className="w-3.5 h-3.5" />
              <span className="text-gold-light">{t('welcome.rank')}</span>
              <strong className="text-white">{user?.current_rank?.name || 'Consumer'}</strong>
            </div>

            {/* Country Pill */}
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-leaf" />
              <span className="text-gray-300">{t('welcome.country')}</span>
              <strong className="text-white">{user?.country || 'COD'}</strong>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
