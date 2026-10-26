# Project: nuxt-oidc-auth

## Purpose

Open-source Nuxt 3 module providing OpenID Connect (OIDC) authentication for SSR applications. Handles the full authorization code flow with PKCE, token encryption, session management, and multiple provider presets.

## Tech Stack

### Frontend / Module
- **Nuxt**: ^3.20.2 (module compatibility ^3.9.0)
- **Vue**: 3 (via Nuxt)
- **TypeScript**: ^5.7.2
- **Package Manager**: pnpm 9.0.6

### Key Dependencies
- **h3**: ^1.13.0 (HTTP framework, session management)
- **jose**: ^5.9.6 (JWT verification, JWKS, signing)
- **ofetch**: ^1.4.1 (HTTP client for token/userinfo requests)
- **unstorage**: ^1.12.0 (Pluggable storage for encrypted tokens)
- **uncrypto**: ^0.1.3 (Cross-platform crypto - AES-GCM, random values)
- **defu**: ^6.1.4 (Config merging)
- **consola**: ^3.2.3 (Logging)
- **@nuxt/devtools-kit**: ^1.6.2 (DevTools integration)

### Testing
- **Vitest**: ^2.1.8
- **@nuxt/test-utils**: ^3.15.4

### Build
- **@nuxt/module-builder**: ^1.0.2

## Oxygen Toolkit

### Available Agents (`.claude/agents/`)
- backend-architect - Architecture & planning
- api-developer - .NET implementation
- frontend-developer - Vue/Nuxt development
- cms-specialist - Umbraco/MedusaJS
- test-engineer - Testing
- code-reviewer - Quality reviews
- devops-engineer - Infrastructure

### Available Skills (`.claude/skills/`)
- dotnet - .NET 9 best practices
- vue-nuxt - Vue/Nuxt standards
- umbraco - Umbraco CMS patterns
- medusajs - MedusaJS commerce
- azure-infra - Azure infrastructure
- testing - Test strategies

### Available Commands (`.claude/commands/`)
- oxygen-init
- oxygen-new-task
- oxygen-review-task
- oxygen-status
- oxygen-debug
- oxygen-help

## Key Patterns

- Nuxt Module pattern with `defineNuxtModule`
- Provider preset system with `defineOidcProvider` and config merging
- Encrypted server-side token storage (AES-256-GCM via unstorage)
- SSR-safe client state via `useState()`
- h3 event handlers for all server endpoints
- Session hooks via `hookable` for extensibility
