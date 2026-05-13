# Top-layer adoption — tooling gotchas

> Cross-cutting infra/tooling lessons collected while shipping the
> `platform-dst-top-layer` migration across `popup`, `modal-dialog`,
> `datetime-picker`, `inline-dialog`, `inline-message`, `select`,
> `flag`, and `spotlight`. Per-package adoption findings live in the
> sibling `*-migration.md` files.

## Ratcheting baseline = local `master` ref

`yarn ratcheting` compares `merge-base..HEAD` and uses the **local**
`master` ref as its baseline (not `origin/master`). On a long-lived
branch, the local ref can be hundreds or thousands of commits behind
the remote, which causes ratcheting to attribute every master-side
change since then to the branch — producing a flood of false-positive
violations across packages the branch never touched.

**Symptom:** `yarn ratcheting` reports new violations in files such as
`post-office/.../*`, `forge-ui/.../*`, `confluence/.../*`,
`adminhub/.../*` that the branch's `git diff master..HEAD` shows zero
modifications for.

**Fix:**

```bash
git update-ref refs/heads/master refs/remotes/origin/master
yarn ratcheting   # now compares against the real master tip
```

This is non-destructive (it only moves the local `master` ref) and
should be the first thing tried whenever ratcheting reports
unexpected unrelated noise.

## Ratcheting matches rule names in source comments

Several ratcheting rules (e.g. `consistent-css-prop-usage`,
`use-heading`, the various typography rules) detect violations by
regex-matching `eslint-disable.*<rule-name>` strings in the source.
Comments that **reference** the rule by name as part of an
explanation are also matched:

```ts
// ❌ This will count as 1 new disable even though it doesn't disable anything:
//   "we re-bind via a property accessor so the
//    consistent-css-prop-usage rule no longer flags it"

// ✅ Rephrase to avoid the rule name:
//   "we re-bind via a property accessor so the css-prop lint rule
//    no longer flags it"
```

Same applies to comments that mention `:first-child`, `:nth-child`, or
`:last-child` for the
`@atlaskit/design-system/no-unsafe-nth-child-selectors` rule.

## Pre-existing master failures during long-lived branches

Master moves fast; long-lived migration branches will inherit pre-
existing failures (often axe `color-contrast` violations after design-
token changes) on legacy code paths during the merge.

The standard playbook for pre-existing failures on **legacy code
paths that the migration is replacing** is:

1. Reproduce the failure on `origin/master` (without the branch's
   changes) to confirm it's pre-existing.
2. If the test is easy to fix without changing legacy production code,
   fix it.
3. Otherwise, mark with `test.fixme()` and a short justification
   explaining (a) it's pre-existing on master, and (b) the legacy code
   path is being removed in scope of the migration so it isn't worth
   fixing. Reference the equivalent FF-on test where coverage exists.

## Native popover light-dismiss vs. react-select-style adopters

Adopters that wrap react-select (or any combobox where the trigger
input lives outside the popover element) need to opt out of native
popover light-dismiss by passing `mode="manual"` to `Popup.Content`.
Otherwise, the same click that opens the menu (target = the combobox
input, outside the popover) will bubble to the browser's native
auto-dismiss handler and immediately close it.

Such adopters typically already own outside-click and Esc dismissal
via their own state machine, so opting out is the correct integration
rather than fighting the auto-dismiss.

When `mode="manual"` is used, the browser's automatic
return-of-focus-to-trigger on close is also disabled. Adopters that
relied on the legacy code path for Esc → trigger restoration need to
extend that handler to the FF-on path explicitly.

## `role="presentation"` over `eslint-disable` for layout-only wrappers

When a top-layer adopter wraps the popover/dialog content in a layout
`<div>` that carries non-user event handlers (e.g. forwarding consumer
callbacks, swallowing bubbled clicks), the default a11y lint stack
flags it for `click-events-have-key-events`,
`interactive-element-not-keyboard-focusable`, and
`no-static-element-interactions`.

The ARIA-spec correct fix is `role="presentation"` (a.k.a.
`role="none"`), which satisfies all three rules without an
`eslint-disable` and is correctly opaque to assistive technology. The
surrounding `Popup.Content` / `Popup.Surface` already owns the dialog
landmark, so no semantic information is lost.

## `<dialog>.showModal()` initial focus and `tabindex=-1` wrappers

`<dialog>.showModal()`'s focus-delegate algorithm picks the first
**focusable** descendant — and per the HTML spec, `tabindex=-1`
elements ARE focusable. So a wrapper that legacy code uses for an
outline (e.g. `<div tabIndex={-1}>` for `:focus-visible`) will steal
initial focus from the intended target (close button, first input).

Drop the `tabIndex` on top-layer wrappers and rely on the dialog's
own focus management. If a wrapper outline is desired for
keyboard-driven scroll, attach the `tabindex` to a different element
(e.g. the scrollable body container) rather than the dialog content
root.

## `<dialog>` implicit role and Playwright selectors

The native `<dialog>` element has an **implicit** `role="dialog"`. CSS
attribute selectors do not match implicit roles:

```ts
// ❌ Does NOT match a native <dialog> (no `role` attribute on the DOM):
page.locator('[role="dialog"]');

// ✅ Uses the accessibility tree, matches both implicit and explicit roles:
page.getByRole('dialog');
```

Tests authored against legacy modal/popup adopters frequently need
this update when porting to the top-layer FF-on path.

## `:focus-visible` and Playwright input modality

Browsers track the last input modality and only match `:focus-visible`
on focusable elements when the focus arrived via keyboard or
`:focus-visible`-eligible programmatic action. After a mouse click,
even a programmatic `.focus()` will not match `:focus-visible`.

For Playwright tests asserting focus indicators after the dialog/popup
opens, drive the open via keyboard:

```ts
await trigger.focus();
await page.keyboard.press('Enter');
// now `:focus-visible` is eligible inside the dialog
```
