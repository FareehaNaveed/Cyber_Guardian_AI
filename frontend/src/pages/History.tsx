/**
 * Cyber Guardian AI — History Page
 * Session-based temporary history.
 */

import { motion } from 'framer-motion';
import { Clock, Trash2, Mail, MessageSquare, Globe, QrCode, Lock } from 'lucide-react';
import { cn, formatDate, getRiskColor, getRiskBg } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HistoryEntry } from '@/hooks/useHistory';

const typeIcons: Record<string, typeof Mail> = {
  'Email Analysis': Mail,
  'SMS Analysis': MessageSquare,
  'URL Analysis': Globe,
  'QR Analysis': QrCode,
  'Password Check': Lock,
};

interface Props {
  history: HistoryEntry[];
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
}

export function History({ history, deleteEntry, clearHistory }: Props) {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-magenta" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{t('History', 'تاریخچہ')}</h1>
            </div>
            <p className="text-graphite-400 text-sm">
              {t('Session-based temporary history. Cleared when you close the browser.', 'سیشن پر مبنی عارضی تاریخچہ۔ جب آپ براؤزر بند کریں تو صاف ہو جاتا ہے۔')}
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-danger flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4" />
              {t('Clear History', 'تاریخچہ صاف کریں')}
            </button>
          )}
        </div>
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Clock className="w-12 h-12 mx-auto mb-4 text-graphite-600" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('No history yet', 'ابھی تک کوئی تاریخچہ نہیں')}</h3>
          <p className="text-graphite-400">{t('Your analysis history will appear here.', 'آپ کی تجزیے کی تاریخچہ یہاں ظاہر ہوگی۔')}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {history.map((entry, i) => {
            const Icon = typeIcons[entry.type] || Clock;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-graphite-800/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-graphite-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{entry.type}</span>
                    <span className={cn('risk-badge text-xs py-0.5 px-2', getRiskBg(entry.riskLevel), getRiskColor(entry.riskLevel))}>
                      {entry.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-graphite-400 truncate">{entry.summary}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-graphite-500 font-mono">{formatDate(new Date(entry.timestamp))}</span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-graphite-500 hover:text-danger transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Privacy note */}
      <div className="mt-8 p-4 rounded-xl bg-graphite-800/20 border border-graphite-700/30 text-sm text-graphite-500">
        🔒 {t('History is stored temporarily in your browser session. Passwords are never stored. All data clears when you close the browser.', 'تاریخچہ آپ کے براؤزر سیشن میں عارضی طور پر محفوظ ہوتا ہے۔ پاس ورڈز کبھی محفوظ نہیں ہوتے۔ جب آپ براؤزر بند کریں تو تمام ڈیٹا صاف ہو جاتا ہے۔')}
      </div>
    </div>
  );
}
