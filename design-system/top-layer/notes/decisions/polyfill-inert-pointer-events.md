# Polyfill reports `pointer-events: none` for inert content

> Why `@atlaskit/top-layer/testing/polyfill` changes the computed `pointer-events` of inert content.
> This is the one place where the polyfill does not match a browser on purpose.

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

The code comment is on the `getComputedStyle` patch in `src/testing/polyfill.tsx`.
