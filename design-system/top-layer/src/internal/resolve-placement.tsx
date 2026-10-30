import { token } from '@atlaskit/tokens';

import { toCssLengthString } from './resolve-css-length';

/**
 * The gap between the anchor and the popover when `placement.offset.gap` is not
 * set. A design token (`space.100`), so it follows the spacing scale.
 */
const DEFAULT_GAP = token('space.100', '8px');

/**
 * Which way along the cross axis a shift moves the popover. `'forwards'` is
 * always toward the cross-axis END and `'backwards'` toward the START, for
 * every `align` value. See `notes/decisions/placement-offset.md`.
 */
export type TCrossAxisShiftDirection = 'forwards' | 'backwards';

/**
 * A resolved cross-axis shift. `value` is a CSS length string: a number from the
 * consumer becomes `${n}px`.
 */
export type TCrossAxisShiftOffset = {
	value: string;
	direction: TCrossAxisShiftDirection;
};

/**
 * The logical axis along which the popover sits next to the anchor. In a
 * horizontal writing mode, `'block'` is above or below the anchor and `'inline'`
 * is beside it.
 */
export type TPlacementAxis = 'block' | 'inline';

/**
 * The side of the anchor, on the placement axis, that the popover sits on.
 */
export type TPlacementEdge = 'start' | 'end';

/**
 * How the popover lines up with the anchor on the cross axis. `'start'` lines up
 * the start edges, `'end'` lines up the end edges, and `'center'` centres the
 * popover on the anchor.
 */
export type TPlacementAlign = 'start' | 'center' | 'end';

/**
 * A fully resolved placement (internal). Use `resolvePlacement` to make one from
 * `TPlacementOptions`. `offset.gap`, `offset.crossAxisShift.value` and `minSize`
 * are always CSS length strings. `minSize` stays `undefined` when it is not set,
 * so "not set" and an explicit `0` stay different.
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
 * A partial placement. Every field is optional; `resolvePlacement` fills in the
 * defaults.
 */
export type TPlacementOptions = {
	axis?: TPlacementAxis;
	edge?: TPlacementEdge;
	align?: TPlacementAlign;
	/**
	 * The minimum size the popover keeps along the PLACEMENT axis. A number is
	 * pixels; a string is any CSS length.
	 *
	 * Once EITHER axis asks for `'max-available'`, the placement axis gets a floor
	 * whether this is set or not, because a cap with no floor stops the popover
	 * flipping to a roomier side. This value always beats that default floor, and
	 * composes with an anchor floor as `max(minSize, anchorSize)`. So `0` caps the
	 * popover without letting it move, but does not remove an anchor floor.
	 */
	minSize?: number | string;
	offset?: {
		/**
		 * The distance from the anchor along the placement axis. A number is pixels;
		 * a string is any CSS length (for example `token('space.100')`).
		 */
		gap?: number | string;
		/**
		 * A nudge along the anchor edge, on the cross axis (perpendicular to the
		 * placement axis). `value` takes a number (pixels) or any CSS length.
		 */
		crossAxisShift?: {
			value?: number | string;
			direction?: TCrossAxisShiftDirection;
		};
	};
};

/**
 * Resolves a partial placement to its full form. Number offsets become
 * `${n}px` strings.
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
		// No `??` default: `undefined` must survive, so "not set" stays different
		// from an explicit `0`.
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
