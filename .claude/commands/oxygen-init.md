# oxygen-init

**Analyze project and initialize Oxygen structure**

> **Model Requirement: Opus**
> This command requires Claude Opus-level reasoning for deep codebase analysis. If you are NOT already running as Opus, you MUST use the `Task` tool with `model: "opus"` to delegate the entire oxygen-init execution to an Opus subagent. Pass the full prompt (from "## Prompt to Claude" below) and the project working directory as context to the subagent. Do NOT run this command with a lesser model — always escalate to Opus automatically.

---

## What Does It Do?

1. Deep codebase analysis
2. Generates CLAUDE.md
3. Creates .claude/ structure
4. **Copies agents to .claude/agents/**
5. **Copies skills to .claude/skills/**
6. **Copies commands to .claude/commands/**
7. **Creates .mcp.json prepared for MCP servers**
8. Generates project-specific documentation

---

## Usage

In the root of your project, in Claude:

```
Run the oxygen-init command
```

---

## Prompt to Claude

```markdown
# OXYGEN-INIT: Deep Repository Analysis & Setup

**MODEL GATE:** If you are not running as Opus, use the Task tool with `model: "opus"` and `subagent_type: "general-purpose"` to execute this entire command as an Opus subagent. Pass this full prompt and the current working directory as context. Do NOT proceed with a lesser model — escalate to Opus automatically.

Analyze this project and set up a complete Oxygen structure.

## PHASE 1: ANALYSIS (Silent Pass)

### 1.1 Tech Stack Detection
- Backend: .csproj, Program.cs, Startup.cs
- Frontend: package.json, nuxt.config.ts
- Databases: Migrations, DbContext
- CMS: Umbraco/MedusaJS
- Cloud: Azure/AWS configs

### 1.2 Architecture Patterns
- CQRS (MediatR)
- Clean Architecture
- DDD (aggregates, value objects)
- Microservices vs Monolith

### 1.3 Code Conventions
Find actual patterns:
- Naming conventions
- Error handling
- Logging
- Validation
- Testing

---

## PHASE 2: GENERATE CLAUDE.md

Create comprehensive analysis with these sections:

1. Project Purpose
2. High-Level Architecture
3. Runtime Behavior
4. Codebase Tour
5. Domain Model
6. Data Flow
7. Integrations
8. Configuration
9. State & Persistence
10. Error Handling
11. Performance
12. Security
13. Testing Reality
14. Known Unknowns
15. Change Playbooks
16. Improvement Opportunities

---

## PHASE 3: SETUP .CLAUDE/ STRUCTURE

### 3.1 Create Directories

```bash
mkdir -p .claude
mkdir -p .claude/agents
mkdir -p .claude/skills
mkdir -p .claude/commands
mkdir -p .claude/templates/project
mkdir -p .claude/templates/task
mkdir -p tasks
```

### 3.2 Copy Oxygen Components

**CRITICAL: Copy from Oxygen Toolkit to .claude/**

The Oxygen Toolkit can be located as:
- `.oxygen-toolkit/` (cloned into the project)
- An external path (e.g. `S:\Solutions\Oxygen\Oxygen_AI_Toolkit`)

```bash
# Define source (adjust to actual location)
TOOLKIT_SRC=".oxygen-toolkit"

# Copy all agents (with config.json + instructions.md)
cp -r $TOOLKIT_SRC/agents/* .claude/agents/

# Copy all skills (with SKILL.md files)
cp -r $TOOLKIT_SRC/skills/* .claude/skills/

# Copy all commands (md files)
cp -r $TOOLKIT_SRC/commands/* .claude/commands/

# Copy templates
cp -r $TOOLKIT_SRC/templates/* .claude/templates/
```

This makes .claude/ self-contained!

### 3.3 Create .mcp.json (MCP Server Configuration)

**Create `.mcp.json` in the project root**, prepared with relevant MCP servers.

The file should be tailored based on the project's tech stack (detected in Phase 1).

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

#### MCP servers that can be added based on tech stack:

**If the project uses Azure:**
```json
{
  "azure-devops": {
    "type": "stdio",
    "command": "cmd",
    "args": ["/c", "npx", "-y", "@anthropic/azure-devops-mcp"],
    "env": {
      "AZURE_DEVOPS_ORG": "<customize>",
      "AZURE_DEVOPS_PAT": "<customize>"
    }
  }
}
```

**If the project uses PostgreSQL/SQL Server:**
```json
{
  "database": {
    "type": "stdio",
    "command": "cmd",
    "args": ["/c", "npx", "-y", "@anthropic/database-mcp"],
    "env": {
      "DATABASE_URL": "<customize>"
    }
  }
}
```

**If the project uses Elasticsearch:**
```json
{
  "elasticsearch": {
    "type": "stdio",
    "command": "cmd",
    "args": ["/c", "npx", "-y", "@elastic/elasticsearch-mcp"],
    "env": {
      "ELASTICSEARCH_URL": "<customize>"
    }
  }
}
```

**If the project uses GitHub:**
```json
{
  "github": {
    "type": "stdio",
    "command": "cmd",
    "args": ["/c", "npx", "-y", "@anthropic/github-mcp"],
    "env": {
      "GITHUB_TOKEN": "<customize>"
    }
  }
}
```

#### Rules for .mcp.json:
- Include ONLY servers that are relevant for the detected tech stack
- `context7` is ALWAYS included (provides contextual documentation)
- Use `<customize>` as placeholder for credentials - NEVER commit actual secrets
- Add a comment in CLAUDE.md about which MCP servers are configured

### 3.4 Generate .claude/README.md

```markdown
# Project Claude Context

Oxygen AI development context for this project.

## Structure

- **PROJECT.md** - Project overview
- **CONVENTIONS.md** - Coding standards (from actual code)
- **ARCHITECTURE.md** - System architecture
- **DEPENDENCIES.md** - Tech stack versions
- **GLOSSARY.md** - Domain terminology

## Oxygen Components

### Agents (`agents/`)
Specialized AI agents:
- backend-architect (Opus) - Architecture & planning
- api-developer (Sonnet) - .NET implementation
- frontend-developer (Sonnet) - Vue/Nuxt development
- cms-specialist (Sonnet) - Umbraco/MedusaJS
- test-engineer (Sonnet) - Testing
- code-reviewer (Sonnet) - Quality reviews
- devops-engineer (Sonnet) - Azure infrastructure

Usage: "Use the backend-architect agent for this design"

### Skills (`skills/`)
Best practices for technologies:
- dotnet - .NET 9 patterns
- vue-nuxt - Vue/Nuxt standards
- umbraco - Umbraco CMS
- medusajs - MedusaJS commerce
- azure-infra - Azure infrastructure
- testing - Test strategies

Referenced automatically by agents.

### Commands (`commands/`)
Oxygen workflow commands:
- oxygen-init - This command
- oxygen-new-task - Create new task
- oxygen-review-task - Review task
- oxygen-status - Project status
- oxygen-debug - Debugging help
- oxygen-help - Command reference

Usage: "Run oxygen-new-task TASK-042 'Feature name'"

### Templates (`templates/`)
Templates for documentation.

## Workflow

1. New Task: "Run oxygen-new-task"
2. Check Status: "Run oxygen-status"
3. Review: "Run oxygen-review-task"
4. Debug: "Run oxygen-debug"

## Customization

You can customize agents, skills, and commands in this directory.
Changes are project-specific and tracked in git.
```

### 3.5 Generate .claude/PROJECT.md

```markdown
# Project: [Name from analysis]

## Purpose
[From codebase analysis]

## Tech Stack

### Backend
[Actual versions found]

### Frontend
[Actual versions found]

### Infrastructure
[Actual services]

## Oxygen Toolkit

### Available Agents (`.claude/agents/`)
- backend-architect - Architecture & planning
- api-developer - .NET implementation
- frontend-developer - Vue/Nuxt development
- cms-specialist - Umbraco/MedusaJS
- test-engineer - Testing
- code-reviewer - Quality reviews
- devops-engineer - Infrastructure

### Available Skills (`.claude/skills/`)
- dotnet - .NET 9 best practices
- vue-nuxt - Vue/Nuxt standards
- umbraco - Umbraco CMS patterns
- medusajs - MedusaJS commerce
- azure-infra - Azure infrastructure
- testing - Test strategies

### Available Commands (`.claude/commands/`)
- oxygen-init
- oxygen-new-task
- oxygen-review-task
- oxygen-status
- oxygen-debug
- oxygen-help

## Baseline Components
[Shared libraries identified]

## Team Context
[Inferred from code]

## Key Patterns
[From analysis]
```

### 3.6 Generate .claude/CONVENTIONS.md

**Based on ACTUAL code:**

```markdown
# Coding Conventions

**Generated from actual codebase analysis**

## Backend (.NET)

### Error Handling
[Most common pattern with real example from code]

### Logging
[Actual logging approach with example]

### Validation
[Actual validation pattern with example]

## Frontend (Vue/Nuxt)

### Component Structure
[Actual pattern found]

### State Management
[Actual Pinia usage]

## Testing

### Unit Tests
[Actual test patterns]
```

### 3.7 Generate Other .claude/ Files

- ARCHITECTURE.md (from analysis)
- DEPENDENCIES.md (actual versions)
- GLOSSARY.md (domain terms from code)

### 3.8 Update .gitignore

Add to project .gitignore (preserve any existing entries):
```
# Oxygen global toolkit (don't commit)
.oxygen-toolkit/

# Claude Code local settings (user-specific, not for team)
.claude/settings.local.json

# Windows null device artifact
nul

# But DO commit .claude/ and .mcp.json (project context)
```

### 3.9 Cross-Repo Integration Setup

**Ask the user:** "Are there related repositories for this project? (e.g. a Frontend, Backend, CMS that belong together)"

**If no:** Skip this section.

**If yes:** For each related repo, collect:
1. **Name** (e.g. "Frontend", "Backend", "CMS")
2. **Absolute path on disk** (e.g. `S:\Solutions\MyProject.Frontend`)
3. **Role** (backend / frontend / cms / shared)
4. **Tech stack** (e.g. ".NET 9", "Vue 3/Nuxt 3")
5. **Branch convention** (e.g. "feature/TASK-XXX-slug")
6. **API base URL** (e.g. "https://localhost:5001/api")

**Generate `.claude/INTEGRATION.md`:**

Use the template from `templates/project/INTEGRATION.md` and fill in with:
- This repo's identity (name, role, tech stack from Phase 1)
- All related repos with collected info
- API contracts overview (what this repo exposes vs. consumes)
- Shared conventions (naming, auth, error format, date format)
- Cross-repo workflow (branch strategy, deploy order)
- Environment setup (local URLs for all services)

**Update `.claude/README.md`:**

Add a new section under "## Workflow":

```markdown
## Cross-Repo Integration

This project is part of a multi-repo setup. See `INTEGRATION.md` for:
- Related repositories and their paths
- API contracts overview
- Shared conventions
- Cross-repo workflow

**Cross-repo commands:**
- `oxygen-sync TASK-XXX` — Sync task context across repos
- `oxygen-sync --handoff TASK-XXX <repo>` — Transfer context to another repo
```

---

## PHASE 4: VERIFICATION

Verify structure:

```bash
ls -la CLAUDE.md
ls -la .mcp.json
ls -la .claude/README.md
ls -la .claude/PROJECT.md
ls -la .claude/CONVENTIONS.md
ls -la .claude/INTEGRATION.md  # Only if cross-repo was configured

ls .claude/agents/
ls .claude/skills/
ls .claude/commands/
```

Expected:
```
✓ CLAUDE.md created
✓ .mcp.json created (with relevant MCP servers)
✓ .claude/ structure created
✓ 7 agents copied to .claude/agents/
✓ 6 skills copied to .claude/skills/
✓ 7 commands copied to .claude/commands/
✓ Templates copied to .claude/templates/
✓ tasks/ directory created
✓ INTEGRATION.md created (if cross-repo configured)
```

---

## PHASE 5: OUTPUT REPORT

```
═══════════════════════════════════════════════════════════
  OXYGEN INITIALIZATION COMPLETE
═══════════════════════════════════════════════════════════

📊 PROJECT ANALYSIS

Type: [Monolith/Microservices]
Stack: [.NET 9 / Vue 3]
Architecture: [CQRS / Clean Architecture]

─────────────────────────────────────────────────────────

📁 STRUCTURE CREATED

✅ CLAUDE.md - Deep analysis
✅ .mcp.json - MCP server configuration
✅ .claude/PROJECT.md
✅ .claude/CONVENTIONS.md (from actual code)
✅ .claude/ARCHITECTURE.md
✅ .claude/DEPENDENCIES.md
✅ .claude/GLOSSARY.md
✅ .claude/README.md

─────────────────────────────────────────────────────────

🤖 OXYGEN COMPONENTS INSTALLED

Agents (7) → .claude/agents/:
  ✓ backend-architect (Opus)
  ✓ api-developer (Sonnet)
  ✓ frontend-developer (Sonnet)
  ✓ cms-specialist (Sonnet)
  ✓ test-engineer (Sonnet)
  ✓ code-reviewer (Sonnet)
  ✓ devops-engineer (Sonnet)

Skills (6) → .claude/skills/:
  ✓ dotnet
  ✓ vue-nuxt
  ✓ umbraco
  ✓ medusajs
  ✓ azure-infra
  ✓ testing

Commands (7) → .claude/commands/:
  ✓ oxygen-init
  ✓ oxygen-new-task
  ✓ oxygen-review-task
  ✓ oxygen-status
  ✓ oxygen-debug
  ✓ oxygen-sync
  ✓ oxygen-help

─────────────────────────────────────────────────────────

🔌 MCP SERVERS (.mcp.json)

  ✓ context7 (always included)
  [✓/- list of added servers based on tech stack]

─────────────────────────────────────────────────────────

🔗 CROSS-REPO INTEGRATION (if configured)

  Related Repos:
  [✓ list of related repos with roles and paths]

  Integration File: .claude/INTEGRATION.md

─────────────────────────────────────────────────────────

⚠️ ISSUES DISCOVERED

[List discovered issues, technical debt, risks]

─────────────────────────────────────────────────────────

💡 NEXT STEPS

1. Review CLAUDE.md for full analysis
2. Configure .mcp.json with correct credentials
3. Commit .claude/ and .mcp.json to git:
   git add .claude/ .mcp.json CLAUDE.md
   git commit -m "Add Oxygen context"

4. Create first task:
   "Run oxygen-new-task TASK-001 'Document system'"

5. Check status:
   "Run oxygen-status"

═══════════════════════════════════════════════════════════
```

---

## After Init

Your structure:

```
your-project/
├── CLAUDE.md                     ← Commit
├── .mcp.json                     ← Commit (MCP server config)
├── .claude/                      ← Commit (self-contained)
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   ├── templates/
│   └── *.md files
├── tasks/                        ← Commit
├── .oxygen-toolkit/              ← Don't commit
└── [your code]
```

Team members clone the project and get:
- All agents
- All skills
- All commands
- MCP server configuration
- Project documentation
- Ready to use!

---

## Using Components

```
"Use the backend-architect agent to design auth"
→ Claude reads .claude/agents/backend-architect/

"Run oxygen-new-task TASK-042 'Add OAuth'"
→ Claude reads .claude/commands/oxygen-new-task.md

"Follow dotnet skill for validation"
→ Claude reads .claude/skills/dotnet/SKILL.md
```

Everything is in .claude/, committed to git, available for the team!
```

---

## BEGIN ANALYSIS
