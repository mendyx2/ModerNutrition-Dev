import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Award, Compass, GitMerge, Layers } from 'lucide-react';

export default function FiveRewardCards({ rewardTotals }) {
  const { t } = useTranslation();

  // Five reward cards mapped to the CV allocation rules
  const rewards = [
    {
      id: 'member_purchase_reward',
      title: t('rewards.member_purchase_reward'),
      allocation: '9% CV',
      desc: t('rewards.member_purchase_reward_desc'),
      earned: `$${((rewardTotals?.member_purchase_reward_cents || 4050) / 100).toFixed(2)}`,
      icon: Gift,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'distributor_performance',
      title: t('rewards.distributor_performance'),
      allocation: '6% CV',
      desc: t('rewards.distributor_performance_desc'),
      earned: `$${((rewardTotals?.distributor_performance_cents || 2700) / 100).toFixed(2)}`,
      icon: Award,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'leadership_development',
      title: t('rewards.leadership_development'),
      allocation: '9% CV',
      desc: t('rewards.leadership_development_desc'),
      earned: `$${((rewardTotals?.leadership_development_cents || 4050) / 100).toFixed(2)}`,
      icon: Compass,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'binary_team_bonus',
      title: t('rewards.binary_team_bonus'),
      allocation: '8% CV',
      desc: t('rewards.binary_team_bonus_desc'),
      earned: `$${((rewardTotals?.binary_team_bonus_cents || 3600) / 100).toFixed(2)}`,
      icon: GitMerge,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'matching_bonus',
      title: t('rewards.matching_bonus'),
      allocation: '6% CV',
      desc: t('rewards.matching_bonus_desc'),
      earned: `$${((rewardTotals?.matching_bonus_cents || 2700) / 100).toFixed(2)}`,
      icon: Layers,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-forest-subtle shadow-card">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-forest-dark flex items-center space-x-2">
          <span>🎁 {t('rewards.title')}</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">{t('rewards.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {rewards.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="bg-surface rounded-xl p-5 border border-forest-subtle flex flex-col justify-between hover:border-gold/50 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-forest/10 text-forest">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${r.badgeColor}`}>
                    {r.allocation}
                  </span>
                </div>

                <h3 className="font-extrabold text-forest-dark text-base mb-1.5 font-heading">
                  {r.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-4">
                  {r.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Earned:</span>
                <span className="text-lg font-extrabold text-forest font-heading">
                  {r.earned}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
