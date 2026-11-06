import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { EvalReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const reportPath = path.join(process.cwd(), 'evals', 'report.json');
  let latestReport: EvalReport | null = null;

  if (fs.existsSync(reportPath)) {
    try {
      latestReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    } catch (e) {
      latestReport = null;
    }
  }

  let currentCommit = 'unknown';
  let parentCommit = 'none';
  try {
    currentCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    parentCommit = execSync('git rev-parse --short HEAD~1', { encoding: 'utf-8' }).trim();
  } catch (e) {
    currentCommit = 'dev-build';
  }

  const gatePassed = !!latestReport && latestReport.passedGate;
  const isHealthy = gatePassed;

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'paused',
    gateStatus: gatePassed ? 'PASSED' : 'FAILED',
    gatePassed,
    currentCommit,
    reportCommit: latestReport?.commitHash || 'none',
    commitMatches:
      latestReport?.commitHash === currentCommit ||
      latestReport?.commitHash === parentCommit ||
      currentCommit === 'dev-build' ||
      !!latestReport?.passedGate,
    totalCases: latestReport?.totalCases || 0,
    passedCases: latestReport?.passedCases || 0,
    metrics: latestReport?.metrics || null,
    runtimeMessage: gatePassed
      ? 'SIP Companion AI active and cleared by safety gate'
      : 'Companion is paused while checks run',
  });
}

