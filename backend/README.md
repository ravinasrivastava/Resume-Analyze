# CareerMatch AI API

FastAPI service for explainable resume matching. It uses `pypdf` for extraction, a deterministic skill taxonomy, set-based keyword alignment, and a lightweight vocabulary overlap score (the portfolio version avoids paid AI APIs).

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn main:app --reload --port 8000
```

Swagger is available at `http://localhost:8000/docs`. The Next.js client posts `FormData` to `/api/analyze`; Vercel Services removes `/api` before FastAPI receives the request.

The score is `62% keyword alignment + 38% vocabulary overlap`, bounded from 0–100. History is stored in `careermatch.db` with parameterized SQLite queries. PDF uploads are limited to 5MB and rejected unless their MIME type is `application/pdf`.
