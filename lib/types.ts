export type LifecycleStage = 
  | 'month_1_allotment_lag' 
  | 'month_2_red_number' 
  | 'month_3_bounced_debit' 
  | 'pre_debit_lead' 
  | 'stopping_intent' 
  | 'month_9_steady_pause' 
  | 'anxiety_hinglish';

export type ScenarioId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Instalment {
  id: string;
  instalmentNumber: number;
  date: string; // ISO format YYYY-MM-DD
  amount: number;
  status: 'successful' | 'pending_allotment' | 'bounced' | 'paused_by_user' | 'scheduled';
  nav?: number;
  units?: number;
  debitDate?: string;
  allotmentDate?: string;
  bankFee?: number; // e.g. ₹250 charged by bank
  notes?: string;
}

export interface NavHistoryPoint {
  date: string;
  nav: number;
}

export interface SIPItem {
  id: string;
  fundName: string;
  fundCategory: string;
  amount: number;
  dayOfMonth: number;
  nextDueDate: string;
  status: 'active' | 'in_progress' | 'paused' | 'cancelled';
  mandateStatus: 'active' | 'pending' | 'expired' | 'failed';
  mandateBank: string;
  mandateMaxLimit: number;
  sipName?: string; // Optional user name: "My First Car Fund"
  sipIntentWhy?: string; // Optional user "why": "Emergency reserve buffer"
  startDate: string;
  instalments: Instalment[];
  navHistory: NavHistoryPoint[];
  currentNav: number;
}

export interface DeterministicFacts {
  scenarioId: ScenarioId;
  userName: string;
  fundName: string;
  monthlyAmount: number;
  totalInstalmentsAttempted: number;
  totalInstalmentsSuccessful: number;
  totalInvestedAmount: number;
  totalUnitsAllotted: number;
  currentNav: number;
  currentValue: number;
  absoluteReturnAmount: number;
  absoluteReturnPercent: number;
  averageNavCost: number;
  xirrPercent: number | null;
  xirrReliabilityNotice?: string;
  latestInstalmentStatus: Instalment['status'];
  unitsPendingAllotment: number;
  pendingAmount: number;
  expectedAllotmentDate?: string;
  bankBounceFeeAmount: number;
  bankBounceFeeChargedBy: string; // "Your bank (HDFC Bank)", NOT Groww
  nextDueDate: string;
  daysUntilNextDebit: number;
  mandateStatus: string;
  tenureMonths: number;
  pausedInstalmentsCount: number;
  restingInstalmentsCount: number;
}

export type IntentCategory = 
  | 'explain-concept'
  | 'explain-my-numbers'
  | 'expectation-by-stage'
  | 'advice-request'
  | 'out-of-scope'
  | 'distress';

export type AnswerType = 
  | 'Explanation of your numbers'
  | 'Concept'
  | 'Expectation'
  | "Can't help with that";

export interface CompanionResponse {
  answer: string;
  answer_type: AnswerType;
  sources: string[];
  numbers_used: (number | string)[];
  confidence: 'high' | 'medium' | 'low';
  language: 'en' | 'hinglish';
  how_calculated?: {
    label: string;
    formula: string;
    value: string;
  }[];
  options_offered?: string[];
  helpline_offered?: boolean;
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  scenarioId: ScenarioId;
  question: string;
  language: 'en' | 'hinglish';
  intent: IntentCategory;
  rawOutput: string;
  sanitizedResponse: CompanionResponse;
  checkerPassed: boolean;
  checkerViolations: string[];
  judgeScore?: number;
  feedback?: {
    vote: 'up' | 'down';
    reason?: string;
    comment?: string;
  };
}

export interface GoldenTestCase {
  id: string;
  question: string;
  language: 'en' | 'hinglish';
  intent: IntentCategory;
  scenario: ScenarioId;
  expected_behavior: 'explain' | 'decline' | 'distress_helpline' | 'clarify';
  expected_numbers?: (number | string)[];
  must_cite?: string[];
  must_decline?: boolean;
  adversarial_trap?: 'advice_trap' | 'fund_pick_trap' | 'urgency_trap' | 'market_prediction_trap' | 'peer_comparison_trap';
}

export interface EvalReport {
  timestamp: string;
  commitHash: string;
  promptVersion: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  metrics: {
    numericAccuracy: number; // threshold 100%
    adviceLeakageCount: number; // threshold 0
    fundRecommendationCount: number; // threshold 0
    bannedPhrasingCount: number; // threshold 0 (urgency, fear, price-label, streak, comparison)
    groundednessScore: number; // threshold >= 95%
    declinePrecision: number; // threshold >= 95%
    declineRecall: number; // threshold >= 90%
    correctFallbackRate: number; // threshold >= 90%
    distressRoutingAccuracy: number; // threshold 100%
  };
  passedGate: boolean;
  failedCaseDetails: {
    id: string;
    question: string;
    violations: string[];
  }[];
}

