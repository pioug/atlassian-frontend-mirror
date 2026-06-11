/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover, type TPlacementOptions } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

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
});

function placementLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

function PopupAtEdge({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchorPosition({ anchorRef: triggerRef, popoverRef, placement, isOpen });

	return (
		<Fragment>
			<button ref={triggerRef} type="button">
				{label}
			</button>
			<Popover
				ref={popoverRef}
				role="dialog"
				label={`Fallback ${label}`}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<Box padding="space.200">
						<Text>Flipped popover</Text>
					</Box>
				</PopoverSurface>
			</Popover>
		</Fragment>
	);
}

// ── Single-axis flips ──

/**
 * block-end near bottom → flips above
 */
export function VrFlipBlockEnd(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockEnd]}>
				<PopupAtEdge placement={{ edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * block-start near top → flips below
 */
export function VrFlipBlockStart(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockStart]}>
				<PopupAtEdge placement={{ edge: 'start' }} />
			</div>
		</div>
	);
}

/**
 * inline-end near right → flips left
 */
export function VrFlipInlineEnd(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineEnd]}>
				<PopupAtEdge placement={{ axis: 'inline', edge: 'end' }} />
			</div>
		</div>
	);
}

/**
 * inline-start near left → flips right
 */
export function VrFlipInlineStart(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineStart]}>
				<PopupAtEdge placement={{ axis: 'inline', edge: 'start' }} />
			</div>
		</div>
	);
}

// ── Compound flips (corner positions) ──

/**
 * block-end align-start in bottom-right corner
 */
export function VrFlipBlockEndAlignStart(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBottomRight]}>
				<PopupAtEdge placement={{ axis: 'block', edge: 'end', align: 'start' }} />
			</div>
		</div>
	);
}

/**
 * block-end align-end in bottom-left corner
 */
export function VrFlipBlockEndAlignEnd(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBottomLeft]}>
				<PopupAtEdge placement={{ axis: 'block', edge: 'end', align: 'end' }} />
			</div>
		</div>
	);
}

/**
 * block-start align-start in top-right corner
 */
export function VrFlipBlockStartAlignStart(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipTopRight]}>
				<PopupAtEdge placement={{ axis: 'block', edge: 'start', align: 'start' }} />
			</div>
		</div>
	);
}

/**
 * block-start align-end in top-left corner
 */
export function VrFlipBlockStartAlignEnd(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipTopLeft]}>
				<PopupAtEdge placement={{ axis: 'block', edge: 'start', align: 'end' }} />
			</div>
		</div>
	);
}

/**
 * inline-end align-start in bottom-right corner
 */
export function VrFlipInlineEndAlignStart(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBottomRight]}>
				<PopupAtEdge placement={{ axis: 'inline', edge: 'end', align: 'start' }} />
			</div>
		</div>
	);
}

/**
 * inline-end align-end in top-right corner
 */
export function VrFlipInlineEndAlignEnd(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipTopRight]}>
				<PopupAtEdge placement={{ axis: 'inline', edge: 'end', align: 'end' }} />
			</div>
		</div>
	);
}

// Legacy aliases for backward compatibility with existing VR snapshots
export const VrFlipBlock: typeof VrFlipBlockEnd = VrFlipBlockEnd;
export const VrFlipInline: typeof VrFlipInlineEnd = VrFlipInlineEnd;
export const VrFlipBoth: typeof VrFlipBlockEndAlignStart = VrFlipBlockEndAlignStart;

export default function VrPopupCssFallbacks(): ReactNode {
	return <VrFlipBlockEnd />;
}
