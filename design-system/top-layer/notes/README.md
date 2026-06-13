# @atlaskit/top-layer — Notes

Project documentation for the `@atlaskit/top-layer` package and the migration of design system
layering components from Popper.js + Portal + z-index to native browser top layer (`popover`,
`<dialog>`) and CSS Anchor Positioning.

## Current rollout status

Migrations ship **behind the `platform-dst-top-layer` feature flag** until the stack is enabled
product-wide. For a package-by-package matrix (including packages without a dedicated migration note
here), see **[migration-roadmap.md](./decisions/migration-roadmap.md)**.

**Packages with a feature-flagged top-layer rendering path in source** (non-exhaustive; see
roadmap):

| Package                     | Role                                                      |
| --------------------------- | --------------------------------------------------------- |
| `@atlaskit/popup`           | `Popup` compound                                          |
| `@atlaskit/dropdown-menu`   | `Popup` + `useArrowNavigation`                            |
| `@atlaskit/tooltip`         | `Popover` + `useAnchorPosition`                           |
| `@atlaskit/modal-dialog`    | `Dialog` + `DialogScrollLock` + `createCloseEvent`        |
| `@atlaskit/flag`            | `Popover` (`manual`) for stacking                         |
| `@atlaskit/spotlight`       | `Popover` + `useAnchorPosition` + `useSimpleLightDismiss` |
| `@atlaskit/select`          | `Popup` for `PopupSelect`                                 |
| `@atlaskit/datetime-picker` | `Popup` for calendar / menu surfaces                      |
| `@atlaskit/inline-dialog`   | `Popup` compound                                          |
| `@atlaskit/avatar-group`    | `Popup` + `useArrowNavigation` (overflow menu)            |

Some packages run **Playwright / VR examples with the flag** for regression coverage without owning
`@atlaskit/top-layer` directly (e.g. `@atlaskit/menu`, `@atlaskit/inline-message`).

---

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
- **[test-ids.md](./architecture/test-ids.md)** — `testId` → `data-testid`: primitives, Popup /
  Tooltip suffixes
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
- **[aria-controls-trigger-contract.md](./decisions/aria-controls-trigger-contract.md)** — Decision:
  `getAriaForTrigger` always emits stable `aria-controls`
- **[popover-trigger-hook.md](./decisions/popover-trigger-hook.md)** — Decision: defer
  `usePopoverTrigger`; keep `usePopoverId` and `getAriaForTrigger` as low-level primitives
- **[compiled.md](./decisions/compiled.md)** — Gap analysis for Compiled CSS-in-JS migration
  (animations, `@position-try`, `var()`, `calc()`)
- **[migration-roadmap.md](./decisions/migration-roadmap.md)** — Current matrix: which packages ship
  a top-layer code path, partial migrations, test-only coverage, and skipped packages
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
- **[select-migration.md](./migrations/select-migration.md)** — `PopupSelect` migration (implemented
  behind `platform-dst-top-layer`; document retains plan + implementation detail)
- **[inline-dialog-migration.md](./migrations/inline-dialog-migration.md)**
- **[avatar-group-migration.md](./migrations/avatar-group-migration.md)** — overflow menu only
- **[datetime-picker-migration.md](./migrations/datetime-picker-migration.md)** — calendar / time
  list surfaces
- **[popper-migration.md](./migrations/popper-migration.md)** — deprecation plan for the positioning
  primitive itself (no in-package code path)
