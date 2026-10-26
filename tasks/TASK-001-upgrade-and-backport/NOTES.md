# TASK-001: Notes

## 2026-03-05 — Task Complete

### Files changed
- `package.json` — 21 dependencies upgraded
- `pnpm-lock.yaml` — regenerated
- `src/runtime/composables/oidcAuth.ts` — loggedIn expiration check
- `src/runtime/middleware/oidcAuth.ts` — page-level auth disable + type augmentations
- `src/runtime/types/session.ts` — `missingPersistentSession` + `sessionErrorBehavior` options
- `src/runtime/server/utils/session.ts` — stale session handling, error behavior, console.log cleanup
- `src/runtime/server/api/session.delete.ts` — console.log replaced with logger
- `src/module.ts` — new session defaults added

## 2026-03-05 — Task Created

### Upstream analysis summary
- Upstream at v1.0.0-beta.10, migrated to Nuxt 4 + jose v6
- Module compatibility still declares `>=3.9.0` — no Nuxt 4-only APIs in module code
- 6 new providers added (cognito, logto, microsoft, paypal, zitadel, apple updated)
- Key features worth backporting: page-level auth disable, stale sessions, error behavior, loggedIn check
- Skipping: SSO, proxy, jose v6, new providers, custom cookie name

### Fork-specific customizations (MUST PRESERVE)
From README and git history, the fork adds:
1. **Logout with ID token** — `logoutIncludeIdToken: true` + `logoutIdTokenParameterName: 'id_token_hint'` sends id_token to provider on logout
2. **Logout redirect URL** — `logoutRedirectURL` option for post-logout redirect
3. **Return path on login** — `login({ provider, returnPath })` stores return path in cookie, callback redirects back
4. **httpOnly: false on cookies** — auth session (`oidc`) and user session cookies are not httpOnly, allowing client-side access
5. **clearUserSession in callback** — callback handler clears old session before setting new one (with try/catch)
6. **Azure Blob Storage** — README documents unstorage Azure Blob driver for production token storage
7. **Installed as GitHub dependency** — `"nuxt-oidc-auth": "github:OxygenAS/nuxt-oidc-auth"`

All these customizations exist in the current codebase and must not be regressed.

### Files that need changes
- `src/runtime/composables/oidcAuth.ts` — loggedIn check
- `src/runtime/middleware/oidcAuth.ts` — page-level disable + type augmentation
- `src/runtime/types/session.ts` — new config options
- `src/runtime/server/utils/session.ts` — stale session + error behavior
- `package.json` — dependency upgrades
