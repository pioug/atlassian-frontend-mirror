# Browser Testing Guide for Top-Layer Migrations

## Testing philosophy

We lean on browser (Playwright) tests as our primary testing strategy for top-layer. Because we
leverage `popover="auto"` and `<dialog>` — browser-native APIs — the behaviors we care about
(positioning, stacking, focus, animation) only manifest in a real browser. JSDOM-based unit tests
are useful for React logic (prop forwarding, callbacks, conditional rendering) but cannot validate
the platform behaviors we depend on.

**Prefer browser tests for:** positioning, stacking order, animation lifecycle, focus management,
light-dismiss, keyboard interactions. Prefer testing behaviour through browser tests rather than
testing internal implementation details.

**Unit tests are sufficient for:** prop forwarding, callback invocations, ARIA attribute presence,
conditional rendering based on feature flags.

**Test structure:** When writing test files, if possible, try to use a clear arrange, act, assert
format. There can be many arrange, act, assert blocks in a single test. When moving between blocks
(e.g. arrange to act) add a new line. Some tests might not need all these blocks, and some tests
might require more intermixing to be easy to understand. Please do not add comments saying which
block you are in (e.g. "Act: doing thing"), just use this as a convention for how you order and use
spacing in tests. You can still use comments to explain things in tests, just do not explicitly call
out "You are now in an arrange section" in your comments.

**Stable selectors (`testId` / `data-testid`):** Primitives vs composed packages (e.g.
`@atlaskit/popup` **`--content`**, Tooltip suffixes, render-prop footguns) — see
**[../architecture/test-ids.md](../architecture/test-ids.md)**.

### Assert observable geometry, not CSS declarations

For anything about **size or position**, assert what the box actually does — its rect, whether it is
on screen, whether it scrolls — and not the declaration that was written to produce it. A
declaration can be present, correct, and constrain nothing.

This rule was written for the `shouldFitViewport` bug, which shipped for months behind a prop whose
whole implementation was `overflow: auto` on a wrapper nested inside a `PopoverSurface` that already
set it. Every test covering it asserted a declaration — `toHaveCSS('overflow', 'auto')` on that
wrapper, and `getComputedStyle().maxInlineSize !== 'none'` on an element the cap was no longer
written to — and both passed the whole time.

Two corollaries:

- **A reachability assertion is not enough either.** A popover clamped to a 53px letterbox is
  scrollable, so "the content can be reached by scrolling" is true of the broken state too. Assert
  the SIZE and the SIDE.
- **Read a declaration only when the contract has no geometry.** "Not capped" is the usual case: an
  uncapped box and a box capped wider than its content render identically. Even then, prefer the raw
  serialisation over a parsed number — a percentage cap never resolves to pixels, so `parseFloat`
  yields `NaN` and any lenient handling of it satisfies a numeric bound.

### A VR fixture about SIZE needs ink

The screenshot comparison counts pixels whose colour changed, so a white surface on a white page can
change size and still pass. Measured three times over while adding the fit fixtures:

| fixture                             | mutation                          | white on white            | rendered solid |
| ----------------------------------- | --------------------------------- | ------------------------- | -------------- |
| `js-fallback-fit-floor-roomy`       | flip floor written on the JS path | **passed** (62px → 150px) | 10,612px       |
| `js-fallback-fit-floor-modest-cell` | same                              | 506px                     | 25,442px       |
| `fit-floor-cramped-min-size-zero`   | both caps dropped                 | 1,045px                   | 19,156px       |
| `fit-floor-short-viewport`          | same                              | 250px                     | 15,806px       |
| `xcss width and padding` (popup)    | `className={xcss}` dropped        | 1,081px                   | 13,835px       |

The first row is the one to remember: the popover grew by 88px and the comparison passed, because
only its shadow moved.

So for a fixture whose subject is a size or a side:

- Render the popover as a **solid block**, or put a solid marker at the edge under review
  (`84-vr-popover-fit-alignment.vr.ap.tsx` uses a ruler; `89-vr-popover-fit-scroll.vr.ap.tsx` a
  sticky footer bar and a content-top bar).
- **Do not rely on a scrollbar.** The runner's Chromium draws overlay scrollbars, so a scrolled
  surface is pixel-identical to an unscrolled one except for where its content sits.
- **Check the frame, not just the geometry.** A cell cap is always bounded by a viewport edge, so
  anything that overflows a cap leaves the frame and the whole difference collapses to a 5px strip.
  If that is the only signal available, the contract belongs in a Playwright geometry test instead.
- **Verify by mutation, and record the pixel count.** A fixture that cannot fail is decoration.
- **A twin renders what its counterpart renders.** A `js-fallback-*` twin beside a CSS fixture only
  guards the two paths against each other for whatever both of them draw. If the twin is a solid
  block and its counterpart is a `PopoverSurface`, the pair guards size and side and says nothing
  about the surface — so either match the rendering (`89-vr-popover-fit-floor.vr.ap.tsx` makes both
  solid) or say which of the two the pair actually covers.

### Two fixture hazards that make a flag pair differ for the wrong reason

Both were hit while photographing `<Popup shouldFitViewport>` on both code paths:

- **Initial focus scrolls.** Focusing into the popup calls `scrollIntoView`, which scrolls the
  nearest scroll container — including an `overflow: hidden` one. On the legacy path that moved the
  whole page, so the pair differed by scroll position rather than by geometry. Pass
  `autoFocus={false}`, or keep the content free of focusable elements.
- **`shouldFitContainer` changes the page.** Legacy wraps the trigger and the popup in a
  `position: relative` div and renders the popup as the trigger's sibling in flow, which moves an
  absolutely-positioned trigger and grows the page. It also fits the popup to that PARENT, while the
  top-layer path maps the prop to the trigger, so a parent wider than its trigger makes the pair
  differ by the mapping rather than by the behaviour under test.

And nothing on the page may clip at the viewport edge: the cap's signature is the popover's far edge
landing 5px inside it, which an `overflow: hidden` ancestor erases by clipping at the same place.

See `popper/src/__tests__/playwright/max-size.spec.tsx` and
`top-layer/__tests__/playwright/anchored-popover-geometry.tsx` for worked examples.

---

> A checklist of high-value browser (Playwright) tests beyond accessibility. Accessibility testing
> is already strong across migrations — this guide covers the **other** categories that catch
> real-world bugs.

## Why browser tests beyond a11y?

Unit tests run in JSDOM, which does not implement the Popover API, CSS Anchor Positioning, or the
top layer. JSDOM tests verify React logic, but cannot validate:

- Whether a popover actually appears in the correct position
- Whether CSS transitions run and complete before unmount
- Whether nested top-layer elements stack correctly
- Whether scroll/resize events reposition the popover
- Whether `popover="auto"` mutual exclusivity works

These behaviors are only observable in a real browser.

---

## Test Categories

### 1. Positioning and Layout

These verify that the popover appears where it should, and responds to viewport changes.

| Test                                                        | What it catches                                                       |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Popover appears in the correct position relative to trigger | CSS anchor positioning misconfiguration, `position-area` mapping bugs |
| Popover flips when there isn't enough viewport space        | `position-try-fallbacks` not working, fallback logic broken           |
| JS fallback positioning matches CSS anchor positioning      | Fallback algorithm producing different results than CSS               |
| `width="trigger"` makes popover match the trigger's width   | `anchor-size(width)` not applied or calculated                        |
| Scroll reposition (JS fallback): popover follows trigger    | Scroll listener not registered, position not recalculated             |

**How to test flipping:** Scroll the page or resize the viewport so the trigger is near an edge,
open the popover, and assert the popover appears on the opposite side.

**Example:**

```ts
test('popover flips when insufficient space below', async ({ page }) => {
	// Scroll so the trigger is near the bottom of the viewport
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

	await page.getByTestId('trigger').click();
	const popover = page.getByTestId('popover');

	// Popover should be above the trigger (block-start), not below
	const triggerBox = await page.getByTestId('trigger').boundingBox();
	const popoverBox = await popover.boundingBox();
	expect(popoverBox!.y + popoverBox!.height).toBeLessThanOrEqual(triggerBox!.y);
});
```

---

### 2. Animation Lifecycle

These catch cases where the DOM unmounts before exit animations complete (a class of bug that was
debugged and resolved during the tooltip migration — see `animations.md` for the underlying
constraint).

| Test                                                        | What it catches                                               |
| ----------------------------------------------------------- | ------------------------------------------------------------- |
| Entry animation plays: data attribute is present while open | Compiled animation style not selected, data attribute missing |
| Exit animation completes before element is logically hidden | React unmounting before `transitionend` fires                 |
| `prefers-reduced-motion: reduce` disables animations        | Animation duration not set to 0 for reduced motion            |

**How to test exit animations:** Open the popover, close it, and assert that the element is still in
the DOM during the exit transition (via the data attribute or computed opacity), then verify it's
fully hidden after the transition duration.

**Reduced motion example:**

```ts
test('animations disabled for prefers-reduced-motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.getByTestId('trigger').click();

	// Popover should appear instantly (no transition)
	const popover = page.getByTestId('popover');
	await expect(popover).toBeVisible();
});
```

---

### 3. Stacking and Nesting

The top layer uses a "last in, first out" stack. These tests verify that the stacking algorithm
works for our component composition.

| Test                                                                                     | What it catches                                                                                     |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Nested popovers: inner appears on top of outer                                           | `popover="auto"` nesting broken, wrong stacking order                                               |
| Opening a sibling closes the previous `popover="auto"`                                   | Mutual exclusivity not working                                                                      |
| Popover inside dialog renders above the dialog backdrop                                  | Popover not entering top layer, or entering below dialog                                            |
| Multiple `mode="manual"` popovers coexist                                                | Manual popovers incorrectly closing each other                                                      |
| Tooltip (`mode="hint"`) doesn't close open popup (`mode="auto"`)                         | `popover="hint"` fallback to `auto` causing unwanted closes                                         |
| Press on a `mode="hint"` trigger dismisses on pointerup, and the surface stays dismissed | Native light dismiss not reaching a hint, or the surface re-showing itself on the next pointer move |

**Pointer dismissal for hover-triggered surfaces:** driving `mouse.down()` / `mouse.up()` separately
(rather than `click()`) is what distinguishes "dismissed on press" from "dismissed on release", and
a pointer move that stays _inside_ the trigger is what catches an unwanted re-show. The trigger
needs an element child for that move to fire a second `mouseover`. Worked example:
`tooltip/src/__tests__/playwright/ff-testing/platform-dst-top-layer-tooltip/pointer-dismiss.spec.tsx`
and [tooltip-pointer-dismissal.md](../decisions/tooltip-pointer-dismissal.md).

**How to test stacking:** Open two layers, measure their z-ordering via bounding boxes or
`getComputedStyle`, or assert which element receives click events.

**Example:**

```ts
test('nested popover appears on top of parent popover', async ({ page }) => {
	await page.getByTestId('outer-trigger').click();
	await page.getByTestId('inner-trigger').click();

	const outer = page.getByTestId('outer-popover');
	const inner = page.getByTestId('inner-popover');

	// Both should be visible
	await expect(outer).toBeVisible();
	await expect(inner).toBeVisible();

	// Inner should be clickable (on top)
	await inner.click();
});
```

---

### 4. Interaction Patterns

Real user interactions that only a browser can simulate faithfully.

| Test                                                                               | What it catches                                                      |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Click-outside closes the popover, but the clicked element still receives its event | `stopPropagation` bug where the click-outside handler eats the event |
| Scroll does not close the popover                                                  | Scroll mistakenly treated as a light-dismiss                         |
| Rapid open/close cycles don't leave ghost popovers                                 | Race condition between `showPopover()` and `hidePopover()`           |
| Keyboard toggle (Enter/Space on trigger) opens and closes                          | `togglePopover()` not wired to keyboard events                       |
| Mouse + keyboard interleaving works (hover then keyboard)                          | State machine confused by mixed input modalities                     |

**Ghost popover example:**

```ts
test('rapid toggle does not leave ghost popovers', async ({ page }) => {
	const trigger = page.getByTestId('trigger');

	for (let i = 0; i < 5; i++) {
		await trigger.click();
		await trigger.click();
	}

	// At most one popover should be open
	const openPopovers = page.locator('[popover]:popover-open');
	await expect(openPopovers).toHaveCount(0);
});
```

---

### 5. Focus Management (beyond a11y)

The accessibility tests cover WCAG focus requirements. These additional tests catch UX-level focus
bugs.

| Test                                                                      | What it catches                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Focus return does not re-trigger the popover (no circular open loop)      | `focus` event on trigger reopening the popover after dismiss |
| Focus moves correctly through Tab order when popover is in DOM but hidden | Hidden popover still receiving tab focus                     |
| `returnFocusRef` receives focus when the original trigger is removed      | Focus falling to `<body>` when trigger unmounts              |
| Tab through form fields inside a popup works normally                     | Focus trap too aggressive, stealing focus from form elements |

**Circular open loop example:**

```ts
test('focus return to trigger does not reopen popup', async ({ page }) => {
	await page.getByTestId('trigger').click();
	await expect(page.getByTestId('popover')).toBeVisible();

	await page.keyboard.press('Escape');
	await expect(page.getByTestId('popover')).not.toBeVisible();

	// Trigger should have focus, but popup should stay closed
	await expect(page.getByTestId('trigger')).toBeFocused();
	await expect(page.getByTestId('popover')).not.toBeVisible();
});
```

---

### 6. Integration and Migration

These tests verify that the top-layer migration doesn't break alongside existing non-migrated
components.

| Test                                                                   | What it catches                                                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Top-layer popover coexists with legacy z-index layers on the same page | Top-layer content stacking below legacy layers                                          |
| Feature flag off: component works exactly as before                    | Regression in the legacy code path during the migration                                 |
| Component works after SSR hydration (no mismatch)                      | `supportsAnchorPositioning` evaluated during SSR producing different result than client |

---

## Decision Framework: What to Browser-Test

Not every behavior needs a browser test. Use this framework to decide:

**Always browser-test:**

- Positioning (CSS Anchor Positioning only works in a real browser)
- Stacking order (top layer only exists in a real browser)
- Animation lifecycle (CSS transitions need a real rendering engine)
- Focus return after dismiss (browser focus behavior differs from JSDOM)

**Unit-test is sufficient:**

- Prop forwarding and React state management
- Callback invocations (such as onClose)
- ARIA attribute presence (role, aria-label, aria-expanded)
- Conditional rendering based on feature flags

**Use both when:**

- The behavior involves both React logic AND browser APIs (e.g. `showPopover()` being called in
  response to a state change, then the resulting `toggle` event updating React state back)

---

## Test Infrastructure Notes

- Migration browser tests live in `__tests__/playwright/ff-testing/platform-dst-top-layer/`
- Use `ffTest` utilities to gate tests on the `platform-dst-top-layer` feature flag
- The top-layer package's own browser tests use examples in `examples/90-111` range
- For positioning tests, use `page.evaluate(() => window.scrollTo(...))` to control the viewport
- For animation tests, avoid `page.waitForTimeout` — use `transitionend` event listeners or poll
  element visibility

### Known pre-existing failures in this package's own Playwright suite

A large WebKit / Firefox failure set predates the fit work. Baselined on a clean tree in 2026-08: 15
failures across `positioning`, `dialog`, `animation-lifecycle`, `click-outside-passthrough` and
`rapid-toggle`, almost all WebKit focus / close / settle behaviour. `positioning.spec.tsx`'s flip
test is among them, which makes it unusable as a regression signal for placement work; use
`anchored-popover-size.spec.tsx` and `fit-available-space.spec.tsx`, which pass on all three
engines. Do not attribute these to a branch until you have reproduced them on the merge base.

### `examples/config.jsonc` registration drift fails silently

Every example a spec visits must be listed in the package's `examples/config.jsonc`
(`testExamples`), which the test-scaling project hashes for result caching. An omission does not
fail anything; it silently breaks caching, so a stale cached result can stand in for a run. Three
were found missing in 2026-08 (`top-layer` `154-testing-safari-flex-collapse-max-height.vr.ap.tsx`,
`popup` `97-testing-initial-focus-matrix.tsx` and `should-fit-viewport.tsx`) and added. Register a
new example in the same change that adds the spec. A lint rule that cross-checks `visitExample`
calls against the config is worth adding.

A VR example is IMPORTED by its spec rather than visited by URL, and the two packages disagree about
whether that counts: `popup` registers `10-popup.vr.ap.tsx` and `surface-detection.vr.ap.tsx`, while
`top-layer` registered none of its 80-89 VR band. Registering is the safer half of the disagreement,
since the hash can only become more conservative, so all three fixtures this change adds to that
band are listed: `84-vr-popover-fit-alignment.vr.ap.tsx`, `89-vr-popover-fit-floor.vr.ap.tsx` and
`89-vr-popover-fit-scroll.vr.ap.tsx`. The other nine are a pre-existing gap worth closing in one
pass.
