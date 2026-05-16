# Date/time picker migration

> What changed when migrating `@atlaskit/datetime-picker` calendar and time menus to use
> `@atlaskit/top-layer`, behind the `platform-dst-top-layer` feature flag.

Migration is **scoped to the dropdown surfaces** driven by `@atlaskit/select` internals — not a full
rewrite of date/time parsing or the public picker API.

---

## What was done

### Date picker

When the flag is on, the react-select **`Menu`** component is **`MenuTopLayer`**
(`internal/menu-top-layer.tsx`) instead of legacy **`Menu`** (`internal/menu.tsx` — `Layering` +
`FixedLayer` + portal-style positioning).

- **`MenuTopLayer`** renders **`Popup.Content`** in **standalone** mode (no `Popup` root in this
  file): `triggerRef` is wired to **`selectProps.calendarContainerRef`** so the calendar anchors to
  the picker's container.
- **`role="dialog"`**, **`label="calendar"`**, **`slideAndFade()`**, placement **`bottom-start`**
  via `fromLegacyPlacement`.

`date-picker.tsx` contains **conditional focus restoration**: when the flag is on, it relies on
top-layer **`Popup.Content`** behavior for dialog role instead of manually focusing the calendar
button or combobox on close / Escape (see comments in source around `onCalendarSelect`, Escape
handling, and opening from the calendar button).

### Time picker

When the flag is on, the menu component is **`FixedLayerMenuTopLayer`**
(`internal/fixed-layer-menu-top-layer.tsx`) instead of **`FixedLayerMenu`**.

- **`Popup.Content`** with **`role="listbox"`**, **`triggerRef`** from
  **`selectProps.fixedLayerRef`**.
- Delegates list rendering to **`components.Menu`** from `@atlaskit/select` inside
  **`Popup.Surface`**.

### Top-layer entry points used

- `@atlaskit/top-layer/popup` — `Popup.Content`, `Popup.Surface`
- `@atlaskit/top-layer/animations` — `slideAndFade()`
- `@atlaskit/top-layer/placement-map` — `fromLegacyPlacement({ legacy: 'bottom-start' })`

---

## What was replaced (conceptually)

| Legacy                                    | Top-layer                                                        |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `Layering` + `FixedLayer` + z-index       | Browser top layer + CSS Anchor Positioning                       |
| Manual focus return on close (some paths) | Role-based focus restoration on `Popup.Content` where applicable |

---

## Test coverage

| Kind             | Location                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Playwright       | `datetime-picker/src/components/__tests__/playwright/ff-testing/platform-dst-top-layer/` (`date-picker`, `date-picker-extended`, `time-picker`, `datetime-picker` specs) |
| Informational VR | `datetime-picker/src/components/__tests__/vr-tests/basic-top-layer.vr.tsx`, `disabled-top-layer.vr.tsx`, `overflow-top-layer.vr.tsx`                                     |

---

## Source files

| File                                                          | Role                                              |
| ------------------------------------------------------------- | ------------------------------------------------- |
| `datetime-picker/src/internal/menu-top-layer.tsx`             | Date picker calendar surface                      |
| `datetime-picker/src/internal/fixed-layer-menu-top-layer.tsx` | Time picker list surface                          |
| `datetime-picker/src/components/date-picker.tsx`              | Wires `Menu` / `MenuTopLayer`, focus helpers      |
| `datetime-picker/src/components/time-picker.tsx`              | Wires `FixedLayerMenu` / `FixedLayerMenuTopLayer` |

## Adoption findings — what was a real bug vs. wrong test

When driving the FF-on Playwright suite from 49/25/2 to 75/0/0, the mix was two **real** source bugs
in the datetime-picker adopter and a long tail of test mis-attribution. Nothing in
`@atlaskit/top-layer` itself needed to change.

### Source fixes (in the `datetime-picker` adopter)

1. **`internal/menu-top-layer.tsx` and `internal/fixed-layer-menu-top-layer.tsx`: pass
   `mode="manual"` to `Popup.Content`.** With the default `mode="auto"`, the same click that opens
   the menu (which targets the react-select combobox input — outside the popover element) bubbles to
   the browser's native popover light-dismiss handler and immediately closes the menu. react-select
   / DateTimePicker already own outside-click and Esc dismissal via their own state, so opting out
   of the native auto-dismiss is the correct integration. Fixed ~10 failures.
2. **`components/date-picker.tsx`: extend the existing Esc → trigger-focus restoration to the FF-on
   path.** `mode="manual"` disables the browser's built-in focus return; the legacy code path
   already handled this for itself, just behind an `fg('platform-dst-top-layer')` negation. Fixed 1
   failure.

### Test fixes (selectors and expectations)

- 15 wrong-selector instances in `datetime-picker.spec.tsx`
  (`input#react-select-dateTimePicker--datepicker-input` →
  `input[data-testid="dateTimePicker--datepicker-select--input"]`).
- Multiple `expect(input).toBeFocused()` assertions before the input had been clicked or before the
  relevant async focus shift completed. Replaced with auto-waiting `aria-expanded` checks where
  react-select's combobox pattern is the source of truth.
- Multiple Tab-order tests asserting wrong focus targets after open. Native `<dialog>`/popover
  `showModal()`-style focus delegate lands on the first focusable descendant of the popover
  (previous-year button), not on the trigger or input. Tests updated to match the standards-aligned
  behaviour.
- Stable testIds replacing fragile DOM-shape selectors in `time-picker.spec.tsx` (selected-value
  text now read via `timePicker-select--value-container`).
- Locator scoping for the popup-nested datepicker tab-order tests (the tabcheck example renders both
  an outer datepicker AND a popup-nested datepicker — unscoped selectors hit either calendar).

## Pre-existing legacy failures (fixme'd, not in scope)

Two legacy datetime-picker tests are fixme'd as part of this migration:

- `i18n.spec.tsx` "[i18n] When a user types a year into the date input in DatetimePicker and
  subsequently hits enter, the value is correctly updated" — pre-existing axe `color-contrast`
  violation after a recent button-token change on master. Equivalent year-input coverage exists on
  the green `platform-dst-top-layer` suite.
- `ff-testing/platform_dst_popup-disable-focuslock/i18n.spec.tsx` "[i18n] When a user types a year
  …" — same root cause; exercises the interim `popup-disable-focuslock` FF (DSP-19675) which is
  being removed.
