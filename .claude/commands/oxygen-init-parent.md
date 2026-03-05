# oxygen-init-parent

**Initialize a multi-repo project from the parent folder**

> **Model Requirement: Opus**
> This command requires Claude Opus-level reasoning for orchestrating deep codebase analysis across multiple repositories. If you are NOT already running as Opus, you MUST use the `Task` tool with `model: "opus"` to delegate the entire oxygen-init-parent execution to an Opus subagent. Pass the full prompt (from "## Prompt to Claude" below) and the current working directory as context to the subagent. Do NOT run this command with a lesser model — always escalate to Opus automatically.

---

## What Does It Do?

1. Discovers all git repositories in the parent folder
2. Presents discovered repos for user confirmation
3. **Spawns parallel Opus agents** — one per repo — to run full `oxygen-init`
4. Collects analysis results from all agents (tech stack, role, APIs, conventions)
5. Creates **parent-level structure** (CLAUDE.md, .claude/, tasks/) as the cross-repo hub
6. **Auto cross-links all repos** — writes INTEGRATION.md in every child repo
7. Enables **task delegation** from parent to individual repos

---

## Usage

In the parent folder containing your repositories, in Claude:

```
Run the oxygen-init-parent command
```

**Note:** The parent folder does NOT need to be a git repository. Only the child folders need `.git`. The parent is a coordination hub, not a code repo.

**Example folder structure:**

```
S:\Solutions\MyProject\              <-- Run from here (May NOT be a git repo)
├── MyProject.Backend\               <-- .NET backend repo (has .git)
├── MyProject.Frontend\              <-- Vue/Nuxt frontend repo (has .git)
└── MyProject.CMS\                   <-- Umbraco CMS repo (has .git)
```

---

## Prompt to Claude

````markdown
# OXYGEN-INIT-PARENT: Multi-Repo Initialization & Orchestration

**MODEL GATE:** If you are not running as Opus, use the Task tool with `model: "opus"` and `subagent_type: "general-purpose"` to execute this entire command as an Opus subagent. Pass this full prompt and the current working directory as context. Do NOT proceed with a lesser model — escalate to Opus automatically.

Initialize all repositories in this parent folder and set up cross-repo integration.

## PHASE 1: DISCOVERY

### 1.1 Scan for Repositories

Scan the current directory for subdirectories that contain a `.git` folder:

```bash
# List all subdirectories with .git
for dir in */; do
  if [ -d "$dir/.git" ]; then
    echo "REPO: $dir"
  fi
done
```
````

For each discovered repo, do a quick tech stack detection:

- Check for `.csproj`, `Program.cs` → .NET backend
- Check for `package.json`, `nuxt.config.ts` → Vue/Nuxt frontend
- Check for Umbraco/MedusaJS markers → CMS
- Check for `Dockerfile`, `docker-compose.yml` → Infrastructure
- Check for shared library indicators → Shared/Common

### 1.2 Present to User

Show the user a list of discovered repos with detected roles:

```
Found repositories:
  1. MyProject.Backend    → .NET 9 (backend)
  2. MyProject.Frontend   → Vue 3/Nuxt 3 (frontend)
  3. MyProject.CMS        → Umbraco 14 (cms)
```

Ask the user:

- **Confirm the list** — allow deselecting repos that should not be included
- **Correct any roles** — the auto-detection may need adjustment
- **Add display names** — if repo folder names differ from desired names

### 1.3 Check Existing Initialization

For each repo that already has a `.claude/` directory, ask the user **per repo**:

```
"MyProject.Backend already has .claude/ — re-initialize or skip?"
  - Re-initialize: Run full oxygen-init (overwrites existing)
  - Skip: Keep existing, collect info from current .claude/PROJECT.md and CLAUDE.md
```

### 1.4 Check Parent Folder

If the parent folder already has a `.claude/` directory or `CLAUDE.md` from a previous run, inform the user:

```
"This parent folder already has Oxygen structure. Overwrite or update?"
  - Overwrite: Regenerate all parent-level files from scratch
  - Update: Merge new repo information into existing files, preserving customizations
```

---

## PHASE 2: PARALLEL REPO INITIALIZATION

### 2.1 Launch Parallel Agents

For each repo that needs initialization, spawn a **Task subagent** with `model: "opus"` and `subagent_type: "general-purpose"`:

```
For each repo in confirmed_repos:
  if needs_initialization:
    Launch Task agent with:
      model: "opus"
      subagent_type: "general-purpose"
      prompt: Full oxygen-init prompt (from oxygen-init.md)
              + "Working directory: <absolute-path-to-repo>"
              + "SKIP Phase 3.9 (Cross-Repo Integration) — the parent command handles this."
              + "At the end, output a structured summary:
                 REPO_NAME: <name>
                 REPO_ROLE: <detected role>
                 TECH_STACK: <detected tech stack with versions>
                 BRANCH_CONVENTION: <detected or default>
                 LOCAL_URL: <detected local URL>
                 API_BASE_URL: <detected API base URL or N/A>
                 KEY_FINDINGS: <bullet list of important findings>
                 ISSUES: <bullet list of issues discovered>"
```

**CRITICAL:** Launch ALL agents in a single message (parallel execution). Do NOT wait for one agent to finish before launching the next.

### 2.2 Collect from Skipped Repos

For repos that were skipped (already initialized):

- Read `<repo>/.claude/PROJECT.md` for tech stack and role
- Read `<repo>/CLAUDE.md` for architecture overview and key findings
- Extract the same structured summary fields

### 2.3 Wait for All Agents

Wait for all parallel agents to complete. Collect the structured summary from each.

---

## PHASE 3: COLLECT & CONSOLIDATE

### 3.1 Build Unified View

From all agent results, build a consolidated picture:

| Repo   | Role   | Tech Stack | Local URL | API Base URL |
| ------ | ------ | ---------- | --------- | ------------ |
| [name] | [role] | [stack]    | [url]     | [api-url]    |

### 3.2 Identify Relationships

Determine API relationships:

- Which repos **expose** APIs? (typically backend)
- Which repos **consume** APIs? (typically frontend, CMS)
- What shared conventions exist? (naming, auth, error format, dates)

### 3.3 Detect Shared Conventions

Across all repos, identify common patterns:

- Naming conventions (camelCase, PascalCase, kebab-case)
- Authentication approach (JWT, cookies, API keys)
- Error format (RFC 7807, custom)
- Date format (ISO 8601, timestamps)
- Branch naming convention

---

## PHASE 4: PARENT-LEVEL SETUP

### 4.1 Create Parent Directory Structure

```bash
mkdir -p .claude
mkdir -p .claude/agents
mkdir -p .claude/skills
mkdir -p .claude/commands
mkdir -p .claude/templates/project
mkdir -p .claude/templates/task
mkdir -p tasks
```

### 4.2 Copy Oxygen Components

Copy agents, skills, commands, and templates from the Oxygen Toolkit to `.claude/`:

```bash
TOOLKIT_SRC="<toolkit-path>"   # e.g. S:\Solutions\Oxygen_AI_ToolKit

cp -r $TOOLKIT_SRC/agents/* .claude/agents/
cp -r $TOOLKIT_SRC/skills/* .claude/skills/
cp -r $TOOLKIT_SRC/commands/* .claude/commands/
cp -r $TOOLKIT_SRC/templates/* .claude/templates/
```

### 4.3 Generate Parent CLAUDE.md

Create `CLAUDE.md` in the parent folder with:

```markdown
# [Project Name] — Multi-Repo Project

## Overview

[High-level description of the entire project, synthesized from all repo analyses]

## Repositories

### [Repo 1 Name] ([Role])

- **Path:** [absolute path]
- **Tech Stack:** [stack]
- **Purpose:** [one-line summary from repo's CLAUDE.md]
- **Local URL:** [url]

### [Repo 2 Name] ([Role])

...

(Repeat for each repo)

## Architecture Overview

[How the repos work together — API flows, data flow, deployment order]

## Cross-Repo Task Workflow

This is the **parent hub** for managing cross-repo tasks.

### Creating a Cross-Repo Task

From this parent folder, run:
```

oxygen-new-task TASK-XXX "Feature description" --cross-repo

```
This creates the task in `tasks/` and syncs it to all child repos.

### Delegating to a Specific Repo
To create a repo-specific sub-task:
```

"Create a sub-task in [Repo Name] for [specific work]"

```
Claude will create the task in `<repo-path>/tasks/` with the appropriate context.

### Task Delegation Pattern
1. Create master task here (parent `tasks/`)
2. Break down into repo-specific sub-tasks
3. Delegate sub-tasks to each repo's `tasks/` directory
4. Use `oxygen-sync` to keep progress in sync
5. Review from parent with `oxygen-review-task`

## Oxygen Components
All agents, skills, and commands are available in `.claude/`.
Run `oxygen-help` for command reference.

## MCP Servers
See `.mcp.json` for configured MCP servers.
```

### 4.4 Generate Parent INTEGRATION.md

Create `.claude/INTEGRATION.md` as the **master integration reference**:

Use the INTEGRATION.md template but with special parent context:

```markdown
# Cross-Repo Integration (Parent Hub)

**Generated by oxygen-init-parent**

## This Repository

| Field       | Value                                       |
| ----------- | ------------------------------------------- |
| **Name**    | [Project Name] (Parent)                     |
| **Role**    | parent / orchestrator                       |
| **Purpose** | Cross-repo task management and coordination |

## Child Repositories

### [Repo 1 Name]

| Field                 | Value                               |
| --------------------- | ----------------------------------- |
| **Path**              | [absolute path]                     |
| **Role**              | [backend / frontend / cms / shared] |
| **Tech Stack**        | [e.g. .NET 9]                       |
| **Branch Convention** | [e.g. feature/TASK-XXX-slug]        |
| **Local URL**         | [e.g. https://localhost:5001]       |
| **API Base URL**      | [e.g. https://localhost:5001/api]   |

(Repeat for each child repo)

## API Contracts Overview

### [Backend Repo] Exposes

| Endpoint   | Method     | Purpose       | Consumed By     |
| ---------- | ---------- | ------------- | --------------- |
| [/api/...] | [GET/POST] | [Description] | [Frontend, CMS] |

### [Frontend/CMS Repo] Consumes

| Endpoint   | Method     | Purpose       | Provided By |
| ---------- | ---------- | ------------- | ----------- |
| [/api/...] | [GET/POST] | [Description] | [Backend]   |

## Shared Conventions

| Convention         | Standard        |
| ------------------ | --------------- |
| **Naming**         | [from analysis] |
| **Auth**           | [from analysis] |
| **Error Format**   | [from analysis] |
| **Date Format**    | [from analysis] |
| **Pagination**     | [from analysis] |
| **API Versioning** | [from analysis] |

## Cross-Repo Workflow

| Aspect                  | Convention                                    |
| ----------------------- | --------------------------------------------- |
| **Branch Strategy**     | [e.g. Same TASK-ID prefix across repos]       |
| **Communication**       | [e.g. REST API / Event-driven / Both]         |
| **Deploy Order**        | [e.g. Backend first, then Frontend]           |
| **Integration Testing** | [e.g. All services running locally]           |
| **Task Management**     | Parent folder is the hub for cross-repo tasks |

## Environment Setup

| Service       | Repo       | Local URL                | Health Check |
| ------------- | ---------- | ------------------------ | ------------ |
| [Backend API] | [Backend]  | [https://localhost:5001] | [/health]    |
| [Frontend]    | [Frontend] | [https://localhost:3000] | [/]          |
| [CMS]         | [CMS]      | [https://localhost:8080] | [/health]    |
```

### 4.5 Generate Parent PROJECT.md

Create `.claude/PROJECT.md`:

```markdown
# [Project Name] — Multi-Repo Architecture

## Project Purpose

[Synthesized from all repo analyses]

## System Architecture

### Repositories

| Repo   | Role   | Tech Stack | Key Responsibility |
| ------ | ------ | ---------- | ------------------ |
| [name] | [role] | [stack]    | [one-line]         |

### Communication Patterns

[How repos communicate — REST, events, shared DB, etc.]

### Data Flow

[Request flow from user through frontend → backend → database]

### Deployment Architecture

[How services are deployed and in what order]

## Combined Tech Stack

### Backend

[Versions and frameworks from backend repo analysis]

### Frontend

[Versions and frameworks from frontend repo analysis]

### CMS

[Versions and frameworks from CMS repo analysis]

### Infrastructure

[Shared infrastructure: Azure, Docker, CI/CD]

## Key Patterns Across Repos

[Common patterns identified across all repos]

## Known Issues

[Combined issues from all repo analyses]
```

### 4.6 Generate Parent README.md

Create `.claude/README.md`:

```markdown
# Parent Project Context

Oxygen AI multi-repo development hub.

## Structure

- **CLAUDE.md** - Cross-repo project overview
- **.claude/INTEGRATION.md** - Master integration config
- **.claude/PROJECT.md** - Combined architecture
- **tasks/** - Cross-repo tasks (delegated to child repos)

## Child Repositories

| Repo   | Role   | Path   |
| ------ | ------ | ------ |
| [name] | [role] | [path] |

## Oxygen Components

### Agents (`agents/`)

- backend-architect (Opus) - Architecture & planning
- api-developer (Sonnet) - .NET implementation
- frontend-developer (Sonnet) - Vue/Nuxt development
- cms-specialist (Sonnet) - Umbraco/MedusaJS
- test-engineer (Sonnet) - Testing
- code-reviewer (Sonnet) - Quality reviews
- devops-engineer (Sonnet) - Azure infrastructure

### Commands (`commands/`)

- oxygen-init-parent - This command
- oxygen-new-task - Create cross-repo task (with --cross-repo)
- oxygen-sync - Sync task context across repos
- oxygen-status - Multi-repo status overview
- oxygen-review-task - Review task across repos
- oxygen-help - Command reference

## Cross-Repo Workflow

1. Create task: `oxygen-new-task TASK-XXX "Feature" --cross-repo`
2. Delegate sub-tasks to child repos
3. Sync progress: `oxygen-sync TASK-XXX`
4. Handoff between repos: `oxygen-sync --handoff TASK-XXX <repo>`
5. Review: `oxygen-review-task TASK-XXX`
```

### 4.7 Create .mcp.json

Create `.mcp.json` in the parent folder with context7 (always) and any MCP servers relevant across the combined tech stacks:

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Add additional servers based on the combined tech stack detected across all repos.

### 4.8 Note on Git

The parent folder is typically NOT a git repository — it is a coordination hub only. The `.claude/` structure, `CLAUDE.md`, and `tasks/` in the parent are local to the developer's machine.

If the parent folder IS a git repo (e.g., a monorepo or umbrella repo), add to `.gitignore`:

```
# Oxygen global toolkit (don't commit)
.oxygen-toolkit/

# Claude Code local settings (user-specific, not for team)
.claude/settings.local.json

# Windows null device artifact
nul
```

---

## PHASE 5: CROSS-LINK CHILD REPOS

### 5.1 Write INTEGRATION.md in Each Child Repo

For **every** child repo (both newly initialized and skipped), create or update `.claude/INTEGRATION.md`:

**For newly initialized repos:** Write the full INTEGRATION.md.
**For skipped repos:** Read the existing INTEGRATION.md first, then merge in new sibling information. Preserve any custom notes, API contract details, or conventions the user may have added.

```
For each child_repo in confirmed_repos:
  Generate INTEGRATION.md with:
    - "This Repository" = child_repo info
    - "Related Repositories" = ALL other repos (siblings + parent)
    - API Contracts = based on role relationships
    - Shared Conventions = from Phase 3.3
    - Cross-Repo Workflow = from Phase 3 consolidation
    - Environment Setup = all services with URLs
```

Each repo's INTEGRATION.md should reference:

- All sibling repos (with paths, roles, tech stacks, URLs)
- The parent folder (as the task management hub)

### 5.2 Update Child README.md

For each child repo, ensure `.claude/README.md` contains a cross-repo section:

```markdown
## Cross-Repo Integration

This project is part of a multi-repo setup. See `INTEGRATION.md` for:

- Related repositories and their paths
- API contracts overview
- Shared conventions
- Cross-repo workflow

**Parent hub:** [parent-folder-path]
Tasks are managed from the parent folder and delegated to this repo.

**Cross-repo commands:**

- `oxygen-sync TASK-XXX` — Sync task context across repos
- `oxygen-sync --handoff TASK-XXX <repo>` — Transfer context to another repo
```

---

## PHASE 6: VERIFICATION

Verify parent structure:

```bash
ls -la CLAUDE.md
ls -la .mcp.json
ls -la .claude/INTEGRATION.md
ls -la .claude/PROJECT.md
ls -la .claude/README.md
ls .claude/agents/
ls .claude/skills/
ls .claude/commands/
ls tasks/
```

Verify each child repo:

```bash
for repo in <repo-list>; do
  echo "--- $repo ---"
  ls -la "$repo/.claude/INTEGRATION.md"
  ls -la "$repo/CLAUDE.md"
  ls -la "$repo/.claude/"
done
```

Verify cross-linking consistency:

```bash
# Each child INTEGRATION.md should reference all siblings
# All paths should be valid
# All roles and tech stacks should be consistent
```

Expected:

```
✓ Parent CLAUDE.md created
✓ Parent .claude/ structure created (agents, skills, commands, templates)
✓ Parent .mcp.json created
✓ Parent INTEGRATION.md created (master reference)
✓ Parent tasks/ directory created
✓ [N] child repos initialized (or skipped with info collected)
✓ All child repos cross-linked via INTEGRATION.md
✓ All child repos reference parent hub
```

---

## PHASE 7: OUTPUT REPORT

```
═══════════════════════════════════════════════════════════
  OXYGEN PARENT INITIALIZATION COMPLETE
═══════════════════════════════════════════════════════════

📊 MULTI-REPO PROJECT

Project: [Name]
Repos:   [N] repositories initialized

─────────────────────────────────────────────────────────

📁 REPOSITORIES

  [✓/⊘] [Repo 1 Name]  ([Role])  [Tech Stack]
         Status: [Initialized / Skipped (existing)]

  [✓/⊘] [Repo 2 Name]  ([Role])  [Tech Stack]
         Status: [Initialized / Skipped (existing)]

  ...

─────────────────────────────────────────────────────────

📁 PARENT STRUCTURE

✅ CLAUDE.md — Cross-repo overview & delegation guide
✅ .mcp.json — MCP server configuration
✅ .claude/INTEGRATION.md — Master integration reference
✅ .claude/PROJECT.md — Combined architecture
✅ .claude/README.md — Parent context

─────────────────────────────────────────────────────────

🤖 OXYGEN COMPONENTS (Parent)

Agents (7) → .claude/agents/
Skills (6) → .claude/skills/
Commands (8+) → .claude/commands/
Templates → .claude/templates/

─────────────────────────────────────────────────────────

🔗 CROSS-REPO INTEGRATION

  All repos cross-linked:
  ✓ [Repo 1] ↔ [Repo 2] ↔ [Repo 3]

  Parent hub: [parent-path]
  Integration files: .claude/INTEGRATION.md (in each repo)

─────────────────────────────────────────────────────────

🔌 MCP SERVERS (.mcp.json)

  ✓ context7 (always included)
  [✓/- additional servers based on combined tech stack]

─────────────────────────────────────────────────────────

⚠️ ISSUES DISCOVERED

[Combined issues from all repo analyses]

─────────────────────────────────────────────────────────

💡 NEXT STEPS

1. Review parent CLAUDE.md for the cross-repo overview
2. Review each repo's CLAUDE.md for deep analysis
3. Configure .mcp.json with correct credentials
4. Commit in each repo:
   git add .claude/ .mcp.json CLAUDE.md
   git commit -m "Add Oxygen context"

5. Create first cross-repo task from this parent folder:
   "Run oxygen-new-task TASK-001 'Feature name' --cross-repo"

6. Check multi-repo status:
   "Run oxygen-status"

═══════════════════════════════════════════════════════════
```

---

## After Init

Your structure:

```
parent-folder/                          ← PARENT HUB (May not be a git repo)
├── CLAUDE.md                           ← Cross-repo overview
├── .mcp.json                           ← MCP config
├── .claude/                            ← Full Oxygen structure
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   ├── templates/
│   ├── INTEGRATION.md                  ← Master integration
│   ├── PROJECT.md                      ← Combined architecture
│   └── README.md                       ← Parent context
├── tasks/                              ← Cross-repo tasks
│
├── MyProject.Backend/                  ← Child repo (fully initialized)
│   ├── CLAUDE.md
│   ├── .claude/
│   │   ├── INTEGRATION.md              ← References all siblings + parent
│   │   └── ...
│   └── tasks/
│
├── MyProject.Frontend/                 ← Child repo (fully initialized)
│   ├── CLAUDE.md
│   ├── .claude/
│   │   ├── INTEGRATION.md              ← References all siblings + parent
│   │   └── ...
│   └── tasks/
│
└── MyProject.CMS/                      ← Child repo (fully initialized)
    ├── CLAUDE.md
    ├── .claude/
    │   ├── INTEGRATION.md              ← References all siblings + parent
    │   └── ...
    └── tasks/
```

## Task Delegation Examples

```
# Create a cross-repo task from parent
"Run oxygen-new-task TASK-042 'Customer portal with order history' --cross-repo"
→ Creates master task in parent tasks/
→ Syncs to all child repos

# Delegate a sub-task to a specific repo
"Create a backend sub-task in MyProject.Backend for the order history API"
→ Claude creates task in MyProject.Backend/tasks/

# Delegate frontend work
"Create a frontend sub-task in MyProject.Frontend for the order history UI"
→ Claude creates task in MyProject.Frontend/tasks/

# Sync progress across all repos
"Run oxygen-sync TASK-042"
→ Syncs PLAN.md, TASKS.md, CONTRACTS.md across all repos

# Handoff from backend to frontend
"Run oxygen-sync --handoff TASK-042 MyProject.Frontend"
→ Generates HANDOFF.md with backend context, copies to frontend repo

# Review cross-repo task
"Run oxygen-review-task TASK-042"
→ Reviews implementation across all repos
```

---

## BEGIN INITIALIZATION

```

```
