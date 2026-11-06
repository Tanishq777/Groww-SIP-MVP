import { ScenarioId, SIPItem, DeterministicFacts } from './types';
import { computeFacts } from './calculators/facts';

export interface ScenarioDefinition {
  id: ScenarioId;
  label: string;
  shortDescription: string;
  badgeText: string;
  sip: SIPItem;
  asOfDate: string; // ISO date
  suggestedPrompts: string[];
  bannerNotice?: {
    type: 'info' | 'warning' | 'alert';
    title: string;
    message: string;
    actionLabel?: string;
    actionType?: 'explain' | 'move_date' | 'reschedule';
  };
}

export const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  A: {
    id: 'A',
    label: 'Scenario A · Month 2 (Red Number)',
    shortDescription: 'Current value below invested amount in month 2',
    badgeText: 'Month 2 · Negative Returns',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'Why is my current value less than what I put in?',
      'Is my money disappearing?',
      'Explain my numbers',
      'Should I stop my SIP right now?'
    ],
    bannerNotice: {
      type: 'warning',
      title: 'Current value is ₹1,902.70 against ₹2,000 invested',
      message: 'Short-term market price shifts change NAV day-to-day. Your units remain credited to your account.',
      actionLabel: 'Explain this number',
      actionType: 'explain'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 15000,
      sipName: 'Long-term Wealth Builder',
      sipIntentWhy: 'Building an emergency cushion and long-term discipline',
      startDate: '2026-09-02',
      currentNav: 48.50,
      previousNav: 48.80,
      instalments: [
        {
          id: 'inst-1',
          instalmentNumber: 1,
          date: '2026-09-02',
          amount: 1000,
          status: 'successful',
          nav: 50.00,
          units: 20.000,
          debitDate: '2026-09-02',
          allotmentDate: '2026-09-04',
        },
        {
          id: 'inst-2',
          instalmentNumber: 2,
          date: '2026-10-02',
          amount: 1000,
          status: 'successful',
          nav: 52.00,
          units: 19.231,
          debitDate: '2026-10-02',
          allotmentDate: '2026-10-04',
        },
      ],
      navHistory: [
        { date: '2026-09-02', nav: 50.00 },
        { date: '2026-09-15', nav: 51.20 },
        { date: '2026-10-02', nav: 52.00 },
        { date: '2026-10-20', nav: 49.80 },
        { date: '2026-11-02', nav: 48.50 },
      ],
    },
  },

  B: {
    id: 'B',
    label: 'Scenario B · First Debit (Lag)',
    shortDescription: 'First instalment debited, units not yet allotted (T+2 lag)',
    badgeText: 'Month 1 · Units Pending Allotment',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'Money was debited from my bank but units are 0. Where is my money?',
      'When will my units show up?',
      'Why is my current investment ₹0?',
      'Did Groww take my money?'
    ],
    bannerNotice: {
      type: 'info',
      title: '₹100 debited today · Units allotment in progress',
      message: 'Bank debit successful. Mutual fund units are allotted in 2 business days (expected by 04 Nov 2026).',
      actionLabel: 'Explain allotment lag',
      actionType: 'explain'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 100,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'in_progress',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'My First SIP',
      sipIntentWhy: 'Disciplined monthly savings habit',
      startDate: '2026-11-02',
      currentNav: 50.00,
      previousNav: 50.00,
      instalments: [
        {
          id: 'inst-b1',
          instalmentNumber: 1,
          date: '2026-11-02',
          amount: 100,
          status: 'pending_allotment',
          debitDate: '2026-11-02',
          notes: 'Bank debit confirmed on 2026-11-02. Unit allotment awaiting exchange clearing.',
        },
      ],
      navHistory: [
        { date: '2026-11-02', nav: 50.00 },
      ],
    },
  },

  C: {
    id: 'C',
    label: 'Scenario C · Bounced Debit (Bank Fee)',
    shortDescription: 'Debit bounced and bank fee charged (clarified as bank fee, not Groww)',
    badgeText: 'Debit Bounced · Bank Fee Charged',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'Why was I charged ₹250? Did Groww fine me?',
      'My debit failed, what should I do now?',
      'Will Groww try to debit again tomorrow?',
      'Can I change my debit date to after my salary?'
    ],
    bannerNotice: {
      type: 'alert',
      title: 'Debit bounced on 02 Nov · ₹250 bank fee charged',
      message: 'Your bank (HDFC Bank) charged a ₹250 NACH return fee. Groww charges ₹0. We will not auto-retry.',
      actionLabel: 'Reschedule or Pay Now',
      actionType: 'reschedule'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'Discipline Fund',
      sipIntentWhy: 'Financial independence fund',
      startDate: '2026-10-02',
      currentNav: 52.00,
      previousNav: 51.50,
      instalments: [
        {
          id: 'inst-c1',
          instalmentNumber: 1,
          date: '2026-10-02',
          amount: 1000,
          status: 'successful',
          nav: 50.00,
          units: 20.000,
          debitDate: '2026-10-02',
          allotmentDate: '2026-10-04',
        },
        {
          id: 'inst-c2',
          instalmentNumber: 2,
          date: '2026-11-02',
          amount: 1000,
          status: 'bounced',
          debitDate: '2026-11-02',
          bankFee: 250,
          notes: 'NACH debit returned by HDFC Bank due to insufficient balance.',
        },
      ],
      navHistory: [
        { date: '2026-10-02', nav: 50.00 },
        { date: '2026-11-02', nav: 52.00 },
      ],
    },
  },

  D: {
    id: 'D',
    label: 'Scenario D · Salary Late (Pre-Debit 4d)',
    shortDescription: 'Salary delayed, debit due in 4 days (PRE_DEBIT_LEAD_DAYS = 4)',
    badgeText: 'Pre-debit Lead (4 days to due date)',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'My salary is coming late this month, what can I do?',
      'How do I move my SIP date to the 10th?',
      'What happens if there is no balance on debit day?',
      'Can I pause for one month?'
    ],
    bannerNotice: {
      type: 'info',
      title: 'Upcoming debit: ₹1,000 on 06 Nov 2026 (in 4 days)',
      message: 'If your salary arrives after the 6th, you can move your debit date now to prevent bank return fees.',
      actionLabel: 'Move Debit Date',
      actionType: 'move_date'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 6,
      nextDueDate: '2026-11-06',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'Early Career Savings',
      sipIntentWhy: 'Saving before spending',
      startDate: '2026-09-06',
      currentNav: 51.50,
      previousNav: 51.20,
      instalments: [
        {
          id: 'inst-d1',
          instalmentNumber: 1,
          date: '2026-09-06',
          amount: 1000,
          status: 'successful',
          nav: 50.00,
          units: 20.000,
          debitDate: '2026-09-06',
          allotmentDate: '2026-09-08',
        },
        {
          id: 'inst-d2',
          instalmentNumber: 2,
          date: '2026-10-06',
          amount: 1000,
          status: 'successful',
          nav: 51.00,
          units: 19.608,
          debitDate: '2026-10-06',
          allotmentDate: '2026-10-08',
        },
      ],
      navHistory: [
        { date: '2026-09-06', nav: 50.00 },
        { date: '2026-10-06', nav: 51.00 },
        { date: '2026-11-02', nav: 51.50 },
      ],
    },
  },

  E: {
    id: 'E',
    label: 'Scenario E · Stop Menu (Neutral Options)',
    shortDescription: 'User opens the stop menu; 3 neutral options presented with no guilt copy',
    badgeText: 'Stop Menu Active',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'What are my options if I want to stop my SIP?',
      'If I cancel, will I lose my invested money?',
      'Can I reduce my SIP to ₹100 instead of stopping?',
      'What does pausing do?'
    ],
    bannerNotice: {
      type: 'info',
      title: 'Managing your SIP',
      message: 'You can move your debit date, reduce the amount to ₹100, or cancel from the SIP page.',
      actionLabel: 'View Options',
      actionType: 'explain'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'My Savings Buffer',
      sipIntentWhy: 'Financial safety buffer for 2027',
      startDate: '2026-08-02',
      currentNav: 53.00,
      previousNav: 52.40,
      instalments: [
        { id: 'inst-e1', instalmentNumber: 1, date: '2026-08-02', amount: 1000, status: 'successful', nav: 49.00, units: 20.408 },
        { id: 'inst-e2', instalmentNumber: 2, date: '2026-09-02', amount: 1000, status: 'successful', nav: 50.00, units: 20.000 },
        { id: 'inst-e3', instalmentNumber: 3, date: '2026-10-02', amount: 1000, status: 'successful', nav: 52.00, units: 19.231 },
      ],
      navHistory: [
        { date: '2026-08-02', nav: 49.00 },
        { date: '2026-09-02', nav: 50.00 },
        { date: '2026-10-02', nav: 52.00 },
        { date: '2026-11-02', nav: 53.00 },
      ],
    },
  },

  F: {
    id: 'F',
    label: 'Scenario F · Month 9 (Steady SIP & 1 Pause)',
    shortDescription: 'Six instalments made, one pause ("paused by you", 12-slot jar active)',
    badgeText: 'Month 9 · 6 Instalments Made · 1 Paused',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'How many instalments have I completed so far?',
      'Why does my jar show resting for month 5?',
      'Explain my average cost',
      'Should I increase my SIP amount?'
    ],
    bannerNotice: {
      type: 'info',
      title: 'Milestone: 6 instalments completed',
      message: 'You have contributed ₹6,000 across 6 completed instalments. 1 instalment was paused by you in June.',
      actionLabel: 'View Milestone Progress',
      actionType: 'explain'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'My Compounding Discipline',
      sipIntentWhy: 'First 12-month investing journey',
      startDate: '2026-02-02',
      currentNav: 54.20,
      previousNav: 53.80,
      instalments: [
        { id: 'inst-f1', instalmentNumber: 1, date: '2026-02-02', amount: 1000, status: 'successful', nav: 48.00, units: 20.833 },
        { id: 'inst-f2', instalmentNumber: 2, date: '2026-03-02', amount: 1000, status: 'successful', nav: 49.00, units: 20.408 },
        { id: 'inst-f3', instalmentNumber: 3, date: '2026-04-02', amount: 1000, status: 'successful', nav: 47.50, units: 21.053 },
        { id: 'inst-f4', instalmentNumber: 4, date: '2026-05-02', amount: 1000, status: 'successful', nav: 50.00, units: 20.000 },
        { id: 'inst-f5', instalmentNumber: 5, date: '2026-06-02', amount: 1000, status: 'paused_by_user', notes: 'Paused by you for one cycle.' },
        { id: 'inst-f6', instalmentNumber: 6, date: '2026-07-02', amount: 1000, status: 'successful', nav: 51.50, units: 19.417 },
        { id: 'inst-f7', instalmentNumber: 7, date: '2026-08-02', amount: 1000, status: 'successful', nav: 53.00, units: 18.868 },
      ],
      navHistory: [
        { date: '2026-02-02', nav: 48.00 },
        { date: '2026-05-02', nav: 50.00 },
        { date: '2026-08-02', nav: 53.00 },
        { date: '2026-11-02', nav: 54.20 },
      ],
    },
  },

  G: {
    id: 'G',
    label: 'Scenario G · Hinglish Anxiety & Financial Worry',
    shortDescription: 'User writes in Hinglish about anxiety over money and market drops',
    badgeText: 'Distress & Hinglish Handling',
    asOfDate: '2026-11-02',
    suggestedPrompts: [
      'Bhai market gir raha hai mujhe bohot tension ho rahi hai paise doob toh nahi jayenge?',
      'Sir mujhe darr lag raha hai kya mujhe stop kar dena chahiye?',
      'Mera salary late ho gaya hai aur EMI bhi deni hai bohot stress hai',
      'Mujhe samajh nahi aa raha main kya karu'
    ],
    bannerNotice: {
      type: 'warning',
      title: 'Doubt or worry about money?',
      message: 'It is natural to feel uneasy when numbers change. Companion can explain facts calmly in English or Hinglish.',
      actionLabel: 'Chat in Hinglish',
      actionType: 'explain'
    },
    sip: {
      id: 'sip-flexi-01',
      fundName: 'Sample Flexi Cap Fund Direct Growth',
      fundCategory: 'Flexi Cap Fund',
      amount: 1000,
      dayOfMonth: 2,
      nextDueDate: '2026-12-02',
      status: 'active',
      mandateStatus: 'active',
      mandateBank: 'HDFC Bank',
      mandateMaxLimit: 10000,
      sipName: 'My Hard-Earned Savings',
      sipIntentWhy: 'Saving for family security',
      startDate: '2026-09-02',
      currentNav: 47.00,
      previousNav: 47.80,
      instalments: [
        { id: 'inst-g1', instalmentNumber: 1, date: '2026-09-02', amount: 1000, status: 'successful', nav: 50.00, units: 20.000 },
        { id: 'inst-g2', instalmentNumber: 2, date: '2026-10-02', amount: 1000, status: 'successful', nav: 51.00, units: 19.608 },
      ],
      navHistory: [
        { date: '2026-09-02', nav: 50.00 },
        { date: '2026-10-02', nav: 51.00 },
        { date: '2026-11-02', nav: 47.00 },
      ],
    },
  },
};

export function getScenarioData(scenarioId: ScenarioId): {
  scenario: ScenarioDefinition;
  facts: DeterministicFacts;
} {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.A;
  const facts = computeFacts(scenario.sip, scenario.id, new Date(scenario.asOfDate));
  return { scenario, facts };
}

