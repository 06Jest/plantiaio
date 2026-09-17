from fastapi import HTTPException

from .schemas import ToolInvocation, ToolResult
from .security import RlsClient


async def run_tool(
    invocation: ToolInvocation,
    db: RlsClient,
) -> ToolResult:
    args = invocation.arguments

    # --------------------------------------------------
    # Search notes
    # --------------------------------------------------
    if invocation.name == "search_notes":
        query = str(args.get("query", "")).strip()

        if not query or len(query) > 200:
            return ToolResult(
                status="error",
                message="A short note search query is required.",
            )

        sanitized_query = query.replace("%", "").replace("*", "")

        rows = await db.request(
            "GET",
            "notes",
            params={
                "select": "id,plant_id,current_content,created_at",
                "current_content": f"ilike.*{sanitized_query}*",
                "limit": "20",
            },
        )

        return ToolResult(
            status="ok",
            data=rows,
        )

    # --------------------------------------------------
    # Get plant details
    # --------------------------------------------------
    if invocation.name == "get_plant_details":
        plant_id = str(args.get("plant_id", ""))

        rows = await db.request(
            "GET",
            "plants",
            params={
                "select": "id,name,species,status,description,planted_on",
                "id": f"eq.{plant_id}",
                "limit": "1",
            },
        )

        return ToolResult(
            status="ok",
            data=rows,
        )

    # --------------------------------------------------
    # Summarize plant history
    # --------------------------------------------------
    if invocation.name == "summarize_plant_history":
        plant_id = str(args.get("plant_id", ""))

        plant = await db.request(
            "GET",
            "plants",
            params={
                "select": "id,name,status",
                "id": f"eq.{plant_id}",
                "limit": "1",
            },
        )

        if not plant:
            return ToolResult(
                status="error",
                message="Plant not found.",
            )

        care_records = await db.request(
            "GET",
            "care_records",
            params={
                "select": "activity_type,details,occurred_at",
                "plant_id": f"eq.{plant_id}",
                "order": "occurred_at.desc",
                "limit": "100",
            },
        )

        notes = await db.request(
            "GET",
            "notes",
            params={
                "select": "current_content,created_at",
                "plant_id": f"eq.{plant_id}",
                "order": "created_at.desc",
                "limit": "20",
            },
        )

        return ToolResult(
            status="ok",
            data={
                "plant": plant[0],
                "care_records": care_records,
                "notes": notes,
            },
        )

    # --------------------------------------------------
    # Create task
    # --------------------------------------------------
    if invocation.name == "create_task":
        title = str(args.get("title", "")).strip()
        plant_id = args.get("plant_id")

        if not title or len(title) > 200:
            return ToolResult(
                status="error",
                message="A task title of 1–200 characters is required.",
            )

        if not invocation.confirmed:
            return ToolResult(
                status="confirmation_required",
                data={
                    "title": title,
                    "plant_id": plant_id,
                },
                message="Confirm before creating this task.",
            )

        payload = {
            "owner_id": db.user_id,
            "title": title,
        }

        if plant_id:
            payload["plant_id"] = str(plant_id)

        if args.get("due_at"):
            payload["due_at"] = str(args["due_at"])

        result = await db.request(
            "POST",
            "plant_tasks",
            headers={
                **db.headers,
                "Prefer": "return=representation",
            },
            json=payload,
        )

        return ToolResult(
            status="ok",
            data=result,
        )

    # --------------------------------------------------
    # Unsupported tool
    # --------------------------------------------------
    raise HTTPException(
        status_code=400,
        detail="Unsupported tool.",
    )