import Decimal from 'decimal.js';

export const EARLY_HISTORY_DAYS = 90;

// Configure Decimal for financial precision: round half away from zero (standard financial rounding)
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface ComputedReturnDetails {
  investedPaise: number;
  currentPaise: number;
  diffPaise: number;
  diffAmount: number; // in rupees
  diffAmountAbsolute: number; // in rupees, positive
  absoluteReturnAmount: number; // in rupees, signed
  percent: number; // e.g. -4.87
  percentAbsolute: number; // e.g. 4.87
  percentStr: string; // e.g. "-4.87%" or "+7.89%" or "0.00%"
  returnPercentStr: string; // alias identical to percentStr
  percentAbsoluteStr: string; // e.g. "4.87%"
  cardReturnStr: string; // e.g. "-₹97.30 (-4.87%)" or "+₹157.71 (+7.89%)"
  sentenceReturnStr: string; // e.g. "-₹97.30 (-4.87%)"
  isNegative: boolean;
  isZero: boolean;
}

/**
 * Calculates returns in integer paise using Decimal.js.
 * Percent = (current - invested) / invested * 100, rounded once to 2 decimals, half away from zero.
 */
export function computeConsistentReturns(investedAmount: number, currentValue: number): ComputedReturnDetails {
  const investedDec = new Decimal(investedAmount || 0);
  const currentDec = new Decimal(currentValue || 0);

  // Integer paise conversion
  const investedPaiseDec = investedDec.times(100).round();
  const currentPaiseDec = currentDec.times(100).round();
  const diffPaiseDec = currentPaiseDec.minus(investedPaiseDec);

  const diffAmountDec = diffPaiseDec.dividedBy(100);
  const diffAmount = diffAmountDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
  const diffAmountAbsolute = Math.abs(diffAmount);

  let percent = 0;
  if (!investedPaiseDec.isZero()) {
    percent = diffPaiseDec
      .dividedBy(investedPaiseDec)
      .times(100)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();
  }

  const percentAbsolute = Math.abs(percent);
  const isNegative = percent < 0;
  const isZero = percent === 0;

  const sign = isNegative ? '-' : isZero ? '' : '+';
  const percentStr = `${sign}${percentAbsolute.toFixed(2)}%`;
  const percentAbsoluteStr = `${percentAbsolute.toFixed(2)}%`;

  const formattedAmount = diffAmountAbsolute.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const cardReturnStr = isZero
    ? '₹0 (0.00%)'
    : `${sign}₹${formattedAmount} (${percentStr})`;

  const sentenceReturnStr = isZero
    ? '₹0.00 (0.00%)'
    : `${sign}₹${formattedAmount} (${percentStr})`;

  return {
    investedPaise: investedPaiseDec.toNumber(),
    currentPaise: currentPaiseDec.toNumber(),
    diffPaise: diffPaiseDec.toNumber(),
    diffAmount,
    diffAmountAbsolute,
    absoluteReturnAmount: diffAmount,
    percent,
    percentAbsolute,
    percentStr,
    returnPercentStr: percentStr,
    percentAbsoluteStr,
    cardReturnStr,
    sentenceReturnStr,
    isNegative,
    isZero,
  };
}

/**
 * Format currency amount with unified rounding.
 * - 'card': Groww UI style (e.g. ₹2,000 or ₹1,902.70)
 * - 'sentence': text description with 2 decimals (e.g. ₹2,000.00 or ₹1,902.70)
 */
export function formatRupees(
  amount: number,
  style: 'card' | 'sentence' = 'sentence',
  includeSymbol: boolean = true
): string {
  const dec = new Decimal(amount || 0).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
  const prefix = includeSymbol ? '₹' : '';
  if (style === 'card') {
    // If integer, omit decimals like Groww card; otherwise 2 decimals
    const isInt = Number.isInteger(dec);
    return prefix + dec.toLocaleString('en-IN', {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  return prefix + dec.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Checks whether an SIP is in "Early View" (< 90 days from first instalment date).
 */
export function isEarlyHistory(startDateStr: string, asOfDateStr: string = '2026-11-02'): boolean {
  try {
    const start = new Date(startDateStr);
    const asOf = new Date(asOfDateStr);
    const diffTime = asOf.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < EARLY_HISTORY_DAYS;
  } catch (e) {
    return false;
  }
}
