import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Users, GitMerge, ArrowLeft, TrendingUp, AlertTriangle,
  ArrowRight, UserPlus, CheckCircle2, Award, ChevronDown,
  Layers, Search, Share2
} from 'lucide-react';

export default function BinaryTeam({ onBack, onNavigateToProfile }) {
  const [activeLegView, setActiveLegView] = useState('both');

  const { data: teamData, isLoading } = useQuery({
    queryKey: ['memberBinaryTeamPage'],
    queryFn: async () => {
      try {
        const res = await api.get('/member/team/binary');
        return res.data;
      } catch {
        return null;
      }
    },
  });

  const left = teamData?.left_leg || {
    gv: 1200.00,
    active_members: 8,
    new_members_this_month: 2,
    carry_forward: 450.00,
  };

  const right = teamData?.right_leg || {
    gv: 650.00,
    active_members: 5,
    new_members_this_month: 1,
    carry_forward: 200.00,
  };

  const weaker = left.gv <= right.gv ? 'left' : 'right';
  const gvGap = Math.abs(left.gv - right.gv);
  const actionPrompt = teamData?.action_prompt ||
    `Your ${weaker.toUpperCase()} leg is weaker by ${gvGap.toFixed(2)} GV. Focus sponsoring and product purchases on the ${weaker} side to maximise your 8% Binary Team Bonus payout.`;

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
                  <GitMerge className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>My Binary Team & Genealogy</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">Two-leg binary structure & Group Volume (GV) tracking</p>
              </div>
            </div>

            <button
              onClick={onNavigateToProfile}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sponsor Link</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Main Content Body ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">

        {/* ── Action Prompt Alert ── */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-amber-900">
                Binary Optimization Insight
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                {weaker} Leg Weaker
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {actionPrompt}
            </p>
          </div>
        </div>

        {/* ── Binary Legs Comparison Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Left Leg */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border-2 transition-all shadow-xs ${
            weaker === 'left' ? 'border-amber-400 shadow-glow' : 'border-forest-subtle'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm">
                  L
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-forest-dark">Left Leg Organization</h3>
                  <span className="text-[10px] text-muted">Direct & spillover network</span>
                </div>
              </div>
              {weaker === 'left' ? (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Focus Leg (Pay Leg)
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Power Leg
                </span>
              )}
            </div>

            <div className="text-3xl font-extrabold text-forest-dark mb-4">
              {Number(left.gv).toFixed(2)} <span className="text-xs font-bold text-muted">GV</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">Active</span>
                <strong className="text-sm font-extrabold text-forest-dark">{left.active_members}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">New</span>
                <strong className="text-sm font-extrabold text-blue-600">+{left.new_members_this_month}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">Carry-Over</span>
                <strong className="text-sm font-extrabold text-forest-dark">{Number(left.carry_forward).toFixed(0)}</strong>
              </div>
            </div>
          </div>

          {/* Right Leg */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border-2 transition-all shadow-xs ${
            weaker === 'right' ? 'border-amber-400 shadow-glow' : 'border-forest-subtle'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-sm">
                  R
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-forest-dark">Right Leg Organization</h3>
                  <span className="text-[10px] text-muted">Direct & spillover network</span>
                </div>
              </div>
              {weaker === 'right' ? (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Focus Leg (Pay Leg)
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Power Leg
                </span>
              )}
            </div>

            <div className="text-3xl font-extrabold text-forest-dark mb-4">
              {Number(right.gv).toFixed(2)} <span className="text-xs font-bold text-muted">GV</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">Active</span>
                <strong className="text-sm font-extrabold text-forest-dark">{right.active_members}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">New</span>
                <strong className="text-sm font-extrabold text-emerald-600">+{right.new_members_this_month}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block">Carry-Over</span>
                <strong className="text-sm font-extrabold text-forest-dark">{Number(right.carry_forward).toFixed(0)}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* ── Visual Genealogy Tree Simulation ── */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-forest-subtle shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-forest-dark font-heading">
                Interactive Binary Genealogy Tree
              </h2>
              <p className="text-xs text-muted">Visual placement hierarchy of your downline organisation</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /><span>Left Leg</span></span>
              <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /><span>Right Leg</span></span>
            </div>
          </div>

          {/* Tree structure representation */}
          <div className="py-6 flex flex-col items-center space-y-8 overflow-x-auto">
            
            {/* Level 0: You (Root) */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-forest text-white p-2.5 flex flex-col items-center justify-center border-2 border-gold shadow-lg text-center">
                <span className="text-[10px] font-bold text-gold uppercase">You (Root)</span>
                <strong className="text-xs font-mono truncate w-full mt-0.5">MN-382EBA</strong>
                <span className="text-[9px] text-gray-200 mt-0.5">Rank: 1</span>
              </div>
              <div className="w-0.5 h-6 bg-gold/50" />
            </div>

            {/* Level 1: Left & Right */}
            <div className="w-full max-w-lg relative flex justify-around">
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300" />
              
              {/* Left child */}
              <div className="flex flex-col items-center pt-3">
                <div className="w-24 h-20 rounded-2xl bg-blue-50 border-2 border-blue-400 p-2 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-[9px] font-extrabold text-blue-700 uppercase">Left Pos</span>
                  <strong className="text-[11px] font-mono text-forest-dark">MN-19024A</strong>
                  <span className="text-[9px] text-blue-600 font-bold mt-0.5">650 GV</span>
                </div>
              </div>

              {/* Right child */}
              <div className="flex flex-col items-center pt-3">
                <div className="w-24 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-2 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-[9px] font-extrabold text-emerald-700 uppercase">Right Pos</span>
                  <strong className="text-[11px] font-mono text-forest-dark">MN-88410B</strong>
                  <span className="text-[9px] text-emerald-600 font-bold mt-0.5">400 GV</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-forest-dark text-gray-400 text-center py-4 text-xs border-t-2 border-gold">
        <p>&copy; 2026 ModerNutrition Platform &bull; Binary Commission Engine</p>
      </footer>
    </div>
  );
}
