"""
Paper Service — handles PDF upload, text extraction, and chunking.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.paper_routes import router

import uvicorn

app = FastAPI(title="Paper Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "paper-service"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
