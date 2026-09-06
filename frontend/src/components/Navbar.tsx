/**
 * Cyber Guardian AI — Navigation Bar
 * Clean, responsive navigation with language toggle.
 */

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Menu, X, Home, Search, BookOpen, Clock, HelpCircle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('Home', 'ہوم'), icon: Home },
    { to: '/analyze', label: t('Analyze', 'تجزیہ'), icon: Search },
    { to: '/learn', label: t('Learn', 'سیکھیں'), icon: BookOpen },
    { to: '/history', label: t('History', 'تاریخچہ'), icon: Clock },
    { to: '/how-it-works', label: t('How It Works', 'کیسے کام کرتا ہے'), icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian-950/80 backdrop-blur-xl border-b border-graphite-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-magenta to-teal flex items-center justify-center transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">
              <span className="text-white">Cyber</span>
              <span className="gradient-text-magenta"> Guardian</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'nav-link flex items-center gap-2',
                  location.pathname === to && 'nav-link-active'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: Language toggle + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-graphite-800/50 border border-graphite-700/50 text-sm font-medium text-graphite-300 hover:text-white hover:border-magenta/30 transition-all"
              aria-label={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'اردو' : 'EN'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-graphite-400 hover:text-white transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-graphite-900/95 backdrop-blur-xl border-b border-graphite-800/50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                  location.pathname === to
                    ? 'bg-magenta/10 text-magenta'
                    : 'text-graphite-400 hover:bg-graphite-800/50 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
