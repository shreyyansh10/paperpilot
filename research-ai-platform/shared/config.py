"""
Shared configuration for all microservices.
Reads from environment variables with sensible local defaults.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── Service URLs ──────────────────────────────────────────────
API_GATEWAY_URL = os.getenv("API_GATEWAY_URL", "http://localhost:8000")
PAPER_SERVICE_URL = os.getenv("PAPER_SERVICE_URL", "http://localhost:8001")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8002")
VECTOR_SERVICE_URL = os.getenv("VECTOR_SERVICE_URL", "http://localhost:8003")
CITATION_SERVICE_URL = os.getenv("CITATION_SERVICE_URL", "http://localhost:8004")

# ── OpenAI ────────────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ── Database ──────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/paperpilot")

# ── Storage ───────────────────────────────────────────────────
PDF_STORAGE_DIR = os.getenv("PDF_STORAGE_DIR", os.path.join(os.path.dirname(__file__), "..", "storage", "pdfs"))

# ── Semantic Scholar ──────────────────────────────────────────
SEMANTIC_SCHOLAR_API_URL = os.getenv("SEMANTIC_SCHOLAR_API_URL", "https://api.semanticscholar.org/graph/v1")
