"""Cyber Guardian AI — Backend Configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
AI_MODEL = os.getenv("AI_MODEL", "qwen-turbo")

MAX_FILE_SIZE_MB = 10
ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"]
