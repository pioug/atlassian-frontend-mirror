# @atlaskit/top-layer — Notes

Project documentation for the `@atlaskit/top-layer` package and the migration of design system
layering components from Popper.js + Portal + z-index to native browser top layer
(`popover`, `<dialog>`) and CSS Anchor Positioning.

## Directory Structure

### [`goals/`](./goals/)

Project direction, requirements, and success criteria.

- **[project-goals.md](./goals/project-goals.md)** — Problem statement, solution overview, browser
  support, migration strategy
- **[accessibility-criteria.md](./goals/accessibility-criteria.md)** — WCAG 2.2 success criteria,
  non-negotiable a11y requirements, milestone targets

### [`architecture/`](./architecture/)

Technical design, reference guides, and deep-dives.

- **[overview.md](./architecture/overview.md)** — Package overview: components, hooks, utilities,
  entry points, and when to use what
- **[animations.md](./architecture/animations.md)** — CSS animation system (`@starting-style`,
  `allow-discrete`, `isOpen` lifecycle), why animation stays on `Popover`, alternatives considered
- **[focus.md](./architecture/focus.md)** — Focus wrapping, initial focus placement, focus
  restoration — all three focus concerns in one place
- **[implementation-guide.md](./architecture/implementation-guide.md)** — Complete technical
  reference for the package internals (components, hooks, entry points, positioning, fallbacks)

### [`decisions/`](./decisions/)

Architectural decisions, design rationale, and decision logs.

- **[audit-decisions.md](./decisions/audit-decisions.md)** — Canonical decision log from the
  2026-03-17 deep audit (21 numbered decisions)
- **[dialog-close-flow.md](./decisions/dialog-close-flow.md)** — How Dialog closing works (Escape,
  backdrop click, programmatic, consumer gating)
- **[menu-keyboard.md](./decisions/menu-keyboard.md)** — Decision: menu keyboard behavior (arrow
  keys, type-ahead) is the consumer's responsibility
- **[compiled.md](./decisions/compiled.md)** — Gap analysis for Compiled CSS-in-JS migration
  (animations, `@position-try`, `var()`, `calc()`)
- **[migration-roadmap.md](./decisions/migration-roadmap.md)** — Status of all DS layering
  packages (which are migrated, which are planned, which are skipped)
- **[migration-audit-report.md](./decisions/migration-audit-report.md)** — Cross-package migration
  audit (12 packages, 96 gaps identified, 99 tests added, remediation plan)
- **[accessibility-audit-report.md](./decisions/accessibility-audit-report.md)** — Per-component
  a11y audit of primitives and all adopters (WCAG compliance, findings, justifications)

### [`rules/`](./rules/)

Coding standards and testing practices for the package.

- **[code-authoring.md](./rules/code-authoring.md)** — TypeScript authoring patterns and style
  conventions
- **[testing.md](./rules/testing.md)** — Browser testing strategy, test categories, and best
  practices for top-layer migrations

### [`migrations/`](./migrations/)

Per-component migration records (what changed, how, and why).

- **[popup-migration.md](./migrations/popup-migration.md)**
- **[tooltip-migration.md](./migrations/tooltip-migration.md)**
- **[dropdown-menu-migration.md](./migrations/dropdown-menu-migration.md)**
- **[modal-dialog-migration.md](./migrations/modal-dialog-migration.md)**
- **[flag-migration.md](./migrations/flag-migration.md)**
- **[spotlight-migration.md](./migrations/spotlight-migration.md)**
- **[select-migration.md](./migrations/select-migration.md)** — Migration plan (not yet implemented)
