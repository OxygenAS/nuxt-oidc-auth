# nuxt-oidc-auth - Project Analysis

## 1. Project Purpose

`nuxt-oidc-auth` is an open-source Nuxt 3 module (v0.12.8) that provides OpenID Connect (OIDC) authentication for Nuxt SSR applications. It abstracts the full OIDC authorization code flow (with optional PKCE, hybrid flows, and nonce validation) into a drop-in module with built-in provider presets.

**Repository:** itpropro/nuxt-oidc-auth (MIT License)

## 2. High-Level Architecture

**Type:** Nuxt 3 Module (npm package)
**Pattern:** Server-side auth with encrypted token storage

```
src/
  module.ts                    # Nuxt module entry - registers handlers, middleware, plugins
  devtools.ts                  # Nuxt DevTools integration
  runtime/
    composables/oidcAuth.ts    # Client-side useOidcAuth() composable
    middleware/oidcAuth.ts      # Global auth route middleware
    plugins/
      session.server.ts        # Server-side session plugin
      provideDefaults.ts       # Provides default secrets via Nitro plugin
    providers/                 # Provider presets (auth0, entra, github, keycloak, oidc)
    server/
      api/                     # Session CRUD endpoints (GET/DELETE /api/_auth/session, POST /api/_auth/refresh)
      handler/                 # Auth flow handlers (login, callback, logout, dev)
      lib/oidc.ts              # Core OIDC logic (login, callback, logout, dev event handlers)
      utils/
        config.ts              # Config validation & URL generation
        oidc.ts                # Token refresh, request helpers, error handling
        security.ts            # Crypto: JWT parsing, PKCE, AES-GCM encryption/decryption
        session.ts             # Session management (get/set/clear/refresh/require)
    types/
      config.ts                # OAuthConfig type
      oidc.ts                  # OidcProviderConfig, AuthSession, TokenRequest/Response types
      session.ts               # UserSession, AuthSessionConfig, Tokens types
```

## 3. Runtime Behavior

### Authentication Flow
1. User hits a protected route -> global middleware (`oidcAuth.ts`) checks `loggedIn` state
2. If not logged in -> redirects to `/auth/{provider}/login`
3. Login handler generates PKCE verifier, state, and redirects to provider's authorization URL
4. Provider redirects back to `/auth/{provider}/callback`
5. Callback handler exchanges code for tokens, validates JWT, fetches userinfo
6. Tokens (access, refresh, id) are AES-GCM encrypted and stored in `unstorage` (`oidc` namespace)
7. User session (public info only) stored in h3 session cookie (`nuxt-oidc-auth`)
8. Client accesses session via `useOidcAuth()` composable using `useState()` (SSR-safe)

### Token Security
- Access/refresh/ID tokens are **never exposed to the client** by default
- Tokens encrypted with AES-256-GCM using `NUXT_OIDC_TOKEN_KEY`
- Session cookie signed with `NUXT_OIDC_SESSION_SECRET`
- Auth session (temporary, 5 min TTL) uses `NUXT_OIDC_AUTH_SESSION_SECRET`
- Optional `exposeAccessToken`/`exposeIdToken` flags per provider

### Session Lifecycle
- Session expiration checked against access token `exp` claim
- Automatic refresh when `automaticRefresh: true` and refresh token available
- Configurable `expirationThreshold` for pre-emptive refresh
- Max session age defaults to 86400s (1 day)
- Session hooks: `fetch`, `clear`, `refresh` (via `hookable`)

## 4. Codebase Tour

| Area | Key Files | Purpose |
|------|-----------|---------|
| Module entry | `src/module.ts` | Registers all handlers, middleware, plugins, runtime config |
| Auth flow | `src/runtime/server/lib/oidc.ts` | Login, callback, logout, dev event handlers |
| Session mgmt | `src/runtime/server/utils/session.ts` | getUserSession, setUserSession, clearUserSession, refreshUserSession, requireUserSession, getAccessToken |
| Security | `src/runtime/server/utils/security.ts` | JWT parsing, PKCE, AES-GCM encrypt/decrypt, token validation |
| Client API | `src/runtime/composables/oidcAuth.ts` | `useOidcAuth()` - login, logout, refresh, clear, user state |
| Providers | `src/runtime/providers/*.ts` | auth0, entra, github, keycloak, generic oidc presets |
| Types | `src/runtime/types/*.ts` | OidcProviderConfig, UserSession, AuthSessionConfig |
| Tests | `test/utils.test.ts` | PKCE & security utility tests |

## 5. Domain Model

### Core Entities
- **UserSession**: Public session data (provider, userName, claims, expireAt, canRefresh)
- **PersistentSession**: Server-only encrypted tokens (accessToken, refreshToken, idToken, exp, iat)
- **OidcProviderConfig**: Full provider configuration (clientId, clientSecret, URLs, scope, PKCE, etc.)
- **AuthSession**: Temporary auth flow state (state, nonce, codeVerifier, redirect)

### Provider Presets
Each provider defines defaults that get merged with user config:
- **auth0**: Form-urlencoded tokens, PKCE, state
- **entra** (Azure AD): Form-urlencoded, PKCE, auto OpenID configuration discovery, ID token validation
- **github**: OAuth (not full OIDC), skip access token parsing, no PKCE
- **keycloak**: Form-urlencoded, PKCE, state
- **oidc**: Generic OIDC with minimal defaults

## 6. Data Flow

```
Client                    Server                         Provider
  |                         |                               |
  |---> /auth/x/login ----->| generateState/PKCE            |
  |                         |--- redirect to authUrl ------->|
  |                         |                               |
  |<--- callback <----------|<--- code + state -------------|
  |                         | exchangeCode -> tokens        |
  |                         | encrypt(tokens) -> storage    |
  |                         | setSession(userInfo)          |
  |<--- session cookie -----|                               |
  |                         |                               |
  |---> /api/_auth/session->| requireUserSession()          |
  |<--- userSession --------|  (auto-refresh if expired)    |
```

## 7. Integrations

- **OIDC Providers**: Any OpenID Connect compliant provider
- **Nuxt DevTools**: Custom panel showing session/secrets info
- **unstorage**: Pluggable storage for encrypted persistent sessions (default: in-memory)
- **jose**: JWT signing/verification, remote JWKS validation
- **h3**: HTTP framework for all server handlers

## 8. Configuration

### Environment Variables (Required)
- `NUXT_OIDC_SESSION_SECRET` - Signs the user session cookie
- `NUXT_OIDC_TOKEN_KEY` - AES-256 key for token encryption (base64 encoded)
- `NUXT_OIDC_AUTH_SESSION_SECRET` - Signs the temporary auth session cookie

### Module Options (`nuxt.config.ts`)
```ts
oidc: {
  enabled: true,
  defaultProvider: 'entra',
  providers: {
    entra: {
      clientId: '...',
      clientSecret: '...',
      redirectUri: '...',
      // ... provider-specific config
    }
  },
  session: {
    automaticRefresh: true,
    expirationCheck: true,
    maxAge: 86400,
    cookie: { sameSite: 'lax', secure: true }
  },
  middleware: {
    globalMiddlewareEnabled: true,
    customLoginPage: false
  },
  devMode: { enabled: false }
}
```

## 9. State & Persistence

- **User session**: h3 session cookie (signed, not httpOnly by default)
- **Encrypted tokens**: unstorage with `oidc` namespace (configurable backend)
- **Auth flow state**: Temporary h3 session cookie (`oidc`, 5min TTL, not httpOnly)
- **Client state**: `useState('nuxt-oidc-auth-session')` (SSR-safe)

## 10. Error Handling

- `oidcErrorHandler()` - Creates H3Error, delegates to `onError` callback or throws
- Token request failures logged via consola, Microsoft consent_required handled with redirect
- Session not found / expired -> 401 Unauthorized
- Config validation at login time (checks `requiredProperties`)
- Graceful userinfo fetch failure (warns, continues)

## 11. Performance

- PKCE verifier/challenge generated per login (no caching needed)
- Remote JWKS fetched per token validation (jose handles caching internally)
- Session config lazily initialized once per process

## 12. Security

- PKCE by default on most providers (mitigates authorization code interception)
- State parameter for CSRF protection
- Nonce for hybrid flows / replay attack mitigation
- Tokens encrypted at rest with AES-256-GCM
- Separate secrets for session, tokens, and auth flow
- Access/refresh tokens never sent to client by default
- Note: Session cookie is `httpOnly: false` - this is intentional for client-side access

## 13. Testing Reality

- **Test framework**: Vitest
- **Coverage**: Minimal - only PKCE/security utility tests implemented
- **TODO tests**: config merging, form data generation, snakeCase conversion, session hooks
- **No integration tests** for the actual OIDC flows
- **No e2e tests**

## 14. Known Unknowns

- Provider extraction from `event.path.split('/')[2]` is fragile (marked with TODO in code)
- `Buffer.from()` used in security.ts (marked TODO to replace)
- Commented-out `exposeAccessToken`/`exposeIdToken` in callback flow (functionality exists in session utils)
- Some console.log statements used instead of logger (e.g., session clearing errors)
- `normalizeURL()` applied to `clientSecret` in body auth - may cause issues with special characters

## 15. Change Playbooks

### Adding a New Provider
1. Create `src/runtime/providers/{name}.ts` using `defineOidcProvider()`
2. Export from `src/runtime/providers/index.ts`
3. TypeScript types auto-extend via `ProviderKeys`

### Modifying Session Structure
1. Update `UserSession` in `src/runtime/types/session.ts`
2. Update construction in `src/runtime/server/lib/oidc.ts` (callbackEventHandler)
3. Update refresh logic in `src/runtime/server/utils/oidc.ts`
4. Update composable if exposing new fields

### Changing Token Storage
1. Configure unstorage driver in Nuxt config (nitro storage)
2. Module uses `useStorage('oidc')` - all token storage goes through this namespace

## 16. Improvement Opportunities

- Add comprehensive test coverage (OIDC flow integration tests)
- Replace `Buffer.from()` with platform-agnostic alternatives
- Improve provider detection from URL path (currently fragile string split)
- Add structured logging instead of console.log in error paths
- Consider making session cookie httpOnly configurable at module level
- Add TypeScript strict mode
- Implement token rotation detection for refresh tokens

## MCP Servers

The following MCP servers are configured in `.mcp.json`:
- **context7** - Contextual documentation (always included)
- **github** - GitHub integration (project is GitHub-hosted)

## Oxygen Components

See `.claude/README.md` for available agents, skills, and commands.
