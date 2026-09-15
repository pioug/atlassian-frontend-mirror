# @atlaskit/top-layer — Overview

## Components

### `Popover` (primitive)

The primary public surface. A `<div>` with the `popover` attribute, plus a small lifecycle:
animations, role-based focus management, light-dismiss, and nested-popover focus restoration. It
does **not** know about positioning or size — compose with `useAnchoredPopover` when anchor
positioning is needed.

The shared visibility terminology and state machine are defined by the
[canonical visibility lifecycle contract](./animations.md#canonical-visibility-lifecycle-contract).
In particular, `isOpen` expresses controlled intent while the primitive owns lifecycle phase and
host mounting.

`Popover` covers three usage patterns:

1. **Button opens anchored content** — pair with `useAnchoredPopover` and own the trigger yourself.
2. **Custom trigger lifecycle** — hover, timers, external state (e.g. tooltip).
3. **No anchor at all** — flags, toasts, fixed-position layers.

```tsx
import { useRef, useState } from 'react';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

function MyDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={() => popoverRef.current?.togglePopover()}
				{...getAriaForTrigger({ role: 'menu', isOpen, popoverId })}
			>
				Open menu
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="menu"
				label="Actions"
				isOpen={isOpen}
				shouldAnimate
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<MenuItem>Edit</MenuItem>
					<MenuItem>Delete</MenuItem>
				</PopoverSurface>
			</Popover>
		</>
	);
}
```

Notes:

- Focus restoration is automatic. The browser handles it for outermost popovers; for nested popovers
  with focus-capturing roles (dialog, menu, listbox, tree, grid, alertdialog), `Popover` snapshots
  `document.activeElement` on open (via `beforetoggle`) and restores it on close. Consumers do not
  need to wire a ref or call `.focus()` themselves.
- For trigger-less or custom-positioned UI, skip `useAnchoredPopover` and write the trigger
  lifecycle directly. Example:

```tsx
<Popover ref={popoverRef} role="tooltip" isOpen={isVisible} mode="hint">
	Tooltip content
</Popover>
```

### `Dialog`

Modal dialogs. Blocks interaction with the rest of the page. Uses native `<dialog>` with
`showModal()`. You control visibility via `isOpen`.

```tsx
import { Dialog } from '@atlaskit/top-layer/dialog';

function MyModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsOpen(true)}>Open dialog</button>
			<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} label="Settings" shouldAnimate>
				<h2>Settings</h2>
				<p>Modal content</p>
			</Dialog>
		</>
	);
}
```

---

## Hooks

### `useAnchoredPopover`

The one hook for anchored popovers: it positions and sizes a popover relative to its anchor, and
owns every inline style on the popover host. Includes a JavaScript fallback for browsers without CSS
Anchor Positioning support. It replaced four hooks (`useAnchorPosition`, `useAnchorPositionAtPoint`,
`useWidthFromAnchor`, `useFitAvailableSpace`), because `anchor-size()` is part of the same CSS spec
as `position-area` — splitting "where the box goes" from "how big it is relative to its anchor" was
our line, not the platform's.

- **`anchorRef`** — the element to position against. For a viewport coordinate instead, use the
  sibling `useAnchoredPopoverAtPoint({ getPoint })`, which creates a synthetic anchor and delegates
  here. See [../decisions/anchored-popover-at-point.md](../decisions/anchored-popover-at-point.md).
- **`isEnabled`** — `false` for "do not position". Defaults to `true`.
- **`placement`** — required. Carries the axis, edge, alignment, offsets, and `minSize`.
- **`inlineSize` / `blockSize`** — `'content'` (default), `'match-anchor'`, `'min-anchor'` or
  `'max-available'`.

For the full positioning model (anchor kinds, placement, offset, fallbacks) see
[architecture/positioning.md](./positioning.md); for the size recipe and the measurements behind it,
[decisions/fit-available-space.md](../decisions/fit-available-space.md).

### `useArrowNavigation`

Arrow key navigation for composite widgets (menus, listboxes). Consumers wire this into their
components — top-layer does not bake in menu keyboard behavior (see
[decisions/menu-keyboard.md](../decisions/menu-keyboard.md)).

### `useSimpleLightDismiss`

Light dismiss handler for manual popovers that need click-outside and Escape key behavior.

---

## Utilities

### Animation

`Popover` and `Dialog` expose a `shouldAnimate` prop. Pass `true` to enable the component's default
CSS entry/exit transition, or omit/pass `false` to disable animation. See
[animations.md](./animations.md) for how the animation system works.

### Close event helpers

`@atlaskit/top-layer/dialog` and `@atlaskit/top-layer/popover` export helpers for bridging legacy
`onClose` signatures during migration.

### `PopoverSurface`

`@atlaskit/top-layer/popover-surface` exports a styled surface component with standard DS styling
(background, border-radius, elevation).

### `placementMap`

`@atlaskit/top-layer/placement-map` exports placement conversion utilities for mapping legacy
Popper.js placement strings to top-layer placement objects.

### `DialogScrollLock`

`@atlaskit/top-layer/dialog-scroll-lock` exports a component that prevents background scrolling when
a modal dialog is open.

---

## When to use what

| Scenario                                               | Component                        | `isOpen`?              | Focus Management                            |
| ------------------------------------------------------ | -------------------------------- | ---------------------- | ------------------------------------------- |
| Button opens dropdown/menu                             | `Popover` + `useAnchoredPopover` | Yes — consumer manages | Automatic (role-based, browser Popover API) |
| Hover/focus shows tooltip                              | `Popover` + `useAnchoredPopover` | Yes — consumer manages | No focus changes (`tooltip`)                |
| Toast/flag notification                                | `Popover`                        | Yes — `mode="manual"`  | No focus changes                            |
| Modal dialog                                           | `Dialog`                         | Yes — on `Dialog`      | Native `<dialog>` focus trap                |
| Custom trigger (timer, external)                       | `Popover` + `useAnchoredPopover` | Yes — consumer manages | Automatic (browser Popover API)             |
| Button opens anchored content with no custom lifecycle | `Popover` + `useAnchoredPopover` | Yes — consumer manages | Automatic (role-based, browser Popover API) |

---

## Architecture

```
Popover               = top layer + isOpen + shouldAnimate + mode + ARIA + (optional) nested-focus restoration
PopoverSurface        = presentational surface (background, radius, shadow)
useAnchoredPopover    = anchor positioning AND anchor-relative sizing (one hook, one writer per property)
Dialog                = <dialog> element + isOpen + shouldAnimate + onExitFinish
```

### Entry points

| Entry Point                                    | Purpose                                             |
| ---------------------------------------------- | --------------------------------------------------- |
| `@atlaskit/top-layer/popover`                  | Top-layer primitive and legacy `onClose` bridge     |
| `@atlaskit/top-layer/popover-surface`          | Presentational surface (background, radius, shadow) |
| `@atlaskit/top-layer/dialog`                   | Modal dialog and legacy `onClose` bridge            |
| `@atlaskit/top-layer/use-anchored-popover`     | Anchor positioning and anchor-relative sizing       |
| `@atlaskit/top-layer/resolve-placement`        | `TPlacementOptions` and `resolvePlacement`          |
| `@atlaskit/top-layer/use-arrow-navigation`     | Arrow key navigation hook for composite widgets     |
| `@atlaskit/top-layer/use-simple-light-dismiss` | Light dismiss for manual popovers                   |
| `@atlaskit/top-layer/placement-map`            | Legacy placement string conversion                  |
| `@atlaskit/top-layer/dialog-scroll-lock`       | Background scroll prevention for modals             |
| `@atlaskit/top-layer/focus`                    | Focus utilities (focus wrapping, initial focus)     |

### Focus management

Focus management is **role-based and automatic**. See [focus.md](./focus.md) for full details.

| Role      | Initial Focus           | Focus Wrapping              | Focus Restoration           |
| --------- | ----------------------- | --------------------------- | --------------------------- |
| `dialog`  | First focusable element | Tab wraps within content    | ✅ Auto-restores to trigger |
| `menu`    | First menu item         | No Tab wrapping (Tab exits) | ✅ Auto-restores to trigger |
| `listbox` | First/selected option   | Tab wraps within content    | ✅ Auto-restores to trigger |
| `tooltip` | No focus change         | No wrapping                 | ❌ No restoration           |
