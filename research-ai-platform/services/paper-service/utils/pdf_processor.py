"""
PDF processing utilities — text extraction and chunking.
"""

import fitz  # PyMuPDF


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """
    Split text into overlapping chunks for embedding.
    
    Args:
        text: The full document text.
        chunk_size: Maximum characters per chunk.
        overlap: Number of overlapping characters between consecutive chunks.
    
    Returns:
        A list of text chunks.
    """
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks
