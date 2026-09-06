"""
Cyber Guardian AI — Email Phishing Analyzer
Deterministic pattern-based analysis with AI explanation.
"""
import re
from ..ai.provider import ai_provider


PHISHING_KEYWORDS = [
    "verify your account", "confirm your identity", "suspended", "limited access",
    "unauthorized", "click here immediately", "act now", "urgent action required",
    "your account will be", "security alert", "unusual activity",
    "update your payment", "validate your", "reactivate",
    "dear customer", "dear user", "dear account holder",
]

CREDENTIAL_REQUEST_PATTERNS = [
    r"password", r"username", r"login credentials", r"social security",
    r"credit card", r"bank account", r"otp", r"one.?time.?password",
    r"cvv", r"pin.?code", r"ssn", r"routing number",
]

URGENCY_WORDS = [
    "immediately", "urgent", "expires today", "act now", "limited time",
    "don't delay", "within 24 hours", "final notice", "last chance",
    "suspended", "deactivated",
]

FINANCIAL_WORDS = [
    "wire transfer", "send money", "payment", "bank", "bitcoin", "crypto",
    "western union", "moneygram", "gift card", "itunes",
]


def analyze_email(subject: str, sender: str, body: str, links: list = None, attachments: list = None) -> dict:
    """Analyze an email for phishing indicators."""
    indicators = []
    evidence = []
    threat_score = 0

    body_lower = body.lower()
    subject_lower = subject.lower()
    sender_lower = sender.lower()

    # Suspicious sender check
    if re.match(r"^[^@]+@(protonmail|tutanota|guerrilla)", sender_lower):
        indicators.append({
            "id": "suspicious_sender",
            "label": "Suspicious sender domain",
            "description": "Sender uses a free/anonymous email provider.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append(f"Sender: {sender}")
        threat_score += 15

    # Phishing keywords
    matched_kw = [kw for kw in PHISHING_KEYWORDS if kw in body_lower or kw in subject_lower]
    if matched_kw:
        indicators.append({
            "id": "phishing_keywords",
            "label": "Phishing language detected",
            "description": f"Found {len(matched_kw)} common phishing phrases.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append(f"Matched: {', '.join(matched_kw[:5])}")
        threat_score += min(len(matched_kw) * 8, 25)

    # Credential requests
    cred_matches = [p for p in CREDENTIAL_REQUEST_PATTERNS if re.search(p, body_lower)]
    if cred_matches:
        indicators.append({
            "id": "credential_request",
            "label": "Requests sensitive information",
            "description": "Message appears to request personal or financial credentials.",
            "severity": "high",
            "category": "observed",
        })
        evidence.append(f"Sensitive terms: {', '.join(cred_matches[:5])}")
        threat_score += 25

    # Urgency
    urgency = [w for w in URGENCY_WORDS if w in body_lower or w in subject_lower]
    if len(urgency) >= 2:
        indicators.append({
            "id": "urgency",
            "label": "Urgency and pressure tactics",
            "description": "Multiple urgency phrases detected.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append(f"Urgency phrases: {', '.join(urgency)}")
        threat_score += 15

    # Financial
    financial = [w for w in FINANCIAL_WORDS if w in body_lower]
    if financial:
        indicators.append({
            "id": "financial_request",
            "label": "Financial content detected",
            "description": "References financial transactions or payments.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append(f"Financial terms: {', '.join(financial)}")
        threat_score += 15

    # Suspicious links
    if links:
        suspicious = [l for l in links if "bit.ly" in l or "tinyurl" in l or "@" in l or re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", l)]
        if suspicious:
            indicators.append({
                "id": "suspicious_links",
                "label": "Suspicious links found",
                "description": "Contains shortened or suspicious-looking URLs.",
                "severity": "high",
                "category": "observed",
            })
            evidence.append(f"Suspicious URLs: {', '.join(suspicious[:3])}")
            threat_score += 20

    # Dangerous attachments
    if attachments:
        dangerous_exts = [".exe", ".scr", ".bat", ".cmd", ".vbs", ".js", ".wsf"]
        dangerous = [a for a in attachments if any(a.lower().endswith(ext) for ext in dangerous_exts)]
        if dangerous:
            indicators.append({
                "id": "dangerous_attachments",
                "label": "Potentially dangerous attachments",
                "description": "Executable file types detected.",
                "severity": "critical",
                "category": "observed",
            })
            evidence.append(f"Dangerous files: {', '.join(dangerous)}")
            threat_score += 35

    # Generic greeting
    if any(g in body_lower for g in ["dear customer", "dear user", "dear account holder"]):
        indicators.append({
            "id": "generic_greeting",
            "label": "Generic greeting",
            "description": "Uses generic greeting instead of personalization.",
            "severity": "low",
            "category": "observed",
        })
        threat_score += 10

    threat_score = min(threat_score, 100)
    risk_level = _score_to_risk(threat_score)

    # AI explanation
    indicator_labels = [i["label"] for i in indicators]
    ai_explanation = ai_provider._fallback_explanation(risk_level, indicator_labels)

    return {
        "riskLevel": risk_level,
        "threatScore": threat_score,
        "confidence": "high" if threat_score > 60 else "medium" if threat_score > 30 else "low",
        "indicators": indicators,
        "evidence": [{"category": "observed", "content": e} for e in evidence],
        "recommendations": _get_recommendations(risk_level, indicators),
        "explanation": ai_explanation["explanation"],
        "explanationUrdu": ai_explanation["explanationUrdu"],
        "analysisType": "email",
    }


def _score_to_risk(score: int) -> str:
    if score >= 80: return "critical"
    if score >= 60: return "high"
    if score >= 40: return "moderate"
    if score >= 20: return "low"
    return "safe"


def _get_recommendations(risk_level: str, indicators: list) -> list:
    recs = []
    if risk_level != "safe":
        recs.append({"priority": "high", "action": "Do not click any links in this message", "description": "Links may lead to phishing sites."})
        recs.append({"priority": "high", "action": "Do not reply or provide personal information", "description": "Legitimate organizations never ask for credentials via email."})
    if any(i["id"] in ("suspicious_links", "credential_request") for i in indicators):
        recs.append({"priority": "high", "action": "Verify by contacting the organization directly", "description": "Use official channels, not any from this message."})
    if risk_level == "safe":
        recs.append({"priority": "low", "action": "This email appears safe", "description": "Always stay cautious with unsolicited messages."})
    return recs
