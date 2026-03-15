"""
Paper routes — PDF upload, text extraction, chunking, and retrieval.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_extractor import extract_text_from_pdf, chunk_text
import os
import uuid

router = APIRouter()

# In-memory storage for paper data
PAPERS = {}

# Resolve storage path relative to this file: routes/ -> paper-service/ -> project root -> storage/pdfs
STORAGE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "storage", "pdfs")
)


@router.post("/upload")
async def upload_paper(file: UploadFile = File(...)):
    """
    Accept a PDF upload, save it locally, extract text, chunk it,
    and store metadata in memory.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Generate unique paper ID
    paper_id = str(uuid.uuid4())

    # Ensure storage directory exists
    os.makedirs(STORAGE_PATH, exist_ok=True)

    # Save uploaded file
    file_path = os.path.join(STORAGE_PATH, f"{paper_id}.pdf")
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file_path)

    if not extracted_text:
        raise HTTPException(
            status_code=422, detail="Could not extract text from this PDF."
        )

    # Chunk the extracted text
    chunks = chunk_text(extracted_text)

    # Count words
    total_words = len(extracted_text.split())

    # Store paper data in memory
    PAPERS[paper_id] = {
        "paper_id": paper_id,
        "filename": file.filename,
        "file_path": file_path,
        "text": extracted_text,
        "chunks": chunks,
        "total_chunks": len(chunks),
        "total_words": total_words,
    }

    return {
        "success": True,
        "paper_id": paper_id,
        "filename": file.filename,
        "total_words": total_words,
        "total_chunks": len(chunks),
        "preview": extracted_text[:300] + "..." if len(extracted_text) > 300 else extracted_text,
    }


@router.get("/paper/{paper_id}")
async def get_paper(paper_id: str):
    """Retrieve paper metadata and all text chunks by paper_id."""
    if paper_id not in PAPERS:
        raise HTTPException(status_code=404, detail="Paper not found.")

    paper = PAPERS[paper_id]
    return {
        "paper_id": paper["paper_id"],
        "filename": paper["filename"],
        "total_words": paper["total_words"],
        "total_chunks": paper["total_chunks"],
        "chunks": paper["chunks"],
    }
