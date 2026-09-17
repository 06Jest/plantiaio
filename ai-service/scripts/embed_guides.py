"""
Chunk curated guides and store OpenAI embeddings.

Run only as a controlled admin ingestion job.
"""

import os

import httpx


SUPABASE_URL = os.environ["SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
OPENAI_KEY = os.environ["OPENAI_API_KEY"]


SUPABASE_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}


def chunks(
    text: str,
    size: int = 800,
    overlap: int = 120,
):
    """
    Split text into overlapping chunks.

    Example:
    - Chunk size: 800 characters
    - Overlap: 120 characters
    """
    start = 0

    while start < len(text):
        yield text[start : start + size]
        start += size - overlap


def main():
    with httpx.Client(timeout=30) as client:
        guides_response = client.get(
            f"{SUPABASE_URL}/rest/v1/plant_guides?select=id,content",
            headers=SUPABASE_HEADERS,
        )

        guides_response.raise_for_status()
        guides = guides_response.json()

        for guide in guides:
            guide_id = guide["id"]
            guide_content = guide["content"]

            for index, content in enumerate(chunks(guide_content)):
                embedding_response = client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers={
                        "Authorization": f"Bearer {OPENAI_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "text-embedding-3-small",
                        "input": content,
                    },
                )

                embedding_response.raise_for_status()
                embedding = embedding_response.json()["data"][0]["embedding"]

                client.post(
                    f"{SUPABASE_URL}/rest/v1/guide_chunks",
                    headers={
                        **SUPABASE_HEADERS,
                        "Prefer": "resolution=merge-duplicates",
                    },
                    json={
                        "guide_id": guide_id,
                        "chunk_index": index,
                        "content": content,
                        "embedding": embedding,
                    },
                ).raise_for_status()


if __name__ == "__main__":
    main()