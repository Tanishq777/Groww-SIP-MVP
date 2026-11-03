import { Instalment } from '../types';

/**
 * Deterministic Invested Amount Calculator
 * Sum of all instalments with status === 'successful'.
 * Pending allotment, bounced, and paused instalments are strictly excluded.
 */
export function calculateInvestedTotal(instalments: Instalment[]): number {
  return instalments
    .filter(i => i.status === 'successful')
    .reduce((sum, i) => sum + i.amount, 0);
}

/**
 * Total units across all successful instalments
 */
export function calculateTotalUnits(instalments: Instalment[]): number {
  const sumUnits = instalments
    .filter(i => i.status === 'successful')
    .reduce((sum, i) => sum + (i.units || 0), 0);
  return Math.round(sumUnits * 1000) / 1000;
}

