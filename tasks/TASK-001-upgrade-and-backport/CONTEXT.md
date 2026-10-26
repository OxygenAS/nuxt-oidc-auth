# TASK-001 Context

## Background

This project is a fork of `itpropro/nuxt-oidc-auth` at v0.12.8. The upstream has since progressed to v1.0.0-beta.10 and migrated to Nuxt 4. We want to stay on Nuxt 3 but incorporate the most valuable upstream improvements.

## User Story

**As a** developer using nuxt-oidc-auth with a generic OIDC provider
**I want** the module upgraded to latest Nuxt 3 with key upstream improvements backported
**So that** I get better session handling, page-level auth control, and stay on a supported Nuxt version

## Current State

- Fork is at v0.12.8, running Nuxt ^3.20.2 (recently updated)
- Providers: auth0, entra, github, keycloak, oidc (generic)
- Known issues:
  - `loggedIn` returns true even when session is expired (only checks if value exists)
  - Console spam from stale session handling (`console.log('session already cleared')`)
  - No way to disable auth on specific pages without custom workarounds
  - Session errors always throw 401, no redirect option

## Desired State

- Latest Nuxt 3 with all deps up to date
- 4 upstream features backported:
  1. Page-level auth disable via `definePageMeta`
  2. Stale persistent session handling (configurable)
  3. Session error behavior (throw vs redirect)
  4. Improved `loggedIn` expiration check

## Upstream Reference

- Repo: `itpropro/nuxt-oidc-auth` (main branch)
- Version: v1.0.0-beta.10
- Key files examined:
  - `src/module.ts` — new handlers, SSO plugin, middleware config
  - `src/runtime/server/utils/session.ts` — stale session, error behavior
  - `src/runtime/composables/oidcAuth.ts` — improved loggedIn check
  - `src/runtime/middleware/oidcAuth.ts` — page-level auth disable
