import { motion } from 'framer-motion';
import { Upload, Search, AlertTriangle, Eye, Brain, FileText, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { icon: Upload, title: t('Submit Content', 'مواد جمع کریں'), desc: t('Paste suspicious emails, SMS, URLs, or upload QR codes.', 'شک ای میلز، ایس ایم ایس، یو آر ایلز پیسٹ کریں، یا کیو آر کوڈز اپلوڈ کریں۔'), color: 'text-magenta' },
    { icon: Search, title: t('Validate Input', 'ان پٹ کی تصدیق'), desc: t('We validate and sanitize all user input for security.', 'ہم سیکیورٹی کے لیے تمام صارف ان پٹ کی تصدیق اور صفائی کرتے ہیں۔'), color: 'text-teal' },
    { icon: AlertTriangle, title: t('Run Security Checks', 'سیکیورٹی جانچ چلائیں'), desc: t('Deterministic pattern analysis identifies known threats.', 'محدد پیٹرن تجزیہ معلوم خطرات کی نشاندہی کرتا ہے۔'), color: 'text-amber-400' },
    { icon: Eye, title: t('Identify Indicators', 'نشانیاں دریافت کریں'), desc: t('Suspicious patterns and indicators are catalogued.', 'شک ای پیٹرن اور نشانیاں فہرست بند کی جاتی ہیں۔'), color: 'text-purple-400' },
    { icon: Brain, title: t('AI Interprets Findings', 'اے آئی نتائج کی تشریح کرتا ہے'), desc: t('AI generates human-readable explanations of findings.', 'اے آئی نتائج کی انسانی وضاحتیں تیار کرتا ہے۔'), color: 'text-cyan-400' },
    { icon: FileText, title: t('Generate Report', 'رپورٹ تیار کریں'), desc: t('Clear risk assessment with evidence and recommendations.', 'ثبوت اور تجویزات کے ساتھ واضح خطرے کا جائزہ۔'), color: 'text-emerald-400' },
    { icon: ArrowRight, title: t('Take Action', 'کارروائی کریں'), desc: t('Follow recommended actions to protect yourself.', 'خود کو بچانے کے لیے تجویز کردہ کارروائیاں کریں۔'), color: 'text-orange-400' },
    { icon: BookOpen, title: t('Learn & Prevent', 'سیکھیں اور روکیں'), desc: t('Access educational resources to avoid future threats.', 'مستقبل کے خطرات سے بچنے کے لیے تعلیمی وسائل تک رسائی حاصل کریں۔'), color: 'text-teal' },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('How It Works', 'یہ کیسے کام کرتا ہے')}</h1>
        <p className="text-graphite-400 text-lg max-w-2xl mx-auto">{t('From suspicious content to clear, actionable security guidance.', 'شک مواد سے لے کر واضح، عملی سیکیورٹی رہنمائی تک۔')}</p>
      </motion.div>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-graphite-800/50 flex items-center justify-center flex-shrink-0">
              <step.icon className={`w-6 h-6 ${step.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-6 h-6 rounded-full bg-magenta/10 flex items-center justify-center text-magenta text-xs font-bold">{i + 1}</span>
                <h3 className="font-semibold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-graphite-400">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 glass-card p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-3">{t('Ready to protect yourself?', 'خود کو بچانے کے لیے تیار؟')}</h2>
        <p className="text-graphite-400 mb-6">{t('Start analyzing suspicious content now — no account required.', 'ابھی شک مواد کا تجزیہ شروع کریں — اکاؤنٹ کی ضرورت نہیں۔')}</p>
        <a href="/analyze" className="btn-primary inline-flex items-center gap-2">{t('Analyze a Threat', 'خطرے کا تجزیہ کریں')} <ArrowRight className="w-4 h-4" /></a>
      </motion.div>
    </div>
  );
}
