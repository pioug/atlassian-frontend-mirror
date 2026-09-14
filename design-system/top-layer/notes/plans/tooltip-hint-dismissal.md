# Tooltip: lean into native `hint` dismissal

> **Status (2026-08-12):** items 1, 4 and 5 are landed on `areardon/tooltip-hint-dismissal`. The
> decision and mechanism are recorded in
> [decisions/tooltip-pointer-dismissal.md](../decisions/tooltip-pointer-dismissal.md), and the
> sequencing follow-ups are tracked in
> [decisions/migration-roadmap.md](../decisions/migration-roadmap.md#tooltip-pointer-dismissal-decided-with-one-blocker-before-rollout).
>
> - **Item 1 (re-show suppression):** done, plus the pending-show cancel described under item 4.
> - **Item 4 (tests):** done. `tooltip-pointer-dismissal.test.tsx` drives real pointer events
>   instead of `simulatePopoverClose()`, the vacuous `gaps:545` assertion is corrected and inverted,
>   and `pointer-dismiss.spec.tsx` adds the first trigger-press browser coverage. Both new
>   behaviours were verified to fail without the fix.
> - **Item 5 (documentation):** done for the notes tree. Website prop documentation still pending,
>   because it belongs with item 2.
> - **Item 2 (stop honouring the two props):** not started. Still needs the `hideTooltipOnMouseDown`
>   audit. This is the only remaining follow-up.
> - **Item 3 (`auto` fallback):** resolved as a non-issue, not a blocker. Platform's `browserslist`
>   is `last 1 chrome / firefox / safari / ios_saf versions` plus `edge >= 18`, and current releases
>   of those engines support `hint`, so the fallback never engages for supported users. The fallback
>   measurements in this plan came from pinned Playwright WebKit 26 and Firefox 144 builds, which
>   lag shipping browsers. The `test.fixme` for webkit/firefox in `hint-no-close-auto.spec.tsx`
>   therefore reflects a Playwright limitation, not a product risk.

## Objective

On the top-layer path, `@atlaskit/tooltip` adopts native popover dismissal as its only pointer
dismissal model. `hideTooltipOnClick` and `hideTooltipOnMouseDown` stop being honoured, and
`popover="hint"` (with `auto` as the documented fallback) owns click and click-outside dismissal.

This removes two bespoke dismissal props in favour of platform behaviour. It is not a like-for-like
port: the tooltip currently hides on pointerup and then re-shows itself, so the change is only safe
once re-show is suppressed.

## Verified behaviour today

Measured in real browsers (Playwright, Chromium 143 / WebKit 26 / Firefox 144) and reproduced in
jsdom under the globally installed popover polyfill, with default props and no `hideTooltipOn*`:

| Step                                  | Flag off | Flag on                              |
| ------------------------------------- | -------- | ------------------------------------ |
| Hover trigger                         | visible  | visible, `popover="hint"` open       |
| `mousedown` held                      | visible  | visible                              |
| `mouseup`                             | visible  | **unmounted** (native light dismiss) |
| Pointer still, 1.2s                   | visible  | unmounted                            |
| Pointer nudged 4px inside the trigger | visible  | **re-shown**                         |

Two facts drive the plan:

1. Dismissal lands on **pointerup**, not mousedown. The HTML light dismiss algorithm records the
   topmost clicked popover on pointerdown and hides on the matching pointerup. The tooltip popover
   host is a sibling of the trigger (`tooltip.tsx:590-611`) with no `popovertarget`, so the topmost
   clicked popover for a trigger click is `null` and the whole hint stack is hidden. This is engine
   independent: it also happens under the `auto` fallback, and when the trigger sits inside an open
   `auto` popover.
2. The re-show is caused by tooltip's own `onMouseOver` (`tooltip.tsx:359`), which fires again when
   the pointer crosses an element boundary **inside** the trigger. It requires the trigger to have
   element children, which is true of `@atlaskit/button/new` and most real triggers. A bare
   text-only trigger stays dismissed.

## Work items

### 1. Suppress re-show after a dismiss (required)

Native semantics are "dismissed until the pointer leaves and returns". Tooltip must match, otherwise
the change ships a flicker: click, vanish, reappear on the next micro-movement.

- Set a suppression ref when the popover reports a dismiss. The current handler is the inline
  `onClose` at `tooltip.tsx:606`.
- Check the ref in `tryShowTooltip` (`tooltip.tsx:212`) and bail while it is set.
- Clear it only on a genuine trigger leave. `onMouseOut` (`tooltip.tsx:390`) also fires on child
  boundary crossings, so gate on `relatedTarget` not being contained by the trigger, or bind
  `pointerleave` on the trigger instead.
- Keyboard shows must still work while suppressed: clear the ref on `blur`, so focus dismissal and
  re-focus behave normally.

### 2. Stop honouring the two props (flag-on path only)

- Remove the `onMouseDown` (`tooltip.tsx:342-346`) and `onClick` (`tooltip.tsx:348-352`) dismissal
  handlers and their `tooltipTriggerProps` entries (`tooltip.tsx:512-513`) on the top-layer path
  only. The legacy path still needs them while the gate can be off.
- `TriggerProps.onMouseDown` and `TriggerProps.onClick` are currently required (`types.tsx:17-18`).
  Make them optional rather than deleting them, so consumers that destructure keep compiling.
- Mark both props `@deprecated` in `types.tsx:71-84` and state that they are inert on the top-layer
  path.

Call site counts in this monorepo (source files, excluding tests, dist, and generated code):

| Prop                     | Files | Effect of the change                                         |
| ------------------------ | ----- | ------------------------------------------------------------ |
| `hideTooltipOnClick`     | 311   | None observable. Native dismissal produces the same outcome. |
| `hideTooltipOnMouseDown` | 119   | Behaviour change. The tooltip now survives until pointerup.  |

`hideTooltipOnMouseDown` exists to hide before the press completes, so that a mousedown which
removes or mutates content does not leave a tooltip over changed content. Native dismissal cannot
reproduce that, because it fires on release. Audit those call sites for the content-removal case
before removing the prop, and record any that need another solution.

### 3. Accept the `auto` fallback consequence explicitly

Leaning in makes the fallback at `popover.tsx:246-250` load-bearing rather than cosmetic. In an
engine without `hint`, the tooltip becomes an `auto` popover, so merely **hovering** a tooltip
trigger closes an unrelated open `@atlaskit/popup`. This was measured on Playwright WebKit and
Firefox; Chromium (real `hint`) was unaffected.

- Confirm the shipping support matrix before sizing this. Playwright pins Firefox 144, which may lag
  the release that added `hint`, and its WebKit build is not shipping Safari. See
  `notes/safari-firefox-focus-verification-report.md:96-98` for the same caution.
- Extend `__tests__/playwright/hint-no-close-auto.spec.tsx` with an unrelated-sibling fixture. The
  existing fixture (`examples/139-testing-hint-no-close-auto.tsx`) nests the hint trigger inside the
  auto popover, which is the friendly ancestor-chain case and does not exercise this.
- Replace the blanket `test.fixme` for webkit and firefox (`hint-no-close-auto.spec.tsx:11-18`) with
  an explicit assertion of the fallback outcome, so the accepted trade-off is asserted instead of
  skipped.
- Consider enrolling `@atlaskit/tooltip` in `atlassian.integrationTests.additionalBrowsers`. Today
  only `@atlaskit/top-layer` (`package.json:31-34`) and `@atlaskit/navigation-system` are enrolled,
  so every tooltip Playwright spec runs on Chromium only, where `hint` is supported.

### 4. Tests

- `tooltip/src/__tests__/unit/tooltip-top-layer-gaps.test.tsx:545` currently asserts the tooltip
  "should remain visible after trigger is clicked". It passes **vacuously**: there is no
  `runAllTimers()` between the hover and the click, so with `delay = 300` (`tooltip.tsx:90`) nothing
  is open when the click happens. Add the timer flush and invert the assertion to expect dismissal.
- `gaps:151` (`hideTooltipOnMouseDown`) must assert the new contract on the flag-on path: visible
  after mousedown, dismissed after mouseup.
- `gaps:129` (`hideTooltipOnClick`) keeps passing either way. Retarget it at the native dismissal so
  it is not a false guard.
- Replace or supplement `simulatePopoverClose()` (`gaps:19-27`), which dispatches a synthetic
  `toggle` event straight at the popover host. Real `mousedown` plus `mouseup` works in jsdom,
  because the platform jest setup installs the popover polyfill for every test
  (`build/configs/jest-config/setup/index.js:16` to `setup-top-layer.js:4`), and that polyfill binds
  two-phase light dismiss. No current unit test exercises the real pointer path.
- Add a re-show suppression test: dismiss, move the pointer within the trigger, assert the tooltip
  stays hidden, then leave and re-hover and assert it returns.
- Add trigger-click Playwright coverage. No spec in the tooltip package clicks or presses a trigger
  today; all use hover, Tab, Escape, or `mouse.move`.

### 5. Documentation

- `notes/migrations/tooltip-migration.md` describes the tooltip as rendering `Popup.Content` with
  `popover="auto"`, and quotes the Escape gate as `platform-dst-top-layer`. The code uses
  `Popover mode="hint"` (`tooltip.tsx:810-813`) and gates Escape on `platform-dst-top-layer-tooltip`
  (`tooltip.tsx:301-308`). Correct both, and add the new dismissal contract.
- Add a decision note recording that tooltip keeps native dismissal rather than following the
  `mode="manual"` precedent used by react-select, datetime-picker, spotlight, popper, and flag
  (`notes/migrations/tooling-gotchas.md:63-70`,
  `notes/migrations/datetime-picker-migration.md:82-88`).
- Update the tooltip prop documentation on the website for the deprecations.

## Sequencing

1. Land the re-show suppression (item 1) on its own. It is an improvement on the current flag-on
   behaviour regardless of the prop decision, and it is the piece that makes the rest safe.
2. Land the test corrections (item 4) so the suite asserts the real contract before the props
   change.
3. Land the prop deprecation (item 2) with the `hideTooltipOnMouseDown` audit.
4. Resolve the fallback question (item 3) before enabling `platform-dst-top-layer-tooltip` outside
   of development.

Repo evidence indicates the gate is off everywhere today (forced off in jira unit tests, `false` in
the confluence e2e gate snapshot, absent from townsquare), so this is pre-rollout work rather than
an incident response.

## Changeset

`@atlaskit/tooltip` needs a changeset. While the behaviour is gated, a `minor` is appropriate. The
release that makes the props inert without a gate is a behaviour break for the 119
`hideTooltipOnMouseDown` call sites and should be treated accordingly. `@atlaskit/top-layer` remains
`0.x`, so any change there is a `minor`.

## Reproducing the measurements

Both arms of the evidence above are cheap to re-run.

jsdom, no browser required: copy `gaps:545`, add `runAllTimers()` after the hover, and assert on the
tooltip after `user.click`. The tooltip is absent with the gate on and present with it off.

Browser: add a temporary spec under
`tooltip/src/__tests__/playwright/ff-testing/platform-dst-top-layer-tooltip/`, drive
`trigger.hover()`, `page.mouse.down()`, `page.mouse.up()`, then `page.mouse.move()` a few pixels
inside the trigger, and read `[data-testid="<testId>--popover"]` against `:popover-open` at each
step. Record `mouseover` and `mouseout` targets on the trigger to attribute the hide, and note that
`page.visitExample` takes `featureFlag` as a comma separated string. For Firefox and WebKit, add
`atlassian.integrationTests.additionalBrowsers` to the tooltip `package.json` for the duration of
the run.
