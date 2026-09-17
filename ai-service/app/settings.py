from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    supabase_url: str
    supabase_anon_key: str

    # Chat providers
    gemini_api_key: str | None = None
    gemini_chat_model: str = "gemini-2.5-flash"

    groq_api_key: str | None = None
    groq_chat_model: str = "llama-3.3-70b-versatile"

    # Temporarily retained because RAG still uses OpenAI embeddings.
    openai_api_key: str | None = None
    openai_embedding_model: str = "text-embedding-3-small"

    frontend_origin: str = "http://localhost:3000"


settings = Settings()