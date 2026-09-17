from .schemas import ToolInvocation, ToolResult
from .security import RlsClient


async def user_owns_plant(
    plant_id: str,
    db: RlsClient,
) -> bool:
    rows = await db.request(
        "GET",
        "plants",
        params={
            "select": "id",
            "id": f"eq.{plant_id}",
            "limit": "1",
        },
    )

    return bool(rows)


async def run_tool(
    invocation: ToolInvocation,
    db: RlsClient,
) -> ToolResult:
    args = invocation.arguments

    # ---------------------------------------------------------
    # Search saved notes
    # ---------------------------------------------------------
    if invocation.name == "search_notes":
        query = str(args.get("query", "")).strip()
        plant_id = str(args.get("plant_id", "")).strip()

        if len(query) > 200:
            return ToolResult(
                status="error",
                message="The note search query must be 200 characters or fewer.",
            )

        params = {
            "select": "id,plant_id,current_content,created_at",
            "limit": "20",
            "order": "created_at.desc",
        }

        if query:
            sanitized_query = (
                query
                .replace("%", "")
                .replace("*", "")
                .replace(",", "")
            )

            params["current_content"] = f"ilike.*{sanitized_query}*"

        if plant_id:
            plant_rows = await db.request(
                "GET",
                "plants",
                params={
                    "select": "id,name",
                    "id": f"eq.{plant_id}",
                    "limit": "1",
                },
            )

            if not plant_rows:
                return ToolResult(
                    status="error",
                    message="Plant not found or not owned by the current user.",
                )

            plant_name = plant_rows[0]["name"]

            params["plant_id"] = f"eq.{plant_id}"

        rows = await db.request(
            "GET",
            "notes",
            params=params,
        )

        return ToolResult(
            status="ok",
            data={
                "plant_name": plant_name,
                "note": result,
            },
        )

    # ---------------------------------------------------------
    # Get plant details
    # ---------------------------------------------------------
    if invocation.name == "get_plant_details":
        plant_id = str(args.get("plant_id", "")).strip()

        if not plant_id:
            return ToolResult(
                status="error",
                message="A plant ID is required.",
            )

        rows = await db.request(
            "GET",
            "plants",
            params={
                "select": "id,name,species,status,description,planted_on",
                "id": f"eq.{plant_id}",
                "limit": "1",
            },
        )

        if not rows:
            return ToolResult(
                status="error",
                message="Plant not found.",
            )

        return ToolResult(
            status="ok",
            data=rows[0],
        )

    # ---------------------------------------------------------
    # Summarize plant care history
    # ---------------------------------------------------------
    if invocation.name == "summarize_plant_history":
        plant_id = str(args.get("plant_id", "")).strip()

        if not plant_id:
            return ToolResult(
                status="error",
                message="A plant ID is required.",
            )

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

    # ---------------------------------------------------------
    # Create a note
    # ---------------------------------------------------------
    if invocation.name == "create_note":
        content = str(args.get("content", "")).strip()
        plant_id = str(args.get("plant_id", "")).strip()

        if not content:
            return ToolResult(
                status="error",
                message="Note content is required.",
            )

        if len(content) > 4000:
            return ToolResult(
                status="error",
                message="Note content must be 4000 characters or fewer.",
            )

        if not plant_id:
            return ToolResult(
                status="error",
                message="A plant ID is required.",
            )

        if not await user_owns_plant(plant_id, db):
            return ToolResult(
                status="error",
                message="Plant not found or not owned by the current user.",
            )

        if not invocation.confirmed:
            return ToolResult(
                status="confirmation_required",
                data={
                    "plant_id": plant_id,
                    "content": content,
                },
                message="Confirm before creating this note.",
            )

        payload = {
            "owner_id": db.user_id,
            "plant_id": plant_id,
            "original_content": content,
            "current_content": content,
        }

        result = await db.request(
            "POST",
            "notes",
            headers={
                "Prefer": "return=representation",
            },
            json=payload,
        )

        return ToolResult(
            status="ok",
            data=result,
        )

    return ToolResult(
        status="error",
        message=f"Unsupported tool: {invocation.name}",
    )