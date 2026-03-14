"""
Citation router — fetches related papers from Semantic Scholar.
"""

from fastapi import APIRouter, HTTPException
import httpx
import os

router = APIRouter()

SEMANTIC_SCHOLAR_API = os.getenv(
    "SEMANTIC_SCHOLAR_API_URL",
    "https://api.semanticscholar.org/graph/v1",
)


@router.get("/citations/{paper_title}")
async def get_citations(paper_title: str):
    """
    Search for a paper by title on Semantic Scholar and return its citations
    along with related papers.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Search for the paper
            search_resp = await client.get(
                f"{SEMANTIC_SCHOLAR_API}/paper/search",
                params={"query": paper_title, "limit": 1, "fields": "title,authors,year,abstract,citationCount,url"},
            )

            if search_resp.status_code != 200:
                raise HTTPException(
                    status_code=search_resp.status_code,
                    detail="Failed to search Semantic Scholar.",
                )

            search_data = search_resp.json()
            papers = search_data.get("data", [])

            if not papers:
                return {
                    "paper_title": paper_title,
                    "found": False,
                    "citations": [],
                    "related_papers": [],
                }

            paper = papers[0]
            paper_id = paper.get("paperId")

            # Fetch citations for the found paper
            citations_resp = await client.get(
                f"{SEMANTIC_SCHOLAR_API}/paper/{paper_id}/citations",
                params={"limit": 10, "fields": "title,authors,year,abstract,url"},
            )

            citations = []
            if citations_resp.status_code == 200:
                citations_data = citations_resp.json()
                citations = [
                    c.get("citingPaper", {})
                    for c in citations_data.get("data", [])
                ]

            # Fetch references (related papers)
            references_resp = await client.get(
                f"{SEMANTIC_SCHOLAR_API}/paper/{paper_id}/references",
                params={"limit": 10, "fields": "title,authors,year,abstract,url"},
            )

            related = []
            if references_resp.status_code == 200:
                references_data = references_resp.json()
                related = [
                    r.get("citedPaper", {})
                    for r in references_data.get("data", [])
                ]

            return {
                "paper_title": paper_title,
                "found": True,
                "paper": paper,
                "citations": citations,
                "related_papers": related,
            }

    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Semantic Scholar API unavailable: {str(e)}")
