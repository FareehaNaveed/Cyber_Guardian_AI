"""
Cyber Guardian AI — URL/Website Safety Analyzer
Safe analysis only — no exploitation, no pen testing.
"""
import re
from urllib.parse import urlparse


SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz", ".click", ".download"]
BRAND_DOMAINS = ["paypal.com", "amazon.com", "apple.com", "microsoft.com", "google.com", "netflix.com"]


def analyze_url(url: str) -> dict:
    """Analyze a URL for suspicious characteristics."""
    indicators = []
    evidence = []
    threat_score = 0

    # Normalize URL
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        return _error_result("Invalid URL format.")

    hostname = parsed.hostname or ""

    # HTTPS check
    if parsed.scheme == "http":
        indicators.append({
            "id": "no_https",
            "label": "Not using HTTPS",
            "description": "Data may be intercepted without encryption.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append("Protocol: HTTP (not encrypted)")
        threat_score += 15
    else:
        evidence.append("Protocol: HTTPS (encrypted)")

    # IP address URL
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        indicators.append({
            "id": "ip_url",
            "label": "IP address instead of domain",
            "description": "Unusual for legitimate sites.",
            "severity": "high",
            "category": "observed",
        })
        evidence.append(f"Hostname: {hostname} (IP address)")
        threat_score += 30

    # Long URL
    if len(url) > 200:
        indicators.append({
            "id": "long_url",
            "label": "Unusually long URL",
            "description": "Very long URLs can hide malicious destinations.",
            "severity": "low",
            "category": "observed",
        })
        evidence.append(f"URL length: {len(url)} characters")
        threat_score += 10

    # Suspicious characters
    if "@" in hostname or "--" in hostname:
        indicators.append({
            "id": "suspicious_chars",
            "label": "Suspicious characters in URL",
            "description": "Unusual characters may indicate an attack.",
            "severity": "high",
            "category": "observed",
        })
        threat_score += 25

    # Suspicious TLD
    tld = "." + hostname.split(".")[-1] if "." in hostname else ""
    if tld.lower() in SUSPICIOUS_TLDS:
        indicators.append({
            "id": "suspicious_tld",
            "label": "Suspicious top-level domain",
            "description": f"The domain uses {tld}, commonly associated with malicious sites.",
            "severity": "moderate",
            "category": "observed",
        })
        evidence.append(f"TLD: {tld}")
        threat_score += 15

    # Excessive subdomains
    parts = hostname.split(".")
    if len(parts) > 4:
        indicators.append({
            "id": "excessive_subdomains",
            "label": "Excessive subdomains",
            "description": "Multiple subdomains can disguise the actual domain.",
            "severity": "moderate",
            "category": "derived",
        })
        evidence.append(f"{len(parts) - 2} subdomains detected")
        threat_score += 15

    # Brand impersonation
    host_lower = hostname.lower()
    for brand in BRAND_DOMAINS:
        brand_name = brand.split(".")[0]
        if brand_name in host_lower and not host_lower.endswith(brand):
            indicators.append({
                "id": "brand_impersonation",
                "label": "Possible brand impersonation",
                "description": f"Domain appears to impersonate {brand}.",
                "severity": "critical",
                "category": "derived",
            })
            evidence.append(f"Expected: {brand}, Found: {hostname}")
            threat_score += 40
            break

    # Heavy encoding
    if parsed.path and parsed.path.count("%") > 3:
        indicators.append({
            "id": "heavy_encoding",
            "label": "Heavy URL encoding",
            "description": "Excessive encoding may obfuscate the destination.",
            "severity": "low",
            "category": "observed",
        })
        threat_score += 10

    # Redirect parameters
    if any(param in (parsed.query or "") for param in ["redirect", "url=", "next=", "return="]):
        indicators.append({
            "id": "redirect_param",
            "label": "Contains redirect parameter",
            "description": "May redirect to an unexpected destination.",
            "severity": "low",
            "category": "observed",
        })
        threat_score += 10

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
        "analysisType": "url",
        "note": "External threat intelligence is not currently connected. This assessment is based on URL characteristics and local analysis.",
    }


def _error_result(message: str) -> dict:
    return {
        "riskLevel": "moderate",
        "threatScore": 30,
        "confidence": "low",
        "indicators": [{"id": "invalid_url", "label": "Invalid URL", "description": message, "severity": "moderate", "category": "observed"}],
        "evidence": [],
        "recommendations": [{"priority": "medium", "action": "Verify the URL format", "description": "Ensure the URL is complete and properly formatted."}],
        "explanation": message,
        "explanationUrdu": "یو آر ایل کو پارس نہیں کیا جا سکا۔",
        "analysisType": "url",
    }


def _score_to_risk(score: int) -> str:
    if score >= 80: return "critical"
    if score >= 60: return "high"
    if score >= 40: return "moderate"
    if score >= 20: return "low"
    return "safe"


def _get_recommendations(risk_level: str) -> list:
    if risk_level == "safe":
        return [{"priority": "low", "action": "This URL appears safe", "description": "Always verify before entering sensitive information."}]
    return [
        {"priority": "high", "action": "Do not visit this URL", "description": "This URL shows signs of being suspicious."},
        {"priority": "high", "action": "Do not enter personal information", "description": "If you already visited, check for unauthorized access."},
        {"priority": "low", "action": "External threat intelligence not configured", "description": "Assessment is based on URL characteristics only."},
    ]


def _get_explanation(risk_level: str, indicators: list) -> str:
    count = len(indicators)
    if risk_level == "safe":
        return "This URL appears safe based on its characteristics."
    return f"This URL shows {risk_level} risk. Found {count} indicator{'s' if count > 1 else ''} of concern."


def _get_explanation_urdu(risk_level: str, indicators: list) -> str:
    count = len(indicators)
    if risk_level == "safe":
        return "یہ یو آر ایل اپنی خصوصیات کے مطابق محفوظ لگتا ہے۔"
    return f"یہ یو آر ایل {'خطرناک' if risk_level in ('critical', 'high') else 'مشکوک'} لگتا ہے۔ {count} نشانیاں ملی ہیں۔"
