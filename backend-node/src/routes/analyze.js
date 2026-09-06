/**
 * Cyber Guardian AI — Express Routes
 * All analysis endpoints. No AI. Pure deterministic.
 */
import { Router } from 'express';
import multer from 'multer';
import { analyzeEmail } from '../analyzers/email.js';
import { analyzeSms } from '../analyzers/sms.js';
import { analyzeUrl } from '../analyzers/url.js';
import { analyzePassword } from '../analyzers/password.js';
import { config } from '../config.js';

const router = Router();

// Multer for QR image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (config.allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported image format. Use PNG, JPEG, WebP, or GIF.'));
    }
  },
});

// ─── Health Check ────────────────────────────────────────────────────────────

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    mode: 'deterministic',
  });
});

// ─── Email Analysis ──────────────────────────────────────────────────────────

router.post('/analyze/email', (req, res) => {
  try {
    const { subject, sender, body, links, attachments } = req.body;

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return res.status(400).json({ detail: 'Subject is required.' });
    }
    if (!sender || typeof sender !== 'string' || sender.trim().length === 0) {
      return res.status(400).json({ detail: 'Sender is required.' });
    }
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ detail: 'Body is required.' });
    }
    if (subject.length > 5000) {
      return res.status(400).json({ detail: 'Subject is too long (max 5000 chars).' });
    }
    if (body.length > 50000) {
      return res.status(400).json({ detail: 'Body is too long (max 50000 chars).' });
    }

    const result = analyzeEmail({
      subject: subject.trim(),
      sender: sender.trim(),
      body: body.trim(),
      links: Array.isArray(links) ? links : [],
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    res.json(result);
  } catch {
    res.status(500).json({ detail: 'Internal server error.' });
  }
});

// ─── SMS Analysis ────────────────────────────────────────────────────────────

router.post('/analyze/sms', (req, res) => {
  try {
    const { text, sender, url } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ detail: 'SMS text is required.' });
    }

    const result = analyzeSms({
      text: text.trim(),
      sender: sender || null,
      url: url || null,
    });

    res.json(result);
  } catch {
    res.status(500).json({ detail: 'Internal server error.' });
  }
});

// ─── URL Analysis ────────────────────────────────────────────────────────────

router.post('/analyze/url', (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ detail: 'URL is required.' });
    }
    if (url.length > 2048) {
      return res.status(400).json({ detail: 'URL is too long (max 2048 chars).' });
    }
    if (!/^(https?:\/\/|www\.)/.test(url.trim()) && !url.includes('.')) {
      return res.status(400).json({ detail: 'Please enter a valid URL.' });
    }

    const result = analyzeUrl(url.trim());
    res.json(result);
  } catch {
    res.status(500).json({ detail: 'Internal server error.' });
  }
});

// ─── QR Image Analysis ───────────────────────────────────────────────────────

router.post('/analyze/qr', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded.' });
    }

    // QR image decoding not available in this build.
    // Users should paste the decoded text instead.
    res.json({
      riskLevel: 'low',
      threatScore: 0,
      confidence: 'low',
      indicators: [{
        id: 'qr_image_upload',
        label: 'QR image uploaded',
        description: 'QR image decoding is not available. Please paste the decoded QR content as text for analysis.',
        severity: 'low',
        category: 'observed',
      }],
      evidence: [{ category: 'observed', content: 'QR image uploaded: ' + req.file.originalname }],
      recommendations: [{
        priority: 'high',
        action: 'Paste the QR content as text',
        description: 'Use the text paste mode to analyze the QR code content.',
      }],
      explanation: 'QR image was received but cannot be decoded in this version. Please paste the decoded content.',
      explanationUrdu: 'کیو آر تصویر موصول ہوئی لیکن اس ورژن میں ڈی کوڈ نہیں ہو سکتی۔ براہ کہ ڈی کوڈ شدہ مواد پیسٹ کریں۔',
      analysisType: 'qr',
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ detail: 'File too large (max 10MB).' });
    }
    res.status(500).json({ detail: 'Unable to process this image.' });
  }
});

// ─── QR Text Analysis ────────────────────────────────────────────────────────

router.post('/analyze/qr/text', (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ detail: 'Content is required.' });
    }

    const content = url.trim();

    // If it looks like a URL, analyze as URL
    if (content.startsWith('http://') || content.startsWith('https://')) {
      const result = analyzeUrl(content);
      result.qrContent = content;
      result.destinationType = 'url';
      result.analysisType = 'qr';
      return res.json(result);
    }

    // Generic text analysis
    let score = 0;
    const indicators = [];

    if (/login|verify|password|secure|account/i.test(content)) {
      indicators.push({
        id: 'qr_login_reference',
        label: 'Contains login or verification keywords',
        description: 'This QR content may redirect to a phishing page.',
        severity: 'moderate',
        category: 'observed',
      });
      score += 20;
    }

    if (content.startsWith('http://')) {
      indicators.push({
        id: 'qr_insecure_url',
        label: 'Contains insecure URL',
        description: 'Uses HTTP instead of HTTPS.',
        severity: 'moderate',
        category: 'observed',
      });
      score += 15;
    }

    score = Math.min(score, 100);

    return res.json({
      riskLevel: score >= 40 ? 'moderate' : score >= 20 ? 'low' : 'safe',
      threatScore: score,
      confidence: indicators.length > 0 ? 'medium' : 'low',
      indicators,
      evidence: [{ category: 'observed', content: 'QR content: ' + content.substring(0, 200) }],
      recommendations: score > 20
        ? [{ priority: 'high', action: 'Do not follow QR instructions', description: 'The content appears suspicious.' }]
        : [{ priority: 'low', action: 'Review the decoded content', description: 'No obvious threats detected.' }],
      explanation: score > 20
        ? 'This QR code contains suspicious content. Do not follow the instructions or visit the URL.'
        : 'QR code content analyzed. No significant threats detected.',
      explanationUrdu: score > 20
        ? 'اس کیو آر کوڈ میں مشکوک مواد ہے۔ اس پر عمل نہ کریں۔'
        : 'کیو آر کوڈ کا مواد تجزیہ ہو گیا۔ کوئی اہم خطرہ نہیں ملا۔',
      analysisType: 'qr',
      qrContent: content,
      destinationType: 'text',
    });
  } catch {
    res.status(500).json({ detail: 'Internal server error.' });
  }
});

// ─── Password Analysis ───────────────────────────────────────────────────────

router.post('/analyze/password', (req, res) => {
  try {
    const { password } = req.body;

    if (password === undefined || password === null || typeof password !== 'string') {
      return res.status(400).json({ detail: 'Password is required.' });
    }
    if (password.length > 128) {
      return res.status(400).json({ detail: 'Password is too long (max 128 chars).' });
    }

    const result = analyzePassword(password);
    res.json(result);
  } catch {
    res.status(500).json({ detail: 'Internal server error.' });
  }
});

// ─── Education Topics ────────────────────────────────────────────────────────

router.get('/education', (req, res) => {
  res.json({
    topics: [
      { id: 'phishing', title: 'Phishing Awareness', titleUrdu: 'فشنگ سے خبرداری', icon: 'Mail' },
      { id: 'sms-scams', title: 'SMS Scam Awareness', titleUrdu: 'ایس ایم ایس اسکیم سے خبرداری', icon: 'MessageSquare' },
      { id: 'password-security', title: 'Password Security', titleUrdu: 'پاس ورڈ کی حفاظت', icon: 'Lock' },
      { id: 'qr-safety', title: 'QR Code Safety', titleUrdu: 'کیو آر کوڈ کی حفاظت', icon: 'QrCode' },
      { id: 'safe-browsing', title: 'Safe Browsing', titleUrdu: 'محفوظ براؤزنگ', icon: 'Globe' },
      { id: 'otp-safety', title: 'OTP Safety', titleUrdu: 'OTP کی حفاظت', icon: 'KeyRound' },
      { id: 'social-engineering', title: 'Social Engineering', titleUrdu: 'سوشل انجینئرنگ', icon: 'Users' },
      { id: 'online-privacy', title: 'Online Privacy', titleUrdu: 'آن لائن رازداری', icon: 'Eye' },
      { id: 'account-security', title: 'Account Security', titleUrdu: 'اکاؤنٹ کی حفاظت', icon: 'UserCheck' },
      { id: 'suspicious-links', title: 'Suspicious Links', titleUrdu: 'مشکوک لنکس', icon: 'Link' },
    ],
  });
});

export default router;
