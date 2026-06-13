# @atlaskit/top-layer

Low-level top-layer primitives using the native
[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (`popover="auto"`) and
[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element.

## Popover

The primary primitive: a `<div>` with the `popover` attribute, plus a small lifecycle (animations,
role-based focus management, light-dismiss, nested-focus restoration). It does **not** know about
placement — compose it with the `useAnchorPosition` hook when you need anchor-positioned content.

```tsx
import { useRef } from 'react';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

function MyPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={() => popoverRef.current?.togglePopover()}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Settings"
				isOpen={isOpen}
				animate={slideAndFade()}
				onClose={onClose}
			>
				<PopoverSurface>Content here</PopoverSurface>
			</Popover>
		</>
	);
}
```

- Focus restoration is automatic. The browser handles it for outermost popovers; `Popover` snapshots
  `document.activeElement` on open and restores it on close for nested cases.
- For default overlay styling (background, shadow, border-radius), wrap content in `PopoverSurface`
  from `@atlaskit/top-layer/popover-surface`.
- For trigger-less or custom-positioned UI (flag, tooltip, react-select menu portal), use `Popover`
  on its own without `useAnchorPosition`.

## Dialog

Compound component for modal dialogs using the native `<dialog>` element with `.showModal()`.

```tsx
{
	isOpen && (
		<Dialog onClose={handleClose} width="medium">
			<Dialog.Content>
				<Dialog.Surface>
					<Dialog.Header>
						<Dialog.Title>Heading</Dialog.Title>
						<Dialog.CloseButton />
					</Dialog.Header>
					<Dialog.Body>Content</Dialog.Body>
					<Dialog.Footer>Actions</Dialog.Footer>
				</Dialog.Surface>
			</Dialog.Content>
		</Dialog>
	);
}
```

## Animations

Both `Popover` and `Dialog` support CSS-based entry/exit animations via the `animate` prop.
Animations use [`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
for entry and
[`allow-discrete`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) on
`display`/`overlay` for exit — no JavaScript animation coordination required.

Presets are available from `@atlaskit/top-layer/animations`:

```tsx
import {
	// Popover presets
	slideAndFade,
	fade,
	scaleAndFade,
	// Dialog presets
	dialogSlideUpAndFade,
	dialogFade,
} from '@atlaskit/top-layer/animations';
```

### Popover animation

Pass a preset to `Popover`:

```tsx
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { Popover } from '@atlaskit/top-layer/popover';

const animation = slideAndFade();

<Popover animate={animation} role="dialog" label="My popover">
	Content
</Popover>;
```

For overlay styling (background, shadow, border-radius), wrap children in `PopoverSurface` from
`@atlaskit/top-layer/popover-surface`.

Available popover presets:

- `slideAndFade({ distance? })` — directional slide + opacity (default for tooltip)
- `fade` — simple opacity transition
- `scaleAndFade` — scale from 0.95 + opacity (suitable for menus/dropdowns)

### Dialog animation

Pass a preset to `Dialog.Content`:

```tsx
import { dialogSlideUpAndFade } from '@atlaskit/top-layer/animations';

const animation = dialogSlideUpAndFade();

<Dialog.Content animate={animation}>
	<Dialog.Surface>...</Dialog.Surface>
</Dialog.Content>;
```

Available dialog presets:

- `dialogSlideUpAndFade({ distance? })` — slide up + opacity with backdrop fade (matches legacy
  modal entrance)
- `dialogFade` — simple opacity + backdrop fade

### Progressive enhancement

Browsers without `@starting-style` support will show/hide elements instantly — no broken state. The
`prefers-reduced-motion: reduce` media query sets all transition durations to `0s`.

## Accessibility

Browser tests in `__tests__/playwright/` verify the following WCAG 2.2 success criteria. See
[`notes/goals/accessibility-criteria.md`](notes/goals/accessibility-criteria.md) and
[`notes/decisions/accessibility-audit-report.md`](notes/decisions/accessibility-audit-report.md) for
details.

| A11y criterion                       | Browser test |
| ------------------------------------ | ------------ |
| 1.3.1 Info and Relationships         | ✓            |
| 1.3.2 Meaningful Sequence            | ✓            |
| 2.1.1 Keyboard                       | ✓            |
| 2.1.2 No Keyboard Trap               | ✓            |
| 2.4.3 Focus Order                    | ✓            |
| 2.4.7 Focus Visible                  | ✓            |
| 2.4.11 Focus Not Obscured            | ✓            |
| 3.2.1 On Focus                       | ✓            |
| 4.1.2 Name, Role, Value              | ✓            |
| 4.1.3 Status Messages                | ✓            |
| Background inertness (modal dialogs) | ✓            |
| Close reasons (Dialog)               | ✓            |

## Documentation

See [`notes/`](notes/) for project documentation, architecture decisions, migration records, and
audit reports. The [`notes/README.md`](notes/README.md) provides a full index, including **current
migration status** and links to
[`notes/decisions/migration-roadmap.md`](notes/decisions/migration-roadmap.md).
