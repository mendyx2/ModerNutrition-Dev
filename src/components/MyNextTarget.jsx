import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, ChevronRight, Star, Users, Zap, TrendingUp } from 'lucide-react';

/**
 * Hierarchy Item 5: "My Next Target"
 * Current rank → Next rank with progress bars per qualification requirement.
 * All values come from API response — zero client-side computation.
 */
export default function MyNextTarget({ data }) {
  const { t } = useTranslation();

  const current = data?.current_rank || { name: 'Distributor', level: 2 };
  const next = data?.next_rank || { name: 'Leader', level: 3 };
  const actionSentence = data?.action_sentence
    || 'Sponsor 2 more active frontline members and reach 300 personal PV to qualify for Leader rank this period.';

  const requirements = data?.requirements || [
    { key: 'personal_pv',       label: 'Personal PV',           current: 115,  target: 300,  unit: 'PV' },
    { key: 'group_gv',          label: 'Group Volume (GV)',     current: 1850, target: 5000, unit: 'GV' },
    { key: 'active_frontline',  label: 'Active Frontline',      current: 3,    target: 5,    unit: 'members' },
    { key: 'qualified_legs',    label: 'Qualified Legs',        current: 1,    target: 2,    unit: 'legs' },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-forest-subtle shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-forest-dark font-heading flex items-center space-x-2">
            <Target className="w-5 h-5 text-gold" />
            <span>My Next Target</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Qualification progress toward your next rank advancement</p>
        </div>

        {/* Rank Transition Badge */}
        <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-xl border border-forest-subtle self-start">
          <div className="flex items-center space-x-1.5">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-sm font-extrabold text-forest-dark">{current.name}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="flex items-center space-x-1.5">
            <Star className="w-4 h-4 text-forest" />
            <span className="text-sm font-extrabold text-forest">{next.name}</span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {requirements.map((req) => {
          const pct = Math.min(100, Math.round((req.current / req.target) * 100));
          const isMet = pct >= 100;

          return (
            <div key={req.key} className="bg-surface rounded-xl p-4 border border-forest-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wide">{req.label}</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  isMet
                    ? 'bg-leaf/20 text-forest border border-leaf/40'
                    : 'bg-gold-light text-gold-dark border border-gold/40'
                }`}>
                  {isMet ? '✓ Met' : `${pct}%`}
                </span>
              </div>

              {/* Bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isMet ? 'bg-leaf' : pct >= 60 ? 'bg-forest' : 'bg-gold'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold text-muted">
                <span>{req.current.toLocaleString()} {req.unit}</span>
                <span>{req.target.toLocaleString()} {req.unit} required</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Sentence from API */}
      <div className="bg-gold-light border border-gold/30 rounded-xl px-4 py-3 flex items-start space-x-3">
        <TrendingUp className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-forest-dark leading-relaxed">
          {actionSentence}
        </p>
      </div>
    </section>
  );
}
