/**
 * Deterministic Average NAV Cost Calculator (Rupee-Cost Averaging)
 * Weighted average cost per unit = Total Invested Amount / Total Units Allotted
 */
export function calculateAverageNavCost(investedAmount: number, totalUnits: number): number {
  if (totalUnits <= 0 || investedAmount <= 0) return 0;
  return Math.round((investedAmount / totalUnits) * 100) / 100;
}

