import React from 'react';
import { ShoppingBag, ClipboardList, Wallet, Users, UserPlus, ExternalLink } from 'lucide-react';

/**
 * Hierarchy Item 6: Quick Actions
 * Shop, My Orders, My Wallet, My Team, Invite
 */
export default function QuickActions({ permissions }) {
  const actions = [
    {
      id: 'shop',
      label: 'Shop Products',
      desc: 'Browse & purchase VitaSeries™',
      icon: ShoppingBag,
      href: 'http://localhost:5173/catalogue.html',
      external: true,
      color: 'bg-forest/10 text-forest',
      hoverBorder: 'hover:border-forest/40',
    },
    {
      id: 'orders',
      label: 'My Orders',
      desc: 'View order history & status',
      icon: ClipboardList,
      onClick: 'orders',
      color: 'bg-gold-light text-gold-dark',
      hoverBorder: 'hover:border-gold/40',
      permission: 'orders.view-own',
    },
    {
      id: 'wallet',
      label: 'My Wallet',
      desc: 'Balances & transaction history',
      icon: Wallet,
      onClick: 'wallet',
      color: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-300',
      permission: 'wallets.view-own',
    },
    {
      id: 'team',
      label: 'My Team',
      desc: 'Binary tree & downline view',
      icon: Users,
      onClick: 'team',
      color: 'bg-blue-50 text-blue-700',
      hoverBorder: 'hover:border-blue-300',
      permission: 'members.view-team',
    },
    {
      id: 'invite',
      label: 'Invite / Sponsor',
      desc: 'Share referral link',
      icon: UserPlus,
      onClick: 'invite',
      color: 'bg-purple-50 text-purple-700',
      hoverBorder: 'hover:border-purple-300',
    },
  ];

  // Progressive disclosure: only show actions whose permission the /me endpoint granted
  const visibleActions = actions.filter((a) => {
    if (!a.permission) return true;
    if (!permissions) return true; // show all if permissions array not yet loaded
    return permissions.includes(a.permission);
  });

  return (
    <section>
      <h2 className="text-lg font-extrabold text-forest-dark font-heading mb-4 flex items-center space-x-2">
        <span>⚡ Quick Actions</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {visibleActions.map((a) => {
          const Icon = a.icon;

          const content = (
            <div
              className={`bg-white rounded-xl p-4 border border-forest-subtle ${a.hoverBorder} flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-card group`}
            >
              <div className={`p-3 rounded-xl ${a.color} mb-3 transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold text-forest-dark">{a.label}</span>
              <span className="text-[11px] text-muted mt-0.5">{a.desc}</span>
              {a.external && (
                <ExternalLink className="w-3 h-3 text-muted mt-1" />
              )}
            </div>
          );

          if (a.href) {
            return (
              <a key={a.id} href={a.href} target="_blank" rel="noopener noreferrer" className="no-underline">
                {content}
              </a>
            );
          }

          return (
            <div key={a.id} onClick={() => {
              // Emit navigation event — the Dashboard parent handles view switching
              document.dispatchEvent(new CustomEvent('mn-navigate', { detail: a.onClick }));
            }}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
