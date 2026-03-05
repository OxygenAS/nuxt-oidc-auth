# Coding Conventions

**Generated from actual codebase analysis**

## TypeScript

### Module Structure
- ESM modules (`"type": "module"` in package.json)
- Nuxt module defined with `defineNuxtModule<ModuleOptions>()`
- Provider presets defined with `defineOidcProvider<ExtendedConfig, RequiredFields>()`
- Server handlers use h3 `eventHandler()` pattern

### Naming
- camelCase for functions, variables, and file names
- PascalCase for types and interfaces
- Provider preset files named after provider (e.g., `entra.ts`, `auth0.ts`)
- Server API files use `.get.ts`, `.post.ts`, `.delete.ts` suffix convention
- Handler files use `.get.ts` suffix for route handlers

### Error Handling
- Custom `oidcErrorHandler()` that creates H3Error and delegates to optional `onError` callback
- `createError()` from h3 for HTTP errors with statusCode and message
- Try/catch around external HTTP calls (token requests, userinfo)
- Graceful degradation: userinfo fetch failure logs warning, continues flow
- Token request failures log error data and return error to handler

Example (from `src/runtime/server/lib/oidc.ts`):
```ts
catch (error: any) {
  logger.error(error?.data ?? error)
  return oidcErrorHandler(event, 'Token request failed', onError)
}
```

### Logging
- Uses `consola` via `useOidcLogger()` factory
- Tagged with `nuxt-oidc-auth`
- Levels: `error` for failures, `warn` for degraded behavior, `info` for lifecycle events, `debug` for flow tracing
- Module setup uses `useLogger('nuxt-oidc-auth')` from `@nuxt/kit`

### Type Patterns
- Explicit return types on exported functions
- Generic types for provider config extension (`defineOidcProvider<T, K>`)
- `Record<string, unknown>` for open-ended objects
- Union types for constrained string values (e.g., `'header' | 'body'`)

## Frontend (Vue/Nuxt)

### Composables
- `useOidcAuth()` - single composable exposing all auth functionality
- Uses `useState()` for SSR-safe session state (never module-level reactive state)
- `computed()` for derived state (`loggedIn`, `user`, `currentProvider`)
- `useRequestFetch()` for SSR-compatible API calls

### State Management
- No Pinia - uses Nuxt's built-in `useState()` for session state
- Cookie-based return path storage for login redirect

## Server

### Session Management
- h3 `useSession()` for cookie-based sessions
- Separate session configs: user session (long-lived) vs auth session (5min TTL)
- `defu` for merging session data on update
- `hookable` for session lifecycle hooks (fetch, clear, refresh)

### Security Patterns
- PKCE verifier: 64 chars from unreserved characters (RFC 7636)
- PKCE challenge: SHA-256 hash, base64url encoded
- Token encryption: AES-256-GCM with random 12-byte IV
- Base64 encoding utilities (standard and URL-safe variants)
- `genBase64FromString` / `genStringFromBase64` with encoding options

### Config Merging
- Custom `defu` merger via `createDefu()` - replaces arrays by default, except `requiredProperties` which are merged
- Provider presets merged with user config at runtime

## Testing

### Framework
- Vitest with `describe`/`it`/`expect`
- `it.todo()` for planned but unimplemented tests
- Direct function imports for unit tests

### Patterns
```ts
describe('security', () => {
  it('Should generate a valid verifier', () => {
    const output = generatePkceVerifier()
    expect(output).to.toHaveLength(64)
  })
})
```
