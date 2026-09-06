/**
 * Cyber Guardian AI — Email Phishing Analyzer
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { ThreatResult } from '@/components/ThreatResult';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnalysisResult } from '@/types';

interface Props {
  addHistory: (type: string, risk: string, summary: string, result: AnalysisResult) => void;
}

export function EmailAnalyzer({ addHistory }: Props) {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [body, setBody] = useState('');
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!subject.trim() && !body.trim()) {
      setError(t('Please provide at least a subject or email body.', 'براہ کم موضوع یا ای میل کا متن فراہم کریں۔'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const links = urls.split('\n').map(u => u.trim()).filter(Boolean);
      const response = await api.analyzeEmail({
        subject: subject.trim(),
        sender: sender.trim() || 'unknown@unknown.com',
        body: body.trim(),
        links,
      });
      setResult(response);
      addHistory('Email Analysis', response.riskLevel, subject.trim() || 'Email analyzed', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Analysis failed', 'تجزیہ ناکام'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-magenta" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('Email Phishing Analyzer', 'ای میل فشنگ تجزیہ کار')}</h1>
        </div>
        <p className="text-graphite-400 mb-8">
          {t('Paste or type the suspicious email details below for analysis.', 'تجزیہ کے لیے نیچے مشکوک ای میل کی تفصیلات پیسٹ یا ٹائپ کریں۔')}
        </p>
      </motion.div>

      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Subject', 'موضوع')}</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., URGENT: Verify your account"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Sender Email', 'بھیجنے والا ای میل')}</label>
            <input
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g., security@bank-example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Email Body *', 'ای میل کا متن *')}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the suspicious email content here..."
              rows={8}
              className="textarea-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('URLs in Email (optional, one per line)', 'ای میل میں یو آر ایلز (اختیاری، فی قطار ایک)')}</label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://suspicious-link.com&#10;https://another-link.com"
              rows={3}
              className="textarea-field font-mono text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('Analyzing threat...', 'خطرے کا تجزیہ ہو رہا ہے...')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('Analyze Email', 'ای میل کا تجزیہ کریں')}
              </>
            )}
          </button>
        </motion.div>
      )}

      {result && (
        <div>
          <button
            onClick={() => { setResult(null); setError(null); }}
            className="btn-secondary mb-6"
          >
            ← {t('Analyze another email', 'دوسرے ای میل کا تجزیہ کریں')}]
          </button>
          <ThreatResult result={result} />
        </div>
      )}
    </div>
  );
}
