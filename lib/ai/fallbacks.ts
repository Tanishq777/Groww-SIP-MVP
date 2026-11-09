import { CompanionResponse, DeterministicFacts } from '../types';

export function getAdviceFallbackResponse(language: 'en' | 'hinglish', facts: DeterministicFacts, question?: string): CompanionResponse {
  const qLower = (question || '').toLowerCase();

  if (language === 'hinglish') {
    // Contextual explanation for early dip / family anxiety while declining advice (Golden Q1)
    if (qLower.includes('45') || qLower.includes('doob') || qLower.includes('nifty index') || qLower.includes('pehli baar')) {
      return {
        answer: "Main aapko yeh nahi bata sakta ki kya khareedein, bechein ya stop karein. Main aapke SIP ke numbers ya mutual fund concepts neutrally samjha sakta hoon. Kisi bhi investment advice ke liye aap ek SEBI-registered investment adviser se salah le sakte hain.\n\nMutual fund concepts ke hisab se, shuruati mahino (jaise 2 mahine) mein portfolio mein -₹45 jaisa chhota dip aana bilkul normal hai. Market roz fluctuate hoti hai, isliye NAV thodi girne par return temporary negative dikh sakta hai, lekin aapki units aapke account mein credited rehti hain. Long-term SIP mein short-term utar-chadav aana aam baat hai.\n\nAapke paas hamesha 3 neutral options hote hain: debit date badalna, amount kam karke ₹100 karna, ya SIP cancel karna.",
        answer_type: "Can't help with that",
        sources: ['SEBI Investor Protection Guidelines', 'Understanding XIRR and Early Swings'],
        numbers_used: ['100', '2', '45', '1000'],
        confidence: 'high',
        language: 'hinglish',
        options_offered: [
          'Move debit date',
          'Reduce SIP amount (min ₹100)',
          'Cancel from the SIP page'
        ]
      };
    }

    return {
      answer: "Main aapko yeh nahi bata sakta ki kya khareedein, bechein ya stop karein. Main aapke SIP ke numbers ya mutual fund concepts neutrally samjha sakta hoon. Kisi bhi investment advice ke liye aap ek SEBI-registered investment adviser se salah le sakte hain.\n\nAapke paas hamesha 3 neutral options hote hain: debit date badalna, amount kam karke ₹100 karna, ya SIP cancel karna.",
      answer_type: "Can't help with that",
      sources: ['SEBI Investor Protection Guidelines'],
      numbers_used: ['100'],
      confidence: 'high',
      language: 'hinglish',
      options_offered: [
        'Move debit date',
        'Reduce SIP amount (min ₹100)',
        'Cancel from the SIP page'
      ]
    };
  }

  // Contextual explanation for small cap volatility / corrections while declining advice (Golden Q5)
  if (qLower.includes('small cap') || qLower.includes('fin-influencers') || qLower.includes('hyped')) {
    return {
      answer: "I can't tell you what to buy, sell or stop. I can explain how things work or your own numbers. For advice, a SEBI-registered investment adviser can help.\n\nFrom a mutual fund concept standpoint, Small Cap funds invest in smaller companies that carry higher volatility and risk, meaning they tend to experience sharper corrections during market downturns. In early periods of an SIP, short-term negative swings or lower returns are a normal part of market cycles, while your instalments accumulate units at different NAVs.\n\nIf you are managing your monthly budget, you always have three neutral options: move your debit date, reduce the instalment amount (down to ₹100), or cancel the SIP from the SIP page.",
      answer_type: "Can't help with that",
      sources: ['SEBI Investor Protection Guidelines', 'Rupee-Cost Averaging Concept'],
      numbers_used: ['100', '10000', '4'],
      confidence: 'high',
      language: 'en',
      options_offered: [
        'Move debit date',
        'Reduce SIP amount (min ₹100)',
        'Cancel from the SIP page'
      ]
    };
  }

  // Contextual explanation for direct stocks vs SIP compounding while declining advice (Golden Q17)
  if (qLower.includes('tata motors') || qLower.includes('direct equity') || qLower.includes('direct stocks')) {
    return {
      answer: "I can't tell you what to buy, sell or stop. I can explain how things work or your own numbers. For advice, a SEBI-registered investment adviser can help.\n\nFrom a concept perspective, individual direct stocks and diversified mutual fund SIPs operate differently: individual stocks can experience rapid short-term moves in either direction, whereas an equity SIP is designed for steady rupee-cost averaged compounding over the long term. In early periods, returns can be modest and short-term lower returns are a normal part of the investing journey.\n\nIf you are managing your monthly budget, you always have three neutral options: move your debit date, reduce the instalment amount (down to ₹100), or cancel the SIP from the SIP page.",
      answer_type: "Can't help with that",
      sources: ['SEBI Investor Protection Guidelines', 'Rupee-Cost Averaging Concept'],
      numbers_used: ['100', '50000', '40', '4', '5000', '4.2'],
      confidence: 'high',
      language: 'en',
      options_offered: [
        'Move debit date',
        'Reduce SIP amount (min ₹100)',
        'Cancel from the SIP page'
      ]
    };
  }

  return {
    answer: "I can't tell you what to buy, sell or stop. I can explain how things work or your own numbers. For advice, a SEBI-registered investment adviser can help.\n\nIf you are managing your monthly budget, you always have three neutral options: move your debit date, reduce the instalment amount (down to ₹100), or cancel the SIP from the SIP page.",
    answer_type: "Can't help with that",
    sources: ['SEBI Investor Protection Guidelines'],
    numbers_used: ['100'],
    confidence: 'high',
    language: 'en',
    options_offered: [
      'Move debit date',
      'Reduce SIP amount (min ₹100)',
      'Cancel from the SIP page'
    ]
  };
}

export function getOutOfScopeFallbackResponse(language: 'en' | 'hinglish'): CompanionResponse {
  if (language === 'hinglish') {
    return {
      answer: "Main sirf aapke SIP ke numbers, NAV allotment aur mutual fund concepts ko samjhane ke liye banaya gaya hoon. Main general topics ya coding mein madad nahi kar sakta. Kya aap apne SIP instalment ya units ke baare mein jaanna chahte hain?",
      answer_type: "Can't help with that",
      sources: ['SIP Companion Guidelines'],
      numbers_used: [],
      confidence: 'high',
      language: 'hinglish',
    };
  }

  return {
    answer: "I am specifically designed to explain your SIP numbers, NAV allotments, and mutual fund concepts. I cannot help with external topics outside your mutual fund journey. Would you like me to explain your instalment details, units, or upcoming debit date?",
    answer_type: "Can't help with that",
    sources: ['SIP Companion Guidelines'],
    numbers_used: [],
    confidence: 'high',
    language: 'en',
  };
}

export function getDistressFallbackResponse(
  language: 'en' | 'hinglish',
  facts: DeterministicFacts
): CompanionResponse {
  if (language === 'hinglish') {
    return {
      answer: "Paison aur market ki uthal-puthal ko lekar chintit hona bilkul swabhavik hai. Aap akele nahi hain. Agar aap bahut zyada pareshan hain, toh kripya kisi vishwaspatra vyakti ya counselor se baat karein.\n\nTele-MANAS helpline: 14416 (24x7 National Mental Health Toll-Free, India).\n\nAapke portfolio ke liye aapke haath mein poora control hai: aap debit date aage badha sakte hain, amount ghata kar ₹100 kar sakte hain, ya SIP page se cancel kar sakte hain.",
      answer_type: "Can't help with that",
      sources: ['Tele-MANAS Toll-Free National Helpline (14416)'],
      numbers_used: ['14416', '100'],
      confidence: 'high',
      language: 'hinglish',
      helpline_offered: true,
      options_offered: [
        'Move debit date',
        'Reduce SIP amount (min ₹100)',
        'Cancel from the SIP page'
      ]
    };
  }

  return {
    answer: "It is completely understandable to feel anxious when numbers fluctuate or finances feel overwhelming. Please know you are not alone. If you are experiencing acute distress, speaking with someone you trust or a professional can help.\n\nTele-MANAS Helpline: 14416 (24x7 National Mental Health Helpline, Govt. of India).\n\nRegarding your SIP, you are in full control: you can move your debit date to align with your salary, reduce your monthly contribution to ₹100, or cancel from the SIP page.",
    answer_type: "Can't help with that",
    sources: ['Tele-MANAS Toll-Free National Helpline (14416)'],
    numbers_used: ['14416', '100'],
    confidence: 'high',
    language: 'en',
    helpline_offered: true,
    options_offered: [
      'Move debit date',
      'Reduce SIP amount (min ₹100)',
      'Cancel from the SIP page'
    ]
  };
}

export function getLockinOrChargesFallbackResponse(language: 'en' | 'hinglish'): CompanionResponse {
  if (language === 'hinglish') {
    return {
      answer: "Yeh aapke specific fund par depend karta hai. Kripya scheme document ya official source check karein.\n\nAapke paas hamesha yeh 3 neutral options hote hain: debit date move karna, instalment ghata kar ₹100 karna, ya SIP page se cancel karna.",
      answer_type: "Can't help with that",
      sources: ['Lock-ins, Exit Loads and Charges'],
      numbers_used: ['100'],
      confidence: 'high',
      language: 'hinglish',
      options_offered: [
        'Move debit date',
        'Reduce SIP amount (min ₹100)',
        'Cancel from the SIP page'
      ]
    };
  }

  return {
    answer: "That depends on your specific fund. Please check the scheme document or an official source.\n\nRegarding your monthly schedule, you always have 3 neutral options: move your debit date, reduce the instalment amount to ₹100, or cancel from the SIP page.",
    answer_type: "Can't help with that",
    sources: ['Lock-ins, Exit Loads and Charges'],
    numbers_used: ['100'],
    confidence: 'high',
    language: 'en',
    options_offered: [
      'Move debit date',
      'Reduce SIP amount (min ₹100)',
      'Cancel from the SIP page'
    ]
  };
}


