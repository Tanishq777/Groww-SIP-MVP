import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runEvaluations } from '@/evals/runner';
import { EvalReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const reportPath = path.join(process.cwd(), 'evals', 'report.json');
  if (!fs.existsSync(reportPath)) {
    return NextResponse.json({ error: 'No evaluation report found' }, { status: 404 });
  }

  try {
    const report: EvalReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to parse evaluation report' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const report = await runEvaluations();
    return NextResponse.json({ success: true, report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

