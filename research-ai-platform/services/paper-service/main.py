"""
Paper Service — handles PDF upload, text extraction, and chunking.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.paper import router as paper_router

app = FastAPI(title="PaperPilot Paper Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(paper_router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "paper-service"}
