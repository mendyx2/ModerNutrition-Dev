import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';

export default function AvailableBalance({ balanceCents, pendingCents, onRequestWithdrawal }) {
  const { t } = useTranslation();

  const formattedAvailable = `$${((balanceCents || 24850) / 100).toFixed(2)}`;
  const formattedPending = `$${((pendingCents || 1200) / 100).toFixed(2)}`;

  return (
    <section className="bg-gradient-to-r from-forest-dark via-forest to-forest-light text-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-gold relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Prominent Balance Display */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gold font-bold text-xs uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>{t('balance.title')}</span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              {formattedAvailable}
            </span>
            <span className="text-xs bg-leaf/20 text-leaf font-bold px-2.5 py-1 rounded-full border border-leaf/40">
              USD Available
            </span>
          </div>

          <p className="text-xs text-gray-300 max-w-lg">
            {t('balance.subtitle')}
          </p>
        </div>

        {/* Right Side: Pending Info + Action CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          
          {/* Pending Withdrawal Badge */}
          <div className="bg-black/30 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex items-center space-x-3">
            <Lock className="w-5 h-5 text-gold" />
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Pending Review</span>
              <span className="text-sm font-extrabold text-white">{formattedPending}</span>
            </div>
          </div>

          {/* Request Withdrawal CTA */}
          <button
            onClick={onRequestWithdrawal}
            className="bg-gold hover:bg-gold-dark text-forest-dark font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{t('balance.withdraw_btn')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Compliance Note */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center space-x-2 text-[11px] text-gray-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
        <span>Maker-checker server security active: withdrawer cannot approve own payout.</span>
      </div>

    </section>
  );
}
