'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Smartphone, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, FileText } from 'lucide-react';

interface ImportFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function ImportFundsModal({ isOpen, onClose, userName = 'T' }: ImportFundsModalProps) {
  const [activeMode, setActiveMode] = useState<'otp' | 'upload'>('otp');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [isSimulating, setIsSimulating] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success'>('idle');

  if (!isOpen) return null;

  function handleSimulateImport() {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setImportStatus('success');
    }, 1200);
  }

  function handleReset() {
    setImportStatus('idle');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EBECEF] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7C7E8C] hover:text-[#1E222B] hover:bg-[#F4F6F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {importStatus === 'success' ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#E6FAF5] text-[#00D09C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1E222B]">External Folios Synchronized</h3>
            <p className="text-xs text-[#7C7E8C] leading-relaxed max-w-sm mx-auto">
              All external mutual fund folios registered under PAN <strong className="text-[#1E222B]">{panNumber}</strong> are already consolidated with your active SIP Companion dashboard.
            </p>
            <div className="bg-[#F9FAFB] border border-[#EBECEF] rounded-xl p-3 max-w-sm mx-auto text-left text-[11px] text-[#44475B] space-y-1">
              <p className="font-semibold text-[#1E222B]">Synced Registries:</p>
              <p>• CAMS Consolidated Account Statement (CAS)</p>
              <p>• KFintech / MFCentral Mutual Fund Registry</p>
              <p>• SIP Companion tracking enabled on active folios</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 rounded-xl bg-[#00D09C] text-white text-xs font-semibold hover:bg-[#00B386] transition-colors"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6FAF5] text-[#00D09C] text-[11px] font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Track All Mutual Funds in One Place</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E222B]">Import External Funds</h3>
              <p className="text-xs text-[#7C7E8C] mt-1 leading-relaxed">
                Import mutual funds purchased through other platforms (Zerodha Coin, Kuvera, Paytm Money, Banks, or direct AMC folios) to track total portfolio performance with SIP Companion.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="flex border border-[#EBECEF] rounded-xl p-1 bg-[#F9FAFB]">
              <button
                onClick={() => setActiveMode('otp')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeMode === 'otp'
                    ? 'bg-white text-[#1E222B] shadow-sm'
                    : 'text-[#7C7E8C] hover:text-[#1E222B]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Auto-Fetch via OTP</span>
              </button>
              <button
                onClick={() => setActiveMode('upload')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeMode === 'upload'
                    ? 'bg-white text-[#1E222B] shadow-sm'
                    : 'text-[#7C7E8C] hover:text-[#1E222B]'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload CAS Statement</span>
              </button>
            </div>

            {activeMode === 'otp' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-[#7C7E8C] font-semibold uppercase tracking-wider">
                    Registered Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EBECEF] rounded-xl text-xs font-semibold text-[#1E222B] mt-1 bg-white focus:outline-none focus:border-[#00D09C]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7C7E8C] font-semibold uppercase tracking-wider">
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EBECEF] rounded-xl text-xs font-semibold text-[#1E222B] mt-1 bg-white uppercase focus:outline-none focus:border-[#00D09C]"
                  />
                </div>
                <p className="text-[11px] text-[#7C7E8C]">
                  An OTP will be sent by CAMS / KFintech to authorize fetching your Consolidated Account Statement (CAS).
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#CFD3D9] rounded-xl p-6 text-center space-y-2 bg-[#F9FAFB]">
                <FileText className="w-8 h-8 text-[#7C7E8C] mx-auto" />
                <p className="text-xs font-bold text-[#1E222B]">Drop your CAS PDF statement here</p>
                <p className="text-[11px] text-[#7C7E8C]">
                  Download your eCAS statement from CAMS Online or MFCentral and upload it here.
                </p>
              </div>
            )}

            {/* Action CTA */}
            <div className="pt-2 border-t border-[#F1F3F6]">
              <button
                onClick={handleSimulateImport}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-xl bg-[#00D09C] hover:bg-[#00B386] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to CAMS / KFintech Registry...</span>
                  </>
                ) : (
                  <>
                    <span>Simulate External CAS Import</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-[#7C7E8C] text-center mt-2">
                Concept prototype for case study. External CAS import is simulated for mock user '{userName}'.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
