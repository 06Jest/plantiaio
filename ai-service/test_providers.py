import asyncio

from app.providers import gemini_answer, groq_answer


SYSTEM_PROMPT = "You are a helpful assistant. Follow the user's instructions exactly."


async def main() -> None:
    print("Testing Gemini...")
    gemini_result = await gemini_answer(
        SYSTEM_PROMPT,
        "Reply with exactly: Gemini works.",
    )
    print(gemini_result)

    print("\nTesting Groq...")
    groq_result = await groq_answer(
        SYSTEM_PROMPT,
        "Reply with exactly: Groq works.",
    )
    print(groq_result)


if __name__ == "__main__":
    asyncio.run(main())
