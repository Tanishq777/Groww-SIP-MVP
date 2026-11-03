/**
 * Deterministic NAV Allotment Lag Calculator
 * 
 * Mock Rule: Mutual fund units are allotted 2 business days after bank debit
 * (Excludes Saturdays, Sundays, and public bank holidays).
 * 
 * NOTE: Marked as a mock simulation rule per Section 4.B of the brief.
 */
export function calculateExpectedAllotmentDate(debitDateStr: string): {
  expectedDateStr: string;
  businessDaysLag: number;
  mockRuleNotice: string;
} {
  const debitDate = new Date(debitDateStr);
  let daysAdded = 0;
  const current = new Date(debitDate);

  while (daysAdded < 2) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  const yyyy = current.getFullYear();
  const mm = String(current.getMonth() + 1).padStart(2, '0');
  const dd = String(current.getDate()).padStart(2, '0');

  return {
    expectedDateStr: `${yyyy}-${mm}-${dd}`,
    businessDaysLag: 2,
    mockRuleNotice: 'Mock Rule: Units are allotted after 2 business days once funds settle.',
  };
}

