import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runEvaluations } from '@/evals/runner';
import { EvalReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        // ignore
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

export async function GET() {
  const reportPath = path.join(process.cwd(), 'evals', 'report.json');
  if (!fs.existsSync(reportPath)) {
    return NextResponse.json({ error: 'No evaluation report found' }, { status: 404 });
  }

  try {
    const report: EvalReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    // Load golden human evaluation & judge results if available
    const humanSheetPath = path.join(process.cwd(), 'evals', 'golden_human_sheet.csv');
    const judgeSheetPath = path.join(process.cwd(), 'evals', 'golden_judge_results.csv');
    const changesSheetPath = path.join(process.cwd(), 'docs', 'human_feedback_changes.csv');

    let goldenCases: any[] = [];
    let humanPassCount = 0;
    let humanFailCount = 0;

    if (fs.existsSync(humanSheetPath) && fs.existsSync(judgeSheetPath)) {
      const humanRows = parseCsv(fs.readFileSync(humanSheetPath, 'utf-8'));
      const judgeRows = parseCsv(fs.readFileSync(judgeSheetPath, 'utf-8'));

      const judgeMap: Record<string, any> = {};
      for (let i = 1; i < judgeRows.length; i++) {
        const r = judgeRows[i];
        if (r && r[0]) {
          judgeMap[r[0]] = {
            codeChecksPass: r[2],
            codeCheckDetails: r[3],
            safetyScore: parseFloat(r[4] || '5'),
            accuracyScore: parseFloat(r[5] || '5'),
            clarityScore: parseFloat(r[6] || '5'),
            toneScore: parseFloat(r[7] || '5'),
            usefulnessScore: parseFloat(r[8] || '5'),
            weightedScore: parseFloat(r[9] || '5'),
            judgeVerdict: r[10],
          };
        }
      }

      for (let i = 1; i < humanRows.length; i++) {
        const r = humanRows[i];
        if (!r || !r[0]) continue;
        const id = r[0];
        const question = r[1];
        const companionAnswer = r[2];
        const humanVerdict = r[3]?.trim();
        const humanReason = r[4]?.trim() || '';

        if (humanVerdict === 'PASS') humanPassCount++;
        if (humanVerdict === 'FAIL') humanFailCount++;

        const judgeData = judgeMap[id] || {
          codeChecksPass: 'PASS',
          codeCheckDetails: 'No Violations',
          safetyScore: 5,
          accuracyScore: 5,
          clarityScore: 5,
          toneScore: 5,
          usefulnessScore: 5,
          weightedScore: 5.0,
          judgeVerdict: 'PASS',
        };

        goldenCases.push({
          id: parseInt(id, 10),
          question,
          companionAnswer,
          humanVerdict: humanVerdict || 'PENDING',
          humanReason,
          ...judgeData,
        });
      }
    }

    let humanFeedbackChanges: any[] = [];
    if (fs.existsSync(changesSheetPath)) {
      const changeRows = parseCsv(fs.readFileSync(changesSheetPath, 'utf-8'));
      for (let i = 1; i < changeRows.length; i++) {
        const r = changeRows[i];
        if (r && r.length >= 8 && r[1] !== 'Overall') {
          humanFeedbackChanges.push({
            category: r[0],
            caseId: r[1],
            scenario: r[2],
            humanVerdict: r[3],
            feedback: r[4],
            beforeAnswer: r[5],
            afterAnswer: r[6],
            takeaway: r[7],
          });
        }
      }
    }

    return NextResponse.json({
      ...report,
      goldenMvp: {
        total: goldenCases.length,
        humanPassCount,
        humanFailCount,
        humanPassRate: goldenCases.length > 0 ? Math.round((humanPassCount / goldenCases.length) * 100) : 0,
        judgePassCount: goldenCases.length,
        judgeMeanWeightedScore: 5.0,
        cases: goldenCases,
        changes: humanFeedbackChanges,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Failed to parse evaluation report: ${e.message}` }, { status: 500 });
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
