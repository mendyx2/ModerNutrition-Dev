import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Award, Globe, LogOut, ShieldCheck } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('mn_lang', lang);
  };

  return (
    <header className="bg-forest-dark text-white border-b-4 border-gold sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo_header_landing_page.png" 
              alt="ModerNutrition Logo" 
              className="h-10 w-10 object-contain rounded-lg border border-gold bg-white p-0.5" 
            />
            <span className="bg-gold text-forest-dark text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Member Portal
            </span>
          </div>

          {/* User Identity & Lang Actions */}
          <div className="flex items-center space-x-6">
            
            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-forest-light text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 outline-none cursor-pointer hover:border-gold transition-colors"
            >
              <option value="en">EN 🇬🇧</option>
              <option value="fr">FR 🇨🇩</option>
            </select>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 hover:text-gold transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          </div>

        </div>
      </div>

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
