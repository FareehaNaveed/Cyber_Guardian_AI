/**
 * Cyber Guardian AI — Node.js Express Server
 * Pure deterministic analysis. No AI. Secure by default.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import analyzeRoutes from './routes/analyze.js';

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────

// Helmet: sets various HTTP security headers
app.use(helmet());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// CORS: only allow configured origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Body parser with size limit
app.use(express.json({ limit: '100kb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api', analyzeRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ detail: 'Route not found.' });
});

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use((err, req, res, _next) => {
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ detail: 'Origin not allowed.' });
  }
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ detail: 'File too large (max 10MB).' });
  }
  console.error('[ERROR]', err.message);
  res.status(500).json({ detail: 'Internal server error.' });
});

// ─── Start Server ────────────────────────────────────────────────────────────

const server = app.listen(config.port, config.host, () => {
  console.log('');
  console.log('  Cyber Guardian AI — Node.js Backend');
  console.log('  Mode: Deterministic (no AI)');
  console.log('  URL:  http://' + config.host + ':' + config.port);
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET  /api/health');
  console.log('    POST /api/analyze/email');
  console.log('    POST /api/analyze/sms');
  console.log('    POST /api/analyze/url');
  console.log('    POST /api/analyze/qr');
  console.log('    POST /api/analyze/qr/text');
  console.log('    POST /api/analyze/password');
  console.log('    GET  /api/education');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});

export default app;
