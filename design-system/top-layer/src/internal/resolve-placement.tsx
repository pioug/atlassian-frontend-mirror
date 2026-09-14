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
 * `offset.gap` and `offset.crossAxisShift.value` are always CSS
 * length strings.
 */
export type TPlacement = {
	axis: TPlacementAxis;
	edge: TPlacementEdge;
	align: TPlacementAlign;
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
 */
export function resolvePlacement({ placement }: { placement: TPlacementOptions }): TPlacement {
	const consumerGap = placement.offset?.gap;
	return {
		axis: placement.axis ?? 'block',
		edge: placement.edge ?? 'end',
		align: placement.align ?? 'center',
		offset: {
			gap: consumerGap === undefined ? DEFAULT_GAP : toCssLengthString({ value: consumerGap }),
			crossAxisShift: {
				value: toCssLengthString({
					value: placement.offset?.crossAxisShift?.value ?? 0,
				}),
				direction: placement.offset?.crossAxisShift?.direction ?? 'forwards',
			},
		},
	};
}
