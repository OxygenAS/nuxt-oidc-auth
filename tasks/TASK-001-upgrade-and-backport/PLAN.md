# TASK-001: Upgrade Nuxt & Backport Upstream Features

**Status:** Complete
**Created:** 2026-03-05
**Cross-Repo:** false

## Goal

Upgrade the forked `nuxt-oidc-auth` module to the latest Nuxt 3 and backport 4 high-value features from the upstream v1.0.0-beta.x that improve session handling, UX, and developer ergonomics — without taking the full Nuxt 4 migration or breaking the existing OIDC provider setup.

## Success Criteria

- [ ] Module builds and runs on latest Nuxt 3 (^3.20.x)
- [ ] Page-level auth disable works via `definePageMeta({ oidcAuth: { enabled: false } })`
- [ ] Stale/missing persistent sessions are handled gracefully (configurable: `'clear'` or `'warn'`)
- [ ] Session errors support `'throw'` or `'redirect'` behavior (configurable)
- [ ] `loggedIn` computed correctly returns `false` when session is expired
- [ ] Existing OIDC provider flow (login, callback, logout, refresh) still works
- [ ] Existing tests pass
- [ ] No regressions in token encryption/decryption or session lifecycle

## Scope

**In scope:**
- Nuxt 3 dependency upgrade (nuxt, @nuxt/kit, @nuxt/schema, @nuxt/test-utils, etc.)
- Backport: Page-level auth disable (`definePageMeta` support in middleware)
- Backport: Stale persistent session handling (configurable behavior)
- Backport: Session error behavior (`throw` vs `redirect`)
- Backport: Improved `loggedIn` expiration check in composable
- Update any other outdated dependencies as needed

**Out of scope:**
- Nuxt 4 migration
- New providers (cognito, logto, microsoft, paypal, zitadel)
- jose v5 -> v6 upgrade (breaking API changes, separate task)
- Proxy/undici support (only needed for corporate proxies)
- Single sign-out (SSO) — complex feature, separate task
- Custom cookie name support
- DevTools well-known endpoints for dev mode

## Technical Approach

### 1. Dependency Upgrade

**Package updates:**
- `nuxt`: ^3.20.x (latest Nuxt 3)
- `@nuxt/kit`: ^3.20.x
- `@nuxt/schema`: ^3.20.x
- `@nuxt/test-utils`: latest compatible
- `@nuxt/devtools-kit`: latest compatible
- `h3`: ^1.15.x (minor, should be safe)
- Other deps: update to latest compatible within same major

**Validation:**
- Run `pnpm install` and verify lockfile
- Run `pnpm dev:prepare` to ensure module builds
- Run existing tests

### 2. Backport: Page-Level Auth Disable

**Files to modify:**
- `src/runtime/middleware/oidcAuth.ts`

**Changes:**
- Add `MiddlewareOptions` interface with `enabled: boolean` (default `true`)
- Extend `PageMeta` and `RouteMeta` declarations to include `oidcAuth?: MiddlewareOptions`
- Check `to.meta.oidcAuth?.enabled !== false` before enforcing auth
- Check global middleware config from runtime config

**Implementation reference (upstream pattern):**
```ts
interface MiddlewareOptions {
  enabled?: boolean
}

// In middleware:
const oidcConfig = to.meta.oidcAuth as MiddlewareOptions | undefined
if (oidcConfig?.enabled === false) return

// Type augmentation:
declare module '#app' {
  interface PageMeta { oidcAuth?: MiddlewareOptions }
}
declare module 'vue-router' {
  interface RouteMeta { oidcAuth?: MiddlewareOptions }
}
```

### 3. Backport: Stale Session Handling

**Files to modify:**
- `src/runtime/types/session.ts` — add `missingPersistentSession` option
- `src/runtime/server/utils/session.ts` — add stale session logic

**Changes:**
- Add `missingPersistentSession?: 'clear' | 'warn'` to `AuthSessionConfig`
- In `requireUserSession()`, when persistent session is missing:
  - `'clear'`: Clear the user session cookie, throw 401
  - `'warn'`: Log warning, continue (current behavior minus console.log spam)
- Replace bare `console.log('session already cleared')` with proper logger calls

### 4. Backport: Session Error Behavior

**Files to modify:**
- `src/runtime/types/session.ts` — add `SessionBehaviorOptions`
- `src/runtime/server/utils/session.ts` — add `handleSessionError()`

**Changes:**
- Add `sessionErrorBehavior?: 'throw' | 'redirect'` to `AuthSessionConfig`
- Create `handleSessionError(event, config)`:
  - `'throw'`: throw 401 (current behavior)
  - `'redirect'`: `sendRedirect(event, '/', 302)`
- Apply in `requireUserSession()` when session is expired or missing

### 5. Backport: Improved `loggedIn` Check

**Files to modify:**
- `src/runtime/composables/oidcAuth.ts`

**Changes:**
- Change `loggedIn` computed from:
  ```ts
  computed(() => Boolean(sessionState.value))
  ```
  To:
  ```ts
  computed(() => {
    if (!sessionState.value) return false
    const now = Math.trunc(Date.now() / 1000)
    return sessionState.value.expireAt > now
  })
  ```

## Fork Customizations to Preserve

These changes were made in the fork and **must not be regressed**:

1. **Logout with ID token** (`src/runtime/server/lib/oidc.ts` — `logoutEventHandler`)
   - `logoutIncludeIdToken` flag fetches & decrypts ID token from persistent session
   - `logoutIdTokenParameterName` (default `'id_token_hint'`) appends it to logout URL
   - `logoutRedirectURL` option for post-logout redirect destination
   - `logoutRedirectParameterName` for the redirect query param name

2. **Return path on login** (`src/runtime/composables/oidcAuth.ts`)
   - `login({ provider, returnPath })` — stores returnPath in `login-return-path` cookie
   - Callback handler reads cookie, redirects to stored path, deletes cookie

3. **httpOnly: false on cookies** (`src/runtime/server/lib/oidc.ts`, `src/runtime/server/utils/session.ts`)
   - Auth session cookie (`oidc`): `httpOnly: false`
   - User session cookie: `httpOnly: false` (via `_useSession` config)
   - Intentional for client-side cookie access

4. **clearUserSession in callback** (`src/runtime/server/handler/callback.ts`)
   - Clears old session before setting new one, wrapped in try/catch
   - Also deletes the temporary `oidc` cookie after callback

5. **Azure Blob Storage for production** (documented in README)
   - unstorage Azure Blob driver for `oidc` namespace in production
   - Requires `@azure/identity`, `@azure/storage-blob`, SAS key config

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Nuxt 3.20 breaking changes | Medium | Check Nuxt changelog, test module build |
| h3 minor update breaks session API | Low | h3 is stable within minor versions |
| Stale session logic introduces regressions | Medium | Test with and without persistent sessions |
| PageMeta augmentation conflicts with host app | Low | Use optional interface extension |
| `loggedIn` expiration check causes premature logout on client | Medium | Ensure server session refresh updates `expireAt` in cookie |
| Fork customizations lost during backport | High | Explicit checklist in plan, test logout+returnPath flows |

## Dependencies

- None (standalone task)

## Implementation Order

1. **Dependency upgrade** — update package.json, install, verify build
2. **loggedIn expiration check** — smallest change, easy to verify
3. **Page-level auth disable** — middleware change, no server impact
4. **Stale session handling** — server-side, needs careful testing
5. **Session error behavior** — server-side, builds on stale session work
6. **Final testing** — run all tests, manual verification if possible
