# oxygen-new-task

**Create new task with complete structure**

---

## Usage

```
oxygen-new-task <task-id> <description> [--cross-repo]
```

**Examples:**
```
oxygen-new-task TASK-042 "Customer portal with order history"
oxygen-new-task TASK-042 "Order system API + frontend" --cross-repo
```

---

## Prompt to Claude

```markdown
# OXYGEN-NEW-TASK: Create Task Structure

Create new task structure for: **TASK-[ID]: [Description]**

## Step 1: Create Directory Structure

```bash
mkdir -p tasks/TASK-[ID]-[slug]
```

## Step 2: Generate PLAN.md (USE OPUS!)

**IMPORTANT: Switch to Opus 4.5 for planning**

Based on `.claude/PROJECT.md`, `.claude/ARCHITECTURE.md`, and task description, create:

```markdown
# TASK-[ID]: [Name]

**Status:** Planning
**Created:** [Date]
**Assigned:** [Name]
**Cross-Repo:** true/false
**Affected Repos:** [Backend, Frontend, ...]
**Primary Repo:** [repo-name]

## Goal
[Concrete business value]

## Success Criteria
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

## Scope
**In scope:**
- [Specific functionality]

**Out of scope:**
- [Explicit exclusions]

## Technical Approach

### Backend Changes
**Services:**
- [Service name]: [Changes]

**Database:**
- Tables: [New/modified]
- Migrations: [Description]

**APIs:**
- [Endpoint]: [Purpose]

### Frontend Changes
**Components:**
- [Component]: [Responsibility]

**State:**
- [Store]: [Changes]

**Routes:**
- [Route]: [Purpose]

## Affected Systems
- [ ] [Service 1]
- [ ] [Service 2]

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | High/Med/Low | [Strategy] |

## Dependencies
- TASK-XXX: [Dependency]

## Timeline
**Estimate:** X days

**Breakdown:**
- Planning: Y hours
- Backend: Z hours
- Frontend: W hours
- Testing: V hours

## Implementation Order
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Cross-Repo Integration (if --cross-repo)

### Repo Responsibilities
| Repo | Responsibility | Order |
|------|---------------|-------|
| [Backend] | [API endpoints, business logic] | 1 |
| [Frontend] | [UI components, API integration] | 2 |

### Implementation Sequence
1. [Repo 1]: [What to implement first]
2. [Repo 2]: [What to implement after handoff]

### Handoff Points
- After [milestone]: Handoff from [Repo 1] → [Repo 2]
```

## Step 2.5: Generate CONTRACTS.md (if --cross-repo)

**Only if `--cross-repo` and `.claude/INTEGRATION.md` exists.**

Use template from `.claude/templates/task/CONTRACTS.md`.

Fill in with:
- Metadata (status: Draft, affected repos from INTEGRATION.md)
- New endpoints (based on PLAN.md API section)
- Shared DTOs in both TypeScript and C# format
- Agreements checklist with all affected repos

```markdown
# See templates/task/CONTRACTS.md for full structure
```

## Step 3: Create CONTEXT.md

```markdown
# TASK-[ID] Context

## Background
[Why this task exists]

## User Story
**As a** [role]
**I want** [feature]
**So that** [benefit]

## Current State
[How it works now]

## Desired State
[How it should work]

## Stakeholders
- Product Owner: [Name]
- Developer: [Name]
```

## Step 3.5: Create HANDOFF.md Template (if --cross-repo)

**Only if `--cross-repo`.**

Copy template from `.claude/templates/task/HANDOFF.md` to the task folder.
This file is filled in later via `oxygen-sync --handoff` when implementation is ready.

```bash
cp .claude/templates/task/HANDOFF.md tasks/TASK-[ID]-[slug]/HANDOFF.md
```

## Step 4: Create TASKS.md

```markdown
# TASK-[ID]: Task Breakdown

**Status:** 🟡 In Progress
**Progress:** ✅ 0/0 tasks

## Backend
- [ ] Setup
- [ ] Domain models
- [ ] Business logic
- [ ] API endpoints
- [ ] Tests

## Frontend
- [ ] Components
- [ ] State management
- [ ] API integration
- [ ] Tests

## Cross-Repo (if --cross-repo)
- [ ] Contracts agreed (CONTRACTS.md status: Agreed)
- [ ] Handoff completed (from primary repo)
- [ ] All repos implemented
- [ ] Integration test passed
- [ ] Final sync (`oxygen-sync TASK-[ID]`)

## Current Focus
[What we're working on]
```

## Step 5: Create Empty Templates

Create with template content:
- `DECISIONS.md` - For ADRs
- `TESTS.md` - Test strategy
- `NOTES.md` - Daily logs
- `REVIEW.md` - Review checklist

## Step 6: Update Project Status & Cross-Repo Sync

Add to project tracking if exists.

**If --cross-repo:** Automatically run sync to related repos:
```bash
# Push task structure to all related repos
oxygen-sync TASK-[ID] --to-all
```

This copies PLAN.md, TASKS.md, and CONTRACTS.md to all related repos' `tasks/TASK-[ID]-[slug]/` folders.

## Output

Confirm:
✅ Task structure created: `tasks/TASK-[ID]-[slug]/`
✅ PLAN.md generated (with Opus)
✅ All templates ready
✅ Ready for implementation

**If --cross-repo, add:**
✅ CONTRACTS.md generated (API contracts)
✅ HANDOFF.md template ready
✅ Task synced to related repos: [list]

**Next steps:**
1. Review PLAN.md
2. Review CONTRACTS.md (if cross-repo) — get agreement from all repos
3. Switch to Sonnet for implementation
4. Start first task from TASKS.md
5. When ready for next repo: `oxygen-sync --handoff TASK-[ID] <target-repo>`
```

---

## After Running

```bash
cd tasks/TASK-042-customer-portal

# Review the plan (Opus created it)
cat PLAN.md

# Start implementation (Sonnet)
# Claude will now follow PLAN.md
```
