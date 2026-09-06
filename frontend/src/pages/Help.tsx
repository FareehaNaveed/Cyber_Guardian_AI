/**
 * Cyber Guardian AI — Help / FAQ
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs = [
    { q: t('Do I need an account to use this?', 'کیا استعمال کے لیے اکاؤنٹ کی ضرورت ہے؟'), a: t('No. Cyber Guardian AI is completely anonymous. You can use all analysis tools immediately without signing up.', 'نہیں۔ سائبر گارڈین اے آئی مکمل طور پر گمنام ہے۔ آپ بغیر سائن اپ کے فوری طور پر تمام تجزیہ ٹولز استعمال کر سکتے ہیں۔') },
    { q: t('Is my data stored permanently?', 'کیا میرا ڈیٹا مستقل طور پر محفوظ ہوتا ہے؟'), a: t('No. History is stored temporarily in your browser session and clears when you close the browser tab.', 'نہیں۔ تاریخچہ آپ کے براؤزر سیشن میں عارضی طور پر محفوظ ہوتا ہے اور جب آپ ٹیب بند کریں تو صاف ہو جاتا ہے۔') },
    { q: t('How does the password checker work?', 'پاس ورڈ چیکر کیسے کام کرتا ہے؟'), a: t('Password analysis runs entirely in your browser using client-side code. Your password is NEVER sent to any server.', 'پاس ورڈ کا تجزیہ مکمل طور پر آپ کے براؤزر میں کلائینٹ سائیڈ کوڈ کا استعمال کرتے ہوئے چلتا ہے۔ آپ کا پاس ورڈ کبھی کسی سرور کو نہیں بھیجا جاتا۔') },
    { q: t('How accurate are the results?', 'نتائج کتنا درست ہیں؟'), a: t('Analysis uses deterministic pattern matching and AI interpretation. Results are advisory — always verify through official channels.', 'تجزیہ محدد پیٹرن میچنگ اور اے آئی تشریح کا استعمال کرتا ہے۔ نتائج مشورہ ہیں — ہمیشہ سرکاری چینلز کے ذریعے تصدیق کریں۔') },
    { q: t('What languages are supported?', 'کونسی زبانیں معاون ہیں؟'), a: t('The platform provides explanations in English and Urdu.', 'پلیٹ فارم انگریزی اور اردو میں وضاحتیں فراہم کرتا ہے۔') },
    { q: t('Can I use this on mobile?', 'کیا میں موبائل پر استعمال کر سکتا ہوں؟'), a: t('Yes. The application is fully responsive and works on desktop, tablet, and mobile devices.', 'ہاں۔ ایپلی کیشن مکمل طور پر ریسپانسو ہے اور ڈیسکٹاپ، ٹیبلٹ اور موبائل آلات پر کام کرتا ہے۔') },
    { q: t('What if the AI service is unavailable?', 'اگر اے آئی سروس دستیاب نہ ہو تو؟'), a: t('Deterministic analysis still works. AI explanations will show a fallback message indicating the service is temporarily unavailable.', 'محدد تجزیہ ابھی بھی کام کرتا ہے۔ اے آئی وضاحتیں ایک فال بیک پیغام دکھائیں گی جو ظاہر کرتا ہے کہ سروس عارضی طور پر دستیاب نہیں ہے۔') },
    { q: t('Does this detect all threats?', 'کیا یہ تمام خطرات کی نشاندہی کرتا ہے؟'), a: t('No. We do not guarantee 100% threat detection. Our analysis is based on known patterns and may miss novel threats.', 'نہیں۔ ہم 100% خطرے کی نشاندہی کی ضمانت نہیں دیتے۔ ہمارا تجزیہ معلوم پیٹرنز پر مبنی ہے اور نئے خطرات کو چھوک سکتا ہے۔') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-12 h-12 rounded-xl bg-magenta/10 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-6 h-6 text-magenta" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('Help & FAQ', 'مدد اور سوالات')}</h1>
        <p className="text-graphite-400 text-lg">{t('Frequently asked questions about Cyber Guardian AI.', 'سائبر گارڈین اے آئی کے بارے میں اکثر پوچھے گئے سوالات۔')}</p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <span className="font-medium text-white pr-4">{faq.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-5 h-5 text-magenta flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-graphite-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-5 pb-5"
              >
                <p className="text-sm text-graphite-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
