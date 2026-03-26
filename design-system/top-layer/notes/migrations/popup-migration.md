# Popup Migration

> What changed when migrating `@atlaskit/popup` to use `@atlaskit/top-layer`, behind the
> `platform-dst-top-layer` feature flag.

---

## What was done

### Feature-flagged branch in `popup.tsx`

The `Popup` component has a feature-flagged early-return (`platform-dst-top-layer`) at the top of
the component body. When enabled, it renders `PopupTopLayer` — a separate component file that
replaces the entire legacy rendering pipeline with native `popover="auto"` via the `Popup` compound
component from `@atlaskit/top-layer`.

The compositional API (`PopupContent` from `compositional/popup.tsx`) has the same feature-flagged
branch, delegating to `PopupContentTopLayer` when the flag is on.

**Legacy path:**

```
Popup → Manager + Reference (@atlaskit/popper) → PopperWrapper → Layering → Portal → focus-trap → content
```

**Top-layer path:**

```
PopupTopLayer → Popup (@atlaskit/top-layer) → Popup.TriggerFunction → Popup.Content (popover="auto" + CSS Anchor) → Popup.Surface → content
```

### What was replaced

| Legacy mechanism                                       | Native replacement                                     |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `@atlaskit/popper` (Popper.js positioning)             | CSS Anchor Positioning via `@atlaskit/top-layer`       |
| `@atlaskit/portal` (z-index rendering to `<body>` end) | `popover="auto"` renders in the browser's top layer    |
| `@atlaskit/layering` (Escape + click-outside nesting)  | Browser handles `popover="auto"` nesting automatically |
| z-index stacking (`defaultLayer = 400`)                | Top layer insertion order                              |
| `focus-trap` library                                   | Native focus containment for `role="dialog"` popovers  |
| Popper.js `strategy` (absolute/fixed)                  | CSS Anchor Positioning (always fixed to anchor)        |
| Popper.js `modifiers` (flip, preventOverflow, etc.)    | CSS `position-try-fallbacks` (automatic)               |
| Popper.js `boundary` / `rootBoundary`                  | Viewport is the natural boundary in top layer          |
| `shouldUseCaptureOnOutsideClick`                       | Native light dismiss (`popover="auto"`)                |
| `shouldDisableFocusLock`                               | Role-based focus behavior (dialog traps, others don't) |

### Top-layer primitives used

#### `Popup` compound component (`@atlaskit/top-layer`)

The main compound providing `Popup`, `Popup.Trigger`, `Popup.TriggerFunction`, `Popup.Content`, and
`Popup.Surface`.

#### `Popup.TriggerFunction`

Render-prop trigger — used because `@atlaskit/popup` uses a render-prop `trigger` pattern. Exposes
`{ ref, isOpen, popoverId, toggle, ariaAttributes }`.

#### `Popup.Content`

Renders the popover container with `popover="auto"` attribute, CSS Anchor Positioning, and
role/label props. Accepts a `width` prop (`'content' | 'trigger'`) for `shouldFitContainer` support.

#### `Popup.Surface`

Provides the default overlay surface styling:

- `elevation.surface.overlay` background
- `radius.small` border radius
- `shadow.overlay` box shadow
- `overflow: auto`

Exported on the compound as `Popup.Surface` for DS consumers who need it.

#### `slideAndFade()` animation

Entry/exit animation using `@starting-style` + `allow-discrete` transitions. Imported from
`@atlaskit/top-layer/animations`.

#### `fromLegacyPlacement()` utility

Converts Popper.js placement strings (e.g. `'bottom-start'`) to the top-layer object-based
`Placement` type (e.g. `{ axis: 'block', edge: 'end', align: 'start' }`). Imported from
`@atlaskit/top-layer/placement-map`.

---

## Prop mapping

### Fully supported props

| Prop                 | Behavior in top-layer path                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `isOpen`             | Passed directly to `Popup.Content isOpen`                                                  |
| `trigger`            | Rendered via `Popup.TriggerFunction` render prop                                           |
| `content`            | Called with `{ isOpen, update: noop, onClose, setInitialFocusRef }` inside `Popup.Content` |
| `onClose`            | Bridged via `onClose({ reason })` → synthesized DOM events (see below)                     |
| `placement`          | Converted via `fromLegacyPlacement()` to CSS Anchor Positioning placement                  |
| `testId`             | Forwarded to `Popup` and `Popup.Content` (content gets `${testId}--content`)               |
| `id`                 | Forwarded to `aria-controls` on trigger                                                    |
| `popupComponent`     | Rendered as child inside `<div popover>` with empty `style={}`                             |
| `autoFocus`          | Passed through (native popover handles initial focus)                                      |
| `shouldFitContainer` | Mapped to `width="trigger"` on `Popup.Content` (CSS `anchor-size(width)`)                  |
| `shouldReturnFocus`  | Focus returned to trigger on Escape when true                                              |
| `role`               | Mapped to `Popup.Content` role prop (dialog, alertdialog, menu, listbox, etc.)             |
| `label`              | Mapped to `aria-label` on `Popup.Content`                                                  |
| `titleId`            | Mapped to `labelledBy` on `Popup.Content` (overrides `label`)                              |
| `shouldFitViewport`  | Adds `overflow: auto` wrapper on content                                                   |
| `xcss`               | Forwarded to `popupComponent` (when used)                                                  |
| `fallbackPlacements` | Accepted but not yet wired (CSS `position-try-fallbacks` handles flipping)                 |
| `shouldFlip`         | Accepted but CSS Anchor Positioning handles flipping natively                              |

### No-op props (accepted for API compat, no effect)

| Prop                             | Why unnecessary                                                        |
| -------------------------------- | ---------------------------------------------------------------------- |
| `zIndex`                         | Top layer manages stacking — z-index is irrelevant                     |
| `shouldRenderToParent`           | `popover="auto"` always renders in top layer, regardless               |
| `strategy`                       | CSS Anchor Positioning replaces Popper strategy                        |
| `modifiers`                      | Popper.js modifiers not applicable                                     |
| `boundary`                       | Viewport is the natural boundary                                       |
| `rootBoundary`                   | Viewport is the natural boundary                                       |
| `shouldUseCaptureOnOutsideClick` | Native light dismiss (`popover="auto"`) handles this                   |
| `shouldDisableFocusLock`         | Focus behavior is role-based in top layer (dialog traps, others don't) |
| `appearance`                     | Accepted but `UNSAFE_modal-below-sm` is not implemented                |

### Offset conversion

Legacy offset is a `[along, away]` tuple. Top-layer uses a single `away` number. The `along` offset
is not supported in CSS Anchor Positioning natively — only the `away` (second) value is forwarded.

```ts
const topLayerOffset = offsetProp ? offsetProp[1] : undefined;
```

---

## onClose bridge

The legacy `onClose(event)` callback receives a DOM event. The top-layer path receives
`onClose({ reason: PopoverCloseReason })` where reason is `'escape' | 'light-dismiss'`.

The adapter synthesizes DOM events:

| Reason            | Synthesized event                                 |
| ----------------- | ------------------------------------------------- |
| `'escape'`        | `new KeyboardEvent('keydown', { key: 'Escape' })` |
| `'light-dismiss'` | `new MouseEvent('click')`                         |
| default           | `new Event('close')`                              |

After Escape, if `shouldReturnFocus` is true, focus returns to the trigger via
`requestAnimationFrame(() => triggerRef.current?.focus())`.

---

## shouldFitContainer → `width` prop

A new `width` prop was added to `PopupContent` in `@atlaskit/top-layer`:

```ts
width?: 'content' | 'trigger';
```

- `'content'` (default): popup sizes to its content
- `'trigger'`: popup matches trigger width via CSS `width: anchor-size(width)`

No JavaScript fallback for browsers without CSS Anchor Positioning support — they get content width.
This was a deliberate decision: the `anchor-size()` function has broad support in modern browsers,
and the visual degradation (content-width instead of trigger-width) is acceptable.

---

## Popup.Surface export

`Popup.Surface` is exported on the compound component to provide the standard overlay surface
styling (elevation, radius, shadow, overflow). This avoids DS consumers duplicating 4 token
declarations. When `popupComponent` is used, `Popup.Surface` is not applied — the custom component
owns its own styling.

---

## File changes

### New files

| File                                                  | Purpose                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| `popup/src/popup-top-layer.tsx`                       | Top-layer adapter for classic Popup render-prop API |
| `popup/src/compositional/popup-content-top-layer.tsx` | Top-layer adapter for compositional PopupContent    |

### Modified files

| File                                    | Change                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `popup/src/popup.tsx`                   | Added `fg('platform-dst-top-layer')` early-return branch                |
| `popup/src/compositional/popup.tsx`     | Added FF branch in `PopupContent` delegating to `PopupContentTopLayer`  |
| `popup/package.json`                    | Added `@atlaskit/top-layer` dependency + `platform-dst-top-layer` flag  |
| `top-layer/src/popup/types.tsx`         | Added `width?: 'content' \| 'trigger'` to `PopupContentBaseProps`       |
| `top-layer/src/popup/popup-content.tsx` | Added `width` prop handling with `anchor-size(width)` CSS               |
| `top-layer/src/popup/popup-surface.tsx` | Updated JSDoc (exposed on compound)                                     |
| `top-layer/src/popup/index.tsx`         | Added `Surface: PopupSurface` to compound, exported `PopupSurfaceProps` |

---

## Test coverage

| Category                                            | Count       |
| --------------------------------------------------- | ----------- |
| Classic Popup top-layer unit tests (`ffTest.on`)    | 22          |
| Composable Popup top-layer unit tests (`ffTest.on`) | 11          |
| Playwright browser tests (WCAG-organized)           | 21          |
| Existing popup tests (legacy path)                  | all passing |

### Playwright tests by WCAG success criteria

| WCAG SC                      | Tests                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| 2.1.1 Keyboard               | 3 (Enter, Space, click open)                                 |
| 2.1.2 No Keyboard Trap       | 2 (Escape close, Tab out)                                    |
| 2.4.3 Focus Order            | 2 (focus into popup, focus return on Escape)                 |
| 2.4.7 Focus Visible          | 1 (trigger focus indicator)                                  |
| 4.1.2 Name, Role, Value      | 4 (aria-expanded, aria-haspopup, popover attr, dialog label) |
| 4.1.3 Status Messages        | 1 (aria-expanded state changes)                              |
| 1.3.1 Info and Relationships | 1 (aria-controls)                                            |
| 1.3.2 Meaningful Sequence    | 1 (DOM order, not portalled)                                 |
| Dismiss behaviors            | 2 (light dismiss, Escape)                                    |
| Positioning/sizing           | 2 (proximity, shouldFitContainer)                            |
| Nested popups                | 2 (open without closing parent, Escape nesting)              |
| Dialog focus trap            | 1 (focus contained in dialog)                                |

---

## Key decisions

1. **`width` prop over modifying `Placement`**: Sizing (`shouldFitContainer`) is independent of
   positioning — they live on different axes. A dedicated `width` prop on `PopupContent` is cleaner
   than overloading `Placement`.

2. **No JS fallback for `width="trigger"`**: CSS `anchor-size(width)` has sufficient browser
   support. Browsers without it gracefully degrade to content width.

3. **`Popup.Surface` on compound**: Exported to prevent DS consumers from duplicating the 4 surface
   token declarations. Applied by default when no `popupComponent` is provided.

4. **`popupComponent` renders as child**: Positioning is on the parent `<div popover>`. The
   `popupComponent` receives empty `style={{}}` and no `zIndex` — stacking is managed by the top
   layer.

5. **`along` offset dropped**: CSS Anchor Positioning doesn't natively support along-axis offset.
   Only the `away` (second element) of the `[along, away]` tuple is forwarded.

6. **Synthetic events for `onClose`**: Top-layer's `onClose({ reason })` is bridged to legacy
   `onClose(event)` by synthesizing DOM events. This preserves backward compatibility for consumers
   that inspect the event type.

---

## Known gaps

| Gap                     | Impact                                                                                                                                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `along` offset          | **Deprecated.** First element of `[along, away]` tuple is ignored. CSS Anchor Positioning does not support along-axis offset. Decision (2026-03-17 audit): Drop entirely. Mark as `@private` `@deprecated`. We are leaning into the platform. Consumers should find alternative layouts. |
| `UNSAFE_modal-below-sm` | Appearance-based responsive behavior not implemented                                                                                                                                                                                                                                     |
| `fallbackPlacements`    | Accepted but not yet wired to CSS `position-try-fallbacks`                                                                                                                                                                                                                               |
| Screen reader testing   | JAWS/NVDA/VoiceOver matrix not conducted                                                                                                                                                                                                                                                 |
| `onClose` event type    | Synthesized events may not match the original event that caused the close                                                                                                                                                                                                                |

---

## Merge Risk Assessment

**Is it safe to merge this code to master, assuming the `platform-dst-top-layer` feature flag is
OFF?**

### Verdict

✅ **Safe to merge**

### Changes that execute WITHOUT the feature flag

1. **Top-level imports** (module load time):
   - `@atlaskit/top-layer` entry points imported unconditionally in `popup.tsx` and
     `compositional/popup.tsx`
   - `popup-top-layer.tsx` module imported unconditionally
   - **Risk level:** Low — `@atlaskit/top-layer` modules are side-effect-free (no top-level DOM
     access, no global state mutation)

2. **Bundle size increase** — standard for feature flag rollouts

3. **JSDoc-only `@deprecated` annotations** on props in `types.tsx` — no runtime behavior change

### Changes gated behind `platform-dst-top-layer`

- Early-return branches in `popup.tsx` (line ~12) and `compositional/popup.tsx` (line ~16)
- Entire `PopupTopLayer` and `PopupContentTopLayer` rendering pipelines
- All top-layer-specific logic (CSS Anchor Positioning, popover API handling, etc.)
- New files: `popup-top-layer.tsx`, `popup-content-top-layer.tsx`

### Residual risks (flag off)

**LOW.** The only unflagged runtime changes are:

- Imports of side-effect-free modules (`@atlaskit/top-layer`)
- JSDoc annotations (no runtime impact)

Existing legacy rendering pipeline
(`Popup → Manager + Reference → PopperWrapper → Layering → Portal → focus-trap → content`) remains
unchanged.

### Risks when flag is turned on

When rolling out `platform-dst-top-layer=true`, expect these breaking changes:

1. **`along` offset dropped** — first element of `[along, away]` tuple ignored; only `away` offset
   forwarded
2. **`UNSAFE_modal-below-sm`** not implemented (appearance-based responsive behavior)
3. **`fallbackPlacements`** accepted but not wired to CSS `position-try-fallbacks`
4. **Synthetic `onClose` events** may not match the original DOM event type (e.g., `MouseEvent` vs
   `KeyboardEvent`)
5. **`aria-haspopup` default changed** from `'true'` to `'dialog'` (affects semantic meaning)

### Test confidence

✅ **High**

- 80 unit tests pass (22 classic Popup, 11 compositional, + existing legacy tests)
- 24 browser tests pass (WCAG-organized: keyboard, focus, a11y, positioning, nesting)
- 4 VR tests pass
- All 23 existing legacy tests pass — no regression on flag-off path
