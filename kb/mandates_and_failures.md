---
title: Mandate Mechanics and Why Debits Fail
source_name: National Payments Corporation of India (NPCI) NACH Framework
source_url: TODO_VERIFY
last_reviewed: 2026-10-25
---
# Auto-Debit Mandate Mechanics and Failure Modes

An **e-mandate** or **NACH mandate** is a formal authorization given to your bank permitting automated recurring deductions for your SIP up to a specified maximum limit.

1. **How Debits Process:** 
   - 2 to 3 days before your SIP due date, the payment instruction is queued with NPCI.
   - On the scheduled debit date, NPCI presents the request to your bank.
2. **Common Reasons a Debit Fails:**
   - **Insufficient Balance:** Account balance on the exact debit day is lower than the instalment amount.
   - **Bank Server Timeout:** Connectivity issues between the clearing house and your depository bank during the processing batch.
   - **Mandate Expired / Inactive:** The mandate validity period ended, or authentication was revoked.
   - **Daily Account Limits:** Bank-level debit or net banking limits exceeded.
3. **What Happens After a Failure:** An unsuccessful debit means no mutual fund units are purchased for that monthly cycle. The existing units already held in your portfolio remain safe and unaffected.

