/**
 * Cyber Guardian AI — Email Phishing Analyzer
 * Pure deterministic pattern-based analysis. No AI.
 */

const PHISHING_KEYWORDS = [
  'verify your account', 'confirm your identity', 'suspended',
  'limited access', 'unauthorized', 'click here immediately',
  'act now', 'urgent action required', 'your account will be',
  'security alert', 'unusual activity', 'update your payment',
  'validate your', 'reactivate', 'dear customer', 'dear user',
  'dear account holder', 'immediately', 'urgent',
];

const CREDENTIAL_PATTERNS = [
  /password/i, /username/i, /login credentials/i,
  /social security/i, /credit card/i, /bank account/i,
  /otp/i, /one.?time.?password/i, /cvv/i, /pin.?code/i,
  /ssn/i, /routing number/i,
];

const URGENCY_WORDS = [
  'immediately', 'urgent', 'expires today', 'act now',
  'limited time', 'within 24 hours', 'final notice',
  'last chance', 'suspended', 'deactivated',
];

const FINANCIAL_WORDS = [
  'wire transfer', 'send money', 'payment', 'bank',
  'bitcoin', 'crypto', 'western union', 'moneygram',
  'gift card', 'itunes',
];

export function analyzeEmail({ subject, sender, body, links = [], attachments = [] }) {
  const indicators = [];
  const evidence = [];
  let score = 0;

  const bodyLower = body.toLowerCase();
  const subjectLower = subject.toLowerCase();
  const senderLower = sender.toLowerCase();

  // --- Suspicious sender ---
  if (/^[^@]+@(protonmail|tutanota|guerrilla)/.test(senderLower)) {
    indicators.push({
      id: 'suspicious_sender',
      label: 'Suspicious sender domain',
      description: 'Sender uses a free or anonymous email provider.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('Sender: ' + sender);
    score += 15;
  }

  // --- Phishing keywords ---
  const matchedKw = PHISHING_KEYWORDS.filter(
    (kw) => bodyLower.includes(kw) || subjectLower.includes(kw),
  );
  if (matchedKw.length > 0) {
    indicators.push({
      id: 'phishing_keywords',
      label: 'Phishing language detected',
      description: 'Found ' + matchedKw.length + ' common phishing phrases.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('Matched: ' + matchedKw.slice(0, 5).join(', '));
    score += Math.min(matchedKw.length * 8, 25);
  }

  // --- Credential requests ---
  const credMatches = CREDENTIAL_PATTERNS.filter((p) => p.test(bodyLower));
  if (credMatches.length > 0) {
    indicators.push({
      id: 'credential_request',
      label: 'Requests sensitive information',
      description: 'Message appears to request personal or financial credentials.',
      severity: 'high',
      category: 'observed',
    });
    evidence.push('Sensitive terms: ' + credMatches.length + ' found');
    score += 25;
  }

  // --- Urgency ---
  const urgency = URGENCY_WORDS.filter(
    (w) => bodyLower.includes(w) || subjectLower.includes(w),
  );
  if (urgency.length >= 2) {
    indicators.push({
      id: 'urgency',
      label: 'Urgency and pressure tactics',
      description: 'Multiple urgency phrases detected.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('Urgency phrases: ' + urgency.join(', '));
    score += 15;
  }

  // --- Financial ---
  const financial = FINANCIAL_WORDS.filter((w) => bodyLower.includes(w));
  if (financial.length > 0) {
    indicators.push({
      id: 'financial_request',
      label: 'Financial content detected',
      description: 'References financial transactions or payments.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('Financial terms: ' + financial.join(', '));
    score += 15;
  }

  // --- Suspicious links ---
  if (links.length > 0) {
    const suspicious = links.filter(
      (l) =>
        l.includes('bit.ly') ||
        l.includes('tinyurl') ||
        l.includes('@') ||
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(l),
    );
    if (suspicious.length > 0) {
      indicators.push({
        id: 'suspicious_links',
        label: 'Suspicious links found',
        description: 'Contains shortened or suspicious-looking URLs.',
        severity: 'high',
        category: 'observed',
      });
      evidence.push('Suspicious URLs: ' + suspicious.slice(0, 3).join(', '));
      score += 20;
    }
  }

  // --- Dangerous attachments ---
  if (attachments.length > 0) {
    const dangerousExts = ['.exe', '.scr', '.bat', '.cmd', '.vbs', '.js', '.wsf'];
    const dangerous = attachments.filter((a) =>
      dangerousExts.some((ext) => a.toLowerCase().endsWith(ext)),
    );
    if (dangerous.length > 0) {
      indicators.push({
        id: 'dangerous_attachments',
        label: 'Potentially dangerous attachments',
        description: 'Executable file types detected.',
        severity: 'critical',
        category: 'observed',
      });
      evidence.push('Dangerous files: ' + dangerous.join(', '));
      score += 35;
    }
  }

  // --- Generic greeting ---
  if (['dear customer', 'dear user', 'dear account holder'].some((g) => bodyLower.includes(g))) {
    indicators.push({
      id: 'generic_greeting',
      label: 'Generic greeting',
      description: 'Uses generic greeting instead of personalization.',
      severity: 'low',
      category: 'observed',
    });
    score += 10;
  }

  score = Math.min(score, 100);
  const riskLevel = toRisk(score);

  return {
    riskLevel,
    threatScore: score,
    confidence: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
    indicators,
    evidence: evidence.map((e) => ({ category: 'observed', content: e })),
    recommendations: emailRecs(riskLevel, indicators),
    explanation: emailExplanation(riskLevel, indicators.length),
    explanationUrdu: emailExplanationUrdu(riskLevel, indicators.length),
    analysisType: 'email',
  };
}

function toRisk(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'safe';
}

function emailExplanation(risk, count) {
  if (risk === 'safe') return 'No significant phishing indicators detected in this email.';
  if (risk === 'low') return 'Minor suspicious elements found. Exercise caution and verify the sender.';
  if (risk === 'moderate') return 'Several phishing indicators detected. Do not click links or provide personal information.';
  if (risk === 'high') return 'Strong phishing indicators found. Do not interact with this email.';
  return 'Critical phishing characteristics detected. Report immediately and delete.';
}

function emailExplanationUrdu(risk, count) {
  if (risk === 'safe') return 'اس ای میل میں فشنگ کی نشانیاں نہیں ہیں۔';
  if (risk === 'low') return 'اس ای میل میں معمولی مشکوک عناصر ہیں۔ محتاط رہیں۔';
  if (risk === 'moderate') return 'اس ای میل میں کئی فشنگ کی نشانیاں ہیں۔ لنکس پر کلک نہ کریں۔';
  if (risk === 'high') return 'اس ای میل میں مضبوط فشنگ کی نشانیاں ہیں۔ ذاتی معلومات فراہم نہ کریں۔';
  return 'اس ای میل میں انتہائی خطرناک فشنگ کی نشانیاں ہیں۔ فوری رپورٹ کریں۔';
}

function emailRecs(risk, indicators) {
  const recs = [];
  if (risk !== 'safe') {
    recs.push({ priority: 'high', action: 'Do not click any links in this message', description: 'Links may lead to phishing sites.' });
    recs.push({ priority: 'high', action: 'Do not reply or provide personal information', description: 'Legitimate organizations never ask for credentials via email.' });
  }
  if (indicators.some((i) => i.id === 'suspicious_links' || i.id === 'credential_request')) {
    recs.push({ priority: 'high', action: 'Verify by contacting the organization directly', description: 'Use official channels, not any from this message.' });
  }
  if (risk === 'safe') {
    recs.push({ priority: 'low', action: 'This email appears safe', description: 'Always stay cautious with unsolicited messages.' });
  }
  return recs;
}
