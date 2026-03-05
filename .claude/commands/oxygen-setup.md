# oxygen-setup

**Configure Oxygen Toolkit integration in global Claude settings**

---

## What It Does

This command configures your global Claude Code settings to recognize and use the Oxygen Toolkit from any folder. It's typically run once after cloning the toolkit to a new machine.

---

## Usage

From the Oxygen Toolkit directory:

```
Run oxygen-setup
```

Or run the PowerShell/bash scripts directly:

```bash
# Windows (PowerShell)
.\setup-toolkit.ps1

# Linux/Mac/Git Bash
./setup-toolkit.sh
```

---

## Prompt to Claude

```markdown
# OXYGEN-SETUP: Configure Global Toolkit Integration

Configure the Oxygen AI Toolkit for use from any folder.

## PHASE 1: DETECT LOCATIONS

### 1.1 Find Toolkit Location
Determine the absolute path to the Oxygen Toolkit:
- Check current working directory
- Look for toolkit markers (agents/, skills/, commands/ directories)
- Confirm this is the toolkit root

### 1.2 Find Global Claude Directory
Locate the user's global .claude directory:
- Windows: `C:\Users\<username>\.claude`
- Linux/Mac: `~/.claude`

Verify it exists. If not, inform user that Claude Code must be installed first.

## PHASE 2: CHECK EXISTING CONFIGURATION

### 2.1 Check CLAUDE.md
Read `~/.claude/CLAUDE.md` (or equivalent on Windows)

Check if "## Oxygen Toolkit Integration" or "## File Operation Rules" sections already exist:
- If EITHER exists: Ask user if they want to update
- If NEITHER exists: Proceed to add them

### 2.2 Check Commands Directory
Check if `~/.claude/commands/` exists:
- If it's a junction/symlink to the toolkit: Warn that it will be replaced with a real directory
- If it's a real directory: Keep it
- If it doesn't exist: Will create it

## PHASE 3: UPDATE GLOBAL CLAUDE.MD

### 3.1 Remove Existing Sections (if updating)
If updating, remove these sections (from their ## heading to the next ## heading or end of file):
- "## File Operation Rules" (if it exists)
- "## Oxygen Toolkit Integration" (if it exists)

**Important**: Only match level-2 headings (`## `) as section boundaries, not level-3 (`### `) which are subsections within.

### 3.2 Add File Operation Rules Section

First, add general file operation rules to prevent common issues:

```markdown

## File Operation Rules

- **NEVER create files named `nul`** - this is the Windows null device, not a file
- **NEVER redirect output to `/dev/null` in bash commands on Windows** - this creates a literal `nul` file. Use `| Out-Null` in PowerShell or simply omit the redirection
- Before reading/writing files, verify paths exist:
  - Use `test -f <file>` or `test -d <dir>` to check existence
  - Use `ls` or `dir` to verify paths before operations
  - Handle missing files/folders gracefully with proper error messages
- When a file or folder doesn't exist, report the error to the user - don't create placeholder files

```

### 3.3 Add Oxygen Toolkit Integration Section

Append the following to CLAUDE.md (replace <TOOLKIT_PATH> with the actual detected path):

```markdown

## Oxygen Toolkit Integration

The Oxygen AI Toolkit is a versioned repository located at: `<TOOLKIT_PATH>`

### Available Resources

When the user references Oxygen commands, agents, skills, or templates, look for them in the toolkit directory:

- **Commands**: `<TOOLKIT_PATH>/commands/`
  - oxygen-init, oxygen-new-task, oxygen-sync, oxygen-review-task, oxygen-status, oxygen-debug, oxygen-help, oxygen-setup
  - When user says "Run oxygen-[command]", read and execute the corresponding .md file from this directory

- **Agents**: `<TOOLKIT_PATH>/agents/`
  - backend-architect, api-developer, frontend-developer, cms-specialist, test-engineer, code-reviewer, devops-engineer
  - When user says "Use the [agent-name] agent", read the config.json and instructions.md from the agent's subdirectory

- **Skills**: `<TOOLKIT_PATH>/skills/`
  - dotnet, vue-nuxt, umbraco, medusajs, azure-infra, testing
  - Referenced automatically by agents or when user mentions a specific skill

- **Templates**: `<TOOLKIT_PATH>/templates/`
  - Project and task templates for documentation structure

### Dynamic Updates

The toolkit is a git repository that receives updates. Always read from the toolkit directory directly - this ensures any new commands, agents, or skills added to the toolkit are immediately available without manual configuration.

### Custom Commands

For user-specific commands not part of the toolkit, use: `~/.claude/commands/`

Custom commands take precedence over toolkit commands if there's a name conflict.

```

## PHASE 4: ADD SETTINGS.JSON CONFIGURATION

Check if `~/.claude/settings.json` exists. If it does, verify it's valid JSON. The file operation rules are documented in CLAUDE.md and don't require settings.json changes.

## PHASE 5: SETUP COMMANDS DIRECTORY

### 4.1 Handle Existing Junction/Symlink
If `~/.claude/commands/` is a junction or symlink:
1. Remove it (using appropriate method for OS)
2. Create a real directory in its place

### 4.2 Create Directory if Missing
If `~/.claude/commands/` doesn't exist:
- Create the directory

## PHASE 6: VERIFICATION

Verify the setup:

```bash
# Check CLAUDE.md was updated
cat ~/.claude/CLAUDE.md | grep "Oxygen Toolkit Integration"

# Check commands directory exists and is real (not a link)
ls -la ~/.claude/ | grep commands

# Verify toolkit commands are accessible
ls <TOOLKIT_PATH>/commands/
```

## PHASE 7: OUTPUT REPORT

```
═══════════════════════════════════════════════════════════
  OXYGEN TOOLKIT SETUP COMPLETE
═══════════════════════════════════════════════════════════

✓ Toolkit Location: <TOOLKIT_PATH>
✓ Global Claude Directory: ~/.claude/
✓ CLAUDE.md Updated
✓ Commands Directory Ready

─────────────────────────────────────────────────────────

Available Oxygen Commands:
  ✓ oxygen-init          - Initialize project with Oxygen
  ✓ oxygen-new-task      - Create new task
  ✓ oxygen-sync          - Cross-repo task sync
  ✓ oxygen-review-task   - Review task quality
  ✓ oxygen-status        - Project status
  ✓ oxygen-debug         - Debugging help
  ✓ oxygen-setup         - This setup command
  ✓ oxygen-help          - Command reference

Available Agents (7):
  ✓ backend-architect, api-developer, frontend-developer
  ✓ cms-specialist, test-engineer, code-reviewer
  ✓ devops-engineer

Available Skills (6):
  ✓ dotnet, vue-nuxt, umbraco, medusajs
  ✓ azure-infra, testing

─────────────────────────────────────────────────────────

💡 NEXT STEPS

You can now use Oxygen from any folder:

  cd /path/to/your/project
  "Run oxygen-init"

Custom commands location:
  ~/.claude/commands/

To update toolkit:
  cd <TOOLKIT_PATH>
  git pull

═══════════════════════════════════════════════════════════
```

## BEGIN SETUP
```

---

## Notes

- Run this once per machine after cloning the toolkit
- Safe to run multiple times (will ask before updating)
- Works on Windows, Linux, and Mac
- Automatically detects toolkit location
- Preserves existing custom commands
