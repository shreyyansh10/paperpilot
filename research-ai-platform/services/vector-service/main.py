import os
import httpx
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss

app = FastAPI(title="Vector Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

PAPER_SERVICE_URL = "http://localhost:8001"

# Load sentence transformer model
print("Loading embedding model...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Embedding model loaded!")

# In-memory store for FAISS indexes
# { paper_id: { "index": faiss_index, "chunks": [str] } }
VECTOR_STORE: dict = {}

# ── Request Models ─────────────────────────────────────

class EmbedRequest(BaseModel):
    paper_id: str

class SearchRequest(BaseModel):
    paper_id: str
    query: str
    top_k: int = 5

# ── Health ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "healthy", "service": "vector-service"}

# ── Embed Paper ────────────────────────────────────────

@app.post("/embed")
async def embed_paper(request: EmbedRequest):
    paper_id = request.paper_id

    # Check if already embedded
    if paper_id in VECTOR_STORE:
        return {
            "success": True,
            "paper_id": paper_id,
            "message": "Paper already embedded",
            "total_chunks": len(VECTOR_STORE[paper_id]["chunks"])
        }

    # Fetch chunks from Paper Service
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{PAPER_SERVICE_URL}/paper/{paper_id}"
        )
        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="Paper not found. Please upload first."
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
            detail="Paper has no text chunks to embed."
        )

    # Generate embeddings for all chunks
    print(f"Generating embeddings for {len(chunks)} chunks...")
    embeddings = embedding_model.encode(
        chunks,
        convert_to_numpy=True,
        show_progress_bar=False
    )

    # Normalize embeddings for cosine similarity
    embeddings = embeddings.astype(np.float32)
    faiss.normalize_L2(embeddings)

    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(embeddings)

    # Store in memory
    VECTOR_STORE[paper_id] = {
        "index": index,
        "chunks": chunks
    }

    print(f"Embedded {len(chunks)} chunks for paper {paper_id}")

    return {
        "success": True,
        "paper_id": paper_id,
        "total_chunks": len(chunks),
        "embedding_dimension": dimension,
        "message": f"Successfully embedded {len(chunks)} chunks"
    }

# ── Search ─────────────────────────────────────────────

@app.post("/search")
async def search(request: SearchRequest):
    paper_id = request.paper_id

    # Auto-embed if not already done
    if paper_id not in VECTOR_STORE:
        await embed_paper(EmbedRequest(paper_id=paper_id))

    store = VECTOR_STORE[paper_id]
    index = store["index"]
    chunks = store["chunks"]

    # Embed the query
    query_embedding = embedding_model.encode(
        [request.query],
        convert_to_numpy=True
    )
    query_embedding = query_embedding.astype(np.float32)
    faiss.normalize_L2(query_embedding)

    # Search FAISS for top_k similar chunks
    top_k = min(request.top_k, len(chunks))
    distances, indices = index.search(query_embedding, top_k)

    # Build results
    results = []
    for i, (dist, idx) in enumerate(
        zip(distances[0], indices[0])
    ):
        if idx >= 0:
            results.append({
                "chunk_index": int(idx),
                "chunk_text": chunks[idx],
                "similarity_score": float(dist)
            })

    return {
        "success": True,
        "paper_id": paper_id,
        "query": request.query,
        "results": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8003,
        reload=True
    )
