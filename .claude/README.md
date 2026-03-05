# Project Claude Context

Oxygen AI development context for nuxt-oidc-auth.

## Structure

- **PROJECT.md** - Project overview
- **CONVENTIONS.md** - Coding standards (from actual code)
- **ARCHITECTURE.md** - System architecture
- **DEPENDENCIES.md** - Tech stack versions
- **GLOSSARY.md** - Domain terminology

## Oxygen Components

### Agents (`agents/`)
Specialized AI agents:
- backend-architect (Opus) - Architecture & planning
- api-developer (Sonnet) - .NET implementation
- frontend-developer (Sonnet) - Vue/Nuxt development
- cms-specialist (Sonnet) - Umbraco/MedusaJS
- test-engineer (Sonnet) - Testing
- code-reviewer (Sonnet) - Quality reviews
- devops-engineer (Sonnet) - Azure infrastructure

Usage: "Use the frontend-developer agent for this component"

### Skills (`skills/`)
Best practices for technologies:
- dotnet - .NET 9 patterns
- vue-nuxt - Vue/Nuxt standards
- umbraco - Umbraco CMS
- medusajs - MedusaJS commerce
- azure-infra - Azure infrastructure
- testing - Test strategies

Referenced automatically by agents.

### Commands (`commands/`)
Oxygen workflow commands:
- oxygen-init - This command
- oxygen-new-task - Create new task
- oxygen-review-task - Review task
- oxygen-status - Project status
- oxygen-debug - Debugging help
- oxygen-help - Command reference

Usage: "Run oxygen-new-task TASK-042 'Feature name'"

### Templates (`templates/`)
Templates for documentation.

## Workflow

1. New Task: "Run oxygen-new-task"
2. Check Status: "Run oxygen-status"
3. Review: "Run oxygen-review-task"
4. Debug: "Run oxygen-debug"

## Customization

You can customize agents, skills, and commands in this directory.
Changes are project-specific and tracked in git.
