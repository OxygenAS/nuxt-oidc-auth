# oxygen-update

**Update Oxygen Toolkit components in current project**

---

## What It Does

Refreshes agents, skills, commands, and templates in the current project's `.claude/` directory from the latest toolkit version.

Use this after updating the toolkit repository to get new features in existing projects.

---

## Usage

From the root of a project that has already been initialized with oxygen-init:

```
Run oxygen-update
```

---

## When to Use

- After running `git pull` in the toolkit repository
- When new agents, skills, or commands are added to the toolkit
- To get bug fixes or improvements in existing toolkit components
- To sync toolkit versions across multiple projects

---

## What Gets Updated

✅ Agents (``.claude/agents/``)
✅ Skills (``.claude/skills/``)
✅ Commands (``.claude/commands/``)
✅ Templates (``.claude/templates/``)

**Not updated (preserved):**
- Project-specific documentation (PROJECT.md, CONVENTIONS.md, etc.)
- CLAUDE.md
- Tasks directory
- Any custom modifications you made

---

## Prompt to Claude

```markdown
# OXYGEN-UPDATE: Refresh Toolkit Components

Update Oxygen Toolkit components in this project from the latest toolkit version.

## PHASE 1: LOCATE TOOLKIT

### 1.1 Find Toolkit Location

Check multiple locations in order:

1. **Global CLAUDE.md reference**: Read `~/.claude/CLAUDE.md`
   - Look for "## Oxygen Toolkit Integration" section
   - Extract toolkit path from "located at: `<path>`"

2. **Local .oxygen-toolkit**: Check if `.oxygen-toolkit/` exists in current directory or parent directories

3. **Environment variable**: Check `$OXYGEN_TOOLKIT_PATH` or `$env:OXYGEN_TOOLKIT_PATH`

4. **Common locations**:
   - `~/oxygen-toolkit`
   - `C:\Tools\oxygen-toolkit`
   - `S:\Solutions\Oxygen_AI_ToolKit`

If not found, ask user for toolkit location.

### 1.2 Verify Toolkit

Verify the found path contains:
- `agents/` directory
- `skills/` directory
- `commands/` directory
- `templates/` directory

If not valid, report error and ask user for correct path.

## PHASE 2: VERIFY PROJECT STRUCTURE

### 2.1 Check Current Directory

Verify this is a project initialized with oxygen-init:
- `.claude/` directory exists
- `.claude/agents/` exists
- `.claude/skills/` exists
- `.claude/commands/` exists

If not found, inform user that oxygen-init must be run first.

### 2.2 Backup Check (Optional)

Ask user: "Do you want to backup existing .claude/ before updating? (Recommended if you have custom modifications)"

If yes, create backup:
```bash
cp -r .claude .claude.backup.$(date +%Y%m%d-%H%M%S)
```

## PHASE 3: UPDATE TOOLKIT COMPONENTS

### 3.1 Update Agents

```bash
# Remove old agents
rm -rf .claude/agents/*

# Copy latest agents from toolkit
cp -r $TOOLKIT_PATH/agents/* .claude/agents/
```

List updated agents:
```bash
ls .claude/agents/
```

### 3.2 Update Skills

```bash
# Remove old skills
rm -rf .claude/skills/*

# Copy latest skills from toolkit
cp -r $TOOLKIT_PATH/skills/* .claude/skills/
```

List updated skills:
```bash
ls .claude/skills/
```

### 3.3 Update Commands

```bash
# Remove old commands
rm -rf .claude/commands/*

# Copy latest commands from toolkit
cp -r $TOOLKIT_PATH/commands/* .claude/commands/
```

List updated commands:
```bash
ls .claude/commands/
```

### 3.4 Update Templates

```bash
# Remove old templates
rm -rf .claude/templates/*

# Copy latest templates from toolkit
cp -r $TOOLKIT_PATH/templates/* .claude/templates/
```

## PHASE 4: UPDATE README

### 4.1 Update .claude/README.md

If `.claude/README.md` exists, update the component lists to reflect current toolkit:

- Update agent list in "### Agents" section
- Update skill list in "### Skills" section
- Update command list in "### Commands" section

Preserve any custom content.

## PHASE 5: VERIFICATION

Verify update success:

```bash
# Check all directories exist and have content
ls -la .claude/agents/ | head -10
ls -la .claude/skills/ | head -10
ls -la .claude/commands/ | head -10
ls -la .claude/templates/

# Verify toolkit version (if VERSION file exists)
cat $TOOLKIT_PATH/VERSION 2>/dev/null || echo "Version file not found"
```

## PHASE 6: GIT STATUS

Show what changed:

```bash
git status .claude/
git diff --stat .claude/
```

## PHASE 7: OUTPUT REPORT

```
═══════════════════════════════════════════════════════════
  OXYGEN TOOLKIT UPDATE COMPLETE
═══════════════════════════════════════════════════════════

📦 TOOLKIT SOURCE

Location: $TOOLKIT_PATH
Version: [if available]

─────────────────────────────────────────────────────────

✓ COMPONENTS UPDATED

Agents (X total):
  [list of agent names]

Skills (X total):
  [list of skill names]

Commands (X total):
  [list of command names]

Templates:
  [list of template directories]

─────────────────────────────────────────────────────────

📝 PRESERVED (NOT UPDATED)

✓ CLAUDE.md
✓ .claude/PROJECT.md
✓ .claude/CONVENTIONS.md
✓ .claude/ARCHITECTURE.md
✓ .claude/INTEGRATION.md
✓ tasks/ directory

─────────────────────────────────────────────────────────

📊 GIT STATUS

[show git diff summary]

─────────────────────────────────────────────────────────

💡 NEXT STEPS

1. Review changes:
   git diff .claude/

2. Test updated components:
   "Run oxygen-status"
   "Use the backend-architect agent"

3. Commit if satisfied:
   git add .claude/
   git commit -m "Update Oxygen toolkit components"

4. Or restore backup if needed:
   rm -rf .claude
   mv .claude.backup.YYYYMMDD-HHMMSS .claude

═══════════════════════════════════════════════════════════
```

## IMPORTANT NOTES

- **Custom modifications**: If you've customized agents/skills/commands in .claude/, those changes will be overwritten. Back them up first!
- **Project-specific docs**: Your PROJECT.md, CONVENTIONS.md, and other project docs are NOT touched
- **Tasks**: The tasks/ directory is never modified
- **CLAUDE.md**: Root CLAUDE.md is preserved
- **Safe to run multiple times**: Can be run whenever you update the toolkit

## BEGIN UPDATE
```

---

## Examples

```bash
# Update toolkit first
cd ~/oxygen-toolkit
git pull

# Then update project
cd ~/my-project
# In Claude:
"Run oxygen-update"

# Review and commit
git diff .claude/
git add .claude/
git commit -m "Update Oxygen toolkit to latest version"
```

---

## Comparison

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `oxygen-init` | Initialize new project | First time setup |
| `oxygen-update` | Refresh toolkit components | After toolkit updates |
| `oxygen-setup` | Configure global integration | Once per machine |

---

## Notes

- Run this from the project root (where .claude/ exists)
- Always check `git diff` before committing updates
- Consider backing up if you have custom modifications
- Safe to run multiple times
