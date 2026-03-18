import os
import httpx
from google import genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
PAPER_SERVICE_URL = os.getenv("PAPER_SERVICE_URL", "http://localhost:8001")

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="AI Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    paper_id: str

class ExplainRequest(BaseModel):
    paper_id: str
    level: str = "beginner"

class ChatRequest(BaseModel):
    paper_id: str
    question: str

async def fetch_paper_text(paper_id: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{PAPER_SERVICE_URL}/paper/{paper_id}"
        )
        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="Paper not found. Please upload the paper first."
            )
        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch paper from Paper Service."
            )
        data = response.json()
        chunks = data.get("chunks", [])
        if not chunks:
            raise HTTPException(
                status_code=422,
                detail="Paper has no text content."
            )
        full_text = " ".join(chunks)
        return full_text[:30000]

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/summarize")
async def summarize(request: SummarizeRequest):
    paper_text = await fetch_paper_text(request.paper_id)

    prompt = f"""You are an expert academic assistant. 
Read the following research paper or document and provide 
a clear, concise summary in 4-6 sentences.

The summary should cover:
- What the document is about
- The main topics or contributions  
- Key findings or conclusions
- Why it is important or useful

Document text:
{paper_text}

Provide only the summary, no extra commentary."""

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        summary = response.text.strip()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API error: {str(e)}"
        )

    return {
        "success": True,
        "paper_id": request.paper_id,
        "summary": summary
    }

@app.post("/explain")
async def explain(request: ExplainRequest):
    return {
        "success": True,
        "paper_id": request.paper_id,
        "level": request.level,
        "explanation": "Multi-level explanation coming in Phase 3B."
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    return {
        "success": True,
        "paper_id": request.paper_id,
        "question": request.question,
        "answer": "Chat with paper coming in Phase 3C."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
