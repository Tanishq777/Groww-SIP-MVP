'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronRight } from 'lucide-react';
import { DeterministicFacts } from '@/lib/types';

interface OrdersCardProps {
  facts: DeterministicFacts;
  isSelected: boolean;
  onSelect: () => void;
}

export function OrdersCard({ facts, isSelected, onSelect }: OrdersCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-bold text-[#1E222B]">Orders (1)</h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#7C7E8C] hover:text-[#1E222B] p-1 rounded transition-colors"
        >
          <ChevronUp
            className={`w-5 h-5 transition-transform duration-200 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {!collapsed && (
        <div className="bg-white rounded-xl border border-[#EBECEF] overflow-hidden transition-all shadow-sm">
          {/* Active Order Card */}
          <div
            onClick={onSelect}
            className={`p-4 cursor-pointer transition-all hover:bg-[#F9FAFB] ${
              isSelected ? 'border-l-4 border-l-[#00D09C] bg-[#F9FAFB]' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[#1E222B] hover:text-[#00D09C] transition-colors leading-snug">
                  {facts.fundName}
                </p>
                <p className="text-[12px] text-[#7C7E8C] mt-1">New SIP</p>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-[15px] font-bold text-[#1E222B]">
                  ₹{facts.monthlyAmount.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
                  <span className="text-[12px] font-medium text-[#00D09C]">
                    In progress
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* All orders navigation row */}
          <div className="border-t border-[#F1F3F6] px-4 py-3 flex items-center justify-between hover:bg-[#F9FAFB] cursor-pointer transition-colors">
            <span className="text-[13px] font-medium text-[#44475B]">All orders</span>
            <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
          </div>
        </div>
      )}
    </div>
  );
}

