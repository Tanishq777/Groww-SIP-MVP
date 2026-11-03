'use client';

import React from 'react';
import { MousePointer } from 'lucide-react';

interface EmptyRightPanelProps {
  onActivateCompanion?: () => void;
}

export function EmptyRightPanel({ onActivateCompanion }: EmptyRightPanelProps) {
  return (
    <div
      onClick={onActivateCompanion}
      className="bg-white border border-[#EBECEF] rounded-2xl min-h-[460px] h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer group hover:border-[#CFD3D9] transition-all shadow-sm"
    >
      {/* 3-Box Illustration strictly matching the screenshot */}
      <div className="w-56 mb-8 flex flex-col items-center gap-3">
        {/* Top Box: Outlined */}
        <div className="w-40 h-10 rounded-lg border-2 border-[#CBD5E1] bg-white group-hover:border-[#94A3B8] transition-colors"></div>

        {/* Middle Box: Mint Green Filled with Pointer Cursor */}
        <div className="w-48 h-12 rounded-lg bg-[#23E3A6] shadow-sm relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
          {/* Arrow Cursor positioned on the bottom right of middle box */}
          <div className="absolute -bottom-2 -right-2 transform rotate-[-20deg]">
            <svg
              className="w-6 h-6 text-[#1E222B] drop-shadow-md"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.439v-20.56z" />
            </svg>
          </div>
        </div>

        {/* Bottom Box: Outlined */}
        <div className="w-40 h-10 rounded-lg border-2 border-[#CBD5E1] bg-white group-hover:border-[#94A3B8] transition-colors"></div>
      </div>

      <p className="text-[15px] font-medium text-[#44475B] group-hover:text-[#1E222B] transition-colors">
        Select a fund to view investing options
      </p>

      <p className="text-[12px] text-[#7C7E8C] mt-2 group-hover:text-[#00D09C] transition-colors">
        (Or tap here to launch <span className="font-semibold text-[#00D09C]">SIP Companion AI</span>)
      </p>
    </div>
  );
}

