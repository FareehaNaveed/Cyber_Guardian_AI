/**
 * Cyber Guardian AI — URL/Website Safety Analyzer
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { ThreatResult } from '@/components/ThreatResult';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnalysisResult } from '@/types';

interface Props {
  addHistory: (type: string, risk: string, summary: string, result: AnalysisResult) => void;
}

export function UrlAnalyzer({ addHistory }: Props) {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError(t('Please enter a URL.', 'براہ کہ یو آر ایل درج کریں۔'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeUrl({ url: url.trim() });
      setResult(response);
      addHistory('URL Analysis', response.riskLevel, url.trim().substring(0, 60), response);
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
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('Website Safety Check', 'ویب سائٹ حفاظت جانچ')}</h1>
        </div>
        <p className="text-graphite-400 mb-8">
          {t('Enter a URL to analyze its safety and detect potential threats.', 'اس کی حفاظت کا تجزیہ کرنے اور ممکنہ خطرات کی نشاندہی کے لیے یو آر ایل درج کریں۔')}
        </p>
      </motion.div>

      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
          {/* Info note */}
          <div className="p-4 rounded-xl bg-graphite-800/30 border border-graphite-700/50 text-sm text-graphite-400">
            <p className="font-medium text-graphite-300 mb-1">⚠️ {t('External threat intelligence note', 'بیرونی خطرے کی معلومات کا نوٹ')}</p>
            <p>{t('External threat intelligence is not currently connected. This assessment is based on URL characteristics and local analysis.', 'بیرونی خطرے کی معلومات فی الحال منسلک نہیں ہیں۔ یہ جائزہ یو آر ایل کی خصوصیات اور مقامی تجزیے پر مبنی ہے۔')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Website URL *', 'ویب سائٹ یو آر ایل *')}</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://example.com"
              className="input-field font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('Analyzing...', 'تجزیہ ہو رہا ہے...')}</> : <><Send className="w-5 h-5" /> {t('Check Website', 'ویب سائٹ جانچیں')}</>}
          </button>
        </motion.div>
      )}

      {result && (
        <div>
          <button onClick={() => { setResult(null); setError(null); }} className="btn-secondary mb-6">← {t('Check another URL', 'دوسرے یو آر ایل کی جانچ کریں')}</button>
          <ThreatResult result={result} />
        </div>
      )}
    </div>
  );
}
