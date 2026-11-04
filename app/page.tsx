'use client';

import React, { useState } from 'react';
import { GrowwHeader } from '@/components/GrowwHeader';
import { GrowwSubTabs, SubTabType } from '@/components/GrowwSubTabs';
import { OrdersCard } from '@/components/OrdersCard';
import { InvestmentsCard } from '@/components/InvestmentsCard';
import { EmptyRightPanel } from '@/components/EmptyRightPanel';
import { SIPCompanionPanel } from '@/components/SIPCompanionPanel';
import { SIPsTabContent } from '@/components/SIPsTabContent';
import { ExploreTabContent } from '@/components/ExploreTabContent';
import { StopMenuModal } from '@/components/StopMenuModal';
import { PoCControlsBar } from '@/components/PoCControlsBar';
import { GrowwFooter } from '@/components/GrowwFooter';
import { ScenarioId } from '@/lib/types';
import { getScenarioData, SCENARIOS } from '@/lib/mockData';
import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';
import { formatRupees } from '@/lib/format';

export default function DashboardPage() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('dashboard');
  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('A');
  const [companionActive, setCompanionActive] = useState<boolean>(true); // Active so user immediately experiences hero feature
  const [selectedFund, setSelectedFund] = useState<boolean>(true);
  const [companionInitialPrompt, setCompanionInitialPrompt] = useState<string | undefined>(undefined);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hinglish'>('en');
  const [stopMenuOpen, setStopMenuOpen] = useState(false);
  const [gatePassed, setGatePassed] = useState(true);
  const [showReturns, setShowReturns] = useState(false);

  const { scenario, facts } = getScenarioData(currentScenario);

  function handleScenarioChange(id: ScenarioId) {
    setCurrentScenario(id);
    setCompanionInitialPrompt(undefined);
    setShowReturns(false);
    if (id === 'E') {
      setStopMenuOpen(true);
    } else if (id === 'G') {
      setPreferredLanguage('hinglish');
      setCompanionActive(true);
      setCompanionInitialPrompt('Bhai market gir raha hai mujhe bohot tension ho rahi hai paise doob toh nahi jayenge?');
    }
  }

  function handleExplainNumber(metric: string) {
    setCompanionActive(true);
    if (metric === 'currentValue') {
      setCompanionInitialPrompt('Why is my current value calculated as this amount?');
    } else if (metric === 'invested') {
      setCompanionInitialPrompt('Explain my total invested amount and completed instalments');
    } else if (metric === 'returns') {
      setCompanionInitialPrompt('Explain my total returns and why it is showing red or green');
    } else if (metric === 'xirr') {
      setCompanionInitialPrompt('Explain what XIRR is and why it swings in the early months');
    } else {
      setCompanionInitialPrompt('Explain my numbers and how they connect to NAV');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar matching screenshot */}
      <GrowwHeader
        activeTab="mf"
        scenarioId={currentScenario}
        facts={facts}
        onOpenMoveDate={() => setStopMenuOpen(true)}
        onOpenExplain={() => {
          setCompanionActive(true);
          setCompanionInitialPrompt('Why was I charged ₹250 penalty on 02 Nov? Did Groww take my money?');
        }}
      />

      {/* Sub Tabs matching screenshot */}
      <GrowwSubTabs
        activeTab={activeSubTab}
        onTabChange={tab => setActiveSubTab(tab)}
        cartCount={1}
      />

      {/* Main Content Container */}
      <main className="flex-1">
        {activeSubTab === 'dashboard' && (
          <div className="max-w-[1240px] mx-auto px-4 py-8">
            {/* Top Scenario Banner Notice (if applicable) */}
            {scenario.bannerNotice && (() => {
              const bannerTitle =
                currentScenario === 'A'
                  ? showReturns
                    ? `Your total returns are currently -₹97.30 (${facts.returnPercentStr})`
                    : `Current value is ${formatRupees(facts.currentValueAmount, 'sentence')} against ${formatRupees(facts.totalInvestedAmount, 'card')} invested`
                  : scenario.bannerNotice.title;
              return (
                <div
                  className={`mb-6 p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
                    scenario.bannerNotice.type === 'alert'
                      ? 'bg-[#FDF2F0] border-[#F9CBC3] text-[#EB5B3C]'
                      : scenario.bannerNotice.type === 'warning'
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                      : 'bg-[#E6FAF5] border-[#B3F2DF] text-[#008764]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {scenario.bannerNotice.type === 'alert' ? (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    ) : scenario.bannerNotice.type === 'warning' ? (
                      <Info className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold">{bannerTitle}</p>
                      <p className="text-xs opacity-90 mt-0.5">{scenario.bannerNotice.message}</p>
                    </div>
                  </div>

                  {scenario.bannerNotice.actionLabel && (
                    <button
                      onClick={() => {
                        if (scenario.bannerNotice?.actionType === 'move_date') {
                          setStopMenuOpen(true);
                        } else {
                          setCompanionActive(true);
                          setCompanionInitialPrompt(scenario.bannerNotice?.message);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white shadow-sm border hover:bg-opacity-90 transition-all text-[#1E222B]"
                    >
                      {scenario.bannerNotice.actionLabel} →
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Dashboard 2-Column Grid matching screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (~440px / 5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                {/* 1. Orders Card */}
                <OrdersCard
                  facts={facts}
                  isSelected={companionActive}
                  onSelect={() => {
                    setSelectedFund(true);
                    setCompanionActive(true);
                  }}
                />

                {/* 2. Investments Card */}
                <InvestmentsCard
                  facts={facts}
                  isSelected={companionActive}
                  onSelect={() => {
                    setSelectedFund(true);
                    setCompanionActive(true);
                  }}
                  onExplainNumber={handleExplainNumber}
                  showReturnsOverride={showReturns}
                  onToggleShowReturns={() => setShowReturns(!showReturns)}
                />
              </div>

              {/* Right Column (Hero / 7 cols) */}
              <div className="lg:col-span-7">
                {companionActive ? (
                  <SIPCompanionPanel
                    facts={facts}
                    scenarioId={currentScenario}
                    preferredLanguage={preferredLanguage}
                    onLanguageToggle={() =>
                      setPreferredLanguage(preferredLanguage === 'en' ? 'hinglish' : 'en')
                    }
                    initialPrompt={companionInitialPrompt}
                    onClose={() => setCompanionActive(false)}
                  />
                ) : (
                  <EmptyRightPanel
                    onActivateCompanion={() => {
                      setSelectedFund(true);
                      setCompanionActive(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'sips' && (
          <SIPsTabContent
            facts={facts}
            sip={scenario.sip}
            scenarioId={currentScenario}
            onOpenCompanionWithPrompt={p => {
              setActiveSubTab('dashboard');
              setCompanionActive(true);
              setCompanionInitialPrompt(p);
            }}
            onOpenStopMenu={() => setStopMenuOpen(true)}
          />
        )}

        {activeSubTab === 'explore' && (
          <ExploreTabContent
            onSelectFund={() => {
              setActiveSubTab('dashboard');
              setCompanionActive(true);
            }}
          />
        )}

        {activeSubTab === 'watchlist' && (
          <div className="max-w-[1240px] mx-auto px-4 py-16 text-center">
            <h2 className="text-lg font-bold text-[#1E222B]">Your Watchlist is Empty</h2>
            <p className="text-xs text-[#7C7E8C] mt-1">
              Add mutual funds you want to monitor over time.
            </p>
          </div>
        )}
      </main>

      {/* Fixed Footer on Every Page */}
      <GrowwFooter />

      {/* Floating PoC Controls Bar */}
      <PoCControlsBar
        currentScenario={currentScenario}
        onSelectScenario={handleScenarioChange}
        preferredLanguage={preferredLanguage}
        onToggleLanguage={() =>
          setPreferredLanguage(preferredLanguage === 'en' ? 'hinglish' : 'en')
        }
        gatePassed={gatePassed}
      />

      {/* Stop Menu Modal */}
      <StopMenuModal
        isOpen={stopMenuOpen}
        onClose={() => setStopMenuOpen(false)}
        facts={facts}
        userWhy={scenario.sip.sipIntentWhy}
        onCompleteAction={(action, detail) => {
          console.log(`Action completed: ${action} - ${detail}`);
        }}
      />
    </div>
  );
}

