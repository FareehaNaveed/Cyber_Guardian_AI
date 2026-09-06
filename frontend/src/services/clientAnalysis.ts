/**
 * Cyber Guardian AI — Client-Side Analysis Engine
 * Deterministic security analysis. Works entirely in-browser — no backend needed.
 */

export interface AnalysisResult {
  riskLevel: string;
  threatScore: number;
  confidence: string;
  indicators: Array<{
    id: string;
    label: string;
    description: string;
    severity: string;
    category: string;
  }>;
  evidence: Array<{
    category: string;
    content: string;
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    description: string;
  }>;
  explanation: string;
  explanationUrdu: string;
  analysisType: string;
  strength?: string;
  crackTimeEstimate?: string;
  problems?: string[];
  improvementSuggestions?: string[];
}

function scoreToRisk(score: number): string {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'safe';
}

// ═══════════════ EMAIL ANALYSIS ═══════════════

const PHISHING_KEYWORDS = [
  'verify your account', 'confirm your identity', 'suspended', 'limited access',
  'unauthorized', 'click here immediately', 'act now', 'urgent action required',
  'your account will be', 'security alert', 'unusual activity',
  'update your payment', 'validate your', 'reactivate',
];

const CREDENTIAL_PATTERNS = [
  /password/i, /username/i, /login credentials/i, /social security/i,
  /credit card/i, /bank account/i, /otp/i, /one.?time.?password/i,
  /cvv/i, /pin.?code/i, /ssn/i,
];

const URGENCY_WORDS = [
  'immediately', 'urgent', 'expires today', 'act now', 'limited time',
  "don't delay", 'within 24 hours', 'final notice', 'last chance',
  'suspended', 'deactivated',
];

export function analyzeEmail(input: { subject: string; sender: string; body: string; links?: string[] }): AnalysisResult {
  const indicators: AnalysisResult['indicators'] = [];
  const evidence: AnalysisResult['evidence'] = [];
  const recommendations: AnalysisResult['recommendations'] = [];
  let score = 0;

  const bodyLower = input.body.toLowerCase();
  const subjectLower = input.subject.toLowerCase();
  const senderLower = input.sender.toLowerCase();

  // Phishing keywords
  const foundKeywords = PHISHING_KEYWORDS.filter(k => bodyLower.includes(k) || subjectLower.includes(k));
  if (foundKeywords.length > 0) {
    indicators.push({ id: 'phishing_keywords', label: 'Phishing language detected', description: `Found ${foundKeywords.length} phishing indicator(s): "${foundKeywords.slice(0, 3).join('", "')}"`, severity: foundKeywords.length > 3 ? 'high' : 'moderate', category: 'observed' });
    evidence.push({ category: 'observed', content: `Phishing keywords: ${foundKeywords.join(', ')}` });
    score += Math.min(foundKeywords.length * 12, 40);
  }

  // Credential requests
  const credMatches = CREDENTIAL_PATTERNS.filter(p => bodyLower.match(p));
  if (credMatches.length > 0) {
    indicators.push({ id: 'credential_request', label: 'Credential request detected', description: 'The email requests sensitive personal or financial information.', severity: 'high', category: 'observed' });
    evidence.push({ category: 'observed', content: `Credential-related terms: ${credMatches.length} found` });
    score += 25;
  }

  // Urgency
  const urgencies = URGENCY_WORDS.filter(w => bodyLower.includes(w));
  if (urgencies.length > 0) {
    indicators.push({ id: 'urgency', label: 'Urgency language', description: `Uses pressure tactics: "${urgencies.slice(0, 3).join('", "')}"`, severity: 'moderate', category: 'derived' });
    score += Math.min(urgencies.length * 8, 20);
  }

  // Suspicious sender
  if (senderLower.includes('noreply@') || senderLower.includes('no-reply@')) {
    indicators.push({ id: 'noreply_sender', label: 'Automated sender', description: 'Sent from a no-reply address — common in phishing.', severity: 'low', category: 'observed' });
    evidence.push({ category: 'observed', content: `Sender: ${input.sender}` });
    score += 8;
  }

  // Links analysis
  if (input.links && input.links.length > 0) {
    for (const link of input.links) {
      try {
        const url = new URL(link);
        if (url.hostname.includes('bit.ly') || url.hostname.includes('tinyurl') || url.hostname.includes('t.co')) {
          indicators.push({ id: 'shortened_url', label: 'Shortened URL', description: `Hidden destination: ${link}`, severity: 'moderate', category: 'observed' });
          score += 15;
        }
        if (url.hostname.includes('login') || url.hostname.includes('verify') || url.hostname.includes('secure')) {
          indicators.push({ id: 'suspicious_domain', label: 'Suspicious domain in link', description: `Link domain contains deceptive keywords: ${url.hostname}`, severity: 'high', category: 'observed' });
          score += 20;
        }
        if (url.protocol !== 'https:') {
          indicators.push({ id: 'http_link', label: 'Insecure link', description: `HTTP (not HTTPS) link found: ${link}`, severity: 'moderate', category: 'observed' });
          score += 10;
        }
      } catch { /* not a valid URL */ }
    }
    evidence.push({ category: 'observed', content: `${input.links.length} link(s) found in email` });
  }

  // HTML formatting tricks
  if (bodyLower.includes('<script') || bodyLower.includes('onclick') || bodyLower.includes('display:none')) {
    indicators.push({ id: 'html_tricks', label: 'HTML manipulation detected', description: 'Email contains hidden or executable HTML elements.', severity: 'high', category: 'observed' });
    score += 25;
  }

  const risk = scoreToRisk(score);

  // Recommendations
  if (score > 20) {
    recommendations.push({ priority: 'high', action: 'Do not click any links', description: 'Hover over links to verify the actual destination before clicking.' });
    recommendations.push({ priority: 'high', action: 'Do not provide personal information', description: 'Legitimate companies never ask for credentials via email.' });
  }
  if (score > 40) {
    recommendations.push({ priority: 'critical', action: 'Report as phishing', description: 'Mark this email as phishing in your email client and report to your IT department.' });
    recommendations.push({ priority: 'high', action: 'Delete the email', description: 'Remove this email from your inbox and deleted items.' });
  }
  if (score <= 20) {
    recommendations.push({ priority: 'low', action: 'Verify sender independently', description: 'Contact the organization directly through their official website or phone number.' });
  }

  const explanation = risk === 'safe'
    ? 'This email shows few or no phishing indicators. It appears to be a legitimate message, though always verify the sender independently.'
    : risk === 'low'
    ? 'This email has minor suspicious elements. While not definitively phishing, exercise caution and verify the sender through official channels.'
    : risk === 'moderate'
    ? 'This email shows several phishing indicators including suspicious language and urgency tactics. Do not click links or provide personal information.'
    : risk === 'high'
    ? 'This email shows strong phishing indicators: urgency language, credential requests, and suspicious patterns. Do not interact with this email.'
    : 'This email exhibits critical phishing characteristics with multiple red flags. Report immediately and delete.';

  const explanationUrdu = risk === 'safe'
    ? 'اس ای میل میں فشنگ کی نشانیاں نہیں ہیں۔ یہ ایک جائز پیغام لگتا ہے، تاہم بھیجے والے کی خود تصدیق کریں۔'
    : risk === 'low'
    ? 'اس ای میل میں معمولی مشکوک عناصر ہیں۔ مکمل طور پر فشنگ نہیں ہے، لیکن احتیاط برتیں۔'
    : risk === 'moderate'
    ? 'اس ای میل میں کئی فشنگ کی نشانیاں ہیں بشمول مشکوک زبان اور فوریت کی حکمت عملی۔ لنکس پر کلک نہ کریں۔'
    : risk === 'high'
    ? 'اس ای میل میں مضبوط فشنگ کی نشانیاں ہیں۔ ذاتی معلومات فراہم نہ کریں اور لنکس پر کلک نہ کریں۔'
    : 'اس ای میل میں انتہائی خطرناک فشنگ کی نشانیاں ہیں۔ فوری طور پر رپورٹ کریں اور حذف کریں۔';

  return {
    riskLevel: risk,
    threatScore: Math.min(score, 100),
    confidence: indicators.length > 3 ? 'high' : indicators.length > 1 ? 'moderate' : 'low',
    indicators,
    evidence,
    recommendations,
    explanation,
    explanationUrdu,
    analysisType: 'email',
  };
}

// ═══════════════ SMS ANALYSIS ═══════════════

export function analyzeSms(input: { text: string; sender?: string; url?: string }): AnalysisResult {
  const indicators: AnalysisResult['indicators'] = [];
  const evidence: AnalysisResult['evidence'] = [];
  const recommendations: AnalysisResult['recommendations'] = [];
  let score = 0;

  const textLower = input.text.toLowerCase();

  // Prize/fraud keywords
  const fraudWords = ['congratulations', 'you won', 'you have won', 'prize', 'lottery', 'winner', 'claim your', 'free gift', 'reward'];
  const foundFraud = fraudWords.filter(w => textLower.includes(w));
  if (foundFraud.length > 0) {
    indicators.push({ id: 'prize_scam', label: 'Prize/scam language', description: `Fraud keywords: "${foundFraud.join('", "')}"`, severity: 'high', category: 'observed' });
    score += 30;
  }

  // Financial scam
  const finWords = ['bank', 'account', 'verify', 'suspended', 'urgent', 'transfer', 'payment', 'credit'];
  const foundFin = finWords.filter(w => textLower.includes(w));
  if (foundFin.length >= 2) {
    indicators.push({ id: 'financial_scam', label: 'Financial scam pattern', description: 'SMS references banking/financial urgency.', severity: 'high', category: 'observed' });
    score += 25;
  }

  // URL in SMS
  const urlMatch = input.text.match(/https?:\/\/[^\s]+/i) || (input.url ? [input.url] : []);
  if (urlMatch.length > 0) {
    for (const url of urlMatch) {
      if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('t.co') || url.includes('rb.gy')) {
        indicators.push({ id: 'short_url', label: 'Shortened URL', description: `Hidden destination: ${url}`, severity: 'moderate', category: 'observed' });
        score += 15;
      }
      if (url.includes('login') || url.includes('verify') || url.includes('secure') || url.includes('update')) {
        indicators.push({ id: 'deceptive_url', label: 'Deceptive URL keywords', description: `URL contains suspicious terms: ${url}`, severity: 'high', category: 'observed' });
        score += 20;
      }
    }
    evidence.push({ category: 'observed', content: `URL found: ${urlMatch[0]}` });
  }

  // Threat language
  const threatWords = ['your account will be closed', 'legal action', 'police', 'arrest', 'penalty', 'fine'];
  const foundThreat = threatWords.filter(w => textLower.includes(w));
  if (foundThreat.length > 0) {
    indicators.push({ id: 'threat_language', label: 'Threatening language', description: 'Uses intimidation tactics.', severity: 'high', category: 'observed' });
    score += 20;
  }

  // OTP steal
  if (textLower.includes('otp') || textLower.includes('code') || textLower.includes('verification')) {
    indicators.push({ id: 'otp_request', label: 'OTP/code reference', description: 'May be attempting to steal verification codes.', severity: 'moderate', category: 'derived' });
    score += 10;
  }

  evidence.push({ category: 'observed', content: `SMS from: ${input.sender || 'Unknown'}` });
  const risk = scoreToRisk(score);

  if (score > 20) {
    recommendations.push({ priority: 'high', action: 'Do not click any links', description: 'Verify the sender independently before interacting.' });
    recommendations.push({ priority: 'high', action: 'Do not reply', description: 'Replying confirms your number is active.' });
  }
  if (score > 40) {
    recommendations.push({ priority: 'critical', action: 'Block the sender', description: 'Block this number and report as spam.' });
  }

  const explanation = risk === 'safe'
    ? 'This SMS shows no obvious scam indicators. However, always verify unexpected messages independently.'
    : risk === 'low'
    ? 'This SMS has minor suspicious elements. Be cautious and verify the sender.'
    : risk === 'moderate'
    ? 'This SMS shows several scam indicators. Do not click links or provide personal information.'
    : 'This SMS is highly likely a scam. Do not interact — block and report the sender.';

  const explanationUrdu = risk === 'safe'
    ? 'اس ایس ایم ایس میں کوئی واضح اسکیم کی نشانیاں نہیں ہیں۔'
    : risk === 'low'
    ? 'اس ایس ایم ایس میں معمولی مشکوک عناصر ہیں۔ احتیاط برتیں۔'
    : risk === 'moderate'
    ? 'اس ایس ایم ایس میں کئی اسکیم کی نشانیاں ہیں۔ لنکس پر کلک نہ کریں۔'
    : 'یہ ایس ایم ایس اسکیم ہے۔ فوری طور پر بلاک کریں اور رپورٹ کریں۔';

  return {
    riskLevel: risk,
    threatScore: Math.min(score, 100),
    confidence: indicators.length > 2 ? 'high' : 'moderate',
    indicators,
    evidence,
    recommendations,
    explanation,
    explanationUrdu,
    analysisType: 'sms',
  };
}

// ═══════════════ URL ANALYSIS ═══════════════

export function analyzeUrl(input: { url: string }): AnalysisResult {
  const indicators: AnalysisResult['indicators'] = [];
  const evidence: AnalysisResult['evidence'] = [];
  const recommendations: AnalysisResult['recommendations'] = [];
  let score = 0;

  let url: URL;
  try {
    url = new URL(input.url);
  } catch {
    return {
      riskLevel: 'moderate',
      threatScore: 40,
      confidence: 'low',
      indicators: [{ id: 'invalid_url', label: 'Invalid URL', description: 'The URL could not be parsed. It may be malformed.', severity: 'moderate', category: 'observed' }],
      evidence: [{ category: 'observed', content: `Input: ${input.url}` }],
      recommendations: [{ priority: 'high', action: 'Do not visit this URL', description: 'The URL format is suspicious.' }],
      explanation: 'This URL is malformed and cannot be properly evaluated.',
      explanationUrdu: 'یہ یو آر ایل غلط فارمیٹ میں ہے۔',
      analysisType: 'url',
    };
  }

  const host = url.hostname.toLowerCase();
  const fullUrl = url.toString().toLowerCase();

  // HTTP check
  if (url.protocol === 'http:') {
    indicators.push({ id: 'no_https', label: 'No HTTPS', description: 'This site does not use encryption.', severity: 'moderate', category: 'observed' });
    score += 15;
  }

  // IP address as host
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    indicators.push({ id: 'ip_host', label: 'IP address hostname', description: 'Using an IP address instead of a domain name is suspicious.', severity: 'high', category: 'observed' });
    score += 25;
  }

  // Suspicious TLDs
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.buzz', '.club'];
  if (suspiciousTlds.some(tld => host.endsWith(tld))) {
    indicators.push({ id: 'suspicious_tld', label: 'Suspicious TLD', description: `Domain uses a commonly abused TLD: ${host.split('.').pop()}`, severity: 'moderate', category: 'observed' });
    score += 15;
  }

  // Brand impersonation
  const brands = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'netflix', 'instagram', 'facebook', 'whatsapp', 'twitter'];
  const foundBrands = brands.filter(b => host.includes(b));
  if (foundBrands.length > 0) {
    const domainParts = host.split('.');
    const brandIndex = domainParts.findIndex(p => foundBrands.some(b => p.includes(b)));
    if (brandIndex > 0 && !host.endsWith(`${foundBrands[0]}.com`) && !host.endsWith(`${foundBrands[0]}.co.uk`)) {
      indicators.push({ id: 'brand_impersonation', label: 'Possible brand impersonation', description: `Domain "${host}" references ${foundBrands.join(',')} but is not official.`, severity: 'critical', category: 'derived' });
      score += 35;
    }
  }

  // URL length
  if (fullUrl.length > 100) {
    indicators.push({ id: 'long_url', label: 'Unusually long URL', description: `${fullUrl.length} characters — may be hiding the real destination.`, severity: 'low', category: 'observed' });
    score += 5;
  }

  // @ symbol trick
  if (fullUrl.includes('@')) {
    indicators.push({ id: 'at_symbol', label: '@ symbol in URL', description: 'The @ symbol can redirect browsers to a different site.', severity: 'high', category: 'observed' });
    score += 30;
  }

  // Multiple subdomains
  if (host.split('.').length > 3) {
    indicators.push({ id: 'many_subdomains', label: 'Excessive subdomains', description: `Domain has ${host.split('.').length} parts — often used to fake legitimacy.`, severity: 'moderate', category: 'observed' });
    score += 10;
  }

  evidence.push({ category: 'observed', content: `URL: ${input.url}` });
  evidence.push({ category: 'observed', content: `Host: ${host}` });
  evidence.push({ category: 'observed', content: `Protocol: ${url.protocol}` });

  const risk = scoreToRisk(score);

  if (score > 20) {
    recommendations.push({ priority: 'high', action: 'Do not visit this URL', description: 'Navigate to the official site directly instead.' });
  }
  if (score > 40) {
    recommendations.push({ priority: 'critical', action: 'Block this URL', description: 'Add to your blocklist and report as malicious.' });
  }
  if (score <= 20) {
    recommendations.push({ priority: 'low', action: 'Proceed with caution', description: 'While this URL appears relatively safe, always verify before entering credentials.' });
  }

  const explanation = risk === 'safe'
    ? 'This URL appears to be legitimate with no obvious red flags.'
    : risk === 'low'
    ? 'This URL has minor concerns but is likely safe. Exercise normal caution.'
    : risk === 'moderate'
    ? 'This URL shows suspicious characteristics. Do not enter personal information.'
    : 'This URL is highly suspicious and may be malicious. Do not visit.';

  const explanationUrdu = risk === 'safe'
    ? 'یہ یو آر ایل جائز لگتا ہے۔'
    : risk === 'low'
    ? 'اس یو آر ایل میں معمولی فکریں ہیں۔'
    : risk === 'moderate'
    ? 'اس یو آر ایل میں مشکوک عناصر ہیں۔ ذاتی معلومات درج نہ کریں۔'
    : 'یہ یو آر ایل بہت مشکوک ہے۔ اس پر نہ جائیں۔';

  return {
    riskLevel: risk,
    threatScore: Math.min(score, 100),
    confidence: indicators.length > 2 ? 'high' : 'moderate',
    indicators,
    evidence,
    recommendations,
    explanation,
    explanationUrdu,
    analysisType: 'url',
  };
}

// ═══════════════ PASSWORD ANALYSIS ═══════════════

export function analyzePassword(input: { password: string }): AnalysisResult {
  const pw = input.password;
  const indicators: AnalysisResult['indicators'] = [];
  const evidence: AnalysisResult['evidence'] = [];
  const recommendations: AnalysisResult['recommendations'] = [];
  const problems: string[] = [];
  const improvementSuggestions: string[] = [];
  let score = 0;

  // Length check
  if (pw.length < 8) { problems.push('Too short (less than 8 characters)'); score += 30; }
  else if (pw.length < 12) { problems.push('Could be longer (less than 12 characters)'); score += 10; }
  if (pw.length >= 12) { indicators.push({ id: 'good_length', label: 'Good length', description: `${pw.length} characters — meets minimum length requirements.`, severity: 'low', category: 'observed' }); }

  // Character variety
  if (!/[A-Z]/.test(pw)) { problems.push('No uppercase letters'); score += 15; improvementSuggestions.push('Add uppercase letters (A-Z)'); }
  if (!/[a-z]/.test(pw)) { problems.push('No lowercase letters'); score += 15; improvementSuggestions.push('Add lowercase letters (a-z)'); }
  if (!/[0-9]/.test(pw)) { problems.push('No numbers'); score += 10; improvementSuggestions.push('Add numbers (0-9)'); }
  if (!/[^A-Za-z0-9]/.test(pw)) { problems.push('No special characters'); score += 10; improvementSuggestions.push('Add special characters (!@#$%^&*)'); }

  // Common passwords
  const common = ['password', '123456', '12345678', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'master', 'login', '1234567', '12345', 'iloveyou', 'password1', 'qwerty123'];
  if (common.includes(pw.toLowerCase())) { problems.push('This is a commonly used password'); score += 50; }
  if (common.some(c => pw.toLowerCase().includes(c))) { problems.push('Contains a common password pattern'); score += 25; }

  // Repeated characters
  if (/(.)\1{2,}/.test(pw)) { problems.push('Contains repeated characters (e.g., "aaa")'); score += 10; }

  // Sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pw)) {
    problems.push('Contains sequential characters'); score += 10;
  }

  // Calculate strength
  let strength: string;
  let crackTime: string;
  if (score >= 60) { strength = 'very_weak'; crackTime = 'Instantly'; }
  else if (score >= 40) { strength = 'weak'; crackTime = 'Minutes to hours'; }
  else if (score >= 25) { strength = 'moderate'; crackTime = 'Days to months'; }
  else if (score >= 10) { strength = 'strong'; crackTime = 'Years'; }
  else { strength = 'very_strong'; crackTime = 'Centuries'; }

  if (problems.length === 0) {
    indicators.push({ id: 'strong_password', label: 'Strong password', description: 'This password meets all security requirements.', severity: 'low', category: 'observed' });
  }

  evidence.push({ category: 'observed', content: `Length: ${pw.length} characters` });
  evidence.push({ category: 'observed', content: `Strength: ${strength}` });

  if (score > 0) {
    recommendations.push({ priority: 'high', action: 'Use a password manager', description: 'Generate and store unique passwords with a password manager.' });
    if (pw.length < 12) recommendations.push({ priority: 'high', action: 'Use at least 12 characters', description: 'Longer passwords are exponentially harder to crack.' });
  }
  if (score <= 10) {
    recommendations.push({ priority: 'low', action: 'Great password!', description: 'This password is strong. Make sure to use a unique password for each account.' });
  }

  const explanation = strength === 'very_strong' || strength === 'strong'
    ? 'This is a strong password that would be very difficult to crack.'
    : strength === 'moderate'
    ? 'This password has some weaknesses. Consider making it longer and more complex.'
    : 'This password is weak and could be cracked quickly. Please choose a stronger password.';

  const explanationUrdu = strength === 'very_strong' || strength === 'strong'
    ? 'یہ ایک مضبوط پاس ورڈ ہے جو توڑنا بہت مشکل ہے۔'
    : strength === 'moderate'
    ? 'اس پاس ورڈ میں کمزوریاں ہیں۔ اسے لمبا اور پیچیدہ بنائیں۔'
    : 'یہ پاس ورڈ کمزور ہے۔ بہتر پاس ورڈ منتخب کریں۔';

  return {
    riskLevel: score >= 40 ? 'high' : score >= 20 ? 'moderate' : 'safe',
    threatScore: Math.min(score, 100),
    confidence: 'high',
    indicators,
    evidence,
    recommendations,
    explanation,
    explanationUrdu,
    analysisType: 'password',
    strength,
    crackTimeEstimate: crackTime,
    problems,
    improvementSuggestions,
  };
}

// ═══════════════ QR TEXT ANALYSIS ═══════════════

export function analyzeQrText(content: string): AnalysisResult {
  // Try to analyze as URL
  if (content.startsWith('http://') || content.startsWith('https://')) {
    const result = analyzeUrl({ url: content });
    result.analysisType = 'qr';
    return result;
  }

  // Generic text analysis
  const indicators: AnalysisResult['indicators'] = [];
  const recommendations: AnalysisResult['recommendations'] = [];
  let score = 0;

  if (content.includes('login') || content.includes('verify') || content.includes('password')) {
    indicators.push({ id: 'qr_login_attempt', label: 'QR contains login/verify text', description: 'This QR code may redirect to a phishing page.', severity: 'moderate', category: 'observed' });
    score += 20;
  }

  if (content.includes('http://')) {
    indicators.push({ id: 'qr_http', label: 'QR contains insecure URL', description: 'Uses HTTP instead of HTTPS.', severity: 'moderate', category: 'observed' });
    score += 15;
  }

  const risk = scoreToRisk(score);
  if (score > 20) {
    recommendations.push({ priority: 'high', action: 'Do not scan this QR code', description: 'The content appears suspicious.' });
  }

  return {
    riskLevel: risk,
    threatScore: Math.min(score, 100),
    confidence: indicators.length > 0 ? 'moderate' : 'low',
    indicators,
    evidence: [{ category: 'observed', content: `QR content: ${content.substring(0, 200)}` }],
    recommendations,
    explanation: score > 20
      ? 'This QR code contains suspicious content. Do not follow the instructions or visit the URL.'
      : 'This QR code contains text that could not be fully evaluated. Exercise caution.',
    explanationUrdu: score > 20
      ? 'اس کیو آر کوڈ میں مشکوک مواد ہے۔ اس پر عمل نہ کریں۔'
      : 'اس کیو آر کوڈ کا مواد مکمل طور پر جانچا نہیں جا سکتا۔',
    analysisType: 'qr',
  };
}
