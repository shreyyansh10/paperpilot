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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Service URLs ──────────────────────────────────────────────
PAPER_SERVICE = os.getenv("PAPER_SERVICE_URL", "http://localhost:8001")
AI_SERVICE = os.getenv("AI_SERVICE_URL", "http://localhost:8002")
VECTOR_SERVICE = "http://localhost:8003"
CITATION_SERVICE = os.getenv("CITATION_SERVICE_URL", "http://localhost:8004")
AUTH_SERVICE = "http://localhost:8005"


# ── Health ────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "healthy", "service": "api-gateway"}


# ── Upload Paper ──────────────────────────────────────────────
@app.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    """Forward PDF upload to Paper Service."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = await client.post(f"{PAPER_SERVICE}/upload", files=files)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Get Paper ─────────────────────────────────────────────────
@app.get("/paper/{paper_id}")
async def get_paper(paper_id: str):
    """Forward paper retrieval to Paper Service."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"{PAPER_SERVICE}/paper/{paper_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


# ── Summarize ─────────────────────────────────────────────────
@app.post("/summarize")
async def summarize(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{AI_SERVICE}/summarize",
            json=body
        )
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


# ── Embed ─────────────────────────────────────────────────────
@app.post("/embed")
async def embed(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{VECTOR_SERVICE}/embed", json=body
        )
        return response.json()


# ── Search ────────────────────────────────────────────────────
@app.post("/search")
async def search(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{VECTOR_SERVICE}/search", json=body
        )
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


@app.post("/auth/register")
async def auth_register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{AUTH_SERVICE}/auth/register", json=body
        )
        return response.json()


@app.post("/auth/login")
async def auth_login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{AUTH_SERVICE}/auth/login", json=body
        )
        return response.json()


@app.get("/auth/me")
async def auth_me(request: Request):
    auth_header = request.headers.get("Authorization", "")
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{AUTH_SERVICE}/auth/me",
            headers={"Authorization": auth_header}
        )
        return response.json()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
