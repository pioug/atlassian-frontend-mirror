# Decision: top-layer never lets the browser hide an anchored surface

**Date:** 2026-09-10. **Status:** decided and implemented.
`src/internal/anchor-positioning/apply-anchor-positioning.tsx` writes `position-visibility: always`
on the popover it anchor-positions, so every consumer of `useAnchoredPopover` — and therefore of
`useAnchoredPopoverAtPoint`, which delegates to it — gets it.

## Context

`position-visibility` lets the browser hide an anchor-positioned box on its own initiative. Its
initial value is **`anchors-visible`**, not `always`, in every engine and in the spec:

| Source                                                         | Initial value                                          |
| -------------------------------------------------------------- | ------------------------------------------------------ |
| Spec, `css-anchor-position-1` propdef                          | `anchor-visible` (`anchors-visible` is a legacy alias) |
| Blink, `css_properties.json5`                                  | `PositionVisibility::kAnchorsVisible`                  |
| WebKit, `CSSProperties.json`                                   | `anchors-visible`                                      |
| Gecko, `layout/style/test/property_database.js` (Firefox 147+) | `anchors-visible`                                      |

Checked empirically in Chrome 153, Safari 26.6.2 and Firefox 153: a bare `<div>`, a bare `[popover]`
and an anchor-positioned `<Popover>` host all compute `anchors-visible` in all three. (Gecko's Rust
`impl Default for PositionVisibility` returns `ALWAYS`; that is the Rust default, not the CSS
initial value.) Do not reach for a "browser default" argument in either direction: the default is
consistent, and this decision deliberately overrides it. What each engine then _does_ with that
default is not consistent — see the next section.

So the moment the CSS path gives a popover a default anchor (`position-anchor`), the browser
acquires a vote on whether it is shown, and **strongly hides** it whenever it judges the anchor not
visible. The box still reports `:popover-open`, `display: block`, `opacity: 1`,
`visibility: visible`, `checkVisibility() === true` and a **correct `getBoundingClientRect()`**, so
geometry-based debugging, Playwright's `toBeVisible()` and `boundingBox()`, and every VR baseline
whose anchor is on screen, cannot see it. Nothing observable fires when it happens — not even
`beforetoggle` / `toggle` — so no adapter could react to it even if it wanted to.

### The initial value is uniform; the behaviour is not (measured 2026-09-15)

The spec says strongly hidden means the box's `visibility` computes to `force-hidden`: not painted,
not hit-tested, not focusable, and out of the accessibility tree. **No engine does all of that.**
Measured against real browsers, not Playwright's bundles (its Firefox is 144, which has no anchor
positioning at all and answers "unsupported" to a question 153 answers differently):

| Engine                    | painted | `elementsFromPoint` | real pointer input |
| ------------------------- | ------- | ------------------- | ------------------ |
| Chrome 153 / Chromium 143 | no      | no                  | no                 |
| Safari 26.6.2 / WebKit 26 | no      | **returns it**      | no                 |
| Firefox 153               | **yes** | yes                 | yes                |

- **WebKit stops painting but still answers `elementsFromPoint` with the popover.** The bug is real
  there; only a screenshot can see it. A hit-test assertion is vacuous on WebKit.
- **Firefox 153 parses the property, computes `anchors-visible`, anchor-positions pixel-identically
  to Chrome, and never hides.** Unimplemented, not pref-gated: same headed and headless. This fix is
  a no-op on Gecko today, which is already the behaviour we want.
- **Chrome does not implement `force-hidden`.** Strongly hidden content stays in the accessibility
  tree (`ignored: false`), stays programmatically focusable, and **Tab still reaches it** — the same
  sequence as with `always`. Control: real `visibility: hidden` does remove it from the tree and
  makes `focus()` a no-op, so the probe detects ignoring when it happens. Strong hiding in Chrome is
  paint and hit-test suppression only.
- Chrome 143/153 **rejects `anchors-valid`** (`CSS.supports` is false); Safari 26 and Firefox 153
  accept it. See "Prior art".

### What triggers it (measured, Chromium 143; reproduced in Safari 26.6.2)

Driven from a Playwright page and read with `elementFromPoint` at the surface's own centre, after at
least one full frame (see the warning below):

| Anchor state                                                  | `anchors-visible` (initial) | `always` |
| ------------------------------------------------------------- | --------------------------- | -------- |
| clipped **fully** out of an `overflow` ancestor (either axis) | **strongly hidden**         | painted  |
| clipped **fully** out of a `contain: paint` ancestor          | **strongly hidden**         | painted  |
| `visibility: hidden`, own or inherited                        | **strongly hidden**         | painted  |
| only _partially_ clipped                                      | painted                     | painted  |
| fully covered by an opaque, later-painted sibling overlay     | painted                     | painted  |
| covered by an opaque `position: fixed` at `z-index: 9999`     | painted                     | painted  |
| covered by another top-layer popover                          | painted                     | painted  |
| zero-area (`0x0`), unclipped                                  | painted                     | painted  |
| `clip-path` on the anchor or an ancestor                      | painted                     | painted  |
| plain, unobstructed                                           | painted                     | painted  |

So the triggers are **full clipping** (by `overflow` on either axis, or by `contain: paint`) and
**`visibility: hidden`**. Occlusion is not a trigger, in Chromium or in the spec; MDN's "covered by
other elements" matches neither. Note `opacity: 0` is not a trigger either, only `visibility`.

The spec's clipping list is still moving: `clip-path` was added to it in 2026 and Chromium does not
honour it yet, and the timing of the check was clarified twice. Behaviour that leans on this list
drifts under browser updates in a way VR cannot detect, because the rect never changes.

Because the popover is in the top layer, its containing block is the initial containing block, so
**every** scroll container between the anchor and the root counts. The spec's reassurance that "an
abspos next to its anchor in the DOM remains visible because it is clipped by the same scroller"
never applies to a top-layer popover.

### ⚠️ Methodological warning: the clipping check lands a frame late

Chromium settles the clipping branch only after a full lifecycle / paint update, so **mutating the
DOM and measuring in the same task yields a false negative**: the surface still reads as painted,
which looks like proof that clipping is not the cause and that un-clipping the anchor does not help.
`visibility: hidden` resolves synchronously, so a probe that mixes the two sees them disagree for no
apparent reason. This produced a wrong first triage ("occlusion, not clipping"). Always let at least
one `requestAnimationFrame` pass before reading `elementFromPoint`, and prefer changing the fixture
over mutating a live page.

## Who this affected

**Every adapter, not just popper.** Nine design-system packages call `useAnchoredPopover`: `popup`,
`tooltip`, `inline-dialog`, `spotlight`, `dropdown-menu`, `datetime-picker`, `avatar-group`,
`react-select`, `select`, plus both `@atlaskit/popper` adapters. None of them ever hid its surface
flag-off: none reads popper's `isReferenceHidden` (`popup` only forwards it to a custom
`popupComponent`, and its default component ignores it), and legacy Popper.js' `hide` modifier only
stamped `data-popper-reference-hidden` / `data-popper-escaped` attributes. Browser-driven hiding was
new behaviour for all of them, acquired by accident with anchor positioning.

**The JavaScript fallback never hides.** So before this decision the same component behaved
differently by code path: hidden on the CSS Anchor Positioning path, painted on the fallback.

**Top-layer's own contract already said "stays".** `__tests__/playwright/popover.spec.tsx`, "scroll
does not close popover", scrolled the trigger fully out of a 300px scroller and asserted the content
visible. That is exactly the strong-hide geometry, and the assertion passed only because
`toBeVisible()` cannot see strong hiding. The test now hit-tests (see "Guarded by").

**Concrete consumers.**

- `capacity-planning-core`'s drag handle
  (`.../table/common/drag-handle-button/DragHandleButton.tsx`), a `<Popper>` whose anchor is a bare
  `<div />` at `left: -8px` inside a clipped cell, so it is permanently outside the clip edge.
  Reproduced end to end: flag-off the button paints, flag-on its rect is identical but
  `document.elementsFromPoint()` at its centre returns the `<td>`. See `popper-migration.md`.
- Confluence `space-shortcuts`
  (`confluence/next/packages/space-shortcuts/src/DraggableShortcutsItem.tsx`) renders a controlled
  `<Popup>` whose trigger is `visibility: hidden; max-width: 0; max-height: 0; overflow: hidden`,
  with the comment "the trigger is hidden". A compound component, not popper, and exactly the case
  where the trigger is deliberately invisible and the surface must paint.
- `spotlight` renders `<Popover mode="manual">` anchored to a programmatically chosen target, and
  production callers pass `shouldDismissOnClickOutside={false}`. A modal body is a real clipping
  ancestor (`modal-dialog`'s scroll container). A strongly hidden spotlight with its own Next / Done
  / Dismiss controls as the only way out is a **deadlock**, not a graceful hide.

**Accessibility.** A menu, select or date picker holds focus inside the popover. Wheel scrolling or
a layout shift that pushes the trigger out of its scroller leaves the popover open and unpainted
with focus still inside it — and, in Chrome, still in the accessibility tree and still reachable by
Tab (see the behaviour table above). So the failure is not focus trapped somewhere unreachable: it
is keyboard and screen-reader users operating a surface that sighted users cannot see, and mouse
users cannot click. (Separately, a `visibility: hidden` anchor makes Firefox skip the element during
`<dialog>` initial-focus traversal; see `positioning.md`.)

## Decision

`applyAnchorPositioning` writes `position-visibility: always` inline, in the same `setStyle` call as
`position-anchor`, `position-area`, `position-try-fallbacks`, `margin` and `inset`. The declaration
is restored on cleanup like every other one in that call, including on a consumer-owned element
(`@atlaskit/popper`'s `createPopper`), where `setStyle`'s snapshot-and-restore semantics already
exist for exactly that reason.

### Which path it lands on

`useAnchoredPopover` resolves its path once, from `supportsAnchorPositioning()` (plus the
`forceFallbackPositioning` test escape), and then calls exactly one of the two `apply*` functions.
The write goes on the CSS one only:

- **`anchor-positioning/apply-anchor-positioning.tsx` — written.** This is the only code in the
  package that writes `position-anchor`, so it is the only code that can give a box a default anchor
  and therefore the only code that can arm browser-driven hiding. The fix and the cause are in one
  function, which is what keeps them from drifting apart.
- **`javascript-fallback/apply-javascript-fallback-positioning.tsx` — not written.** It positions
  with measured `position: fixed` coordinates and never writes `position-anchor`, so the property
  has no default anchor to evaluate and would be an inert declaration. Writing it anyway would be
  harmless but misleading: it would suggest the fallback has a hiding behaviour to turn off. That
  path already never hides, which is the behaviour this decision makes universal.
- **No `supportsPositionVisibility` probe**, unlike `supportsAnchorSize`. That probe exists because
  an engine can have anchor positioning without `anchor-size()`, and the fallback there is a
  _different_ value (measured pixels) that has to be computed. Here the fallback is nothing: an
  engine that does not understand `position-visibility` drops the declaration as invalid, and the
  same engine has no `position-visibility` hiding to opt out of, so the unsupported case and the
  desired behaviour coincide. A probe would buy a `CSS.supports` call and no difference in outcome.
- **`useAnchoredPopoverAtPoint` inherits it**, because it mounts a synthetic anchor and delegates to
  `useAnchoredPopover`. See "Point-anchored popovers were never affected" in `popper-migration.md`:
  that anchor cannot be clipped, so this is a no-op there rather than a fix, and it is kept only so
  there is one story rather than two.

The write is **unconditional**, with no option. Nothing in AFM wants browser-driven hiding of a
top-layer surface today; the eight compound adapters acquired it by accident, and a positioning hook
that documents itself as knowing "nothing about visibility or animation" should not ship a
visibility policy implicitly, let alone a different one per code path. If a consumer arrives with a
concrete case for hiding, add an opt-in `positionVisibility` option to `useAnchoredPopover` then. If
product wants "close the menu when its trigger leaves the screen", implement it explicitly (an
`IntersectionObserver` on the anchor that closes the popover) so that focus and the accessibility
tree are handled, rather than through a browser vote that nothing can observe.

### Superseded first cut (same day)

The first implementation was popper-local: `<Popper>` wrote the property from its own
`useLayoutEffect`, and `createPopper` stamped `data-ds--popper-anchored` and injected a
zero-specificity `:where()` rule, on the argument that an inline style is the wrong tool for a
caller-owned element. Its notes argued the other eight adapters should keep `anchors-visible`
because "full clipping means the user cannot see the trigger, so hiding is the correct outcome".
Replaced because:

1. the primitive's own browser test states the opposite contract;
2. no adapter ever hid flag-off, so the "legacy contract" argument was never popper-specific;
3. the compound-component counter-example exists (Confluence `space-shortcuts`);
4. the CSS path already writes `margin`, `inset` and `position-anchor` inline on the caller-owned
   element, so the inline objection did not hold and the rule and its shared injector were
   unnecessary;
5. spotlight's deadlock is fixed at the root instead of as a follow-up.

## Trade-offs (accepted)

- A surface whose trigger scrolls away floats detached at the anchor's off-screen position, exactly
  as legacy Popper.js and the JS fallback behave. `position-try-fallbacks` still applies.
- A consumer cannot opt back into browser-driven hiding without `!important`, on either the
  `<Popover>` host or a `createPopper` element. Accepted: no consumer wants it, and the escape hatch
  is an option on the hook, not a stylesheet fight.

## Guarded by

- `__tests__/vr-tests/popover-position-visibility.vr.tsx` and
  `examples/89-vr-popover-position-visibility.vr.ap.tsx`: the two triggers, photographed. A strongly
  hidden popover keeps `:popover-open`, `opacity: 1` and a correct rect and merely stops painting,
  so whether it is painted is the only observable, and a screenshot is the direct assertion on it.
  Each fixture renders the popover as a solid block on blank page; dropping the declaration fails
  both at ~42,600 pixels. Snapshotted on **`desktop-chromium` and `desktop-webkit`**, because paint
  is the only observable WebKit exposes and so VR is WebKit's only guard.

- `__tests__/playwright/popover.spec.tsx`, "scroll does not close or hide popover": scrolls the
  trigger fully out of its container, guards that geometry, then hit-tests the popover's own centre
  with a retry for the frame-late clipping check. `examples/117-testing-popover-scroll.tsx` gained a
  200px spacer above the container so the clipped trigger position, and the popover below it, stay
  inside the viewport.
- `popper/src/__tests__/playwright/top-layer-position-visibility.spec.tsx`: the popper adapter, on
  an anchor clipped out of a scroller (`popper/examples/13-flag-clipped-anchor.tsx`), hit-tested in
  both gate states. That is what makes it flag PARITY and not just "the new path paints".

**The hit-tests only bite on Chromium.** `top-layer` opts into `desktop-firefox` and
`desktop-webkit` (`atlassian.integrationTests.additionalBrowsers`), so `popover.spec.tsx` runs on
all three, but with the declaration removed only chromium fails: Firefox never hides, and WebKit
still answers `elementsFromPoint` with the popover (both measured). `popper` does not opt in, so its
spec is chromium-only. Do not read the three-project run as three-engine coverage.

### Nothing here asserts the declaration

Not the VR fixtures, not the hit-tests, and deliberately no unit test. Both of the obvious
declaration-level options were written first and then deleted:

- A **jsdom unit test**. Its `cssstyle` backend drops the property (it knows `position-anchor` but
  not this one), so the test cannot even read the value back — it has to record the `setProperty`
  call off `CSSStyleDeclaration.prototype`. That asserts only that a line of code ran.
- **`toHaveCSS('position-visibility', 'always')`** in the popper spec, on the imperative
  `createPopper` element. A declaration can be present, correct, and have no effect — the exact
  shape `notes/rules/testing.md` was written about, after the `shouldFitViewport` bug shipped for
  months behind tests that all passed.

The imperative adapter needs no replacement: it shares the one `applyAnchorPositioning` call that
writes the property, whose effect the VR fixtures photograph, and its caller-owned fixture is
already in `popper/src/__tests__/vr-tests/index.vr.tsx` in both gate states, with the promotion
contract in `popper/src/__tests__/unit/create-popper-top-layer.test.tsx`. Adding a clipped-anchor
imperative fixture would exercise the same line through a second caller.

## Prior art

Two editor surfaces already set this property by hand on CSS-anchor-positioned content:
`editor-plugin-ai-suggestions/src/ui/components/AnchoredCard.tsx` uses
`positionVisibility: 'always'`, and
`editor-plugin-block-controls/src/ui/block-controls-left-surface.tsx` deliberately opts into
`anchors-valid` — which Chrome 143/153 rejects as invalid, so that declaration is dead in Chrome and
live in Safari and Firefox. The property is a per-surface decision, which is what this primitive now
leaves it as.

## Related

- `notes/migrations/popper-migration.md`, "Decision: top-layer never lets the browser hide an
  anchored surface": the popper-facing account, motivating consumers and the `createPopper` detail.
- `notes/migrations/spotlight-migration.md`.
- `notes/architecture/positioning.md`.
