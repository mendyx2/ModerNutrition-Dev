import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Wallet, Users, UserPlus,
  ExternalLink
} from 'lucide-react';

export default function BottomNav({ onOpenOrders, onOpenInvite }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const publicShopUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173/catalogue.html'
    : 'https://modernutrition-public.vercel.app/catalogue.html';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      onClick: () => {
        setActiveTab('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: ShoppingBag,
      href: publicShopUrl,
      external: true,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ClipboardList,
      onClick: () => {
        setActiveTab('orders');
        if (onOpenOrders) onOpenOrders();
      },
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      onClick: () => {
        setActiveTab('wallet');
        const el = document.getElementById('wallet-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      onClick: () => {
        setActiveTab('team');
        const el = document.getElementById('team-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <aside aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-dark/95 backdrop-blur-md border-t-2 border-gold/60 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] pb-safe">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-300 hover:text-gold transition-colors min-w-[56px] min-h-[48px]"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-gold animate-pulse" />
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-tight">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[48px] ${
                isActive
                  ? 'text-gold font-extrabold scale-105'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-gold/20' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
