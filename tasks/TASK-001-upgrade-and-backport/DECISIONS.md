# TASK-001: Architecture Decision Records

## ADR-001: Stay on jose v5

**Status:** Accepted
**Date:** 2026-03-05

**Context:** Upstream upgraded to jose v6 which has breaking API changes. Our fork uses jose v5.

**Decision:** Stay on jose v5.x (latest patch) for this task. jose v6 migration is a separate effort.

**Consequence:** We can't directly copy token validation code from upstream if it uses v6 APIs. Our current validation code is stable.

## ADR-002: Skip SSO and proxy support

**Status:** Accepted
**Date:** 2026-03-05

**Context:** Upstream added single sign-out and undici proxy support. SSO adds a new API endpoint, server plugin, and storage requirements. Proxy adds undici as a peer dependency.

**Decision:** Skip both for now. SSO is complex and we don't need it yet. Proxy is only needed for corporate network restrictions.

**Consequence:** We keep a simpler codebase. Can revisit if needed.

## ADR-003: Default stale session behavior is 'warn'

**Status:** Accepted
**Date:** 2026-03-05

**Context:** Need to choose a default for `missingPersistentSession`. Upstream defaults to warn-and-continue.

**Decision:** Default to `'warn'` to match upstream and avoid breaking existing behavior. Users can opt into `'clear'` for stricter handling.

**Consequence:** Stale sessions will log warnings instead of throwing or silently failing.
