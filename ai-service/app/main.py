
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .providers import ProviderError, gemini_answer, groq_answer
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
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
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
""".strip()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


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

    prompt = f"""
User question:
{request.message}

{context_section}

Respond naturally and directly to the user.

Do not use a report structure.
Do not create headings.
Do not mention the background information, retrieval, sources, or whether
sources were found.
Do not repeat the user's plant, symptom, or soil condition as a labeled list.
Keep the answer concise and practical.
""".strip()

    try:
        answer = await gemini_answer(SYSTEM_PROMPT, prompt)

        return ChatResponse(
            answer=answer,
            sources=sources,
            provider="gemini",
        )

    except ProviderError:
        try:
            answer = await groq_answer(SYSTEM_PROMPT, prompt)

            return ChatResponse(
                answer=answer,
                sources=sources,
                provider="groq",
                warning=(
                    "Primary provider was unavailable; "
                    "a fallback response was used."
                ),
            )

        except ProviderError:
            return ChatResponse(
                answer=(
                    "The plant-care assistant is temporarily unavailable. "
                    "Your tracker data is unaffected."
                ),
                sources=[],
                provider="none",
                warning=(
                    "No configured AI provider returned a valid response."
                ),
            )


@app.post("/v1/tools", response_model=ToolResult)
async def tools(
    invocation: ToolInvocation,
    db: RlsClient = Depends(current_rls_client),
) -> ToolResult:
    return await run_tool(invocation, db)