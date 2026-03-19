import os
import httpx
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# -- Groq Configuration --------------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
PAPER_SERVICE_URL = os.getenv("PAPER_SERVICE_URL", "http://localhost:8001")
VECTOR_SERVICE_URL = os.getenv("VECTOR_SERVICE_URL", "http://localhost:8003")

# Initialize Groq client (OpenAI-compatible)
groq_client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url=GROQ_BASE_URL
)

app = FastAPI(title="AI Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Request Models ------------------------------------

class SummarizeRequest(BaseModel):
    paper_id: str

class ExplainRequest(BaseModel):
    paper_id: str
    level: str = "beginner"

class ChatRequest(BaseModel):
    paper_id: str
    question: str

# -- Helper: Fetch paper text from Paper Service -------

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

# -- Helper: Call Grok API -----------------------------

def call_grok(
    prompt: str,
    system_prompt: str = "You are an expert academic assistant.",
    max_tokens: int = 1000,
    temperature: float = 0.7
) -> str:
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API error: {str(e)}"
        )

# -- Health --------------------------------------------

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ai-service"}

# -- Summarize -----------------------------------------

@app.post("/summarize")
async def summarize(request: SummarizeRequest):
    paper_text = await fetch_paper_text(request.paper_id)

    prompt = f"""Read the following research paper or 
document and provide a clear concise summary in 4-6 sentences.

The summary should cover:
- What the document is about
- The main topics or contributions
- Key findings or conclusions
- Why it is important or useful

Document text:
{paper_text}

Provide only the summary, no extra commentary."""

    summary = call_grok(prompt, max_tokens=500)

    return {
        "success": True,
        "paper_id": request.paper_id,
        "summary": summary
    }

# -- Explain -------------------------------------------

@app.post("/explain")
async def explain(request: ExplainRequest):
    paper_text = await fetch_paper_text(request.paper_id)
    level = request.level.lower()

    if level == "beginner":
        system_prompt = "You are explaining to a 6 year old child."

        prompt = f"""I am 6 years old. Explain this to me.

    Use ONLY these types of words:
    - Words like: big, small, fast, slow, good, bad
    - Compare everything to: toys, food, animals, games
    - No big words AT ALL

    Tell me like a bedtime story.
    Start with: "Once upon a time, some smart people wanted to..."

    Write 4 paragraphs. Each paragraph is 3-4 sentences.
    Total must be more than 200 words.

    Here is the document:
    {paper_text}

    Remember: I am 6 years old. Use ONLY baby-simple words."""

    elif level == "intermediate":
        system_prompt = "You are a university professor giving a lecture."

        prompt = f"""You are giving a university lecture.
    Write lecture notes for undergraduate students.

    Use these EXACT headings:

    # What Is This About?
    [2-3 paragraphs explaining the topic]

    # Main Technical Concepts
    [explain 3-4 key concepts with definitions]

    # How It Works
    [step by step explanation of the methodology]

    # Results and Findings  
    [what was discovered or achieved]

    # Why This Matters
    [real world applications and importance]

    Write minimum 400 words total.
    Use academic language but explain technical terms.

    Document:
    {paper_text}"""

    elif level == "expert":
        system_prompt = "You are a critical peer reviewer for Nature journal."

        prompt = f"""Write a critical peer review analysis.

    Use these EXACT headings:

    # Abstract-Level Assessment
    [Technical summary of contributions]

    # Methodology Critique
    [Detailed technical analysis of methods used]

    # Results Evaluation  
    [Critical analysis of results and metrics]

    # Technical Innovations
    [What is genuinely novel about this work]

    # Weaknesses and Limitations
    [Critical weaknesses in the approach]

    # Recommended Future Work
    [Technical directions for future research]

    Write minimum 600 words.
    Use highly technical language throughout.
    Be critical and precise.

    Document:
    {paper_text}"""

    else:
        system_prompt = "You are an expert academic assistant."
        prompt = f"""Explain this document clearly 
for a general educated audience in 300+ words.

Document:
{paper_text}"""

    # Use level-specific generation settings for explanations
    if level == "beginner":
        max_tokens = 600
        temperature = 0.9
    elif level == "intermediate":
        max_tokens = 900
        temperature = 0.7
    elif level == "expert":
        max_tokens = 1400
        temperature = 0.3
    else:
        max_tokens = 600
        temperature = 0.7

    explanation = call_grok(
        prompt,
        system_prompt=system_prompt,
        max_tokens=max_tokens,
        temperature=temperature
    )

    return {
        "success": True,
        "paper_id": request.paper_id,
        "level": request.level,
        "explanation": explanation
    }

# -- Chat (RAG) ----------------------------------------

@app.post("/chat")
async def chat(request: ChatRequest):
    paper_id = request.paper_id
    question = request.question

    # Step 1: Search relevant chunks via Vector Service
    async with httpx.AsyncClient(timeout=30) as http_client:
        search_response = await http_client.post(
            f"{VECTOR_SERVICE_URL}/search",
            json={
                "paper_id": paper_id,
                "query": question,
                "top_k": 5
            }
        )
        if search_response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail="Vector search failed."
            )
        search_data = search_response.json()
        relevant_chunks = search_data.get("results", [])

    if not relevant_chunks:
        raise HTTPException(
            status_code=422,
            detail="No relevant content found in paper."
        )

    # Step 2: Build context from top chunks
    context = "\n\n---\n\n".join([
        f"Excerpt {i+1}:\n{chunk['chunk_text']}"
        for i, chunk in enumerate(relevant_chunks)
    ])

    # Step 3: Build RAG prompt
    prompt = f"""Use ONLY the following excerpts from 
the document to answer the question. If the answer is 
not found in the excerpts, say "I could not find 
information about this in the provided document."

Document Excerpts:
{context}

User Question: {question}

Instructions:
- Answer directly and clearly
- Base your answer only on the excerpts above
- Keep the answer focused and concise
- If the question cannot be answered from the excerpts,
  say so honestly

Answer:"""

    answer = call_grok(
        prompt,
        system_prompt="You are an expert academic assistant helping users understand research papers. Answer questions accurately based only on the provided document excerpts.",
        max_tokens=800
    )

    return {
        "success": True,
        "paper_id": paper_id,
        "question": question,
        "answer": answer,
        "sources_used": len(relevant_chunks)
    }

# -- Run -----------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True
    )
