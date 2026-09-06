/**
 * Cyber Guardian AI — QR Code Analyzer
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { ThreatResult } from '@/components/ThreatResult';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnalysisResult } from '@/types';

interface Props {
  addHistory: (type: string, risk: string, summary: string, result: AnalysisResult) => void;
}

export function QrAnalyzer({ addHistory }: Props) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'upload' | 'paste'>('paste');
  const [pasteContent, setPasteContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeText = async () => {
    if (!pasteContent.trim()) {
      setError(t('Please enter the decoded QR content.', 'براہ کہ ڈی کوڈ شدہ کیو آر مواد درج کریں۔'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeQrText(pasteContent.trim());
      setResult(response);
      addHistory('QR Analysis', response.riskLevel, pasteContent.trim().substring(0, 50), response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Analysis failed', 'تجزیہ ناکام'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!file) {
      setError(t('Please select an image file.', 'براہ کہ ایک تصویر فائل منتخب کریں۔'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeQrImage(file);
      setResult(response);
      addHistory('QR Analysis', response.riskLevel, `QR from ${file.name}`, response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Analysis failed', 'تجزیہ ناکام'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('QR Code Analyzer', 'کیو آر کوڈ تجزیہ کار')}</h1>
        </div>
        <p className="text-graphite-400 mb-8">
          {t('Upload a QR code image or paste the decoded content for analysis.', 'تجزیہ کے لیے کیو آر کوڈ کی تصویر اپلوڈ کریں یا ڈی کوڈ شدہ مواد پیسٹ کریں۔')}
        </p>
      </motion.div>

      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          {/* Warning */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
            ⚠️ {t('Never automatically open URLs from unknown QR codes. Always analyze first.', 'نا معلوم کیو آر کوڈز سے یو آر ایلز خود بخود نہ کھولیں۔ ہمیشہ پہلے تجزیہ کریں۔')}
          </div>

          {/* Mode switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('paste')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${mode === 'paste' ? 'bg-magenta/20 text-magenta border border-magenta/30' : 'bg-graphite-800/50 text-graphite-400 border border-graphite-700/50 hover:border-graphite-600'}`}
            >
              {t('Paste Content', 'مواد پیسٹ کریں')}
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${mode === 'upload' ? 'bg-magenta/20 text-magenta border border-magenta/30' : 'bg-graphite-800/50 text-graphite-400 border border-graphite-700/50 hover:border-graphite-600'}`}
            >
              {t('Upload Image', 'تصویر اپلوڈ کریں')}
            </button>
          </div>

          {/* Paste mode */}
          {mode === 'paste' && (
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-2">{t('Decoded QR Content *', 'ڈی کوڈ شدہ کیو آر مواد *')}</label>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={t('Paste the decoded content from the QR code...', 'کیو آر کوڈ سے ڈی کوڈ شدہ مواد پیسٹ کریں...')}
                rows={4}
                className="textarea-field font-mono"
              />
            </div>
          )}

          {/* Upload mode */}
          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-xl border-2 border-dashed border-graphite-700 hover:border-magenta/50 transition-colors text-center"
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-graphite-500" />
                {file ? (
                  <p className="text-white font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-graphite-300 font-medium">{t('Click to upload QR code image', 'کیو آر کوڈ تصویر اپلوڈ کرنے کے لیے کلک کریں')}</p>
                    <p className="text-graphite-500 text-sm mt-1">PNG, JPG, {t('or', 'یا')} WebP</p>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={mode === 'paste' ? handleAnalyzeText : handleAnalyzeImage}
            disabled={loading}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('Analyzing...', 'تجزیہ ہو رہا ہے...')}</> : <><Send className="w-5 h-5" /> {t('Analyze QR Content', 'کیو آر مواد کا تجزیہ کریں')}</>}
          </button>
        </motion.div>
      )}

      {result && (
        <div>
          <button onClick={() => { setResult(null); setError(null); setFile(null); setPasteContent(''); }} className="btn-secondary mb-6">← {t('Analyze another QR code', 'دوسرے کیو آر کوڈ کا تجزیہ کریں')}</button>
          <ThreatResult result={result} />
        </div>
      )}
    </div>
  );
}
