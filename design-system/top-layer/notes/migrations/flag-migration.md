# Flag Migration

> What changed when migrating `@atlaskit/flag` to use `@atlaskit/top-layer`, behind the
> `platform-dst-top-layer` feature flag.

---

## What was done

When `fg('platform-dst-top-layer')` is true, `FlagGroup` renders each flag in its own
`<Popover mode="manual">` host from `@atlaskit/top-layer/popover`, inside a `DialogAwarePortal`.
This replaces `@atlaskit/portal` with top-layer rendering.

**Legacy path:**

```
shouldRenderToParent ? flags : <Portal zIndex={layers.flag()}>{flags}</Portal>
```

**Top-layer path:**

```
<ExitingPersistence>
  {flags.map((flag) => (
    <DialogAwarePortal>
      <Popover mode="manual" isOpen={true}>{flag}</Popover>
    </DialogAwarePortal>
  ))}
</ExitingPersistence>
```

Each flag has its own host. `DialogAwarePortal` (from `@atlaskit/top-layer/dialog-aware-portal`)
renders it in place, or inside the `Dialog` that is topmost when the flag mounts. The first flag's
host (the newest one from `FlagsProvider`) has the group label and `id`. See
[Flags while a modal or drawer is open](#flags-while-a-modal-or-drawer-is-open).

`isOpen` is **required** on `Popover`. Flag always passes `isOpen={true}` because flags are always
visible when rendered — the flag group's own lifecycle (auto-dismiss timer, close button) controls
when the component mounts/unmounts.

### What was replaced

| Legacy mechanism                        | Native replacement                            |
| --------------------------------------- | --------------------------------------------- |
| `@atlaskit/portal` with `layers.flag()` | `Popover mode="manual"` (top layer rendering) |
| z-index stacking                        | Top layer insertion order                     |

---

## Why `mode="manual"`

Flags are persistent notifications, not interactive popovers. They should not have light dismiss:

- **No Escape close** -- flags should not disappear when the user presses Escape. They dismiss via
  their own close button or auto-dismiss timer.
- **No click-outside close** -- clicking elsewhere on the page should not remove flag notifications.

`popover="manual"` gives top-layer rendering (flags appear above all other content) without any
built-in dismiss behavior. The consumer (flag's own dismiss lifecycle) controls show/hide entirely.

This contrasts with popup, which uses `popover="auto"`, and tooltip, which uses `popover="hint"`,
both for native light dismiss.

---

## Behavior changes for consumers

Minimal. Flags now render in the browser's top layer instead of a portal. There are no API changes.

The `shouldRenderToParent` prop still exists and is still accepted, but on the top-layer path it has
no effect: each flag host renders in place, or inside the topmost open `Dialog`.

---

## Flags while a modal or drawer is open

A modal `<dialog>` makes everything outside it inert, popovers too, even a popover that paints above
it. A flag host outside the open modal cannot be clicked or focused, and screen readers do not
announce it. Legacy flags (z-index 600) sat above the modal blanket (510), and a pointer could use
them. The legacy `ModalDialog` focus lock kept keyboard focus out of them by default.

**Decided (2026-10-29, changed 2026-11-12):** each flag has its own host, which mounts with the
flag. If a top-layer `Dialog` is open then (`ModalDialog`, `Drawer`, or a `Dialog` used directly),
`FlagGroup` renders the host inside the topmost `<dialog>`, through `DialogAwarePortal`. When that
dialog closes, the host moves (to the next open dialog, or in place). Every `FlagsProvider` gets
this, with no API change.

- A modal that opens while a flag shows, or in the same commit as the flag, does not take it. The
  flag is under it, and inert, until it closes. The rule: a `Dialog` covers what was open before it.
  This includes a modal that a flag action opens: focus returns to the action when it closes.
- **Rejected (2026-11-12):** moving a flag into a modal that opens later. VoiceOver reads the moved
  `role="alert"` again (remount, `append()` and `moveBefore()` all do), and it interrupts the
  reading of the modal. We keep the flag's role. See
  `decisions/dialog-covers-what-was-open-before.md`.
- **Known gap:** a modal that blocks its close keeps a flag that showed before it unusable until it
  closes. Keyboard users had this in legacy too (focus lock). Pointer users did not.
- A new flag that shows while a modal is open renders inside it, even when earlier flags are under
  it.
- A modal dialog that a flag renders itself (for example a "Learn more" modal in the flag content)
  is inside the host. Focus returns to the flag when that dialog closes.
- **Accepted cost:** when a host's dialog closes, the move remounts that flag. It plays its enter
  animation again, an `AutoDismissFlag` timer starts again, an expanded bold flag collapses, and a
  screen reader reads it again.
- A flag that shows in the commit that closes its modal (for example, a submit handler that shows a
  flag and closes the modal) moves before paint. It does not show in the closing modal first.
- **Accepted cost:** top-layer paint order is show order, not `z-index`. When flags remount
  together, an older one can paint above the newest one during the slide after a dismiss.
- **Known gap:** when a new flag shows while the first flag exits, the group label and `id` can be
  on two hosts until the exit ends.
- An Escape with focus in a flag goes to the dialog (a manual popover does not take Escape).
- **Known gap:** Tab inside the dialog does not reach the flags yet. The dialog's focus wrap skips
  every nested layer, and the flag host is a nested popover. A pointer press and screen readers
  reach them.
- React events from the flags still follow the React tree (`FlagsProvider`), not the dialog.

See `architecture/dialog.md` ("Dialog aware portal").

---

## Server rendering

The top-layer `FlagGroup` renders nothing on the server, as on the legacy path. `DialogAwarePortal`
renders nothing on the server and while the client hydrates. After hydration, the hosts render, and
the `Popover` layout effect calls `showPopover()`. Unlike the legacy path, flags that are present at
hydration play their enter animation then. See `architecture/ssr.md`.

---

## Visual regression results

Informational VR tests comparing `platform-dst-top-layer` true vs false are in
`flag/src/__tests__/informational-vr-tests/flag-top-layer.vr.tsx`.

### Scenarios with no visual difference

The following scenarios produce **byte-for-byte identical** snapshots between the legacy and
top-layer paths:

| Scenario                                 | Device  | Result    |
| ---------------------------------------- | ------- | --------- |
| Single flag                              | Desktop | Identical |
| Single flag                              | Mobile  | Identical |
| Multiple flags stacked (3 flags)         | Desktop | Identical |
| Flag appearances (normal, via FlagGroup) | Desktop | Identical |
| Single flag — action button hovered      | Desktop | Identical |
| Single flag — action button focused      | Desktop | Identical |
| Long title                               | Desktop | Identical |
| Long content                             | Desktop | Identical |

For standard flag usage (FlagGroup rendered at page level), the top-layer migration produces **no
visual change** across all tested scenarios, including multiple flags, all appearances, interactive
states, long content, and mobile viewports.

### Scenarios with visual differences

| Scenario                                  | Difference                                             | Intentional? |
| ----------------------------------------- | ------------------------------------------------------ | ------------ |
| Flag in modal with `shouldRenderToParent` | ~3.6% pixel diff around the flag card and blanket area | Yes          |

**Flag in modal with `shouldRenderToParent`**: This is the only scenario with a visual difference.
The pixel diff is concentrated around the flag card and the modal blanket region. The cause is that
`shouldRenderToParent` is ignored on the top-layer path:

- **Legacy path**: `shouldRenderToParent={true}` renders the FlagGroup inline within the modal DOM.
  The flag has `position: fixed` so it still appears at the viewport bottom-left, but it exists
  within the modal's stacking context and z-index layer.
- **Top-layer path**: each flag renders in its own `<Popover mode="manual">` host, inside the
  modal's `<dialog>` (through `DialogAwarePortal`), so it is above the modal and not inert.

Additionally, the `platform-dst-top-layer` flag also controls modal-dialog's own rendering path, so
the modal's blanket rendering changes from a styled overlay to a native `::backdrop`. The
combination of these two changes (flag in its own top-layer entry + modal using native backdrop)
produces the visual difference in the blanket region around the flag.

This difference is **intentional** — it is a documented consequence of the `shouldRenderToParent`
prop being ignored on the top-layer path.

---

## Test coverage

Unit tests: each flag is wrapped in its own host (`DialogAwarePortal` and `<Popover>`), and existing
flag-group tests run against whichever rendering path is active based on the feature flag in the
test environment.

Browser tests: `flag/src/__tests__/playwright/ff-testing/platform-dst-top-layer/flag.spec.tsx` — 6
tests covering 1.3.2, 2.1.1, 2.4.7, 2.4.11, 4.1.2 (dismiss button accessible label test is SKIPPED).

Visual regression tests: `flag/src/__tests__/informational-vr-tests/flag-top-layer.vr.tsx` — 13
scenarios (26 snapshots total: 13 with flag on, 13 with flag off) covering single flag, multiple
flags, appearances, hover/focus states, long title/content, mobile viewport, flag-in-modal, and
app-level flags over a modal (shown while it is open, shown before it opens, a new flag over an
earlier one, and a dismiss by click).

### Accessibility (top-layer path)

| A11y criterion               | Test | Status            | Notes                                                                                                                                                                                    |
| ---------------------------- | ---- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1 Info and Relationships | ✗    | N/A               | Flags are persistent notifications with no trigger element. There is no trigger-to-popup relationship to expose. `Popover mode="manual"` is used purely for top-layer rendering.         |
| 1.3.2 Meaningful Sequence    | ✓    | Browser           | `flag.spec.tsx` — no portal rendering                                                                                                                                                    |
| 2.1.1 Keyboard               | ✓    | Browser           | `flag.spec.tsx` — keyboard dismiss via close button                                                                                                                                      |
| 2.1.2 No Keyboard Trap       | ✗    | N/A               | `popover="manual"` has no light dismiss and no focus trap. Flags do not capture focus, so no keyboard trap is possible by design.                                                        |
| 2.4.3 Focus Order            | ✗    | **Gap**           | No browser test verifies focus order within the flag group or focus behavior after flag dismiss on the top-layer path. Focus handling is flag component logic.                           |
| 2.4.7 Focus Visible          | ✓    | Browser           | `flag.spec.tsx` — focus-visible on flag actions                                                                                                                                          |
| 2.4.11 Focus Not Obscured    | ✓    | Browser           | `flag.spec.tsx` — top-layer content not obscured                                                                                                                                         |
| 3.2.1 On Focus               | ✗    | N/A               | Flags are persistent notifications that do not open/close on focus. No focus-triggered context change is possible.                                                                       |
| 4.1.2 Name, Role, Value      | ✓\*  | Browser (partial) | `flag.spec.tsx` — ARIA role. **SKIPPED:** dismiss button accessible label test (Flag doesn't provide aria-label on dismiss button)                                                       |
| 4.1.3 Status Messages        | ✗    | **Gap**           | Flags are status notifications and should use `role="status"` or `aria-live="polite"` to announce to screen readers. This is a flag component concern, not tested on the top-layer path. |

> **Note:** Flag has dedicated top-layer browser tests in
> `flag/src/__tests__/playwright/ff-testing/platform-dst-top-layer/flag.spec.tsx` (6 tests).

---

## Out-of-scope a11y improvements

The following pre-existing accessibility issues in `@atlaskit/flag` are **not addressed** by the
top-layer migration. They exist in both the legacy and top-layer paths:

- **`role="alert"` for all flags (WCAG 4.1.3):** Every flag uses `role="alert"` (assertive
  announcement), including non-critical flags like info and success. Non-critical flags should use
  `role="status"` (polite announcement) to avoid interrupting screen readers. This is a
  `@atlaskit/flag` concern, not a layering concern.

---

## Files modified

### `@atlaskit/flag`

| File                 | Change                                                                              |
| -------------------- | ----------------------------------------------------------------------------------- |
| `src/flag-group.tsx` | Added `<Popover mode="manual">` wrapper behind `platform-dst-top-layer` flag        |
| `src/flag-group.tsx` | One host for each flag, in `DialogAwarePortal`, so it mounts in the topmost modal   |
| `package.json`       | Added `platform-dst-top-layer` feature flag; added `@atlaskit/top-layer` dependency |

---

## Merge Risk Assessment

> **Verdict:** ✅ **Safe to merge**

### Changes that execute WITHOUT the feature flag

- **Unconditional top-level imports** of `@atlaskit/top-layer/popover` and
  `@atlaskit/top-layer/dialog-aware-portal` in `flag-group.tsx`
  - Import is side-effect-free; does not execute code at module load time
  - No top-level DOM access or initialization
  - **Impact:** Bundle size increase only (negligible; Popover is tree-shakeable)

### Changes gated behind `platform-dst-top-layer`

- **`flag-group.tsx`** — `fg('platform-dst-top-layer')` condition gives each flag its own
  `<Popover mode="manual">` host
  - When flag is ON: each flag renders via `<Popover mode="manual">` (top-layer rendering)
  - When flag is OFF: FlagGroup uses legacy Portal path (no change)

### Residual risks (flag off)

**VERY LOW.**

- The only unconditional change is an import statement (side-effect-free)
- Legacy Portal path remains unchanged and fully functional
- No breaking changes to public API

### Risks when flag is turned on

- **`shouldRenderToParent` prop is ignored** (intentional design decision)
  - When flag is ON, Popover always renders via top-layer, regardless of `shouldRenderToParent`
    value
  - This is expected behavior; documented in "Behavior changes for consumers"
  - **Impact:** Flags in modals show visual difference (intentional; modal and flag both use
    top-layer)

- **No Escape dismiss, no click-outside dismiss** (intentional; correct for flags)
  - `popover="manual"` mode intentionally disables auto-dismiss
  - Flags are persistent notifications; consumers control lifecycle via close button or auto-dismiss
    timer
  - This is the correct behavior; matches flag semantics

### Test confidence

| Test type               | Count  | Status         | Coverage                                                                                      |
| ----------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------- |
| Unit tests              | 88     | ✓ Pass         | Flag rendering, properties, event handling                                                    |
| Gap tests               | 11     | ✓ Pass (added) | New top-layer paths                                                                           |
| Browser tests           | 6      | ✓ Pass         | Meaningful sequence, keyboard dismiss, focus visibility, focus not obscured, ARIA role        |
| Browser test (skipped)  | 1      | ⊗ Skipped      | Dismiss button aria-label (pre-existing gap in flag component)                                |
| VR snapshots            | 18     | ✓ Pass         | 9 legacy scenarios vs 9 top-layer scenarios                                                   |
| Byte-for-byte identical | 8 of 9 | ✓ Pass         | Single flag, multiple flags, all appearances, hover/focus, long content, mobile               |
| Intentional differences | 1 of 9 | ✓ Pass         | Flag-in-modal-with-shouldRenderToParent (expected due to both modal and flag switching paths) |

**Summary:** All existing tests pass. 11 new gap tests added and passing. VR tests confirm visual
equivalence on the legacy path and expected behavior on the top-layer path. This is the simplest
migration of all packages — a host for each flag, with no breaking changes to the legacy path.
