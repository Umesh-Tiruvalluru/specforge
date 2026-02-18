# Prompts Used

Record of prompts sent to Claude (claude.ai) during development of SpecForge.
Agent responses, API keys, and personal data are not included.

---

## 1. Initial Architecture & Model Design

> You are a senior backend architect with 10+ years of experience building scalable production systems. I have an existing backend project. Your job is to: Analyze my current tech stack, Improve existing models (without breaking compatibility), Refactor routes for better structure, Add new routes I specify, Follow clean architecture principles, Write complete working implementations (not pseudo code)
>
> Tech Stack: Node.js, TypeScript, Express, MongoDB + Mongoose, JWT/None, Docker, Ollama
>
> [attached: spec.ts models file]
>
> TASKS:
>
> 1. Improve Existing Models — fix naming inconsistencies, normalize schema fields, add proper validations, add indexes, remove redundant fields, improve type safety, improve relationships, add timestamps if missing, keep backward compatibility
> 2. Improve Existing Routes — move logic out of routes into controllers/services, add validation middleware, add proper error handling, standardize response format, add proper HTTP status codes, remove duplicated logic
> 3. Add These New Routes — GET /specs (list), GET /specs/:id, Delete endpoint, Update endpoint

---

## 2. TypeScript Error Fixes

> Conversion of type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' to type 'Record<string, unknown>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first. Index signature for type 'string' is missing in type 'Request<...>'. in src/middleware/validate.ts
>
> Argument of type 'string | string[]' is not assignable to parameter of type 'string'. Type 'string[]' is not assignable to type 'string'. [×3] in specController.ts

---

## 3. Sample Test Data

> can you give me sample data for testing all endpoints

---

## 4. Server Selection Timeout

> backend | DB Error: Server selection timed out after 30000 ms
> mongodb | NamespaceNotFound: Unable to retrieve storageStats — Collection [local.oplog.rs] not found
> backend exited with code 1 (restarting)

---

## 5. Runtime Error — Express 5 req.query Read-Only

> [Internal server error 500 response]
>
> backend | [Unhandled Error] TypeError: Cannot set property query of #<IncomingMessage> which has only a getter
> backend | at /app/dist/src/middleware/validate.js:16:21
> [stack trace]
>
> get /api/specs are not working

---

## 6. API Documentation — Interactive HTML

> generate api docs for frontend developer

---

## 7. Frontend App + Gap Analysis

> Tasks Generator (mini planning tool). Build a web app where I can:
>
> - fill a small form about a feature idea (goal, users, constraints)
> - generate a list of user stories and engineering tasks
> - edit, reorder, and group tasks
> - export the result (copy/download as text or markdown)
> - see the last 5 specs I generated
>   Make it your own: for example, add templates (mobile/web/internal tool) or "risk/unknowns" section.
>
> This is the actual problem statement: is our backend solves all the problems?

---
