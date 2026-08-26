import React, { useState } from 'react';
import { X, Copy, Check, Share2, Users, ArrowRight, MessageCircle, Send, Globe } from 'lucide-react';

export default function InviteModal({ isOpen, onClose, user }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const memberCode = user?.member_number || 'MN-884920';
  const publicBaseUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://modernutrition-public.vercel.app';
  
  const referralLink = `${publicBaseUrl}/?ref=${memberCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Join my ModerNutrition team and unlock wholesale wellness rewards across DRC and Africa! Use my sponsor code: ${memberCode}`;

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full border border-forest-subtle shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Mobile Pull Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-forest-dark">
          <div className="w-10 h-1 rounded-full bg-white/30" />
        </div>

        {/* Modal Header */}
        <div className="bg-forest-dark text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-gold">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold font-heading text-white leading-tight">Invite & Sponsor Members</h3>
              <p className="text-[10px] sm:text-xs text-gray-300">Grow your binary team organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-surface">
          
          {/* Member Code Badge */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-forest-subtle flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-wider block">Your Sponsor Code</span>
              <strong className="text-base sm:text-lg font-mono font-extrabold text-forest-dark">{memberCode}</strong>
            </div>
            <div className="px-2.5 py-1 bg-gold/10 border border-gold/30 rounded-lg text-gold-dark text-[11px] sm:text-xs font-bold">
              Active Sponsor
            </div>
          </div>

          {/* Referral Link Box */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Personalized Referral Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-300 font-mono text-[11px] sm:text-xs text-forest-dark font-bold focus:ring-2 focus:ring-forest outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gold text-forest-dark hover:bg-gold-dark shadow'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted mt-1.5">
              Anyone registering through this link will be automatically attached to your binary organization.
            </p>
          </div>

          {/* Direct Share Options */}
          <div>
            <span className="block text-xs font-bold text-gray-700 mb-2">Share Directly</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTelegram}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-colors shadow-xs active:scale-95"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-forest text-white rounded-xl hover:bg-forest-dark transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
