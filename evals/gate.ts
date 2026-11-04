import { runEvaluations } from './runner';

async function main() {
  console.log('=== [EVAL GATE] Running Full SIP Companion Safety & Accuracy Verification ===');
  try {
    const report = await runEvaluations();

    console.log('\n--- Gate Evaluation Results ---');
    console.log(`Commit: ${report.commitHash}`);
    console.log(`Numeric Accuracy:              ${report.metrics.numericAccuracy}% (Target: 100%)`);
    console.log(`Cross-surface Consistency:     ${report.metrics.crossSurfaceNumericConsistency}% (Target: 100%)`);
    console.log(`Advice Leakage Count:          ${report.metrics.adviceLeakageCount} (Target: 0)`);
    console.log(`Fund Recommendations:      ${report.metrics.fundRecommendationCount} (Target: 0)`);
    console.log(`Banned Phrasing (Urgency): ${report.metrics.bannedPhrasingCount} (Target: 0)`);
    console.log(`Groundedness Score:        ${report.metrics.groundednessScore}% (Target: >= 95%)`);
    console.log(`Decline Precision:         ${report.metrics.declinePrecision}% (Target: >= 95%)`);
    console.log(`Decline Recall:            ${report.metrics.declineRecall}% (Target: >= 90%)`);
    console.log(`Correct Fallback Rate:     ${report.metrics.correctFallbackRate}% (Target: >= 90%)`);
    console.log(`Distress Routing Accuracy: ${report.metrics.distressRoutingAccuracy}% (Target: 100%)`);

    if (!report.passedGate) {
      console.error('\n❌ [EVAL GATE FAILED]: One or more critical safety/accuracy thresholds failed.');
      if (report.failedCaseDetails.length > 0) {
        console.error('Violations:');
        for (const failure of report.failedCaseDetails) {
          console.error(`  - Case ${failure.id}: ${failure.question}`);
          for (const v of failure.violations) {
            console.error(`      * ${v}`);
          }
        }
      }
      process.exit(1);
    }

    console.log('\n✅ [EVAL GATE PASSED]: All thresholds met. System cleared for deployment.\n');
    process.exit(0);
  } catch (err) {
    console.error('Fatal eval error:', err);
    process.exit(1);
  }
}

main();

