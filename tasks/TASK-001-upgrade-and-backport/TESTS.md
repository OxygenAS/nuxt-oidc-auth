# TASK-001: Test Strategy

## Existing Tests (must pass)
- `test/utils.test.ts` — PKCE verifier/challenge generation, random URL-safe strings

## New Tests Needed

### loggedIn expiration check
- [ ] Returns `false` when `sessionState` is undefined
- [ ] Returns `false` when `expireAt` is in the past
- [ ] Returns `true` when `expireAt` is in the future

### Stale session handling
- [ ] `requireUserSession` with missing persistent session + `missingPersistentSession: 'clear'` clears session
- [ ] `requireUserSession` with missing persistent session + `missingPersistentSession: 'warn'` logs warning and throws 401

### Session error behavior
- [ ] `sessionErrorBehavior: 'throw'` throws 401
- [ ] `sessionErrorBehavior: 'redirect'` returns redirect response

## Manual Testing
- [ ] Login flow still works end-to-end with OIDC provider
- [ ] Expired session correctly shows as `loggedIn: false` on client
- [ ] Page with `definePageMeta({ oidcAuth: { enabled: false } })` is accessible without auth
- [ ] Module builds cleanly with `pnpm prepack`
