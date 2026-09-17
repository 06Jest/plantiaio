# Plant Tracker

Private-by-default plant care tracking with public updates, status-driven 3D visuals, and an optional Python AI assistant.

## Included now

- Email/password sign-up, email confirmation, login, logout, and session refresh middleware.
- A protected dashboard that uses Supabase's verified server-side user identity.
- Plant creation, editing, deletion, manual status changes, care logging, and care-history views.
- Lightweight React Three Fiber status visualizations on the dashboard, plant details, feed, and public profiles.
- Private notes with immutable originals, editable current text, and an explicit action that creates a separate public post.
- Public profiles, public feed posts, reactions, and comments. Public posts contain a deliberate snapshot; they never grant access to private plant, care, or note rows.
- FastAPI AI-service skeleton with secure RLS-context tools, two-provider fallback, validation, curated guide retrieval, and source citations.
- `profiles`, `plants`, `care_records`, and `notes` tables.
- RLS policies for every Phase 1 table. Private data is never exposed through client-side filtering.
- A cross-table database authorization check: care records and notes can only reference a plant owned by the authenticated caller.
- Original note content is database-immutable; later edits use `current_content`.

## Local setup

1. Create a Supabase project in the Supabase dashboard.
2. In Authentication → URL Configuration, add `http://localhost:3000/auth/confirm` as a redirect URL.
3. Copy `.env.example` to `.env.local` and set the project URL and **anon/publishable** key. Never put a service-role key in this app.
4. Install dependencies with `npm install`.
5. Link the project with the Supabase CLI and apply the schema:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   Alternatively, run every migration in `supabase/migrations` in timestamp order in the Supabase SQL Editor.

6. Start the app with `npm run dev` and open `http://localhost:3000`.

## Security model

The browser receives only the Supabase anon key. Supabase Auth issues the session; Next.js refreshes it through middleware and server components/actions call `auth.getUser()` to use a verified identity. RLS is enabled on all application tables.

Each row has an `owner_id` tied to `auth.uid()`. All policies restrict reads, writes, updates, and deletes to that identity. For `care_records` and `notes`, the `owns_plant()` security-definer function additionally ensures that the supplied `plant_id` belongs to the caller. This prevents cross-owner attachment even if a user submits a guessed UUID directly to the data API.

`profiles` are created automatically when an Auth user is created. A public profile is available only after its owner selects a username. Posts are intentional public snapshots; private plants, care history, and note rows retain owner-only policies.

## Data model

| Table | Purpose | Privacy |
| --- | --- | --- |
| `profiles` | Account profile metadata | Public only after username selection |
| `plants` | Owner-controlled plant details and manual status | Owner only |
| `care_records` | Timestamped care activities | Owner only |
| `notes` | Immutable original + editable current text | Owner only |
| `posts`, `post_reactions`, `comments` | Explicit public community updates | Public |
| `plant_tasks` | Confirmed user tasks | Owner only |
| `plant_guides`, `guide_chunks` | Curated RAG knowledge base | Read-only public |

`plants.status` is an enum of the approved manual statuses. Future AI functionality may recommend a status but must not silently update it.

## Reduced delivery roadmap

The original nine phases are consolidated into three implementation tracks. This reduces handoff overhead; it does not weaken the explicit user-control and database-security requirements.

1. **Foundation and private tracker** - authentication, the owner-scoped schema/RLS, plant CRUD, manual status, care history, and private notes. ✓
2. **Presentation and community** - 3D status visualization, polished states, explicit publishing of notes/plant updates, public profiles, feed, reactions, and comments. ✓
3. **Plant intelligence and release polish** - Python AI service with provider fallback, guide/RAG retrieval, confirmed AI tools, audits/logs, and release documentation. ✓

## AI architecture and limitations

The FastAPI service tries OpenAI first and Anthropic second. Empty, malformed, timed-out, or failed responses are rejected; if neither provider returns valid text, the tracker remains usable and the assistant shows an unavailable response. Guide retrieval uses pgvector and returns guide titles/excerpts alongside answers.

AI tools use the caller's Supabase access token and never a service role for user data. `create_task` requires a second, confirmed request before writing. Application code validates identities, arguments, ownership, RLS policies, publishing, and mutations; the model only produces informational language and recommendations.

One correction captured during development: a model-like suggestion to silently mark yellow leaves as `sick` was rejected because the evidence was insufficient and only the owner controls status. See `ai-logs/` for the development transcripts.

For production, add provider observability, rate limiting, a background embedding queue, database backups, E2E tests against a real Supabase project, moderation/reporting for public content, and a durable confirmation UI for AI tool calls. Python is not installed in this workspace, so the FastAPI code has not been runtime-tested here; the Next.js production build passes.

## AI coding tools used

This implementation was created with Codex. No secrets or private user data are included in `ai-logs/`.
