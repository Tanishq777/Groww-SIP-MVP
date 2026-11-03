/**
 * Deterministic Current Value & Absolute Returns Calculator
 * Current Value = Total Units * Current NAV
 * Absolute Return Amount = Current Value - Invested Amount
 * Absolute Return Percent = (Absolute Return Amount / Invested Amount) * 100
 */
export function calculateCurrentValue(totalUnits: number, currentNav: number): number {
  if (totalUnits <= 0 || currentNav <= 0) return 0;
  return Math.round(totalUnits * currentNav * 100) / 100;
}

export function calculateAbsoluteReturns(investedAmount: number, currentValue: number): {
  amount: number;
  percent: number;
} {
  if (investedAmount <= 0) {
    return { amount: 0, percent: 0 };
  }
  const amount = Math.round((currentValue - investedAmount) * 100) / 100;
  const percent = Math.round(((currentValue - investedAmount) / investedAmount) * 10000) / 100;
  return { amount, percent };
}

