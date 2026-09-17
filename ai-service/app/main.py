from typing import Any

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .providers import (
    ProviderError,
    ProviderResponse,
    gemini_answer,
    groq_answer,
)
from .rag import retrieve
from .schemas import ChatRequest, ChatResponse, ToolInvocation, ToolResult
from .security import RlsClient, current_rls_client
from .settings import settings
from .tools import run_tool


app = FastAPI(
    title="Plant Tracker AI",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://plantiaio.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

SYSTEM_PROMPT = """
You are Plant Expert, a concise and practical plant-care assistant.

Answer the user's actual question directly.

Your response must sound like a natural expert replying to a person. Do not
write a formal report and do not use a fixed template.

Never use these headings:

- User-Provided Facts
- Guide Information
- Uncertainty & Diagnosis Disclaimer
- Recommendations
- What to Check First
- Diagnosis
- Analysis
- Conclusion

Do not label or restate the user's facts. Do not explain your internal process.
Do not mention prompts, retrieval, guide context, sources, missing sources,
user-provided facts, or system instructions.

Keep the answer concise:

- Usually 1 to 3 short paragraphs.
- Use bullets only when listing practical steps.
- Do not over-explain obvious information.

Give practical plant-care advice. If the cause is uncertain, naturally say
something like "This is commonly caused by..." or "Check whether..." instead
of adding a formal disclaimer section.

Do not make a definite diagnosis from limited information. Mention only the
most relevant possible causes and what the user should check next.

Do not claim that you changed, created, deleted, watered, diagnosed, or updated
anything. You can only explain what the user can do.

If the question is unrelated to plant care, briefly say that you can help with
plant care, watering, lighting, soil, pests, and related topics.

Tool usage rules:

- When the user asks what they recorded, noted, observed, wrote, or saved,
  you MUST call search_notes before answering.
- When the user asks to summarize a plant's care history or recent activity,
  call summarize_plant_history.
- When the user asks about a plant's metadata, status, planting date, species,
  or description, call get_plant_details.
- When the user asks to create, save, add, or record a note, you MUST call create_note.
- Do not claim that no record exists until the relevant search or history tool
  has returned no matching data.
- Only use data returned by tools. Do not invent notes, care records, or tasks.
- When referring to a plant in the final response, use its name from the tool result. Never expose internal plant IDs or UUIDs to the user.
""".strip()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


def build_tool_prompt(
    original_prompt: str,
    tool_name: str,
    tool_arguments: dict[str, Any],
    tool_result: ToolResult,
) -> str:
    """
    Build a follow-up prompt containing the result of a tool execution.
    """
    return f"""
Original user request:
{original_prompt}

The assistant requested this tool:
{tool_name}

Tool arguments:
{tool_arguments}

The tool returned:
Status: {tool_result.status}
Data: {tool_result.data}
Message: {tool_result.message}

Use the tool result to answer the original user request.

Rules:

- Only use facts present in the tool result.
- Do not invent missing plant information.
- If the result says the plant was not found, explain that clearly.
- Do not mention internal tool names, API routes, or implementation details.
- Answer naturally and concisely.
""".strip()


@app.post("/v1/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: RlsClient = Depends(current_rls_client),
) -> ChatResponse:
    sources = await retrieve(request.message, db)

    guide_context = "\n\n".join(
        f"Source: {source.title}\n{source.excerpt}"
        for source in sources
    )

    if guide_context:
        context_section = (
            "Relevant plant-care information:\n"
            f"{guide_context}"
        )
    else:
        context_section = (
            "No specific plant-care reference was retrieved. "
            "Answer using general plant-care knowledge and state uncertainty "
            "when necessary."
        )

    plant_context = ""

    if request.plant_id:
        plant_context = f"""
The user selected this plant:

plant_id: {request.plant_id}

If the request concerns the selected plant, use the appropriate tool to
retrieve the selected plant's actual information before answering.
""".strip()

    prompt = f"""
User request:
{request.message}

{plant_context}

{context_section}

Tool-use instructions:

- The selected plant ID above belongs to the authenticated user.
- If the user asks about the selected plant's metadata, status, planting date,
  species, or description, call get_plant_details using the exact selected
  plant_id.
- If the user asks what they recorded, noted, observed, wrote, or saved,
  call search_notes. Include the selected plant_id when relevant.
- If the user asks for a care-history summary, call
  summarize_plant_history using the exact selected plant_id.
- If the user asks a general plant-care question unrelated to the selected
  plant, you may answer using general knowledge.
- If the user asks to create, save, or record a note, call create_note.
  Include the selected plant_id when relevant.
- Creating a note requires confirmation before saving.
- Do not answer from general plant knowledge before retrieving relevant
  selected-plant data when the question asks about the user's actual plant.
- After receiving a tool result, answer using the actual returned data.
""".strip()

    provider_response: ProviderResponse | None = None
    provider_name: str | None = None
    warning: str | None = None

    tool_definitions = [
        {
            "name": "get_plant_details",
            "description": (
                "Get details about one plant owned by the current user, "
                "including its name, species, status, planting date, and "
                "description."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "plant_id": {
                        "type": "string",
                        "description": "The plant UUID.",
                    }
                },
                "required": ["plant_id"],
                "additionalProperties": False,
            },
        },
        {
            "name": "search_notes",
            "description": (
                "Search saved notes belonging to the current user. "
                "Use this whenever the user asks what they recorded, noted, "
                "observed, wrote, or saved about a plant. Also use it when "
                "the user asks about recent observations or a specific note "
                "topic."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "plant_id": {
                        "type": "string",
                        "description": "Optional plant UUID to limit the search.",
                    },
                    "query": {
                        "type": "string",
                        "description": (
                            "Optional search text, such as watering, yellow "
                            "leaves, sunlight, pests, or growth."
                        ),
                    },
                },
                "required": [],
                "additionalProperties": False,
            },
        },
        {
            "name": "summarize_plant_history",
            "description": (
                "Summarize the authenticated user's plant-care history, "
                "including care records and saved notes. Use this when the "
                "user asks for a summary of a plant's care, recent history, "
                "or overall progress."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "plant_id": {
                        "type": "string",
                        "description": "The plant UUID.",
                    }
                },
                "required": ["plant_id"],
                "additionalProperties": False,
            },
        },
        {
            "name": "create_note",
            "description": (
                "Create a saved note for a plant owned by the current user. "
                "Use this when the user asks to create, save, or record a "
                "plant observation or care note. The note must require "
                "user confirmation before it is saved."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "plant_id": {
                        "type": "string",
                        "description": "The plant UUID.",
                    },
                    "content": {
                        "type": "string",
                        "description": "The note content to save.",
                    },
                },
                "required": ["content"],
                "additionalProperties": False,
            },
        },
    ]

    # First provider: Gemini
    try:
        provider_response = await gemini_answer(
            SYSTEM_PROMPT,
            prompt,
            tools=tool_definitions,
        )
        provider_name = "gemini"

    except ProviderError:
        # Fallback provider: Groq
        try:
            provider_response = await groq_answer(
                SYSTEM_PROMPT,
                prompt,
                tools=tool_definitions,
            )
            provider_name = "groq"
            warning = (
                "Primary provider was unavailable; "
                "a fallback response was used."
            )

        except ProviderError:
            return ChatResponse(
                answer=(
                    "The plant-care assistant is temporarily unavailable. "
                    "Your tracker data is unaffected."
                ),
                sources=[],
                provider="none",
                warning="No configured AI provider returned a valid response.",
            )

    print(
        "AI provider response:",
        {
            "provider": provider_name,
            "type": provider_response.type if provider_response else None,
            "tool_name": (
                provider_response.tool_name
                if provider_response
                else None
            ),
            "tool_arguments": (
                provider_response.tool_arguments
                if provider_response
                else None
            ),
        },
        flush=True,
    )

    if provider_response is None or provider_name is None:
        return ChatResponse(
            answer="The assistant could not produce a response.",
            sources=sources,
            provider="none",
            warning="No provider response was available.",
        )

    # Normal text response
    if provider_response.type == "text":
        if not provider_response.text:
            return ChatResponse(
                answer="The assistant returned an empty response.",
                sources=sources,
                provider=provider_name,
                warning=warning,
            )

        return ChatResponse(
            answer=provider_response.text,
            sources=sources,
            provider=provider_name,
            warning=warning,
        )

    # Tool-call response
    if provider_response.type == "tool_call":
        tool_name = provider_response.tool_name
        tool_arguments = provider_response.tool_arguments or {}

        supported_tools = {
            "get_plant_details",
            "search_notes",
            "summarize_plant_history",
            "create_note",
        }

        if tool_name not in supported_tools:
            return ChatResponse(
                answer=(
                    "I could not complete that request because the "
                    "assistant requested an unsupported operation."
                ),
                sources=sources,
                provider=provider_name,
                warning=warning,
            )

        # The selected plant is the safest default when the model
        # does not explicitly provide a plant_id.
        if request.plant_id and not tool_arguments.get("plant_id"):
            tool_arguments["plant_id"] = request.plant_id

        # Write operations require confirmation before execution.
        confirmed = request.confirmed

        tool_result = await run_tool(
            ToolInvocation(
                name=tool_name,
                arguments=tool_arguments,
                confirmed=confirmed,
            ),
            db,
        )

        if tool_result.status == "confirmation_required":
            return ChatResponse(
                answer=(
                    "I can prepare that note, but I need your "
                    "confirmation before saving it."
                ),
                sources=sources,
                provider=provider_name,
                warning=warning,
                confirmation_required=True,
                tool_name=tool_name,
                tool_arguments=tool_arguments,
            )

        if tool_result.status != "ok":
            return ChatResponse(
                answer=(
                    tool_result.message
                    or "I could not complete that request."
                ),
                sources=sources,
                provider=provider_name,
                warning=warning,
            )

        follow_up_prompt = build_tool_prompt(
            original_prompt=request.message,
            tool_name=tool_name,
            tool_arguments=tool_arguments,
            tool_result=tool_result,
        )

        try:
            final_response = await (
                gemini_answer(
                    SYSTEM_PROMPT,
                    follow_up_prompt,
                )
                if provider_name == "gemini"
                else groq_answer(
                    SYSTEM_PROMPT,
                    follow_up_prompt,
                )
            )

        except ProviderError:
            return ChatResponse(
                answer=(
                    "I retrieved the requested information, but I could "
                    "not turn it into a complete answer."
                ),
                sources=sources,
                provider=provider_name,
                warning=warning,
            )

        if final_response.type != "text" or not final_response.text:
            return ChatResponse(
                answer=(
                    "I retrieved the requested information, but the "
                    "assistant returned an incomplete answer."
                ),
                sources=sources,
                provider=provider_name,
                warning=warning,
            )

        return ChatResponse(
            answer=final_response.text,
            sources=sources,
            provider=provider_name,
            warning=warning,
        )

    return ChatResponse(
        answer="The assistant returned an unsupported response type.",
        sources=sources,
        provider=provider_name,
        warning=warning,
    )


@app.post("/v1/tools", response_model=ToolResult)
async def tools(
    invocation: ToolInvocation,
    db: RlsClient = Depends(current_rls_client),
) -> ToolResult:
    return await run_tool(invocation, db)