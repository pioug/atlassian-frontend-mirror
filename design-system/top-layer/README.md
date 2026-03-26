# @atlaskit/top-layer

Low-level top-layer primitives using the native
[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (`popover="auto"`) and
[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element.

## Popup

Compound component for rendering content in the browser's top layer with CSS Anchor Positioning.
Placement is owned by this compound: root provides it via context, Content applies it (CSS Anchor
Positioning or JS fallback).

```tsx
<Popup placement="block-end" onClose={handleClose}>
	<Popup.Trigger>
		<button>Open</button>
	</Popup.Trigger>
	<Popup.Content role="dialog" label="My popup">
		Content here
	</Popup.Content>
</Popup>
```

For default overlay styling (background, shadow, border-radius), see `PopupSurface` in the package
examples (not currently a public API; we may expose it in a future release).

## Popover

Low-level primitive: a `<div>` with the `popover` attribute and show/hide lifecycle only. No
placement, no trigger wiring — use it when you need top-layer rendering with **fixed or custom
positioning** (e.g. Flag uses `Popover mode="manual"`). For anchor-positioned content next to a
trigger, use **Popup** instead.

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

Both Popup (and the low-level Popover) and Dialog support CSS-based entry/exit animations via the
`animate` prop. Animations use
[`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for entry and
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

### Popup animation

Pass a preset to `Popup.Content` (or to `Popover` when using the low-level primitive without
placement):

```tsx
import { slideAndFade } from '@atlaskit/top-layer/animations';

const animation = slideAndFade();

<Popup.Content animate={animation} role="dialog" label="My popup">
	Content
</Popup.Content>;
```

For overlay styling (background, shadow, border-radius), see the `PopupSurface` usage in the package
examples.

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
[`notes/audits/accessibility-audit-report.md`](notes/audits/accessibility-audit-report.md) for
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
audit reports. The [`notes/README.md`](notes/README.md) provides a full index.
