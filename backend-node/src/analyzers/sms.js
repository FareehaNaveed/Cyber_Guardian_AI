/**
 * Cyber Guardian AI — SMS Scam Analyzer
 * Pure deterministic pattern-based analysis. No AI.
 */

const SMS_SCAM_PATTERNS = [
  [/won\s+(a\s+)?prize/i, 'Fake prize claim'],
  [/congratulations.*won/i, 'Fake prize claim'],
  [/bank.*suspend|account.*suspend/i, 'Account suspension scam'],
  [/send\s+(otp|money|code)/i, 'OTP or money request'],
  [/share.*otp|verify.*otp|enter.*otp/i, 'OTP sharing request'],
  [/invest.*\d+x|double.*money|guaranteed.*return/i, 'Investment scam'],
  [/job.*offer|work.*from.*home/i, 'Job scam'],
  [/delivery.*missed|package.*held|customs.*fee/i, 'Delivery scam'],
  [/irs|tax.*refund|government.*grant/i, 'Government impersonation'],
  [/lottery|sweepstakes|lucky winner/i, 'Lottery scam'],
  [/click\s+here|tap\s+here|visit\s+now/i, 'Urgent action request'],
  [/expire|immediate|urgent|act now|last chance/i, 'Urgency language'],
  [/verify.*identity|confirm.*account/i, 'Identity verification scam'],
];

export function analyzeSms({ text, sender, url }) {
  const indicators = [];
  const evidence = [];
  let score = 0;

  // Check scam patterns
  for (const [pattern, label] of SMS_SCAM_PATTERNS) {
    if (pattern.test(text)) {
      const exists = indicators.find((i) => i.label === label);
      if (!exists) {
        const isHigh = label.toLowerCase().includes('otp') || label.toLowerCase().includes('suspend');
        indicators.push({
          id: 'sms_' + label.toLowerCase().replace(/\s+/g, '_'),
          label,
          description: 'Matches known scam pattern: ' + label,
          severity: isHigh ? 'high' : 'moderate',
          category: 'observed',
        });
        evidence.push('Pattern: ' + label);
        score += isHigh ? 30 : 20;
      }
    }
  }

  // Check URLs in SMS
  const urlsFound = text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+/g) || [];
  if (urlsFound.length > 0) {
    const suspiciousUrls = urlsFound.filter(
      (u) => u.includes('bit.ly') || u.includes('tinyurl') || u.length > 100,
    );
    if (suspiciousUrls.length > 0) {
      indicators.push({
        id: 'sms_suspicious_url',
        label: 'Contains suspicious shortened URL',
        description: 'Shortened URLs hide the actual destination.',
        severity: 'high',
        category: 'observed',
      });
      evidence.push('URLs: ' + suspiciousUrls.slice(0, 3).join(', '));
      score += 25;
    }
  }

  // Credential requests
  if (/password|pin|ssn|credit card|debit card|cvv/i.test(text)) {
    indicators.push({
      id: 'sms_credential_request',
      label: 'Requests sensitive information',
      description: 'Requests personal or financial information.',
      severity: 'critical',
      category: 'observed',
    });
    evidence.push('References sensitive data types');
    score += 30;
  }

  score = Math.min(score, 100);
  const riskLevel = toRisk(score);

  return {
    riskLevel,
    threatScore: score,
    confidence: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
    indicators,
    evidence: evidence.map((e) => ({ category: 'observed', content: e })),
    recommendations: smsRecs(riskLevel),
    explanation: smsExplanation(riskLevel, indicators.length),
    explanationUrdu: smsExplanationUrdu(riskLevel, indicators.length),
    analysisType: 'sms',
  };
}

function toRisk(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'safe';
}

function smsExplanation(risk, count) {
  if (risk === 'safe') return 'No significant scam indicators detected in this message.';
  if (risk === 'low') return 'Minor suspicious elements found. Be cautious and verify the sender.';
  if (risk === 'moderate') return 'Several scam indicators found. Do not click links or share personal information.';
  if (risk === 'high') return 'Strong scam indicators found. This is likely a scam. Do not interact.';
  return 'Critical scam indicators found. Block and report the sender immediately.';
}

function smsExplanationUrdu(risk, count) {
  if (risk === 'safe') return 'اس پیغام میں کوئی اہم اسکیم کی نشانی نہیں ملی۔';
  if (risk === 'low') return 'اس پیغام میں معمولی مشکوک عناصر ہیں۔ محتاط رہیں۔';
  if (risk === 'moderate') return 'اس پیغام میں کئی اسکیم کی نشانیاں ہیں۔ لنکس پر کلک نہ کریں۔';
  if (risk === 'high') return 'اس پیغام میں مضبوط اسکیم کی نشانیاں ہیں۔ اس پر عمل نہ کریں۔';
  return 'اس پیغام میں انتہائی خطرناک اسکیم کی نشانیاں ہیں۔ فوری بلاک اور رپورٹ کریں۔';
}

function smsRecs(risk) {
  if (risk === 'safe') {
    return [{ priority: 'low', action: 'This message appears safe', description: 'Always verify if something seems unusual.' }];
  }
  return [
    { priority: 'high', action: 'Do not click any links', description: 'Links may lead to scam websites.' },
    { priority: 'high', action: 'Do not share OTP, PIN, or codes', description: 'Legitimate services never ask for OTPs via SMS.' },
    { priority: 'high', action: 'Verify through official channels', description: 'Contact the organization using their official app or website.' },
  ];
}
