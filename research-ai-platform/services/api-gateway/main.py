"""
API Gateway — routes all frontend requests to downstream microservices.
"""

from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PaperPilot API Gateway", version="0.1.0")

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Service URLs ──────────────────────────────────────────────
PAPER_SERVICE = os.getenv("PAPER_SERVICE_URL", "http://localhost:8001")
AI_SERVICE = os.getenv("AI_SERVICE_URL", "http://localhost:8002")
VECTOR_SERVICE = os.getenv("VECTOR_SERVICE_URL", "http://localhost:8003")
CITATION_SERVICE = os.getenv("CITATION_SERVICE_URL", "http://localhost:8004")


# ── Health ────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "api-gateway"}


# ── Upload Paper ──────────────────────────────────────────────
@app.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    """Forward PDF upload to Paper Service."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = await client.post(f"{PAPER_SERVICE}/upload-paper", files=files)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Summarize ─────────────────────────────────────────────────
@app.post("/summarize")
async def summarize(request: Request):
    """Forward summarization request to AI Service."""
    body = await request.json()
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(f"{AI_SERVICE}/summarize", json=body)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Explain ───────────────────────────────────────────────────
@app.post("/explain")
async def explain(request: Request):
    """Forward explanation request to AI Service."""
    body = await request.json()
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(f"{AI_SERVICE}/explain", json=body)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Chat ──────────────────────────────────────────────────────
@app.post("/chat")
async def chat(request: Request):
    """Forward chat request to AI Service (RAG pipeline)."""
    body = await request.json()
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(f"{AI_SERVICE}/chat", json=body)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Citations ─────────────────────────────────────────────────
@app.get("/citations/{paper_title}")
async def get_citations(paper_title: str):
    """Forward citation request to Citation Service."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"{CITATION_SERVICE}/citations/{paper_title}")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
