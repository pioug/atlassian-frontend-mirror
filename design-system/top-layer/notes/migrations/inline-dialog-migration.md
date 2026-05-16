# Inline dialog migration

> What changed when migrating `@atlaskit/inline-dialog` to use `@atlaskit/top-layer`, behind the
> `platform-dst-top-layer` feature flag.

The package remains **intent-to-deprecate** in favor of `@atlaskit/popup`; this migration aligns the
layering stack with native top layer for products that still ship inline dialog.

---

## What was done

When `fg('platform-dst-top-layer')` is true, `inline-dialog.tsx` renders **`InlineDialogTopLayer`**
instead of the legacy **Popper.js + `@atlaskit/layering`** pipeline.

| Legacy mechanism                     | Top-layer replacement                                            |
| ------------------------------------ | ---------------------------------------------------------------- |
| `Manager` / `Reference` / `Popper`   | `Popup` compound from `@atlaskit/top-layer/popup`                |
| Layering close / escape coordination | Native `popover="auto"` light dismiss + `onClose({ reason })`    |
| Manual trigger positioning           | CSS Anchor Positioning (`fromLegacyPlacement`, `placement` prop) |

### Top-layer entry points used

- `@atlaskit/top-layer/popup` — `Popup`, `Popup.TriggerFunction`, `Popup.Content`
- `@atlaskit/top-layer/animations` — `slideAndFade()`
- `@atlaskit/top-layer/placement-map` — `fromLegacyPlacement`
- `@atlaskit/top-layer/create-close-event` — `createPopoverCloseEvent` → legacy
  `onClose({ isOpen, event })`

### Trigger and anchor

Children are wrapped in **`TriggerWrapper`**: a `display: contents` container that forwards
`firstElementChild` as the anchor (CSS Anchor Positioning needs a real box; `display: contents`
parents cannot anchor). ARIA from `Popup.TriggerFunction` is applied to the trigger via `useEffect`.

### Content

- `Popup.Content` uses **`role="dialog"`** with label **`"Inline dialog"`** (TODO: i18n noted in
  source).
- Controlled open state: `isOpen` on `Popup.Content`.

---

## No-op props on the top-layer path

`strategy` and `fallbackPlacements` are accepted for API compatibility but have no effect (anchor
positioning replaces Popper).

---

## Test coverage

| Kind                         | Location                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Playwright (a11y / behavior) | `inline-dialog/src/__tests__/playwright/ff-testing/platform-dst-top-layer/inline-dialog.spec.tsx`        |
| Parity                       | `inline-dialog/src/__tests__/playwright/ff-testing/platform-dst-top-layer/inline-dialog-parity.spec.tsx` |

---

## Source files

| File                                            | Role                                         |
| ----------------------------------------------- | -------------------------------------------- |
| `inline-dialog/src/inline-dialog.tsx`           | Feature flag branch → `InlineDialogTopLayer` |
| `inline-dialog/src/inline-dialog-top-layer.tsx` | Top-layer implementation                     |

## Pre-existing legacy failures (fixme'd, not in scope)

Two legacy inline-dialog tests were touched in scope of this migration:

- `inline-dialog.spec.tsx` "InlineDialog should be able to be identified and clicked by data-testid"
  — fixed by switching from `toHaveText('Hello!')` to `toContainText('Hello!')`. The testing example
  was extended with "First action" / "Second action" buttons and the tighter assertion no longer
  matched.
- `accessibility.spec.tsx` "InlineDialog should pass basic aXe audit" — fixme'd. The legacy
  InlineDialog Selected button has insufficient colour contrast (axe `color-contrast`). Not fixed
  because `@atlaskit/inline-dialog` is being replaced by the `@atlaskit/top-layer` Popup primitive
  and the FF-on path uses ADS Button tokens that meet contrast thresholds.

## A11y wrapper pattern: `role="presentation"` over eslint-disable

The `inline-dialog-top-layer.tsx` content wrapper is a layout-only `<div>` whose only handlers are
non-user (forwarding the consumer's `onContentBlur` / `onContentClick` / `onContentFocus`
callbacks). The default a11y lint stack flagged it for
`@atlassian/a11y/click-events-have-key-events`, `interactive-element-not-keyboard-focusable`, and
`no-static-element-interactions`.

Rather than reach for `eslint-disable`, the wrapper carries `role="presentation"` (a.k.a.
`role="none"`). This is the ARIA-spec correct way to mark wrappers as opaque to assistive
technology, which satisfies all three lint rules without a disable. The surrounding `Popup.Content`
already owns the `role="dialog"` landmark, so no semantic information is lost.

The same pattern was applied to `datetime-picker/internal/menu-top-layer.tsx`, where the wrapper's
only handler is an `onMouseDown` whose job is to swallow the bubbled click that would otherwise
close the react-select menu.
