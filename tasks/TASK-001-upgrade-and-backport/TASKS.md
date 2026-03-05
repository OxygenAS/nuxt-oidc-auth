# TASK-001: Task Breakdown

**Status:** Complete
**Progress:** 11/11 tasks

## 1. Dependency Upgrade
- [x] Update Nuxt 3 and @nuxt/* packages to latest
- [x] Update h3, jose (within v5), ofetch, and other deps
- [x] Run `pnpm install` and resolve any conflicts
- [x] Run `pnpm dev:prepare` — verify module builds
- [x] Run `pnpm test` — verify existing tests pass (unit tests pass, nuxt fixture test was already broken pre-upgrade)

## 2. Backport Features
- [x] Improved `loggedIn` expiration check in composable
- [x] Page-level auth disable via `definePageMeta`
- [x] Stale persistent session handling (configurable `missingPersistentSession`)
- [x] Session error behavior (`sessionErrorBehavior: 'throw' | 'redirect'`)

## 3. Cleanup & Validation
- [x] Replace `console.log` with proper logger in session error paths
- [x] Verified all fork customizations preserved

## Current Focus
Complete. Ready for version bump and commit.
