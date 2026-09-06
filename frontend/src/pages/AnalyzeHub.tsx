/**
 * Cyber Guardian AI — Analyze Hub
 * Central page with all analyzer options.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Globe, QrCode, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function AnalyzeHub() {
  const { t } = useLanguage();

  const analyzers = [
    {
      to: '/analyze/email',
      icon: Mail,
      title: t('Phishing Email', 'فشنگ ای میل'),
      desc: t('Check suspicious emails for phishing and social engineering indicators.', 'فشنگ اور سوشل انجینئرنگ کی نشانیوں کے لیے مشکوک ای میلز جانچیں۔'),
      color: 'from-magenta to-pink-500',
      button: t('Analyze Email', 'ای میل کا تجزیہ'),
    },
    {
      to: '/analyze/sms',
      icon: MessageSquare,
      title: t('Scam SMS', 'اسکیم ایس ایم ایس'),
      desc: t('Detect scam text messages including fake prizes and banking fraud.', 'جعلی انعامات اور بینکنگ فراڈ سمیت اسکیم ٹیکسٹ پیغامات کی نشاندہی کریں۔'),
      color: 'from-teal to-emerald-500',
      button: t('Analyze SMS', 'ایس ایم ایس کا تجزیہ'),
    },
    {
      to: '/analyze/url',
      icon: Globe,
      title: t('Website Safety', 'ویب سائٹ کی حفاظت'),
      desc: t('Evaluate URLs for suspicious patterns and security threats.', 'مشکوک پیٹرن اور سیکیورٹی خطرات کے لیے یو آر ایلز کا جائزہ لیں۔'),
      color: 'from-amber-500 to-orange-500',
      button: t('Check URL', 'یو آر ایل جانچیں'),
    },
    {
      to: '/analyze/qr',
      icon: QrCode,
      title: t('QR Code', 'کیو آر کوڈ'),
      desc: t('Decode and analyze QR codes for hidden dangers and malicious links.', 'پوشیدہ خطرات اور خطرناک لنکس کے لیے کیو آر کوڈز کو ڈی کوڈ اور تجزیہ کریں۔'),
      color: 'from-purple-500 to-indigo-500',
      button: t('Scan QR Code', 'کیو آر کوڈ اسکین کریں'),
    },
    {
      to: '/analyze/password',
      icon: Lock,
      title: t('Password Security', 'پاس ورڈ کی حفاظت'),
      desc: t('Check password strength with actionable improvement recommendations.', 'عملی بہتری کی سفارشات کے ساتھ پاس ورڈ کی طاقت جانچیں۔'),
      color: 'from-cyan-500 to-blue-500',
      button: t('Check Password', 'پاس ورڈ جانچیں'),
    },
  ];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('Security Analysis Tools', 'سیکیورٹی تجزیہ ٹولز')}
        </h1>
        <p className="text-graphite-400 text-lg max-w-2xl mx-auto">
          {t('Choose what you want to analyze. Each tool provides detailed threat assessment with clear explanations.', ' منتخب کریں کہ آپ کیا تجزیہ کرنا چاہتے ہیں۔ ہر ٹول واضح وضاحتیں کے ساتھ تفصیلی خطرے کی جائزہ فراہم کرتا ہے۔')}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {analyzers.map((analyzer) => (
          <motion.div key={analyzer.to} variants={item}>
            <Link
              to={analyzer.to}
              className="glass-card-hover p-6 block group h-full"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${analyzer.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                <analyzer.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{analyzer.title}</h3>
              <p className="text-graphite-400 text-sm leading-relaxed mb-6 flex-1">{analyzer.desc}</p>
              <div className="flex items-center gap-2 text-magenta font-medium group-hover:gap-3 transition-all">
                {analyzer.button}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Privacy note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-graphite-500">
          🔒 {t('No account required. All analysis happens securely. History is temporary and stored only in your browser session.', 'اکاؤنٹ کی ضرورت نہیں۔ تمام تجزیہ محفوظ طریقے سے ہوتا ہے۔ تاریخچہ عارضی ہے اور صرف آپ کے براؤزر سیشن میں محفوظ ہوتا ہے۔')}
        </p>
      </motion.div>
    </div>
  );
}
