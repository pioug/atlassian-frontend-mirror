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

| Package                     | Role                                                       |
| --------------------------- | ---------------------------------------------------------- |
| `@atlaskit/popup`           | `Popup` compound                                           |
| `@atlaskit/dropdown-menu`   | `Popup` + `useArrowNavigation`                             |
| `@atlaskit/tooltip`         | `Popover` + `useAnchoredPopover`                           |
| `@atlaskit/modal-dialog`    | `Dialog` + `DialogScrollLock` + `createCloseEvent`         |
| `@atlaskit/flag`            | `Popover` (`manual`) for stacking                          |
| `@atlaskit/spotlight`       | `Popover` + `useAnchoredPopover` + `useSimpleLightDismiss` |
| `@atlaskit/select`          | `Popup` for `PopupSelect`                                  |
| `@atlaskit/datetime-picker` | `Popup` for calendar / menu surfaces                       |
| `@atlaskit/inline-dialog`   | `Popup` compound                                           |
| `@atlaskit/avatar-group`    | `Popup` + `useArrowNavigation` (overflow menu)             |

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
- **[tooltip-pointer-dismissal.md](./decisions/tooltip-pointer-dismissal.md)** — Decision: tooltip
  leans into `popover="hint"` light dismiss instead of `mode="manual"`; a press dismisses the
  tooltip until the trigger is re-entered. Read before citing the `mode="manual"` precedent for a
  hover-driven surface
- **[compiled.md](./decisions/compiled.md)** — Gap analysis for Compiled CSS-in-JS migration
  (animations, `@position-try`, `var()`, `calc()`)
- **[width-from-anchor-floors.md](./decisions/width-from-anchor-floors.md)** — Decision: why an
  anchor-relative axis gets at most one floor, why `'min-anchor'` gets the anchor floor but
  deliberately not the content floor, and (2026-08-24 update) why the content floor was removed
  outright
- **[fit-available-space.md](./decisions/fit-available-space.md)** — Decision: the size recipe. Cell
  vs viewport caps, the floor that keeps `position-try-fallbacks` working, why `display` has to live
  in `Popover`'s stylesheet, and the measured alternatives that failed
- **[migration-roadmap.md](./decisions/migration-roadmap.md)** — Current matrix: which packages ship
  a top-layer code path, partial migrations, test-only coverage, and skipped packages
- **[top-layer-unsafe-selectors.md](./decisions/top-layer-unsafe-selectors.md)** — **The single
  source of guard strings** for making AFM-authored selectors top-layer safe: the `L` / `S` / `Lw` /
  `Sw` term lists, the rewrite forms, the six verified traps, the patterns with no guard form (and
  the search behind each claim), and the new-adopter checklist. Read this before rewriting any
  selector for top layer
- **[accessibility-audit-report.md](./decisions/accessibility-audit-report.md)** — Per-component
  a11y audit of primitives and all adopters (WCAG compliance, findings, justifications)
- **[safari-escape-nested-popover-in-dialog.md](./decisions/safari-escape-nested-popover-in-dialog.md)**
  — **RESOLVED:** Safari closed the parent `<dialog>` on Escape from a nested popover; fixed in the
  Dialog primitive via a keydown-time nested-popover snapshot (verified on real Safari 26.5), with
  `TScenario` mouse/keyboard hardening of the top-layer focus tests

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

### [`plans/`](./plans/) and [`follow-ups/`](./follow-ups/)

Work that is planned, in flight, or done-with-loose-ends, plus known gaps deliberately left open
with the reasoning and a suggested implementation. A plan that has shipped is marked **executed**
and keeps a corrections block rather than being deleted, so the reasoning survives next to what
actually happened.

- **[plans/one-anchored-popover-hook.md](./plans/one-anchored-popover-hook.md)** — **executed.** Why
  positioning and anchor-relative sizing became one `useAnchoredPopover` instead of three hooks, the
  four problems the split caused, and where the shipped API diverged from the plan
- **[plans/should-fit-viewport.md](./plans/should-fit-viewport.md)** — **executed.** The original
  `shouldFitViewport` investigation and its measurements
- **[follow-ups/custom-popup-component-contract.md](./follow-ups/custom-popup-component-contract.md)**
  — the six-point contract a custom `popupComponent` has to meet for a size cap to reach its
  content: stated in the `PopupComponentProps` docblock, unenforced, and broken by six in-tree
  containers
- **[follow-ups/tree-grid-initial-focus.md](./follow-ups/tree-grid-initial-focus.md)** —
  `useInitialFocus` is unimplemented for `role="tree"` and `role="grid"`
- **[follow-ups/popovertarget-exploration.md](./follow-ups/popovertarget-exploration.md)** —
  declarative `popovertarget` invoker attribute vs. the current JS toggle
- **[follow-ups/tooltip-triggers-discarding-render-prop-props.md](./follow-ups/tooltip-triggers-discarding-render-prop-props.md)**
  — 14 consumer call sites whose trigger drops the whole tooltip render-prop object, so the tooltip
  never renders on either side of the flag (as distinct from the ref-only drops, which were fixed)
