import { Instalment } from '../types';

export interface CashFlow {
  date: Date;
  amount: number; // negative for investment outflows, positive for current portfolio value
}

/**
 * Deterministic XIRR Calculator using Newton-Raphson Method
 * 
 * Formula:
 * NPV(r) = sum( C_i / (1 + r)^((d_i - d_0) / 365) ) = 0
 */
export function calculateXirr(
  instalments: Instalment[],
  currentValue: number,
  asOfDate: Date = new Date()
): {
  xirrPercent: number | null;
  reliabilityNotice?: string;
  isShortHistory: boolean;
} {
  const successful = instalments.filter(i => i.status === 'successful');
  
  if (successful.length === 0 || currentValue <= 0) {
    return {
      xirrPercent: null,
      reliabilityNotice: 'No completed instalments to calculate XIRR.',
      isShortHistory: true,
    };
  }

  // Construct cash flow stream
  const cashFlows: CashFlow[] = successful.map(i => ({
    date: new Date(i.date),
    amount: -Math.abs(i.amount), // Outflow is negative
  }));

  // Append current valuation as positive inflow
  cashFlows.push({
    date: asOfDate,
    amount: currentValue,
  });

  // Sort chronologically
  cashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());

  const d0 = cashFlows[0].date.getTime();
  const totalDays = (cashFlows[cashFlows.length - 1].date.getTime() - d0) / (1000 * 60 * 60 * 24);
  const isShortHistory = totalDays < 180 || successful.length < 3;

  const reliabilityNotice = isShortHistory
    ? 'Short history, so this number swings a lot'
    : undefined;

  // Newton-Raphson solver
  let rate = 0.1; // initial guess 10%
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = 0;
    let dNpv = 0;

    for (const cf of cashFlows) {
      const t = (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24 * 365);
      const discount = Math.pow(1 + rate, t);

      if (discount === 0 || isNaN(discount)) break;

      npv += cf.amount / discount;
      if (rate !== -1) {
        dNpv -= (t * cf.amount) / (discount * (1 + rate));
      }
    }

    if (Math.abs(npv) < tolerance) {
      const percent = Math.round(rate * 10000) / 100;
      return {
        xirrPercent: percent,
        reliabilityNotice,
        isShortHistory,
      };
    }

    if (Math.abs(dNpv) < 1e-12) {
      break;
    }

    const newRate = rate - npv / dNpv;
    if (isNaN(newRate) || !isFinite(newRate) || newRate <= -1) {
      break;
    }

    if (Math.abs(newRate - rate) < tolerance) {
      const percent = Math.round(newRate * 10000) / 100;
      return {
        xirrPercent: percent,
        reliabilityNotice,
        isShortHistory,
      };
    }

    rate = newRate;
  }

  // If Newton-Raphson didn't converge or extreme rate
  return {
    xirrPercent: null,
    reliabilityNotice: 'XIRR requires more stable history to calculate accurately.',
    isShortHistory: true,
  };
}

