"""
Vector Service — embedding generation, storage, and similarity search via FAISS.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.vector import router as vector_router

app = FastAPI(title="PaperPilot Vector Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vector_router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "vector-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
