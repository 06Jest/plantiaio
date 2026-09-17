# Plant Care Tracker

A small plant-care application where users can manage their own plants, record care activities, write free-form care notes, and ask an AI-powered Plant Expert questions about their plants.

The project focuses on **clear ownership boundaries**, **server-side validation**, and a deliberately limited AI workflow rather than a large number of features.

---

## Features

- Email/password authentication through Supabase Auth
- Create and view personal plants
- Record plant-care activities
- View care history
- View plant attention status
- View an overall plant summary
- Create free-form notes through the Plant Expert
- Search existing notes through natural-language questions
- Ask questions about plant details and care history
- Confirmation required before an AI-generated note is saved
- User-level data isolation through Supabase Row Level Security
- Server-side validation and ownership checks
- AI provider fallback when the primary provider is unavailable

---

## Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **React Markdown**
- **remark-gfm**
- **Supabase JavaScript client**

### Backend and Database

- **Supabase Auth**
- **Supabase PostgreSQL**
- **Supabase Row Level Security**
- **Supabase REST API**

### AI Service

- **Python**
- **FastAPI**
- **Pydantic**
- **Gemini**
- **Groq**

The AI service is separated from the frontend application so that model-provider logic, tool execution, validation, and authorization are not implemented directly in the browser.

---

## Running Locally

### Prerequisites

Install or prepare the following:

- **Node.js 20 or newer**
- **npm**
- **Python 3.12**
- A **Supabase project**
- A **Gemini API key**
- A **Groq API key**
- The **Supabase CLI**

Python 3.12 is recommended for the AI service because the project dependencies were tested against it.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd plant-tracker
```

### 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

The Supabase URL and anon key can be found in the Supabase project settings.

> **Important:** Never commit real API keys or secret environment files to the repository.

### 4. Apply Database Migrations

Make sure the Supabase CLI is installed and the project is linked to the correct Supabase project.

Run:

```bash
supabase db push
```

The migrations create the application tables, enums, helper functions, indexes, and Row Level Security policies.

### 5. Start the Frontend

From the project root:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:3000
```

### 6. Configure the AI Service

Open a second terminal and move into the AI service directory:

```bash
cd ai-service
```

Create a Python 3.12 virtual environment:

```powershell
py -3.12 -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create `ai-service/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

Start the FastAPI service:

```bash
uvicorn app.main:app --reload
```

The AI service should be available at:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

The frontend and AI service must both be running for the Plant Expert feature to work.

---

## Data Model

The application uses **PostgreSQL through Supabase**.

### Entity Relationship Overview

```text
User
 └── Plants
      ├── Care Records
      └── Notes

User
 └── Plant Tasks
```

### `plants`

Stores the plants owned by users.

| Field | Purpose |
|---|---|
| `id` | Unique plant identifier |
| `owner_id` | User who owns the plant |
| `name` | Display name of the plant |
| `species` | Optional species information |
| `category` | Plant category |
| `planted_on` | Optional planting date |
| `description` | Optional plant description |
| `status` | Current attention status |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

Each plant belongs to one user through `owner_id`.

### `care_records`

Stores structured care activity history.

| Field | Purpose |
|---|---|
| `id` | Unique care-record identifier |
| `plant_id` | Plant associated with the activity |
| `owner_id` | User who owns the record |
| `activity_type` | Type of care activity |
| `details` | Optional activity details |
| `occurred_at` | When the activity occurred |
| `created_at` | When the record was created |

The `plant_id` connects the activity to a plant, while `owner_id` supports ownership checks and RLS policies.

Examples of care activities include:

- Watering
- Fertilizing
- Pruning
- Repotting
- Other supported care actions

### `notes`

Stores free-form user notes and their original content.

| Field | Purpose |
|---|---|
| `id` | Unique note identifier |
| `plant_id` | Plant associated with the note |
| `owner_id` | User who owns the note |
| `original_content` | Original submitted note |
| `current_content` | Current note content |
| `ai_analysis` | Optional AI-generated analysis |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

`original_content` preserves what the user submitted. `current_content` represents the current note content and leaves room for future editing or AI-assisted transformations without losing the original input.

`ai_analysis` is nullable because a note should not become unusable merely because an AI provider is unavailable.

### `plant_tasks`

The schema includes a task table for possible future reminders and scheduled care actions.

Task functionality was not prioritized for this assignment because the required workflow focused on:

- Plants
- Care records
- Notes
- Summaries
- User-data separation

---

## Why This Data Model?

I separated plants, structured care records, and free-form notes because they represent different kinds of information:

- A **plant** is the main entity.
- A **care record** is a timestamped event that can be queried and summarized consistently.
- A **note** is less structured and may contain observations, context, or multiple actions in one piece of text.

Keeping care records separate from notes avoids forcing every free-form sentence into a rigid activity schema. At the same time, structured care records remain useful for reliable history views and future reporting.

I included `owner_id` on user-owned tables rather than relying only on a relationship to `plants`. This makes ownership explicit at the row level and allows policies to check the current user directly.

---

## User Data Separation

User data separation is enforced at multiple layers.

### Authentication

Supabase Auth manages user authentication.

The authenticated user's ID is available as:

```sql
auth.uid()
```

inside Supabase policies.

### Row Level Security

Row Level Security is enabled on the user-owned tables.

The general rule is:

> A user can only read or modify rows whose `owner_id` matches the authenticated user's ID.

For records connected to a plant, the policies also verify that the user owns the referenced plant.

For example, creating a care record requires:

1. The submitted `owner_id` must match the authenticated user.
2. The referenced plant must belong to that same user.

The same principle is applied to notes.

### Backend Authorization

The AI service does not use a service-role key for user data operations.

Instead, it receives the user's Supabase access token and uses that token when making requests to Supabase.

This means database requests are made in the context of the authenticated user, allowing Supabase RLS to remain part of the authorization boundary.

The AI service also performs explicit ownership checks before operating on a plant. For example, before creating a note, it verifies that the requested plant exists and belongs to the current user.

### Why Use Both?

**RLS** protects the database even if a client or API caller attempts to bypass the frontend.

**Backend ownership checks** provide an additional application-level boundary and allow the AI service to reject invalid requests before attempting a write.

The frontend is therefore treated as an **untrusted client**. Hiding a plant ID in the UI is not considered a security mechanism. Authorization is enforced using the authenticated user's identity and database policies.

---

## Plant Attention Status

Each plant has a status representing whether it may need attention.

The status is intended to communicate a simple care state, such as whether a plant may need watering or another action.

This is intentionally a limited interpretation for the assignment. A production version would likely use more detailed plant-specific information, including:

- Species requirements
- Watering frequency
- Recent care history
- Environmental conditions
- Configurable user thresholds
- Seasonal changes

A more advanced implementation would also explain exactly which data caused a plant to be marked as needing attention.

---

## Free-Text Notes and AI Approach

The free-text note feature was designed so that the AI assists with interpretation and interaction, but does not have unrestricted authority over the database.

### What the Model Does

The model can:

- Understand a user's request to create a note
- Extract the intended note content
- Identify the relevant plant when context is available
- Search existing notes
- Retrieve plant details
- Summarize care history
- Produce a natural-language response based on tool results

The model uses tool calls when it needs saved application data.

### What Application Code Does

The backend is responsible for:

- Validating note content
- Enforcing the maximum note length
- Requiring a plant ID
- Checking plant ownership
- Requiring confirmation before a write
- Inserting the note into Supabase
- Returning structured tool results to the model

The model does not directly execute SQL or receive unrestricted database access.

### Confirmation Before Saving

Creating a note is treated as a **write operation**.

The first request prepares the note and returns structured confirmation information:

```json
{
  "confirmation_required": true,
  "tool_name": "create_note",
  "tool_arguments": {
    "plant_id": "...",
    "content": "I watered the plant today."
  }
}
```

The frontend displays the proposed note and asks the user to confirm.

Only after confirmation does the backend allow the `create_note` tool to insert the row.

This separation was intentional. A natural-language request such as:

> I watered my plant today.

should not automatically become a permanent database write without a clear confirmation step.

### Why Not Let the AI Write Directly?

AI output can be incomplete, ambiguous, malformed, or incorrect.

The model is useful for understanding language, but it should not be trusted with authorization or data-integrity decisions.

The application therefore treats the model as a **planner and interpreter**. The backend remains responsible for:

- Validation
- Ownership
- Confirmation
- Database execution

### Graceful Failure

The AI service supports a fallback provider if the primary provider is unavailable.

The API also returns a warning when a fallback provider is used, allowing the frontend to communicate that the response was generated through an alternate provider.

If a model response is malformed or does not contain the expected tool call, the backend does not blindly execute a write. It returns a normal response or an error instead.

---

## AI Service Structure

The AI service follows a small tool-execution flow:

```text
Authenticated request
        ↓
FastAPI route
        ↓
Model provider
        ↓
Tool call, if needed
        ↓
Tool validation and ownership check
        ↓
Supabase request under the user's token
        ↓
Tool result
        ↓
Final model response
```

### Main Files

| File | Responsibility |
|---|---|
| `main.py` | FastAPI routes, model orchestration, prompts, and provider fallback |
| `schemas.py` | Pydantic request, response, and tool schemas |
| `providers.py` | Provider-specific model integrations |
| `tools.py` | Application data operations, validation, and ownership checks |
| `security.py` | Authenticated Supabase client and token handling |

This structure keeps provider-specific code separate from database operations and makes it easier to add or replace models later.

---

## AI Coding Tools Used

I used AI coding tools as an:

- Implementation assistant
- Architecture discussion partner
- Debugging assistant
- Code reviewer
- Learning aid
- Documentation assistant

I used them to:

- Discuss the application architecture
- Generate and refine implementation ideas
- Explain Supabase RLS and token-based authorization
- Help write and debug FastAPI and TypeScript code
- Review error messages
- Improve the frontend interaction and confirmation flow
- Draft and refine documentation

I did not treat generated code as automatically correct. I ran the application, inspected the database behavior, reviewed the resulting code, and corrected issues when the implementation did not match the intended behavior.

### Example of Catching and Correcting an AI-Generated Issue

During the note-confirmation implementation, the frontend correctly sent:

```json
{
  "confirmed": true
}
```

However, the backend contained a hardcoded value:

```python
confirmed = False
```

This meant every request was treated as unconfirmed, even after the user clicked the confirmation button.

The issue was identified by testing the actual confirmation flow and tracing the value through the request and tool invocation.

The backend was corrected to use:

```python
confirmed = request.confirmed
```

Another issue involved a generated schema using Python's lowercase `any` instead of the typing type `Any`:

```python
arguments: dict[str, any]
```

This caused a Pydantic schema-generation error.

It was corrected to:

```python
arguments: dict[str, Any]
```

These issues reinforced that generated code needs to be checked against runtime behavior, not simply accepted because it looks plausible.

---

## Key Decisions and Interpretations

### Notes Versus Care Records

I interpreted a free-form note as a separate type of information from a structured care activity.

For example:

> Moved the plant closer to the window because the leaves looked pale.

This contains both an observation and an action. Forcing it into a single predefined care activity would lose context.

The note is therefore stored as free-form text, while structured care records remain available for explicit activities.

### AI Analysis Is Optional

I made `ai_analysis` nullable because the assignment requires the note feature to use AI, but a note should not become unusable merely because an AI provider is unavailable.

The original user content is the durable record. AI-generated analysis is an enhancement rather than the only copy of the note.

### Confirmation for Writes

I chose confirmation for note creation because it is a database mutation.

This reduces the chance that a misunderstood request creates an unintended permanent record.

Read operations such as searching notes or retrieving plant details do not require the same confirmation step.

### Provider Fallback

I used a primary AI provider and a fallback provider because external model APIs can fail due to:

- Rate limits
- Temporary outages
- Provider-specific errors
- Network problems

The fallback is intended to preserve basic functionality while still exposing a warning to the user.

### Limited Scope

I prioritized the required plant, care history, summary, authentication, ownership, and note workflows instead of adding:

- Billing
- Image uploads
- Reminders
- A large dashboard
- Additional unrelated features

The goal was to make the core workflow reliable and explainable rather than maximize the number of features.

---

## What I Would Improve for Production

If this application were headed toward production, I would improve several areas.

### More Reliable AI Execution

The current AI workflow relies on a model to produce the appropriate tool call.

I would make confirmed writes more deterministic by using a dedicated backend confirmation endpoint or a server-side confirmation token tied to the exact proposed action.

That would avoid asking the model to reinterpret the user's confirmation message a second time.

### Stronger Input Validation

I would add stricter validation for:

- UUID format
- Supported activity types
- Date and timestamp ranges
- Note content normalization
- Maximum request and response sizes
- Provider response schemas

I would also add automated tests for malformed model tool calls and unexpected provider responses.

### Better Plant-Care Rules

The current attention status is intentionally simple.

A production version could consider:

- Plant species
- Watering frequency
- Last care activity
- Seasonal changes
- Indoor or outdoor conditions
- Light exposure
- User-defined schedules
- Local weather, if relevant

The status should also explain which data caused the plant to be marked as needing attention.

### Better AI Safety and Reliability

I would add:

- More explicit tool-argument validation
- Tool-call allowlists per user action
- Rate limiting per authenticated user
- Request tracing and structured logs
- Model response timeouts
- Retry policies with limits
- Prompt-injection testing
- More comprehensive refusal and uncertainty handling
- Evaluation cases for incorrect plant identification
- Protection against excessive or repeated tool calls

### Database and API Improvements

I would consider:

- Database indexes based on actual query patterns
- Pagination for care records and notes
- More explicit foreign-key constraints
- Database functions for sensitive multi-step operations
- API-level request IDs
- Better error codes for frontend handling
- Automated migration checks in CI

### Testing and Deployment

I would add:

- Unit tests for validation and status logic
- Integration tests for Supabase access policies
- API tests for authenticated and unauthenticated requests
- Tests attempting cross-user access
- Tests for confirmed and unconfirmed note creation
- End-to-end tests for signup, plant creation, care records, and note confirmation
- CI checks for linting, type checking, tests, and builds
- Separate development and production Supabase projects
- Secret management through the deployment platform

---

## Unfinished Work

The following items were intentionally left out or remain limited:

- Plant selection in the AI chat is currently represented by a test plant context and should be connected to the user's selected plant in the full UI.
- Task and reminder functionality was not implemented in the frontend.
- Image uploads were not implemented because they were out of scope.
- The AI service has a basic provider fallback rather than a full production-grade model-routing system.
- Automated test coverage is not yet comprehensive.
- The plant attention logic is intentionally basic and would need more domain-specific rules.
- The AI note workflow could be made more deterministic with a dedicated confirmation endpoint.
- Production observability, analytics, and deployment automation were not fully implemented.

These were scope decisions made to prioritize the required functionality and the security boundaries around user data.

---

## Project Structure

A simplified structure is:

```text
plant-tracker/
├── app/
│   ├── ...
│   └── ...
├── components/
│   ├── AiChat.tsx
│   └── ...
├── lib/
│   └── supabase/
├── supabase/
│   └── migrations/
├── ai-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── providers.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── tools.py
│   ├── requirements.txt
│   └── .env
├── ai-logs/
├── package.json
└── README.md
```

> Update this structure if the actual project uses `src/app`, `src/components`, or different file locations.

---

## AI Conversation Logs

The `ai-logs/` directory contains selected AI-assisted development conversations and debugging notes used during implementation.

These logs document how AI tools were used during development, including:

- Architecture discussions
- Debugging sessions
- Implementation decisions
- Corrections to generated suggestions
- Testing and troubleshooting

---

## License

This project was created as a take-home assignment and demonstration project.
