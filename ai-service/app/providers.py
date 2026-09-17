import httpx

from .settings import settings


class ProviderError(RuntimeError):
    """Raised when an AI provider fails or returns an invalid response."""


def valid_text(text: str) -> str:
    """
    Validate and clean text returned by an AI provider.
    """
    cleaned = text.strip()

    if not cleaned:
        raise ProviderError(
            "Provider returned an empty response."
        )

    if len(cleaned) > 12_000:
        raise ProviderError(
            "Provider returned an excessively long response."
        )

    return cleaned


async def gemini_answer(
    system: str,
    prompt: str,
) -> str:
    """
    Generate an answer using Google's Gemini GenerateContent API.
    """
    if not settings.gemini_api_key:
        raise ProviderError("Gemini is not configured.")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_chat_model}:generateContent"
    )

    headers = {
        "x-goog-api-key": settings.gemini_api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": system,
                }
            ]
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt,
                    }
                ],
            }
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload,
            )
    except httpx.HTTPError as cause:
        raise ProviderError(
            f"Gemini request failed: {cause}"
        ) from cause

    if response.status_code >= 400:
        detail = response.text[:500]

        raise ProviderError(
            f"Gemini request failed with HTTP "
            f"{response.status_code}: {detail}"
        )

    try:
        data = response.json()
        content = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError, ValueError) as cause:
        raise ProviderError(
            "Gemini returned malformed data."
        ) from cause

    return valid_text(content)


async def groq_answer(
    system: str,
    prompt: str,
) -> str:
    """
    Generate an answer using Groq's OpenAI-compatible Chat Completions API.
    """
    if not settings.groq_api_key:
        raise ProviderError("Groq is not configured.")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.groq_chat_model,
        "messages": [
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload,
            )
    except httpx.HTTPError as cause:
        raise ProviderError(
            f"Groq request failed: {cause}"
        ) from cause

    if response.status_code >= 400:
        detail = response.text[:500]

        raise ProviderError(
            f"Groq request failed with HTTP "
            f"{response.status_code}: {detail}"
        )

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError, ValueError) as cause:
        raise ProviderError(
            "Groq returned malformed data."
        ) from cause

    return valid_text(content)