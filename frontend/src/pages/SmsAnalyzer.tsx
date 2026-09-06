/**
 * Cyber Guardian AI — SMS Scam Analyzer
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { ThreatResult } from '@/components/ThreatResult';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnalysisResult } from '@/types';

interface Props {
  addHistory: (type: string, risk: string, summary: string, result: AnalysisResult) => void;
}

export function SmsAnalyzer({ addHistory }: Props) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError(t('Please enter the SMS text.', 'براہ کہ ایس ایم ایس کا متن درج کریں۔'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeSms({
        text: text.trim(),
        sender: sender.trim() || undefined,
      });
      setResult(response);
      addHistory('SMS Analysis', response.riskLevel, text.trim().substring(0, 50), response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Analysis failed', 'تجزیہ ناکام'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-teal" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('SMS Scam Analyzer', 'ایس ایم ایس اسکیم تجزیہ کار')}</h1>
        </div>
        <p className="text-graphite-400 mb-8">
          {t('Paste or type the suspicious text message below for analysis.', 'تجزیہ کے لیے نیچے مشکوک ٹیکسٹ پیغام پیسٹ یا ٹائپ کریں۔')}
        </p>
      </motion.div>

      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('SMS Text *', 'ایس ایم ایس متن *')}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('Paste the suspicious text message here...', 'یہاں مشکوک ٹیکسٹ پیغام پیسٹ کریں...')}
              rows={6}
              className="textarea-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Sender (optional)', 'بھیجنے والا (اختیاری)')}</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={t('e.g., +1234567890 or BankName', 'جیسے، +1234567890 یا بینک کا نام')}
              className="input-field"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('Analyzing...', 'تجزیہ ہو رہا ہے...')}</> : <><Send className="w-5 h-5" /> {t('Analyze SMS', 'ایس ایم ایس کا تجزیہ کریں')}</>}
          </button>
        </motion.div>
      )}

      {result && (
        <div>
          <button onClick={() => { setResult(null); setError(null); }} className="btn-secondary mb-6">← {t('Analyze another SMS', 'دوسرے ایس ایم ایس کا تجزیہ کریں')}</button>
          <ThreatResult result={result} />
        </div>
      )}
    </div>
  );
}
