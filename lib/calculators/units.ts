/**
 * Deterministic Units Calculator
 * Units allotted = instalment amount / NAV on allotment date
 * Precision: 3 decimal places (standard mutual fund convention in India)
 */
export function calculateUnits(amount: number, nav: number): number {
  if (nav <= 0 || amount <= 0) return 0;
  const rawUnits = amount / nav;
  return Math.round(rawUnits * 1000) / 1000;
}

