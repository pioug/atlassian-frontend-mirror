/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	// A coloured ancestor region (for example a danger banner). Top-layer content
	// is still a DOM child of its trigger for CSS inheritance, so this red `color`
	// is what leaks in if the host resets `color` to `inherit`. The region also
	// overrides `--ds-text`, see `vividTextStyle`.
	region: {
		color: token('color.text.danger'),
		backgroundColor: token('color.background.danger'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '240px',
		paddingBlockStart: token('space.1000'),
		paddingInlineEnd: token('space.1000'),
		paddingBlockEnd: token('space.1000'),
		paddingInlineStart: token('space.1000'),
	},
	// Deliberately sets no `color`, so the rendered text colour comes only from
	// the host surface reset. The background is only for legibility.
	content: {
		maxWidth: '260px',
		backgroundColor: token('elevation.surface.overlay'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

/**
 * Gemini VR compares pixels with Playwright's default threshold (0.2), which
 * cannot tell UA `CanvasText` (#000) from `color.text` (#292A2E). Overriding
 * `--ds-text` with a vivid blue makes the expected text colour differ from both
 * black and red by far more than the threshold. The host's
 * `color: var(--ds-text)` resolves at the host, which inherits the property.
 */
const vividTextStyle = { '--ds-text': '#0055FF' } as CSSProperties;

/**
 * An open `Popover` whose child is raw text with no colour of its own.
 *
 * `mode="manual"` keeps the popover open when the default export also opens the
 * modal `Dialog`, because `showModal()` hides open `auto` popovers.
 */
function PopoverInRedRegion(): ReactNode {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- overrides a token variable for the VR, see `vividTextStyle`
		<div css={styles.region} style={vividTextStyle}>
			<button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
				Popover trigger inside a red region
			</button>
			<Popover
				ref={popoverRef}
				mode="manual"
				role="dialog"
				label="Popover surface reset colour"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<div css={styles.content}>Popover text is the default text colour.</div>
			</Popover>
		</div>
	);
}

/**
 * An open `Dialog` whose child is raw text with no colour of its own. `Dialog`
 * always opens with `showModal()`, so the backdrop is hidden to keep the
 * snapshot simple.
 */
function DialogInRedRegion(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- overrides a token variable for the VR, see `vividTextStyle`
		<div css={styles.region} style={vividTextStyle}>
			<button type="button" onClick={() => setIsOpen(true)}>
				Dialog trigger inside a red region
			</button>
			<Dialog
				label="Dialog surface reset colour"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				shouldHideBackdrop
			>
				<div css={styles.content}>Dialog text is the default text colour.</div>
			</Dialog>
		</div>
	);
}

/**
 * Baseline for the `color` surface reset on the `Popover` host.
 *
 * Expected: the popover text renders in `color.text`, which this example sets
 * to vivid blue (#0055FF).
 *
 * - Red text means the trigger region colour leaked into the popover.
 * - Black text means the UA `[popover]` `color: CanvasText` came back.
 */
export function VrSurfaceResetColorPopover(): ReactNode {
	return <PopoverInRedRegion />;
}

/**
 * Baseline for the `color` surface reset on the `Dialog` host.
 *
 * Expected: the dialog text renders in `color.text`, which this example sets
 * to vivid blue (#0055FF).
 *
 * - Red text means the trigger region colour leaked into the dialog.
 * - Black text means the UA `dialog` `color: CanvasText` came back.
 */
export function VrSurfaceResetColorDialog(): ReactNode {
	return <DialogInRedRegion />;
}

export default function VrSurfaceResetColorExample(): ReactNode {
	return (
		<div css={styles.page}>
			<PopoverInRedRegion />
			<DialogInRedRegion />
		</div>
	);
}
