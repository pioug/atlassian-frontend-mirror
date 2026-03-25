# Focus Management

Focus management in `@atlaskit/top-layer` covers three areas: focus wrapping, initial focus
placement, and focus restoration. This document explains the decisions and implementation for each.

---

## Focus wrapping for dialogs

### Problem

Native `<dialog>.showModal()` wraps focus through `<body>` at the boundary: `A → B → C → body → A`. The [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) requires direct wrapping: `A → B → C → A`. This is consistent across all major browsers (Chrome, Firefox, Safari, Edge) — it's how the [sequential focus navigation algorithm](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation) works, not a browser bug.

Popovers with `role="dialog"` have no native focus wrapping at all — Tab freely escapes to background content.

### Decisions

- **Popovers with `role="dialog"` or `role="alertdialog"` get focus wrapping.** Tab/Shift+Tab cycle within the popover. Light dismiss (Escape, click outside) still works via `popover="auto"`. Sources: [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN `dialog` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role).

- **Popovers with other roles do not get focus wrapping.** Focus is allowed to leave the popover, and it stays open. The [popover spec](https://open-ui.org/components/popover.research.explainer/#focus-management) does not prescribe focus trapping — it's the `role="dialog"` that requires wrapping. Other roles have their own keyboard patterns (e.g. [menus use arrow keys](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), not Tab).

- **`Dialog` (`<dialog>.showModal()`) also uses focus wrapping.** Overrides the native `<body>` intermediate step. We could get away with the native behavior, but it's right to be fully spec compliant and to align keyboard behavior across all dialogs.

### Implementation

`useFocusWrap` hook (`src/internal/use-focus-wrap.tsx`):

- Intercepts `Tab` and `Shift+Tab` (capture phase, `preventDefault()`)
- Remaps them to `getNextFocusable({ container, direction })`, which handles wrapping
- Used in `Popover` (active when role is `'dialog'` or `'alertdialog'`) and `Dialog` (always active)

---

## Initial focus

### Problem

When a dialog or popover opens, focus needs to move to an appropriate element inside it ([WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)). The question is whether native browser behavior handles this for us, or whether we need custom logic.

### What the browser gives us natively

**`<dialog>.showModal()` handles initial focus completely.** The [dialog focusing steps](https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps) algorithm:

1. If a descendant has `autofocus`, focus it
2. Otherwise, focus the first focusable descendant
3. If no focusable descendants, focus the `<dialog>` element itself

This covers every case. No custom code needed.

**`showPopover()` does NOT auto-focus the first focusable child.** The [popover focusing steps](https://html.spec.whatwg.org/multipage/popover.html#popover-focusing-steps) algorithm only moves focus when:

1. The popover element itself has `autofocus`, OR
2. A descendant has `autofocus` (the "autofocus delegate")

Without `autofocus`, focus stays on the trigger — regardless of role. Independently verified in Chromium:

| Scenario | Native `showPopover()` behavior | APG requirement | Gap? |
|---|---|---|---|
| `role="dialog"`, no `autofocus` | Focus stays on trigger | Focus first focusable | **Yes** |
| `role="dialog"`, child has `autofocus` | Focuses the autofocus child | Focus autofocus child | No |
| `role="menu"` | Focus stays on trigger | Focus first menu item | **Yes** |
| `role="listbox"`, selected option | Focus stays on trigger | Focus selected option | **Yes** |
| `role="tooltip"` | Focus stays on trigger | No focus movement | No |

### Why not just use the `autofocus` attribute?

We can't replace the hook with static `autofocus` attributes because:

- **First focusable is dynamic.** It depends on rendered content, not something known at author time.
- **Role-specific logic.** Different roles need different targets: `dialog` → first focusable, `listbox` → selected option (`[aria-selected="true"]`), `tooltip` → nothing.
- **Consumer `autofocus` must still work.** If a consumer places `autofocus` on a specific element, that should win — the hook checks for `[autofocus]` first, then falls back.

### React 18 `autoFocus` caveat

React 18's `autoFocus` JSX prop does **not** set the HTML `autofocus` attribute or the DOM `.autofocus` property. It only calls `.focus()` imperatively during the commit phase, which silently fails on hidden popover content (the popover hasn't been shown yet at commit time).

**Consumers who want autofocus inside a popover must set the native attribute themselves**, for example via a ref callback:

```tsx
const autofocusRef = useCallback((node: HTMLButtonElement | null) => {
  if (node) {
    node.setAttribute('autofocus', '');
  }
}, []);

<button ref={autofocusRef}>Focused on open</button>
```

React 19+ reflects the `autoFocus` JSX prop as the HTML `autofocus` attribute, so this workaround is only needed for React 18.

For `Dialog` (which uses `showModal()`), the same ref callback pattern applies — the browser's dialog focusing steps look for the HTML `autofocus` attribute.

### Decisions

- **`Dialog` does not use `useInitialFocus`.** Native `showModal()` handles it. This is correct — no changes needed.
- **`Popover` uses `useInitialFocus`.** This fills a genuine gap in the Popover API. Without it, `role="dialog"`, `role="menu"`, and `role="listbox"` popovers violate WCAG 2.4.3.

### Implementation

`useInitialFocus` hook (`src/internal/use-initial-focus.tsx`):

- On open, resolves the correct focus target based on role:
  - `dialog` / `alertdialog`: `[autofocus]` element, or first focusable
  - `menu`: first focusable (menu item)
  - `listbox`: `[aria-selected="true"]` option, or first focusable
  - `tooltip` / no role: no focus movement
- Uses `requestAnimationFrame` to avoid racing with the popover show sequence
- Only used in `Popover`, not `Dialog`

---

## Focus restoration

Focus restoration is handled **natively by the browser's Popover API**. No custom hooks or manual `element.focus()` calls are needed for `popover="auto"` or `popover="hint"`.

### Browser behavior by dismissal method

| Dismissal method              | `focusPreviousElement` | Focus restored to trigger? |
| ----------------------------- | ---------------------- | -------------------------- |
| **Escape**                    | `true`                 | ✅ Yes                     |
| **Click-outside** (light dismiss) | `false`            | ❌ No — focus stays where it is |
| **Programmatic `hidePopover()`** | `true`              | ✅ Yes                     |
| **Another auto popover opens** | `false`               | ❌ No                      |

### The `previouslyFocusedElement` mechanism

When a popover is shown via `showPopover()`, the browser captures
`document`'s focused area as the popover's `previouslyFocusedElement`.
When the popover is hidden, the browser conditionally restores focus
to that element based on the `focusPreviousElement` parameter passed
to the hide algorithm.

This restoration happens **synchronously during the hide algorithm**,
before the `toggle` event fires. By the time any event listener or
React effect runs, focus has already been restored.

### Why click-outside does NOT restore focus

The HTML Popover spec's light dismiss algorithm explicitly passes
`focusPreviousElement=false`. This is intentional: click-outside is
a dismissal gesture where the user clicked on something else. The
browser preserves the user's click context rather than yanking focus
back to the trigger.

This is the correct behavior per WCAG — the click event still fires
on the clicked element, and focus stays where the user intended.

### What top-layer does (and doesn't do)

**We do nothing for focus restoration.** The `Popup` compound component and `Popover` primitive rely entirely
on the browser's native focus restoration. There is no custom hook or manual `trigger.focus()` call.

**Consumers should not manually restore focus.** Consumers should **not** call `triggerRef.current?.focus()` in their
`onClose` handlers. The browser handles it. Manual focus calls will either:

1. **Double-focus** the trigger (if the browser already restored)
2. **Incorrectly restore** on click-outside (the browser deliberately
   didn't restore, but your manual call would)

### When custom focus handling IS needed

The only case where custom focus code is appropriate is when a consumer
needs to redirect focus to a **different element** than the trigger on
close. For example, `dropdown-menu`'s `returnFocusRef` prop focuses a
different element after the menu closes.

In that case, the consumer should call `returnFocusRef.current?.focus()`
in `onClose` via `requestAnimationFrame`. This runs after the browser's
native restoration and effectively overrides it.

---

## Role-to-behavior summary

| Role | Initial Focus | Focus Wrapping | Focus Restoration |
| --- | --- | --- | --- |
| `dialog` / `alertdialog` | First focusable element | Tab wraps within content | ✅ Auto-restores to trigger |
| `menu` | First menu item | No Tab wrapping (Tab exits) | ✅ Auto-restores to trigger |
| `listbox` | First/selected option | Tab wraps within content | ✅ Auto-restores to trigger |
| `tooltip` | No focus change | No wrapping | ❌ No restoration |

---

## Contrast: initial focus vs focus restoration

Unlike focus restoration (where we rely entirely on native browser behavior), initial focus is a real gap in the Popover API that requires our custom `useInitialFocus` hook.

## Spec references

- **HTML Living Standard — Popover API**: https://html.spec.whatwg.org/multipage/popover.html
  - Show algorithm: captures `previouslyFocusedElement`
  - Hide algorithm: conditionally restores via `focusPreviousElement` parameter
  - Light dismiss: passes `focusPreviousElement=false`
  - Close watcher (Escape): passes `focusPreviousElement=true`
- **WCAG 2.4.3 Focus Order**: focus order must preserve meaning and operability
- **WAI-ARIA APG Dialog pattern**: focus returns to the invoking element on close

## Browser support

All current engines (Chrome, Firefox, Safari) implement the Popover API
focus restoration behavior identically. No polyfills or workarounds needed.

## Related files

- `src/internal/use-focus-wrap.tsx` — focus wrapping hook
- `src/internal/use-initial-focus.tsx` — initial focus hook
- `src/popover/popover.tsx` — the low-level Popover primitive (no focus restoration code)
- `src/popup/popup-content.tsx` — the Popup compound's Content component
- `examples/130-testing-native-focus-restoration.tsx` — test fixture
- `__tests__/playwright/native-focus-restoration.spec.tsx` — browser tests
