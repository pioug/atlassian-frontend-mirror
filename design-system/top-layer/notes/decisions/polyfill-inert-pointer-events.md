# Polyfill reports `pointer-events: none` for inert content

> Why `@atlaskit/top-layer/testing/polyfill` changes the computed `pointer-events` of inert content,
> and of open popovers. These are the places where the polyfill does not match a browser on purpose.

## Decision

**Decision (2026-10-20).** The polyfill reports `pointer-events: none` from `getComputedStyle()` for
inert content. The user confirmed this.

## Why

- A browser makes content behind a modal dialog inert. Content in an `inert` subtree is inert too.
- Hit testing skips inert content. A real click there cannot reach it. It reaches the dialog
  instead, through its backdrop.
- jsdom has no hit testing. `user-event` does not read `inert`. Before each pointer action, it reads
  the computed `pointer-events` of the target and its ancestors.
- So the polyfill reports `none` for inert content. A `user.click()` behind a modal now throws, as a
  real click cannot reach that content.

## The difference you can see

Chrome does not change the computed value. It reports `auto` for inert content, and only its hit
testing skips it. A test that reads `getComputedStyle(element).pointerEvents` directly sees `none`
in jsdom, but `auto` in a browser.

## How to write tests

- To model a backdrop click, click the dialog element itself. Chrome sends the click to the dialog.
- Do not click `document.body` to "click outside" a modal dialog. A user cannot reach it.
- `element.click()` and `fireEvent` still work on inert content, as in a browser. Use them only for
  programmatic activation, not for user actions.
- `user.tab()` does not skip inert content, content behind a modal dialog, or content in a closed
  popover. `focus()` does nothing there, so Tab can stop where Chrome skips to the next element. ADS
  `Dialog` handles Tab itself, so its tests are not affected.
- If `user.click()` throws the `pointer-events: none` error when you do not expect it, look for a
  modal dialog that is still open. For example, a test appended a dialog to `document.body` itself
  and did not remove it.

## Open popovers report `auto`

**Proposal, awaiting review.** An open popover, and its content, report `pointer-events: auto` where
they get `none` only by inheriting it from outside the popover. The polyfill does this now, but the
user has not confirmed it yet.

- The host renders in place, so it inherits from its DOM parent. ADS `Popover` and `Dialog` reset
  `pointer-events: auto` on the host with a `:defined` rule (see
  [host-specificity-boost.md](./host-specificity-boost.md)). In a browser, the surface stays
  hittable in a `pointer-events: none` ancestor.
- jsdom does not support `:defined`, so the reset never applies. jsdom resolves `none` for the host
  and its content, and a `user-event` click in the surface throws.
- A `pointer-events` set in the popover is kept: inline, or by a style sheet rule that matches an
  element between the content and the host.
- The difference you can see: a plain `[popover]`, with no reset, in a `pointer-events: none`
  ancestor inherits `none` in a browser. The polyfill reports `auto`.
- An open dialog, and its content, get the same reset (the layer surface reset in the polyfill). The
  blocking modal dialog also reports `auto` when jsdom resolves no value.

The code comment is on the `getComputedStyle` patch in `src/testing/polyfill.tsx`.
