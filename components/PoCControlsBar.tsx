'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sliders, ShieldCheck, FileText, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { ScenarioId } from '@/lib/types';
import { SCENARIOS } from '@/lib/mockData';

interface PoCControlsBarProps {
  currentScenario: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  preferredLanguage: 'en' | 'hinglish';
  onToggleLanguage: () => void;
  gatePassed: boolean;
}

export function PoCControlsBar({
  currentScenario,
  onSelectScenario,
  preferredLanguage,
  onToggleLanguage,
  gatePassed,
}: PoCControlsBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const scenarioList: ScenarioId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      {/* Expanded Scenario Drawer */}
      {isExpanded && (
        <div className="mb-2 bg-[#1E222B] text-white p-4 rounded-2xl shadow-2xl border border-gray-700 w-80 sm:w-96 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00D09C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                PoC Scenario Switcher
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-1.5 max-h-72 overflow-y-auto">
            {scenarioList.map(id => {
              const item = SCENARIOS[id];
              const isSelected = currentScenario === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onSelectScenario(id);
                    setIsExpanded(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#00D09C] text-black font-semibold shadow-sm'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      isSelected ? 'bg-black text-white' : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {id}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs leading-snug">{item.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>
                      {item.shortDescription}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
            <Link
              href="/evals"
              className="hover:text-[#00D09C] flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D09C]" />
              View Eval Report
            </Link>

            <Link
              href="/admin/logs"
              className="hover:text-[#00D09C] flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Mentor Logs
            </Link>
          </div>
        </div>
      )}

      {/* Floating Pill Bar */}
      <div className="bg-[#1E222B] text-white px-3 py-2 rounded-full shadow-2xl border border-gray-700 flex items-center gap-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-[#00D09C] text-black font-bold text-xs flex items-center justify-center">
            {currentScenario}
          </div>
          <span className="text-xs font-semibold pr-1">
            {SCENARIOS[currentScenario].badgeText}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        <span className="w-[1px] h-4 bg-gray-700"></span>

        {/* Live Eval Gate Indicator */}
        <Link
          href="/evals"
          className="flex items-center gap-1 text-[11px] font-bold text-[#00D09C] hover:underline"
          title="Safety Gate passed 100% of checks"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
          Gate: {gatePassed ? 'PASSED' : 'PAUSED'}
        </Link>

        <span className="w-[1px] h-4 bg-gray-700"></span>

        {/* Quick Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className="text-[11px] font-semibold text-gray-300 hover:text-white uppercase"
          title="Toggle Language"
        >
          {preferredLanguage === 'hinglish' ? 'Hinglish' : 'EN'}
        </button>
      </div>
    </div>
  );
}

