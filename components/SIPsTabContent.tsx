'use client';

import React, { useState } from 'react';
import {
  Flame,
  Clock,
  ArrowUpDown,
  Edit2,
  CheckCircle,
  Pause,
  AlertCircle,
  Calendar,
  MinusCircle,
  XCircle,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DeterministicFacts, ScenarioId, SIPItem } from '@/lib/types';

interface SIPsTabContentProps {
  facts: DeterministicFacts;
  sip: SIPItem;
  scenarioId: ScenarioId;
  onOpenCompanionWithPrompt?: (prompt: string) => void;
  onOpenStopMenu?: () => void;
}

export function SIPsTabContent({
  facts,
  sip,
  scenarioId,
  onOpenCompanionWithPrompt,
  onOpenStopMenu,
}: SIPsTabContentProps) {
  // If not early view (>90 days), show returns by default; if early view, off by default
  const [showReturns, setShowReturns] = useState(!facts.isEarlyView);
  const [sipName, setSipName] = useState(sip.sipName || 'My First SIP');
  const [sipWhy, setSipWhy] = useState(sip.sipIntentWhy || 'Disciplined long-term savings habit');
  const [editingName, setEditingName] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([
    'Units Concept Master',
    'NAV Allotment Settler',
  ]);

  const successfulInstalments = facts.totalInstalmentsSuccessful;
  const pausedCount = facts.pausedInstalmentsCount;

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8">
      {/* Top Banner: Monthly SIP Amount */}
      <div className="mb-8">
        <span className="text-[13px] font-medium text-[#7C7E8C]">
          Monthly SIP amount
        </span>
        <h1 className="text-[34px] font-bold text-[#1E222B] tracking-tight mt-0.5">
          ₹{facts.monthlyAmount.toLocaleString('en-IN')}
        </h1>
      </div>

      {/* Active SIP Section Header matching screenshot */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-[#1E222B]">Active SIP (1)</h2>
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#44475B] cursor-pointer hover:text-[#1E222B]">
          <ArrowUpDown className="w-4 h-4 text-[#7C7E8C]" />
          <span>Sort by: Due Date</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C7E8C]" />
        </div>
      </div>

      {/* Active SIP Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-sm hover:border-[#CFD3D9] transition-all mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Fund Icon (Flame / Dark Square) */}
            <div className="w-12 h-12 rounded-xl bg-[#1E222B] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Flame className="w-6 h-6 text-[#FF5A5F]" />
            </div>

            <div>
              <h3 className="text-[16px] font-bold text-[#1E222B] hover:text-[#00D09C] transition-colors cursor-pointer">
                {facts.fundName}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[13px] text-[#7C7E8C]">
                <span className="font-semibold text-[#1E222B]">
                  ₹{facts.monthlyAmount.toLocaleString('en-IN')}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-[#00D09C] font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>In progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Due Date Badge matching screenshot */}
          <div className="border border-[#EBECEF] rounded-xl px-4 py-2 text-center min-w-[72px] bg-[#F9FAFB]">
            <span className="block text-[18px] font-bold text-[#1E222B] leading-tight">
              02
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7C7E8C]">
              Nov
            </span>
          </div>
        </div>
      </div>

      {/* Section 5.3: SURROUNDING PRODUCT SCREENS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Progress View, Name Your SIP, 12-Slot Jar */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Name Your SIP & Intent */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#7C7E8C] uppercase tracking-wider">
                Name Your SIP & Your "Why"
              </h4>
              <button
                onClick={() => setEditingName(!editingName)}
                className="text-xs font-semibold text-[#00D09C] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                {editingName ? 'Done' : 'Edit'}
              </button>
            </div>

            {editingName ? (
              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-[11px] text-[#7C7E8C]">SIP Nickname</label>
                  <input
                    type="text"
                    value={sipName}
                    onChange={e => setSipName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#EBECEF] rounded-lg text-sm font-semibold text-[#1E222B] mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7C7E8C]">Your Reason / Purpose (Intent)</label>
                  <input
                    type="text"
                    value={sipWhy}
                    onChange={e => setSipWhy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#EBECEF] rounded-lg text-xs text-[#44475B] mt-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[16px] font-bold text-[#1E222B]">{sipName}</p>
                <p className="text-xs text-[#7C7E8C] mt-0.5 italic">"{sipWhy}"</p>
              </div>
            )}
          </div>

          {/* 2. Progress View: Contribution-Based */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-[#7C7E8C] uppercase tracking-wider">
                  Contribution Progress (First 12 Months)
                </h4>
                <p className="text-xs text-[#7C7E8C] mt-0.5">
                  Milestones are tracked purely by your instalments made, never by fluctuating market returns.
                </p>
              </div>

              {/* Monthly Milestone Badge */}
              <div className="bg-[#E6FAF5] border border-[#B3F2DF] text-[#00D09C] px-3 py-1 rounded-full text-xs font-bold">
                {successfulInstalments === 0
                  ? 'First Instalment in Transit'
                  : `${successfulInstalments} Instalments Made`}
              </div>
            </div>

            {/* 12-Slot Milestone Jar */}
            <div className="my-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#44475B] mb-2">
                <span>The 12-Slot Habit Jar</span>
                <span>{successfulInstalments} / 12 slots filled</span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {Array.from({ length: 12 }).map((_, index) => {
                  const slotNum = index + 1;
                  const isFilled = slotNum <= successfulInstalments;
                  const isResting = slotNum === successfulInstalments + 1 && pausedCount > 0;

                  return (
                    <div
                      key={index}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isFilled
                          ? 'bg-[#00D09C] border-[#00B386] text-white shadow-sm'
                          : isResting
                          ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                          : 'bg-[#F9FAFB] border-[#EBECEF] text-[#9EA0AB]'
                      }`}
                      title={
                        isFilled
                          ? `Instalment ${slotNum} completed`
                          : isResting
                          ? 'Paused by you (resting)'
                          : `Instalment ${slotNum} upcoming`
                      }
                    >
                      <span className="text-[11px] font-bold">{slotNum}</span>
                      {isFilled ? (
                        <CheckCircle className="w-3.5 h-3.5 mt-1" />
                      ) : isResting ? (
                        <span className="text-[9px] font-bold uppercase mt-0.5">Rest</span>
                      ) : (
                        <span className="text-[10px] text-[#CFD3D9]">•</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {pausedCount > 0 && (
                <p className="text-[11px] text-[#7C7E8C] mt-2 flex items-center gap-1">
                  <Pause className="w-3 h-3 text-[#D97706]" />
                  <span>
                    Paused cycles show as <strong>"resting"</strong>, never as missed. Milestone count resumes on next debit.
                  </span>
                </p>
              )}
            </div>

            {/* Primary Contribution Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1F3F6]">
              <div>
                <span className="text-[11px] text-[#7C7E8C] uppercase font-semibold">
                  Capital Contributed
                </span>
                <p className="text-xl font-bold text-[#1E222B] mt-0.5">
                  ₹{facts.totalInvestedAmount.toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#7C7E8C] uppercase font-semibold">
                  Units Earned
                </span>
                <p className="text-xl font-bold text-[#1E222B] mt-0.5">
                  {facts.totalUnitsAllotted} units
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#7C7E8C] uppercase font-semibold">
                  Average Cost / Unit
                </span>
                <p className="text-xl font-bold text-[#1E222B] mt-0.5">
                  ₹{facts.averageNavCost}
                </p>
              </div>
            </div>

            {/* Opt-in Returns & XIRR with Honest Tag */}
            <div className="mt-6 pt-4 border-t border-[#F1F3F6]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#44475B]">
                  Market Valuation & Returns
                </span>
                <button
                  onClick={() => setShowReturns(!showReturns)}
                  className="text-xs font-semibold text-[#00D09C] hover:underline"
                >
                  {showReturns ? 'Hide market returns' : 'Show market returns'}
                </button>
              </div>

              {showReturns && (
                <div className="mt-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#EBECEF] animate-in fade-in space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#7C7E8C]">Current Portfolio Value</p>
                      <p className="text-lg font-bold text-[#1E222B]">
                        ₹{facts.currentValue.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#7C7E8C]">Total Return</p>
                      <p
                        className={`text-lg font-bold ${
                          facts.absoluteReturnAmount < 0 ? 'text-[#EB5B3C]' : 'text-[#00D09C]'
                        }`}
                      >
                        {facts.cardReturnStr}
                      </p>
                    </div>
                  </div>

                  {facts.isEarlyView && (
                    <div className="text-[11px] text-[#B45309] bg-[#FFFBEB] p-2 rounded border border-[#FDE68A]">
                      Short history, so this number swings a lot.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Concept Badges & Stop SIP Menu Trigger */}
        <div className="space-y-6">
          {/* Concept Badges (Only earned, never locked per Section 5.3) */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-sm">
            <h4 className="text-xs font-bold text-[#7C7E8C] uppercase tracking-wider mb-1">
              Earned Concept Badges
            </h4>
            <p className="text-[11px] text-[#7C7E8C] mb-3">
              Unlocked by completing 60-second micro-learning modules.
            </p>

            <div className="space-y-2.5">
              {earnedBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#EBECEF]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E6FAF5] text-[#00D09C] flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E222B]">{badge}</p>
                    <span className="text-[10px] text-[#00D09C] font-semibold">Earned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage or Stop SIP Button */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-sm text-center">
            <h4 className="text-xs font-bold text-[#7C7E8C] uppercase tracking-wider mb-2">
              Managing Your Commitment
            </h4>
            <p className="text-xs text-[#7C7E8C] mb-4">
              Need to adjust due to salary timing or tight cash flow?
            </p>

            <button
              onClick={onOpenStopMenu}
              className="w-full py-2.5 px-4 rounded-xl border border-[#EBECEF] hover:border-[#EB5B3C] hover:text-[#EB5B3C] text-xs font-semibold text-[#44475B] transition-colors"
            >
              Modify, Pause, or Cancel SIP →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

