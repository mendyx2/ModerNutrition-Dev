import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users, GitMerge, ArrowLeft, TrendingUp, AlertTriangle,
  ArrowRight, UserPlus, CheckCircle2, Award, ChevronDown,
  Layers, Search, Share2, Copy, Check, Sparkles, ExternalLink
} from 'lucide-react';

export default function BinaryTeam({ onBack, onNavigateToProfile }) {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(null);

  const memberCode = user?.member_number || 'MN-382EBA';
  const publicBaseUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://modernutrition-dev.vercel.app';

  const copySponsorLink = (leg) => {
    let link = `${publicBaseUrl}/register?sponsor=${memberCode}`;
    if (leg) link += `&leg=${leg}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(leg || 'auto');
    setTimeout(() => setCopiedLink(null), 2500);
  };

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

  const tree = teamData?.tree || {
    root: {
      member_number: memberCode,
      full_name: `${user?.first_name || 'You'} ${user?.last_name || '(Root)'}`,
      rank: user?.current_rank?.name || 'Consumer',
      rank_level: user?.current_rank?.level || 1,
      total_pv: 120,
    },
    left: null,
    right: null,
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
                  <GitMerge className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <span>My Binary Team & Genealogy</span>
                </h1>
                <p className="text-[10px] text-gray-300 hidden sm:block">Two-leg binary structure & Group Volume (GV) tracking</p>
              </div>
            </div>

            {/* Sponsoring links quick dropdown */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => copySponsorLink('left')}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs"
                title="Copy Left Leg Referral Link"
              >
                {copiedLink === 'left' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'left' ? 'Copied Left!' : 'Copy Left Link'}</span>
              </button>

              <button
                onClick={() => copySponsorLink('right')}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                title="Copy Right Leg Referral Link"
              >
                {copiedLink === 'right' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'right' ? 'Copied Right!' : 'Copy Right Link'}</span>
              </button>

              <button
                onClick={onNavigateToProfile}
                className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold text-forest-dark font-extrabold text-xs sm:text-sm shadow hover:bg-gold-dark active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Referral Center</span>
              </button>
            </div>

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
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase font-mono">
                {weaker} Leg Weaker (Pay Leg)
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

            <div className="text-3xl font-extrabold text-forest-dark mb-4 font-heading">
              {Number(left.gv).toFixed(2)} <span className="text-xs font-bold text-muted">GV</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">Active Members</span>
                <strong className="text-sm font-extrabold text-forest-dark">{left.active_members}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">New (30d)</span>
                <strong className="text-sm font-extrabold text-blue-600">+{left.new_members_this_month}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">Carry-Over</span>
                <strong className="text-sm font-extrabold text-forest-dark">{Number(left.carry_forward).toFixed(0)}</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[11px] text-muted font-medium">Direct Placement:</span>
              <button
                onClick={() => copySponsorLink('left')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                {copiedLink === 'left' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'left' ? 'Link Copied!' : 'Copy Left Sponsoring Link'}</span>
              </button>
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

            <div className="text-3xl font-extrabold text-forest-dark mb-4 font-heading">
              {Number(right.gv).toFixed(2)} <span className="text-xs font-bold text-muted">GV</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">Active Members</span>
                <strong className="text-sm font-extrabold text-forest-dark">{right.active_members}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">New (30d)</span>
                <strong className="text-sm font-extrabold text-emerald-600">+{right.new_members_this_month}</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-xl">
                <span className="text-[10px] text-muted block font-medium">Carry-Over</span>
                <strong className="text-sm font-extrabold text-forest-dark">{Number(right.carry_forward).toFixed(0)}</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[11px] text-muted font-medium">Direct Placement:</span>
              <button
                onClick={() => copySponsorLink('right')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
              >
                {copiedLink === 'right' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'right' ? 'Link Copied!' : 'Copy Right Sponsoring Link'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Visual Genealogy Tree Simulation ── */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-forest-subtle shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-forest-dark font-heading">
                Interactive Binary Genealogy Tree
              </h2>
              <p className="text-xs text-muted">Real-time placement hierarchy and spillover nodes</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 font-bold text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /><span>Left Leg</span></span>
              <span className="flex items-center space-x-1.5 font-bold text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /><span>Right Leg</span></span>
            </div>
          </div>

          {/* Tree structure representation */}
          <div className="py-8 flex flex-col items-center space-y-6 overflow-x-auto">
            
            {/* Level 0: You (Root) */}
            <div className="flex flex-col items-center">
              <div className="w-48 rounded-2xl bg-forest-dark text-white p-3.5 flex flex-col items-center justify-center border-2 border-gold shadow-xl text-center">
                <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider">Root Account (You)</span>
                <strong className="text-xs font-bold truncate w-full mt-1 text-white">{tree.root?.full_name}</strong>
                <span className="text-[11px] font-mono text-gold-light mt-0.5">#{tree.root?.member_number}</span>
                <div className="mt-1.5 pt-1.5 border-t border-white/10 w-full flex justify-between text-[10px] text-gray-300">
                  <span>Rank: <strong className="text-white">{tree.root?.rank}</strong></span>
                  <span>PV: <strong className="text-gold">{tree.root?.total_pv || 0}</strong></span>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-gray-300" />
            </div>

            {/* Level 1: Left & Right Nodes */}
            <div className="w-full max-w-2xl relative flex justify-around items-start gap-4">
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300" />
              
              {/* Left Child Node */}
              <div className="flex flex-col items-center pt-4 w-1/2 max-w-xs">
                {tree.left ? (
                  <div className="w-full rounded-2xl bg-blue-50 border-2 border-blue-400 p-3.5 flex flex-col items-center text-center shadow-xs">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">Direct Left Position</span>
                    <strong className="text-xs font-bold text-forest-dark truncate w-full mt-1">{tree.left.full_name}</strong>
                    <span className="text-[11px] font-mono text-blue-800 font-bold">#{tree.left.member_number}</span>
                    <div className="mt-2 pt-2 border-t border-blue-200 w-full flex justify-between text-[10px]">
                      <span className="text-muted">Rank: <strong>{tree.left.rank}</strong></span>
                      <span className="text-blue-700 font-extrabold font-mono">{Number(tree.left.gv).toFixed(0)} GV</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => copySponsorLink('left')}
                    className="w-full rounded-2xl bg-surface hover:bg-blue-50/60 border-2 border-dashed border-blue-300 hover:border-blue-500 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-800 uppercase">Open Left Placement</span>
                    <p className="text-[10px] text-muted mt-0.5">Click to copy Left Sponsoring Link</p>
                    <span className="mt-2 text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {copiedLink === 'left' ? 'Copied to clipboard!' : 'Copy Link'}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Child Node */}
              <div className="flex flex-col items-center pt-4 w-1/2 max-w-xs">
                {tree.right ? (
                  <div className="w-full rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-3.5 flex flex-col items-center text-center shadow-xs">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Direct Right Position</span>
                    <strong className="text-xs font-bold text-forest-dark truncate w-full mt-1">{tree.right.full_name}</strong>
                    <span className="text-[11px] font-mono text-emerald-800 font-bold">#{tree.right.member_number}</span>
                    <div className="mt-2 pt-2 border-t border-emerald-200 w-full flex justify-between text-[10px]">
                      <span className="text-muted">Rank: <strong>{tree.right.rank}</strong></span>
                      <span className="text-emerald-700 font-extrabold font-mono">{Number(tree.right.gv).toFixed(0)} GV</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => copySponsorLink('right')}
                    className="w-full rounded-2xl bg-surface hover:bg-emerald-50/60 border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase">Open Right Placement</span>
                    <p className="text-[10px] text-muted mt-0.5">Click to copy Right Sponsoring Link</p>
                    <span className="mt-2 text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      {copiedLink === 'right' ? 'Copied to clipboard!' : 'Copy Link'}
                    </span>
                  </div>
                )}
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
