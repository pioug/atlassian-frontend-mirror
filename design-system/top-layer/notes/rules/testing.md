# Browser Testing Guide for Top-Layer Migrations

## Testing philosophy

We lean on browser (Playwright) tests as our primary testing strategy for top-layer. Because we leverage `popover="auto"` and `<dialog>` — browser-native APIs — the behaviors we care about (positioning, stacking, focus, animation) only manifest in a real browser. JSDOM-based unit tests are useful for React logic (prop forwarding, callbacks, conditional rendering) but cannot validate the platform behaviors we depend on.

**Prefer browser tests for:** positioning, stacking order, animation lifecycle, focus management, light-dismiss, keyboard interactions. Prefer testing behaviour through browser tests rather than testing internal implementation details.

**Unit tests are sufficient for:** prop forwarding, callback invocations, ARIA attribute presence, conditional rendering based on feature flags.

**Test structure:** When writing test files, if possible, try to use a clear arrange, act, assert format. There can be many arrange, act, assert blocks in a single test. When moving between blocks (e.g. arrange to act) add a new line. Some tests might not need all these blocks, and some tests might require more intermixing to be easy to understand. Please do not add comments saying which block you are in (e.g. "Act: doing thing"), just use this as a convention for how you order and use spacing in tests. You can still use comments to explain things in tests, just do not explicitly call out "You are now in an arrange section" in your comments.

---

> A checklist of high-value browser (Playwright) tests beyond accessibility. Accessibility testing is already strong across migrations — this guide covers the **other** categories that catch real-world bugs.

## Why browser tests beyond a11y?

Unit tests run in JSDOM, which does not implement the Popover API, CSS Anchor Positioning, or the top layer. JSDOM tests verify React logic, but cannot validate:

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

| Test | What it catches |
|------|-----------------|
| Popover appears in the correct position relative to trigger | CSS anchor positioning misconfiguration, `position-area` mapping bugs |
| Popover flips when there isn't enough viewport space | `position-try-fallbacks` not working, fallback logic broken |
| JS fallback positioning matches CSS anchor positioning | Fallback algorithm producing different results than CSS |
| `width="trigger"` makes popover match the trigger's width | `anchor-size(width)` not applied or calculated |
| Scroll reposition (JS fallback): popover follows trigger | Scroll listener not registered, position not recalculated |

**How to test flipping:** Scroll the page or resize the viewport so the trigger is near an edge, open the popover, and assert the popover appears on the opposite side.

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

These catch cases where the DOM unmounts before exit animations complete (a class of bug that was debugged and resolved during the tooltip migration — see `animations.md` for the underlying constraint).

| Test | What it catches |
|------|-----------------|
| Entry animation plays: data attribute is present while open | CSS not injected, data attribute missing |
| Exit animation completes before element is logically hidden | React unmounting before `transitionend` fires |
| `prefers-reduced-motion: reduce` disables animations | Animation duration not set to 0 for reduced motion |

**How to test exit animations:** Open the popover, close it, and assert that the element is still in the DOM during the exit transition (via the data attribute or computed opacity), then verify it's fully hidden after the transition duration.

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

The top layer uses a "last in, first out" stack. These tests verify that the stacking algorithm works for our component composition.

| Test | What it catches |
|------|-----------------|
| Nested popovers: inner appears on top of outer | `popover="auto"` nesting broken, wrong stacking order |
| Opening a sibling closes the previous `popover="auto"` | Mutual exclusivity not working |
| Popover inside dialog renders above the dialog backdrop | Popover not entering top layer, or entering below dialog |
| Multiple `mode="manual"` popovers coexist | Manual popovers incorrectly closing each other |
| Tooltip (`mode="hint"`) doesn't close open popup (`mode="auto"`) | `popover="hint"` fallback to `auto` causing unwanted closes |

**How to test stacking:** Open two layers, measure their z-ordering via bounding boxes or `getComputedStyle`, or assert which element receives click events.

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

| Test | What it catches |
|------|-----------------|
| Click-outside closes the popover, but the clicked element still receives its event | `stopPropagation` bug where the click-outside handler eats the event |
| Scroll does not close the popover | Scroll mistakenly treated as a light-dismiss |
| Rapid open/close cycles don't leave ghost popovers | Race condition between `showPopover()` and `hidePopover()` |
| Keyboard toggle (Enter/Space on trigger) opens and closes | `togglePopover()` not wired to keyboard events |
| Mouse + keyboard interleaving works (hover then keyboard) | State machine confused by mixed input modalities |

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

The accessibility tests cover WCAG focus requirements. These additional tests catch UX-level focus bugs.

| Test | What it catches |
|------|-----------------|
| Focus return does not re-trigger the popover (no circular open loop) | `focus` event on trigger reopening the popover after dismiss |
| Focus moves correctly through Tab order when popover is in DOM but hidden | Hidden popover still receiving tab focus |
| `returnFocusRef` receives focus when the original trigger is removed | Focus falling to `<body>` when trigger unmounts |
| Tab through form fields inside a popup works normally | Focus trap too aggressive, stealing focus from form elements |

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

These tests verify that the top-layer migration doesn't break alongside existing non-migrated components.

| Test | What it catches |
|------|-----------------|
| Top-layer popover coexists with legacy z-index layers on the same page | Top-layer content stacking below legacy layers |
| Feature flag off: component works exactly as before | Regression in the legacy code path during the migration |
| Component works after SSR hydration (no mismatch) | `supportsAnchorPositioning` evaluated during SSR producing different result than client |

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
- Callback invocations (onClose, onOpenChange)
- ARIA attribute presence (role, aria-label, aria-expanded)
- Conditional rendering based on feature flags

**Use both when:**

- The behavior involves both React logic AND browser APIs (e.g. `showPopover()` being called in response to a state change, then the resulting `toggle` event updating React state back)

---

## Test Infrastructure Notes

- Migration browser tests live in `__tests__/playwright/ff-testing/platform-dst-top-layer/`
- Use `ffTest` utilities to gate tests on the `platform-dst-top-layer` feature flag
- The top-layer package's own browser tests use examples in `examples/90-111` range
- For positioning tests, use `page.evaluate(() => window.scrollTo(...))` to control the viewport
- For animation tests, avoid `page.waitForTimeout` — use `transitionend` event listeners or poll element visibility
