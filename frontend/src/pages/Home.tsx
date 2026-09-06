import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, MessageSquare, Globe, QrCode, Lock, ArrowRight, Zap, Eye, BookOpen, AlertTriangle, CheckCircle, Search, FileWarning, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ── Animated particles background ── */
function Particles() {
  const particles = [
    { x: 8, y: 15, s: 3, c: '#e91e8c', d: 0, dur: 7 },
    { x: 22, y: 60, s: 2, c: '#14b8a6', d: 1.2, dur: 9 },
    { x: 38, y: 30, s: 4, c: '#6366f1', d: 0.5, dur: 6 },
    { x: 55, y: 75, s: 2, c: '#e91e8c', d: 2, dur: 8 },
    { x: 70, y: 20, s: 3, c: '#14b8a6', d: 0.8, dur: 7.5 },
    { x: 85, y: 50, s: 2, c: '#8b5cf6', d: 1.5, dur: 6.5 },
    { x: 92, y: 80, s: 3, c: '#e91e8c', d: 0.3, dur: 8.5 },
    { x: 15, y: 85, s: 2, c: '#14b8a6', d: 1.8, dur: 7.2 },
    { x: 48, y: 10, s: 4, c: '#f97316', d: 0.7, dur: 9.5 },
    { x: 75, y: 40, s: 2, c: '#14b8a6', d: 2.5, dur: 6.8 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: p.s, height: p.s,
          left: `${p.x}%`, top: `${p.y}%`,
          background: p.c,
          boxShadow: `0 0 ${p.s * 3}px ${p.c}`,
          animation: `particle-float ${p.dur}s ease-in-out infinite`,
          animationDelay: `${p.d}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Cybersecurity Workflow Animation ── */
const workflowSteps = [
  { id: 'input', icon: FileWarning, color: '#f97316', glow: 'rgba(249,115,22,0.3)' },
  { id: 'detect', icon: Search, color: '#e91e8c', glow: 'rgba(233,30,140,0.3)' },
  { id: 'analyze', icon: AlertTriangle, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
  { id: 'protect', icon: Shield, color: '#14b8a6', glow: 'rgba(20,184,166,0.3)' },
  { id: 'secure', icon: CheckCircle, color: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
];

function WorkflowAnimation() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-graphite-800/50 bg-graphite-900/30 backdrop-blur-sm p-6 md:p-8">
      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-teal to-transparent" style={{ animation: 'scan-line 6s linear infinite' }} />
      </div>

      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Workflow pipeline */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 md:gap-4 overflow-x-auto pb-4">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                {/* Node circle */}
                <motion.div
                  animate={{
                    boxShadow: [
                      `0 0 0 0px ${step.glow}`,
                      `0 0 20px 8px ${step.glow}`,
                      `0 0 0 0px ${step.glow}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border"
                  style={{
                    borderColor: step.color + '60',
                    background: step.color + '15',
                  }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: step.color }} />
                </motion.div>

                {/* Step label */}
                <span className="text-[10px] md:text-xs font-medium text-graphite-400 text-center">
                  {step.id === 'input' && 'INPUT'}
                  {step.id === 'detect' && 'DETECT'}
                  {step.id === 'analyze' && 'ANALYZE'}
                  {step.id === 'protect' && 'PROTECT'}
                  {step.id === 'secure' && 'SECURE'}
                </span>

                {/* Pulse dot */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: step.color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Animated data flow line */}
        <div className="relative h-[2px] w-full mt-2 rounded-full overflow-hidden bg-graphite-800/50">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 h-full w-1/3 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #e91e8c, #14b8a6, transparent)' }}
          />
        </div>

        {/* Live status bar */}
        <div className="flex items-center justify-between mt-4 text-xs text-graphite-500">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SYSTEM ACTIVE</span>
          </div>
          <span className="font-mono">ANALYSIS ENGINE v2.0</span>
          <div className="flex items-center gap-2">
            <span>ENCRYPTED</span>
            <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const { t } = useLanguage();

  /* ── Feature cards (stable slug keys, NOT translated text) ── */
  const features = [
    { slug: 'email', icon: Mail, title: t('Email Analysis', 'ای میل تجزیہ'), desc: t('Detect phishing emails and social engineering tactics', 'فشنگ ای میلز اور سوشل انجینئرنگ کی حکمت عملیوں کی نشاندہی'), color: 'from-magenta to-pink-500' },
    { slug: 'sms', icon: MessageSquare, title: t('SMS Scam Detection', 'ایس ایم ایس اسکیم کی نشاندہی'), desc: t('Identify scam text messages and fraudulent links', 'اسکیم ٹیکسٹ پیغامات اور جعلی لنکس کی نشاندہی'), color: 'from-teal to-emerald-500' },
    { slug: 'website', icon: Globe, title: t('Website Safety', 'ویب سائٹ کی حفاظت'), desc: t('Evaluate URLs for suspicious patterns and threats', 'مشکوک پیٹرن اور خطرات کے لیے یو آر ایلز کا جائزہ'), color: 'from-amber-500 to-orange-500' },
    { slug: 'qr', icon: QrCode, title: t('QR Code Analysis', 'کیو آر کوڈ تجزیہ'), desc: t('Decode and analyze QR codes for hidden dangers', 'پوشیدہ خطرات کے لیے کیو آر کوڈز کو ڈی کوڈ اور تجزیہ کریں'), color: 'from-purple-500 to-indigo-500' },
    { slug: 'password', icon: Lock, title: t('Password Security', 'پاس ورڈ کی حفاظت'), desc: t('Check password strength with actionable recommendations', 'عملی سفارشات کے ساتھ پاس ورڈ کی طاقت جانچیں'), color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ══════ Premium Cyber Background ══════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* 1) Deep gradient orbs — slow pulse */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-magenta/[0.04] rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-teal/[0.05] rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-[-100px] w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

        {/* 2) Matrix rain columns */}
        <div className="absolute inset-0" style={{ opacity: 0.07 }}>
          {Array.from({ length: 18 }).map((_, col) => {
            const chars = '01アイウエオカキクケコ∴∵⟐⟐⬡⬢';
            const seed = col * 7 + 3;
            return (
              <div key={`col-${col}`} className="absolute" style={{
                left: `${(col / 18) * 100 + 1}%`,
                top: 0,
                width: '14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: `matrix-fall ${6 + (seed % 5)}s linear infinite`,
                animationDelay: `${(seed % 7) * 0.8}s`,
              }}>
                {Array.from({ length: 25 }).map((_, row) => (
                  <span key={row} style={{
                    color: row % 5 === 0 ? '#e91e8c' : '#14b8a6',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    lineHeight: '20px',
                    opacity: 1 - (row / 25) * 0.7,
                  }}>
                    {chars[(seed + row) % chars.length]}
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* 3) Animated grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(20,184,166,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'grid-drift 20s linear infinite',
        }} />

        {/* 4) Horizontal scan lines (TV effect) */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.015) 2px, rgba(20,184,166,0.015) 4px)',
        }} />

        {/* 5) Moving scan beam */}
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.06 }}>
          <div className="absolute w-full h-[120px]" style={{
            background: 'linear-gradient(180deg, transparent, rgba(20,184,166,0.4), transparent)',
            animation: 'scan-beam 7s linear infinite',
          }} />
        </div>

        {/* 6) Floating particles */}
        <Particles />

        {/* 7) Corner accent lines */}
        <svg className="absolute top-0 left-0 w-48 h-48" style={{ opacity: 0.12 }} viewBox="0 0 200 200">
          <line x1="0" y1="80" x2="80" y2="0" stroke="#e91e8c" strokeWidth="0.5">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="120" x2="120" y2="0" stroke="#14b8a6" strokeWidth="0.5">
            <animate attributeName="stroke-dashoffset" from="240" to="0" dur="5s" repeatCount="indefinite" />
          </line>
          <circle cx="40" cy="40" r="3" fill="#e91e8c" opacity="0.6">
            <animate attributeName="r" values="2;5;2" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        <svg className="absolute bottom-0 right-0 w-48 h-48" style={{ opacity: 0.12, transform: 'rotate(180deg)' }} viewBox="0 0 200 200">
          <line x1="0" y1="80" x2="80" y2="0" stroke="#14b8a6" strokeWidth="0.5">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="120" x2="120" y2="0" stroke="#e91e8c" strokeWidth="0.5">
            <animate attributeName="stroke-dashoffset" from="240" to="0" dur="5s" repeatCount="indefinite" />
          </line>
          <circle cx="40" cy="40" r="3" fill="#14b8a6" opacity="0.6">
            <animate attributeName="r" values="2;5;2" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* 8) Vignette overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }} />
      </div>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-magenta/10 border border-magenta/30 text-magenta text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            {t('AI-Powered Cybersecurity', 'اے آئی پاورڈ سائبر سیکیورٹی')}
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">{t('Your', 'آپ کا')}</span>{' '}
            <span className="gradient-text-magenta">{t('AI-powered', 'اے آئی پاورڈ')}</span>
            <br />
            <span className="text-white">{t('cybersecurity companion.', 'سائبر سیکیورٹی ساتھی۔')}</span>
          </h1>

          <p className="text-lg md:text-xl text-graphite-400 max-w-2xl mx-auto mb-10 text-balance">
            {t('Analyze suspicious emails, messages, websites, QR codes and passwords — and understand the risk before you act.', 'شک ای میلز، پیغامات، ویب سائٹیں، کیو آر کوڈز اور پاس ورڈز کا تجزیہ کریں — اور کارروائی سے پہلے خطرے کو سمجھیں۔')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyze" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Shield className="w-5 h-5" /> {t('Analyze a Threat', 'خطرے کا تجزیہ کریں')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/learn" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <BookOpen className="w-5 h-5" /> {t('Learn Cyber Safety', 'سائبر سیکیورٹی سیکھیں')}
            </Link>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-graphite-500">
            <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-teal-400" /> {t('No account required', 'اکاؤنٹ کی ضرورت نہیں')}</span>
            <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400" /> {t('Passwords never stored', 'پاس ورڈز کبھی محفوظ نہیں ہوتے')}</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> {t('Real-time analysis', 'رئیل ٹائم تجزیہ')}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('Protect yourself from digital threats', 'ڈیجیٹل خطرات سے خود کو بچائیں')}</h2>
          <p className="text-graphite-400 text-lg max-w-2xl mx-auto">{t('Comprehensive security analysis powered by AI and deterministic checks', 'اے آئی اور محدد جانچوں سے چلنے والا جامع سیکیورٹی تجزیہ')}</p>
        </motion.div>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.div key={f.slug} variants={item}>
              <Link to="/analyze" className="glass-card-hover p-6 block group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-graphite-400 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
          <motion.div variants={item}>
            <Link to="/analyze" className="glass-card-hover p-6 block group border-dashed border-2 border-graphite-700 hover:border-magenta/50">
              <div className="w-12 h-12 rounded-xl bg-graphite-800 flex items-center justify-center mb-4 transition-colors group-hover:bg-magenta/20">
                <ArrowRight className="w-6 h-6 text-graphite-400 group-hover:text-magenta transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('Start Analyzing', 'تجزیہ شروع کریں')}</h3>
              <p className="text-graphite-400 text-sm">{t('Begin protecting yourself in seconds', 'چند سیکنڈ میں خود کو بچانا شروع کریں')}</p>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Cybersecurity Workflow Animation ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('How Threat Detection Works', 'خطرے کی نشاندہی کیسے کام کرتی ہے')}
          </h2>
          <p className="text-graphite-400 text-lg max-w-2xl mx-auto">
            {t('Watch the real-time analysis pipeline in action — from input to secure verdict', 'ان پٹ سے محفوظ فیصلے تک رئیل ٹائم تجزیہ پائپ لائن کو دیکھیں')}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <WorkflowAnimation />
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('How Cyber Guardian AI works', 'سائبر گارڈین اے آئی کیسے کام کرتا ہے')}</h2>
              <p className="text-graphite-400 mb-6 leading-relaxed">
                {t('Submit suspicious content, and our AI analyzes it for threats, providing clear explanations and actionable recommendations.', 'شک مواد جمع کریں، اور ہمارا اے آئی اسے خطرات کے لیے تجزیہ کرتا ہے، واضح وضاحتیں اور عملی سفارشات فراہم کرتا ہے۔')}
              </p>
              <Link to="/how-it-works" className="text-magenta hover:text-magenta-400 font-medium flex items-center gap-2">
                {t('Learn more', 'مزید سیکھیں')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[t('Submit suspicious content', 'شک مواد جمع کریں'), t('AI analyzes for threats', 'اے آئی خطرات کا تجزیہ کرتا ہے'), t('Get clear explanation', 'واضح وضاحت حاصل کریں'), t('Take recommended action', 'تجویز کردہ کارروائی کریں')].map((step, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-graphite-800/30">
                  <span className="w-8 h-8 rounded-lg bg-magenta/10 flex items-center justify-center text-magenta font-bold text-sm">{i + 1}</span>
                  <span className="text-graphite-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
