/**
 * Cyber Guardian AI — Password Security Checker
 * Client-side only. Passwords are NEVER stored, logged, or transmitted.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  addHistory: (type: string, risk: string, summary: string) => void;
}

interface PasswordResult {
  riskLevel: string;
  strength: string;
  score: number;
  crackTime: string;
  problems: string[];
  suggestions: string[];
}

function analyzePasswordClient(password: string): PasswordResult {
  const problems: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Length
  if (password.length < 6) {
    problems.push('Too short (less than 6 characters)');
    score += 40;
  } else if (password.length < 8) {
    problems.push('Short (less than 8 characters)');
    score += 20;
  }

  // Character diversity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const diversity = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

  if (diversity <= 1) {
    problems.push('Low character diversity');
    score += 25;
  }
  if (!hasUpper) problems.push('No uppercase letters');
  if (!hasLower) problems.push('No lowercase letters');
  if (!hasDigit) problems.push('No numbers');
  if (!hasSpecial) problems.push('No special characters');

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    problems.push('Contains repeated characters');
    score += 10;
  }

  // Sequential patterns
  const pw = password.toLowerCase();
  const seqs = ['abcdefghijklmnopqrstuvwxyz', '01234567890', 'qwertyuiop'];
  for (const seq of seqs) {
    for (let i = 0; i < seq.length - 2; i++) {
      if (seq.substring(i, i + 3) === pw.substring(0, 3) || pw.includes(seq.substring(i, i + 3))) {
        problems.push('Contains sequential pattern');
        score += 15;
        break;
      }
    }
  }

  // Common password
  const common = ['password', '123456', '12345678', 'qwerty', 'abc123', 'admin', 'welcome', 'letmein'];
  if (common.includes(pw)) {
    problems.push('This is a commonly used password');
    score += 50;
  }

  // Suggestions
  if (password.length < 12) suggestions.push('Use at least 12 characters');
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasDigit) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');
  suggestions.push('Consider using a passphrase with multiple random words');
  suggestions.push('Use a unique password for each account');

  // Crack time
  const charset = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 32 : 0);
  const combos = Math.pow(charset || 1, password.length);
  const seconds = combos / 1e10 / 2;
  let crackTime: string;
  if (seconds < 1) crackTime = 'Instantly';
  else if (seconds < 60) crackTime = 'Less than a minute';
  else if (seconds < 3600) crackTime = `${Math.floor(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.floor(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.floor(seconds / 86400)} days`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.floor(seconds / 31536000)} years`;
  else crackTime = 'Millions of years';

  score = Math.min(score, 100);

  let riskLevel: string;
  let strength: string;
  if (score >= 80) { riskLevel = 'critical'; strength = 'Very Weak'; }
  else if (score >= 60) { riskLevel = 'high'; strength = 'Weak'; }
  else if (score >= 40) { riskLevel = 'moderate'; strength = 'Moderate'; }
  else if (score >= 20) { riskLevel = 'low'; strength = 'Strong'; }
  else { riskLevel = 'safe'; strength = 'Very Strong'; }

  return { riskLevel, strength, score: 100 - score, crackTime, problems, suggestions };
}

export function PasswordChecker({ addHistory }: Props) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);

  const handleAnalyze = () => {
    if (!password) return;
    const r = analyzePasswordClient(password);
    setResult(r);
    addHistory('Password Check', r.riskLevel, `Strength: ${r.strength}`);
  };

  const strengthColors: Record<string, string> = {
    'Very Weak': 'bg-danger',
    'Weak': 'bg-orange-500',
    'Moderate': 'bg-amber-500',
    'Strong': 'bg-teal',
    'Very Strong': 'bg-emerald',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-danger" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('Password Security Checker', 'پاس ورڈ سیکیورٹی چیکر')}</h1>
        </div>
        <p className="text-graphite-400 mb-4">
          {t('Enter a password to check its strength. This analysis runs entirely in your browser.', 'اس کی طاقت جانچنے کے لیے پاس ورڈ درج کریں۔ یہ تجزیہ مکمل طور پر آپ کے براؤزر میں چلتا ہے۔')}
        </p>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-8">
          🔒 {t('Your password is NEVER stored, logged, or sent to any server. Analysis is 100% client-side.', 'آپ کا پاس ورڈ کبھی محفوظ، لاگ، یا کسی سرور کو نہیں بھیجا جاتا۔ تجزیہ 100% کلائینٹ سائیڈ ہے۔')}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Password *', 'پاس ورڈ *')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder={t('Enter password to check...', 'جانچنے کے لیے پاس ورڈ درج کریں...')}
              className="input-field font-mono text-lg pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-graphite-500 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={!password} className="btn-primary flex items-center gap-2 w-full justify-center">
          <Lock className="w-5 h-5" />
          {t('Check Password', 'پاس ورڈ جانچیں')}
        </button>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Strength card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-graphite-500 uppercase tracking-wider">{t('Strength Rating', 'طاقت کی درجہ بندی')}</p>
                <p className={cn('text-3xl font-bold font-display', getStrengthColor(result.strength))}>{result.strength}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-graphite-500 uppercase tracking-wider">{t('Est. Crack Time', 'تخمنہ توڑنے کا وقت')}</p>
                <p className="text-xl font-bold font-mono text-white">{result.crackTime}</p>
              </div>
            </div>
            <div className="h-3 bg-graphite-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.score}%` }}
                transition={{ duration: 1 }}
                className={cn('h-full rounded-full', strengthColors[result.strength])}
              />
            </div>
          </div>

          {/* Problems */}
          {result.problems.length > 0 && (
            <div className="glass-card p-6">
              <h4 className="font-semibold text-danger mb-3">{t('Problems Found', 'مسائل دریافت')}</h4>
              <div className="space-y-2">
                {result.problems.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-graphite-300">
                    <XCircle className="w-4 h-4 text-danger flex-shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="glass-card p-6">
            <h4 className="font-semibold text-emerald-400 mb-3">{t('Recommendations', 'تجویزات')}</h4>
            <div className="space-y-2">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-graphite-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { setResult(null); setPassword(''); }} className="btn-secondary">← {t('Check another password', 'دوسرے پاس ورڈ کی جانچ کریں')}</button>
        </motion.div>
      )}
    </div>
  );
}

function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'Very Weak': return 'text-danger';
    case 'Weak': return 'text-orange-400';
    case 'Moderate': return 'text-amber-400';
    case 'Strong': return 'text-teal-400';
    case 'Very Strong': return 'text-emerald-400';
    default: return 'text-graphite-400';
  }
}
