# Server-side rendering (SSR) and hydration

> How `@atlaskit/top-layer/dialog` handles SSR and the first client render, and how this compares
> with the pre-top-layer `@atlaskit/modal-dialog` flow.

---

## TL;DR

Both the legacy `@atlaskit/modal-dialog` (feature gate `platform-dst-top-layer` off) and the new
`@atlaskit/top-layer/dialog` (feature gate on) produce the **same observable SSR behaviour**:

1. **SSR:** The modal is not visible. Nothing is painted in the user's first frame.
2. **Hydration:** React hydrates the page.
3. **First client render:** The modal opens and animates in. The consumer does not need to do
   anything extra — passing `isOpen={true}` on initial render is sufficient.

The implementations differ in how each step is realised. The user-visible result is the same.

---

## Why a `<dialog>` cannot be modally open during SSR

The HTML spec requires `dialog.showModal()` to be invoked on the element for it to be promoted to
the top layer, gain a `::backdrop`, make the rest of the document inert, and trap focus. `showModal`
is a DOM method — it cannot run on the server.

A `<dialog>` carries two related but distinct state bits in the spec:

- The `open` attribute — set whenever the dialog is shown (modal or non-modal).
- The `is modal` internal slot — `true` only when the dialog was opened via `showModal()`.

The two halves of the "show a modal dialog" algorithm in the HTML spec
([§4.11.4](https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-showmodal))
make the trap explicit:

> 1. If `subject` has an `open` attribute and `is modal` of `subject` is `true`, then return.
> 2. If `subject` has an `open` attribute, then throw an `"InvalidStateError"` `DOMException`.

In other words, you cannot "upgrade" an already-open non-modal dialog into a modal one. If the
server emits `<dialog open>`:

- The hydrated element is a **non-modal** dialog (`is modal` is `false`). It is visible but has no
  `::backdrop`, no top-layer promotion, no inert background, and no focus trap.
- Calling `showModal()` on it after hydration throws `InvalidStateError`. The only way to make it
  modal would be to call `close()` first and then `showModal()` — which causes a visible flash of
  the dialog in its non-modal state, followed by a separate open animation.

This is why the SSR HTML for a top-layer modal dialog must omit the `open` attribute entirely.
Rendering it open server-side is not just an animation issue — it is a spec-level dead end that
breaks modal semantics. The contract is therefore: render `<dialog>` closed during SSR, then call
`showModal()` in a layout effect on the client. The browser only places the element in the top layer
when `showModal()` runs.

### Spec references

- [§4.11.4 The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [§6.3.1 Modal dialogs and inert subtrees](https://html.spec.whatwg.org/multipage/interaction.html#modal-dialogs-and-inert-subtrees)
- [Top layer concept](https://html.spec.whatwg.org/multipage/interaction.html#top-layer)
- [`@starting-style` at-rule](https://drafts.csswg.org/css-transitions-2/#defining-before-change-style)
- [`transition-behavior: allow-discrete`](https://drafts.csswg.org/css-transitions-2/#transition-behavior-property)

---

## Top-layer dialog SSR flow (`@atlaskit/top-layer/dialog`)

### What server-side render produces

The `<dialog>` element is rendered inline at the call site with no `open` attribute:

```html
<dialog id="..." aria-label="...">
	<!-- children only rendered when showChildren=true, which mirrors isOpen on initial mount -->
</dialog>
```

The dialog is invisible because:

- The HTML spec defines the UA stylesheet for a closed `<dialog>` as `display: none`. The dialog is
  not rendered until it has the `open` attribute or `showModal()` has been called.
- We do not render the `open` attribute server-side, so the UA rule applies.

### What hydration does

1. React hydrates the existing `<dialog>` DOM node.
2. Our `useLayoutEffect` in `dialog-content.tsx` runs. If `isOpen` is `true`, it calls
   `dialog.showModal()`.
3. The browser promotes the element to the top layer, paints the `::backdrop`, makes the document
   inert, and runs the dialog focusing steps.
4. The CSS `@starting-style` rule defined in the animation preset triggers the entry transition
   (opacity, transform). The dialog animates in.

### Why the animation plays on first mount

`useAnimatedVisibility` starts `showChildren` equal to `isOpen`, so children mount with the dialog
on the first render. The browser's `@starting-style` rule fires whenever an element transitions from
`display: none` (or out of the top layer) to its rendered state — including the very first time
`showModal()` is called after hydration. No special-case code is needed for "first mount with
`isOpen=true` vs subsequent opens"; both go through the same code path.

### Pre-hydration: is there a window where the user sees something wrong?

No. The UA `display: none` on a closed `<dialog>` applies as soon as the browser parses the HTML,
before any JavaScript runs. There is no flash of an unstyled dialog and no flash of an open dialog.

### Hydration mismatch surface

The `<dialog>` element itself is the only added surface. React does emit warnings about its limited
support for the native `popover` attribute and certain dialog events during SSR — these are filtered
out in `__tests__/unit/ssr.tsx` and are expected to resolve as React improves support for these
primitives.

---

## Legacy modal SSR flow (`@atlaskit/modal-dialog`, flag off)

### What server-side render produces

Nothing in the modal subtree. The modal is wrapped in `@atlaskit/portal`, which:

- Uses `useIsSubsequentRender()` to gate rendering. The hook returns `false` on the initial render
  and `true` only after a mount effect runs. On the server (and during the first client render
  before effects fire), `Portal` returns `null`.
- Alternatively, when the newer `InternalPortalNew` implementation is active (gated by
  `platform_design_system_team_portal_logic_r18_fix`), the portal target state starts as `null` and
  is populated inside `useIsomorphicLayoutEffect`. The component still returns `null` until the
  effect runs.

Either way, **no modal markup is present in the server-rendered HTML**.

### What hydration does

1. React hydrates the page. The portal's mount effect runs.
2. The portal creates a container element under `document.body` (via `createAtlaskitPortal` /
   `appendPortalContainerIfNotAppended`).
3. The portal re-renders with the container available; `createPortal` mounts the modal subtree into
   the new container.
4. `FadeIn` (or the `Motion` component on the motion-uplift path) plays the entry animation via
   JS-driven CSS class toggling.
5. `FocusLock` traps focus inside the modal.

### Pre-hydration window

Because no modal markup is server-rendered, there is nothing to paint pre-hydration. The user sees
the page without the modal until JavaScript runs and the portal mounts.

---

## Side-by-side comparison

| Concern                     | Legacy modal (flag off)                               | Top-layer dialog (flag on)                                           |
| --------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| Server HTML for modal       | `null` (portal renders nothing)                       | `<dialog>` element, no `open` attribute                              |
| Why invisible pre-hydration | No markup at all                                      | UA stylesheet: closed `<dialog>` is `display: none`                  |
| Stacking escape             | Portal under `document.body` + `z-index`              | Browser top layer (native, no portal)                                |
| Animation driver            | JS (`FadeIn` / `Motion`) toggling CSS classes         | Pure CSS (`@starting-style` + `transition-behavior: allow-discrete`) |
| First-paint trigger         | Mount effect inside `Portal`                          | `useLayoutEffect` calling `showModal()`                              |
| Modal becomes visible after | Portal container appended + modal subtree rendered    | `dialog.showModal()` runs                                            |
| Focus trap                  | `react-focus-lock`                                    | Native `<dialog>` focusing steps                                     |
| Background inert            | `aria-hidden` siblings + `react-focus-lock` allowlist | Native `inert` on document outside the dialog                        |
| Backdrop                    | `<Blanket>` component                                 | `::backdrop` pseudo-element                                          |
| Hydration mismatch surface  | None (no SSR markup)                                  | `<dialog>` element (React filters expected warnings)                 |
| `dialog.showModal()` timing | n/a                                                   | First `useLayoutEffect` after hydrate                                |

## Why both arrive at the same UX

Both flows guarantee:

- Nothing modal is painted in the SSR'd HTML.
- After hydration, the modal appears and animates in without consumer intervention.
- The consumer API is `isOpen={true}` on initial render — no extra calls or refs required.

The differences are pure implementation: portal-and-JS-classes vs native-dialog-and-CSS. From a
user's perspective, the modal is invisible on first paint and animates in shortly afterwards in both
cases.

---

## Tests that lock this in

### `@atlaskit/top-layer`

- `__tests__/unit/ssr.tsx` — SSR + hydrate the basic dialog example, assert no unexpected React
  warnings (existing).
- `__tests__/unit/dialog-hydration.test.tsx` — Hydrate an `isOpen={true}` dialog and assert it is
  open after hydration without any consumer action.
- `__tests__/playwright/ssr-dialog.spec.tsx` — Full SSR string → hydrate → assert `<dialog>` becomes
  open as part of the initial render (next frame is acceptable).
- `__tests__/informational-vr-tests/ssr-dialog.vr.tsx` — Informational VR fixture with two
  post-hydration snapshots: the animated-in dialog, and the same example after the consumer closes
  it via the Close button.

### `@atlaskit/modal-dialog`

- `src/__tests__/playwright/ssr-startup-parity.spec.tsx` — Drives the same SSR-then-hydrate flow
  with `platform-dst-top-layer` both off and on, asserting equivalent observable behaviour.
- `src/__tests__/informational-vr-tests/ssr-startup-parity.vr.tsx` — Two post-hydration snapshots
  (one per `platform-dst-top-layer` flag value) to document pixel parity between the legacy and
  top-layer paths.

---

## VR coverage limitations

The informational VR fixtures (`ssr-dialog.vr.tsx` and the modal-dialog `ssr-startup-parity.vr.tsx`)
only capture **post-hydration** snapshots. They do not capture the "pre-hydration" frame the user
would see in the brief window between the SSR'd HTML painting and the first client layout effect
calling `showModal()`.

This is a deliberate trade-off, not an oversight:

- The VR runner (`@atlassian/gemini`) navigates to the example URL and lets the page hydrate before
  invoking the snapshot. There is no public `noHydrate` or `routes`-on-navigation hook to intercept
  the response and serve raw SSR HTML.
- Working around it inside the example (e.g. baking a "hydration latch" prop into the test fixture
  that delays setting `isOpen={true}`) would no longer exercise the `isOpen={true}`
  on-initial-render code path the fixture is meant to prove. The latched state is just "modal
  closed," which adds no new coverage over a hypothetical `isOpen={false}` example.
- Adding a closed-modal companion snapshot would produce a near-blank PNG that diffs poorly and adds
  little signal beyond the post-hydration shot.

The pre-hydration / no-action-required side of the contract is instead covered by:

- **Jest hydration test** (`__tests__/unit/dialog-hydration.test.tsx`) — hydrates an `isOpen={true}`
  example and asserts no unexpected React warnings.
- **Playwright behavioural spec** (`__tests__/playwright/ssr-dialog.spec.tsx`) — asserts the dialog
  opens and gains focus as part of the initial render in a real browser.
- **Inspection of source** — `@atlaskit/portal` uses `useIsSubsequentRender()` to gate rendering to
  `null` on the server, documented above in the legacy modal flow section.

If a future change to `@atlassian/gemini` exposes a way to snapshot before React mount, the VR
fixtures should be updated to add the pre-hydration snapshot then.

## Alternatives considered

### Wrap the top-layer `<dialog>` in `@atlaskit/portal`

Would match the legacy modal's SSR output byte-for-byte (nothing rendered server-side). Rejected:
the whole point of native `<dialog>` is that it escapes stacking contexts via the browser's top
layer; reintroducing a portal undoes that and adds a hydration tick before the dialog is even in the
DOM.

### Client-only mount gate (`useSyncExternalStore` / `useIsomorphicLayoutEffect`)

Would render no `<dialog>` markup on the server and avoid any SSR/CSR markup divergence. Rejected:
defers all dialog markup to a second paint and removes the chance for assistive technology to see
the `<dialog>` element synchronously after hydration. The current approach already produces the same
user-visible behaviour without these costs.

### Explicit `display: none` in our own stylesheet

Would survive an upstream consumer override of the UA `dialog { display: none }` rule. Rejected for
now: no consumer is known to override that rule, and adding the CSS slightly contradicts the
"primitive has no visual opinions" stance. Revisit if a real consumer breakage occurs.

### Render `<dialog open>` on the server

Would technically produce a visible dialog before hydration. Rejected for two compounding reasons:

1. A `<dialog open>` is a non-modal dialog — no top layer, no backdrop, no focus trap. Even
   pre-hydration this is an accessibility and UX regression: the user can interact with content
   behind the "modal".
2. The element cannot be upgraded to modal after hydration. The
   [`showModal()` algorithm](https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-showmodal)
   throws `InvalidStateError` when called on an element that already has an `open` attribute (and
   `is modal` is `false`). The only escape is to call `close()` and then `showModal()`, which
   produces a visible flash of the non-modal dialog followed by a separate open animation.

Both together make `<dialog open>` SSR a spec-level dead end for modal dialogs.
