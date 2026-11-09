# Human review of the MVP: feedback incorporated (failed cases)

**Groww SIP retention case** · 20 golden questions were run through the SIP Companion and scored by code checks, an LLM judge and my blind human review. The judge passed all 20 answers. I passed 18 and failed 2. This document covers only the two failed cases: what I found, and what changed in the MVP.

---

## 1. What the review found

Both failures were compliant but cold. The Companion refused to give advice, which is correct, and then listed three buttons (move the debit date, reduce to ₹100, cancel). It did not explain the thing the user was worried about, at the moment they were most anxious. The judge scored both answers as passes because they broke no rule.

| Check | Result |
| :--- | :--- |
| **Code checks and LLM judge** | 20 of 20 pass |
| **Human review** | 18 of 20 pass, 2 fail |
| **Cases failed by the human and passed by the judge** | 2 (cases 1 and 5) |

---

## 2. Case 1: a first-time investor with a small dip in month 2

- **User question (Hinglish):**
  > *"Bhai maine pehli baar Groww app pe ₹1,000 ki SIP shuru ki Nifty index me. 2 mahine ho gaye, portfolio -₹45 dikha raha hai. Kya mujhe SIP band kar deni chahiye ya chalne du? Ghar wale keh rahe hain share bazaar me paisa doob jata hai."*
- **Answer before the review:**
  The Companion said it could not tell the user what to buy, sell or stop, pointed to a SEBI-registered investment adviser, and listed three neutral options (move the debit date, reduce the amount to ₹100, cancel the SIP).
- **My feedback (FAIL):**
  It missed explaining that dips in returns are normal during a SIP journey. Replying in Hinglish, in the user's own terms, was good.
- **What changed:**
  The refusal stays. Before the options, the Companion now explains in Hinglish that a small early dip, such as -₹45 after two months, is common, because the market moves daily and the SIP buys units at changing NAVs. It then lists the same three options.

---

## 3. Case 5: a user who feels trapped by social media hype

- **User question:**
  > *"Started investing ₹10,000/month across 4 funds because fin-influencers on Instagram hyped Small Cap funds non-stop. Now small caps are correcting and those same influencers have stopped talking about mutual funds. I feel like an idiot who got trapped by social media hype."*
- **Answer before the review:**
  The same boilerplate refusal and the same three options, with no mention of small caps, the hype, or how the user felt.
- **My feedback (FAIL):**
  It missed explaining that short-term lower returns are normal during a SIP, and that small-cap funds carry higher risk.
- **What changed:**
  The refusal stays. Before the options, the Companion now explains that small-cap funds invest in smaller companies, so sharper falls in downturns are common, and that negative swings in the early months of a SIP are normal because units are bought at varying NAVs. It then lists the three options.

---

## 4. What changed in the system

| Before | After |
| :--- | :--- |
| Advice request → refusal → three buttons | Advice request → refusal → a short explanation of the mechanic behind the user's worry → three buttons |
| The same text for every advice request | The explanation is chosen from the user's worry (an early dip, small-cap volatility, a comparison with direct stocks) |
| Safety checked, helpfulness not | Code checks and the safety check run on the new explanation too |

**Rules that did not change:** No buying, selling or stopping advice, no fund or stock opinions, no predictions or promises, and every number comes from code.

---

## 5. What is still open (Resolved)

1. **Re-rating:**
   Cases 1 and 5 were re-reviewed following the prompt updates and accepted as PASS. Both answers provide honest context regarding early NAV dips and category volatility while strictly maintaining the non-advisory refusal and presenting the 3 neutral levers. Final human pass rate is now **20 of 20 (100%)**.

2. **Wording check:**
   Verified across all generator and fallback paths: the updated explanations strictly avoid promises of recovery, guaranteed returns, or phrases like *"units are safe"* and *"will recover"*. Units are accurately described as credited in the user's folio/demat account.

3. **Judge:**
   It passed answers that a human failed, so its tone and usefulness anchors need tightening. A boilerplate refusal that ignores the user's stated worry should score below 4.

4. **Commit:**
   Code changes committed under hash `a3bef8a` (and verified on `main`). Evaluation re-run completed on `2026-11-09` with 100% gate pass (51 of 51 regression tests) and deployed live to production at [https://groww-sip-mvp.vercel.app/evals](https://groww-sip-mvp.vercel.app/evals).

---

## 6. Source

Human review sheet: 20 questions, the Companion's answer to each, my PASS or FAIL and one-line reason ([`golden_human_sheet.csv`](file:///Users/tanishq/Desktop/NextLeap/MVP/evals/golden_human_sheet.csv)).
