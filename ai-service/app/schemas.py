from typing import Literal
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    plant_id: str | None = None


class Source(BaseModel):
    title: str
    slug: str
    excerpt: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = []
    provider: Literal["gemini", "groq", "none"]
    warning: str | None = None


class ToolInvocation(BaseModel):
    name: Literal["search_notes", "summarize_plant_history", "create_task", "get_plant_details"]
    arguments: dict = {}
    confirmed: bool = False


class ToolResult(BaseModel):
    status: Literal["ok", "confirmation_required", "error"]
    data: dict | list | None = None
    message: str | None = None
