import httpx
from fastapi import Header, HTTPException

from .settings import settings


class RlsClient:
    """
    Supabase REST client that always uses the caller's access token.

    This client never uses the Supabase service-role key, allowing
    Supabase Row Level Security policies to apply to each request.
    """

    def __init__(self, token: str, user_id: str):
        self.token = token
        self.user_id = user_id

        self.headers = {
            "apikey": settings.supabase_anon_key,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    async def request(
        self,
        method: str,
        path: str,
        **kwargs,
    ):
        """
        Send a request to the Supabase REST API using the user's token.
        """

        custom_headers = kwargs.pop("headers", {})

        headers = {
            **self.headers,
            **custom_headers,
        }

        url = f"{settings.supabase_url}/rest/v1/{path}"

        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                **kwargs,
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=502,
                detail="Database request failed.",
            )

        if not response.content:
            return None

        return response.json()


async def current_rls_client(
    authorization: str | None = Header(default=None),
) -> RlsClient:
    """
    Validate the incoming Supabase access token and return
    an RlsClient authenticated as the current user.
    """

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="A Supabase access token is required.",
        )

    token = authorization.removeprefix("Bearer ")

    auth_url = f"{settings.supabase_url}/auth/v1/user"

    auth_headers = {
        "apikey": settings.supabase_anon_key,
        "Authorization": f"Bearer {token}",
    }

    async with httpx.AsyncClient(timeout=8) as client:
        response = await client.get(
            auth_url,
            headers=auth_headers,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
        )

    user = response.json()
    user_id = user.get("id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
        )

    return RlsClient(
        token=token,
        user_id=user_id,
    )