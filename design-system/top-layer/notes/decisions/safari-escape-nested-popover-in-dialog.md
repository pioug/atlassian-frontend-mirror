# Safari: Escape in a nested popover closes the parent dialog

## Status

**RESOLVED (2026-07-13).** Fixed with a keydown-time "nested popover open" snapshot that the
dialog's `cancel` handler consults. The logic is encapsulated in the `useSafariEscapeFix` hook
(`src/internal/use-safari-escape-fix.tsx`), consumed by `src/dialog/dialog-content.tsx`, and is
gated behind `isSafari()` so the listener and the per-Escape query are never bound on engines that
do not need the workaround. Verified directly against **real Safari 26.5 (WebKit 605.1.15) on macOS
26.5.1**, plus the Playwright integration suite on Chromium / Firefox / WebKit.

This was failure #3 from the WebKit integration triage on branch
`areardon/top-layer-hardening-safari`. Failures #1 and #2 (missing exit animations on WebKit) are
cosmetic and remain skipped on WebKit in `__tests__/playwright/animation-lifecycle.spec.tsx`. #3 was
a functional accessibility / dismiss-behaviour bug, and is fixed here.

Related reading: [`dialog-close-flow.md`](./dialog-close-flow.md) and
[`safari-popover-flex-collapse.md`](./safari-popover-flex-collapse.md) (the sibling Safari top-layer
issue on this branch).

---

## The problem

When a `popover="auto"` (for example a menu) is open **inside** a modal `<dialog>`, pressing
`Escape` should dismiss only the popover (the topmost top-layer element) and leave the dialog open,
returning focus to the popover trigger.

- **Chromium / Firefox:** correct. Escape closes only the popover; the dialog stays open.
- **WebKit / Safari:** the same Escape **also closed the parent `<dialog>`**. The user lost the
  whole modal when they only meant to dismiss the menu inside it.

A dropdown / menu / select inside a modal is a common pattern, so the Safari impact was real.

---

## Confirmed on real Safari 26.5 (not just Playwright WebKit)

Playwright's bundled WebKit can diverge from shipping Safari, so the behaviour was probed **directly
on real Safari 26.5** with an instrumented page driving a genuine Escape keypress. Event trace for
one Escape in a modal `<dialog>` containing an open `popover="auto"` menu:

| #   | event                                      | `:popover-open` |  `dialog.open`  |
| --- | ------------------------------------------ | :-------------: | :-------------: |
| 1   | `keydown` Escape (capture)                 |    **true**     |      true       |
| 2   | popover `beforetoggle` → closed            |      true       |      true       |
| 3   | dialog `cancel` (`target===currentTarget`) |    **false**    |      true       |
| 4   | popover `toggle` → closed                  |      false      | closed (native) |

Confirmed facts on real Safari 26.5:

- **The bug reproduces** — Safari fires the dialog `cancel` on the same Escape and, natively, closes
  the dialog. It is not a stale-WebKit / Playwright artifact.
- **By the time `cancel` fires, the popover is already closed** (`:popover-open` is `false`). This
  is the critical detail that dictates the fix (below).

---

## Root cause (mechanism)

On a single Escape, Safari dismisses the top-most popover **and** (against the spec's "close the
topmost top-layer element" ordering) dispatches the native `cancel` event on the ancestor
`<dialog>`. Chromium and Firefox suppress the dialog `cancel` while a popover is the topmost
top-layer element; Safari does not.

The dialog's `cancel` handler then closes the dialog. The pre-existing `target !== currentTarget`
guard (added for nested `<dialog>` inside `<dialog>`) does not help: the nested element is a
**popover**, not a dialog, so `cancel` fires on the dialog itself (`target === currentTarget`).

---

## The fix

Snapshot, at Escape **keydown** — which always runs before the browser's close default action —
whether a light-dismissable (`auto`/`hint`) popover is open **inside** this dialog. `handleCancel`
consults that snapshot and, when set, keeps the dialog open (the popover's own native light-dismiss
handles the Escape). The logic is encapsulated in the `useSafariEscapeFix` hook
(`src/internal/use-safari-escape-fix.tsx`) and gated behind `isSafari()`, so the listener and the
per-Escape query never run on non-WebKit engines:

```tsx
// src/internal/use-safari-escape-fix.tsx (consumed by dialog-content.tsx)
const childPopoverOpenAtEscapeRef = useRef(false);

useEffect(() => {
	if (!isSafari()) return; // gate: no listener bound on non-WebKit engines
	const dialog = dialogRef.current;
	if (!dialog) return;
	// Bind to `document`, not the dialog: on Safari focus can be on `<body>`
	// (see "Focus return" below), where a dialog-scoped listener would not fire.
	// The query stays scoped to this dialog's subtree.
	return bind(document, {
		type: 'keydown',
		listener(event) {
			if (event.key !== 'Escape') return;
			try {
				childPopoverOpenAtEscapeRef.current = Boolean(
					dialog.querySelector('[popover="auto"]:popover-open, [popover="hint"]:popover-open'),
				);
			} catch {
				childPopoverOpenAtEscapeRef.current = false; // :popover-open unsupported (older Safari)
			}
		},
		options: { capture: true },
	});
}, [dialogRef, isVisible]);

// The hook returns `{ shouldIgnoreEscape }`; handleCancel consults it after the
// existing target guard + preventDefault():
function shouldIgnoreEscape() {
	if (childPopoverOpenAtEscapeRef.current) {
		childPopoverOpenAtEscapeRef.current = false;
		return true; // keep the dialog open; the popover consumed the Escape
	}
	return false;
}
```

Notes:

- **Scoped to `auto`/`hint`**, not any `:popover-open`. A `manual` popover ignores Escape, so a
  plain Escape should still close the dialog when only a `manual` popover is open.
- **Scoped to the dialog's own subtree.** A modal `<dialog>` inerts everything outside its subtree,
  so an interactive nested popover must be a DOM descendant, and `Popover` renders in place (no
  portal). A popover portalled outside the dialog subtree would not be found — a documented
  limitation.
- **Listener on `document`, query scoped to the dialog.** The keydown listener is bound to
  `document` (capture), not the dialog. On Safari focus can sit on `<body>` after a mouse-opened
  popover (a `<button>` is not focused on click — see "Focus return" below), and a dialog-scoped
  listener would not fire there, leaving the snapshot stale so the dialog would wrongly close.
  Binding to `document` captures the Escape regardless of focus location; the `:popover-open` query
  remains scoped to this dialog's subtree, so the snapshot still reflects only popovers inside this
  dialog.
- Chromium / Firefox suppress the dialog `cancel` while a popover is topmost, so the guard is inert
  there by construction. It is **additionally** gated behind `isSafari()`, so the listener and the
  per-Escape query are never even bound off WebKit — the workaround does not run where it is not
  needed. `isSafari()` (from `@atlaskit/ds-lib/is-safari`: `safari` present in the UA, `chrome`
  absent) errs broad on purpose — it also matches iOS Chrome and iOS Firefox, which are WebKit and
  share the bug. The failure modes are asymmetric (a false positive runs inert code; a false
  negative reintroduces the bug), so broad detection is the safe bias.

### Why a keydown snapshot, and NOT a query inside `handleCancel`

An earlier sketch queried `dialog.querySelector(':popover-open')` _inside_ `handleCancel`. The
real-Safari trace above shows why that fails: at `cancel` time (row 3) the popover is **already
closed**, so the query finds nothing and the guard misses every time. Sampling at keydown captures
the popover while it is still open (row 1). This is race-free by construction and does not depend on
Safari's internal `cancel`-vs-dismiss ordering.

---

## Deeper nesting: dialog → popover → popover

A follow-up probe checked whether the guard still holds, and whether Safari diverges, when a modal
`<dialog>` contains an `auto` popover that itself contains a second nested `auto` popover. The worry
was that a single Escape in Safari might collapse the whole popover stack, or close the dialog while
a popover was still open.

With all three top-layer levels open, the ground-truth top-layer state (`:popover-open` per level,
the total open-popover count, and `dialog.open`) was sampled after each Escape. Playwright Chromium,
Firefox, and WebKit all behaved identically:

| Escape           | inner popover | outer popover | dialog |
| ---------------- | :-----------: | :-----------: | :----: |
| (all three open) |     open      |     open      |  open  |
| 1st              |    closed     |     open      |  open  |
| 2nd              |    closed     |    closed     |  open  |
| 3rd              |    closed     |    closed     | closed |

- **Safari does not close them all on one Escape.** Each Escape dismisses exactly one top-layer
  level, topmost first (inner popover, then outer popover, then the dialog), the same as Chromium
  and Firefox. Safari does not collapse the popover stack.
- **The dialog is never lost while a popover is open.** On the first and second Escape an `auto`
  popover is open inside the dialog at keydown, so the keydown snapshot keeps the dialog open. Only
  the third Escape, once no popover remains, closes the dialog. The guard therefore holds for any
  popover nesting depth, because it samples "is any auto/hint popover open inside this dialog", not
  a specific level.

Measured on Playwright WebKit, which faithfully reproduced the original single-nested bug (verified
against real Safari 26.5 above), so it is a trustworthy proxy for this behaviour class.

---

## Focus return — mouse vs keyboard (the real WebKit difference)

After a top-layer element is dismissed, focus should return to its trigger (WCAG 2.4.3 Focus Order).
Whether it does depends on **how the trigger was activated**, because of a macOS platform behaviour:

> **macOS Safari does not focus a `<button>` on click** (AppKit convention — only form fields focus
> on click). Keyboard activation _does_ focus it.

Probed directly on real Safari 26.5: a real click on a `<button>` leaves
`document.activeElement === <body>` (`clickFocusedTrigger: false`), so focus restoration after
dismissal returns to `<body>`, **not** the trigger. Keyboard activation (`focus()` + Enter) focuses
the trigger, and restoration then returns to it — verified on real Safari for both the Popover
`previouslyFocused.focus()` path and native `<dialog>.close()`.

| open via                 | Chromium / Firefox (Linux)                      | macOS Safari / WebKit                                   |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------- |
| mouse click              | click focuses button → focus returns to trigger | click does NOT focus button → focus returns to `<body>` |
| keyboard (focus + Enter) | trigger focused → focus returns to trigger      | trigger focused → focus returns to trigger              |

So a focus-return test opened via **mouse** asserts a result that only holds where the platform
focuses buttons on click (Chromium/Firefox), and fails on macOS Safari. Opened via **keyboard** it
is correct on every engine.

### Test structure: parametrize every focus test over interaction modality

Rather than skip focus coverage on WebKit, **every focus test is generated once per interaction
modality** via a shared `TScenario` abstraction
(`__tests__/playwright/focus-interaction-scenarios.tsx`):

- `focusInteractionScenarios = [{ method: 'mouse', activate: click }, { method: 'keyboard', activate: focus + Enter }]`.
- Each focus test loops over it, producing `… (mouse)` and `… (keyboard)` variants.
- The **mouse** variant is `test.fixme`'d on WebKit
  (`scenario.skipFocusRestorationOnWebKit && browserName === 'webkit'`) — Safari does not focus
  buttons on click, so mouse focus-return does not apply there.
- The **keyboard** variant runs on **all** browsers including WebKit — the meaningful WCAG 2.4.3
  coverage (focus order matters for keyboard users), and it passes on real Safari.

Specs parametrized: `nested-layers`, `dialog`, `popover-dialog-focus-trap`, `focus-restore`,
`native-focus-restoration`, `manual-popover-focus`, `nested-focus-restoration`,
`activation-focus-restore`. (`initial-focus-rapid-toggle` is a mouse rapid-toggle stability test
whose interactability check now uses `focus()` rather than `click()`, so it is cross-browser without
a skip.)

The dialog-close fix is _additionally_ guarded, independent of focus, by `nested-layers.spec.tsx` →
_"Escape in a nested popover keeps the dialog open and closes only the popover"_, which asserts only
dismiss/visibility and runs on all browsers including WebKit.

> **Correction note.** An earlier iteration concluded focus-return "works on real Safari but
> Playwright WebKit can't observe it" and blanket-`fixme`'d these on WebKit. That was wrong — it was
> measured with an explicit `element.focus()` probe, which masked the click-vs-keyboard distinction.
> A click-based probe on real Safari 26.5 showed the trigger is never focused by a click, so mouse
> focus-return genuinely does not hold on Safari. The modality split above is the correct model.

### Out of scope (separate, pre-existing WebKit issues)

The full WebKit run also surfaces two unrelated pre-existing issues, **not** addressed here:

- **35s "Page closed" timeouts** on some interactive WebKit tests (Playwright-WebKit stability /
  close-hang; intermittent, retry mitigates).
- **`animation-lifecycle` entry-animation** on WebKit.

---

## Consumers

The top-layer `Dialog` primitive is consumed (behind the `platform_dst_top_layer` gate) by
`@atlaskit/modal-dialog` (`internal/components/modal-wrapper.tsx`) and `@atlaskit/drawer`
(`drawer-panel/drawer-top-layer.tsx`). The fix is transparent to them: a plain Escape still closes
the dialog; an Escape while a nested `auto`/`hint` popover is open dismisses the popover first and
keeps the dialog open — which is what these consumers already get on Chromium/Firefox. This is a
pure behaviour change (event handling only) with no rendering impact, so it does not affect any
dialog VR snapshot.

---

## Verification

- **Real Safari 26.5 probe** — dialog stays open, popover closes, focus returns to the trigger.
- **Playwright integration** (`nested-layers.spec.tsx`, popover-in-dialog) — green on Chromium /
  Firefox / WebKit.
- **Dialog unit tests** (`__tests__/unit/dialog.tsx`) — pass (no regression from the new listener).
- **Targeted typecheck** of the package — passes.

---

## Upstream

The spec-correct behaviour is that Escape closes only the topmost top-layer element: each close
request drives a single close watcher, and both a modal `<dialog>` and an `auto`/`hint` popover
establish one (HTML "close requests and close watchers"). Chromium and Firefox conform; WebKit does
not, cancelling the ancestor `<dialog>` on the same Escape.

Filed as WebKit bug [319355](https://bugs.webkit.org/show_bug.cgi?id=319355) with a minimal native
repro, under the active meta [263305](https://bugs.webkit.org/show_bug.cgi?id=263305) ("[meta]
Implement close requests and close watchers", REOPENED). No upstream WPT covers a popover nested in
a dialog. The related fixed change [315206](https://bugs.webkit.org/show_bug.cgi?id=315206)
("Replace escapeKeyHandler with processCloseWatchers") is an unrelated refactor plus an
untrusted-event fix, gated behind `closeWatcherEnabled`; its tests exercise dialog and popover
separately and never nest them.

Removal trigger: drop this guard once WebKit bug
[319355](https://bugs.webkit.org/show_bug.cgi?id=319355) is fixed in shipping Safari (Escape then
closes only the topmost top-layer element for a nested popover in a dialog). Re-run the native probe
to confirm.

---

## References

- Fix: `src/internal/use-safari-escape-fix.tsx` (the `useSafariEscapeFix` hook: `isSafari()` gate,
  keydown snapshot, and the `cancel` predicate), consumed by `src/dialog/dialog-content.tsx`
  (`handleCancel`)
- Regression tests: `__tests__/playwright/nested-layers.spec.tsx` (popover-in-dialog)
- Example: `examples/97-testing-popover-in-dialog.tsx`
- Popover Escape tagging: `src/popover/popover.tsx`
- Dialog close semantics: [`dialog-close-flow.md`](./dialog-close-flow.md)
- Sibling Safari issue: [`safari-popover-flex-collapse.md`](./safari-popover-flex-collapse.md)
- Originally detected in `default-platform-integration-tests`, branch
  `areardon/top-layer-hardening-safari`.
