# Plant Tracker AI service

FastAPI service for the final delivery track. It intentionally uses each caller's Supabase access token for database REST calls; it does not accept or use a Supabase service-role key. This lets database RLS remain the final authorization boundary for AI reads and mutations.

## Run locally

1. Create a virtual environment and install `pip install -r requirements.txt`.
2. Copy the required values from `.env.ai.example` into `ai-service/.env`.
3. Apply all `supabase/migrations` and run the guide chunk/embed job before expecting RAG sources.
4. Run `uvicorn app.main:app --reload --port 8000` from `ai-service`.

`POST /v1/chat` attempts OpenAI first and Anthropic second. Invalid, missing, empty, rate-limited, or malformed provider responses are treated as a failure; the service returns a safe unavailable message if both fail.

`POST /v1/tools` supports `search_notes`, `get_plant_details`, `summarize_plant_history`, and `create_task`. Mutating `create_task` returns `confirmation_required` unless the caller resubmits exactly the reviewed arguments with `confirmed: true`.
