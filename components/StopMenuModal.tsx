'use client';

import React, { useState } from 'react';
import { X, Calendar, MinusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { DeterministicFacts } from '@/lib/types';

interface StopMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  facts: DeterministicFacts;
  userWhy?: string;
  onCompleteAction: (action: string, detail?: string) => void;
}

export function StopMenuModal({
  isOpen,
  onClose,
  facts,
  userWhy = 'Disciplined long-term habit',
  onCompleteAction,
}: StopMenuModalProps) {
  const [selectedOption, setSelectedOption] = useState<'move' | 'reduce' | 'cancel' | null>(null);
  const [newDate, setNewDate] = useState('10');
  const [reducedAmount, setReducedAmount] = useState('100');
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleConfirm() {
    if (selectedOption === 'move') {
      onCompleteAction('Moved Date', `Debit shifted to ${newDate}th of each month.`);
      setActionDone(`Debit date successfully shifted to the ${newDate}th of every month.`);
    } else if (selectedOption === 'reduce') {
      onCompleteAction('Reduced Amount', `Monthly contribution reduced to ₹${reducedAmount}.`);
      setActionDone(`Instalment amount successfully adjusted to ₹${reducedAmount}.`);
    } else if (selectedOption === 'cancel') {
      onCompleteAction('Cancelled SIP', 'Future auto-debits cancelled. Existing units remain safe.');
      setActionDone('Your SIP is cancelled. Your existing units remain safe in your portfolio.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EBECEF] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7C7E8C] hover:text-[#1E222B] hover:bg-[#F4F6F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {actionDone ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E6FAF5] text-[#00D09C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E222B]">Update Confirmed</h3>
            <p className="text-xs text-[#7C7E8C] leading-relaxed max-w-xs mx-auto">
              {actionDone}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-[#1E222B] text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#1E222B]">Adjust or Stop Your SIP</h3>
              <p className="text-xs text-[#7C7E8C] mt-1">
                You have complete freedom over your investment schedule. Choose an option neutrally:
              </p>
            </div>

            {/* User's Own Why Line in Neutral Wording */}
            <div className="bg-[#F9FAFB] border border-[#EBECEF] p-3 rounded-xl">
              <p className="text-[11px] text-[#7C7E8C] uppercase font-medium">Your Stated Intent:</p>
              <p className="text-xs font-semibold text-[#1E222B] mt-0.5 italic">"{userWhy}"</p>
            </div>

            {/* 3 Neutral Options Only */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: Move Date */}
              <div
                onClick={() => setSelectedOption('move')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'move'
                    ? 'border-[#00D09C] bg-[#E6FAF5]'
                    : 'border-[#EBECEF] hover:border-[#CFD3D9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-[#EBECEF] text-[#00D09C]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1E222B]">1. Move Debit Date</p>
                    <p className="text-[11px] text-[#7C7E8C]">
                      Align with when your salary is credited to prevent bank return charges.
                    </p>
                  </div>
                </div>

                {selectedOption === 'move' && (
                  <div className="mt-3 pt-3 border-t border-[#B3F2DF] flex items-center gap-2">
                    <span className="text-xs text-[#44475B]">New monthly date:</span>
                    <select
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="px-2 py-1 border border-[#00D09C] bg-white rounded text-xs font-semibold"
                    >
                      <option value="5">5th of each month</option>
                      <option value="10">10th of each month</option>
                      <option value="15">15th of each month</option>
                      <option value="20">20th of each month</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Option 2: Reduce Amount */}
              <div
                onClick={() => setSelectedOption('reduce')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'reduce'
                    ? 'border-[#00D09C] bg-[#E6FAF5]'
                    : 'border-[#EBECEF] hover:border-[#CFD3D9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-[#EBECEF] text-[#00D09C]">
                    <MinusCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1E222B]">2. Reduce Amount (Floor ₹100)</p>
                    <p className="text-[11px] text-[#7C7E8C]">
                      Keep your disciplined habit active with a smaller monthly commitment.
                    </p>
                  </div>
                </div>

                {selectedOption === 'reduce' && (
                  <div className="mt-3 pt-3 border-t border-[#B3F2DF] flex items-center gap-2">
                    <span className="text-xs text-[#44475B]">Reduced instalment:</span>
                    <select
                      value={reducedAmount}
                      onChange={e => setReducedAmount(e.target.value)}
                      className="px-2 py-1 border border-[#00D09C] bg-white rounded text-xs font-semibold"
                    >
                      <option value="100">₹100 (Minimum floor)</option>
                      <option value="250">₹250</option>
                      <option value="500">₹500</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Option 3: Cancel SIP (One-Tap, Zero Guilt) */}
              <div
                onClick={() => setSelectedOption('cancel')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'cancel'
                    ? 'border-[#EB5B3C] bg-[#FDF2F0]'
                    : 'border-[#EBECEF] hover:border-[#CFD3D9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-[#EBECEF] text-[#EB5B3C]">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#EB5B3C]">3. Cancel SIP (One Tap)</p>
                    <p className="text-[11px] text-[#7C7E8C]">
                      Stop future debits. Your existing units remain safe in your portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#7C7E8C] hover:text-[#1E222B]"
              >
                Go back
              </button>
              <button
                disabled={!selectedOption}
                onClick={handleConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-40 ${
                  selectedOption === 'cancel' ? 'bg-[#EB5B3C] hover:bg-[#D44728]' : 'bg-[#00D09C] hover:bg-[#00B386]'
                }`}
              >
                {selectedOption === 'cancel' ? 'Confirm Cancellation' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

