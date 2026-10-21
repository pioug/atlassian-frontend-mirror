# Follow-up: Escape with focus on `<body>` in an open Dialog

**Status:** Done. With focus on `<body>`, the `Dialog` that focus was last in takes the Escape. It
matches legacy ModalDialog and Drawer: one ask per key press, no forced close, in every browser.

## What we did

Only the top modal can hold focus (the rest of the page is inert), so the dialog that focus was last
in is the top modal. Each `Dialog` records on `focusin` (on `window`, capture phase) whether the
nearest `<dialog>` that contains the focused element is itself. On an Escape `keydown` whose target
is `<body>` or `<html>`, the `Dialog` with that record takes it, as for focus in the dialog. See
`use-escape-keydown.tsx` and
[`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

Why `focusin`, and not the event when focus leaves: removing the focused element fires no event in
Firefox and WebKit. Measured with Playwright 1.57, 2026-10-19 (a focused `<button>` in an open modal
`<dialog>` is removed):

| Browser      | Events on removal                          | Focus after |
| ------------ | ------------------------------------------ | ----------- |
| Chromium 143 | `blur`, `focusout` (`relatedTarget: null`) | `<body>`    |
| Chrome 155   | `blur`, `focusout` (`relatedTarget: null`) | `<body>`    |
| Firefox 144  | none                                       | `<body>`    |
| WebKit 26    | none                                       | `<body>`    |

Why not document order (the last `:modal` dialog, as in c551744): it is wrong when a modal that is
earlier in the document opens above a later one. A unit test covers this case.

What remains:

- Focus was last in a popover outside every `Dialog`, then its focused element is removed: no
  `Dialog` takes the Escape. The browser makes a close request, and the `cancel` fallback asks (and
  can force a close). This is rare.
- A nested dialog closes and focus restoration fails (the trigger was removed): focus is on
  `<body>`, but the record was on the closed inner dialog, so no `Dialog` takes the Escape. Also
  rare.
- Focus is not moved back into the dialog. The focus fixup below is still a possible a11y gain.

## Context (before the fix)

`Dialog` took the Escape `keydown` only when the first `<dialog>` or open popover on the composed
path from the focused element was this dialog. With focus on `<body>`, there is no `<dialog>` on the
path, so the browser sent a close request to the top modal, and the `cancel` fallback asked.

## The problem (before the fix)

Focus goes to `<body>` when the focused element is removed (for example a button that removes
itself, or a list item that is deleted). Then:

- Chrome 126+ and Firefox 149+: the first Escape asks through `cancel`. The second Escape gets a
  `cancel` that is not cancelable (the close-watcher rule: no user input since the last refused
  close request; an Escape does not count, and waiting does not reset it). The dialog force-closes,
  after `onClose` runs. A refusing modal closes. If the dialog opened without user input (for
  example after a fetch), the first Escape is forced.
- Safari: each Escape asks through `cancel`. A held key asks on every repeat, because `cancel` has
  no `repeat` flag. This changes when Safari ships close watchers (WebKit has them in Technology
  Preview).
- Firefox before 149 (the rule is off by default) acts as Safari does.

Legacy ModalDialog and Drawer listen for `keydown` on `window`. They ask once per key press and
never force-close, wherever focus is. So the top-layer path differs from legacy only while focus is
on `<body>`. While focus is in the dialog, "refuse forever" holds in every browser.

## Measured behaviour (before the fix)

Playwright 1.57 (Chromium 143, Firefox 144, WebKit 26), 2026-10. Firefox 144 does not apply the
close-watcher rule by default. Firefox 149+ does, so it gives the Chromium result. A raw modal
`<dialog>` with a `cancel` listener that calls `preventDefault()` when it can, and the ADS fixtures
(`examples/166-testing-dialog-escape-refused.tsx`, ModalDialog
`examples/104-testing-escape-refused.tsx`).

| Action                                               | Chromium            | Firefox                | WebKit              |
| ---------------------------------------------------- | ------------------- | ---------------------- | ------------------- |
| Click text or a heading in the dialog                | focus on `<dialog>` | focus on `<dialog>`    | focus on `<dialog>` |
| Click a button in the dialog                         | focus on the button | focus on the button    | focus on `<dialog>` |
| Remove the focused element                           | focus on `<body>`   | focus on `<body>`      | focus on `<body>`   |
| 20 Escapes on `<body>` (`cancel` events)             | 2, then forced      | 20 (149+: as Chromium) | 20                  |
| 20 held Escapes on `<body>` (`cancel` events)        | 2, then forced      | 20 (149+: as Chromium) | 20                  |
| Remove the focused element, `<dialog tabindex="-1">` | focus on `<body>`   | focus on `<body>`      | focus on `<body>`   |

A click on content that cannot take focus does **not** move focus to `<body>`. Each engine focuses
the `<dialog>`, so `Dialog` takes the Escape. The browser tests
`after a click on text in the dialog, focus is on the dialog and it asks once per press`
(`__tests__/playwright/dialog.spec.tsx`) and `after a click on the title` (ModalDialog
`top-layer-escape.spec.tsx`) guard this. The removed-element case is now covered by
`after the focused element is removed, asks once per press` in both specs, in Chromium, Firefox and
WebKit.

## Options considered

### `tabIndex={-1}` on the `<dialog>`

Legacy ModalDialog has `tabIndex={-1}` on its `section`.

- Pros: one attribute. It matches legacy markup.
- Cons: it does not fix this problem. Measured: after the focused element is removed, focus still
  goes to `<body>` in all three engines. A click already focuses the `<dialog>` without it. It also
  changes `:focus-visible` and the focus ring on the dialog, which needs a design check.

### Focus fixup when the focused element is removed

Listen for `focusout` in the dialog. If focus lands on `<body>` while the dialog is open (check
after the removal settles), move focus to the `<dialog>`.

- Pros: fixes the cause. Screen reader and keyboard users keep their place in the dialog, which is
  also an accessibility gain (WCAG 2.4.3). `Dialog` then takes the Escape as usual.
- Cons: more code and timing (removal, React commits, consumer focus management). It can fight a
  consumer that moves focus on purpose. It needs tests in every engine.

### Restore the `<body>` fallback from c551744

An earlier version of `use-escape-keydown.tsx` treated an Escape on `<body>` (or the document
element) as meant for the last `:modal` dialog in document order, and took it.

- Pros: small, and it was tested once. It matches legacy: one ask per key press, no forced close, in
  every browser.
- Cons: it assumes document order is open order (side-by-side modals are not supported). It does not
  move focus back into the dialog.

**Decision:** take the Escape in the `Dialog` that focus was last in (see "What we did"). It matches
legacy, and does not depend on document order. The focus fixup is a separate a11y improvement that
legacy never had. Do not use `tabIndex={-1}` for this: it does not change the result.

## When to revisit

- If a consumer reports a refusing modal that closes after an item is deleted (one of the gaps in
  "What we did").
- With the a11y owner, for the focus fixup.
