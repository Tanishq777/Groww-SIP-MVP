import { describe, it, expect } from 'vitest';
import { calculateUnits } from '../lib/calculators/units';
import { calculateInvestedTotal, calculateTotalUnits } from '../lib/calculators/invested';
import { calculateCurrentValue, calculateAbsoluteReturns } from '../lib/calculators/currentValue';
import { calculateAverageNavCost } from '../lib/calculators/averageCost';
import { calculateXirr } from '../lib/calculators/xirr';
import { calculateExpectedAllotmentDate } from '../lib/calculators/allotmentLag';
import { getBounceFeeDetails } from '../lib/calculators/fees';
import { computeFacts } from '../lib/calculators/facts';
import { Instalment, SIPItem } from '../lib/types';

describe('Deterministic Calculators', () => {
  it('calculateUnits computes correct units to 3 decimal places', () => {
    // ₹1000 / 52.456 = 19.06359... -> 19.064
    expect(calculateUnits(1000, 52.456)).toBe(19.064);
    expect(calculateUnits(100, 10)).toBe(10);
    expect(calculateUnits(0, 10)).toBe(0);
    expect(calculateUnits(100, 0)).toBe(0);
  });

  it('calculateInvestedTotal only counts successful instalments', () => {
    const instalments: Instalment[] = [
      { id: '1', instalmentNumber: 1, date: '2026-09-02', amount: 1000, status: 'successful', nav: 50, units: 20 },
      { id: '2', instalmentNumber: 2, date: '2026-10-02', amount: 1000, status: 'successful', nav: 52, units: 19.231 },
      { id: '3', instalmentNumber: 3, date: '2026-11-02', amount: 1000, status: 'pending_allotment' },
      { id: '4', instalmentNumber: 4, date: '2026-11-03', amount: 1000, status: 'bounced' },
      { id: '5', instalmentNumber: 5, date: '2026-11-04', amount: 1000, status: 'paused_by_user' },
    ];

    expect(calculateInvestedTotal(instalments)).toBe(2000);
    expect(calculateTotalUnits(instalments)).toBe(39.231);
  });

  it('calculateCurrentValue and returns handle positive and negative returns', () => {
    // Positive return
    const curValPositive = calculateCurrentValue(39.231, 55.00);
    expect(curValPositive).toBe(2157.71);
    const returnsPos = calculateAbsoluteReturns(2000, curValPositive);
    expect(returnsPos.amount).toBe(157.71);
    expect(returnsPos.percent).toBe(7.89);

    // Negative return (Scenario A)
    const curValNegative = calculateCurrentValue(20, 45.00); // invested 1000, current 900
    expect(curValNegative).toBe(900);
    const returnsNeg = calculateAbsoluteReturns(1000, curValNegative);
    expect(returnsNeg.amount).toBe(-100);
    expect(returnsNeg.percent).toBe(-10);
  });

  it('calculateAverageNavCost computes correct rupee-cost average', () => {
    expect(calculateAverageNavCost(2000, 39.231)).toBe(50.98);
    expect(calculateAverageNavCost(0, 0)).toBe(0);
  });

  it('calculateXirr handles short history and attaches honest notice', () => {
    const instalments: Instalment[] = [
      { id: '1', instalmentNumber: 1, date: '2026-09-02', amount: 1000, status: 'successful' },
      { id: '2', instalmentNumber: 2, date: '2026-10-02', amount: 1000, status: 'successful' },
    ];
    // Short history (<180 days)
    const result = calculateXirr(instalments, 2050, new Date('2026-11-02'));
    expect(result.isShortHistory).toBe(true);
    expect(result.reliabilityNotice).toBe('Short history, so this number swings a lot');
  });

  it('calculateExpectedAllotmentDate skips weekends for T+2 business days', () => {
    // Friday: 2026-10-30 -> Sat (skip), Sun (skip), Mon (Day 1), Tue (Day 2 -> 2026-11-03)
    const resFriday = calculateExpectedAllotmentDate('2026-10-30');
    expect(resFriday.expectedDateStr).toBe('2026-11-03');
    expect(resFriday.mockRuleNotice).toContain('Mock Rule');

    // Monday: 2026-11-02 -> Tue (Day 1), Wed (Day 2 -> 2026-11-04)
    const resMonday = calculateExpectedAllotmentDate('2026-11-02');
    expect(resMonday.expectedDateStr).toBe('2026-11-04');
  });

  it('getBounceFeeDetails attributes fee strictly to bank, never to Groww', () => {
    const fee = getBounceFeeDetails('HDFC Bank');
    expect(fee.feeAmount).toBe(250);
    expect(fee.growwFee).toBe(0);
    expect(fee.chargedBy).toContain('HDFC Bank');
    expect(fee.explanation).toContain('Groww charges ₹0');
  });

  it('computeFacts derives complete deterministic facts object', () => {
    const mockSIP: SIPItem = {
      id: 'sip-1',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 100,
      dayOfMonth: 2,
      nextDueDate: '2026-11-06',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      startDate: '2026-10-02',
      currentNav: 50.0,
      instalments: [
        { id: '1', instalmentNumber: 1, date: '2026-10-02', amount: 100, status: 'successful', nav: 50, units: 2 },
      ],
      navHistory: [{ date: '2026-10-02', nav: 50 }],
    };

    const facts = computeFacts(mockSIP, 'A', new Date('2026-11-02'));
    expect(facts.userName).toBe('T');
    expect(facts.fundName).toBe('Sample Flexi Cap Fund Direct Growth');
    expect(facts.totalInvestedAmount).toBe(100);
    expect(facts.totalUnitsAllotted).toBe(2);
    expect(facts.currentValue).toBe(100);
    expect(facts.daysUntilNextDebit).toBe(4);
  });
});

describe('Fix 1: Early View (<90 Days) Verification', () => {
  it('EARLY_HISTORY_DAYS is defined as 90', async () => {
    const { EARLY_HISTORY_DAYS } = await import('../lib/format');
    expect(EARLY_HISTORY_DAYS).toBe(90);
  });

  it('correctly classifies demo scenarios into early view or mature view', async () => {
    const { getScenarioData, SCENARIOS } = await import('../lib/mockData');
    
    // Scenarios under 90 days -> isEarlyView: true
    expect(getScenarioData('A').facts.isEarlyView).toBe(true); // 61 days
    expect(getScenarioData('B').facts.isEarlyView).toBe(true); // 0 days
    expect(getScenarioData('C').facts.isEarlyView).toBe(true); // 31 days
    expect(getScenarioData('D').facts.isEarlyView).toBe(true); // 57 days
    expect(getScenarioData('G').facts.isEarlyView).toBe(true); // 61 days

    // Scenarios past 90 days -> isEarlyView: false
    expect(getScenarioData('E').facts.isEarlyView).toBe(false); // 92 days
    expect(getScenarioData('F').facts.isEarlyView).toBe(false); // 273 days
  });
});

describe('Fix 2: One Source of Truth & Cross-Surface Numeric Consistency', () => {
  it('Scenario A returns round to -4.87% half away from zero in integer paise', async () => {
    const { computeConsistentReturns } = await import('../lib/format');
    const returns = computeConsistentReturns(2000.00, 1902.70);

    expect(returns.absoluteReturnAmount).toBe(-97.30);
    expect(returns.returnPercentStr).toBe('-4.87%');
    expect(returns.cardReturnStr).toBe('-₹97.30 (-4.87%)');
  });

  it('every demo scenario produces identical return percentage and rounded amounts across facts and formatting', async () => {
    const { getScenarioData, SCENARIOS } = await import('../lib/mockData');
    const { computeConsistentReturns } = await import('../lib/format');

    for (const scenarioId of Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[]) {
      const { facts } = getScenarioData(scenarioId);
      const computed = computeConsistentReturns(facts.totalInvestedAmount, facts.currentValueAmount);

      // Verify facts object exactly equals shared module computed return
      expect(facts.returnPercentStr).toBe(computed.returnPercentStr);
      expect(facts.cardReturnStr).toBe(computed.cardReturnStr);
      expect(facts.absoluteReturnAmount).toBe(computed.absoluteReturnAmount);
    }
  });

  it('fails if any UI component performs ad-hoc return percentage formatting', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const componentsDir = path.join(process.cwd(), 'components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
      // Must not contain ad-hoc manual percent calculations like "/ totalInvested * 100" or raw .toFixed(2) %
      expect(content).not.toMatch(/\/ (totalInvested|investedAmount|facts\.totalInvestedAmount) \* 100/);
      expect(content).not.toMatch(/\.toFixed\(2\)\s*\+\s*['"]%/);
    }
  });
});


