# oxygen-sync

**Synchronize cross-repo task context between related repositories**

---

## What Does It Do?

1. ✅ Reads `.claude/INTEGRATION.md` to find related repos
2. ✅ Synchronizes shared task files (PLAN.md, TASKS.md, CONTRACTS.md)
3. ✅ Generates and transfers HANDOFF.md when switching repos
4. ✅ Verifies that files are identical across repos
5. ✅ Reports sync status and next steps

---

## Usage

```
oxygen-sync <task-id> [options]
```

**Variants:**
```bash
# Sync shared files both ways (default)
oxygen-sync TASK-042

# Push this repo's changes to all related repos
oxygen-sync TASK-042 --to-all

# Pull from a specific repo
oxygen-sync TASK-042 --from=Backend

# Generate handoff and copy to target repo
oxygen-sync --handoff TASK-042 <target-repo-name>
```

---

## Prompt to Claude

```markdown
# OXYGEN-SYNC: Cross-Repo Task Synchronization

Synchronize task context across related repositories.

**Input:** TASK-[ID] [options]

---

## Phase 1: Detect Related Repos

### 1.1 Read Integration Config
```bash
cat .claude/INTEGRATION.md
```

- Identify this repo's name and role
- Find all related repositories with paths
- Verify that the paths exist on disk

### 1.2 Verify Repo Access

For each related repo:
```bash
# Verify path exists
ls -la [repo-path]

# Verify it is an Oxygen project
ls -la [repo-path]/.claude/INTEGRATION.md

# Verify tasks folder
ls -la [repo-path]/tasks/
```

**Error handling:**
- If path not found: Report error, continue with other repos
- If INTEGRATION.md is missing: Warn that repo is not configured

---

## Phase 2: Determine Action

Parse arguments and determine action:

### Option A: Default Sync (`oxygen-sync TASK-XXX`)

**Bidirectional sync** of shared files:
- Compare timestamps on files in all repos
- Newest version wins (based on git commit date or file mtime)
- Report conflicts if files diverge

### Option B: Push to All (`oxygen-sync TASK-XXX --to-all`)

**Unidirectional push** from this repo to all:
- Copy shared files from this repo to all related repos
- Overwrite older versions
- Report what was updated

### Option C: Pull from Specific (`oxygen-sync TASK-XXX --from=RepoName`)

**Unidirectional pull** from specific repo:
- Find repo path from INTEGRATION.md
- Copy shared files from that repo to this one
- Report what was updated

### Option D: Handoff (`oxygen-sync --handoff TASK-XXX TargetRepo`)

**Generate and transfer handoff:**
1. Generate HANDOFF.md in this repo's task folder (based on template)
2. Fill in with current context (branch, commits, changed files, status)
3. Copy HANDOFF.md to target repo's task folder
4. Also sync PLAN.md, TASKS.md, CONTRACTS.md to target

---

## Phase 3: Execute Sync

### 3.1 Files that are synced (identical copies)

These files should be identical in all repos:

| File | Sync direction | Description |
|------|---------------|-------------|
| `PLAN.md` | Bidirectional | Task plan |
| `TASKS.md` | Bidirectional | Task breakdown and progress |
| `CONTRACTS.md` | Bidirectional | API contracts and DTOs |

**Sync action per file:**
```bash
# Source: tasks/TASK-[ID]-[slug]/[FILE]
# Target: [repo-path]/tasks/TASK-[ID]-[slug]/[FILE]

# Create task folder in target if it doesn't exist
mkdir -p [repo-path]/tasks/TASK-[ID]-[slug]

# Copy file
cp tasks/TASK-[ID]-[slug]/[FILE] [repo-path]/tasks/TASK-[ID]-[slug]/[FILE]
```

### 3.2 Files that are transferred (directional)

| File | Direction | Description |
|------|---------|-------------|
| `HANDOFF.md` | Source → Target | Context handover |

### 3.3 Files that remain local

These files are NEVER synced:

| File | Reason |
|------|--------|
| `NOTES.md` | Repo-specific notes |
| `DECISIONS.md` | Repo-specific decisions |
| `TESTS.md` | Repo-specific test strategy |
| `REVIEW.md` | Repo-specific review |

---

## Phase 4: Verify

### 4.1 Compare Files

For each synced file, verify identical content:

```bash
# Compare with each related repo
diff tasks/TASK-[ID]-[slug]/PLAN.md [repo-path]/tasks/TASK-[ID]-[slug]/PLAN.md
diff tasks/TASK-[ID]-[slug]/TASKS.md [repo-path]/tasks/TASK-[ID]-[slug]/TASKS.md
diff tasks/TASK-[ID]-[slug]/CONTRACTS.md [repo-path]/tasks/TASK-[ID]-[slug]/CONTRACTS.md
```

### 4.2 Report Mismatches

If files don't match after sync:
- Show diff
- Ask user about action (overwrite / keep / merge manually)

---

## Phase 5: Report

```
═══════════════════════════════════════════════════════════
  OXYGEN SYNC COMPLETE
═══════════════════════════════════════════════════════════

📋 TASK: TASK-[ID]
📂 THIS REPO: [repo-name] ([role])

─────────────────────────────────────────────────────────

🔄 SYNC STATUS PER REPO:

[Related-Repo-1] ([path]):
  ✅ PLAN.md — synced
  ✅ TASKS.md — synced
  ✅ CONTRACTS.md — synced
  📝 HANDOFF.md — transferred (if applicable)

[Related-Repo-2] ([path]):
  ✅ PLAN.md — synced
  ⚠️ TASKS.md — conflict (manual merge needed)
  ✅ CONTRACTS.md — synced

─────────────────────────────────────────────────────────

📊 SUMMARY:
  Repos synced: X/Y
  Files synced: X
  Conflicts: X
  Handoffs: X

─────────────────────────────────────────────────────────

💡 NEXT STEPS:
  1. [Context-specific next step]
  2. [Context-specific next step]

═══════════════════════════════════════════════════════════
```

---

## Handoff Generation

When `--handoff` is used, generate HANDOFF.md with:

### Auto-populated Fields

Claude automatically fills in based on current context:

1. **From/To**: From INTEGRATION.md repo names
2. **What Was Done**: From TASKS.md (completed items) and git log
3. **Key Files Changed**: From `git diff --name-only [base-branch]...HEAD`
4. **Branch**: From `git branch --show-current`
5. **Last Commit**: From `git log -1 --oneline`
6. **Test Status**: From the latest test run if available
7. **What Needs To Be Done Next**: From TASKS.md (uncompleted items for target repo)
8. **API Details**: From CONTRACTS.md

### Template

Use `.claude/templates/task/HANDOFF.md` as the starting point.

```

---

## Examples

### Example 1: Initial sync after task creation

```
# In Backend repo, after oxygen-new-task
oxygen-sync TASK-042 --to-all

→ Copies PLAN.md, TASKS.md, CONTRACTS.md to Frontend repo
```

### Example 2: Handoff from Backend to Frontend

```
# In Backend repo, after implementation
oxygen-sync --handoff TASK-042 Frontend

→ Generates HANDOFF.md with backend context
→ Copies HANDOFF.md + synced files to Frontend
```

### Example 3: Sync progress back

```
# In Frontend repo, after partial implementation
oxygen-sync TASK-042 --to-all

→ Updates TASKS.md in Backend repo with frontend progress
```

### Example 4: Pull latest from Backend

```
# In Frontend repo
oxygen-sync TASK-042 --from=Backend

→ Fetches updated CONTRACTS.md and TASKS.md from Backend
```
