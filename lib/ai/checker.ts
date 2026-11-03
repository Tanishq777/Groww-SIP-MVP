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

export function runRuleChecker(
  answer: string,
  numbersUsed: (number | string)[],
  facts: DeterministicFacts
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

  // 6. Deterministic Arithmetic & Number Cross-Check
  // Extract all numbers from the answer text
  const extractedNumbers = answer.match(/\b\d+(\.\d+)?\b/g) || [];
  
  // Whitelist of valid numbers that don't need to match portfolio arithmetic
  const allowedConstantNumbers = new Set([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '30', '365', // Standard time units, months, days
    '100', // Floor ₹100
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
    Math.abs(facts.absoluteReturnPercent).toString(),
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
