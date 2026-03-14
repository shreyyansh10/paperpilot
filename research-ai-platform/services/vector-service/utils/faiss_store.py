"""
FAISS vector store stubs — placeholder for embedding and search logic.
Will be replaced with real FAISS + OpenAI embedding calls later.
"""


def add_embeddings(paper_id: str, chunks: list[str]) -> dict:
    """
    Generate embeddings for the given text chunks and add them to the FAISS index.
    Stub — returns a placeholder response without actually creating embeddings.
    """
    return {
        "paper_id": paper_id,
        "status": "stored",
        "chunks_embedded": len(chunks),
        "message": (
            "[Stub] In production, this will generate OpenAI embeddings for each chunk "
            "and store them in a FAISS index keyed by paper_id."
        ),
    }


def search_similar(paper_id: str, query: str, top_k: int = 5) -> dict:
    """
    Search the FAISS index for chunks most similar to the query.
    Stub — returns a placeholder response.
    """
    return {
        "paper_id": paper_id,
        "query": query,
        "top_k": top_k,
        "results": [],
        "message": (
            "[Stub] In production, this will embed the query using OpenAI, "
            "search the FAISS index, and return the top-k most similar chunks."
        ),
    }
