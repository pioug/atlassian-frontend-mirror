# @atlaskit/top-layer

Low-level top-layer primitives using the native
[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (`popover="auto"`) and
[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element.

## Popover

The primary primitive: a `<div>` with the `popover` attribute, plus a small lifecycle (animations,
role-based focus management, light-dismiss, nested-focus restoration). It does **not** know about
placement or size — compose it with the `useAnchoredPopover` hook when you need anchor-positioned
content.

```tsx
import { useRef } from 'react';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

function MyPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
				shouldAnimate
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
  on its own without `useAnchoredPopover`, or pass `isEnabled: false` to turn positioning off.
- `useAnchoredPopover` also owns anchor-relative sizing via `inlineSize` / `blockSize`
  (`'content' | 'match-anchor' | 'min-anchor' | 'max-available'`, both defaulting to `'content'`). A
  viewport cap is written on both axes whatever you pass, and only a placement-axis minimum can beat
  it. A `'content'` inline axis is the content's natural width, so a popover too wide for the space
  beside its anchor slides to a roomier side rather than wrapping; `shouldPreserveInlineSize` opts
  an element you own and have styled out of that write. See the hook's JSDoc and
  [`notes/decisions/fit-available-space.md`](notes/decisions/fit-available-space.md).

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

Both `Popover` and `Dialog` support CSS-based entry/exit animations via the `shouldAnimate` prop.
Animations use [`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
for entry and
[`allow-discrete`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) on
`display`/`overlay` for exit — no JavaScript animation coordination required.

### Popover animation

Pass `shouldAnimate` to enable the default popover entry and exit animation:

```tsx
import { Popover } from '@atlaskit/top-layer/popover';

<Popover shouldAnimate role="dialog" label="My popover" isOpen={isOpen}>
	Content
</Popover>;
```

For overlay styling (background, shadow, border-radius), wrap children in `PopoverSurface` from
`@atlaskit/top-layer/popover-surface`.

Use `enteringAnimationXcss` and `exitingAnimationXcss` when a composed component needs to override
the phase-specific animation styles.

### Dialog animation

Pass `shouldAnimate` to enable the default dialog entry and exit animation:

```tsx
import { Dialog } from '@atlaskit/top-layer/dialog';

<Dialog shouldAnimate isOpen={isOpen} onClose={onClose} label="My dialog">
	Content
</Dialog>;
```

Use `enteringAnimationXcss` and `exitingAnimationXcss` when a composed component needs to override
the phase-specific animation styles.

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

## Known limitations

- **Safari `<dialog>` flex-collapse.** On WebKit, a `max-height: 100%` flex column with a
  `flex: 1 1 auto; overflow: auto` child placed directly inside a `Dialog` collapses to `0px` (the
  block-axis `fit-content` user-agent default is an indefinite height). `Popover` sets
  `height: auto` to avoid this; `Dialog` deliberately does not, to keep the primitive free of layout
  opinions (see
  [`notes/decisions/safari-popover-flex-collapse.md`](notes/decisions/safari-popover-flex-collapse.md)).
  A consumer that builds this shape inside a `Dialog` should give the column a definite height or
  apply its own `height: auto` reset on the surface.
  - TODO: expand this into full public consumer documentation (the recommended workaround and a
    worked example) before the top-layer `Dialog` is broadly adopted.

## Documentation

See [`notes/`](notes/) for project documentation, architecture decisions, migration records, and
audit reports. The [`notes/README.md`](notes/README.md) provides a full index, including **current
migration status** and links to
[`notes/decisions/migration-roadmap.md`](notes/decisions/migration-roadmap.md).
