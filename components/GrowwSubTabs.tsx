'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

export type SubTabType = 'explore' | 'dashboard' | 'sips' | 'watchlist';

interface GrowwSubTabsProps {
  activeTab: SubTabType;
  onTabChange: (tab: SubTabType) => void;
  cartCount?: number;
}

export function GrowwSubTabs({
  activeTab,
  onTabChange,
  cartCount = 1,
}: GrowwSubTabsProps) {
  const tabs: { id: SubTabType; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sips', label: 'SIPs' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <div className="bg-white border-b border-[#EBECEF]">
      <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {tabs.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`py-3.5 text-[15px] font-medium transition-all relative ${
                  isActive
                    ? 'text-[#1E222B] font-semibold'
                    : 'text-[#7C7E8C] hover:text-[#1E222B]'
                }`}
              >
                {t.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1E222B] rounded-t-sm"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Cart Pill */}
        <div className="py-2.5">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBECEF] hover:border-[#CFD3D9] bg-white transition-colors text-[13px] font-medium text-[#44475B]">
            <ShoppingCart className="w-3.5 h-3.5 text-[#44475B]" />
            <span>Cart</span>
            <span className="w-4 h-4 rounded-full bg-[#1E222B] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

