/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for `offset.crossAxisShift`, covering the three cases the shift
 * used to get wrong. See `notes/decisions/placement-offset.md` for the
 * semantics: `forwards` moves the popover toward the cross-axis END and
 * `backwards` toward the START, for every `align` value.
 *
 * 1. **`align: 'center'`** is centered with `anchor-center`, which centers the
 *    popover's MARGIN box on the anchor. A single-sided shift margin therefore
 *    moved the popover only half the requested distance. The shift here is
 *    deliberately large so half versus full is obvious in a snapshot.
 * 2. **A cross-axis slide.** When `position-try-fallbacks` slides the popover
 *    onto the opposite cross-axis side, a single-sided margin lands on the
 *    un-anchored side, where margin has no effect, so the shift disappeared.
 * 3. **`align: 'end'` on the JS fallback**, which moved the popover the
 *    opposite direction to the CSS path.
 *
 * Plus one case that is NOT a bug, but is the exception to the rule above and so
 * is worth pinning:
 *
 * 4. **The diagonal flip.** `<try-tactic>` fallbacks swap the start and end
 *    margins rather than keeping them, so a flip across the cross axis mirrors
 *    the shift along with the placement. `forwards` therefore points toward the
 *    cross-axis START once the diagonal flip has fired.
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import type { TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

/**
 * Large enough that a half-strength shift is unmistakable in a snapshot.
 */
const LARGE_SHIFT = 40;

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
	// Trigger near the inline-end edge, so an `align: 'start'` popover has to
	// slide across the cross axis to stay on screen.
	nearInlineEnd: {
		insetInlineEnd: token('space.200'),
		insetBlockStart: '50%',
	},
	// Trigger near the inline-start edge, the mirror of the above for
	// `align: 'end'`.
	nearInlineStart: {
		insetInlineStart: token('space.200'),
		insetBlockStart: '50%',
	},
	// Trigger near the block-end edge, for an inline-axis placement whose cross
	// axis is the block axis.
	nearBlockEnd: {
		insetBlockEnd: token('space.200'),
		insetInlineStart: '50%',
	},
	// Trigger in the block-end + inline-end CORNER, which is what reaches the
	// diagonal flip. The two insets are deliberately different sizes:
	//
	// - `insetBlockEnd` is small, so there is no room below the trigger and every
	//   `block-end` fallback fails.
	// - `insetInlineEnd` is larger. It still leaves far too little room for the
	//   popover to expand toward the inline end, so the start-aligned fallbacks
	//   fail too, but it leaves enough slack that a shift pointing at the
	//   inline-end viewport edge stays on screen instead of being clipped.
	nearBlockEndInlineEnd: {
		insetInlineEnd: token('space.800'),
		insetBlockEnd: token('space.200'),
	},
	// Wide enough that the popover cannot fit between the trigger and the
	// viewport edge, which is what forces the cross-axis slide.
	wideContent: {
		width: '320px',
	},
	// Tall equivalent for block-axis cross slides.
	tallContent: {
		height: '260px',
	},
});

function shiftLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	const crossAxisShift = placement.offset?.crossAxisShift;
	const shift = crossAxisShift
		? `shift=${crossAxisShift.value} ${crossAxisShift.direction}`
		: 'no shift';
	return `${axis}-${edge} align=${align} ${shift}`;
}

/**
 * A centered fixture. Used for the `align: 'center'` strength cases, where no
 * fallback should fire and only the shift distance is under test.
 */
function VrCenteredShift({
	placement,
	shouldForceFallback = false,
}: {
	placement: TPlacementOptions;
	shouldForceFallback?: boolean;
}) {
	const label = shiftLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		forceFallbackPositioning: shouldForceFallback,
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
					label={`Popover ${label}`}
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

/**
 * An edge-anchored fixture whose content is too large for the requested
 * cross-axis span, so `position-try-fallbacks` slides it onto the opposite
 * cross-axis side. The shift must survive that slide.
 */
function VrSlidingShift({
	placement,
	position,
	size,
}: {
	placement: TPlacementOptions;
	position: 'nearInlineEnd' | 'nearInlineStart' | 'nearBlockEnd';
	size: 'wideContent' | 'tallContent';
}) {
	const label = shiftLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		isOpen,
	});

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles[position]]}>
				<button ref={triggerRef} type="button">
					{label}
				</button>
			</div>
			<Popover
				ref={popoverRef}
				role="dialog"
				label={`Popover ${label}`}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<Box padding="space.200" xcss={styles[size]}>
						<Text>{label}</Text>
					</Box>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

/**
 * A CORNER-anchored fixture. The popover fits neither below the trigger nor in
 * the inline-end span above it, so `position-try-fallbacks` runs past the slides
 * and the same-axis flip and reaches the DIAGONAL flip
 * (`flip-block flip-inline`), escaping into the opposite corner.
 *
 * The trigger label is short on purpose. A wide trigger would widen the
 * inline-end span it anchors, which is the space the popover has to NOT fit into.
 */
function VrDiagonalFlipShift({ placement }: { placement: TPlacementOptions }) {
	const label = shiftLabel(placement);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		isOpen,
	});

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles.nearBlockEndInlineEnd]}>
				<button ref={triggerRef} type="button">
					trigger
				</button>
			</div>
			<Popover
				ref={popoverRef}
				role="dialog"
				label={`Popover ${label}`}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<Box padding="space.200" xcss={styles.wideContent}>
						<Text>{label}</Text>
					</Box>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

/**
 * `align: 'center'` plus a forwards shift on the block axis. The popover should
 * sit the FULL shift toward the inline end of the trigger's center.
 */
export function VrCenterShiftForwardsBlockAxis(): ReactNode {
	return (
		<VrCenteredShift
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'center',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * `align: 'center'` plus a backwards shift on the block axis.
 */
export function VrCenterShiftBackwardsBlockAxis(): ReactNode {
	return (
		<VrCenteredShift
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'center',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'backwards' } },
			}}
		/>
	);
}

/**
 * `align: 'center'` on the inline axis, where the cross axis is the block axis.
 * Confirms the fix is axis-agnostic.
 */
export function VrCenterShiftForwardsInlineAxis(): ReactNode {
	return (
		<VrCenteredShift
			placement={{
				axis: 'inline',
				edge: 'end',
				align: 'center',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * `align: 'center'` plus a forwards shift through the JS fallback, which should
 * land in the same place as the CSS path above.
 */
export function VrJsFallbackCenterShiftForwardsBlockAxis(): ReactNode {
	return (
		<VrCenteredShift
			shouldForceFallback
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'center',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * `align: 'end'` plus a forwards shift. `forwards` is toward the cross-axis
 * end for every align value, so this moves the same direction as
 * `align: 'start'` would.
 */
export function VrAlignEndShiftForwards(): ReactNode {
	return (
		<VrCenteredShift
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * The same placement through the JS fallback. This used to move the popover the
 * opposite direction to the CSS path above; the two should now agree.
 */
export function VrJsFallbackAlignEndShiftForwards(): ReactNode {
	return (
		<VrCenteredShift
			shouldForceFallback
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * `align: 'end'` plus a backwards shift through the JS fallback.
 */
export function VrJsFallbackAlignEndShiftBackwards(): ReactNode {
	return (
		<VrCenteredShift
			shouldForceFallback
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'backwards' } },
			}}
		/>
	);
}

/**
 * `align: 'start'` against the inline-end viewport edge. The popover slides to
 * the opposite cross-axis side, and the shift must still apply.
 *
 * The shift is `backwards` here on purpose. A slide only happens at a viewport
 * edge, so a shift pointing at that same edge pushes the popover back off
 * screen, where it is clipped and the baseline says nothing useful. Pointing the
 * shift away from the edge keeps the whole popover visible, so the snapshot
 * shows the shift distance rather than a clipped box. `VrSlideAlignEndShiftForwards`
 * is the mirror of this against the opposite edge.
 */
export function VrSlideAlignStartShiftBackwards(): ReactNode {
	return (
		<VrSlidingShift
			position="nearInlineEnd"
			size="wideContent"
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'start',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'backwards' } },
			}}
		/>
	);
}

/**
 * The mirror: `align: 'end'` against the inline-start viewport edge.
 */
export function VrSlideAlignEndShiftForwards(): ReactNode {
	return (
		<VrSlidingShift
			position="nearInlineStart"
			size="wideContent"
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'end',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * A cross-axis slide on the block axis, from an inline-axis placement anchored
 * near the block-end viewport edge. `backwards` for the same reason as
 * `VrSlideAlignStartShiftBackwards`.
 */
export function VrSlideInlineAxisShiftBackwards(): ReactNode {
	return (
		<VrSlidingShift
			position="nearBlockEnd"
			size="tallContent"
			placement={{
				axis: 'inline',
				edge: 'end',
				align: 'start',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'backwards' } },
			}}
		/>
	);
}

/**
 * `align: 'start'` in the block-end + inline-end corner, with a forwards shift.
 *
 * This reaches the diagonal flip, which is the ONE fallback where the shift does
 * not keep its physical direction. A `<try-tactic>` swaps the start and end
 * margins rather than keeping them, which is what carries the block-axis gap to
 * the correct side through the flip, and the same swap applies to the cross-axis
 * shift margins. So the mirrored placement gets a mirrored shift.
 *
 * **How to read the baseline.** The popover ends up above the trigger and
 * end-aligned to it, so its inline-END edge is the anchored one. With no shift
 * that edge would sit on the trigger's inline-end edge, so the gap between them
 * is the shift, and which side it falls on is the direction. `forwards` is
 * mirrored to point toward the inline START here.
 *
 * The baseline also shows WHICH fallback fired, which is worth checking if this
 * ever needs re-generating. `block-start span-inline-start` appears twice in the
 * chain: once here as the diagonal tactic, and again later as a plain
 * `<position-area>` entry. A named area keeps the base margins, so the block-axis
 * gap would still be on the popover's block-START side and the popover would
 * overlap the trigger. A clean gap above the trigger means the tactic fired.
 */
export function VrDiagonalFlipAlignStartShiftForwards(): ReactNode {
	return (
		<VrDiagonalFlipShift
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'start',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'forwards' } },
			}}
		/>
	);
}

/**
 * The same corner with a backwards shift, which mirrors to point toward the
 * inline END. Paired with the fixture above so the two baselines sit on opposite
 * sides of the trigger's inline-end edge, which pins the SIGN of the mirroring
 * rather than only its magnitude.
 */
export function VrDiagonalFlipAlignStartShiftBackwards(): ReactNode {
	return (
		<VrDiagonalFlipShift
			placement={{
				axis: 'block',
				edge: 'end',
				align: 'start',
				offset: { crossAxisShift: { value: LARGE_SHIFT, direction: 'backwards' } },
			}}
		/>
	);
}

export default VrCenterShiftForwardsBlockAxis;
