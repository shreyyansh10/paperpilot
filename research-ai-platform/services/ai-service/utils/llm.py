"""
LLM utility stubs — placeholder functions for AI generation.
These will be replaced with real OpenAI / LangChain calls later.
"""


def generate_summary(text: str) -> str:
    """
    Generate a summary of the given paper text.
    Stub — returns a placeholder response.
    """
    preview = text[:200] + "..." if len(text) > 200 else text
    return (
        f"[AI Summary Placeholder] This is a stub summary for the paper. "
        f"In production, this will call the OpenAI API via LangChain to generate "
        f"a concise summary. Text preview: {preview}"
    )


def generate_explanation(text: str, level: str = "beginner") -> str:
    """
    Generate an explanation at the specified complexity level.
    Levels: beginner, intermediate, expert.
    Stub — returns a placeholder response.
    """
    level_descriptions = {
        "beginner": "a simple, jargon-free explanation suitable for someone with no background in the field",
        "intermediate": "a clear explanation assuming some familiarity with the domain",
        "expert": "a detailed, technical explanation for domain experts",
    }
    desc = level_descriptions.get(level, level_descriptions["beginner"])
    return (
        f"[AI Explanation Placeholder — {level.capitalize()}] "
        f"This stub would produce {desc}. "
        f"In production, this will use OpenAI with a tailored prompt for the '{level}' level."
    )


def answer_question(question: str, context: str | None = None) -> str:
    """
    Answer a question about the paper using context from the vector store.
    Stub — returns a placeholder response.
    """
    return (
        f"[AI Chat Placeholder] You asked: '{question}'. "
        f"In production, this will retrieve relevant chunks from the Vector Service "
        f"and use OpenAI to generate a grounded answer via RAG. "
        f"Context provided: {'Yes' if context else 'No'}."
    )
