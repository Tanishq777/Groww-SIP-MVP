'use client';

import React from 'react';
import { ArrowRight, TrendingUp, Layers, Award } from 'lucide-react';

export function ExploreTabContent({ onSelectFund }: { onSelectFund?: () => void }) {
  const popularFunds = [
    { name: 'Sample Silver ETF FoF Direct-Growth', return3y: '+34.43%', category: 'Precious Metals' },
    { name: 'Sample Small Cap Fund Direct Growth', return3y: '+21.97%', category: 'Small Cap' },
    { name: 'Sample India Mid Cap Fund', return3y: '+21.88%', category: 'Mid Cap' },
    { name: 'Sample Multi Asset Allocation Fund', return3y: '+21.15%', category: 'Hybrid Multi-Asset' },
  ];

  const collections = [
    { title: 'High return', icon: '📈' },
    { title: 'Best SIP funds', icon: '🎯' },
    { title: 'Gold & Silver', icon: '🪙' },
    { title: 'Large Cap', icon: '🏢' },
    { title: 'Mid Cap', icon: '🏭' },
    { title: 'Small Cap', icon: '🏪' },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 space-y-10">
      {/* Popular Funds Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-[#1E222B]">Popular Funds</h2>
          <button
            onClick={onSelectFund}
            className="text-xs font-semibold text-[#00D09C] hover:underline flex items-center gap-1"
          >
            All Mutual Funds <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularFunds.map((fund, idx) => (
            <div
              key={idx}
              onClick={onSelectFund}
              className="bg-white border border-[#EBECEF] rounded-2xl p-5 hover:border-[#CFD3D9] transition-all cursor-pointer shadow-sm flex flex-col justify-between h-44"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F4F6F8] flex items-center justify-center font-bold text-xs text-[#44475B] mb-3">
                  MF
                </div>
                <h4 className="text-[13px] font-bold text-[#1E222B] leading-snug hover:text-[#00D09C]">
                  {fund.name}
                </h4>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-[#F1F3F6]">
                <span className="text-[14px] font-bold text-[#00D09C]">{fund.return3y}</span>
                <span className="text-[11px] text-[#7C7E8C]">3Y Ann.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section>
        <h2 className="text-[18px] font-bold text-[#1E222B] mb-4">Collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {collections.map((item, idx) => (
            <div
              key={idx}
              onClick={onSelectFund}
              className="bg-white border border-[#EBECEF] rounded-2xl p-4 text-center hover:border-[#00D09C] transition-all cursor-pointer shadow-sm"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-semibold text-[#1E222B]">{item.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

