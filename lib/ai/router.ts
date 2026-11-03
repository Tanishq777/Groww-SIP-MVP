import { IntentCategory } from '../types';

export function detectLanguage(text: string): 'en' | 'hinglish' {
  const t = text.toLowerCase();
  const hinglishMarkers = [
    'bhai', 'kya', 'nahi', 'nahin', 'hai', 'hain', 'mujhe', 'mera', 'meri', 'mere',
    'paise', 'paisa', 'tension', 'darr', 'stress', 'samajh', 'kaise', 'karo', 'kare',
    'batao', 'bol', 'doob', 'gaya', 'gayi', 'hoga', 'rakhu', 'band', 'rok'
  ];

  let matches = 0;
  for (const m of hinglishMarkers) {
    const regex = new RegExp(`\\b${m}\\b`, 'i');
    if (regex.test(t)) {
      matches++;
    }
  }

  return matches >= 1 ? 'hinglish' : 'en';
}

export function routeIntent(text: string): {
  intent: IntentCategory;
  language: 'en' | 'hinglish';
  confidence: number;
} {
  const t = text.toLowerCase().trim();
  const language = detectLanguage(text);

  // 1. Distress & Panic checks
  const distressRegex = /(suicide|kill myself|hopeless|cannot live|end it all|can't take it anymore|panic attack|bohot tension|bohot stress|darr lag raha|paise doob to nahi|depression|anxiety)/i;
  if (distressRegex.test(t)) {
    return { intent: 'distress', language, confidence: 0.99 };
  }

  // 2. Advice Request checks (Should I buy/sell/stop? Which fund is better? Recommend)
  const adviceRegex = /\b(should i|which fund|recommend|best fund|better than|shall i stop|shall i cancel|should i pause|should i continue|is it a good time|tell me what to do|kya mujhe stop kar|kya pause karu|kya bech du|kya invest karu)\b/i;
  if (adviceRegex.test(t)) {
    return { intent: 'advice-request', language, confidence: 0.98 };
  }

  // 3. Out of Scope checks
  const outOfScopeRegex = /\b(weather|prime minister|capital of|write code|recipe|cricket score|movie|football|python|javascript|bitcoin|crypto|who won)\b/i;
  if (outOfScopeRegex.test(t)) {
    return { intent: 'out-of-scope', language, confidence: 0.95 };
  }

  // 4. Explain my numbers (personal data references)
  const myNumbersRegex = /\b(my number|my money|my value|my units|where is my|why is my|my return|my 100|my 1000|my 2000|my 250|why was i charged|mera paisa|meri units|mera kata)\b/i;
  if (myNumbersRegex.test(t)) {
    return { intent: 'explain-my-numbers', language, confidence: 0.94 };
  }

  // 5. Expectation by stage (is this normal? what happens next?)
  const expectationRegex = /\b(is it normal|normal in month|what happens next|first time|milestone|what to expect|kya normal hai)\b/i;
  if (expectationRegex.test(t)) {
    return { intent: 'expectation-by-stage', language, confidence: 0.92 };
  }

  // 6. Explain concept (default educational)
  return { intent: 'explain-concept', language, confidence: 0.90 };
}

