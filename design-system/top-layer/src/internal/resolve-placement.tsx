import { token } from '@atlaskit/tokens';

import { toCssLengthString } from './resolve-css-length';

/**
 * Default gap between trigger and popover. Resolves to a design
 * token (`space.100`) so the value follows the design system's spacing
 * scale. Used when `placement.offset.gap` is not provided.
 */
const DEFAULT_GAP = token('space.100', '8px');

/**
 * Which way along the cross axis a shift moves the popover. `'forwards'` is
 * always toward the cross-axis END and `'backwards'` toward the START, for
 * every `align` value. See `notes/decisions/placement-offset.md`.
 */
export type TCrossAxisShiftDirection = 'forwards' | 'backwards';

/**
 * Cross-axis shift. `value` is a CSS length string (consumer numbers are
 * normalized to `${n}px`).
 */
export type TCrossAxisShiftOffset = {
	value: string;
	direction: TCrossAxisShiftDirection;
};

export type TPlacementAxis = 'block' | 'inline';
export type TPlacementEdge = 'start' | 'end';
export type TPlacementAlign = 'start' | 'center' | 'end';

/**
 * Fully-resolved placement (internal). Use `resolvePlacement` for partial input.
 * `offset.gap`, `offset.crossAxisShift.value` and `minSize` are always CSS length
 * strings. `minSize` stays `undefined` when unset, so "not specified" and an
 * explicit `0` remain distinguishable.
 */
export type TPlacement = {
	axis: TPlacementAxis;
	edge: TPlacementEdge;
	align: TPlacementAlign;
	minSize?: string;
	offset: {
		gap: string;
		crossAxisShift: TCrossAxisShiftOffset;
	};
};

/**
 * Partial placement options. `offset.gap` and
 * `offset.crossAxisShift.value` accept either a number (pixels) or a
 * CSS length string (e.g. `token('space.100')`).
 *
 * The two offset axes are named for clarity at the call site:
 *   - `gap`     - distance away from the trigger along the placement axis
 *   - `crossAxisShift`  - nudge along the trigger edge (perpendicular to the placement axis)
 */
export type TPlacementOptions = {
	axis?: TPlacementAxis;
	edge?: TPlacementEdge;
	align?: TPlacementAlign;
	/**
	 * The minimum size the popover keeps along the PLACEMENT axis. A number is
	 * pixels; a string is any CSS length.
	 *
	 * Once EITHER axis asks for `'max-available'` the placement axis is floored
	 * whether this is set or not, because a cap with no floor stops the popover
	 * flipping to a roomier side. This always beats that default floor, and
	 * composes with an anchor floor as `max(minSize, anchorSize)` - so `0` caps the
	 * popover without letting it move, but does not remove an anchor floor.
	 */
	minSize?: number | string;
	offset?: {
		gap?: number | string;
		crossAxisShift?: {
			value?: number | string;
			direction?: TCrossAxisShiftDirection;
		};
	};
};

/**
 * Resolves a partial placement to its fully-specified form. Number offsets
 * are normalized to `${n}px` strings.
 *
 * Defaults: `axis: 'block'`, `edge: 'end'`, `align: 'center'`,
 * `offset.gap: token('space.100', '8px')`,
 * `offset.crossAxisShift: { value: '0px', direction: 'forwards' }`.
 *
 * `minSize` has no default here: whether it needs one depends on how the popover
 * is sized, which only `useAnchoredPopover` knows.
 */
export function resolvePlacement({ placement }: { placement: TPlacementOptions }): TPlacement {
	return {
		axis: placement.axis ?? 'block',
		edge: placement.edge ?? 'end',
		align: placement.align ?? 'center',
		// Not `??`: `undefined` must survive, so "not specified" stays
		// distinguishable from an explicit `0`.
		minSize:
			placement.minSize === undefined ? undefined : toCssLengthString({ value: placement.minSize }),
		offset: {
			gap: toCssLengthString({ value: placement.offset?.gap ?? DEFAULT_GAP }),
			crossAxisShift: {
				value: toCssLengthString({
					value: placement.offset?.crossAxisShift?.value ?? 0,
				}),
				direction: placement.offset?.crossAxisShift?.direction ?? 'forwards',
			},
		},
	};
}
