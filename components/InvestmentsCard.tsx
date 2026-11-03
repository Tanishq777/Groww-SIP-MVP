'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight, ChevronDown, BarChart2 } from 'lucide-react';
import { DeterministicFacts } from '@/lib/types';

interface InvestmentsCardProps {
  facts: DeterministicFacts;
  onExplainNumber?: (metric: string) => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function InvestmentsCard({
  facts,
  onExplainNumber,
  onSelect,
  isSelected,
}: InvestmentsCardProps) {
  const [showValues, setShowValues] = useState(true);
  const [showXirrDropdown, setShowXirrDropdown] = useState(false);

  const isRed = facts.absoluteReturnAmount < 0;
  const isZero = facts.totalInvestedAmount === 0;

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-bold text-[#1E222B]">
          Investments ({facts.totalInstalmentsSuccessful > 0 ? '1' : '0'})
        </h2>
        <button
          onClick={() => setShowValues(!showValues)}
          className="text-[#7C7E8C] hover:text-[#1E222B] p-1 rounded transition-colors"
          title={showValues ? 'Hide values' : 'Show values'}
        >
          {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Card */}
      <div
        onClick={onSelect}
        className={`bg-white rounded-xl border border-[#EBECEF] p-5 shadow-sm transition-all cursor-pointer hover:border-[#CFD3D9] ${
          isSelected ? 'ring-2 ring-[#00D09C]' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[12px] font-medium text-[#7C7E8C] uppercase tracking-wider">
              Current value
            </span>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onExplainNumber?.('currentValue');
              }}
              className="mt-1 cursor-pointer group flex items-baseline gap-2"
              title="Click to explain current value"
            >
              <span className="text-[26px] font-bold text-[#1E222B] group-hover:text-[#00D09C] transition-colors tracking-tight">
                {showValues ? `₹${facts.currentValue.toLocaleString('en-IN')}` : '••••••'}
              </span>
              <span className="text-[11px] text-[#7C7E8C] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F4F6F8] px-1.5 py-0.5 rounded">
                Explain ↗
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExplainNumber?.('all');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBECEF] hover:border-[#00D09C] text-[#44475B] hover:text-[#00D09C] text-[12px] font-semibold transition-all bg-white"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analyse</span>
          </button>
        </div>

        {/* Dotted horizontal divider line matching screenshot */}
        <div className="border-b border-dashed border-[#EBECEF] my-4"></div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-left">
          {/* 1. Invested Value */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onExplainNumber?.('invested');
            }}
            className="cursor-pointer hover:bg-[#F9FAFB] p-1.5 rounded transition-colors"
          >
            <p className="text-[12px] text-[#7C7E8C]">Invested value</p>
            <p className="text-[14px] font-bold text-[#1E222B] mt-0.5">
              {showValues ? `₹${facts.totalInvestedAmount.toLocaleString('en-IN')}` : '••••'}
            </p>
          </div>

          {/* 2. 1D Returns */}
          <div className="p-1.5">
            <p className="text-[12px] text-[#7C7E8C]">1D returns</p>
            <p className="text-[14px] font-bold text-[#7C7E8C] mt-0.5">
              NA (NA%)
            </p>
          </div>

          {/* 3. Total Returns */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onExplainNumber?.('returns');
            }}
            className="cursor-pointer hover:bg-[#F9FAFB] p-1.5 rounded transition-colors"
          >
            <p className="text-[12px] text-[#7C7E8C]">Total returns</p>
            <p
              className={`text-[14px] font-bold mt-0.5 ${
                isZero
                  ? 'text-[#7C7E8C]'
                  : isRed
                  ? 'text-[#EB5B3C]'
                  : 'text-[#00D09C]'
              }`}
            >
              {showValues
                ? isZero
                  ? '₹0 (0.00%)'
                  : `${isRed ? '-' : '+'}₹${Math.abs(facts.absoluteReturnAmount).toLocaleString('en-IN')} (${facts.absoluteReturnPercent}%)`
                : '••••'}
            </p>
          </div>

          {/* 4. XIRR Dropdown */}
          <div className="relative p-1.5">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowXirrDropdown(!showXirrDropdown);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-[#1E222B]"
            >
              <p className="text-[12px] text-[#7C7E8C]">XIRR</p>
              <ChevronDown className="w-3.5 h-3.5 text-[#7C7E8C]" />
            </div>

            <p
              onClick={(e) => {
                e.stopPropagation();
                onExplainNumber?.('xirr');
              }}
              className="text-[14px] font-bold text-[#1E222B] mt-0.5 cursor-pointer hover:text-[#00D09C]"
            >
              {showValues
                ? facts.xirrPercent !== null
                  ? `${facts.xirrPercent}%`
                  : '--'
                : '••••'}
            </p>

            {/* XIRR Honest Tooltip Dropdown */}
            {showXirrDropdown && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-[#EBECEF] p-3 z-30 text-xs text-[#44475B]">
                <p className="font-semibold text-[#1E222B] mb-1">XIRR (Annualized Return)</p>
                {facts.xirrReliabilityNotice ? (
                  <div className="bg-[#FFFBEB] text-[#B45309] p-2 rounded border border-[#FDE68A] text-[11px]">
                    ⚠️ {facts.xirrReliabilityNotice}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#7C7E8C]">
                    Computed using Newton-Raphson cash flow discount equation across your actual instalment dates.
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowXirrDropdown(false);
                    onExplainNumber?.('xirr');
                  }}
                  className="mt-2 text-[#00D09C] font-semibold hover:underline block"
                >
                  Explain XIRR mechanics →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import external funds row */}
      <div className="mt-3 bg-white rounded-xl border border-[#EBECEF] px-4 py-3 flex items-center justify-between hover:bg-[#F9FAFB] cursor-pointer transition-colors shadow-sm">
        <span className="text-[14px] font-medium text-[#1E222B]">
          Import external funds.
        </span>
        <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
      </div>
    </div>
  );
}

