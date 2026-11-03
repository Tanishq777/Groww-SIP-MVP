import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateCompanionResponse } from '@/lib/ai/generator';
import { getScenarioData } from '@/lib/mockData';
import { EvalReport, ScenarioId } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory rate limiting: IP -> [timestamp]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(req: NextRequest) {
  // 1. Eval Gate Check
  const reportPath = path.join(process.cwd(), 'evals', 'report.json');
  let gatePassed = false;
  if (fs.existsSync(reportPath)) {
    try {
      const report: EvalReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      gatePassed = report.passedGate;
    } catch (e) {
      gatePassed = false;
    }
  }

  if (!gatePassed) {
    return NextResponse.json(
      { error: 'Companion is paused while checks run' },
      { status: 503 }
    );
  }

  // 2. Rate Limiting Check
  const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before asking again.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { question, scenarioId = 'A', preferredLanguage } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

    const { facts } = getScenarioData(scenarioId as ScenarioId);

    const response = await generateCompanionResponse({
      question,
      facts,
      preferredLanguage,
    });

    return NextResponse.json({
      success: true,
      data: response,
      disclaimer: 'Educational information, not investment advice. AI can make mistakes.',
    });
  } catch (err: any) {
    console.error('Error generating companion response:', err);
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}

