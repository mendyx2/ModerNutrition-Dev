import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  User, ShieldCheck, Award, Globe, Copy, Check, Share2,
  ArrowLeft, MessageCircle, Send, Users, Sparkles, Mail,
  Phone, Calendar, GitMerge, Settings, Lock, LogOut
} from 'lucide-react';

export default function Profile({ onBack }) {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [placementPref, setPlacementPref] = useState('auto');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const memberCode = user?.member_number || 'MN-382EBA';
  const publicBaseUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://modernutrition-public.vercel.app';
  
  const referralLink = `${publicBaseUrl}/?ref=${memberCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Join my ModerNutrition network and unlock wholesale wellness rewards across DRC and Africa! Use my sponsor code: ${memberCode}`;

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
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
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>My Profile & Sponsor Portal</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">Identity credentials, sponsor link sharing & placement controls</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content Body ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">

        {/* ── Member Identity Hero Card ── */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-forest-subtle shadow-card flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-forest-dark text-gold border-4 border-gold/40 flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-md flex-shrink-0">
            {user?.first_name?.[0] || 'M'}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark font-heading flex items-center space-x-2">
                <span>{user?.first_name} {user?.last_name}</span>
                <ShieldCheck className="w-5 h-5 text-leaf inline-block" />
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                {user?.status || 'Active Member'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-muted">
              <div className="flex items-center space-x-1 font-mono font-bold text-forest-dark bg-surface px-2.5 py-1 rounded-lg border border-gray-200">
                <span>ID:</span>
                <span>{user?.member_number || 'MN-382EBA'}</span>
              </div>
              <div className="flex items-center space-x-1 text-gold-dark bg-gold/15 px-2.5 py-1 rounded-lg border border-gold/30 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{user?.current_rank?.name || 'Consumer (Rank 1)'}</span>
              </div>
              <div className="flex items-center space-x-1 text-forest bg-forest-subtle px-2.5 py-1 rounded-lg font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>{user?.country || 'COD'} (DRC)</span>
              </div>
            </div>

            <p className="text-xs text-muted pt-1">
              Member Account &bull; Email: <strong className="text-forest-dark">{user?.email || 'wendyokarme@gmail.com'}</strong>
            </p>
          </div>

        </div>

        {/* ── Sponsor & Referral Center (Core Section) ── */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-forest-subtle shadow-card space-y-5">
          
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-forest-dark font-heading flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>Sponsor & Team Invitation Center</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Share your personal link to recruit new consumers and distributors into your binary genealogy.
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-forest-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Your Official Sponsor Code</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-gold text-forest-dark rounded-md uppercase">
                Active
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-forest-dark tracking-wider">
              {memberCode}
            </div>

            <div className="pt-2 border-t border-gray-200">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Direct Invitation Link</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 font-mono text-xs text-forest-dark font-bold focus:ring-2 focus:ring-forest outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gold text-forest-dark hover:bg-gold-dark shadow'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Social Sharing Buttons */}
          <div>
            <span className="block text-xs font-bold text-gray-700 mb-2">Instant Social Share</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Share via WhatsApp</span>
              </button>
              <button
                onClick={handleTelegram}
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Share via Telegram</span>
              </button>
            </div>
          </div>

        </section>

        {/* ── Binary Placement & Account Preferences ── */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-forest-subtle shadow-card space-y-5">
          
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-forest-dark font-heading flex items-center space-x-2">
              <GitMerge className="w-5 h-5 text-gold" />
              <span>Binary Placement Preference</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Choose where newly registered members sponsored by your link are automatically placed in your tree.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'auto', label: 'Balanced (Auto)', desc: 'Places new members in your weaker leg to balance GV points.' },
                { key: 'left', label: 'Left Leg Only', desc: 'Forces all new signups into your outer left downline.' },
                { key: 'right', label: 'Right Leg Only', desc: 'Forces all new signups into your outer right downline.' }
              ].map((opt) => (
                <label
                  key={opt.key}
                  onClick={() => setPlacementPref(opt.key)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    placementPref === opt.key
                      ? 'border-forest bg-forest-subtle shadow-xs'
                      : 'border-gray-200 bg-white hover:border-forest/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-forest-dark">{opt.label}</span>
                    <input
                      type="radio"
                      name="placement"
                      checked={placementPref === opt.key}
                      onChange={() => setPlacementPref(opt.key)}
                      className="accent-forest"
                    />
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{opt.desc}</p>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Preferences saved successfully!</span>
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-forest text-white font-extrabold text-xs shadow hover:bg-forest-dark transition-all"
              >
                Save Placement Settings
              </button>
            </div>
          </form>

        </section>

        {/* ── Logout Action ── */}
        <div className="flex justify-center pt-2">
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Portal</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-2 border-gold">
        <p>&copy; 2026 ModerNutrition Platform &bull; Member Profile & Security Subsystem</p>
      </footer>
    </div>
  );
}
