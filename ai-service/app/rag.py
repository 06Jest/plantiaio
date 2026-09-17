import httpx

from .schemas import Source
from .security import RlsClient
from .settings import settings


async def retrieve(
    query: str,
    db: RlsClient,
) -> list[Source]:
    """
    Retrieve relevant plant-guide context using vector embeddings.

    If embeddings are not configured or retrieval fails, return an
    empty list so the AI request can continue safely.
    """

    # Embeddings are not configured
    if not settings.openai_api_key:
        return []

    embedding_url = "https://api.openai.com/v1/embeddings"

    embedding_headers = {
        "Authorization": f"Bearer {settings.openai_api_key}",
    }

    embedding_payload = {
        "model": settings.openai_embedding_model,
        "input": query,
    }

    # Generate an embedding for the user's query
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            embedding_url,
            headers=embedding_headers,
            json=embedding_payload,
        )

    # Fail safely if the embedding request fails
    if response.status_code >= 400:
        return []

    try:
        embedding = response.json()["data"][0]["embedding"]
    except (KeyError, IndexError, TypeError):
        return []

    # Search the guide chunks using the generated embedding
    matches = await db.request(
        "POST",
        "rpc/match_guide_chunks",
        json={
            "query_embedding": embedding,
            "match_count": 4,
        },
    )

    # Convert database rows into the application's Source schema
    return [
        Source(
            title=row["title"],
            slug=row["slug"],
            excerpt=row["content"][:500],
        )
        for row in matches
    ]