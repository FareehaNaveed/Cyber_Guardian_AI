/**
 * Cyber Guardian AI — About Page
 */

import { motion } from 'framer-motion';
import { Shield, Target, BookOpen, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function About() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{t('About Cyber Guardian AI', 'سائبر گارڈین اے آئی کے بارے میں')}</h1>

        <div className="glass-card p-8 mb-8">
          <p className="text-lg text-graphite-300 leading-relaxed mb-6">
            {t('Cyber Guardian AI is an AI-powered cybersecurity assistant designed to protect users from digital threats. We detect phishing emails, scam SMS messages, malicious websites, suspicious QR codes, and weak passwords using artificial intelligence.', 'سائبر گارڈین اے آئی ڈیجیٹل خطرات سے صارفین کی حفاظت کے لیے ڈیزائن کردہ ایک اے آئی پاورڈ سائبر سیکیورٹی معاون ہے۔ ہم مصنوعی ذہانت کا استعمال کرتے ہوئے فشنگ ای میلز، اسکیم ایس ایم ایس پیغامات، خطرناک ویب سائٹیں، مشکوک کیو آر کوڈز اور کمزور پاس ورڈز کی نشاندہی کرتے ہیں۔')}
          </p>
          <p className="text-graphite-400 leading-relaxed">
            {t('Our platform provides real-time threat analysis, explains risks in simple language, and educates users on how to stay safe online. The goal is to improve cybersecurity awareness and make digital protection accessible to everyone.', 'ہمارا پلیٹ فارم رئیل ٹائم خطرے کا تجزیہ فراہم کرتا ہے، سادہ زبان میں خطرات کی وضاحت کرتا ہے، اور صارفین کو آن لائن محفوظ رہنے کا طریقہ سکھاتا ہے۔ مقصد سائبر سیکیورٹی کی آگاہی بڑھانا اور ہر کسی کے لیے ڈیجیٹل حفاظت قابل رسائی بنانا ہے۔')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <Shield className="w-8 h-8 text-magenta mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t('Our Purpose', 'ہمارا مقصد')}</h3>
            <p className="text-graphite-400 text-sm">{t('Making cybersecurity protection accessible and understandable for everyday users.', 'روزمرہ صارفین کے لیے سائبر سیکیورٹی کی حفاظت قابل رسائی اور قابل فہم بنانا۔')}</p>
          </div>
          <div className="glass-card p-6">
            <Target className="w-8 h-8 text-teal mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t('Our Mission', 'ہمارا مشن')}</h3>
            <p className="text-graphite-400 text-sm">{t('Help everyday users understand digital threats before they act.', 'روزمرہ صارفین کو کارروائی سے پہلے ڈیجیٹل خطرات کو سمجھنے میں مدد کریں۔')}</p>
          </div>
          <div className="glass-card p-6">
            <BookOpen className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t('Education First', 'تعلیم پہلے')}</h3>
            <p className="text-graphite-400 text-sm">{t('We believe in teaching users to recognize threats, not just detecting them.', 'ہم صارفین کو صرف خطرات کی نشاندہی کرنے کے بجائے انہیں پہچاننا سکھانے پر یقین رکھتے ہیں۔')}</p>
          </div>
          <div className="glass-card p-6">
            <Users className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t('For Everyone', 'ہر کسی کے لیے')}</h3>
            <p className="text-graphite-400 text-sm">{t('No technical expertise required. Simple explanations for complex threats.', 'کسی تکنیکی مہارت کی ضرورت نہیں۔ پیچیدہ خطرات کے لیے سادہ وضاحتیں۔')}</p>
          </div>
        </div>

        <div className="glass-card p-8 border-l-4 border-amber-400">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">{t('Important Disclaimers', 'اہم دعوے')}</h3>
          <ul className="space-y-2 text-sm text-graphite-400">
            <li>• {t('We do not guarantee 100% threat detection', 'ہم 100% خطرے کی نشاندہی کی ضمانت نہیں دیتے')}</li>
            <li>• {t('Analysis is advisory — always verify through official channels', 'تجزیہ مشورہ ہے — ہمیشہ سرکاری چینلز کے ذریعے تصدیق کریں')}</li>
            <li>• {t('We do not perform offensive security operations', 'ہم حملہ آور سیکیورٹی آپریشنز نہیں کرتے')}</li>
            <li>• {t('External threat intelligence may not always be available', 'بیرونی خطرے کی معلومات ہمیشہ دستیاب نہیں ہو سکتیں')}</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
