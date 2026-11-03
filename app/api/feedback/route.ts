import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AILogEntry } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { logId, vote, reason, comment } = await req.json();

    const logPath = path.join(process.cwd(), 'logs', 'ai_interactions.json');
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ success: true, message: 'Logged' });
    }

    const logs: AILogEntry[] = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
    const entry = logs.find(l => l.id === logId);

    if (entry) {
      entry.feedback = { vote, reason, comment };
      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}

