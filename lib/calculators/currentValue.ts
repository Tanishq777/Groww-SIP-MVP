import { computeConsistentReturns } from '../format';

/**
 * Deterministic Current Value & Absolute Returns Calculator
 * Current Value = Total Units * Current NAV
 * All return calculations delegate to the single source of truth in lib/format.ts.
 */
export function calculateCurrentValue(totalUnits: number, currentNav: number): number {
  if (totalUnits <= 0 || currentNav <= 0) return 0;
  return Math.round(totalUnits * currentNav * 100) / 100;
}

export function calculateAbsoluteReturns(investedAmount: number, currentValue: number): {
  amount: number;
  percent: number;
  percentStr: string;
  cardReturnStr: string;
} {
  const returns = computeConsistentReturns(investedAmount, currentValue);
  return {
    amount: returns.diffAmount,
    percent: returns.percent,
    percentStr: returns.percentStr,
    cardReturnStr: returns.cardReturnStr,
  };
}
