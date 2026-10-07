# Popup inside Modal closes on Tab

## Status

**Open, DS-owned, undocumented until now (found 2026-08-17).** Not yet fixed and not routed to
another team — both halves of the break are `@atlaskit`-owned, so this is the Design System's to
resolve.

With `platform-dst-top-layer` on, a `@atlaskit/popup` rendered inside a `@atlaskit/modal-dialog`
**closes when the user presses Tab**. It did not before. No error, no console warning, and no
failing test in either package.

---

## The mechanism

Two independently-correct decisions in two different packages.

**Popup suppresses its own close-on-Tab when it is inside a modal.**
`popup/src/use-close-manager.tsx:174` tests the focused element with `closest('[aria-modal]')`. If a
modal ancestor is found, Tab is treated as navigation _within_ the modal rather than a signal to
dismiss the popup.

**The top-layer dialog deliberately does not set `aria-modal`.** `dialog/dialog-content.tsx:299`
carries an explicit comment that the attribute is _intentionally_ not set — a native `<dialog>`
opened with `showModal()` conveys modality to assistive technology through the top layer itself, and
adding `aria-modal="true"` on top of that is redundant and can be actively harmful.

Legacy `modal-dialog` set the attribute. The top-layer path does not. So `closest('[aria-modal]')`
returns `null`, the suppression never fires, and Tab dismisses the popup.

Neither package is wrong on its own terms. The defect is in the **coupling**: Popup depends on a DOM
attribute as a proxy for "am I inside a modal", and Modal stopped emitting it for good reasons.

---

## Why no test catches it

This is the part worth internalising, because the class generalises.

- **It is cross-package.** `popup`'s tests render a popup; `modal-dialog`'s tests render a modal.
  The interaction requires both, and neither suite owns that fixture.
- **It is open-state and interaction-only.** The dialog host exists only while open, and the break
  needs a Tab press _after_ opening both surfaces. No static VR or unit test observes it.
- **It fails open, silently.** A `closest()` guard that stops matching produces no error. The
  feature simply stops working.
- **A selector audit scoped per package cannot find it.** The query and the producer live in
  different packages, and only their _combination_ is wrong.

It surfaced from the reverse-direction sweep — the class of rules and DOM queries that _targeted_
portalled content and now silently stop matching — and specifically from an isolating fixture row
built to exercise the `[aria-modal]` signal on its own. Every earlier fixture carrying that signal
also carried `.atlaskit-portal`, so the signal was masked and a detector missing it scored 100%
recall. See [`top-layer-unsafe-selectors.md`](./top-layer-unsafe-selectors.md) → _Measuring a
detector_.

---

## Fix options

Not yet decided. In rough order of preference:

1. **Give Popup a first-class modality signal that does not depend on `aria-modal`.** A context
   provided by the top-layer Dialog is the obvious candidate: it is explicit, testable, and survives
   any future DOM change. Cost: a new internal contract between two packages.
2. **Have Popup also test `closest('dialog')`** (or `dialog[open]`). Cheap and local, but it
   re-couples to DOM shape — the same mistake one layer along — and over-matches an in-flow
   `<dialog open>` that is not modal.
3. **Set `aria-modal` on the top-layer dialog after all.** Rejected: `dialog-content.tsx:299`'s
   reasoning is sound, and reversing an accessibility decision to satisfy an unrelated keyboard
   handler is the wrong trade.

Whichever is chosen, the regression test must render **a popup inside a modal, open both, and press
Tab** — that is the fixture neither package currently has.

---

## Related

- [`top-layer-unsafe-selectors.md`](./top-layer-unsafe-selectors.md) — the reverse-direction
  section, and why cross-package coupling has no detector yet.
- [`dialog-close-flow.md`](./dialog-close-flow.md) — how Dialog close is actually driven.
- [`host-element-unmount-when-hidden.md`](./host-element-unmount-when-hidden.md) — why the host, and
  therefore any attribute on it, exists only while open.
