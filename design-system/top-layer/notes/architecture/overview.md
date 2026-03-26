# @atlaskit/top-layer — Overview

## Components

### `Popup` (compound)

The most common pattern. A trigger button opens anchored content. The compound handles trigger
management, `aria-expanded`, `togglePopover()`, and anchor positioning automatically.

```tsx
import { Popup } from '@atlaskit/top-layer/popup';
import { slideAndFade } from '@atlaskit/top-layer/animations';

function MyDropdown() {
	return (
		<Popup placement={{ edge: 'end' }} onClose={handleClose}>
			<Popup.Trigger>
				<button>Open menu</button>
			</Popup.Trigger>
			<Popup.Content role="menu" label="Actions" animate={slideAndFade()}>
				<MenuItem>Edit</MenuItem>
				<MenuItem>Delete</MenuItem>
			</Popup.Content>
		</Popup>
	);
}
```

The consumer never thinks about `isOpen`. The trigger calls `togglePopover()`, the browser manages
visibility, and `aria-expanded` updates automatically.

### `Popover` (primitive)

Low-level building block. Handles visibility (`isOpen`) and animation only. Unopinionated about
positioning — compose with `useAnchorPosition` when anchor positioning is needed.

Use `Popover` directly when you have a custom trigger lifecycle (hover, timers, external state) or
when there's no anchor element (flags, toasts).

```tsx
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

function MyTooltip() {
	const [isVisible, setIsVisible] = useState(false);
	const targetRef = useRef(null);
	const popoverRef = useRef(null);

	useAnchorPosition({
		anchorRef: targetRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	return (
		<>
			<button
				ref={targetRef}
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
			>
				Hover me
			</button>
			<Popover
				ref={popoverRef}
				role="tooltip"
				isOpen={isVisible}
				mode="hint"
				placement={{ edge: 'end' }}
			>
				Tooltip content
			</Popover>
		</>
	);
}
```

### `Dialog`

Modal dialogs. Blocks interaction with the rest of the page. Uses native `<dialog>` with
`showModal()`. You control visibility via `isOpen`.

```tsx
import { Dialog } from '@atlaskit/top-layer/dialog';
import { dialogFade } from '@atlaskit/top-layer/animations';

function MyModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsOpen(true)}>Open dialog</button>
			<Dialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				label="Settings"
				animate={dialogFade()}
			>
				<h2>Settings</h2>
				<p>Modal content</p>
			</Dialog>
		</>
	);
}
```

---

## Hooks

### `useAnchorPosition`

CSS anchor positioning hook. Positions a popover relative to an anchor element. Includes a
JavaScript fallback for browsers without CSS Anchor Positioning support (~6% of users).

### `useArrowNavigation`

Arrow key navigation for composite widgets (menus, listboxes). Consumers wire this into their
components — top-layer does not bake in menu keyboard behavior (see
[decisions/menu-keyboard.md](../decisions/menu-keyboard.md)).

### `useSimpleLightDismiss`

Light dismiss handler for manual popovers that need click-outside and Escape key behavior.

---

## Utilities

### Animation presets

`@atlaskit/top-layer/animations` exports animation presets (`slideAndFade()`, `fade()`,
`dialogFade()`) that configure CSS entry/exit transitions. See [animations.md](./animations.md) for
how the animation system works.

### `createPopoverCloseEvent`

`@atlaskit/top-layer/create-close-event` exports a helper for bridging legacy `onClose` signatures
during migration.

### `PopupSurface`

`@atlaskit/top-layer/popup-surface` exports a styled surface component with standard DS styling
(background, border-radius, elevation).

### `placementMap`

`@atlaskit/top-layer/placement-map` exports placement conversion utilities for mapping legacy
Popper.js placement strings to top-layer placement objects.

### `DialogScrollLock`

`@atlaskit/top-layer/dialog-scroll-lock` exports a component that prevents background scrolling when
a modal dialog is open.

---

## When to use what

| Scenario                                               | Component                       | `isOpen`?              | Focus Management                |
| ------------------------------------------------------ | ------------------------------- | ---------------------- | ------------------------------- |
| Button opens dropdown/menu                             | `Popup`                         | No — browser manages   | All automatic (role-based)      |
| Hover/focus shows tooltip                              | `Popover` + `useAnchorPosition` | Yes — consumer manages | No focus changes (`tooltip`)    |
| Toast/flag notification                                | `Popover`                       | Yes — `mode="manual"`  | No focus changes                |
| Modal dialog                                           | `Dialog`                        | Yes — on `Dialog`      | Native `<dialog>` focus trap    |
| Custom trigger (timer, external)                       | `Popover` + `useAnchorPosition` | Yes — consumer manages | Automatic (browser Popover API) |
| Button opens anchored content with no custom lifecycle | `Popup`                         | No — browser manages   | All automatic (role-based)      |

---

## Architecture

```
Popover               = top layer + isOpen + animate + mode + ARIA
useAnchorPosition     = CSS anchor positioning (separate hook)
Popup.Content         = Popover + useAnchorPosition + context glue
Popup                 = compound (Trigger + Content)
Dialog                = <dialog> element + isOpen + animate + onExitFinish
```

### Entry points

| Entry Point                                    | Purpose                                          |
| ---------------------------------------------- | ------------------------------------------------ |
| `@atlaskit/top-layer/popup`                    | Compound component — trigger + content           |
| `@atlaskit/top-layer/popover`                  | Low-level primitive — visibility + animation     |
| `@atlaskit/top-layer/dialog`                   | Modal dialog — `<dialog>` with `showModal()`     |
| `@atlaskit/top-layer/animations`               | Animation presets (`slideAndFade`, `fade`, etc.) |
| `@atlaskit/top-layer/use-anchor-position`      | CSS anchor positioning hook                      |
| `@atlaskit/top-layer/use-arrow-navigation`     | Arrow key navigation hook for composite widgets  |
| `@atlaskit/top-layer/use-simple-light-dismiss` | Light dismiss for manual popovers                |
| `@atlaskit/top-layer/create-close-event`       | Legacy `onClose` bridge                          |
| `@atlaskit/top-layer/popup-surface`            | Styled popup surface component                   |
| `@atlaskit/top-layer/placement-map`            | Legacy placement string conversion               |
| `@atlaskit/top-layer/dialog-scroll-lock`       | Background scroll prevention for modals          |
| `@atlaskit/top-layer/focus`                    | Focus utilities (focus wrapping, initial focus)  |

### Focus management

Focus management is **role-based and automatic**. See [focus.md](./focus.md) for full details.

| Role                     | Initial Focus           | Focus Wrapping              | Focus Restoration           |
| ------------------------ | ----------------------- | --------------------------- | --------------------------- |
| `dialog` / `alertdialog` | First focusable element | Tab wraps within content    | ✅ Auto-restores to trigger |
| `menu`                   | First menu item         | No Tab wrapping (Tab exits) | ✅ Auto-restores to trigger |
| `listbox`                | First/selected option   | Tab wraps within content    | ✅ Auto-restores to trigger |
| `tooltip`                | No focus change         | No wrapping                 | ❌ No restoration           |
