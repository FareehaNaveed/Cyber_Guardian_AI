/**
 * Cyber Guardian AI — Password Security Analyzer
 * Pure deterministic analysis. No AI. Passwords NEVER stored.
 */

const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
  '1234567', 'letmein', 'trustno1', 'dragon', 'baseball',
  'iloveyou', 'master', 'sunshine', 'admin', 'welcome',
  'hello', 'charlie', 'password1', 'password123',
]);

const SEQUENTIAL_PATTERNS = [
  'abcdefghijklmnopqrstuvwxyz',
  'zyxwvutsrqponmlkjihgfedcba',
  '01234567890',
  '09876543210',
  'qwertyuiop',
];

export function analyzePassword(password) {
  const indicators = [];
  const evidence = [];
  const problems = [];
  const suggestions = [];
  let score = 0;

  // --- Length ---
  if (password.length < 6) {
    problems.push('Too short (less than 6 characters)');
    indicators.push({
      id: 'pw_short',
      label: 'Very short password',
      description: 'Under 6 characters can be cracked instantly.',
      severity: 'critical',
      category: 'observed',
    });
    evidence.push('Length: ' + password.length + ' characters');
    score += 40;
  } else if (password.length < 8) {
    problems.push('Short (less than 8 characters)');
    score += 20;
  }

  // --- Character diversity ---
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const diversity = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

  if (diversity <= 1) {
    indicators.push({
      id: 'pw_low_diversity',
      label: 'Low character diversity',
      description: 'Only one type of character used.',
      severity: 'high',
      category: 'observed',
    });
    evidence.push('Character types: ' + diversity + '/4');
    score += 25;
  }

  if (!hasUpper) problems.push('No uppercase letters');
  if (!hasLower) problems.push('No lowercase letters');
  if (!hasDigit) problems.push('No numbers');
  if (!hasSpecial) problems.push('No special characters');

  // --- Repeated characters ---
  if (/(.)\1{2,}/.test(password)) {
    problems.push('Contains repeated characters');
    indicators.push({
      id: 'pw_repeated',
      label: 'Repeated characters',
      description: 'Repeated sequences make passwords easier to crack.',
      severity: 'low',
      category: 'observed',
    });
    score += 10;
  }

  // --- Sequential patterns ---
  const pwLower = password.toLowerCase();
  for (const seq of SEQUENTIAL_PATTERNS) {
    let found = false;
    for (let i = 0; i <= seq.length - 3; i++) {
      if (pwLower.includes(seq.substring(i, i + 3))) {
        problems.push('Contains sequential pattern');
        indicators.push({
          id: 'pw_sequential',
          label: 'Sequential pattern',
          description: 'Sequential characters are easily guessed.',
          severity: 'moderate',
          category: 'observed',
        });
        score += 15;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // --- Common password ---
  if (COMMON_PASSWORDS.has(pwLower)) {
    problems.push('This is a commonly used password');
    indicators.push({
      id: 'pw_common',
      label: 'Common password',
      description: 'Appears in known lists of frequently used passwords.',
      severity: 'critical',
      category: 'observed',
    });
    evidence.push('Found in common password database');
    score += 50;
  }

  // --- Suggestions ---
  if (password.length < 12) suggestions.push('Use at least 12 characters');
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasDigit) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');
  suggestions.push('Use a unique password for each account');

  // --- Crack time estimate ---
  const charsetSize =
    (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 32 : 0);
  const combinations = Math.pow(charsetSize || 1, password.length);
  const seconds = combinations / 1e10 / 2;
  const crackTime = formatCrackTime(seconds);

  score = Math.min(score, 100);
  const riskLevel = toRisk(score);

  return {
    riskLevel,
    threatScore: score,
    confidence: 'high',
    strength: getStrength(riskLevel),
    crackTimeEstimate: crackTime,
    indicators,
    evidence: evidence.map((e) => ({ category: 'observed', content: e })),
    problems,
    improvementSuggestions: suggestions,
    recommendations: [
      { priority: 'high', action: 'Use a password manager', description: 'Generates and stores strong, unique passwords.' },
      { priority: 'medium', action: 'Enable two-factor authentication', description: 'Add an extra layer of security.' },
      ...(riskLevel !== 'safe'
        ? [{ priority: 'high', action: 'Change this password immediately', description: 'Replace with a strong, unique password.' }]
        : []),
    ],
    explanation: 'Password rated ' + getStrength(riskLevel) + '. Estimated crack time: ' + crackTime + '. ' + problems.length + ' issue' + (problems.length !== 1 ? 's' : '') + ' found.',
    explanationUrdu: 'یہ پاس ورڈ ' + getStrengthUrdu(riskLevel) + ' ہے۔ تخمینہ وقت: ' + crackTime + '۔ ' + problems.length + ' مسئلہ ملے۔',
    analysisType: 'password',
  };
}

function toRisk(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'safe';
}

function getStrength(risk) {
  return { critical: 'very_weak', high: 'weak', moderate: 'moderate', low: 'strong', safe: 'very_strong' }[risk] || 'moderate';
}

function getStrengthUrdu(risk) {
  return { critical: 'بہت کمزور', high: 'کمزور', moderate: 'درمیانی', low: 'مضبوط', safe: 'بہت مضبوط' }[risk] || 'درمیانی';
}

function formatCrackTime(seconds) {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return 'Less than a minute';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours';
  if (seconds < 31536000) return Math.floor(seconds / 86400) + ' days';
  if (seconds < 31536000 * 1000) return Math.floor(seconds / 31536000) + ' years';
  return 'Millions of years';
}
