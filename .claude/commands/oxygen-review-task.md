# oxygen-review-task

**Review task for completion**

---

## Usage

```
oxygen-review-task TASK-<id>
```

**Example:**
```
oxygen-review-task TASK-042
```

---

## Prompt to Claude

```markdown
# OXYGEN-REVIEW-TASK: Comprehensive Task Review

Review task: **TASK-[ID]**

## Phase 1: Documentation Review

### 1.1 Check TASKS.md Status
- [ ] All tasks marked complete?
- [ ] No pending items?
- [ ] Current focus cleared?

### 1.2 Review NOTES.md
- [ ] Learnings documented?
- [ ] Issues resolved?
- [ ] No open questions?

### 1.3 Verify DECISIONS.md
- [ ] All architectural decisions documented?
- [ ] ADRs complete?
- [ ] Rationale clear?

## Phase 2: Code Quality Review

Run through `.claude/CONVENTIONS.md` checklist:

### Backend Code
- [ ] Follows naming conventions?
- [ ] Proper error handling?
- [ ] Logging implemented?
- [ ] No hardcoded values?
- [ ] Async/await correct?

### Frontend Code
- [ ] BEM naming followed?
- [ ] TypeScript strict mode?
- [ ] Props validated?
- [ ] Responsive design?

## Phase 2.5: Cross-Repo Review (if cross-repo task)

**Only if task has `Cross-Repo: true` in PLAN.md and `.claude/INTEGRATION.md` exists.**

### Contract Compliance
- [ ] CONTRACTS.md status is "Agreed" or "Implemented"?
- [ ] All endpoints in CONTRACTS.md are implemented?
- [ ] Request/response shapes match CONTRACTS.md?
- [ ] DTOs match between TypeScript and C# definitions?
- [ ] Error responses follow the agreed format?

### Integration Verification
- [ ] Endpoints can be called from the related repo?
- [ ] Auth tokens are exchanged correctly?
- [ ] CORS configuration allows cross-repo calls?
- [ ] Response DTOs can be deserialized in the consuming repo?

### Sync Status
- [ ] All shared files synced (`oxygen-sync TASK-[ID]`)?
- [ ] No pending handoffs?
- [ ] TASKS.md progress consistent across repos?
- [ ] CONTRACTS.md identical in all repos?

## Phase 3: Testing Review

Check TESTS.md and actual tests:

### Test Coverage
- [ ] Unit tests exist?
- [ ] Coverage >80%?
- [ ] Integration tests?
- [ ] E2E tests for critical paths?

### Test Quality
- [ ] Tests pass?
- [ ] No flaky tests?
- [ ] Edge cases covered?

## Phase 4: Security Review

- [ ] Input validation?
- [ ] Authentication correct?
- [ ] Authorization enforced?
- [ ] No secrets in code?
- [ ] SQL injection prevented?
- [ ] XSS protection?

## Phase 5: Performance Review

- [ ] No N+1 queries?
- [ ] Proper indexes?
- [ ] Caching where appropriate?
- [ ] Response times acceptable?

## Phase 6: Documentation Review

- [ ] PLAN.md matches implementation?
- [ ] API docs updated?
- [ ] Comments on complex logic?
- [ ] README updated if needed?

## Phase 7: Deployment Readiness

- [ ] Migrations ready?
- [ ] Config documented?
- [ ] Rollback plan exists?
- [ ] Monitoring configured?

## Output Report

Provide:

### ✅ Approved Items
[List what passed review]

### ⚠️ Issues Found
| Severity | Issue | Location | Fix |
|----------|-------|----------|-----|
| Critical | [Issue] | [File:line] | [How to fix] |
| Major | [Issue] | [File:line] | [How to fix] |
| Minor | [Issue] | [File:line] | [How to fix] |

### 📋 Checklist Status
- Code Quality: [X/Y] ✅
- Testing: [X/Y] ✅
- Security: [X/Y] ✅
- Documentation: [X/Y] ✅

### 🎯 Recommendation
- [ ] ✅ **APPROVED** - Ready to merge
- [ ] ⚠️ **CHANGES REQUESTED** - See issues above
- [ ] ❌ **REJECTED** - Major issues found

### Next Steps
[Specific actions needed]
```

---

## After Review

Based on result:

**If Approved:**
```bash
# Mark task complete
# Merge to main
# Archive task
```

**If Changes Requested:**
```bash
# Address issues
# Re-run oxygen-review-task
```
