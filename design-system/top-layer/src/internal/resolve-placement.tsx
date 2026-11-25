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
 * Matching edges or centers that align the popover over its anchor without flipping.
 */
type TOverlapEdge = 'overlap-start' | 'overlap-center' | 'overlap-end';

/**
 * How the popover lines up with the anchor on the cross axis. `'start'` lines up
 * the start edges, `'end'` lines up the end edges, and `'center'` centres the
 * popover on the anchor.
 */
export type TPlacementAlign = 'start' | 'center' | 'end';

/**
 * A fully resolved placement (internal). Use `resolvePlacement` to make one from
 * `TPlacementOptions`. `offset.gap` and `offset.crossAxisShift.value` are always
 * CSS length strings.
 */
export type TPlacement<TEdge extends TPlacementEdge | TOverlapEdge = TPlacementEdge> = {
	axis: TPlacementAxis;
	edge: TEdge;
	align: TPlacementAlign;
	offset: {
		gap: string;
		crossAxisShift: TCrossAxisShiftOffset;
	};
};

/**
 * A partial adjacent placement. Every field is optional; `resolvePlacement`
 * fills in the defaults.
 */
export type TPlacementOptions = {
	axis?: TPlacementAxis;
	edge?: TPlacementEdge;
	align?: TPlacementAlign;
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
 * Placement options for surfaces that can sit beside or overlap their anchor.
 */
export type TAnchoredPlacementOptions = Omit<TPlacementOptions, 'edge'> & {
	/**
	 * `start` and `end` place the surface beside the anchor. The overlap edges
	 * align matching edges or centers without flipping. They require the
	 * document and popover to share a writing-mode orientation, and their gap
	 * defaults to zero. A positive gap moves toward the logical end in CSS overlap.
	 * Without native support, overlap falls back to an adjacent edge.
	 */
	edge?: TPlacementEdge | TOverlapEdge;
};

/**
 * A resolved placement that overlaps its anchor.
 */
export type TOverlapPlacement = TPlacement<TOverlapEdge>;

/**
 * A resolved adjacent or overlap placement with offsets in CSS length form.
 */
export type TResolvedPlacement = TPlacement | TOverlapPlacement;

/**
 * Resolves an adjacent placement, including when the edge is omitted.
 */
export function resolvePlacement(options: { placement: TPlacementOptions }): TPlacement;
/**
 * Resolves placement options that may specify either kind of edge.
 */
export function resolvePlacement(options: {
	placement: TAnchoredPlacementOptions;
}): TResolvedPlacement;
/**
 * Defaults to the block axis, end edge, center alignment, and a zero forward
 * cross-axis shift. The gap defaults to `space.100` (8px) for adjacent
 * placements and zero for overlap. Numeric offsets become CSS pixel lengths.
 */
export function resolvePlacement({
	placement,
}: {
	placement: TAnchoredPlacementOptions;
}): TResolvedPlacement {
	const edge = placement.edge ?? 'end';
	const defaultGap = edge === 'start' || edge === 'end' ? DEFAULT_GAP : 0;
	return {
		axis: placement.axis ?? 'block',
		edge,
		align: placement.align ?? 'center',
		offset: {
			gap: toCssLengthString({ value: placement.offset?.gap ?? defaultGap }),
			crossAxisShift: {
				value: toCssLengthString({
					value: placement.offset?.crossAxisShift?.value ?? 0,
				}),
				direction: placement.offset?.crossAxisShift?.direction ?? 'forwards',
			},
		},
	};
}
