# oxygen-bug

**Create lightweight bug fix structure (minimal docs)**

---

## Usage

```
oxygen-bug <bug-id> "<description>"
```

**Examples:**
```
oxygen-bug BUG-001 "Prettier formatting errors in facet components"
oxygen-bug BUG-012 "Cart total shows NaN when quantity is empty"
oxygen-bug BUG-033 "Missing null check in useCheckout causes crash on empty address"
```

---

## Prompt to Claude

```markdown
# OXYGEN-BUG: Create Lightweight Bug Fix Structure

Create a minimal bug fix structure for: **BUG-[ID]: [Description]**

This is a **lightweight** format for small, focused bug fixes. No cross-repo overhead, no ADRs, no handoff docs.

## Step 1: Create Directory

```bash
mkdir -p bugs/BUG-[ID]-[slug]
```

**Note:** Uses `bugs/` folder, NOT `tasks/`. Keep it separate from feature work.

## Step 2: Generate CONTEXT.md

Investigate the bug first. Read relevant code, understand the issue, then write:

```markdown
# BUG-[ID]: [Short description]

**Status:** Open
**Created:** [Date]
**Severity:** Low / Medium / High / Critical
**Repo:** [Which repo this bug lives in]

## Bug Description
[What's wrong — concrete, observable behavior]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Expected: ...]
4. [Actual: ...]

## Root Cause
[After investigation — why is this happening?]

## Affected Files
- `path/to/file.vue` — [what's wrong here]
- `path/to/other.js` — [what's wrong here]
```

## Step 3: Generate PLAN.md

Keep it short and direct. No architecture diagrams, no risk matrices.

```markdown
# BUG-[ID]: Fix Plan

## The Fix
[1-3 sentences describing what needs to change]

## Changes
- [ ] `path/to/file.ext` — [what to change]
- [ ] `path/to/other.ext` — [what to change]

## Verification
- [ ] [How to verify the fix works]
- [ ] [Any regression to check]
```

## Step 4: Generate TESTS.md

Only if there are specific things to test. Keep it minimal.

```markdown
# BUG-[ID]: Test Checklist

- [ ] Bug no longer reproduces with original steps
- [ ] [Related functionality still works]
- [ ] [Edge case if relevant]
```

## Step 5: Confirm

```
═════════════════════════════════════
  BUG CREATED
═════════════════════════════════════

🐛 BUG-[ID]: [Description]
📁 bugs/BUG-[ID]-[slug]/
📄 CONTEXT.md — Bug details & root cause
📄 PLAN.md — Fix checklist
📄 TESTS.md — Verification steps

💡 Next: Review PLAN.md, then fix it.
═════════════════════════════════════
```
```

---

## After Running

```bash
# Review the bug analysis
cat bugs/BUG-001-prettier-errors/CONTEXT.md

# Check the fix plan
cat bugs/BUG-001-prettier-errors/PLAN.md

# Fix it, then check off TESTS.md
```

## Commit Format

```
BUG-XXX: Description of fix
```
