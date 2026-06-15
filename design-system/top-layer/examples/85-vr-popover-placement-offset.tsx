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
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '200px',
		paddingBlockStart: token('space.1000'),
		paddingInlineEnd: token('space.1000'),
		paddingBlockEnd: token('space.1000'),
		paddingInlineStart: token('space.1000'),
	},
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
	},
	// Trigger near bottom edge.
	flipBlockEnd: {
		insetBlockEnd: token('space.200'),
		insetInlineStart: '50%',
	},
	// Trigger near top edge.
	flipBlockStart: {
		insetBlockStart: token('space.200'),
		insetInlineStart: '50%',
	},
	// Trigger near right edge.
	flipInlineEnd: {
		insetInlineEnd: token('space.200'),
		insetBlockStart: '50%',
	},
	// Trigger near left edge.
	flipInlineStart: {
		insetInlineStart: token('space.200'),
		insetBlockStart: '50%',
	},
});

function offsetLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const crossAxisShift = placement.offset?.crossAxisShift;
	const gap = placement.offset?.gap;
	const parts: string[] = [`${axis}-${edge}`];
	if (gap !== undefined) {
		parts.push(`gap=${gap}`);
	}
	if (crossAxisShift) {
		parts.push(`crossAxisShift=${crossAxisShift.value} ${crossAxisShift.direction}`);
	}
	return parts.join(' ');
}

function VrPopover({ placement }: { placement: TPlacementOptions }) {
	const label = offsetLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchorPosition({ anchorRef: triggerRef, popoverRef, placement, isOpen });

	return (
		<div css={styles.center}>
			<Fragment>
				<button ref={triggerRef} type="button">
					{label}
				</button>
				<Popover
					ref={popoverRef}
					role="dialog"
					label={`Popover at ${label}`}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<PopoverSurface>
						<Box padding="space.200">
							<Text>{label}</Text>
						</Box>
					</PopoverSurface>
				</Popover>
			</Fragment>
		</div>
	);
}

// Renders a popover via the JS fallback path with the given placement.
function VrPopoverJsFallback({ placement }: { placement: TPlacementOptions }) {
	const label = offsetLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		forceFallbackPositioning: true,
		isOpen,
	});

	return (
		<div css={styles.center}>
			<Fragment>
				<button ref={triggerRef} type="button">
					{label}
				</button>
				<Popover
					ref={popoverRef}
					role="dialog"
					label={`JS fallback ${label}`}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<PopoverSurface>
						<Box padding="space.200">
							<Text>{label} (JS fallback)</Text>
						</Box>
					</PopoverSurface>
				</Popover>
			</Fragment>
		</div>
	);
}

// Renders a popover only; each Vr* export wraps it in a viewport-pinned
// container so Compiled CSS can statically analyze the edge style.
function PopupAtEdge({ placement }: { placement: TPlacementOptions }) {
	const label = offsetLabel(placement);
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
				label={`Edge ${label}`}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<Box padding="space.200">
						<Text>{label}</Text>
					</Box>
				</PopoverSurface>
			</Popover>
		</Fragment>
	);
}

// Block-axis shift forwards (cross axis is inline; forwards = inline-end)
export function VrBlockEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

// Block-axis shift backwards (forwards = inline-start)
export function VrBlockEndShiftBackwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

export function VrBlockStartShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'start',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrBlockStartShiftBackwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'start',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

// Inline-axis shift forwards (cross axis is block; forwards = block-end)
export function VrInlineEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrInlineEndShiftBackwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

export function VrInlineStartShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'start',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrInlineStartShiftBackwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'start',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

// Shift combined with non-default align
export function VrBlockEndAlignStartShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'start',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrBlockEndAlignEndShiftBackwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

// Align: 'end' + shift forwards. Locks in the per-align margin SIDE fix:
// without it, the END-anchored popover does not shift.
export function VrBlockEndAlignEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrBlockStartAlignEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'start',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrInlineEndAlignEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrInlineStartAlignEndShiftForwards(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'inline',
				edge: 'start',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

// Custom gap (overrides default 8 from a placement-level path)
export function VrBlockEndGapLarge(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { gap: 24 },
			}}
		/>
	);
}

// Combined gap and shift
export function VrBlockEndGapAndShift(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: {
					gap: 16,
					crossAxisShift: { value: 12, direction: 'forwards' },
				},
			}}
		/>
	);
}

// Token string for gap (verifies the probe + cache resolves design tokens)
export function VrBlockEndGapToken(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { gap: token('space.200') },
			}}
		/>
	);
}

// Token string for shift.value
export function VrBlockEndShiftToken(): ReactNode {
	return (
		<VrPopover
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { crossAxisShift: { value: token('space.150'), direction: 'forwards' } },
			}}
		/>
	);
}

// Section A: JS fallback path with non-default offset.
// Confirms the JS fallback resolves and applies both `gap` and `shift`.

export function VrJsFallbackBlockEndGap(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { gap: 16 },
			}}
		/>
	);
}

export function VrJsFallbackBlockEndShift(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

export function VrJsFallbackInlineEndGap(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'inline',
				edge: 'end',
				offset: { gap: 16 },
			}}
		/>
	);
}

export function VrJsFallbackInlineEndShift(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'inline',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

// JS fallback: shift backwards. Locks in the signed-pixel resolution path
// (consumer values can be negative once the direction is applied).
export function VrJsFallbackBlockEndShiftBackwards(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
			}}
		/>
	);
}

// JS fallback: align: 'end' + shift forwards. Locks in the per-align sign
// flip in `applyShift` - without it, the END-anchored popover does not shift.
export function VrJsFallbackBlockEndAlignEndShiftForwards(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

// JS fallback: combined custom gap and shift in one placement.
export function VrJsFallbackBlockEndGapAndShift(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { gap: 24, crossAxisShift: { value: 12, direction: 'forwards' } },
			}}
		/>
	);
}

// JS fallback: token string for gap. Verifies the DOM-probe resolves design
// tokens to pixels in the JS path (not just the CSS path).
export function VrJsFallbackBlockEndGapToken(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: { gap: token('space.300', '24px') },
			}}
		/>
	);
}

// JS fallback: token string for shift.value. Verifies signed token resolution.
export function VrJsFallbackBlockEndShiftToken(): ReactNode {
	return (
		<VrPopoverJsFallback
			placement={{
				axis: 'block',
				edge: 'end',
				offset: {
					crossAxisShift: { value: token('space.150', '12px'), direction: 'forwards' },
				},
			}}
		/>
	);
}

// Section B: CSS edge flip with non-default offset.
// Trigger pinned to each viewport edge so CSS Anchor Positioning must flip.
// The cross-axis margin should remain correct through the flip.

export function VrFlipBlockEndShift(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockEnd]}>
				<PopupAtEdge
					placement={{
						axis: 'block',
						edge: 'end',
						offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipBlockStartGapAndShift(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockStart]}>
				<PopupAtEdge
					placement={{
						axis: 'block',
						edge: 'start',
						offset: {
							gap: 16,
							crossAxisShift: { value: 12, direction: 'forwards' },
						},
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipInlineEndShift(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineEnd]}>
				<PopupAtEdge
					placement={{
						axis: 'inline',
						edge: 'end',
						offset: { crossAxisShift: { value: 12, direction: 'forwards' } },
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipInlineStartGapAndShift(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineStart]}>
				<PopupAtEdge
					placement={{
						axis: 'inline',
						edge: 'start',
						offset: {
							gap: 16,
							crossAxisShift: { value: 12, direction: 'forwards' },
						},
					}}
				/>
			</div>
		</div>
	);
}

// Section B (continued): backwards-shift through a flip. Verifies the
// signed-margin fix still applies after a CSS edge flip.
export function VrFlipBlockEndShiftBackwards(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockEnd]}>
				<PopupAtEdge
					placement={{
						axis: 'block',
						edge: 'end',
						offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipBlockStartShiftBackwards(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipBlockStart]}>
				<PopupAtEdge
					placement={{
						axis: 'block',
						edge: 'start',
						offset: {
							gap: 16,
							crossAxisShift: { value: 12, direction: 'backwards' },
						},
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipInlineEndShiftBackwards(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineEnd]}>
				<PopupAtEdge
					placement={{
						axis: 'inline',
						edge: 'end',
						offset: { crossAxisShift: { value: 12, direction: 'backwards' } },
					}}
				/>
			</div>
		</div>
	);
}

export function VrFlipInlineStartShiftBackwards(): ReactNode {
	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.flipInlineStart]}>
				<PopupAtEdge
					placement={{
						axis: 'inline',
						edge: 'start',
						offset: {
							gap: 16,
							crossAxisShift: { value: 12, direction: 'backwards' },
						},
					}}
				/>
			</div>
		</div>
	);
}

export default function VrPopoverPlacementOffset(): ReactNode {
	return <VrBlockEndShiftForwards />;
}
