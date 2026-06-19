# Select → Top-Layer Migration Plan

> **Status (2026-03):** Implemented behind `platform-dst-top-layer`. Source:
> `select/src/popup-select/popup-select-top-layer.tsx`, wired from `popup-select.tsx`. The sections
> below remain the plan and implementation reference; treat “create this file” steps as **done**
> unless noted otherwise.

## Overview

`@atlaskit/select`'s **`PopupSelect`** uses `@atlaskit/top-layer` when the feature flag is on,
replacing the legacy Popper.js + Portal + FocusLock pipeline with the native Popover API + CSS
Anchor Positioning.

The regular `Select` component does **not** use portals or layering — only `PopupSelect` migrates.

### Current (legacy) path

```
PopupSelect → react-popper (Manager/Reference/Popper) → createPortal(document.body) → react-focus-lock → z-index via layers.modal()
```

### Target (top-layer) path

```
PopupSelect → Popup (@atlaskit/top-layer) → popover="auto" + CSS Anchor Positioning → native focus management
```

---

## Migration Strategy

Follow the same pattern used by `@atlaskit/popup` and `@atlaskit/dropdown-menu`:

1. **Feature-flag gated** behind `platform-dst-top-layer`
2. **New file** `popup-select-top-layer.tsx` alongside the existing class component
3. **Early return** in the existing `render()` when the flag is on
4. **No API changes** for consumers — all existing props continue to work

---

## Step-by-Step Implementation

### Step 1: Update `package.json`

Add to `packages/design-system/select/package.json`:

- **Dependency**: `"@atlaskit/top-layer": "workspace:^"` in `dependencies`
- **Feature flag**: `"platform-dst-top-layer": { "type": "boolean" }` in `platform-feature-flags`

### Step 2: Create `popup-select-top-layer.tsx`

Create a new **functional component** `PopupSelectTopLayer` that replaces the legacy class
component's rendering.

**What it replaces:**

| Legacy mechanism                                        | Native replacement                                     |
| ------------------------------------------------------- | ------------------------------------------------------ |
| `react-popper` (Manager/Reference/Popper)               | `Popup` compound from `@atlaskit/top-layer/popup`      |
| `createPortal(document.body)`                           | `popover="auto"` renders in browser's top layer        |
| `react-focus-lock`                                      | Native focus containment via top-layer                 |
| `@atlaskit/layering` + `NotifyOpenLayerObserver`        | Browser handles `popover="auto"` nesting automatically |
| `layers.modal()` z-index                                | Top layer insertion order                              |
| Manual click-outside handling (window capture listener) | Native light dismiss via `popover="auto"`              |
| Manual Escape key handling (window capture listener)    | Native popover Escape handling                         |

**Key implementation details:**

- Convert from class component to functional component (only the top-layer path)
- Use `Popup` compound (`Popup` + `Popup.TriggerFunction` + `Popup.Content`) — same pattern as
  `popup-top-layer.tsx`
- Use `Popup.TriggerFunction` (not `Popup.Trigger`) since PopupSelect uses a render prop `target`
  for the trigger
- Use `fromLegacyPlacement()` from `@atlaskit/top-layer/placement-map` to convert
  `popperProps.placement` (e.g., `'bottom-start'`) to the new placement format
- Use `slideAndFade()` animation preset
- Use `Popup.Surface` for the overlay surface styling (background, shadow, border-radius) —
  replacing `MenuDialog`'s z-index-based styling
- Preserve all existing behavior: `closeMenuOnSelect`, `shouldCloseMenuOnTab`, `footer`,
  `searchThreshold`, `maxMenuWidth`, `minMenuWidth`, keyboard navigation

**Prop mapping:**

| PopupSelect Prop                   | Top-layer mapping                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `target` (render prop)             | Rendered via `Popup.TriggerFunction` — pass `ref`, `aria-haspopup`, `aria-expanded`, `aria-controls`, `onKeyDown` |
| `popperProps.placement`            | Convert via `fromLegacyPlacement()` to CSS Anchor Positioning placement                                           |
| `popperProps.modifiers`            | No-op — CSS Anchor Positioning handles offset/overflow/flip natively                                              |
| `popperProps.strategy`             | No-op — top layer doesn't need `fixed`/`absolute` strategy                                                        |
| `isOpen` / `defaultIsOpen`         | Map to `Popup.Content isOpen` (controlled) or internal state (uncontrolled)                                       |
| `maxMenuWidth` / `minMenuWidth`    | Inline styles on the content container                                                                            |
| `closeMenuOnSelect`                | Preserved — call `close()` after `onChange` fires                                                                 |
| `shouldCloseMenuOnTab`             | Preserved — handle in `onKeyDown`                                                                                 |
| `footer`                           | Rendered inside `Popup.Content` after the Select                                                                  |
| `searchThreshold` / `isSearchable` | Preserved — same logic for showing/hiding search control                                                          |
| `label`                            | Passed as accessible label to `Popup.Content`                                                                     |
| `testId`                           | Forwarded to `Popup` and content                                                                                  |

**onClose mapping:**

```typescript
onClose={({ reason }) => {
  props.onClose?.();
  props.onMenuClose?.();
  // Focus return handled natively by top-layer
}}
```

### Step 3: Wire feature flag in `popup-select.tsx`

Add an early return at the top of the `render()` method:

```typescript
render() {
  if (fg('platform-dst-top-layer')) {
    return <PopupSelectTopLayer {...this.props} />;
  }
  // ... existing render logic
}
```

This follows the exact pattern used by `@atlaskit/popup` (line 89-92).

### Step 4: Remove `NotifyOpenLayerObserver` in top-layer path

The `NotifyOpenLayerObserver` integrates with `@atlaskit/layering` for legacy z-index management. In
the top-layer path, browser native popover nesting handles this automatically.

### Step 5: Write unit tests

Create `popup-select/__tests__/unit/popup-select-top-layer.test.tsx`:

- Use `ffTest` to test with `platform-dst-top-layer` on/off
- Opens/closes correctly, keyboard nav (Escape/ArrowDown), click outside, `closeMenuOnSelect`,
  `shouldCloseMenuOnTab`, controlled `isOpen`, `target` render prop, footer, search threshold

### Step 6: Write informational VR tests

Create `popup-select/__tests__/informational-vr-tests/popup-select-top-layer.vr.tsx`:

- Compare snapshots with flag true vs false
- Scenarios: basic open, with footer, with search, compact spacing, max/min width

### Step 7: Write Playwright browser tests

| WCAG SC                   | Test                                                       |
| ------------------------- | ---------------------------------------------------------- |
| 2.1.1 Keyboard            | ArrowDown opens, Escape closes                             |
| 2.1.2 No Keyboard Trap    | Escape closes popup, Tab behavior                          |
| 2.4.3 Focus Order         | Focus moves to select on open, returns to trigger on close |
| 2.4.7 Focus Visible       | Focus indicators on trigger and options                    |
| 2.4.11 Focus Not Obscured | Top-layer content not behind backdrop                      |
| 4.1.2 Name, Role, Value   | `aria-expanded`, `aria-haspopup`, `aria-controls`          |

### Step 8: Write migration documentation

`top-layer/notes/migrations/select-migration.md` (this file).

---

## Known Risks & Gaps

| Risk                                | Impact                                                                                              | Mitigation                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Class → functional boundary**     | PopupSelect is a class component; top-layer path is functional                                      | Same pattern as popup migration — class `render()` early-returns to functional component |
| **`popperProps` consumers**         | Custom `popperProps.modifiers` ignored in top-layer path                                            | Document as no-op. CSS Anchor Positioning handles overflow/flip natively                 |
| **`popperProps.strategy: 'fixed'`** | Legacy path skips portal when `fixed`. Top-layer always renders in top layer                        | Behavior equivalent — top layer is effectively `fixed`                                   |
| **PopupSelect inside modal-dialog** | Both using top-layer — stacking via insertion order                                                 | Test explicitly. Should work since PopupSelect opens after modal                         |
| **`react-focus-lock` removal**      | Deferred `focusLockEnabled` pattern was a Popper positioning workaround — not needed with top-layer | Test focus management thoroughly                                                         |
| **Screen reader testing**           | JAWS/NVDA/VoiceOver not conducted                                                                   | Document as known gap (consistent with other migrations)                                 |
| **`shouldCloseMenuOnTab`**          | Custom Tab-to-close not native to top-layer                                                         | Implement explicit `onKeyDown` handler                                                   |
| **`closeMenuOnSelect`**             | Must close popup (not just react-select menu) after selection                                       | Wire `onChange` to call close                                                            |

---

## Files to Create/Modify

### New files

| File                                                                                     | Purpose                           |
| ---------------------------------------------------------------------------------------- | --------------------------------- |
| `select/src/popup-select/popup-select-top-layer.tsx`                                     | Top-layer adapter for PopupSelect |
| `select/src/popup-select/__tests__/unit/popup-select-top-layer.test.tsx`                 | Unit tests                        |
| `select/src/popup-select/__tests__/informational-vr-tests/popup-select-top-layer.vr.tsx` | VR tests                          |
| `top-layer/notes/migrations/select-migration.md`                                         | Migration documentation           |

### Modified files

| File                                       | Change                                                        |
| ------------------------------------------ | ------------------------------------------------------------- |
| `select/src/popup-select/popup-select.tsx` | Add `fg('platform-dst-top-layer')` early return in `render()` |
| `select/package.json`                      | Add `@atlaskit/top-layer` dep + feature flag                  |

---

## Implementation Order

1. Update `package.json` (dependency + feature flag)
2. Create `popup-select-top-layer.tsx`
3. Wire feature flag in `popup-select.tsx`
4. Write unit tests
5. Write VR tests
6. Write Playwright tests
7. Write migration doc
8. Run existing tests to verify no regressions on legacy path

**As of 2026-03:** Steps 1–3 and test/doc artifacts are in place; unit-test depth for the top-layer
path was still a known gap in the 2026-03-16 migration audit.

---

## Consumer-side `MenuPortal` wrappers (downstream type breakage)

Several products copy-paste a tiny wrapper around `components.MenuPortal` from
`@atlaskit/select/react-select` so they can inject product-specific concerns (most commonly
`@atlaskit/layering` to apply `data-ds--level` for correct stacking inside portals). One such copy
lives in Jira:

- `jira/src/packages/portfolio-3/portfolio/src/app-simple-plans/view/main/tabs/roadmap/dependencies-flyout/add-dependency/dependency-selector/layer-menu-portal/index.tsx`

These wrappers typically redeclare the `MenuPortal` signature with a narrow return type, for
example:

```ts
const MenuPortal: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuPortalProps<Option, IsMulti, Group>,
) => JSX.Element | null = components.MenuPortal;
```

**Problem:** Upstream `react-select` types now return `ReactNode` (which includes `undefined`) from
`MenuPortal`, so the narrowed `JSX.Element | null` annotation no longer assigns. This shows up as
a TS2322 type error in any product copy that uses the older annotation.

**Fix:** Widen the wrapper's return type to `ReactNode`:

```ts
import { type ReactNode } from 'react';

const MenuPortal: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuPortalProps<Option, IsMulti, Group>,
) => ReactNode = components.MenuPortal;
```

The wrapper still renders fine in JSX. Only the type annotation needs to relax.

**Action for product teams:** Search your product for hand-rolled `MenuPortal` wrappers (grep for
`components.MenuPortal` and `MenuPortalProps`) and apply the same widening. Longer term, consider
extracting these "select + layering + portal" wrappers into a shared product-local package so that
future upstream type changes are a single-file fix rather than a copy-paste sweep.
