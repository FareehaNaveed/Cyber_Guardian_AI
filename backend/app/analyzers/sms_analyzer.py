"""
Cyber Guardian AI — SMS Scam Analyzer
"""
import re

SMS_SCAM_PATTERNS = [
    (r"won\s+(a\s+)?prize", "Fake prize claim"),
    (r"congratulations.*won", "Fake prize claim"),
    (r"bank.*suspend|account.*suspend", "Account suspension scam"),
    (r"send\s+(otp|money|code)", "OTP/money request"),
    (r"share.*otp|verify.*otp|enter.*otp", "OTP sharing request"),
    (r"invest.*\d+x|double.*money|guaranteed.*return", "Investment scam"),
    (r"job.*offer|work.*from.*home.*\$", "Job scam"),
    (r"delivery.*missed|package.*held|customs.*fee", "Delivery scam"),
    (r"irs|tax.*refund|government.*grant", "Government impersonation"),
    (r"lottery|sweepstakes|lucky winner", "Lottery scam"),
    (r"click\s+here|tap\s+here|visit\s+now", "Urgent action request"),
    (r"expire|immediate|urgent|act now|last chance", "Urgency language"),
    (r"verify.*identity|confirm.*account", "Identity verification scam"),
]


def analyze_sms(text: str, sender: str = None, url: str = None) -> dict:
    """Analyze an SMS message for scam indicators."""
    indicators = []
    evidence = []
    threat_score = 0

    # Check scam patterns
    for pattern, label in SMS_SCAM_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            existing = [i for i in indicators if i["label"] == label]
            if not existing:
                severity = "high" if "otp" in label.lower() or "suspend" in label.lower() else "moderate"
                indicators.append({
                    "id": f"sms_{label.lower().replace(' ', '_')}",
                    "label": label,
                    "description": f"Matches known scam pattern: {label}",
                    "severity": severity,
                    "category": "observed",
                })
                evidence.append(f"Pattern: {label}")
                threat_score += 30 if "otp" in label.lower() else 25 if "suspend" in label.lower() else 15

    # Check for URLs
    url_regex = r"https?://[^\s]+|bit\.ly/[^\s]+|tinyurl\.com/[^\s]+"
    urls_found = re.findall(url_regex, text)
    if urls_found:
        suspicious_urls = [u for u in urls_found if "bit.ly" in u or "tinyurl" in u or len(u) > 100]
        if suspicious_urls:
            indicators.append({
                "id": "sms_suspicious_url",
                "label": "Contains suspicious shortened URL",
                "description": "Shortened URLs hide the actual destination.",
                "severity": "high",
                "category": "observed",
            })
            evidence.append(f"URLs: {', '.join(suspicious_urls[:3])}")
            threat_score += 25

    # Credential requests
    if re.search(r"password|pin|ssn|credit card|debit card|cvv", text, re.IGNORECASE):
        indicators.append({
            "id": "sms_credential_request",
            "label": "Requests sensitive information",
            "description": "Requests personal or financial information.",
            "severity": "critical",
            "category": "observed",
        })
        evidence.append("References sensitive data types")
        threat_score += 30

    threat_score = min(threat_score, 100)
    risk_level = _score_to_risk(threat_score)

    return {
        "riskLevel": risk_level,
        "threatScore": threat_score,
        "confidence": "high" if threat_score > 60 else "medium" if threat_score > 30 else "low",
        "indicators": indicators,
        "evidence": [{"category": "observed", "content": e} for e in evidence],
        "recommendations": _get_recommendations(risk_level),
        "explanation": _get_explanation(risk_level, indicators),
        "explanationUrdu": _get_explanation_urdu(risk_level, indicators),
        "analysisType": "sms",
    }


def _score_to_risk(score: int) -> str:
    if score >= 80: return "critical"
    if score >= 60: return "high"
    if score >= 40: return "moderate"
    if score >= 20: return "low"
    return "safe"


def _get_recommendations(risk_level: str) -> list:
    if risk_level == "safe":
        return [{"priority": "low", "action": "This message appears safe", "description": "Always verify if something seems unusual."}]
    return [
        {"priority": "high", "action": "Do not click any links", "description": "Links may lead to scam websites."},
        {"priority": "high", "action": "Do not share OTP, PIN, or codes", "description": "Legitimate services never ask for OTPs via SMS."},
        {"priority": "high", "action": "Verify through official channels", "description": "Contact the organization using their official app or website."},
    ]


def _get_explanation(risk_level: str, indicators: list) -> str:
    count = len(indicators)
    if risk_level == "safe":
        return "No significant scam indicators detected."
    return f"Found {count} potential scam indicator{'s' if count > 1 else ''}. This message exhibits patterns associated with {'active scams' if risk_level in ('critical', 'high') else 'potentially suspicious messages'}."


def _get_explanation_urdu(risk_level: str, indicators: list) -> str:
    count = len(indicators)
    if risk_level == "safe":
        return "اس پیغام میں کوئی اہم اسکیم کی نشانی نہیں ملی۔"
    return f"اس پیغام میں {count} ممکنہ اسکیم کی نشانیاں ملی ہیں۔"
