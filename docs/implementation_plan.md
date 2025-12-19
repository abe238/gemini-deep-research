# Implementation Plan: Gemini Deep Research CLI

## Goal
Build a CLI tool to interact with Gemini's Deep Research Agent, allowing users to plan, execute, and save research reports.

## Architecture
- **Language**: TypeScript (Node.js)
- **Dependencies**: `commander` (CLI), `dotenv` (Auth), `ora` (Spinner), `chalk` (Styling), `inquirer` (or similar for interactive prompts - standard `readline` might suffice if I want to keep it simple, but `inquirer` is better. It is not in package.json, I might need to add it or use `readline`).
- **API**: Gemini Interactions API (REST via `fetch`).

## Features
1. **Configuration**: Load `GEMINI_API_KEY` from `.env`.
2. **Input**: Accept research topic via command line argument or interactive prompt.
3. **Plan & Review**:
   - Since the API doesn't support native plan approval, we will simulate this:
   - Step 1: Request a "Research Plan" from the agent for the topic.
   - Step 2: Display the plan.
   - Step 3: Ask user to proceed or refine.
   - Step 4: If proceed, send the plan (or original topic) to the agent for full research.
4. **Execution**:
   - Start background task (`background=true`).
   - Poll for status (`in_progress` -> `completed`).
   - Show spinner/progress.
5. **Output**:
   - Display final report in terminal (Markdown rendered if possible, or just text).
   - Save to `reports/<topic-slug>.md`.

## Steps
1. [x] **Verify API**: Ensure `test_deep_research.ts` works.
2. [x] **Setup Project**: existing `package.json` has `commander`, `ora`, `chalk`, `dotenv`.
3. [x] **CLI Skeleton**: Create `src/cli.ts` with `commander`.
4. [x] **API Client**: Refactor API logic into `src/cli.ts` (Merged into CLI for simplicity).
5. [x] **Implement Flow**:
   - `getResearchPlan(topic)`
   - `executeResearch(topic/plan)`
   - `pollLoop(interactionId)`
6. [x] **Save Report**: Implement file saving logic.
7. [x] **Refinement**: Add error handling, timeouts, and better UX.

## Constraints
- "The Deep Research Agent currently doesn't support human approved planning or structured outputs." 
  - **Status: RESOLVED**. We successfully implemented the workaround by creating a two-step process: 
    1. Generate a plan using `gemini-3-flash-preview`.
    2. Ask the user to confirm.
    3. Pass the confirmed plan as input to the `deep-research-pro` agent.

## Note on Docs
- Using `docs/deep-research.md.txt` as the source of truth for API usage.
