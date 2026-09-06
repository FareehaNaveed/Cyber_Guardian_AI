/**
 * Cyber Guardian AI — Footer
 */

import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-graphite-800/50 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-magenta to-teal flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm">
              <span className="text-white">Cyber</span>
              <span className="gradient-text-magenta"> Guardian AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-graphite-500">
            <Link to="/about" className="hover:text-white transition-colors">{t('About', 'ہمارے بارے میں')}</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">{t('Privacy', 'رازداری')}</Link>
            <Link to="/help" className="hover:text-white transition-colors">{t('Help', 'مدد')}</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">{t('How It Works', 'یہ کیسے کام کرتا ہے')}</Link>
          </div>

          <p className="text-xs text-graphite-600">
            © {new Date().getFullYear()} Cyber Guardian AI. {t('For educational purposes.', 'تعلیمی مقاصد کے لیے۔')}
          </p>
        </div>
      </div>
    </footer>
  );
}
