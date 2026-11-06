import { DeterministicFacts, ScenarioId, SIPItem } from '../types';
import { calculateInvestedTotal, calculateTotalUnits } from './invested';
import { calculateCurrentValue, calculateAbsoluteReturns } from './currentValue';
import { calculateAverageNavCost } from './averageCost';
import { calculateXirr } from './xirr';
import { calculateExpectedAllotmentDate } from './allotmentLag';
import { getBounceFeeDetails } from './fees';
import { isEarlyHistory, computeOneDayReturns } from '../format';

export function computeFacts(sip: SIPItem, scenarioId: ScenarioId, asOfDate: Date = new Date('2026-11-02')): DeterministicFacts {
  const investedAmount = calculateInvestedTotal(sip.instalments);
  const totalUnits = calculateTotalUnits(sip.instalments);
  const curValue = calculateCurrentValue(totalUnits, sip.currentNav);
  const returns = calculateAbsoluteReturns(investedAmount, curValue);
  const oneDayReturn = computeOneDayReturns(totalUnits, sip.currentNav, sip.previousNav);
  const avgCost = calculateAverageNavCost(investedAmount, totalUnits);
  
  const xirrResult = calculateXirr(sip.instalments, curValue, asOfDate);

  const successfulCount = sip.instalments.filter(i => i.status === 'successful').length;
  const pausedCount = sip.instalments.filter(i => i.status === 'paused_by_user').length;
  const pendingInstalments = sip.instalments.filter(i => i.status === 'pending_allotment');
  const bouncedInstalments = sip.instalments.filter(i => i.status === 'bounced');

  const pendingAmount = pendingInstalments.reduce((sum, i) => sum + i.amount, 0);
  
  // Pending units estimate using current NAV
  const pendingUnits = pendingAmount > 0 && sip.currentNav > 0 
    ? Math.round((pendingAmount / sip.currentNav) * 1000) / 1000 
    : 0;

  // Expected allotment date
  let expectedAllotmentDate: string | undefined;
  if (pendingInstalments.length > 0 && pendingInstalments[0].debitDate) {
    const lag = calculateExpectedAllotmentDate(pendingInstalments[0].debitDate);
    expectedAllotmentDate = lag.expectedDateStr;
  }

  // Bank bounce fee
  let bankBounceFeeAmount = 0;
  let bankBounceFeeChargedBy = 'None';
  if (bouncedInstalments.length > 0) {
    const feeInfo = getBounceFeeDetails(sip.mandateBank);
    bankBounceFeeAmount = feeInfo.feeAmount;
    bankBounceFeeChargedBy = feeInfo.chargedBy;
  }

  // Days until next debit
  const nextDue = new Date(sip.nextDueDate);
  const diffTime = nextDue.getTime() - asOfDate.getTime();
  const daysUntilNextDebit = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const asOfDateStr = asOfDate.toISOString().slice(0, 10);
  const isEarly = isEarlyHistory(sip.startDate, asOfDateStr);

  return {
    scenarioId,
    userName: 'T',
    fundName: sip.fundName,
    monthlyAmount: sip.amount,
    totalInstalmentsAttempted: sip.instalments.length,
    totalInstalmentsSuccessful: successfulCount,
    totalInvestedAmount: investedAmount,
    totalUnitsAllotted: totalUnits,
    currentNav: sip.currentNav,
    previousNav: sip.previousNav,
    currentValue: curValue,
    currentValueAmount: curValue,
    absoluteReturnAmount: returns.amount,
    absoluteReturnPercent: returns.percent,
    returnPercentStr: returns.percentStr,
    cardReturnStr: returns.cardReturnStr,
    oneDayReturnStr: oneDayReturn.str,
    oneDayReturnAmount: oneDayReturn.amount,
    oneDayReturnPercent: oneDayReturn.percent,
    oneDayReturnIsNegative: oneDayReturn.isNegative,
    isEarlyView: isEarly,
    averageNavCost: avgCost,
    xirrPercent: xirrResult.xirrPercent,
    xirrReliabilityNotice: xirrResult.reliabilityNotice,
    latestInstalmentStatus: sip.instalments.length > 0 
      ? sip.instalments[sip.instalments.length - 1].status 
      : 'scheduled',
    unitsPendingAllotment: pendingUnits,
    pendingAmount,
    expectedAllotmentDate,
    bankBounceFeeAmount,
    bankBounceFeeChargedBy,
    nextDueDate: sip.nextDueDate,
    daysUntilNextDebit,
    mandateStatus: sip.mandateStatus,
    tenureMonths: sip.instalments.length,
    pausedInstalmentsCount: pausedCount,
    restingInstalmentsCount: pausedCount,
  };
}
