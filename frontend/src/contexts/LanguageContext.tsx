/**
 * Cyber Guardian AI — Language Context
 * Provides English/Urdu language switching across the application.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, ur?: string) => string;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'cg_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ur') return stored;
    } catch {}
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
    document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
    // Keep layout LTR but allow Urdu text rendering
    document.documentElement.dir = 'ltr';
    // Add urdu-mode class for font switching via CSS
    if (language === 'ur') {
      document.documentElement.classList.add('urdu-mode');
      document.documentElement.classList.remove('en-mode');
    } else {
      document.documentElement.classList.remove('urdu-mode');
      document.documentElement.classList.add('en-mode');
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
  }, []);

  const t = useCallback(
    (en: string, ur?: string) => {
      if (language === 'ur' && ur) return ur;
      return en;
    },
    [language]
  );

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
    isUrdu: language === 'ur',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
