/**
 * Cyber Guardian AI — Main Application
 * React Router setup with all pages.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { AnalyzeHub } from '@/pages/AnalyzeHub';
import { EmailAnalyzer } from '@/pages/EmailAnalyzer';
import { SmsAnalyzer } from '@/pages/SmsAnalyzer';
import { UrlAnalyzer } from '@/pages/UrlAnalyzer';
import { QrAnalyzer } from '@/pages/QrAnalyzer';
import { PasswordChecker } from '@/pages/PasswordChecker';
import { History } from '@/pages/History';
import { Learn } from '@/pages/Learn';
import { HowItWorks } from '@/pages/HowItWorks';
import { About } from '@/pages/About';
import { Privacy } from '@/pages/Privacy';
import { Help } from '@/pages/Help';
import { useHistory } from '@/hooks/useHistory';

export default function App() {
  const history = useHistory();

  return (
    <BrowserRouter>
      <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<AnalyzeHub />} />
            <Route path="/analyze/email" element={<EmailAnalyzer addHistory={history.addEntry} />} />
            <Route path="/analyze/sms" element={<SmsAnalyzer addHistory={history.addEntry} />} />
            <Route path="/analyze/url" element={<UrlAnalyzer addHistory={history.addEntry} />} />
            <Route path="/analyze/qr" element={<QrAnalyzer addHistory={history.addEntry} />} />
            <Route path="/analyze/password" element={<PasswordChecker addHistory={history.addEntry} />} />
            <Route path="/history" element={<History history={history.history} deleteEntry={history.deleteEntry} clearHistory={history.clearHistory} />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}
