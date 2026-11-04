'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  Shield,
  HelpCircle,
  Send,
  Languages,
  X,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { CompanionResponse, DeterministicFacts, ScenarioId } from '@/lib/types';
import { SCENARIOS } from '@/lib/mockData';

interface SIPCompanionPanelProps {
  facts: DeterministicFacts;
  scenarioId: ScenarioId;
  onClose?: () => void;
  initialPrompt?: string;
  preferredLanguage?: 'en' | 'hinglish';
  onLanguageToggle?: () => void;
}

export function SIPCompanionPanel({
  facts,
  scenarioId,
  onClose,
  initialPrompt,
  preferredLanguage = 'en',
  onLanguageToggle,
}: SIPCompanionPanelProps) {
  const [activeJob, setActiveJob] = useState<'summary' | 'explain' | 'event' | 'chat'>('summary');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<CompanionResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<{ query: string; response: CompanionResponse }[]>([]);
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<'up' | 'down' | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string | null>(null);

  const scenarioDef = SCENARIOS[scenarioId] || SCENARIOS.A;

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      handleAsk(initialPrompt);
    }
  }, [initialPrompt]);

  // Handle switching scenarios
  useEffect(() => {
    setChatHistory([]);
    setActiveResponse(null);
    setFeedbackVote(null);
    setFeedbackReason(null);
    setActiveJob('summary');
  }, [scenarioId]);

  async function handleAsk(queryText: string) {
    if (!queryText.trim() || loading) return;

    setLoading(true);
    setActiveJob('chat');
    setFeedbackVote(null);
    setFeedbackReason(null);

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryText,
          scenarioId,
          preferredLanguage,
        }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setActiveResponse(json.data);
        setChatHistory(prev => [...prev, { query: queryText, response: json.data }]);
      } else {
        const errorFallback: CompanionResponse = {
          answer: json.error || 'The Companion is momentarily unavailable.',
          answer_type: "Can't help with that",
          sources: ['System Notice'],
          numbers_used: [],
          confidence: 'low',
          language: preferredLanguage,
        };
        setActiveResponse(errorFallback);
      }
    } catch (e) {
      const errorFallback: CompanionResponse = {
        answer: 'Failed to contact Companion server. Please check your network connection.',
        answer_type: "Can't help with that",
        sources: ['Network Status'],
        numbers_used: [],
        confidence: 'low',
        language: preferredLanguage,
      };
      setActiveResponse(errorFallback);
    } finally {
      setLoading(false);
      setInputQuery('');
    }
  }

  return (
    <div className="bg-white border border-[#EBECEF] rounded-2xl shadow-sm flex flex-col h-full min-h-[580px] overflow-hidden">
      {/* Companion Top Bar */}
      <div className="bg-[#F9FAFB] border-b border-[#EBECEF] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E6FAF5] border border-[#B3F2DF] flex items-center justify-center text-[#00D09C]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#1E222B]">SIP Companion</h3>
              <span className="bg-[#E6FAF5] text-[#00D09C] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#B3F2DF]">
                EVAL-GATED
              </span>
            </div>
            <p className="text-[11px] text-[#7C7E8C]">
              Your objective AI guide for {facts.fundName.replace('Direct Growth', '')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[#EBECEF] bg-white hover:bg-[#F4F6F8] text-[#44475B] transition-colors"
            title="Toggle between English and Hinglish"
          >
            <Languages className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>{preferredLanguage === 'hinglish' ? 'Hinglish' : 'English'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#7C7E8C] hover:text-[#1E222B] hover:bg-[#EBECEF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Jobs Navigation Tabs */}
      <div className="flex border-b border-[#EBECEF] bg-white text-xs font-semibold text-[#7C7E8C]">
        <button
          onClick={() => setActiveJob('summary')}
          className={`flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
            activeJob === 'summary'
              ? 'border-[#00D09C] text-[#1E222B] bg-[#F9FAFB]'
              : 'border-transparent hover:text-[#1E222B]'
          }`}
        >
          1. Month in 5
        </button>

        <button
          onClick={() => setActiveJob('explain')}
          className={`flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
            activeJob === 'explain'
              ? 'border-[#00D09C] text-[#1E222B] bg-[#F9FAFB]'
              : 'border-transparent hover:text-[#1E222B]'
          }`}
        >
          2. Explain Numbers
        </button>

        <button
          onClick={() => setActiveJob('event')}
          className={`flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
            activeJob === 'event'
              ? 'border-[#00D09C] text-[#1E222B] bg-[#F9FAFB]'
              : 'border-transparent hover:text-[#1E222B]'
          }`}
        >
          3. 60s Explainer
        </button>

        <button
          onClick={() => setActiveJob('chat')}
          className={`flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
            activeJob === 'chat'
              ? 'border-[#00D09C] text-[#1E222B] bg-[#F9FAFB]'
              : 'border-transparent hover:text-[#1E222B]'
          }`}
        >
          4. Chat / Doubts
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* JOB 1: MONTHLY SUMMARY (Plain-language "your month in 5 lines") */}
        {activeJob === 'summary' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#EBECEF]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00D09C]"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#44475B]">
                  Your Month in 5 Lines (Deterministic Facts)
                </h4>
              </div>

              <div className="space-y-2 text-[13px] text-[#1E222B] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-[#00D09C] font-bold">1.</span>
                  <p>
                    <strong>Capital Contributed:</strong> ₹{facts.totalInvestedAmount.toLocaleString('en-IN')} across {facts.totalInstalmentsSuccessful} completed monthly instalment(s).
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#00D09C] font-bold">2.</span>
                  <p>
                    <strong>Units Accumulated:</strong> {facts.totalUnitsAllotted} units credited to your folio account.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#00D09C] font-bold">3.</span>
                  <p>
                    <strong>Latest Status:</strong>{' '}
                    {facts.latestInstalmentStatus === 'pending_allotment' ? (
                      <span className="text-[#D97706] font-semibold">
                        ₹{facts.pendingAmount} debited on {facts.nextDueDate}; unit allotment in progress (expected {facts.expectedAllotmentDate}).
                      </span>
                    ) : facts.latestInstalmentStatus === 'bounced' ? (
                      <span className="text-[#EB5B3C] font-semibold">
                        Debit bounced on 02 Nov. ₹{facts.bankBounceFeeAmount} fee levied by bank. Groww fee: ₹0.
                      </span>
                    ) : (
                      <span>All scheduled instalments up to date. Next debit: {facts.nextDueDate}.</span>
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#00D09C] font-bold">4.</span>
                  <p>
                    <strong>Valuation Benchmark:</strong> Today’s NAV is ₹{facts.currentNav}, valuing your portfolio at ₹{facts.currentValue.toLocaleString('en-IN')}.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#00D09C] font-bold">5.</span>
                  <p>
                    <strong>Your Controls:</strong> You can move your debit date, reduce the amount to ₹100, or cancel from the SIP page.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Context Card */}
            <div className="bg-[#FFFFFF] border border-[#EBECEF] rounded-xl p-4">
              <h5 className="text-xs font-bold text-[#44475B] mb-2 uppercase tracking-wide">
                Suggested Questions for Scenario {scenarioId}
              </h5>
              <div className="flex flex-wrap gap-2">
                {scenarioDef.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(prompt)}
                    className="text-left text-xs bg-[#F4F6F8] hover:bg-[#E6FAF5] hover:text-[#00D09C] text-[#44475B] px-3 py-1.5 rounded-lg border border-[#EBECEF] transition-all"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOB 2: EXPLAIN MY NUMBER */}
        {activeJob === 'explain' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-[#7C7E8C]">
              Tap any metric below to see a plain-language explanation computed on your data:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAsk('Explain my allotted units and what they mean')}
                className="p-3 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white text-left transition-all group"
              >
                <span className="text-[11px] text-[#7C7E8C] block uppercase font-medium">
                  Total Units
                </span>
                <span className="text-sm font-bold text-[#1E222B] group-hover:text-[#00D09C]">
                  {facts.totalUnitsAllotted} units
                </span>
                <span className="text-[10px] text-[#7C7E8C] block mt-1">Tap to explain →</span>
              </button>

              <button
                onClick={() => handleAsk('Why is my current value calculated as this amount?')}
                className="p-3 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white text-left transition-all group"
              >
                <span className="text-[11px] text-[#7C7E8C] block uppercase font-medium">
                  Current Value
                </span>
                <span className="text-sm font-bold text-[#1E222B] group-hover:text-[#00D09C]">
                  ₹{facts.currentValue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#7C7E8C] block mt-1">Units * Current NAV →</span>
              </button>

              <button
                onClick={() => handleAsk('Explain my total returns and why it is showing red or green')}
                className="p-3 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white text-left transition-all group"
              >
                <span className="text-[11px] text-[#7C7E8C] block uppercase font-medium">
                  Total Returns
                </span>
                <span
                  className={`text-sm font-bold ${
                    facts.absoluteReturnAmount < 0 ? 'text-[#EB5B3C]' : 'text-[#00D09C]'
                  }`}
                >
                  {facts.cardReturnStr}
                </span>
                {facts.isEarlyView && (
                  <span className="text-[10px] text-[#B45309] block mt-0.5">
                    Short history, so this number swings a lot.
                  </span>
                )}
                <span className="text-[10px] text-[#7C7E8C] block mt-1">Market price move →</span>
              </button>

              <button
                onClick={() => handleAsk('Explain what XIRR is and why it swings in the early months')}
                className="p-3 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white text-left transition-all group"
              >
                <span className="text-[11px] text-[#7C7E8C] block uppercase font-medium">
                  Annualized XIRR
                </span>
                <span className="text-sm font-bold text-[#1E222B] group-hover:text-[#00D09C]">
                  {facts.xirrPercent !== null ? `${facts.xirrPercent}%` : '--'}
                </span>
                {facts.isEarlyView && (
                  <span className="text-[10px] text-[#B45309] block mt-0.5">
                    Short history, so this number swings a lot.
                  </span>
                )}
                <span className="text-[10px] text-[#7C7E8C] block mt-1">Cash flow rate →</span>
              </button>
            </div>
          </div>
        )}

        {/* JOB 3: 60-SECOND EVENT EXPLAINERS */}
        {activeJob === 'event' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <p className="text-xs text-[#7C7E8C]">
              Bite-sized, 60-second micro-explainers for first-time investor moments:
            </p>

            <div
              onClick={() => handleAsk('Why do mutual fund units take 2 business days to allot?')}
              className="p-3.5 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white cursor-pointer transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-[#E6FAF5] text-[#00D09C]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#1E222B]">
                  Why Units Take 2 Business Days (NAV Lag)
                </h5>
                <p className="text-[11px] text-[#7C7E8C] mt-0.5">
                  Understand the banking clearing cycle and why NAV is declared at end of day.
                </p>
                <span className="text-[10px] font-semibold text-[#00D09C] mt-1 inline-block">
                  60 sec read · Tap to learn
                </span>
              </div>
            </div>

            <div
              onClick={() => handleAsk('Why is my current value below invested in month 2?')}
              className="p-3.5 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white cursor-pointer transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-[#FDF2F0] text-[#EB5B3C]">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#1E222B]">
                  Seeing Red in Month 2: Normal Market Cycles
                </h5>
                <p className="text-[11px] text-[#7C7E8C] mt-0.5">
                  Why daily NAV movements fluctuate and how units are held.
                </p>
                <span className="text-[10px] font-semibold text-[#00D09C] mt-1 inline-block">
                  60 sec read · Tap to learn
                </span>
              </div>
            </div>

            <div
              onClick={() => handleAsk('Why was a bank fee charged on a bounced debit?')}
              className="p-3.5 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white cursor-pointer transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#D97706]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#1E222B]">
                  Bank Bounce Fees vs Groww ₹0 Fee
                </h5>
                <p className="text-[11px] text-[#7C7E8C] mt-0.5">
                  Why your bank debits NACH penalties and why Groww never auto-retries failed debits.
                </p>
                <span className="text-[10px] font-semibold text-[#00D09C] mt-1 inline-block">
                  60 sec read · Tap to learn
                </span>
              </div>
            </div>

            <div
              onClick={() => handleAsk('Is there a lock-in period or exit load on my SIP?')}
              className="p-3.5 rounded-xl border border-[#EBECEF] hover:border-[#00D09C] bg-[#F9FAFB] hover:bg-white cursor-pointer transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[#1E222B]">
                  Lock-ins, Exit Loads, and Scheme Charges
                </h5>
                <p className="text-[11px] text-[#7C7E8C] mt-0.5">
                  Understand how lock-ins and redemption charges depend on fund category and scheme rules.
                </p>
                <span className="text-[10px] font-semibold text-[#00D09C] mt-1 inline-block">
                  60 sec read · Tap to learn
                </span>
              </div>
            </div>
          </div>
        )}

        {/* JOB 4: CHAT / CONVERSATION STREAM */}
        {(activeJob === 'chat' || activeResponse) && (
          <div className="space-y-4">
            {chatHistory.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#1E222B] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-xs leading-relaxed">
                    {item.query}
                  </div>
                </div>

                {/* AI Response Card */}
                <div className="bg-[#F9FAFB] border border-[#EBECEF] rounded-2xl rounded-tl-sm p-4 space-y-3">
                  {/* Top Metadata: Answer Type Chip, Confidence, Sources */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EBECEF]">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.response.answer_type === 'Explanation of your numbers'
                          ? 'bg-[#E6FAF5] text-[#00D09C] border border-[#B3F2DF]'
                          : item.response.answer_type === 'Concept'
                          ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                          : item.response.answer_type === 'Expectation'
                          ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                          : 'bg-[#FDF2F0] text-[#EB5B3C] border border-[#F9CBC3]'
                      }`}
                    >
                      {item.response.answer_type}
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-[#7C7E8C]">
                      <span>Confidence: <strong className="text-[#1E222B]">{item.response.confidence}</strong></span>
                      <span>·</span>
                      <span>{item.response.language === 'hinglish' ? 'Hinglish' : 'English'}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs text-[#1E222B] leading-relaxed whitespace-pre-line">
                    {item.response.answer}
                  </div>

                  {/* Tele-MANAS Helpline Banner if Distress */}
                  {item.response.helpline_offered && (
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-2.5 rounded-lg text-xs text-[#1E40AF]">
                      <p className="font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        National Mental Health Helpline: 14416 (Tele-MANAS)
                      </p>
                      <p className="text-[11px] mt-0.5">
                        Toll-free 24x7 government helpline for mental health support. (Flagged for mentor review).
                      </p>
                    </div>
                  )}

                  {/* Neutral Options Offered */}
                  {item.response.options_offered && (
                    <div className="bg-white border border-[#EBECEF] rounded-lg p-2.5">
                      <p className="text-[11px] font-bold text-[#44475B] uppercase tracking-wide mb-1.5">
                        Your Neutral Options:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#44475B]">
                        {item.response.options_offered.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* How Was This Calculated? Expander */}
                  {item.response.how_calculated && item.response.how_calculated.length > 0 && (
                    <div className="border border-[#EBECEF] rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => setShowCalculationDetails(!showCalculationDetails)}
                        className="w-full px-3 py-2 text-left flex items-center justify-between text-xs font-semibold text-[#44475B] hover:bg-[#F9FAFB]"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calculator className="w-3.5 h-3.5 text-[#00D09C]" />
                          How was this calculated? (Deterministic code values)
                        </span>
                        {showCalculationDetails ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {showCalculationDetails && (
                        <div className="p-3 border-t border-[#EBECEF] bg-[#F9FAFB] space-y-2 text-[11px]">
                          {item.response.how_calculated.map((calc, idx2) => (
                            <div key={idx2} className="border-b border-[#EBECEF] pb-1.5 last:border-0 last:pb-0">
                              <span className="font-semibold text-[#1E222B]">{calc.label}:</span>{' '}
                              <span className="font-mono text-[#00D09C]">{calc.value}</span>
                              <div className="text-[10px] text-[#7C7E8C]">Formula: {calc.formula}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Knowledge Base Sources */}
                  {item.response.sources && item.response.sources.length > 0 && (
                    <div className="text-[11px] text-[#7C7E8C] pt-1">
                      <span className="font-medium">Sources: </span>
                      {item.response.sources.map((s, si) => (
                        <span key={si} className="inline-block bg-white border border-[#EBECEF] px-1.5 py-0.5 rounded text-[10px] mr-1 text-[#44475B]">
                          📄 {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Thumbs Up / Down with Reason Chips */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EBECEF]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#7C7E8C]">Was this clear?</span>
                      <button
                        onClick={() => setFeedbackVote('up')}
                        className={`p-1 rounded hover:bg-white text-xs ${
                          feedbackVote === 'up' ? 'text-[#00D09C] font-bold' : 'text-[#7C7E8C]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5 inline mr-1" /> Yes
                      </button>

                      <button
                        onClick={() => setFeedbackVote('down')}
                        className={`p-1 rounded hover:bg-white text-xs ${
                          feedbackVote === 'down' ? 'text-[#EB5B3C] font-bold' : 'text-[#7C7E8C]'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5 inline mr-1" /> Needs clarity
                      </button>
                    </div>

                    {/* Fixed Disclaimer Text */}
                    <span className="text-[10px] text-[#9EA0AB] italic">
                      Educational information, not investment advice.
                    </span>
                  </div>

                  {/* Feedback Reason Chips if Voted Down */}
                  {feedbackVote === 'down' && (
                    <div className="bg-white border border-[#EBECEF] p-2 rounded-lg space-y-1.5 animate-in fade-in">
                      <p className="text-[11px] text-[#44475B] font-medium">What could be clearer?</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Too technical', 'Wanted human help', 'Didn’t answer my number', 'Confusing wording'].map(reason => (
                          <button
                            key={reason}
                            onClick={() => setFeedbackReason(reason)}
                            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                              feedbackReason === reason
                                ? 'bg-[#EB5B3C] text-white border-[#EB5B3C]'
                                : 'bg-[#F9FAFB] text-[#7C7E8C] border-[#EBECEF] hover:border-[#CFD3D9]'
                            }`}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bg-[#F9FAFB] border border-[#EBECEF] rounded-xl p-3 flex items-center gap-2 text-xs text-[#7C7E8C]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D09C]" />
                <span>Running eval-gated generation & safety checker...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white border-t border-[#EBECEF]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={
              preferredLanguage === 'hinglish'
                ? 'Apne number ya doubt ke baare mein puchein...'
                : 'Ask about your numbers, allotment lag, or doubts...'
            }
            className="flex-1 px-3.5 py-2 text-xs bg-[#F9FAFB] border border-[#EBECEF] rounded-xl focus:outline-none focus:border-[#00D09C] focus:bg-white text-[#1E222B]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="w-9 h-9 rounded-xl bg-[#00D09C] hover:bg-[#00B386] disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-[#9EA0AB] mt-2">
          Educational information, not investment advice. AI can make mistakes.
        </p>
      </div>
    </div>
  );
}

