from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    plant_id: str | None = None
    confirmed: bool = False
    
class Source(BaseModel):
    title: str
    slug: str
    excerpt: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = Field(default_factory=list)
    provider: Literal["gemini", "groq", "none"] = "none"
    warning: str | None = None

    confirmation_required: bool = False
    tool_name: str | None = None
    tool_arguments: dict[str, Any] | None = None


class ToolInvocation(BaseModel):
    name: Literal[
        "search_notes",
        "summarize_plant_history",
        "create_note",
        "get_plant_details",
    ]
    arguments: dict[str, Any] = Field(default_factory=dict)
    confirmed: bool = False


class ToolResult(BaseModel):
    status: Literal["ok", "confirmation_required", "error"]
    data: dict | list | None = None
    message: str | None = None
