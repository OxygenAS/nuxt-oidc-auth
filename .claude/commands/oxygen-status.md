# oxygen-status

**Get project and task status overview**

---

## Usage

```
oxygen-status
```

---

## Prompt to Claude

```markdown
# OXYGEN-STATUS: Project Status Overview

Provide comprehensive status of this Oxygen project.

## 1. Project Health Check

### Structure Verification
- [ ] `.claude/PROJECT.md` exists and current?
- [ ] `.claude/CONVENTIONS.md` accurate?
- [ ] `.claude/ARCHITECTURE.md` up to date?
- [ ] `CLAUDE.md` exists?
- [ ] `tasks/` directory exists?

### Documentation Health
- [ ] Recent updates (< 30 days)?
- [ ] No TODO placeholders?
- [ ] Aligned with code?

## 2. Active Tasks

List all tasks in `tasks/`:

| Task ID | Name | Status | Progress | Blockers |
|---------|------|--------|----------|----------|
| TASK-001 | [...] | 🟡 In Progress | 12/20 | None |
| TASK-002 | [...] | ✅ Complete | 15/15 | - |
| TASK-003 | [...] | 🔴 Blocked | 5/18 | Waiting for API |

### Summary
- 🟢 Complete: X tasks
- 🟡 In Progress: Y tasks
- 🔴 Blocked: Z tasks
- ⬜ Not Started: W tasks

## 2.5 Cross-Repo Task Status

**Only if `.claude/INTEGRATION.md` exists.**

Read INTEGRATION.md and check all related repos for cross-repo tasks.

### Cross-Repo Tasks

| Task ID | Name | Repos | This Repo | Other Repos | Last Synced |
|---------|------|-------|-----------|-------------|-------------|
| TASK-XXX | [...] | Backend, Frontend | 🟡 In Progress | 🟢 Complete | [date] |

### Sync Status
- [ ] All shared files synced across repos?
- [ ] CONTRACTS.md up to date and agreed?
- [ ] Pending handoffs?
- [ ] TASKS.md progress consistent?

**Check for each related repo:**
```bash
# Compare synced files
diff tasks/TASK-XXX/PLAN.md [repo-path]/tasks/TASK-XXX/PLAN.md
diff tasks/TASK-XXX/CONTRACTS.md [repo-path]/tasks/TASK-XXX/CONTRACTS.md
```

## 3. Tech Stack Status

From `.claude/DEPENDENCIES.md`:

### Outdated Dependencies
[Check for outdated packages]

### Security Vulnerabilities
[Check for known vulnerabilities]

### Version Mismatches
[Check for version inconsistencies]

## 4. Code Quality Metrics

### Test Coverage
```
Overall: XX%
Backend: YY%
Frontend: ZZ%
```

### Recent Changes
```
Last commit: [date]
Files changed: [count]
Lines added/removed: [stats]
```

## 5. Known Issues

From task NOTES.md and DECISIONS.md:

### Open Questions
- [Question 1]
- [Question 2]

### Technical Debt
- [Debt item 1]
- [Debt item 2]

### Blockers
- [Blocker 1]
- [Blocker 2]

## 6. Recommendations

### Immediate Actions
- [ ] [Action 1]
- [ ] [Action 2]

### This Week
- [ ] [Action 3]
- [ ] [Action 4]

### This Month
- [ ] [Action 5]
- [ ] [Action 6]

## Output Format

```
═══════════════════════════════════════
  OXYGEN PROJECT STATUS
═══════════════════════════════════════

📊 PROJECT HEALTH: [Healthy/Warning/Critical]

📁 STRUCTURE: ✅ Complete
📝 DOCUMENTATION: ⚠️ Needs update
🔧 DEPENDENCIES: ✅ Current

─────────────────────────────────────

📋 ACTIVE TASKS: 5
   🟢 Complete: 2
   🟡 In Progress: 2
   🔴 Blocked: 1

─────────────────────────────────────

⚠️ ATTENTION NEEDED:
   • Update ARCHITECTURE.md (30 days old)
   • TASK-003 blocked on external API
   • 3 dependencies have updates available

─────────────────────────────────────

🔗 CROSS-REPO STATUS: (if configured)
   Tasks spanning repos: X
   All synced: ✅/⚠️
   Pending handoffs: X
   Contracts status: [Draft/Agreed/Implemented]

─────────────────────────────────────

💡 NEXT ACTIONS:
   1. Review blocked task TASK-003
   2. Update architecture docs
   3. Run dependency updates

═══════════════════════════════════════
```
```

---

## Quick Status

For quick check:
```
oxygen-status --quick
```

Shows just:
- Active tasks count
- Blocker count
- Health indicator
