/**
 * Deterministic Bank Fee Calculator & Origin Attribution
 * 
 * Non-negotiable Rule: Groww does NOT charge any penalty for failed or bounced SIP debits.
 * The bounce fee is levied entirely by the investor's depository bank for NACH/e-mandate return.
 */
export function getBounceFeeDetails(bankName: string = 'HDFC Bank'): {
  feeAmount: number;
  chargedBy: string;
  growwFee: number;
  explanation: string;
} {
  const standardFee = 250; // Typical retail bank NACH bounce charge in India (e.g. ₹250 + GST)
  
  return {
    feeAmount: standardFee,
    chargedBy: `Your bank (${bankName})`,
    growwFee: 0,
    explanation: `The ₹${standardFee} fee was charged by ${bankName} due to NACH mandate auto-debit return. Groww charges ₹0 for failed debits.`,
  };
}

