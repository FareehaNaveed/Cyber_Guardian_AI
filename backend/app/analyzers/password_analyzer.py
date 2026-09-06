"""
Cyber Guardian AI — Password Security Analyzer
Client-side preferred. This backend version is for reference/optional use.
Passwords are NEVER stored or logged.
"""
import re
import math

COMMON_PASSWORDS = {
    "password", "123456", "12345678", "qwerty", "abc123", "monkey", "1234567",
    "letmein", "trustno1", "dragon", "baseball", "iloveyou", "master", "sunshine",
    "admin", "welcome", "hello", "charlie", "password1", "password123",
}

SEQUENTIAL_PATTERNS = [
    "abcdefghijklmnopqrstuvwxyz", "zyxwvutsrqponmlkjihgfedcba",
    "01234567890", "09876543210", "qwertyuiop",
]


def analyze_password(password: str) -> dict:
    """Analyze password strength. NEVER store the password."""
    indicators = []
    evidence = []
    problems = []
    suggestions = []
    threat_score = 0

    # Length
    if len(password) < 6:
        problems.append("Too short (less than 6 characters)")
        indicators.append({"id": "pw_short", "label": "Very short password", "description": "Under 6 characters can be cracked instantly.", "severity": "critical", "category": "observed"})
        evidence.append(f"Length: {len(password)} characters")
        threat_score += 40
    elif len(password) < 8:
        problems.append("Short (less than 8 characters)")
        threat_score += 20

    # Character diversity
    has_lower = bool(re.search(r"[a-z]", password))
    has_upper = bool(re.search(r"[A-Z]", password))
    has_digit = bool(re.search(r"\d", password))
    has_special = bool(re.search(r"[^a-zA-Z0-9]", password))
    diversity = sum([has_lower, has_upper, has_digit, has_special])

    if diversity <= 1:
        indicators.append({"id": "pw_low_diversity", "label": "Low character diversity", "description": "Only one type of character used.", "severity": "high", "category": "observed"})
        evidence.append(f"Character types: {diversity}/4")
        threat_score += 25

    if not has_upper: problems.append("No uppercase letters")
    if not has_lower: problems.append("No lowercase letters")
    if not has_digit: problems.append("No numbers")
    if not has_special: problems.append("No special characters")

    # Repeated characters
    if re.search(r"(.)\1{2,}", password):
        problems.append("Contains repeated characters")
        indicators.append({"id": "pw_repeated", "label": "Repeated characters", "description": "Repeated sequences make passwords easier to crack.", "severity": "low", "category": "observed"})
        threat_score += 10

    # Sequential patterns
    pw_lower = password.lower()
    for seq in SEQUENTIAL_PATTERNS:
        for i in range(len(seq) - 2):
            if seq[i:i+3] in pw_lower:
                problems.append("Contains sequential pattern")
                indicators.append({"id": "pw_sequential", "label": "Sequential pattern", "description": "Sequential characters are easily guessed.", "severity": "moderate", "category": "observed"})
                threat_score += 15
                break
        if any(i["id"] == "pw_sequential" for i in indicators):
            break

    # Common password
    if pw_lower in COMMON_PASSWORDS:
        problems.append("This is a commonly used password")
        indicators.append({"id": "pw_common", "label": "Common password", "description": "Appears in known lists of frequently used passwords.", "severity": "critical", "category": "observed"})
        evidence.append("Found in common password database")
        threat_score += 50

    # Improvement suggestions
    if len(password) < 12: suggestions.append("Use at least 12 characters")
    if not has_upper: suggestions.append("Add uppercase letters")
    if not has_lower: suggestions.append("Add lowercase letters")
    if not has_digit: suggestions.append("Add numbers")
    if not has_special: suggestions.append("Add special characters (!@#$%^&*)")
    suggestions.append("Consider using a passphrase with multiple random words")
    suggestions.append("Use a unique password for each account")

    # Crack time estimate
    charset_size = (26 if has_lower else 0) + (26 if has_upper else 0) + (10 if has_digit else 0) + (32 if has_special else 0)
    combinations = (charset_size or 1) ** len(password)
    seconds = combinations / 1e10 / 2
    crack_time = _format_crack_time(seconds)

    threat_score = min(threat_score, 100)
    risk_level = _score_to_risk(threat_score)

    return {
        "riskLevel": risk_level,
        "threatScore": threat_score,
        "confidence": "high",
        "strength": _get_strength(risk_level),
        "crackTimeEstimate": crack_time,
        "indicators": indicators,
        "evidence": [{"category": "observed", "content": e} for e in evidence],
        "problems": problems,
        "improvementSuggestions": suggestions,
        "recommendations": [
            {"priority": "high", "action": "Use a password manager", "description": "Generates and stores strong, unique passwords."},
            {"priority": "medium", "action": "Enable two-factor authentication", "description": "Add an extra layer of security."},
        ] + ([{"priority": "high", "action": "Change this password immediately", "description": "Replace with a strong, unique password."}] if risk_level != "safe" else []),
        "explanation": f"Password rated {_get_strength(risk_level)}. Estimated crack time: {crack_time}. {len(problems)} issue{'s' if len(problems) != 1 else ''} found.",
        "explanationUrdu": f"یہ پاس ورڈ {_get_strength_urdu(risk_level)} ہے۔ کرنے کا تخمینہ وقت: {crack_time}۔ {len(problems)} مسئلہ ملے۔",
        "analysisType": "password",
    }


def _score_to_risk(score: int) -> str:
    if score >= 80: return "critical"
    if score >= 60: return "high"
    if score >= 40: return "moderate"
    if score >= 20: return "low"
    return "safe"


def _get_strength(risk_level: str) -> str:
    return {"critical": "very_weak", "high": "weak", "moderate": "moderate", "low": "strong", "safe": "very_strong"}.get(risk_level, "moderate")


def _get_strength_urdu(risk_level: str) -> str:
    return {"critical": "بہت کمزور", "high": "کمزور", "moderate": "درمیانی", "low": "مضبوط", "safe": "بہت مضبوط"}.get(risk_level, "درمیانی")


def _format_crack_time(seconds: float) -> str:
    if seconds < 1: return "Instantly"
    if seconds < 60: return "Less than a minute"
    if seconds < 3600: return f"{int(seconds/60)} minutes"
    if seconds < 86400: return f"{int(seconds/3600)} hours"
    if seconds < 31536000: return f"{int(seconds/86400)} days"
    if seconds < 31536000 * 1000: return f"{int(seconds/31536000)} years"
    return "Millions of years"
