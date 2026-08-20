import React from 'react';
import { GitMerge, TrendingUp, Users, UserPlus, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * Hierarchy Item 7: Binary Team View
 * LEFT / RIGHT panels with GV, active members, new members, carry-forward volume.
 * Weaker-team highlight + GV gap. Action prompt. Full genealogy tree placeholder.
 */
export default function BinaryTeamView({ data }) {
  const left = data?.left_leg || {
    gv: 1200.00,
    active_members: 8,
    new_members_this_month: 2,
    carry_forward: 450.00,
  };

  const right = data?.right_leg || {
    gv: 650.00,
    active_members: 5,
    new_members_this_month: 1,
    carry_forward: 200.00,
  };

  const weaker = left.gv <= right.gv ? 'left' : 'right';
  const gvGap = Math.abs(left.gv - right.gv);
  const actionPrompt = data?.action_prompt
    || `Your ${weaker} leg is weaker by ${gvGap.toFixed(2)} GV. Focus sponsoring and purchases on the ${weaker} side to maximise your Binary Team Bonus payout.`;

  const renderLeg = (side, leg, isWeak) => (
    <div className={`bg-white rounded-2xl p-5 border-2 transition-all ${
      isWeak ? 'border-amber-400 shadow-glow' : 'border-forest-subtle'
    }`}>
      {/* Leg Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${
            side === 'LEFT' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {side[0]}
          </div>
          <h3 className="font-extrabold text-forest-dark font-heading text-base">{side} LEG</h3>
        </div>
        {isWeak && (
          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Weaker</span>
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCell
          label="Group Volume"
          value={`${leg.gv.toLocaleString(undefined, { minimumFractionDigits: 2 })} GV`}
          icon={<TrendingUp className="w-4 h-4" />}
          highlight
        />
        <MetricCell
          label="Active Members"
          value={leg.active_members}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCell
          label="New This Month"
          value={`+${leg.new_members_this_month}`}
          icon={<UserPlus className="w-4 h-4" />}
        />
        <MetricCell
          label="Carry-Forward"
          value={`${leg.carry_forward.toLocaleString(undefined, { minimumFractionDigits: 2 })} GV`}
          icon={<RefreshCw className="w-4 h-4" />}
        />
      </div>
    </div>
  );

  return (
    <section className="bg-surface rounded-2xl p-6 border border-forest-subtle shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-forest-dark font-heading flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-forest" />
            <span>Binary Team View</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Left & right leg performance summary — all values from the API</p>
        </div>

        {/* GV Gap Badge */}
        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-sm font-bold text-amber-800 self-start">
          GV Gap: <strong className="font-extrabold">{gvGap.toFixed(2)}</strong>
        </div>
      </div>

      {/* LEFT / RIGHT Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {renderLeg('LEFT', left, weaker === 'left')}
        {renderLeg('RIGHT', right, weaker === 'right')}
      </div>

      {/* Action Prompt */}
      <div className="bg-gold-light border border-gold/30 rounded-xl px-4 py-3 flex items-start space-x-3">
        <ArrowRight className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-forest-dark leading-relaxed">
          {actionPrompt}
        </p>
      </div>

      {/* Genealogy Tree Placeholder */}
      <div className="mt-5 bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <GitMerge className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-gray-400">Full Genealogy Tree — Coming Soon</p>
        <p className="text-xs text-gray-300 mt-1">Interactive binary tree visualisation is under development.</p>
      </div>
    </section>
  );
}

function MetricCell({ label, value, icon, highlight }) {
  return (
    <div className={`rounded-xl p-3 border ${
      highlight ? 'bg-forest-subtle border-forest/15' : 'bg-surface border-gray-200/60'
    }`}>
      <div className="flex items-center space-x-1.5 mb-1 text-muted">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-lg font-extrabold text-forest-dark font-heading">{value}</span>
    </div>
  );
}
