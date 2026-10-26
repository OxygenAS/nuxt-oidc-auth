# oxygen-help

**Get help with Oxygen commands**

---

## All Oxygen Commands

### Project Setup
- `oxygen-init` - Analyze and initialize Oxygen structure (single repo)
- `oxygen-init-parent` - Initialize multi-repo project from parent folder (parallel agents)
- `oxygen-status` - Get project status overview

### Task Management
- `oxygen-new-task <id> <description>` - Create new task
- `oxygen-review-task <id>` - Review task for completion

### Cross-Repo
- `oxygen-sync <task-id> [--to-all|--from=<repo>]` - Sync task context across repos
- `oxygen-sync --handoff <task-id> <target-repo>` - Transfer context to another repo

### Development
- `oxygen-debug [type]` - Debug assistance
- `oxygen-help` - This help

---

## Quick Start

```bash
# 1. Initialize project
oxygen-init

# 2. Create first task
oxygen-new-task TASK-001 "Initial setup"

# 3. Check status
oxygen-status

# 4. When done, review
oxygen-review-task TASK-001
```

---

## Workflow

### Single-Repo
```
oxygen-init
    ↓
oxygen-new-task (uses Opus for planning)
    ↓
[Implementation with Sonnet]
    ↓
oxygen-review-task
    ↓
[Merge if approved]
```

### Multi-Repo (from parent folder)
```
oxygen-init-parent (discovers repos, parallel init, cross-links all)
    ↓
oxygen-new-task --cross-repo (creates task + contracts, delegates to repos)
    ↓
oxygen-sync TASK-XXX --to-all (push to all repos)
    ↓
[Implement in primary repo]
    ↓
oxygen-sync --handoff TASK-XXX <target> (transfer context)
    ↓
[Switch to target repo, implement from handoff]
    ↓
oxygen-sync TASK-XXX (sync progress back)
    ↓
oxygen-review-task (in each repo)
```

### Cross-Repo (from within a repo)
```
oxygen-init (configure related repos manually)
    ↓
oxygen-new-task --cross-repo (creates task + contracts)
    ↓
(same workflow as above)
```

---

## Model Selection

- **Opus:** Planning (oxygen-new-task), initialization (oxygen-init, oxygen-init-parent)
- **Sonnet:** Implementation, review, debug

---

## Getting Help

Each command has detailed documentation:

```
# View command details
cat .oxygen-toolkit/commands/oxygen-init.md
cat .oxygen-toolkit/commands/oxygen-new-task.md
```

---

## Support

- Documentation: `.oxygen-toolkit/README.md`
- Setup Guide: `.oxygen-toolkit/SETUP.md`
- Quick Start: `.oxygen-toolkit/QUICKSTART.md`
