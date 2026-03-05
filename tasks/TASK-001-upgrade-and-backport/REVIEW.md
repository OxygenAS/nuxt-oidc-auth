# TASK-001: Review Checklist

## Code Quality
- [ ] No `console.log` left in production code (use logger)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No new `any` types introduced
- [ ] Type augmentations are properly declared

## Functionality
- [ ] All 4 backported features work as described
- [ ] Existing OIDC flow unaffected
- [ ] Default behavior unchanged (backward compatible)
- [ ] New config options are optional with sensible defaults

## Fork Customizations Preserved
- [ ] Logout with ID token (`logoutIncludeIdToken` + `logoutIdTokenParameterName`)
- [ ] Logout redirect URL (`logoutRedirectURL` + `logoutRedirectParameterName`)
- [ ] Return path on login (`login({ provider, returnPath })` + cookie)
- [ ] httpOnly: false on both auth session and user session cookies
- [ ] clearUserSession in callback before setting new session
- [ ] Azure Blob Storage docs in README unchanged

## Testing
- [ ] Existing tests pass
- [ ] New features have test coverage
- [ ] Manual smoke test of login/logout flow

## Security
- [ ] No tokens exposed to client unintentionally
- [ ] Session cookie settings unchanged
- [ ] Encryption/decryption not affected
