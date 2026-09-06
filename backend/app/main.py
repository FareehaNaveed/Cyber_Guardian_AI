"""
Cyber Guardian AI — FastAPI Backend
Main application with API endpoints for security analysis.
"""
import os
import tempfile
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import re

from .analyzers.email_analyzer import analyze_email
from .analyzers.sms_analyzer import analyze_sms
from .analyzers.url_analyzer import analyze_url
from .analyzers.password_analyzer import analyze_password
from .ai.provider import ai_provider

app = FastAPI(
    title="Cyber Guardian AI",
    description="AI-powered cybersecurity assistant API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request/Response Models ────────────────────────────────────────────────

class EmailRequest(BaseModel):
    subject: str = Field(..., min_length=1, max_length=5000)
    sender: str = Field(..., min_length=1, max_length=500)
    body: str = Field(..., min_length=1, max_length=50000)
    links: List[str] = Field(default_factory=list)
    attachments: List[str] = Field(default_factory=list)


class SmsRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    sender: Optional[str] = None
    url: Optional[str] = None


class UrlRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048)


class PasswordRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=128)


class AnalysisResponse(BaseModel):
    riskLevel: str
    threatScore: int
    confidence: str
    indicators: list
    evidence: list
    recommendations: list
    explanation: str
    explanationUrdu: str
    analysisType: str


class HealthResponse(BaseModel):
    status: str
    version: str
    aiEnabled: bool


# ─── Validation ──────────────────────────────────────────────────────────────

def validate_url(url: str) -> str:
    """Validate and normalize a URL."""
    url = url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    if len(url) > 2048:
        raise HTTPException(status_code=400, detail="URL is too long (max 2048 characters)")
    if not re.match(r"^(https?://|www\.)", url) and "." not in url:
        raise HTTPException(status_code=400, detail="Please enter a valid URL")
    return url


def validate_email_input(data: EmailRequest) -> EmailRequest:
    """Validate email analysis input."""
    if len(data.subject) > 5000:
        raise HTTPException(status_code=400, detail="Subject is too long")
    if len(data.body) > 50000:
        raise HTTPException(status_code=400, detail="Email body is too long")
    return data


# ─── API Endpoints ──────────────────────────────────────────────────────────

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        aiEnabled=ai_provider.enabled,
    )


@app.post("/api/analyze/email", response_model=AnalysisResponse)
async def api_analyze_email(data: EmailRequest):
    """Analyze an email for phishing indicators."""
    data = validate_email_input(data)
    result = analyze_email(
        subject=data.subject,
        sender=data.sender,
        body=data.body,
        links=data.links,
        attachments=data.attachments,
    )
    return result


@app.post("/api/analyze/sms", response_model=AnalysisResponse)
async def api_analyze_sms(data: SmsRequest):
    """Analyze an SMS for scam indicators."""
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="SMS text is required")
    result = analyze_sms(text=data.text, sender=data.sender, url=data.url)
    return result


@app.post("/api/analyze/url", response_model=AnalysisResponse)
async def api_analyze_url(data: UrlRequest):
    """Analyze a URL for safety indicators."""
    url = validate_url(data.url)
    result = analyze_url(url=url)
    return result


@app.post("/api/analyze/qr", response_model=AnalysisResponse)
async def api_analyze_qr(file: UploadFile = File(...)):
    """Analyze a QR code image."""
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported image format. Use PNG, JPEG, WebP, or GIF.")

    # Validate file size (10MB max)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    # Try to decode QR code
    try:
        from PIL import Image
        import io
        import pyzbar.pyzbar as pyzbar

        image = Image.open(io.BytesIO(contents))
        decoded = pyzbar.decode(image)

        if not decoded:
            raise HTTPException(status_code=400, detail="No QR code found in this image")

        qr_content = decoded[0].data.decode("utf-8")

        # If it's a URL, analyze it
        if qr_content.startswith(("http://", "https://")):
            result = analyze_url(url=qr_content)
            result["qrContent"] = qr_content
            result["destinationType"] = "url"
            return result

        # Non-URL content
        return {
            "riskLevel": "low",
            "threatScore": 10,
            "confidence": "medium",
            "indicators": [],
            "evidence": [{"category": "observed", "content": f"Decoded: {qr_content[:200]}"}],
            "recommendations": [{"priority": "low", "action": "Review the decoded content", "description": "Non-URL QR content decoded successfully."}],
            "explanation": f"QR code decoded successfully. Content type: {'URL' if qr_content.startswith('http') else 'Text'}",
            "explanationUrdu": "کیو آر کوڈ کامیابی سے ڈی کوڈ ہو گیا۔",
            "analysisType": "qr",
            "qrContent": qr_content,
            "destinationType": "text",
        }

    except HTTPException:
        raise
    except ImportError:
        raise HTTPException(status_code=503, detail="QR decoding service not available. Paste the decoded content instead.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to process this image")


@app.post("/api/analyze/qr/text", response_model=AnalysisResponse)
async def api_analyze_qr_text(data: UrlRequest):
    """Analyze decoded QR text content."""
    content = data.url.strip()

    if content.startswith(("http://", "https://")):
        result = analyze_url(url=content)
        result["qrContent"] = content
        result["destinationType"] = "url"
        return result

    return {
        "riskLevel": "low",
        "threatScore": 10,
        "confidence": "medium",
        "indicators": [],
        "evidence": [{"category": "observed", "content": f"Decoded: {content[:200]}"}],
        "recommendations": [{"priority": "low", "action": "Review the decoded content", "description": "Non-URL QR content decoded successfully."}],
        "explanation": "QR code content analyzed.",
        "explanationUrdu": "کیو آر کوڈ مواد کا تجزیہ ہو گیا۔",
        "analysisType": "qr",
        "qrContent": content,
        "destinationType": "text",
    }


@app.post("/api/analyze/password")
async def api_analyze_password(data: PasswordRequest):
    """Analyze password strength. Password is NEVER stored or logged."""
    result = analyze_password(password=data.password)
    return result


@app.get("/api/education")
async def get_education():
    """Get cybersecurity education topics."""
    return {
        "topics": [
            {"id": "phishing", "title": "Phishing Awareness", "titleUrdu": "فشنگ سے خبرداری", "icon": "Mail"},
            {"id": "sms-scams", "title": "SMS Scam Awareness", "titleUrdu": "ایس ایم ایس اسکیم سے خبرداری", "icon": "MessageSquare"},
            {"id": "password-security", "title": "Password Security", "titleUrdu": "پاس ورڈ کی حفاظت", "icon": "Lock"},
            {"id": "qr-safety", "title": "QR Code Safety", "titleUrdu": "کیو آر کوڈ کی حفاظت", "icon": "QrCode"},
            {"id": "safe-browsing", "title": "Safe Browsing", "titleUrdu": "محفوظ براؤزنگ", "icon": "Globe"},
            {"id": "otp-safety", "title": "OTP Safety", "titleUrdu": "OTP کی حفاظت", "icon": "KeyRound"},
            {"id": "social-engineering", "title": "Social Engineering", "titleUrdu": "سوشل انجینئرنگ", "icon": "Users"},
            {"id": "online-privacy", "title": "Online Privacy", "titleUrdu": "آن لائن رازداری", "icon": "Eye"},
            {"id": "account-security", "title": "Account Security", "titleUrdu": "اکاؤنٹ کی حفاظت", "icon": "UserCheck"},
            {"id": "suspicious-links", "title": "Suspicious Links", "titleUrdu": "مشکوک لنکس", "icon": "Link"},
        ]
    }
