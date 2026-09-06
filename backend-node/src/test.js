/**
 * Cyber Guardian AI — Backend Test
 * Run: node src/test.js
 */
import { analyzeEmail } from './analyzers/email.js';
import { analyzeSms } from './analyzers/sms.js';
import { analyzeUrl } from './analyzers/url.js';
import { analyzePassword } from './analyzers/password.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  PASS  ' + name);
  } catch (err) {
    failed++;
    console.log('  FAIL  ' + name + ': ' + err.message);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('');
console.log('Cyber Guardian AI — Running Tests');
console.log('==================================');

// ─── Email Tests ─────────────────────────────────────────────────────────────

console.log('');
console.log('Email Analyzer:');

test('Safe email detected', () => {
  const r = analyzeEmail({
    subject: 'Meeting tomorrow',
    sender: 'colleague@company.com',
    body: 'Hi, just a reminder about our meeting tomorrow at 3pm.',
  });
  assert(r.riskLevel === 'safe', 'Expected safe, got ' + r.riskLevel);
  assert(r.analysisType === 'email', 'Wrong analysisType');
  assert(r.explanationUrdu.length > 0, 'Missing Urdu explanation');
});

test('Phishing email detected', () => {
  const r = analyzeEmail({
    subject: 'URGENT: Verify your account',
    sender: 'security@bank.com',
    body: 'Your account is compromised. Click here immediately. Verify your identity now.',
  });
  assert(r.riskLevel === 'moderate' || r.riskLevel === 'high' || r.riskLevel === 'critical',
    'Expected threat, got ' + r.riskLevel);
  assert(r.indicators.length > 0, 'No indicators found');
});

test('Credential request detected', () => {
  const r = analyzeEmail({
    subject: 'Update required',
    sender: 'admin@example.com',
    body: 'Please send your password and credit card number for verification.',
  });
  const hasCred = r.indicators.some((i) => i.id === 'credential_request');
  assert(hasCred, 'Credential request not detected');
});

// ─── SMS Tests ───────────────────────────────────────────────────────────────

console.log('');
console.log('SMS Analyzer:');

test('Safe SMS detected', () => {
  const r = analyzeSms({ text: 'Your package is arriving today at 5pm.' });
  assert(r.riskLevel === 'safe', 'Expected safe, got ' + r.riskLevel);
  assert(r.analysisType === 'sms', 'Wrong analysisType');
});

test('Prize scam detected', () => {
  const r = analyzeSms({ text: 'Congratulations! You won a prize! Claim now.' });
  assert(r.indicators.length > 0, 'No indicators found');
  assert(r.threatScore > 0, 'Threat score should be > 0');
});

test('OTP scam detected', () => {
  const r = analyzeSms({ text: 'Share your OTP code with us to verify.' });
  const hasOtp = r.indicators.some((i) => i.id.includes('otp'));
  assert(hasOtp, 'OTP scam not detected');
});

// ─── URL Tests ───────────────────────────────────────────────────────────────

console.log('');
console.log('URL Analyzer:');

test('Safe HTTPS URL detected', () => {
  const r = analyzeUrl('https://google.com');
  assert(r.riskLevel === 'safe', 'Expected safe, got ' + r.riskLevel);
  assert(r.analysisType === 'url', 'Wrong analysisType');
});

test('HTTP URL flagged', () => {
  const r = analyzeUrl('http://example.com');
  const hasNoHttps = r.indicators.some((i) => i.id === 'no_https');
  assert(hasNoHttps, 'HTTP not flagged');
});

test('Suspicious TLD detected', () => {
  const r = analyzeUrl('https://malicious.xyz');
  const hasTld = r.indicators.some((i) => i.id === 'suspicious_tld');
  assert(hasTld, 'Suspicious TLD not detected');
});

test('IP address URL detected', () => {
  const r = analyzeUrl('http://192.168.1.1/login');
  const hasIp = r.indicators.some((i) => i.id === 'ip_url');
  assert(hasIp, 'IP address URL not detected');
});

test('Invalid URL handled gracefully', () => {
  const r = analyzeUrl('not-a-url');
  // 'not-a-url' becomes https://not-a-url which is parseable
  assert(r.riskLevel !== undefined, 'Should return a valid result');
  assert(r.analysisType === 'url', 'Wrong analysisType');
  assert(typeof r.explanationUrdu === 'string', 'Missing Urdu explanation');
});

// ─── Password Tests ──────────────────────────────────────────────────────────

console.log('');
console.log('Password Analyzer:');

test('Weak password detected', () => {
  const r = analyzePassword('password');
  assert(r.strength === 'weak' || r.strength === 'very_weak', 'Expected weak or very_weak, got ' + r.strength);
  assert(r.problems.length > 0, 'No problems found');
  assert(r.crackTimeEstimate.length > 0, 'Missing crack time');
  assert(r.explanationUrdu.length > 0, 'Missing Urdu explanation');
});

test('Strong password detected', () => {
  const r = analyzePassword('T!g3r_M0unt@in#Rain2024!Zq');
  assert(r.strength === 'very_strong' || r.strength === 'strong',
    'Expected strong, got ' + r.strength);
});

test('Short password detected', () => {
  const r = analyzePassword('abc');
  const hasShort = r.indicators.some((i) => i.id === 'pw_short');
  assert(hasShort, 'Short password not detected');
});

test('Common password detected', () => {
  const r = analyzePassword('123456');
  const hasCommon = r.indicators.some((i) => i.id === 'pw_common');
  assert(hasCommon, 'Common password not detected');
});

test('Empty password handled', () => {
  const r = analyzePassword('');
  assert(r.riskLevel !== undefined, 'Should return a result');
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('');
console.log('==================================');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
console.log('');

process.exit(failed > 0 ? 1 : 0);
