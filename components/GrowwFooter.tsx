import React from 'react';
import Link from 'next/link';

export function GrowwFooter() {
  return (
    <footer className="w-full bg-white border-t border-[#EBECEF] py-6 px-4 mt-auto">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#7C7E8C]">
        <p className="font-medium text-[#44475B]">
          Concept prototype for a case study. Not affiliated with Groww. Not investment advice.
        </p>

        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/evals" className="hover:text-[#00D09C] transition-colors">
            AI Evals & Gate Report
          </Link>
          <span>·</span>
          <Link href="/admin/logs" className="hover:text-[#00D09C] transition-colors">
            Mentor Logs (/admin/logs)
          </Link>
        </div>
      </div>
    </footer>
  );
}

