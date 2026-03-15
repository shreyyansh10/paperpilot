"""
PDF extraction utilities — text extraction and word-based chunking.
"""

import fitz  # PyMuPDF
from collections import Counter


def _clean_extracted_text(text: str) -> str:
    """Apply multi-step cleaning pipeline to raw extracted text."""

    # STEP 1 — Split into lines
    lines = text.split("\n")

    # STEP 2 — Strip whitespace from each line
    lines = [line.strip() for line in lines]

    # STEP 3 — Remove stray single characters
    lines = [line for line in lines if len(line) > 1]

    # STEP 4 — Remove duplicate consecutive lines
    deduped = []
    for line in lines:
        if not deduped or line != deduped[-1]:
            deduped.append(line)
    lines = deduped

    # STEP 5 — Remove excessive blank lines (never more than 1 consecutive blank)
    cleaned = []
    prev_blank = False
    for line in lines:
        if line == "":
            if not prev_blank:
                cleaned.append(line)
            prev_blank = True
        else:
            cleaned.append(line)
            prev_blank = False
    lines = cleaned

    # STEP 6 — Remove repeated words within a single line
    final_lines = []
    for line in lines:
        words = line.split()
        if words:
            word_counts = Counter(w.lower() for w in words)
            # Check if any word appears more than 3 times
            over_repeated = {w for w, c in word_counts.items() if c > 3}
            if over_repeated:
                # Rebuild line keeping only the first occurrence of over-repeated words
                seen = set()
                new_words = []
                for w in words:
                    key = w.lower()
                    if key in over_repeated:
                        if key not in seen:
                            new_words.append(w)
                            seen.add(key)
                    else:
                        new_words.append(w)
                line = " ".join(new_words)
        final_lines.append(line)

    # STEP 7 — Rejoin
    return "\n".join(final_lines).strip()


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file using PyMuPDF with cleaning."""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()

    return _clean_extracted_text(text)


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks based on word count.

    Args:
        text: The full document text.
        chunk_size: Number of words per chunk.
        overlap: Number of overlapping words between consecutive chunks.

    Returns:
        A list of text chunks.
    """
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks
