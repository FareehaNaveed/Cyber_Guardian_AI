/**
 * Cyber Guardian AI — Unified Threat Result Component
 * Consistent result display for all analyzers.
 */

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Info, Eye, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnalysisResult } from '@/types';

const riskConfig = {
  safe: { icon: CheckCircle, label: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  low: { icon: Shield, label: 'LOW RISK', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
  moderate: { icon: AlertTriangle, label: 'SUSPICIOUS', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  high: { icon: AlertCircle, label: 'HIGH RISK', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  critical: { icon: AlertCircle, label: 'CRITICAL', color: 'text-danger', bg: 'bg-danger/10 border-danger/30' },
};

interface ThreatResultProps {
  result: AnalysisResult;
}

const riskLabels: Record<string, { en: string; ur: string }> = {
  safe: { en: 'SAFE', ur: 'محفوظ' },
  low: { en: 'LOW RISK', ur: 'کم خطرہ' },
  moderate: { en: 'SUSPICIOUS', ur: 'مشکوک' },
  high: { en: 'HIGH RISK', ur: 'زیادہ خطرہ' },
  critical: { en: 'CRITICAL', ur: 'انتہائی خطرناک' },
};

export function ThreatResult({ result }: ThreatResultProps) {
  const { language, t } = useLanguage();
  const config = riskConfig[result.riskLevel as keyof typeof riskConfig] || riskConfig.moderate;
  const RiskIcon = config.icon;
  const riskLabel = riskLabels[result.riskLevel]?.[language] || riskLabels[result.riskLevel]?.en || 'UNKNOWN';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Risk Header */}
      <div className={cn('glass-card p-6 border-2', config.bg)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-xl', config.bg)}>
            <RiskIcon className={cn('w-8 h-8', config.color)} />
          </div>
          <div>
            <p className="text-xs font-mono text-graphite-500 uppercase tracking-wider">Threat Level</p>
            <h3 className={cn('text-2xl font-bold font-display', config.color)}>
              {language === 'ur' ? riskLabel : config.label}
            </h3>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-mono text-graphite-500 uppercase tracking-wider">Score</p>
            <p className="text-3xl font-bold font-mono text-white">
              {result.threatScore}
              <span className="text-lg text-graphite-500">/100</span>
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 h-2 bg-graphite-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.threatScore}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              'h-full rounded-full',
              result.riskLevel === 'safe' && 'bg-emerald-500',
              result.riskLevel === 'low' && 'bg-teal-500',
              result.riskLevel === 'moderate' && 'bg-amber-500',
              result.riskLevel === 'high' && 'bg-orange-500',
              result.riskLevel === 'critical' && 'bg-danger',
            )}
          />
        </div>
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-teal-400" />
          <h4 className="font-semibold text-white">{t('Why This Matters', 'یہ کیوں اہم ہے')}</h4>
        </div>
        <p className="text-graphite-300 leading-relaxed">
          {language === 'ur' ? result.explanationUrdu : result.explanation}
        </p>
        {result.note && (
          <p className="mt-3 text-sm text-graphite-500 italic">
            {result.note}
          </p>
        )}
      </motion.div>

      {/* Indicators */}
      {result.indicators.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-magenta" />
            <h4 className="font-semibold text-white">{t('Detected Indicators', 'دریافت شدہ نشانیاں')}</h4>
            <span className="ml-auto text-xs font-mono text-graphite-500">
              {result.indicators.length} {t('found', 'دریافت')}
            </span>
          </div>
          <div className="space-y-3">
            {result.indicators.map((indicator, i) => (
              <motion.div
                key={indicator.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-graphite-800/30 border border-graphite-700/30"
              >
                <div className={cn(
                  'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                  indicator.severity === 'critical' && 'bg-danger',
                  indicator.severity === 'high' && 'bg-orange-500',
                  indicator.severity === 'moderate' && 'bg-amber-500',
                  indicator.severity === 'low' && 'bg-teal-500',
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{indicator.label}</p>
                  <p className="text-xs text-graphite-400 mt-0.5">{indicator.description}</p>
                </div>
                <span className={cn(
                  'text-xs font-mono px-2 py-0.5 rounded',
                  indicator.category === 'observed' && 'bg-teal-500/10 text-teal-400',
                  indicator.category === 'derived' && 'bg-magenta/10 text-magenta',
                  indicator.category === 'inferred' && 'bg-amber-500/10 text-amber-400',
                  indicator.category === 'unknown' && 'bg-graphite-500/10 text-graphite-400',
                )}>
                  {indicator.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Evidence */}
      {result.evidence.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold text-white">{t('Evidence', 'ثبوت')}</h4>
          </div>
          <div className="space-y-2">
            {result.evidence.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-graphite-800/20">
                <span className={cn(
                  'text-xs font-mono px-2 py-0.5 rounded',
                  ev.category === 'observed' && 'bg-teal-500/10 text-teal-400',
                  ev.category === 'derived' && 'bg-magenta/10 text-magenta',
                  ev.category === 'inferred' && 'bg-amber-500/10 text-amber-400',
                  ev.category === 'unknown' && 'bg-graphite-500/10 text-graphite-400',
                )}>
                  {ev.category}
                </span>
                <span className="text-sm text-graphite-300 font-mono">{ev.content}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold text-white">{t('What You Should Do', 'آپ کو کیا کرنا چاہیے')}</h4>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <div
                key={i}
                className={cn(
                  'p-4 rounded-xl border',
                  rec.priority === 'high' && 'border-danger/30 bg-danger/5',
                  rec.priority === 'medium' && 'border-amber-500/30 bg-amber-500/5',
                  rec.priority === 'low' && 'border-graphite-700/50 bg-graphite-800/20',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    rec.priority === 'high' && 'bg-danger/20 text-danger',
                    rec.priority === 'medium' && 'bg-amber-500/20 text-amber-400',
                    rec.priority === 'low' && 'bg-graphite-700/50 text-graphite-400',
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{rec.action}</p>
                    <p className="text-sm text-graphite-400 mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
