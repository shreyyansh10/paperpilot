# 🧪 PaperPilot — AI Research Paper Simplifier

A micro-SaaS platform that uses AI to simplify research papers: upload PDFs, get multi-level explanations, ask questions, and explore citations.

---

## Architecture

```
User → React Frontend → API Gateway (8000) → Microservices
                                              ├─ Paper Service   (8001)
                                              ├─ AI Service      (8002)
                                              ├─ Vector Service   (8003)
                                              └─ Citation Service (8004)
```

| Service          | Port  | Description                               |
| ---------------- | ----- | ----------------------------------------- |
| API Gateway      | 8000  | Routes requests to downstream services    |
| Paper Service    | 8001  | PDF upload, text extraction, chunking     |
| AI Service       | 8002  | Summarization, explanation, Q&A           |
| Vector Service   | 8003  | Embedding generation & similarity search  |
| Citation Service | 8004  | Related papers via Semantic Scholar API   |
| Frontend         | 5173  | React + Vite SPA                          |

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** & npm
- (Optional) PostgreSQL for metadata storage

---

## Quick Start

### 1. Clone & configure

```bash
cd research-ai-platform
cp .env.example .env
# Edit .env with your OpenAI API key
```

### 2. Start backend services

Open a separate terminal for each service:

```bash
# API Gateway
cd services/api-gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Paper Service
cd services/paper-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# AI Service
cd services/ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# Vector Service
cd services/vector-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8003

# Citation Service
cd services/citation-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8004
```

### 3. Verify services

```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
```

Each should return `{"status": "healthy", "service": "<name>"}`.

### 4. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Project Structure

```
research-ai-platform/
├── frontend/                  # React + Vite SPA
│   └── src/
│       ├── api/client.js      # Axios API client
│       ├── pages/             # Page components
│       ├── App.jsx            # Router + sidebar nav
│       └── index.css          # Global styles + Tailwind
├── services/
│   ├── api-gateway/           # FastAPI gateway (port 8000)
│   ├── paper-service/         # PDF processing (port 8001)
│   ├── ai-service/            # LLM summarize/explain/chat (port 8002)
│   ├── vector-service/        # FAISS embeddings (port 8003)
│   └── citation-service/      # Semantic Scholar (port 8004)
├── shared/                    # Shared config module
├── storage/pdfs/              # Local PDF storage
├── docker-compose.yml         # Docker orchestration (placeholder)
├── .env.example               # Environment variable template
└── README.md
```

---

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React, Vite, TailwindCSS v4, Axios  |
| Backend    | Python, FastAPI, Uvicorn             |
| AI         | OpenAI API, LangChain, FAISS        |
| PDF        | PyMuPDF                             |
| Citations  | Semantic Scholar API                 |
| Database   | PostgreSQL (planned)                 |

---

## Current Status

This is the **architecture scaffold** — services start, health endpoints respond, and the frontend renders. AI logic, vector embedding, and database integration will be implemented next.

---

## License

Private — All rights reserved.
