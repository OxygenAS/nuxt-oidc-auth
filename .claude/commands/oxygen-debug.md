# oxygen-debug

**Debug help for common issues**

---

## Usage

```
oxygen-debug [issue-type]
```

**Examples:**
```
oxygen-debug
oxygen-debug api-error
oxygen-debug database
oxygen-debug frontend
```

---

## Prompt to Claude

```markdown
# OXYGEN-DEBUG: Intelligent Debugging Assistant

Help debug issue: [description or type]

## Phase 1: Gather Context

### 1.1 Error Information
- Error message: [paste]
- Stack trace: [paste]
- When it occurs: [describe]
- Steps to reproduce: [list]

### 1.2 Environment
- Local/Staging/Production?
- Recent changes?
- Related deployments?

### 1.3 Relevant Files
Identify files related to error based on stack trace.

## Phase 2: Analyze Based on Type

### If API Error:
1. Check endpoint in code
2. Review error handling
3. Check authentication/authorization
4. Verify data validation
5. Check database queries
6. Review external API calls

### If Database Error:
1. Check migrations
2. Review entity configurations
3. Verify connection strings
4. Check for N+1 queries
5. Review indexes
6. Check for deadlocks

### If Frontend Error:
1. Check component code
2. Review state management
3. Verify API integration
4. Check for null references
5. Review event handlers
6. Check browser console

### If Performance Issue:
1. Profile hot paths
2. Check database queries
3. Review caching
4. Check for memory leaks
5. Review async patterns

## Phase 3: Root Cause Analysis

Use `.claude/ARCHITECTURE.md` and `CLAUDE.md` to understand:
- Expected behavior
- Actual behavior
- Why discrepancy exists

### Hypothesis
[What likely causes the issue]

### Evidence
[Supporting evidence from code/logs]

### Confidence
[High/Medium/Low]

## Phase 4: Solution Proposal

### Quick Fix (< 1 hour)
```
[Immediate workaround]
```

### Proper Fix (< 1 day)
```
[Correct solution]
```

### Long-term (> 1 day)
```
[Architectural fix if needed]
```

## Phase 5: Prevention

To prevent similar issues:
- [ ] Add test case
- [ ] Update documentation
- [ ] Add validation
- [ ] Improve error handling
- [ ] Add monitoring

## Output Format

```
═══════════════════════════════════════
  OXYGEN DEBUG REPORT
═══════════════════════════════════════

🔍 ISSUE: [Description]

📊 ROOT CAUSE: [Identified cause]
   Confidence: [High/Medium/Low]

─────────────────────────────────────

⚡ QUICK FIX (Now):
   [Immediate solution]

🔧 PROPER FIX (Today):
   [Correct solution with code]

🏗️ LONG-TERM (Later):
   [Architectural improvements]

─────────────────────────────────────

🛡️ PREVENTION:
   • [Test to add]
   • [Doc to update]
   • [Monitoring to add]

═══════════════════════════════════════
```

## Common Issues Quick Reference

### "Cannot connect to database"
1. Check connection string
2. Verify database is running
3. Check network/firewall
4. Verify credentials

### "Null reference exception"
1. Add null checks
2. Use nullable types
3. Initialize objects
4. Review data flow

### "Validation failed"
1. Check input data
2. Review validation rules
3. Verify data types
4. Check required fields

### "API returns 500"
1. Check server logs
2. Review error handling
3. Verify dependencies
4. Check configuration
```
