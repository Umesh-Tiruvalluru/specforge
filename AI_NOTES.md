# AI Notes

## LLM Used

**Model:** `gpt-oss:120b-cloud` via **Ollama**  
**Provider:** Ollama Cloud API (`https://api.ollama.com`)

### Why Ollama?

Ollama was chosen because it supports running open-source models with a simple API compatible with the OpenAI interface. The `gpt-oss:120b-cloud` model is large enough to produce structured JSON output reliably — smaller models tend to hallucinate or malform the JSON schema. Ollama also allows self-hosting if needed, which is useful for data-sensitive environments.

---

## What AI Was Used For

### Product spec generation

The core feature — the AI receives a structured prompt describing the user's product idea (goal, target users, constraints) and returns a JSON object containing:

- Title, summary, complexity estimate, timeline estimate
- User stories with descriptions and task lists
- Risks and unknowns
- Milestones

The prompt enforces strict JSON output and the response is validated with a Zod schema (`aiOutputSchema`) before anything is written to the database. If the AI returns malformed JSON or violates the schema, the request fails cleanly with a 500 error.

### Code generation (development)

Claude (claude.ai) was used extensively during development for:

- Initial scaffolding of the Express + Mongoose + TypeScript project structure
- Writing Mongoose schemas and model interfaces
- Writing Zod validation schemas
- Writing the service, controller, and route layers
- Debugging TypeScript errors (e.g. Express 5 `req.query` read-only issue)
- Writing the frontend single-file HTML app
- Generating API documentation (HTML and Markdown)

---

## What Was Checked Manually

- **Response envelope consistency** — verified that all routes return `{ success, data }` or `{ success, error }` correctly by testing with a REST client
- **Cascade delete** — manually confirmed that deleting a spec removes all stories, tasks, risks, unknowns, and milestones from the database
- **Zod validation** — tested that missing required fields return 400 with readable `details[]` array, not a raw Mongoose error
- **MongoDB connection string** — verified the `authSource=admin` parameter is required when using root credentials with a named database
- **Express 5 breaking change** — identified and fixed the `req.query` read-only getter issue that Claude's initial output did not account for
- **Docker standalone vs replica set** — tested that transactions fail on a standalone MongoDB instance and reverted to sequential writes
- **Frontend templates** — manually verified each of the 5 templates pre-fills the form correctly and maps to valid `productType` values the backend accepts
- **Export output** — checked that the Markdown export renders correctly when pasted into GitHub and Notion

---

## What Was NOT Verified

- The AI model's output quality is non-deterministic — the spec it generates varies between runs and has not been systematically evaluated for accuracy or usefulness
- No automated tests were written; all testing was manual
- The `order` field on stories and tasks is set correctly on creation but reordering is not implemented, so order values can become stale
