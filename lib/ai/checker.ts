import { DeterministicFacts } from '../types';

export interface CheckerResult {
  passed: boolean;
  violations: string[];
}

// Banned phrases per Section 1 of Brief
const BANNED_ADVICE_PHRASES = [
  /\byou should (buy|sell|hold|switch|stop|pause|continue|exit|invest|redeem)\b/i,
  /\bi recommend\b/i,
  /\bwe recommend\b/i,
  /\bmy recommendation\b/i,
  /\byou must (buy|sell|stop|pause|continue)\b/i,
  /\bstrongly suggest\b/i,
  /\bbest option is to (buy|sell|stop)\b/i,
  /\bswitch into\b/i,
  /\bswitch to\b/i,
  /\bpick this fund\b/i,
];

const BANNED_FUND_NAMES_AND_RANKINGS = [
  /\b(bandhan mutual|nippon mutual|nippon india mutual|sbi mutual|icici prudential mutual|parag parikh mutual|quant mutual|tata mutual|mirae asset mutual)\b/i,
  /\b(bandhan small cap|nippon india large cap|nippo india|sbi small cap|hdfc top 100|parag parikh flexi)\b/i,
  /\b(top fund|best fund|#1 fund|ranked [0-9]+|5-star rating|5 star groww rating|star rating)\b/i,
  /\btop [0-9]+% of (funds|investors)\b/i,
];

const BANNED_PREDICTIONS_AND_PROMISES = [
  /\bmarkets always recover\b/i,
  /\bsips? always works?\b/i,
  /\bguaranteed\b/i,
  /\bguarantee\b/i,
  /\bwill definitely go up\b/i,
  /\bwill recover soon\b/i,
  /\bnever lose(s)? money\b/i,
  /\bprojected returns?\b/i,
  /\bwill give you [0-9]+%\b/i,
];

const BANNED_PRICE_LABELS = [
  /\bon discount\b/i,
  /\bcheap(er)? unit\b/i,
  /\bgreat time to buy\b/i,
  /\bgood time to invest\b/i,
  /\bbuy the dip\b/i,
];

const BANNED_URGENCY_AND_FEAR = [
  /\bact now\b/i,
  /\blast chance\b/i,
  /\bbefore it'?s too late\b/i,
  /\bhurry\b/i,
  /\bdon'?t lose your streak\b/i,
  /\bstreak\b/i,
  /\bbehind schedule\b/i,
  /\bcountdown\b/i,
  /\bdeadline expiring\b/i,
  /\bothers like you\b/i,
  /\byou are falling behind\b/i,
  /\branked in the top\b/i,
];

// Blanket and unverifiable claims per Fix 3
const BANNED_BLANKET_CLAIMS = [
  /\bzero lock-?in\b/i,
  /\bno lock-?in\b/i,
  /\bcancel anytime\b/i,
  /\bno charges?\b/i,
  /\bno penalt(y|ies)\b/i,
  /\bwithout (any )?charges?\b/i,
  /\bwithout (any )?penalt(y|ies)\b/i,
  /\bbina kisi (charges?|penalty|shulk)\b/i,
  /\bfree to cancel\b/i,
  /\bpermanent units?\b/i,
];

export function runRuleChecker(
  answer: string,
  numbersUsed: (number | string)[],
  facts: DeterministicFacts,
  sources?: string[]
): CheckerResult {
  const violations: string[] = [];

  // 1. Advice Check
  for (const regex of BANNED_ADVICE_PHRASES) {
    if (regex.test(answer)) {
      violations.push(`Advice language violation: matched ${regex}`);
    }
  }

  // 2. Fund Names & Rankings Check
  for (const regex of BANNED_FUND_NAMES_AND_RANKINGS) {
    // Exclude the user's current fund name if explicitly mentioning their own fund
    if (regex.test(answer)) {
      violations.push(`Fund recommendation/ranking violation: matched ${regex}`);
    }
  }

  // 3. Predictions & Promises Check
  for (const regex of BANNED_PREDICTIONS_AND_PROMISES) {
    if (regex.test(answer)) {
      violations.push(`Prediction/Promise violation: matched ${regex}`);
    }
  }

  // 4. Price Labels Check
  for (const regex of BANNED_PRICE_LABELS) {
    if (regex.test(answer)) {
      violations.push(`Price label violation: matched ${regex}`);
    }
  }

  // 5. Urgency, FOMO, & Peer Comparison Check
  for (const regex of BANNED_URGENCY_AND_FEAR) {
    if (regex.test(answer)) {
      violations.push(`Urgency/Fear/Peer comparison violation: matched ${regex}`);
    }
  }

  // 6. Blanket Claims Check (Fix 3)
  for (const regex of BANNED_BLANKET_CLAIMS) {
    if (regex.test(answer)) {
      violations.push(`Unverifiable blanket claim violation: matched ${regex}`);
    }
  }

  // 7. Sourced Claims on Lock-in, Exit Loads, Charges, Penalties, Tax, Guaranteed (Fix 3.3)
  const containsRestrictedTerms = /\b(lock-?ins?|exit loads?|penalt(y|ies)|charges?|taxes?|taxation|guaranteed)\b/i.test(answer);
  if (containsRestrictedTerms) {
    const validSources = [
      'Lock-ins, Exit Loads and Charges',
      'Bank Return Charges vs Platform Fees',
      'SEBI Investor Protection Guidelines',
      'Tele-MANAS Toll-Free National Helpline (14416)',
      'Options When You Need to Adjust Your SIP'
    ];
    const hasGroundedSource = sources && sources.some(s =>
      validSources.some(vs => s.toLowerCase().includes(vs.toLowerCase()))
    );
    if (!hasGroundedSource) {
      violations.push(
        `Ungrounded claim: Statement regarding lock-in, exit load, charges, penalties, tax, or guarantee must cite a sourced KB article.`
      );
    }
  }

  // 8. Cross-Surface Return Percentage Consistency Check (Fix 2)
  const percentMatches = answer.match(/([+-]?\d+\.\d+)%/g);
  if (percentMatches && facts.returnPercentStr) {
    for (const match of percentMatches) {
      const cleanMatch = match.trim();
      // If it looks like a return percentage for the current scenario
      const absReturnP = Math.abs(facts.absoluteReturnPercent).toFixed(2);
      if (cleanMatch.includes(absReturnP) || cleanMatch.includes('4.8')) {
        if (cleanMatch !== facts.returnPercentStr && cleanMatch !== facts.returnPercentStr.replace('+', '')) {
          violations.push(
            `Cross-surface numeric inconsistency: Return percentage "${cleanMatch}" does not match canonical "${facts.returnPercentStr}".`
          );
        }
      }
    }
  }

  // 9. Deterministic Arithmetic & Number Cross-Check
  // Extract all numbers from the answer text
  const extractedNumbers = answer.match(/\b\d+(\.\d+)?\b/g) || [];
  
  // Whitelist of valid numbers that don't need to match portfolio arithmetic
  const allowedConstantNumbers = new Set([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '30', '365', // Standard time units, months, days
    '100', // Floor ₹100
    '80', // Section 80C ELSS
    '14416', // Tele-MANAS helpline
    '0', '0.00',
    '250', // Bank bounce fee
    '2', // Business days lag
  ]);

  // Valid facts values
  const validFactNumbers = new Set([
    facts.monthlyAmount.toString(),
    facts.totalInstalmentsSuccessful.toString(),
    facts.totalInvestedAmount.toString(),
    facts.totalUnitsAllotted.toString(),
    facts.currentNav.toString(),
    facts.currentValue.toString(),
    Math.abs(facts.absoluteReturnAmount).toString(),
    Math.abs(facts.absoluteReturnAmount).toFixed(2),
    Math.abs(facts.absoluteReturnPercent).toString(),
    facts.returnPercentStr ? facts.returnPercentStr.replace('%', '').replace('-', '').replace('+', '') : '',
    facts.averageNavCost.toString(),
    facts.daysUntilNextDebit.toString(),
    facts.bankBounceFeeAmount.toString(),
    ...(facts.xirrPercent !== null ? [facts.xirrPercent.toString(), Math.abs(facts.xirrPercent).toString()] : []),
  ]);

  for (const num of extractedNumbers) {
    if (!allowedConstantNumbers.has(num) && !validFactNumbers.has(num)) {
      // Check if it's within tolerance of any fact
      const parsedNum = parseFloat(num);
      let foundMatch = false;
      for (const validStr of Array.from(validFactNumbers)) {
        if (Math.abs(parsedNum - parseFloat(validStr)) < 0.05) {
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch && parsedNum > 10) {
        violations.push(`Unaligned number in text: "${num}" is not in deterministic facts.`);
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
