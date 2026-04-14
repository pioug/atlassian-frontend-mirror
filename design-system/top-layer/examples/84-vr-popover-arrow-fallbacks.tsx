/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { arrow } from '@atlaskit/top-layer/arrow';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
	},
	// Trigger near bottom edge — block-end should flip to block-start
	flipBlockEnd: {
		insetBlockEnd: token('space.200'),
		insetInlineStart: '50%',
	},
	// Trigger near top edge — block-start should flip to block-end
	flipBlockStart: {
		insetBlockStart: token('space.200'),
		insetInlineStart: '50%',
	},
	// Trigger near right edge — inline-end should flip to inline-start
	flipInlineEnd: {
		insetInlineEnd: token('space.200'),
		insetBlockStart: '50%',
	},
	// Trigger near left edge — inline-start should flip to inline-end
	flipInlineStart: {
		insetInlineStart: token('space.200'),
		insetBlockStart: '50%',
	},
	// Corner positions for compound flips
	flipBottomRight: {
		insetBlockEnd: token('space.200'),
		insetInlineEnd: token('space.200'),
	},
	flipBottomLeft: {
		insetBlockEnd: token('space.200'),
		insetInlineStart: token('space.200'),
	},
	flipTopRight: {
		insetBlockStart: token('space.200'),
		insetInlineEnd: token('space.200'),
	},
	flipTopLeft: {
		insetBlockStart: token('space.200'),
		insetInlineStart: token('space.200'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
	},
});

function placementLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

const popoverArrow = arrow();

function ArrowPopupAtEdge({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Auto-open the popup on mount so the VR snapshot captures the
	// flipped popover with arrow rather than just the closed trigger.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<Popup placement={placement} onClose={() => {}}>
			<Popup.Trigger>
				<button ref={triggerRef} type="button">
					{label}
				</button>
			</Popup.Trigger>
			<Popup.Content
				role="dialog"
				label={`Arrow fallback ${label}`}
				arrow={popoverArrow}
				xcss={styles.surface}
			>
				<Box padding="space.200">
					<Text size="small" weight="medium" color="color.text.inverse">
						Flipped: {label}
					</Text>
				</Box>
			</Popup.Content>
		</Popup>
	);
}

// ── Single-axis flips ──

/**
 * block-end near bottom → flips above
 */
export function VrArrowFlipBlockEnd(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockEnd]}>
				<ArrowPopupAtEdge placement={{ edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * block-start near top → flips below
 */
export function VrArrowFlipBlockStart(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockStart]}>
				<ArrowPopupAtEdge placement={{ edge: 'start' }} />
			</div>
		</div>
	);
}

/**
 * inline-end near right → flips left
 */
export function VrArrowFlipInlineEnd(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineEnd]}>
				<ArrowPopupAtEdge placement={{ axis: 'inline', edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * inline-start near left → flips right
 */
export function VrArrowFlipInlineStart(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineStart]}>
				<ArrowPopupAtEdge placement={{ axis: 'inline', edge: 'start' }} />
			</div>
		</div>
	);
}

// ── Compound flips (corner positions) ──

/**
 * block-end align-start in bottom-right corner
 */
export function VrArrowFlipBlockEndAlignStart(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBottomRight]}>
				<ArrowPopupAtEdge placement={{ axis: 'block', edge: 'end', align: 'start' }} />
			</div>
		</div>
	);
}

/**
 * block-end align-end in bottom-left corner
 */
export function VrArrowFlipBlockEndAlignEnd(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBottomLeft]}>
				<ArrowPopupAtEdge placement={{ axis: 'block', edge: 'end', align: 'end' }} />
			</div>
		</div>
	);
}

/**
 * block-start align-start in top-right corner
 */
export function VrArrowFlipBlockStartAlignStart(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipTopRight]}>
				<ArrowPopupAtEdge placement={{ axis: 'block', edge: 'start', align: 'start' }} />
			</div>
		</div>
	);
}

/**
 * block-start align-end in top-left corner
 */
export function VrArrowFlipBlockStartAlignEnd(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipTopLeft]}>
				<ArrowPopupAtEdge placement={{ axis: 'block', edge: 'start', align: 'end' }} />
			</div>
		</div>
	);
}

// Legacy aliases for backward compatibility
export const VrArrowFlipBlock: typeof VrArrowFlipBlockEnd = VrArrowFlipBlockEnd;
export const VrArrowFlipInline: typeof VrArrowFlipInlineEnd = VrArrowFlipInlineEnd;
export const VrArrowFlipBoth: typeof VrArrowFlipBlockEndAlignStart = VrArrowFlipBlockEndAlignStart;

export default function VrPopoverArrowFallbacks(): JSX.Element {
	return <VrArrowFlipBlockEnd />;
}
