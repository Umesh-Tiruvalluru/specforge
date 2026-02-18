# SpecForge — AI-Powered Product Spec Generator

A mini planning tool that turns a feature idea into a full product specification — user stories, engineering tasks, risks, unknowns, and milestones — powered by an LLM.

---

## How to Run

### Prerequisites

- Docker + Docker Compose
- An Ollama API key (set in `.env`)

### 1. Clone and configure

```bash
git clone <repo>
cd specforge
cp .env.example .env
# Fill in MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, OLLAMA_API_KEY
```

**.env**

```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=yourpassword
DATABASE_URL=mongodb://admin:yourpassword@mongodb:27017/specdb?authSource=admin
OLLAMA_API_KEY=your_key_here

FRONTEND_PORT=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=
```

### 2. Start

```bash
docker compose up --build
```

Backend runs on `http://localhost:5000`

### 3. Frontend

Open `specforge-app.html` directly in your browser. No build step needed — it's a single HTML file that talks to the backend at `http://localhost:5000/api`.

---

## What Is Done

### Backend

- `POST /api/generate` — accepts a feature idea, calls the AI, persists the full spec to MongoDB, returns a `specId`
- `GET /api/specs` — paginated list of specs with filtering by product type
- `GET /api/specs/:id` — fully populated spec with stories, tasks, risks, unknowns, milestones
- `PATCH /api/specs/:id` — partial update of top-level spec fields
- `DELETE /api/specs/:id` — deletes spec and all child documents (cascade)
- Zod validation on all inputs (body, params, query)
- Standardised response envelope `{ success, data, error, meta }`
- Centralised error handling middleware (Mongoose errors, cast errors, 404s)
- MongoDB indexes on all foreign key and sort fields

### Frontend (`specforge-app.html`)

- Form with all fields the backend accepts
- 5 quick-fill templates: Web App, Mobile App, API, Internal Tool, SaaS
- Inline editing of stories, tasks, risks, unknowns, milestones (contenteditable)
- Add / delete tasks and chips inline
- Export: Copy as Markdown, Download `.md`, Copy as plain text
- Sidebar showing last 5 generated specs (loaded live from the API)
- Delete spec with confirmation (removes from DB and recent list)
- Loading state during AI generation

---

## What Is NOT Done

### Backend gaps (identified, not implemented)

- `PATCH /api/stories/:id` — editing a story's title/description does not persist to DB
- `PATCH /api/tasks/:id` — task edits are in-memory only, lost on refresh
- `PATCH /api/risks/:id`, `PATCH /api/unknowns/:id`, `PATCH /api/milestones/:id` — same
- `PATCH /api/specs/:id/stories/reorder` — drag-to-reorder is UI only, not persisted
- `PATCH /api/stories/:id/tasks/reorder` — same
- `POST /api/specs/:id/stories` — adding a new story is UI only
- `POST /api/stories/:id/tasks` — adding a new task is UI only
- `DELETE /api/stories/:id`, `DELETE /api/tasks/:id`, etc. — deletions are UI only

In short: all edits made after generation are **not saved back to the database**. Refreshing the page or reloading from the sidebar will show the original AI-generated content.

### Frontend gaps

- No authentication — anyone with the URL can see all specs
- No real drag-and-drop persistence (visual only)
- No undo for deletions
- Mobile layout not optimised
