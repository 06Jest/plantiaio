from typing import Any, Literal

import json

import httpx

from .settings import settings

TOOL_DEFINITIONS = [
    {
        "name": "get_plant_details",
        "description": (
            "Get details about one plant owned by the authenticated user. "
            "Use this when the user asks about a specific plant's status, "
            "species, description, or planting date."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "plant_id": {
                    "type": "string",
                    "description": "The UUID of the plant.",
                }
            },
            "required": ["plant_id"],
            "additionalProperties": False,
        },
    }
]


class ProviderError(RuntimeError):
    """Raised when an AI provider fails or returns an invalid response."""


class ProviderResponse:
    """
    Normalized response returned by an AI provider.

    A provider response contains either:
    - text
    - a tool call
    """

    def __init__(
        self,
        response_type: Literal["text", "tool_call"],
        text: str | None = None,
        tool_name: str | None = None,
        tool_arguments: dict[str, Any] | None = None,
    ):
        self.type = response_type
        self.text = text
        self.tool_name = tool_name
        self.tool_arguments = tool_arguments or {}


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


def valid_tool_call(
    name: str,
    arguments: Any,
) -> tuple[str, dict[str, Any]]:
    """
    Validate a normalized tool call returned by a provider.
    """
    if not isinstance(name, str) or not name.strip():
        raise ProviderError(
            "Provider returned a tool call without a valid name."
        )

    if not isinstance(arguments, dict):
        raise ProviderError(
            "Provider returned invalid tool arguments."
        )

    return name.strip(), arguments


async def gemini_answer(
    system: str,
    prompt: str,
    tools: list[dict[str, Any]] | None = None,
) -> ProviderResponse:
    """
    Generate an answer using Google's Gemini GenerateContent API.

    The response may contain either normal text or a normalized tool call.
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

    payload: dict[str, Any] = {
        "system_instruction": {
            "parts": [{"text": system}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
    }

    if tools:
        payload["tools"] = [
            {
                "function_declarations": [
                    {
                        "name": tool["name"],
                        "description": tool["description"],
                        "parameters": tool["parameters"],
                    }
                    for tool in tools
                ]
            }
        ]

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
        parts = data["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError, TypeError, ValueError) as cause:
        raise ProviderError("Gemini returned malformed data.") from cause

    for part in parts:
        if not isinstance(part, dict):
            continue

        function_call = part.get("functionCall")

        if isinstance(function_call, dict):
            name = function_call.get("name")
            arguments = function_call.get("args", {})

            tool_name, tool_arguments = valid_tool_call(
                name,
                arguments,
            )

            return ProviderResponse(
                response_type="tool_call",
                tool_name=tool_name,
                tool_arguments=tool_arguments,
            )

        if "text" in part:
            content = part["text"]

            if not isinstance(content, str):
                raise ProviderError(
                    "Gemini returned invalid text content."
                )

            return ProviderResponse(
                response_type="text",
                text=valid_text(content),
            )

    raise ProviderError("Gemini returned no supported response content.")


async def groq_answer(
    system: str,
    prompt: str,
    tools: list[dict[str, Any]] | None = None,
) -> ProviderResponse:
    """
    Generate an answer using Groq's OpenAI-compatible Chat Completions API.

    The response may contain either normal text or a normalized tool call.
    """
    if not settings.groq_api_key:
        raise ProviderError("Groq is not configured.")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }

    payload: dict[str, Any] = {
        "model": settings.groq_chat_model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    }

    if tools:
        payload["tools"] = [
            {
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool["parameters"],
                },
            }
            for tool in tools
        ]
        payload["tool_choice"] = "auto"

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
        message = data["choices"][0]["message"]
    except (KeyError, IndexError, TypeError, ValueError) as cause:
        raise ProviderError("Groq returned malformed data.") from cause

    tool_calls = message.get("tool_calls")

    if isinstance(tool_calls, list) and tool_calls:
        first_call = tool_calls[0]

        try:
            function = first_call["function"]
            tool_name = function["name"]
            raw_arguments = function.get("arguments", "{}")
        except (KeyError, TypeError) as cause:
            raise ProviderError(
                "Groq returned malformed tool-call data."
            ) from cause

        if isinstance(raw_arguments, str):
            try:
                tool_arguments = __import__("json").loads(raw_arguments)
            except ValueError as cause:
                raise ProviderError(
                    "Groq returned invalid JSON tool arguments."
                ) from cause
        else:
            tool_arguments = raw_arguments

        normalized_name, normalized_arguments = valid_tool_call(
            tool_name,
            tool_arguments,
        )

        return ProviderResponse(
            response_type="tool_call",
            tool_name=normalized_name,
            tool_arguments=normalized_arguments,
        )

    content = message.get("content")

    if not isinstance(content, str):
        raise ProviderError("Groq returned no supported text content.")

    return ProviderResponse(
        response_type="text",
        text=valid_text(content),
    )
    """
    Generate an answer using Groq's OpenAI-compatible
    Chat Completions API.

    Tool definitions and tool execution will be added in a later step.
    For now, this normalizes Groq's response into ProviderResponse.
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
        message = data["choices"][0]["message"]
        content = message.get("content")
    except (KeyError, IndexError, TypeError, ValueError) as cause:
        raise ProviderError(
            "Groq returned malformed data."
        ) from cause

    if not isinstance(content, str):
        raise ProviderError(
            "Groq returned no supported text content."
        )

    return ProviderResponse(
        response_type="text",
        text=valid_text(content),
    )