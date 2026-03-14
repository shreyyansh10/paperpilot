"""
Vector router — embed and search endpoints.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from utils.faiss_store import add_embeddings, search_similar

router = APIRouter()


class EmbedRequest(BaseModel):
    paper_id: str
    chunks: list[str]


class SearchRequest(BaseModel):
    paper_id: str
    query: str
    top_k: int = 5


@router.post("/embed")
async def embed(req: EmbedRequest):
    """Generate embeddings for text chunks and store in FAISS."""
    result = add_embeddings(req.paper_id, req.chunks)
    return result


@router.post("/search")
async def search(req: SearchRequest):
    """Search for similar chunks using a query."""
    results = search_similar(req.paper_id, req.query, req.top_k)
    return results
