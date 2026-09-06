<div align="center">

# 🛡️ Cyber Guardian AI

### Your AI-Powered Cybersecurity Companion

**Analyze suspicious emails, messages, websites, QR codes and passwords — and understand the risk before you act.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-green.svg)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://typescriptlang.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)](https://fastapi.tiangolo.com)

</div>

---

## 🎯 About

**Cyber Guardian AI** is an AI-powered cybersecurity assistant designed to protect users from digital threats. It detects phishing emails, scam SMS messages, malicious websites, suspicious QR codes, and weak passwords using artificial intelligence.

The platform provides real-time threat analysis, explains risks in simple English and Urdu, and educates users on how to stay safe online. The goal is to improve cybersecurity awareness and make digital protection accessible to everyone.

### Why Cyber Guardian AI?

| Problem | Solution |
|---------|----------|
| Users can't identify phishing emails | Analyzes emails for 15+ phishing indicators |
| SMS scams are increasing | Detects common scam patterns and urgency tactics |
| Malicious URLs are hard to spot | Checks HTTPS, domains, brand impersonation, encoding |
| QR codes can hide threats | Decodes and analyzes QR content for dangers |
| Weak passwords are everywhere | Client-side password analysis (never stored!) |
| Security info is too technical | Explains threats in simple English and Urdu |

---

## ✨ Features

### 🔍 Security Analysis Tools

| Tool | Description | Backend |
|------|-------------|---------|
| **📧 Email Analyzer** | Detects phishing, urgency, credential requests, suspicious links | ✅ |
| **💬 SMS Analyzer** | Identifies scams, OTP requests, delivery fraud, job scams | ✅ |
| **🌐 URL Analyzer** | Checks HTTPS, domains, brand impersonation, encoding | ✅ |
| **📱 QR Analyzer** | Decodes and analyzes QR codes for hidden threats | ✅ |
| **🔐 Password Checker** | Client-side strength analysis (never stored/transmitted) | Client |

### 🎓 Cybersecurity Education

10 comprehensive topics with:
- What is it?
- Why is it dangerous?
- Warning signs
- Realistic examples
- What to do
- What NOT to do

Topics covered: Phishing, SMS Scams, Password Security, QR Code Safety, Safe Browsing, OTP Safety, Social Engineering, Online Privacy, Account Security, Suspicious Links

### 🌍 Bilingual Support

- **English** — Full interface and explanations
- **Urdu** — Complete translations for broader accessibility

### 🔒 Privacy-First Design

- ❌ No account required
- ❌ No login walls
- ✅ Temporary session history (clears on browser close)
- ✅ Passwords analyzed client-side only
- ✅ Clear history button

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **React Router** | Navigation |
| **Lucide React** | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Runtime |
| **FastAPI** | Web framework |
| **Pydantic** | Data validation |
| **Uvicorn** | ASGI server |
| **Pillow** | Image processing |
| **Pyzbar** | QR code decoding |


## 📁 Project Structure

```
cyber-guardian-ai/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   ├── Footer.tsx      # Footer component
│   │   │   └── ThreatResult.tsx # Unified results display
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── AnalyzeHub.tsx  # Central analyzer hub
│   │   │   ├── EmailAnalyzer.tsx
│   │   │   ├── SmsAnalyzer.tsx
│   │   │   ├── UrlAnalyzer.tsx
│   │   │   ├── QrAnalyzer.tsx
│   │   │   ├── PasswordChecker.tsx
│   │   │   ├── History.tsx     # Session-based history
│   │   │   ├── Learn.tsx       # Cybersecurity education
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Privacy.tsx
│   │   │   └── Help.tsx
│   │   ├── services/           # API client
│   │   │   └── api.ts
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useHistory.ts  # Session storage hook
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   └── lib/                # Utilities
│   │       └── utils.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── api/                # API routes
│   │   ├── analyzers/          # Security analyzers
│   │   │   ├── email_analyzer.py
│   │   │   ├── sms_analyzer.py
│   │   │   ├── url_analyzer.py
│   │   │   └── password_analyzer.py
│   │   ├── ai/                 # AI provider abstraction
│   │   │   └── provider.py
│   │   ├── core/               # Configuration
│   │   │   └── config.py
│   │   ├── schemas/            # Pydantic models
│   │   ├── services/           # Business logic
│   │   └── security/           # Security utilities
│   └── requirements.txt
│
├── samples/                     # Demo data
│   ├── phishing-email.json
│   ├── scam-sms.json
│   └── suspicious-url.json
│
├── docs/                        # Documentation
├── .env.example                 # Environment template
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **pip** (Python package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cyber-guardian-ai.git
cd cyber-guardian-ai
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`

### 3. Setup Frontend

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 4. Open in Browser

Visit `http://localhost:5173` and start analyzing!

---

## ⚙️ Environment Variables

### Backend (.env)

```bash
# AI Configuration (Optional - enables AI-powered explanations)
AI_API_KEY=your_api_key_here
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-turbo

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000
```

See `.env.example` for all available options.

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Endpoints

#### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "aiEnabled": false
}
```

#### Analyze Email

```http
POST /api/analyze/email
Content-Type: application/json
```

```json
{
  "subject": "URGENT: Verify your account",
  "sender": "security@bank-example.com",
  "body": "Your account has been compromised. Click here immediately.",
  "links": ["http://suspicious-link.com"],
  "attachments": ["invoice.pdf"]
}
```

#### Analyze SMS

```http
POST /api/analyze/sms
Content-Type: application/json
```

```json
{
  "text": "BANK ALERT: Your account has been suspended. Call now!",
  "sender": "+1-800-555-0199"
}
```

#### Analyze URL

```http
POST /api/analyze/url
Content-Type: application/json
```

```json
{
  "url": "http://secure-bankofamerica.com.logins.xyz"
}
```

#### Analyze QR Code

```http
POST /api/analyze/qr
Content-Type: multipart/form-data
```

#### Analyze Password

```http
POST /api/analyze/password
Content-Type: application/json
```

```json
{
  "password": "password123"
}
```

#### Get Education Topics

```http
GET /api/education
```

---

## 🔍 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Email   │ │   SMS    │ │   URL    │ │   QR     │          │
│  │ Analyzer │ │ Analyzer │ │ Analyzer │ │ Analyzer │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │             │            │             │                 │
│       └─────────────┴────────────┴─────────────┘                 │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │  Frontend   │                               │
│                    │   (React)   │                               │
│                    └──────┬──────┘                               │
└───────────────────────────┼─────────────────────────────────────┘
                            │ API Calls
┌───────────────────────────┼─────────────────────────────────────┐
│                    ┌──────▼──────┐                               │
│                    │   Backend   │                               │
│                    │  (FastAPI)  │                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│       ┌───────────────────┼───────────────────┐                  │
│       │                   │                   │                  │
│  ┌────▼────┐        ┌─────▼─────┐       ┌─────▼─────┐           │
│  │Pattern  │        │    AI     │       │  Input    │           │
│  │Analysis │        │ Provider  │       │Validation │           │
│  │Engine   │        │ (Optional)│       │           │           │
│  └────┬────┘        └─────┬─────┘       └─────┬─────┘           │
│       │                   │                   │                  │
│       └───────────────────┼───────────────────┘                  │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │   Results   │                               │
│                    │   + Risk    │                               │
│                    │  Assessment │                               │
│                    └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Analysis Pipeline

1. **Input Validation** — Sanitize and validate all user input
2. **Pattern Analysis** — Deterministic checks for known threats
3. **Indicator Detection** — Identify suspicious patterns
4. **Risk Scoring** — Calculate threat level (0-100)
5. **AI Interpretation** — Generate human-readable explanations (when configured)
6. **Evidence Classification** — Categorize as OBSERVED, DERIVED, or INFERRED
7. **Recommendations** — Provide actionable security guidance

---

## 🔒 Security

### What We Do

✅ **Client-side password analysis** — Passwords never leave your browser  
✅ **No account required** — Use all tools anonymously  
✅ **Temporary history** — Stored in sessionStorage, clears on browser close  
✅ **Input validation** — All endpoints validate and sanitize input  
✅ **CORS protection** — Restrictive cross-origin policies  
✅ **No secrets in frontend** — AI keys stay on the server  

### What We Don't Do

❌ Store passwords  
❌ Require authentication  
❌ Collect personal data  
❌ Track users  
❌ Perform unauthorized scanning  
❌ Fabricate threat intelligence  

### AI Safety

- User-submitted content is treated as **untrusted data**
- Prompt injection attempts are blocked
- AI responses are clearly labeled as interpretations, not facts
- Deterministic analysis always runs regardless of AI availability

---

## 🧪 Testing

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Run Backend Tests

```bash
cd backend
pytest
```

### Manual API Testing

```bash
# Test email analysis
curl -X POST http://localhost:8000/api/analyze/email \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","sender":"test@example.com","body":"Test body"}'

# Test URL analysis
curl -X POST http://localhost:8000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Test password check
curl -X POST http://localhost:8000/api/analyze/password \
  -H "Content-Type: application/json" \
  -d '{"password":"test123"}'
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [React](https://react.dev/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Lucide](https://lucide.dev/) — Beautiful icons
- [Qwen/Alibaba Cloud](https://qwen.aliyun.com/) — AI model provider

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/cyber-guardian-ai/issues)
- **Email:** your.email@example.com

---

<div align="center">

**Made with ❤️ for a safer internet**

[⬆ Back to Top](#-cyber-guardian-ai)

</div>
