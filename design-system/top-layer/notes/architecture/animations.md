# Animations

> How `@atlaskit/top-layer` achieves entry and exit animations for popovers and dialogs, the
> critical constraint for exit animations, and why animation stays on the `Popover` primitive.

---

> **Which component to use:** Use `Popup` when you have a trigger button (browser manages
> visibility). Use `Popover` directly when you have a custom trigger lifecycle (hover, timers,
> external state) — `Popover` is unopinionated (visibility + animation only), so compose it with the
> `useAnchorPosition` hook when you need anchor positioning. See [overview.md](./overview.md)
> for full examples.

## The CSS mechanism

### Entry: `@starting-style`

When a popover enters the top layer (via `showPopover()` or `dialog.showModal()`), CSS
`@starting-style` defines the initial values that the element transitions **from**. The browser
transitions from these starting values to the element's resting state.

```css
[data-ds-popover-slide-and-fade]:popover-open {
	opacity: 1;
	transform: none;
}

@starting-style {
	[data-ds-popover-slide-and-fade]:popover-open {
		opacity: 0;
		transform: translate3d(var(--ds-popover-tx), var(--ds-popover-ty), 0);
	}
}
```

The element starts at `opacity: 0` with a translate offset, then transitions to `opacity: 1` with no
transform. The browser handles the transition automatically when the element enters the top layer.

### Exit: `allow-discrete` on `display` and `overlay`

Normally, `display: none` (which is what happens when a popover closes) is not animatable — it snaps
instantly. `transition-behavior: allow-discrete` tells the browser to keep the element visible
during the transition so that other properties (like `opacity` and `transform`) can animate.

The `overlay` property is also transitioned with `allow-discrete` to keep the element in the top
layer during the exit transition (preventing it from falling behind other content).

```css
[data-ds-popover-slide-and-fade] {
	opacity: 0;
	transform: translate3d(var(--ds-popover-tx), var(--ds-popover-ty), 0);
	transition:
		opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
		transform 175ms cubic-bezier(0.15, 1, 0.3, 1),
		overlay 175ms allow-discrete,
		display 175ms allow-discrete;
}
```

When `:popover-open` is removed (via `hidePopover()`), the element transitions from the open state
(`opacity: 1`, `transform: none`) to the closed state (`opacity: 0`, translated), then `display` and
`overlay` snap to their closed values after the transition completes.

---

## The critical constraint: DOM persistence

**The DOM element must remain in the document for exit animations to play.**

CSS transitions require an element in the DOM to transition its properties. If React unmounts the
component (removes it from the DOM) at the same time as calling `hidePopover()`, the element is gone
before the browser can play the exit transition.

This is the fundamental tension between React's conditional rendering model (mount/unmount) and
CSS-driven exit animations (which need the element to persist).

---

## Two rendering patterns

### 1. Always-rendered (Popup compound pattern) — exit animations work automatically

In the `Popup` compound component, `Popup.Content` is always present in the component tree. The
`Popup.Trigger` calls `togglePopover()` to show/hide, and the browser manages visibility via
`:popover-open`. The element stays in the DOM at all times.

```tsx
<Popup placement={{ edge: 'end' }} onClose={handleClose}>
	<Popup.Trigger>
		<Button>Open</Button>
	</Popup.Trigger>
	{/* Always rendered — browser manages visibility */}
	<Popup.Content role="dialog" label="Example" animate={slideAndFade()}>
		<PopupSurface>Content here</PopupSurface>
	</Popup.Content>
</Popup>
```

**No glue code needed.** The browser handles the full lifecycle:

- Click trigger → `showPopover()` → entry animation via `@starting-style`
- Click outside / press Escape → `hidePopover()` → exit animation via `allow-discrete`
- Element stays in DOM throughout

### 2. Conditionally-rendered (mount/unmount pattern) — requires glue code

Some components use React state to conditionally render the popover/dialog. The component mounts
when it should be visible and unmounts when it should be hidden. This is the pattern used by:

- **Tooltip**: mounts `TopLayerTooltipPopup` when `state !== 'hide'`, unmounts on hide
- **Modal dialog**: wraps in `<ModalTransition>` (ExitingPersistence) which delays unmount

**Exit animation breaks** with naive conditional rendering because React removes the element from
the DOM before the CSS transition can play.

**The glue code pattern** (old approach, replaced by `isOpen` — see below):

> **This pattern is no longer recommended.** It is documented here for historical context. Use the
> `isOpen` prop instead, which handles the full exit animation lifecycle internally.

The old approach required every consumer to:

1. Keep the component mounted during exit (via intermediate state or ExitingPersistence)
2. Call `hidePopover()` or `dialog.close()` to start the CSS exit transition
3. Listen for `transitionend` (with a fallback timeout using `exitDurationMs + 50`)
4. When the transition completes, allow the component to unmount

**Tooltip (old):**

```
tooltip-manager calls hide() → setState('top-layer-exit') → component stays mounted
→ useLayoutEffect calls hidePopover() → CSS exit transition plays
→ transitionend fires → setState('hide') + finishHideAnimation() → component unmounts
```

**Modal-dialog (old):**

```
consumer sets isOpen=false → ExitingPersistence keeps mounted, isExiting=true
→ useLayoutEffect calls dialog.close() → CSS exit transition plays
→ transitionend fires → onExitFinish() → ExitingPersistence unmounts
```

---

## The `isOpen` prop

The glue code pattern described above has been replaced by the `isOpen` prop, which moves the full
exit animation lifecycle into the primitive itself. Consumers always render the element and control
visibility declaratively via `isOpen` — no glue code needed.

### API by component

`isOpen` is **required** on `Popover` and `Dialog`. `Popup.Content` receives it from context:

| Component       | `isOpen`         | Rationale                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Popover`       | **Required**     | Core building block — consumers always have open/close state. Unopinionated: handles visibility and animation only. For anchor positioning, compose with the `useAnchorPosition` hook. Has ARIA role enforcement and hint mode fallback. Making `isOpen` required eliminates mount-to-show / unmount-to-hide entirely. |
| `Popup.Content` | **From context** | Thin wrapper over `Popover` that reads `isOpen` and positioning from the `<Popup>` compound's context — the consumer doesn't pass it. Inside the compound, the browser is the source of truth via `togglePopover()`. For standalone usage (e.g. tooltip, spotlight), use `Popover` directly.                           |
| `Dialog`        | **Required**     | Same as `Popover`. Every consumer already controls dialog visibility; `isOpen` makes it declarative.                                                                                                                                                                                                                   |

### Required (`Popover` / `Dialog`)

Always render the element. Control visibility via `isOpen`:

```tsx
import { slideAndFade, fade } from '@atlaskit/top-layer/animations';

// Dialog — always mounted, controlled by isOpen
<Dialog
  isOpen={isDialogOpen}
  onClose={handleClose}
  label="Settings"
  animate={dialogFade()}
>
  <h2>Settings</h2>
  <p>Dialog content...</p>
</Dialog>

// Popover — always mounted, controlled by isOpen
<Popover isOpen={isTooltipVisible} animate={slideAndFade()}>
  <TooltipContainer>...</TooltipContainer>
</Popover>
```

> Animation presets (`slideAndFade()`, `fade()`, etc.) are exported from
> `@atlaskit/top-layer/animations`. See the preset source for available options.

- `isOpen: true` → calls `showPopover()` / `showModal()`, entry animation plays via
  `@starting-style`
- `isOpen: false` → calls `hidePopover()` / `close()`, exit animation plays via `allow-discrete`
- The element stays mounted in the DOM the whole time
- No mount/unmount lifecycle — the consumer never conditionally renders the primitive

### `Popup.Content` (thin context wrapper)

`Popup.Content` is a thin wrapper over `Popover` that reads `isOpen` and positioning from the
`<Popup>` compound's context — the consumer doesn't pass `isOpen`:

```tsx
// Inside Popup compound — isOpen comes from context, consumer doesn't pass it
<Popup>
	<Popup.Trigger>{(props) => <button {...props}>Open</button>}</Popup.Trigger>
	<Popup.Content animate={slideAndFade()}>
		<MenuItems />
	</Popup.Content>
</Popup>
```

For standalone usage (e.g. tooltip, spotlight), use `Popover` directly instead of `Popup.Content`:

```tsx
// Standalone usage — use Popover directly, not Popup.Content
<Popover role="tooltip" animate={slideAndFade()} isOpen={state !== 'hide'}>
	<TooltipContainer>...</TooltipContainer>
</Popover>
```

### Children lifecycle (`showChildren` pattern)

By default, `Popover` and `Dialog` conditionally render their children based on `isOpen`:

- **`isOpen: true`** → children mount, `showPopover()` / `showModal()` called, entry animation plays
- **`isOpen: false`** with animation → `hidePopover()` / `close()` called, exit animation plays,
  children unmount after `transitionend` (with a `setTimeout` fallback of `exitDurationMs + 50ms`)
- **`isOpen: false`** without animation → `hidePopover()` / `close()` called, children unmount
  immediately

This means consumers get **conditional rendering for performance** (children unmount when closed)
while still getting **exit animations** (children stay mounted long enough for the CSS transition
to complete). The primitive handles the lifecycle automatically.

### `onExitFinish` callback

`onExitFinish` fires when the exit animation completes (or immediately for non-animated closes).
This signals to consumers that the close lifecycle is fully done. Used by:

- **Tooltip**: calls `finishHideAnimation()` to complete the tooltip-manager lifecycle
- **Modal-dialog**: calls `onCloseComplete` and signals `ExitingPersistence` to unmount

### Behavior summary

- **`isOpen: true`** → children mount, `showPopover()` / `showModal()`, entry animation plays
- **`isOpen: false`** → `hidePopover()` / `close()`, exit animation plays (if animated), children
  unmount after animation completes (or immediately if no animation). `onExitFinish` fires.
- **`Popup.Content`** → `isOpen` is provided via context from the `<Popup>` compound (the browser
  manages state through `togglePopover()`). For standalone usage, use `Popover` directly with
  `isOpen`.

> **Note:** There is no "uncontrolled" mount-to-show mode. `Popup.Content` only calls
> `showPopover()` when `isOpen` is `true` (from context). For standalone popover usage (e.g.
> tooltip, spotlight), use `Popover` directly with an explicit `isOpen` prop.

### Type enforcement

`Popover` and `Dialog` require `isOpen` at the type level — you cannot use them without it.

`Popup.Content` does not accept `isOpen` as a prop — it reads it from the `<Popup>` compound's
context. For standalone usage (e.g. tooltip, spotlight), use `Popover` directly, which requires
`isOpen`.

### Zero cost for non-animation users

When `isOpen` is provided without an `animate` preset, the show/hide is instant: no `transitionend`
listeners are bound, no fallback timeouts are scheduled, and no animation data attributes are
applied. Only consumers who use both `isOpen` and `animate` pay the cost of the animation lifecycle
(the `transitionend` listener and its fallback timeout of `exitDurationMs + 50ms`).

### Why `isOpen` is required on `Popover` / `Dialog`

- `Popover` is the core building block (unopinionated — visibility + animation only, with ARIA role
  enforcement and hint mode fallback). For anchor positioning, compose with the `useAnchorPosition`
  hook. `Popup.Content` is a thin context wrapper over it. `Dialog` is the modal equivalent.
- Every consumer already has open/close state — `isOpen` makes it declarative
- Eliminates the mount-to-show / unmount-to-hide pattern entirely
- No glue code for exit animations: just set `isOpen={false}`, the primitive handles the rest
- Zero overhead for non-animation users: when `animate` is not provided, `isOpen={false}` hides
  instantly

### Alternatives considered

We evaluated several alternatives before landing on `isOpen`. Each was rejected for specific
technical reasons documented below.

#### 1. View Transitions API (`document.startViewTransition()`)

The View Transitions API captures a screenshot of old state, applies a DOM mutation, then
cross-fades via `::view-transition-old` / `::view-transition-new` pseudo-elements. The consumer
would use conditional JSX and wrap state changes in `startViewTransition()`:

```tsx
// Consumer pattern — conditional JSX with view transition on close
{
	isOpen && <Popover>Content</Popover>;
}

// To close with animation:
document.startViewTransition(() => {
	flushSync(() => setIsOpen(false)); // React unmounts the popover
});
// Browser cross-fades old snapshot → empty space
```

**This approach does work technically.** View Transition pseudo-elements render above other content,
and the snapshot is captured _before_ `flushSync` removes the element from the DOM. A toast
component using this exact pattern (conditional JSX + `popover="manual"` + View Transitions)
successfully animates entry and exit. The pattern is:

```tsx
function viewTransition(update: () => void) {
	document.startViewTransition(() => flushSync(update));
}

// Show: viewTransition(() => setToast(args))
// Hide: viewTransition(() => setToast(null))
```

**Why we chose `isOpen` + `@starting-style` / `allow-discrete` instead:**

1. **The caller must own the transition, not the primitive.** View Transitions require wrapping the
   state change in `document.startViewTransition(() => flushSync(...))`. This means every consumer
   must remember to use this pattern — the primitive itself cannot enforce it. If a consumer forgets
   and writes `setIsOpen(false)` directly, the element disappears instantly with no animation.
   Silent failure. With `isOpen`, the primitive owns the full lifecycle — the consumer just sets a
   boolean and the exit animation plays automatically.

2. **`flushSync` is an advanced API.** Pushing `flushSync` onto every consumer is an ergonomic tax.
   It opts out of React's batching and can cause performance issues if misused. `isOpen` keeps the
   consumer API simple: pass a boolean, done.

3. **No per-element control.** View Transitions apply to the entire document by default. Each
   animated element would need a unique `view-transition-name` to isolate its transition from others
   on the page. With multiple popovers, tooltips, or dialogs, this requires dynamic name generation
   and cleanup.

4. **Entry animations still need `@starting-style`.** View Transitions for entry would flash the old
   empty state before transitioning to the new state with the popover. `@starting-style` is the
   correct CSS mechanism for entry animations of top-layer elements. Since we need `@starting-style`
   for entry anyway, using `allow-discrete` for exit keeps both directions in the same CSS-native
   mechanism — one system instead of two.

5. **Platform alignment.** `@starting-style` + `allow-discrete` is the CSS spec's _intended_
   mechanism for animating top-layer entry/exit (see CSS Transitions Level 2). View Transitions are
   designed for document-level content transitions (page navigations, layout changes). Using them
   for individual component lifecycle is possible but not the intended use case.

|                          | `isOpen` + CSS                      | View Transitions                                  |
| ------------------------ | ----------------------------------- | ------------------------------------------------- |
| Who owns exit lifecycle? | Primitive (declarative)             | Consumer (imperative)                             |
| Consumer API             | `isOpen={false}`                    | `startViewTransition(() => flushSync(...))`       |
| Failure mode             | Can't forget — primitive handles it | Silent — no animation if consumer forgets wrapper |
| Entry mechanism          | `@starting-style` (same system)     | Separate — still needs `@starting-style`          |
| Per-element isolation    | Automatic (CSS on the element)      | Needs unique `view-transition-name`               |

**Verdict:** View Transitions are a viable mechanism for top-layer exit animations (proven in
practice with a toast component), but they push lifecycle ownership to the consumer via
`startViewTransition` + `flushSync`. `isOpen` + `allow-discrete` keeps the primitive in control,
uses a single CSS-native system for both entry and exit, and has simpler consumer ergonomics.

#### 2. Wrapper component (`<AnimatePresence>` / `<PopoverAnimation>`)

A wrapping component that intercepts unmounting to delay DOM removal during exit animations:

```tsx
// Hypothetical consumer API
<PopoverAnimation animate={slideAndFade()}>{isOpen && <Popover>Content</Popover>}</PopoverAnimation>
```

The wrapper would detect when its child disappears, keep a clone rendered during the exit animation,
then remove it after `transitionend`.

**Why it converges back to `isOpen`:**

1. **The wrapper needs the same boolean signal.** To know _when_ to start an exit animation, the
   wrapper must detect that the child has been removed. It does this by comparing previous and
   current children — which requires the consumer to pass a conditional (`{isOpen && ...}`). The
   boolean that drives the conditional _is_ `isOpen`. The wrapper just processes it one level up.

2. **Child cloning is fragile.** To keep a "ghost" of the exiting child rendered, the wrapper must
   clone the React element tree. This breaks with:
   - Refs (the clone has different ref targets)
   - Context (the clone may read stale context)
   - Effects (the clone's effects re-run or don't clean up correctly)
   - Keys (React may reconcile the clone incorrectly)

3. **Added weight for all consumers.** The wrapper component, its diffing logic, and its clone
   management add bundle size and runtime cost for _every_ consumer — even those not using
   animations. With `isOpen`, non-animated usage is a simple `showPopover()`/`hidePopover()` call
   with zero overhead.

4. **`hidePopover()` must be called, not just DOM tricks.** For `popover` elements, the browser
   manages top-layer membership. Simply keeping a clone in the DOM doesn't keep it in the top layer.
   The wrapper would need to call `hidePopover()` on the _real_ element (not the clone) to trigger
   the CSS exit transition. But if the real element is being unmounted by React… it's gone. The
   wrapper can't call methods on unmounted elements.

5. **Diverges from the platform model.** The browser's `popover` API is inherently stateful: an
   element is either showing (`:popover-open`) or not. `isOpen` maps directly to this state. A
   wrapper component adds an abstraction layer that obscures this mapping.

**View Transitions variant:** Could a wrapper use View Transitions internally instead of cloning?

```tsx
<AnimatedPopover animate={slideAndFade()}>{isOpen && <Popover>Content</Popover>}</AnimatedPopover>
```

The wrapper would detect children disappearing, temporarily re-render the old children to get them
back in the DOM, then call `startViewTransition(() => flushSync(() => remove))`. This avoids cloning
— but introduces two new problems:

- **Double mount.** The old children re-mount briefly for the screenshot, firing all their effects a
  second time (focus management, analytics, `showPopover()`).
- **One-frame flash.** Between re-rendering old children and `startViewTransition`, there's a frame
  where the popover is visible before the transition captures it.

The root cause: View Transitions need the old DOM present _when called_. In React, by the time a
wrapper detects its children changed, the commit is done. Re-creating old state means re-mounting.
The toast pattern works because the _state owner_ wraps the change in `startViewTransition` — a
wrapper can't do this because it doesn't control the parent's state change.

| Approach                   | Clone issues?          | Double mount?         | Flash?       | Enforceable?              |
| -------------------------- | ---------------------- | --------------------- | ------------ | ------------------------- |
| ExitingPersistence (clone) | ❌ Breaks refs/context | ✅ No                 | ✅ No        | ✅ Yes                    |
| VT wrapper (re-render old) | ✅ No clones           | ❌ Effects fire twice | ❌ One frame | ✅ Yes                    |
| VT at call site            | ✅ No clones           | ✅ No                 | ✅ No        | ❌ Consumer must remember |
| `isOpen` prop              | ✅ No clones           | ✅ No                 | ✅ No        | ✅ Yes                    |

**Verdict:** A wrapper component either converges to `isOpen` (just relocated), uses fragile child
cloning (ExitingPersistence), or uses View Transitions with double-mount and flash problems. None
improve on `isOpen`, which avoids all of these issues by keeping the element mounted.

#### 3. Imperative ref methods (`show()` / `hide()`)

```tsx
const ref = useRef<PopoverHandle>(null);
ref.current?.show(); // entry
ref.current?.hide(); // exit
```

**Why not:** Not React-idiomatic. Consumers must manage refs and call methods at the right lifecycle
point. Easy to get wrong (calling `hide()` after unmount, forgetting to call `show()`, race
conditions between React renders and imperative calls). `isOpen` is declarative — React handles the
timing.

#### 4. ExitingPersistence pattern (existing `@atlaskit/motion`)

The existing `ExitingPersistence` component delays unmounting by cloning exiting children:

```tsx
<ExitingPersistence>
	{isOpen && (
		<FadeIn>
			<Content />
		</FadeIn>
	)}
</ExitingPersistence>
```

**Why not:** Heavy. Requires cloning the entire child tree during exit. Doesn't work with CSS
`allow-discrete` (uses JS-driven keyframe animations instead). Adds `@atlaskit/motion` as a
dependency. The top-layer package's CSS-native approach is lighter and more performant.

#### 5. Always-rendered with no visibility API

Keep the element always rendered and let the browser manage everything:

```tsx
<Popover>{content}</Popover> // always in DOM, no isOpen
```

**Why not:** The element would call `showPopover()` on mount and be visible immediately. There's no
way for the consumer to say "render this but don't show it yet." The `Popup` compound solves this
because the trigger calls `togglePopover()` (and `Popup.Content` reads state from context), but
`Popover` and `Dialog` used directly have no trigger — they need explicit open/close control
via `isOpen`.

#### 6. Other alternatives that don't change the conclusion

**Web Animations API (WAAPI):** WAAPI was considered for the transition itself; it still requires
DOM persistence and a visibility signal, so it doesn't avoid the need for `isOpen`.

**React 19 `useTransition`:** `useTransition` defers updates but does not keep the element in the
DOM, so it doesn't solve the exit animation constraint.

#### Summary

| Alternative              | Core problem                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| View Transitions API     | Viable but pushes lifecycle to consumer via `startViewTransition` + `flushSync` — silent failure if forgotten |
| Wrapper component        | Converges to `isOpen` or uses fragile child cloning that breaks top-layer semantics                           |
| Imperative refs          | Not declarative; error-prone timing                                                                           |
| ExitingPersistence       | Heavy JS-driven approach; doesn't leverage CSS `allow-discrete`                                               |
| No visibility API        | Can't express "rendered but not yet visible"                                                                  |
| WAAPI                    | Changes motion implementation, not lifecycle — still needs DOM persistence + `isOpen`                         |
| React 19 `useTransition` | Defers updates, doesn't keep element mounted — doesn't solve exit constraint                                  |

`isOpen` is the minimal, correct abstraction. It maps directly to the browser's `showPopover()` /
`hidePopover()` / `showModal()` / `close()` APIs, keeps exit animations CSS-native via
`allow-discrete`, and adds zero overhead for non-animated usage.

### Migrations completed

- **Tooltip:** replaced `'top-layer-exit'` state machine glue + `exitingRef` guard + `transitionend`
  listener with `isOpen={state !== 'hide' && state !== 'top-layer-exit'}`. The ~70 lines of exit
  animation glue code in `TopLayerTooltipPopup` (manual `hidePopover()`, `transitionend` binding,
  fallback timeout) were removed. Tooltip now uses the `onExitFinish` callback from `Popover` to
  call `finishHideAnimation()` when the exit animation completes.
- **Modal-dialog:** replaced ExitingPersistence glue (manual `dialog.close()` + `transitionend` +
  `bind()` listener) with `isOpen={!isExiting}` on `Dialog`. The `onExitFinish` callback from
  `Dialog` fires `onCloseComplete` and signals `ExitingPersistence` to unmount.

> **Still using the old pattern?** If your component manually calls `hidePopover()` /
> `dialog.close()` and listens for `transitionend`, switch to the `isOpen` prop instead. Pass
> `isOpen={false}` to start the exit animation — the primitive handles `hidePopover()`,
> `transitionend`, and the fallback timeout internally. Use `onExitFinish` to coordinate external
> lifecycle (e.g. unmounting, callbacks). See the examples above.

---

## Why animation stays on `Popover`

During the design of `Popover`, we considered splitting animation into a
separate hook (like `useAnchorPosition`). We kept it on `Popover` because
animation and visibility are one concern.

### The constraint

Exit animations for top-layer elements require calling `hidePopover()` to
start the CSS transition (via `allow-discrete`), then waiting for the
transition to complete before the element leaves the top layer. The element
must stay in the top layer during the transition.

This means the component managing `hidePopover()` **must also know whether
to wait for an animation** before considering the element hidden. Visibility
and animation are interleaved — they cannot be separated without one side
reaching into the other's internals.

### What a separate hook would look like

```tsx
const { ref, isVisible } = usePopoverAnimation({
  isOpen,
  animation: slideAndFade(),
});

<Popover ref={ref} isOpen={isVisible}>...</Popover>
```

### Why it doesn't work

1. Entry works: `isOpen=true` → hook sets `isVisible=true` → `Popover` calls
   `showPopover()` → `@starting-style` plays the entry animation.

2. Exit breaks: `isOpen=false` → the hook needs to call `hidePopover()` on the
   element (to start the CSS exit transition), but if `Popover` still sees
   `isVisible=true`, it won't interfere. The hook would need to:
   - Call `hidePopover()` directly on the ref (reaching into `Popover`'s internals)
   - Keep `isVisible=true` during the transition
   - Listen for `transitionend` on the ref
   - Set `isVisible=false` after completion

   The hook ends up owning half of `Popover`'s lifecycle — calling `hidePopover()`,
   listening for DOM events, managing the programmatic-close guard. At that point
   it's not an animation hook, it's a visibility-management hook.

### The clean split

```
Popover           = top layer + visibility (isOpen) + animation (animate)
useAnchorPosition = positioning (separate concern)
Popup             = Popover + trigger + positioning (compound)
```

Animation and visibility are **one concern** — the exit animation is triggered
*by* the visibility change. Positioning is a **separate concern** — where
the element goes has nothing to do with whether it's visible.

Consumers who don't use animation pay nothing: when `animate` is omitted,
`showPopover()`/`hidePopover()` fire immediately with no listeners or timeouts.

---

## Progressive enhancement

Browsers without `@starting-style` support show/hide content instantly. The UI is functional, just
not animated. This is by design — animation is a progressive enhancement.

## Reduced motion

All animation presets include a `prefers-reduced-motion` media query that sets
`transition-duration: 0s`, so animations are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
	[data-ds-popover-slide-and-fade],
	[data-ds-popover-slide-and-fade]:popover-open {
		transition-duration: 0s;
	}
}
```
