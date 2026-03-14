"""
Paper router — PDF upload and text extraction endpoint.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_processor import extract_text_from_pdf, chunk_text
import os
import uuid

router = APIRouter()

STORAGE_DIR = os.getenv("PDF_STORAGE_DIR", os.path.join(os.path.dirname(__file__), "..", "..", "storage", "pdfs"))


@router.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    """
    Accept a PDF upload, save it locally, extract text, and chunk it.
    Returns the paper ID, extracted text, and chunks.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Save the uploaded file
    paper_id = str(uuid.uuid4())
    os.makedirs(STORAGE_DIR, exist_ok=True)
    file_path = os.path.join(STORAGE_DIR, f"{paper_id}.pdf")

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text
    try:
        text = extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    # Chunk the text
    chunks = chunk_text(text)

    return {
        "paper_id": paper_id,
        "filename": file.filename,
        "total_characters": len(text),
        "total_chunks": len(chunks),
        "text": text[:2000],  # preview first 2000 chars
        "chunks": chunks[:5],  # preview first 5 chunks
    }
