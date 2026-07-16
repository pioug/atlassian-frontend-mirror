# Focus Management

Focus management in `@atlaskit/top-layer` covers three areas: focus wrapping, initial focus
placement, and focus restoration. This document explains the decisions and implementation for each.

---

## Focus wrapping for dialogs

### Problem

Native `<dialog>.showModal()` wraps focus through `<body>` at the boundary: `A → B → C → body → A`.
The [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) requires direct
wrapping: `A → B → C → A`. This is consistent across all major browsers (Chrome, Firefox, Safari,
Edge) — it's how the
[sequential focus navigation algorithm](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation)
works, not a browser bug.

Popovers with `role="dialog"` have no native focus wrapping at all — Tab freely escapes to
background content.

### Decisions

- **Popovers with `role="dialog"` get focus wrapping.** Tab/Shift+Tab cycle within the popover.
  Light dismiss (Escape, click outside) still works via `popover="auto"`. Sources:
  [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/),
  [MDN `dialog` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role).

- **Popovers with other roles do not get focus wrapping.** Focus is allowed to leave the popover,
  and it stays open. The
  [popover spec](https://open-ui.org/components/popover.research.explainer/#focus-management) does
  not prescribe focus trapping — it's the `role="dialog"` that requires wrapping. Other roles have
  their own keyboard patterns (e.g.
  [menus use arrow keys](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), not Tab).

- **`Dialog` (`<dialog>.showModal()`) also uses focus wrapping.** Overrides the native `<body>`
  intermediate step. We could get away with the native behavior, but it's right to be fully spec
  compliant and to align keyboard behavior across all dialogs.

### Implementation

`useFocusWrap` hook (`src/internal/use-focus-wrap.tsx`):

- Intercepts `Tab` and `Shift+Tab` (capture phase, `preventDefault()`)
- Remaps them to `getNextFocusable({ container, direction })`, which handles wrapping
- Used in `Popover` (active when role is `'dialog'`) and `Dialog` (always active)

### Nested top-layer scopes

When a `role="dialog"` popover (or `<dialog>`) contains another `role="dialog"` top-layer descendant
(for example, a date-picker calendar opened inside a popup), both layers attach a `useFocusWrap`
listener. The capture-phase listener on the outer layer fires first.

If the outer layer naively handled Tab while focus was inside the inner layer, it would call
`preventDefault()` and remap focus to one of its own focusables — ejecting focus from the inner
layer and triggering its blur handlers (which typically close the inner layer).

To avoid this, `useFocusWrap` calls `isNestedLayerFocused({ container })` before intercepting Tab.
The helper returns `true` when `document.activeElement` is a descendant of the container but lives
in a different (nested) top-layer scope (a `[popover]`, `<dialog>`, `[role="dialog"]`, or
`[role="alertdialog"]` element). When that is the case, the outer hook returns early and lets the
inner hook take over.

The contract this preserves:

- **Inside our own layer** → handle Tab normally (cycle).
- **Inside a nested layer below us** → skip; the inner hook handles it.
- **Outside our layer** (body, a sibling layer, or no active element) → handle Tab to reclaim focus
  into our scope.

The "reclaim from loose focus" branch matters for the `<Dialog>` modal case: if the user clicks
outside and presses Tab, focus should snap back into the modal rather than wander the page.

### TODO: empty layers

Layers with no focusable descendants (e.g. spinner-only loading) soft-lock on Tab. JSDoc on `Dialog`
/ `Popover` recommends rendering a focusable on open, but this is not enforced. Possible follow-up:
fall back to focusing the container itself (`tabIndex={-1}`).

---

## Initial focus

### Problem

When a dialog or popover opens, focus needs to move to an appropriate element inside it
([WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)). The
question is whether native browser behavior handles this for us, or whether we need custom logic.

### What the browser gives us natively

**`<dialog>.showModal()` handles initial focus completely.** The
[dialog focusing steps](https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps)
algorithm:

1. If a descendant has `autofocus`, focus it
2. Otherwise, focus the first focusable descendant
3. If no focusable descendants, focus the `<dialog>` element itself

This covers every case. No custom code needed. Validated as consistent across all three engines
(April 2026, Playwright 1.57.0):

| Engine   | Version      | `autofocus` respected | First focusable fallback |
| -------- | ------------ | --------------------- | ------------------------ |
| Chromium | 143.0.7499.4 | ✅                    | ✅                       |
| Firefox  | 144.0.2      | ✅                    | ✅                       |
| WebKit   | 26.0         | ✅                    | ✅                       |

**`showPopover()` does NOT auto-focus the first focusable child.** The
[popover focusing steps](https://html.spec.whatwg.org/multipage/popover.html#popover-focusing-steps)
algorithm only moves focus when:

1. The popover element itself has `autofocus`, OR
2. A descendant has `autofocus` (the "autofocus delegate")

Without `autofocus`, focus stays on the trigger — regardless of role. Independently verified in
Chromium:

| Scenario                               | Native `showPopover()` behavior | APG requirement       | Gap?    |
| -------------------------------------- | ------------------------------- | --------------------- | ------- |
| `role="dialog"`, no `autofocus`        | Focus stays on trigger          | Focus first focusable | **Yes** |
| `role="dialog"`, child has `autofocus` | Focuses the autofocus child     | Focus autofocus child | No      |
| `role="menu"`                          | Focus stays on trigger          | Focus first menu item | **Yes** |
| `role="listbox"`, selected option      | Focus stays on trigger          | Focus selected option | **Yes** |
| `role="tooltip"`                       | Focus stays on trigger          | No focus movement     | No      |

### Why not just use the `autofocus` attribute?

We can't replace the hook with static `autofocus` attributes because:

- **First focusable is dynamic.** It depends on rendered content, not something known at author
  time.
- **Role-specific logic.** Different roles need different targets: `dialog` → first focusable,
  `listbox` → selected option (`[aria-selected="true"]`), `tooltip` → nothing.
- **Consumer `autofocus` must still work.** If a consumer places `autofocus` on a specific element,
  that should win — the hook checks for `[autofocus]` first, then falls back.

### React 18 `autoFocus` caveat

React 18's `autoFocus` JSX prop does **not** set the HTML `autofocus` attribute or the DOM
`.autofocus` property. It only calls `.focus()` imperatively during the commit phase, which silently
fails on hidden popover content (the popover hasn't been shown yet at commit time).

**Consumers who want autofocus inside a popover must set the native attribute themselves**, for
example via a ref callback:

```tsx
const autofocusRef = useCallback((node: HTMLButtonElement | null) => {
	if (node) {
		node.setAttribute('autofocus', '');
	}
}, []);

<button ref={autofocusRef}>Focused on open</button>;
```

React 19+ reflects the `autoFocus` JSX prop as the HTML `autofocus` attribute, so this workaround is
only needed for React 18.

For `Dialog` (which uses `showModal()`), the same ref callback pattern applies — the browser's
dialog focusing steps look for the HTML `autofocus` attribute.

### Decisions

- **`Dialog` does not use `useInitialFocus`.** Native `showModal()` handles it. This is correct — no
  changes needed.
- **`Popover` uses `useInitialFocus`.** This fills a genuine gap in the Popover API. Without it,
  `role="dialog"`, `role="menu"`, and `role="listbox"` popovers violate WCAG 2.4.3.

### Implementation

`useInitialFocus` hook (`src/internal/use-initial-focus.tsx`):

- On open, resolves the correct focus target based on role:
  - `dialog`: `[autofocus]` element, or first focusable
  - `menu`: first focusable (menu item)
  - `listbox`: `[aria-selected="true"]` option, or first focusable
  - `tooltip` / no role: no focus movement
- Combobox carve-out (for `menu` and `listbox`): if the popup is owned by a focused combobox-like
  textbox, focus stays on the textbox and the popup surfaces the active option via
  `aria-activedescendant`. A single predicate (`isComboboxControllingPopup`) covers both layouts:
  - **In-popup combobox**: the focused textbox lives inside the popup `container` (the popup is
    rendered as a child of the combobox wrapper).
  - **External combobox**: the focused textbox is rendered OUTSIDE the popup (`react-select`
    pattern, where the listbox is portalled separately from the textbox).

  Acceptance criteria for the focused element:
  - Role / element-type filter: `role="combobox"`, `role="textbox"`, `TEXTAREA`, `contentEditable`,
    or `INPUT` of text-like type (`text`, `search`, `email`, `url`, `tel`, `password`, or
    unspecified). Non-text input types (`button`, `checkbox`, etc.) are rejected.
  - Reference filter: `aria-controls` (or legacy `aria-owns`) IDREFS must resolve to an element that
    IS or CONTAINS the popup container.

  Without this carve-out, moving focus into the listbox would blur the external textbox and cause
  libraries like `react-select` to close the menu on the same interaction that opened it.

  **Considered and rejected: hoisting the carve-out above all role branches.** Doing so would give
  role-undefined popups (e.g. `@atlaskit/react-select`'s `MenuPortalTopLayer`, where the listbox
  role lives on a descendant of a roleless Popover host) an explicit "combobox owns me" guarantee
  instead of relying on the "no role = no focus movement" fall-through. The
  `container.contains(referenced)` wrapper-shape match makes it tempting to apply to all
  popup-shaped roles, but it is over-broad for `dialog` popups that themselves contain a separate
  combobox widget. `@atlaskit/datetime-picker`'s calendar dialog renders `react-select` inside it;
  the active combobox's `aria-controls` resolves to a listbox inside the dialog container, which
  falsely matches the wrapper-shape rule and suppresses the dialog's own focus contract. A per-role
  opt-in for the wrapper-shape match was prototyped and discarded as added complexity for a
  hypothetical future caller — current consumers (`react-select`, `TimePicker`, `DatePicker`) all
  work correctly under the role-specific placement.

- Fires on transitions into a visible phase, tracked via a `prevPhase` ref. Three transitions
  qualify:
  - `closed → entering` (animated path, fresh open).
  - `closed → open` (non-animated path, fresh open).
  - `exiting → entering` (mid-exit reopen). When a user dismisses the popup (Escape, close button,
    light dismiss) the browser natively restores focus to the trigger as part of `hidePopover()` /
    `<dialog>.close()`. If the consumer reopens before the exit transition has settled, the phase
    machine jumps `exiting → entering` without passing through `closed`. Without this branch the
    popup would be visible again with focus stranded on the trigger — a keyboard usability gap for
    menu / dialog / listbox roles.
  - Pure `entering → exiting → entering` stutters where the consumer toggles `isOpen` in the same
    frame are still collapsed: any transition whose previous phase was neither `closed` nor
    `exiting` is rejected.
- Focus moves the instant the host element first becomes visible — not after the entry transition
  settles. APG expects keyboard focus to land on the new menu / dialog the moment it opens, so a
  `transitionend`-gated focus call (~150ms late on a typical entry animation) is a focus-stealing
  hazard: subsequent user input (e.g. an arrow-left to back out of a nested submenu) can land before
  the deferred `focus()` fires, snapping focus back to a now-stale element.
- Synchronous inside `useEffect` — no `requestAnimationFrame` wrapper. The host element is already
  in the top layer when the effect runs (the show layout effect calls `showPopover()` /
  `showModal()` first), so focus and screen-reader announcement land together.
- Only used in `Popover`, not `Dialog`.

#### Known limitation: programmatic reopen with consumer-managed focus

There is a rare programmatic path where a consumer flips `isOpen` false → true mid-exit without any
user-initiated close gesture, and had previously moved focus to a non-default target inside the
popup. In that case the `exiting → entering` branch will re-focus the role-appropriate default (e.g.
first menu item) rather than preserving the consumer-chosen target. This matches the documented
`closed → entering` behavior and is considered acceptable: the alternative (a
`document.activeElement` heuristic) is unreliable across shadow DOM, iframes, and mid-restoration
timing races, and a more correct phase-machine `exitCommitted` design adds significant surface area
for a scenario that has not been observed in practice. Consumers that need to preserve focus across
a programmatic reopen should manage focus themselves after the popup opens.

---

## Focus restoration

Focus restoration is handled by a combination of the browser's native Popover/Dialog APIs and a
narrow internal fallback for nested popovers. Consumers do not pass a ref, do not call
`trigger.focus()`, and do not need to know whether a popover is nested - Popover handles all of it
automatically.

The two primitives use different browser APIs with subtly different behavior on light dismiss, and
the Popover API has a known nested-popover gap that we backfill ourselves.

### Keyboard versus pointer activation (Safari)

Restoration returns focus to whatever was focused when the overlay opened. On the keyboard path
(focus the trigger, then Enter) that is the trigger, so close returns focus to the trigger in
Chrome, Firefox, and Safari alike (verified against WebKit 26 and real Safari 26.5).

Safari does not focus a `<button>` on a pointer click, so a mouse-opened overlay has no trigger
focus to restore and Safari leaves focus on `<body>` on close. This is native Safari behavior for
both `<dialog>` and `[popover]`; Chrome and Firefox focus the button on click, so they restore to
the trigger for pointer activation too. We lean into the platform here rather than normalizing it.

Practical consequence for tests: exercise restoration by opening via the keyboard (focus the
trigger, then Enter), not `trigger.click()`, which never focuses the trigger on Safari.

### Dialog (`<dialog>.close()`) — always restores

`<dialog>.close()` **unconditionally** restores focus to the element that was focused before
`showModal()` was called — regardless of how the close was triggered:

| Dismissal method       | Focus restored? |
| ---------------------- | --------------- |
| **Escape**             | ✅ Yes          |
| **Backdrop click**     | ✅ Yes          |
| **Programmatic close** | ✅ Yes          |

This is because all three paths end with `dialog.close()`, and the
[dialog close algorithm](https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog)
always restores focus. Backdrop clicking a modal dialog is a "dismiss this overlay" gesture — the
user didn't click on a specific element behind it (the backdrop blocks interaction), so restoring
focus to the trigger is the correct behavior.

### Popover (`hidePopover()`) — conditional restoration

The Popover API's restoration depends on how the popover was hidden:

### Browser behavior by dismissal method

| Dismissal method                  | `focusPreviousElement` | Focus restored to trigger?      |
| --------------------------------- | ---------------------- | ------------------------------- |
| **Escape**                        | `true`                 | ✅ Yes                          |
| **Click-outside** (light dismiss) | `false`                | ❌ No — focus stays where it is |
| **Programmatic `hidePopover()`**  | `true`                 | ✅ Yes                          |
| **Another auto popover opens**    | `false`                | ❌ No                           |

### The `previouslyFocusedElement` mechanism

When a popover is shown via `showPopover()`, the browser captures `document`'s focused area as the
popover's `previouslyFocusedElement`. When the popover is hidden, the browser conditionally restores
focus to that element based on the `focusPreviousElement` parameter passed to the hide algorithm.

This restoration happens **synchronously during the hide algorithm**, before the `toggle` event
fires. By the time any event listener or React effect runs, focus has already been restored.

### Why click-outside does NOT restore focus

The HTML Popover spec's light dismiss algorithm explicitly passes `focusPreviousElement=false`. This
is intentional: click-outside is a dismissal gesture where the user clicked on something else. The
browser preserves the user's click context rather than yanking focus back to the trigger.

This is the correct behavior per WCAG — the click event still fires on the clicked element, and
focus stays where the user intended.

### Why Dialog and Popover differ on light dismiss — and why that's correct

This asymmetry is a deliberate platform decision that we lean into, not a bug:

- **Dialog backdrop click**: The `::backdrop` is an opaque overlay that blocks interaction with the
  page. Clicking it is a "dismiss this modal" gesture — the user didn't click on a specific element
  behind the dialog. Restoring focus to the trigger preserves the user's context.

- **Popover click-outside**: Popovers don't block the page. Clicking outside is an "I want to
  interact with something else" gesture. The browser preserves the user's click target rather than
  yanking focus back to the trigger, which respects the user's intent.

### Nested popovers: browser gap and our fallback

**The browser's native restoration only works for the OUTERMOST `popover="auto"`.** When a nested
popover opens on top of an already-open popover, the browser shows it with
`shouldRestoreFocus: false`. On close, no native restoration runs - focus is left wherever it landed
after the close (typically `<body>`, since the closing popover's focused descendant is no longer
focusable).

This is a real WCAG 2.4.3 hazard for nested focus-capturing roles: a keyboard user who opens an
inner `role="dialog"` / `menu` / `listbox` / `alertdialog` inside an outer dialog and presses Escape
would end up on `<body>` instead of returning to the inner trigger. Their next Tab would jump to the
document start, not the next element after the trigger.

To close the gap, `Popover` runs an internal fallback restoration for nested popovers. It is fully
internal - no API surface change for consumers.

#### Mechanism

1. **Snapshot on open.** A `beforetoggle` listener fires synchronously before `showPopover()` runs.
   When `newState === 'open'`, Popover captures `document.activeElement` into an internal ref. This
   happens before `useInitialFocus` moves focus into the popover (`beforetoggle` runs during the
   synchronous `showPopover()` call inside the host-mount layout effect; `useInitialFocus` runs in
   the subsequent `useEffect` pass), so the snapshot reliably captures the trigger.

2. **Restore on close.** In the `toggle` handler (`newState === 'closed'`), Popover restores focus
   to the snapshotted element when ALL of these are true:
   - A snapshot exists and the element is still in the DOM (`isConnected`).
   - The role moved focus into the popover on open (`shouldFocusIntoPopover({ role })` is `true`).
     This filters out passive roles like `tooltip` / `note` / `status`, where there is nothing to
     restore.
   - The close reason was `escape` or `programmatic`. Light dismiss (click-outside) is intentionally
     skipped to match native `focusPreviousElement=false` semantics.

3. **No-op when not needed.** For outermost popovers, the browser has already restored focus by the
   time the `toggle` event fires, so the manual restore lands harmlessly on the already-focused
   trigger. For passive roles, the role guard short-circuits. For programmatic-toggle-via-trigger
   (the click-toggle pattern), focus is already on the trigger when restore runs, again harmless.

#### Browser timing (verified via Playwright diagnostic, both Chromium and Firefox)

Event order for `Escape` on a nested `role="menu"`:

```
inner:beforetoggle:closed   active = inner-focusable (Chromium) | body (Firefox)
inner:focusout              active = body
outer:focusout              active = body
outer:focusin               active = inner-trigger          ← restoration fires
inner:onClose               active = inner-trigger
inner:toggle:closed         active = inner-trigger
```

- **Chromium**: between `beforetoggle:closed` and `toggle:closed`, focus migrates from the inner
  popover descendant → `body` → restored trigger. Our fallback fires in the `toggle:closed` handler
  and the trigger is correctly focused.
- **Firefox**: `beforetoggle:closed` fires with active already on `body`. Firefox does not natively
  restore for nested popovers at all. Our fallback fires in `toggle:closed` and is the only reason
  focus returns to the trigger. **Without this fallback, every nested dismiss on Firefox would leave
  focus on `<body>`.**

Event order for click-outside (light dismiss) on a nested popover:

```
inner:focusout                active = body
outer:focusout                active = body
inner:beforetoggle:closed     active = body
outer:beforetoggle:closed     active = body   ← outer also closes (auto-stack dismiss)
inner:onClose                 active = body
inner:toggle:closed           active = body
outer:onClose                 active = body
outer:toggle:closed           active = body
```

- Light dismiss collapses the entire auto stack in one event sequence.
- `closeReasonRef` stays `'light-dismiss'`, our restore short-circuits, and `body` keeps focus -
  matching the spec's `focusPreviousElement=false` behavior. The user's click target retains focus
  (in the diagnostic the click target is `body`; in real product code it is usually another
  interactive element).

#### Roles covered

The fallback runs for any role where `shouldFocusIntoPopover` returns `true`: `dialog`,
`alertdialog`, `menu`, `listbox`, `tree`, `grid`. In practice `useInitialFocus` only moves focus for
`dialog` / `alertdialog` / `menu` / `listbox` today, so the restore is meaningful for those four.
`tree` and `grid` are in the role set but `useInitialFocus` does not yet implement them - the
restore is harmless (the trigger keeps focus naturally if nothing moved it). Closing that gap is
tracked separately.

### What top-layer does (and doesn't do)

**The browser handles restoration for outermost popovers; Popover handles restoration for nested
ones.** Both paths are internal - consumers do not opt in, opt out, or wire any prop.

**Consumers should not manually restore focus.** Consumers should **not** call `trigger.focus()` in
their `onClose` handlers. Either the browser or Popover handles it. Manual focus calls will either:

1. **Double-focus** the trigger (if the browser already restored).
2. **Incorrectly restore** on click-outside (both the browser and Popover deliberately do not
   restore, but a manual call would).

### When custom focus handling IS needed

The only case where custom focus code is appropriate is when a consumer needs to redirect focus to a
**different element** than the trigger on close. For example, `dropdown-menu`'s `returnFocusRef`
prop focuses a different element after the menu closes.

In that case, the consumer should call `returnFocusRef.current?.focus()` in `onClose` via
`requestAnimationFrame`. This runs after both the browser's native restoration and Popover's
internal fallback, and effectively overrides whatever they did.

---

## Role-to-behavior summary

### By role (Popover primitive)

| Role            | Initial Focus           | Focus Wrapping              | Restoration (Escape, outermost)   | Restoration (Escape, nested)               | Restoration (click-outside) |
| --------------- | ----------------------- | --------------------------- | --------------------------------- | ------------------------------------------ | --------------------------- |
| `dialog`        | First focusable element | Tab wraps within content    | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `alertdialog`   | First focusable element | Tab wraps within content    | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `menu`          | First menu item         | No Tab wrapping (Tab exits) | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `listbox`       | First/selected option   | No Tab wrapping (Tab exits) | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `tree` / `grid` | Not yet implemented     | No wrapping                 | ✅ Browser restores               | ⚠️ Fallback runs but `useInitialFocus` gap | ❌ No restoration           |
| `tooltip`       | No focus change         | No wrapping                 | ❌ No restoration (nothing moved) | ❌ No restoration (nothing moved)          | ❌ No restoration           |

### Dialog primitive (`<dialog>.showModal()`)

| Concern           | Behavior                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| Initial focus     | Native `showModal()` algorithm: `[autofocus]` element, or first focusable   |
| Focus wrapping    | `useFocusWrap` hook — Tab cycles within content (overrides native body hop) |
| Focus restoration | Always restores to trigger — Escape, backdrop click, and programmatic close |

---

## Contrast: Dialog vs Popover

| Concern            | Dialog (`<dialog>`)               | Popover (`<div popover>`)                        |
| ------------------ | --------------------------------- | ------------------------------------------------ |
| **Initial focus**  | Native `showModal()` — consistent | `useInitialFocus` hook — fills a Popover API gap |
| **Focus wrapping** | `useFocusWrap` hook               | `useFocusWrap` hook (same)                       |
| **Focus restore**  | Native `dialog.close()` — always  | Native Popover API — conditional on dismiss type |

Initial focus is the only area where the two primitives use different strategies: Dialog relies on
native `showModal()` (which is consistent across browsers), while Popover requires the custom
`useInitialFocus` hook because `showPopover()` does not auto-focus without `autofocus`.

Focus restoration differs in behavior on light dismiss: `dialog.close()` always restores (backdrop
click is a dismiss gesture against an opaque overlay), while the Popover API deliberately does not
restore on click-outside (the user clicked on something else). See
[Why Dialog and Popover differ on light dismiss](#why-dialog-and-popover-differ-on-light-dismiss--and-why-thats-correct)
above.

## Spec references

- **HTML Living Standard — Popover API**: https://html.spec.whatwg.org/multipage/popover.html
  - Show algorithm: captures `previouslyFocusedElement`
  - Hide algorithm: conditionally restores via `focusPreviousElement` parameter
  - Light dismiss: passes `focusPreviousElement=false`
  - Close watcher (Escape): passes `focusPreviousElement=true`
- **WCAG 2.4.3 Focus Order**: focus order must preserve meaning and operability
- **WAI-ARIA APG Dialog pattern**: focus returns to the invoking element on close

## Browser support

All current engines (Chrome, Firefox, Safari) implement the Popover API focus restoration for the
**outermost** popover identically. For **nested** popovers, Chromium follows the spec
(`shouldRestoreFocus: false`, browser does nothing), and Firefox does the same - but in both cases
the nested popover would be left without focus restoration if we did nothing. Popover's internal
fallback covers both browsers and was verified via Playwright diagnostic (see Browser timing above).

## Related files

- `src/internal/use-focus-wrap.tsx` — focus wrapping hook
- `src/internal/use-initial-focus.tsx` — initial focus hook
- `src/internal/role-types.tsx` — `shouldFocusIntoPopover` role predicate
- `src/popover/popover.tsx` — Popover primitive (owns nested-popover focus restoration fallback via
  `beforetoggle` snapshot)
- `examples/130-testing-native-focus-restoration.tsx` — outermost native restoration fixture
- `examples/140-testing-nested-focus-restoration.tsx` — nested restoration fixture covering
  dialog/alertdialog/menu/listbox/tooltip roles
- `__tests__/playwright/native-focus-restoration.spec.tsx` — outermost browser tests
- `__tests__/playwright/nested-focus-restoration.spec.tsx` — nested browser tests (Escape /
  programmatic / click-outside per role, Chromium + Firefox)
