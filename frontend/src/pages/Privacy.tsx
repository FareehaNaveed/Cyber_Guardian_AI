/**
 * Cyber Guardian AI — Privacy Page
 */

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Trash2, Server, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Privacy() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{t('Privacy & Safety', 'رازداری اور حفاظت')}</h1>

        <div className="space-y-6">
          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{t('No Account Required', 'اکاؤنٹ کی ضرورت نہیں')}</h3>
              <p className="text-sm text-graphite-400">{t('Use all analysis tools immediately without creating an account or signing in.', 'بغیر اکاؤنٹ بنائے یا سائن ان کے فوری طور پر تمام تجزیہ ٹولز استعمال کریں۔')}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{t('Temporary Local History', 'عارضی مقامی تاریخچہ')}</h3>
              <p className="text-sm text-graphite-400">{t('Analysis history is stored temporarily in your browser session only. It clears when you close the browser.', 'تجزیے کی تاریخچہ صرف آپ کے براؤزر سیشن میں عارضی طور پر محفوظ ہوتی ہے۔ جب آپ براؤزر بند کریں تو صاف ہو جاتی ہے۔')}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-magenta" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{t('Password Checker Privacy', 'پاس ورڈ چیکر رازداری')}</h3>
              <p className="text-sm text-graphite-400">{t('Password analysis runs entirely in your browser. Passwords are never stored, logged, or sent to any server.', 'پاس ورڈ کا تجزیہ مکمل طور پر آپ کے براؤزر میں چلتا ہے۔ پاس ورڈز کبھی محفوظ، لاگ، یا کسی سرور کو نہیں بھیجا جاتا۔')}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Server className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{t('What May Be Sent to AI', 'اے آئی کو کیا بھیجا جا سکتا ہے')}</h3>
              <p className="text-sm text-graphite-400">{t('When you submit content for analysis (emails, SMS, URLs), the content may be sent to AI services for explanation generation. This is used solely for generating threat explanations.', 'جب آپ تجزیے کے لیے مواد جمع کرتے ہیں (ای میلز، ایس ایم ایس، یو آر ایلز)، تو مواد وضاحت پیدا کرنے کے لیے اے آئی سروسز کو بھیجا جا سکتا ہے۔ یہ صرف خطرے کی وضاحتیں پیدا کرنے کے لیے استعمال ہوتا ہے۔')}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{t('Clear History', 'تاریخچہ صاف کریں')}</h3>
              <p className="text-sm text-graphite-400">{t('You can clear your analysis history at any time from the History page. No hidden persistent copies remain.', 'آپ کسی بھی وقت تاریخچہ صفحے سے اپنی تجزیے کی تاریخچہ صاف کر سکتے ہیں۔ کوئی پوشیدہ مستقل نقلیں نہیں بچتیں۔')}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4 border-l-4 border-amber-400">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">{t('External Threat Intelligence', 'بیرونی خطرے کی معلومات')}</h3>
              <p className="text-sm text-graphite-400">{t('External threat intelligence APIs are not currently connected. Analysis is based on URL characteristics and local pattern matching.', 'بیرونی خطرے کی معلومات API فی الحال منسلک نہیں ہیں۔ تجزیہ یو آر ایل کی خصوصیات اور مقامی پیٹرن میچنگ پر مبنی ہے۔')}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
