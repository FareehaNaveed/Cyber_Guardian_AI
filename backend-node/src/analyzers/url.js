/**
 * Cyber Guardian AI — URL/Website Safety Analyzer
 * Pure deterministic pattern-based analysis. No AI.
 */

const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top',
  '.buzz', '.click', '.download', '.work', '.club',
];

const BRAND_DOMAINS = [
  'paypal.com', 'amazon.com', 'apple.com', 'microsoft.com',
  'google.com', 'netflix.com',
];

export function analyzeUrl(url) {
  const indicators = [];
  const evidence = [];
  let score = 0;

  // Normalize
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return errorResult('Invalid URL format.');
  }

  const hostname = parsed.hostname || '';

  // --- HTTPS check ---
  if (parsed.protocol === 'http:') {
    indicators.push({
      id: 'no_https',
      label: 'Not using HTTPS',
      description: 'Data may be intercepted without encryption.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('Protocol: HTTP (not encrypted)');
    score += 15;
  } else {
    evidence.push('Protocol: HTTPS (encrypted)');
  }

  // --- IP address instead of domain ---
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    indicators.push({
      id: 'ip_url',
      label: 'IP address instead of domain',
      description: 'Unusual for legitimate sites.',
      severity: 'high',
      category: 'observed',
    });
    evidence.push('Hostname: ' + hostname + ' (IP address)');
    score += 30;
  }

  // --- Long URL ---
  if (url.length > 200) {
    indicators.push({
      id: 'long_url',
      label: 'Unusually long URL',
      description: 'Very long URLs can hide malicious destinations.',
      severity: 'low',
      category: 'observed',
    });
    evidence.push('URL length: ' + url.length + ' characters');
    score += 10;
  }

  // --- Suspicious characters ---
  if (hostname.includes('@') || hostname.includes('--')) {
    indicators.push({
      id: 'suspicious_chars',
      label: 'Suspicious characters in URL',
      description: 'Unusual characters may indicate an attack.',
      severity: 'high',
      category: 'observed',
    });
    score += 25;
  }

  // --- Suspicious TLD ---
  const parts = hostname.split('.');
  const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : '';
  if (SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
    indicators.push({
      id: 'suspicious_tld',
      label: 'Suspicious top-level domain',
      description: 'The domain uses ' + tld + ', commonly associated with malicious sites.',
      severity: 'moderate',
      category: 'observed',
    });
    evidence.push('TLD: ' + tld);
    score += 15;
  }

  // --- Excessive subdomains ---
  if (parts.length > 4) {
    indicators.push({
      id: 'excessive_subdomains',
      label: 'Excessive subdomains',
      description: 'Multiple subdomains can disguise the actual domain.',
      severity: 'moderate',
      category: 'derived',
    });
    evidence.push((parts.length - 2) + ' subdomains detected');
    score += 15;
  }

  // --- Brand impersonation ---
  const hostLower = hostname.toLowerCase();
  for (const brand of BRAND_DOMAINS) {
    const brandName = brand.split('.')[0];
    if (hostLower.includes(brandName) && !hostLower.endsWith(brand)) {
      indicators.push({
        id: 'brand_impersonation',
        label: 'Possible brand impersonation',
        description: 'Domain appears to impersonate ' + brand + '.',
        severity: 'critical',
        category: 'derived',
      });
      evidence.push('Expected: ' + brand + ', Found: ' + hostname);
      score += 40;
      break;
    }
  }

  // --- Heavy encoding ---
  if (parsed.pathname && (parsed.pathname.match(/%/g) || []).length > 3) {
    indicators.push({
      id: 'heavy_encoding',
      label: 'Heavy URL encoding',
      description: 'Excessive encoding may obfuscate the destination.',
      severity: 'low',
      category: 'observed',
    });
    score += 10;
  }

  // --- Redirect parameters ---
  const query = parsed.search || '';
  if (['redirect', 'url=', 'next=', 'return='].some((p) => query.includes(p))) {
    indicators.push({
      id: 'redirect_param',
      label: 'Contains redirect parameter',
      description: 'May redirect to an unexpected destination.',
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
    recommendations: urlRecs(riskLevel),
    explanation: urlExplanation(riskLevel, indicators.length),
    explanationUrdu: urlExplanationUrdu(riskLevel, indicators.length),
    analysisType: 'url',
    note: 'Assessment is based on URL characteristics and local pattern analysis.',
  };
}

function errorResult(message) {
  return {
    riskLevel: 'moderate',
    threatScore: 30,
    confidence: 'low',
    indicators: [{ id: 'invalid_url', label: 'Invalid URL', description: message, severity: 'moderate', category: 'observed' }],
    evidence: [],
    recommendations: [{ priority: 'medium', action: 'Verify the URL format', description: 'Ensure the URL is complete and properly formatted.' }],
    explanation: message,
    explanationUrdu: 'یو آر ایل کو پارس نہیں کیا جا سکا۔',
    analysisType: 'url',
  };
}

function toRisk(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'safe';
}

function urlExplanation(risk, count) {
  if (risk === 'safe') return 'This URL appears safe based on its characteristics.';
  if (risk === 'low') return 'This URL has minor concerns. Exercise normal caution.';
  if (risk === 'moderate') return 'This URL shows suspicious characteristics. Do not enter personal information.';
  if (risk === 'high') return 'This URL is highly suspicious. Do not visit or enter credentials.';
  return 'This URL shows critical risk indicators. Avoid completely.';
}

function urlExplanationUrdu(risk, count) {
  if (risk === 'safe') return 'یہ یو آر ایل اپنی خصوصیات کے مطابق محفوظ لگتا ہے۔';
  if (risk === 'low') return 'اس یو آر ایل میں معمولی فکریں ہیں۔ محتاط رہیں۔';
  if (risk === 'moderate') return 'اس یو آر ایل میں مشکوک عناصر ہیں۔ ذاتی معلومات درج نہ کریں۔';
  if (risk === 'high') return 'یہ یو آر ایل بہت مشکوک ہے۔ اس پر نہ جائیں۔';
  return 'یہ یو آر ایل انتہائی خطرناک ہے۔ بالکل استعمال نہ کریں۔';
}

function urlRecs(risk) {
  if (risk === 'safe') {
    return [{ priority: 'low', action: 'This URL appears safe', description: 'Always verify before entering sensitive information.' }];
  }
  return [
    { priority: 'high', action: 'Do not visit this URL', description: 'This URL shows signs of being suspicious.' },
    { priority: 'high', action: 'Do not enter personal information', description: 'If you already visited, check for unauthorized access.' },
  ];
}
