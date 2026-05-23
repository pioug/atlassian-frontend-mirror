/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

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

	// Auto-open the popup on mount so the VR snapshot captures the
	// positioned popover rather than just the closed trigger button.
	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<div css={styles.center}>
			<Popup placement={placement} onClose={() => {}}>
				<Popup.Trigger>
					<button ref={triggerRef} type="button">
						{label}
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label={`Popup at ${label}`}>
					<PopupSurface>
						<Box padding="space.200">
							<Text>{label}</Text>
						</Box>
					</PopupSurface>
				</Popup.Content>
			</Popup>
		</div>
	);
}

// Renders a popover via the JS fallback path with the given placement.
function VrPopoverJsFallback({ placement }: { placement: TPlacementOptions }) {
	const label = offsetLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		triggerRef.current?.click();
	}, []);

	return (
		<div css={styles.center}>
			<Popup placement={placement} onClose={() => {}} forceFallbackPositioning>
				<Popup.Trigger>
					<button ref={triggerRef} type="button">
						{label}
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label={`JS fallback ${label}`}>
					<PopupSurface>
						<Box padding="space.200">
							<Text>{label} (JS fallback)</Text>
						</Box>
					</PopupSurface>
				</Popup.Content>
			</Popup>
		</div>
	);
}

// Renders a popover only; each Vr* export wraps it in a viewport-pinned
// container so Compiled CSS can statically analyze the edge style.
function PopupAtEdge({ placement }: { placement: TPlacementOptions }) {
	const label = offsetLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);

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
			<Popup.Content role="dialog" label={`Edge ${label}`}>
				<PopupSurface>
					<Box padding="space.200">
						<Text>{label}</Text>
					</Box>
				</PopupSurface>
			</Popup.Content>
		</Popup>
	);
}

// Block-axis shift forwards (cross axis is inline; forwards = inline-end)
export function VrBlockEndShiftForwards(): JSX.Element {
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
export function VrBlockEndShiftBackwards(): JSX.Element {
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

export function VrBlockStartShiftForwards(): JSX.Element {
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

export function VrBlockStartShiftBackwards(): JSX.Element {
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
export function VrInlineEndShiftForwards(): JSX.Element {
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

export function VrInlineEndShiftBackwards(): JSX.Element {
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

export function VrInlineStartShiftForwards(): JSX.Element {
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

export function VrInlineStartShiftBackwards(): JSX.Element {
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
export function VrBlockEndAlignStartShiftForwards(): JSX.Element {
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

export function VrBlockEndAlignEndShiftBackwards(): JSX.Element {
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
export function VrBlockEndAlignEndShiftForwards(): JSX.Element {
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

export function VrBlockStartAlignEndShiftForwards(): JSX.Element {
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

export function VrInlineEndAlignEndShiftForwards(): JSX.Element {
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

export function VrInlineStartAlignEndShiftForwards(): JSX.Element {
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
export function VrBlockEndGapLarge(): JSX.Element {
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
export function VrBlockEndGapAndShift(): JSX.Element {
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
export function VrBlockEndGapToken(): JSX.Element {
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
export function VrBlockEndShiftToken(): JSX.Element {
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

export function VrJsFallbackBlockEndGap(): JSX.Element {
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

export function VrJsFallbackBlockEndShift(): JSX.Element {
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

export function VrJsFallbackInlineEndGap(): JSX.Element {
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

export function VrJsFallbackInlineEndShift(): JSX.Element {
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
export function VrJsFallbackBlockEndShiftBackwards(): JSX.Element {
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
// flip in `applyShift` — without it, the END-anchored popover does not shift.
export function VrJsFallbackBlockEndAlignEndShiftForwards(): JSX.Element {
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
export function VrJsFallbackBlockEndGapAndShift(): JSX.Element {
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
export function VrJsFallbackBlockEndGapToken(): JSX.Element {
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
export function VrJsFallbackBlockEndShiftToken(): JSX.Element {
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

export function VrFlipBlockEndShift(): JSX.Element {
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

export function VrFlipBlockStartGapAndShift(): JSX.Element {
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

export function VrFlipInlineEndShift(): JSX.Element {
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

export function VrFlipInlineStartGapAndShift(): JSX.Element {
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
export function VrFlipBlockEndShiftBackwards(): JSX.Element {
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

export function VrFlipBlockStartShiftBackwards(): JSX.Element {
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

export function VrFlipInlineEndShiftBackwards(): JSX.Element {
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

export function VrFlipInlineStartShiftBackwards(): JSX.Element {
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

export default function VrPopoverPlacementOffset(): JSX.Element {
	return <VrBlockEndShiftForwards />;
}
