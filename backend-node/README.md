# Cyber Guardian AI — Node.js Backend

Pure deterministic cybersecurity analysis backend built with Express.js. No AI required. Analyzes suspicious emails, SMS messages, websites, QR codes, and passwords.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4
- **Security:** Helmet, CORS, Rate Limiting
- **Language:** JavaScript (ES Modules)
- **Analysis:** Pure deterministic pattern matching

## Quick Start

```bash
cd backend-node
npm install
npm start           # http://localhost:8000
```

No API keys needed. No AI configuration. Just run it.

## Security Features

- **Helmet** — HTTP security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **CORS** — Only allows configured origins
- **Input Validation** — All endpoints validate and sanitize input
- **Size Limits** — 100KB body limit, 10MB file upload limit
- **No Data Storage** — Nothing is stored. Passwords never leave the request.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze/email` | Analyze email for phishing |
| `POST` | `/api/analyze/sms` | Analyze SMS for scams |
| `POST` | `/api/analyze/url` | Check URL safety |
| `POST` | `/api/analyze/qr` | Upload QR image |
| `POST` | `/api/analyze/qr/text` | Analyze decoded QR text |
| `POST` | `/api/analyze/password` | Check password strength |
| `GET` | `/api/education` | Cybersecurity education topics |

## Testing

```bash
npm test
```

## Project Structure

```
backend-node/
├── src/
│   ├── index.js              # Express server
│   ├── config.js             # Configuration
│   ├── test.js               # Test suite
│   ├── analyzers/
│   │   ├── email.js          # Email phishing analyzer
│   │   ├── sms.js            # SMS scam analyzer
│   │   ├── url.js            # URL safety analyzer
│   │   └── password.js       # Password strength analyzer
│   └── routes/
│       └── analyze.js        # Express route handlers
├── package.json
├── .env.example
└── README.md
```

## License

MIT
