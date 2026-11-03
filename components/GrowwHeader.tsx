'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, ChevronDown, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { DeterministicFacts, ScenarioId } from '@/lib/types';

interface GrowwHeaderProps {
  activeTab: 'stocks' | 'fno' | 'mf';
  scenarioId: ScenarioId;
  facts: DeterministicFacts;
  onOpenMoveDate?: () => void;
  onOpenExplain?: () => void;
}

export function GrowwHeader({
  activeTab = 'mf',
  scenarioId,
  facts,
  onOpenMoveDate,
  onOpenExplain,
}: GrowwHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const hasNotification = scenarioId === 'D' || scenarioId === 'C' || scenarioId === 'B';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EBECEF]">
      <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Groww Brand Logo & Primary Products */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img
              src="/groww-logo.png"
              alt="Groww"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium">
            <button className="text-[#7C7E8C] hover:text-[#1E222B] transition-colors py-2">
              Stocks
            </button>
            <button className="text-[#7C7E8C] hover:text-[#1E222B] transition-colors py-2">
              F&O
            </button>
            <button className="text-[#1E222B] font-semibold py-2 relative">
              Mutual Funds
              <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-transparent"></span>
            </button>
          </nav>
        </div>

        {/* Center: Search Groww with Cmd+K hint */}
        <div className="flex-1 max-w-[420px] mx-6 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#7C7E8C] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Groww...."
              className="w-full pl-10 pr-12 py-2 bg-[#F9FAFB] hover:bg-[#F4F6F8] focus:bg-white text-[14px] text-[#1E222B] placeholder-[#9EA0AB] rounded-lg border border-[#EBECEF] focus:border-[#00D09C] focus:outline-none transition-all"
            />
            <div className="absolute right-3 px-1.5 py-0.5 text-[11px] font-semibold text-[#7C7E8C] bg-[#EBECEF] rounded border border-[#DFE2E6]">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications Bell, Avatar */}
        <div className="flex items-center gap-4">
          <button
            title="Explore Discoveries"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#7C7E8C] hover:text-[#1E222B] hover:bg-[#F4F6F8] transition-colors"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Bell Icon with Dropdown for Pre-Debit & Bounce Notices */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#7C7E8C] hover:text-[#1E222B] hover:bg-[#F4F6F8] transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EB5B3C] ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#EBECEF] p-4 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F6]">
                  <span className="text-xs font-bold text-[#44475B] uppercase tracking-wider">
                    Notifications & Heads-up
                  </span>
                  <span className="text-[11px] text-[#00D09C] font-semibold cursor-pointer">
                    Mark read
                  </span>
                </div>

                <div className="py-2 space-y-3">
                  {scenarioId === 'D' && (
                    <div className="bg-[#E6FAF5] border border-[#B3F2DF] p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#00D09C] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#1E222B]">
                            Pre-debit heads-up (4 days lead)
                          </p>
                          <p className="text-xs text-[#44475B] mt-0.5">
                            ₹{facts.monthlyAmount} will debit from your bank on {facts.nextDueDate}. Want to move it?
                          </p>
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              onOpenMoveDate?.();
                            }}
                            className="mt-2 text-xs font-semibold text-[#00D09C] hover:text-[#00B386] flex items-center gap-1"
                          >
                            Move debit date <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scenarioId === 'C' && (
                    <div className="bg-[#FDF2F0] border border-[#F9CBC3] p-3 rounded-lg">
                      <p className="text-xs font-semibold text-[#EB5B3C]">
                        Debit returned: ₹{facts.bankBounceFeeAmount} bank fee charged
                      </p>
                      <p className="text-xs text-[#44475B] mt-0.5">
                        Your bank ({facts.bankBounceFeeChargedBy}) charged a NACH return fee. Groww charges ₹0 and does not auto-retry.
                      </p>
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          onOpenExplain?.();
                        }}
                        className="mt-2 text-xs font-semibold text-[#EB5B3C] hover:underline flex items-center gap-1"
                      >
                        Explain this fee <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {scenarioId === 'B' && (
                    <div className="bg-[#F4F6F8] p-3 rounded-lg border border-[#EBECEF]">
                      <p className="text-xs font-semibold text-[#1E222B]">
                        Instalment debited · Allotment in progress
                      </p>
                      <p className="text-xs text-[#7C7E8C] mt-0.5">
                        Expected unit allotment: {facts.expectedAllotmentDate || '2 business days'}
                      </p>
                    </div>
                  )}

                  {!hasNotification && (
                    <p className="text-xs text-[#7C7E8C] py-2 text-center">
                      No new notifications for this scenario.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Circle "T" */}
          <div className="w-9 h-9 rounded-full bg-[#1E222B] text-white font-semibold text-sm flex items-center justify-center cursor-pointer shadow-sm">
            T
          </div>
        </div>
      </div>
    </header>
  );
}

