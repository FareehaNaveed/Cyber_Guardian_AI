"""
Cyber Guardian AI — AI Provider Abstraction

Provides a clean interface for AI-powered analysis and explanation.
Supports Qwen/Alibaba Cloud through configurable provider.
"""
import httpx
from ..core.config import AI_API_KEY, AI_BASE_URL, AI_MODEL


class AIProvider:
    """Abstraction layer for AI model providers."""

    def __init__(self):
        self.api_key = AI_API_KEY
        self.base_url = AI_BASE_URL
        self.model = AI_MODEL
        self.enabled = bool(self.api_key)

    async def analyze(self, system_prompt: str, user_content: str) -> str:
        """Send content to AI for analysis and return the response."""
        if not self.enabled:
            return self._fallback_response()

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_content},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 1024,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass

        return self._fallback_response()

    async def explain_threat(self, analysis_type: str, indicators: list, risk_level: str) -> dict:
        """Generate human-readable explanation of threat analysis."""
        system_prompt = """You are Cyber Guardian AI, a cybersecurity assistant.
Explain security findings in simple, non-technical language.
Provide explanations in both English and Urdu.
Never fabricate threat intelligence or claim guaranteed detection.
Use phrases like 'Potentially suspicious' or 'Likely phishing' instead of absolute claims.
Always separate OBSERVED facts from AI INTERPRETATION."""

        user_content = f"""Analyze these findings from a {analysis_type} analysis:

Risk Level: {risk_level}
Detected Indicators: {', '.join(indicators)}

Provide:
1. A simple English explanation (2-3 sentences)
2. An Urdu translation
3. Three recommended actions"""

        if not self.enabled:
            return self._fallback_explanation(risk_level, indicators)

        try:
            response_text = await self.analyze(system_prompt, user_content)
            return {
                "explanation": response_text,
                "explanationUrdu": self._generate_urdu_explanation(risk_level, indicators),
                "source": "ai",
            }
        except Exception:
            return self._fallback_explanation(risk_level, indicators)

    def _fallback_response(self) -> str:
        return "AI analysis is not currently configured. Analysis is based on deterministic pattern matching only."

    def _fallback_explanation(self, risk_level: str, indicators: list) -> dict:
        count = len(indicators)
        if risk_level in ("critical", "high"):
            explanation = f"Multiple security indicators were detected ({count} findings). This content exhibits patterns commonly associated with threats. Please exercise caution."
            urdu = f"کئی سیکیورٹی نشانیاں دریافت ہوئی ہیں ({count} نتائج)۔ یہ مواد خطرات سے ملتا جلتا ہے۔ براہ کرم احتیاط برتن۔"
        elif risk_level == "moderate":
            explanation = f"Some potential concerns were identified ({count} indicators). The content shows characteristics that warrant further review."
            urdu = f"کچھ ممکنہ خطرات کی نشانیاں ملی ہیں ({count} نشانیاں)۔ مواد میں ایسی خصوصیات ہیں جن کی مزید جانچ ہونی چاہیے۔"
        elif risk_level == "low":
            explanation = f"Minor concerns were found ({count} indicators). The content appears mostly safe but may contain elements worth noting."
            urdu = f"مختصر خطرات ملے ہیں ({count} نشانیاں)۔ مواد زیادہ تر محفوظ لگتا ہے۔"
        else:
            explanation = "No significant security concerns were detected in the submitted content."
            urdu = "جمع کردہ مواد میں کوئی اہم سیکیورٹی خطرات نہیں ملے۔"

        return {
            "explanation": explanation,
            "explanationUrdu": urdu,
            "source": "deterministic",
        }

    def _generate_urdu_explanation(self, risk_level: str, indicators: list) -> str:
        count = len(indicators)
        if risk_level in ("critical", "high"):
            return f"یہ مواد زیادہ خطرناک لگتا ہے۔ {count} خطرے کی نشانیاں دریافت ہوئی ہیں۔ براہ کرم احتیاط برٹیں۔"
        elif risk_level == "moderate":
            return f"اس مواد میں کچھ مشکوک چیزیں ملی ہیں۔ {count} نشانیاں دریافت ہوئی ہیں۔"
        elif risk_level == "low":
            return f"چھوٹی خطرات ملی ہیں۔ {count} نشانیاں دریافت ہوئی ہیں۔"
        else:
            return "اس مواد میں کوئی اہم خطرہ نہیں ملا۔"


ai_provider = AIProvider()
