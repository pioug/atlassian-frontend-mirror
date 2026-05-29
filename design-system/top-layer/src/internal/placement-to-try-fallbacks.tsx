import { type TPlacementOptions } from '../internal/resolve-placement';

import { getPlacement } from './resolve-placement';

/**
 * Returns `position-try-fallbacks` value based on placement.
 *
 * For centered placements, includes cross-axis aligned position-area
 * values so the browser can shift the popover along the cross-axis
 * when the centered position would overflow the viewport edge.
 *
 * Fallback order for centered placements (e.g. `block-end`):
 * 1. Same edge, start-aligned (shift for near-edge overflow)
 * 2. Same edge, end-aligned (shift for far-edge overflow)
 * 3. Flipped edge, centered
 * 4. Flipped edge, start-aligned
 * 5. Flipped edge, end-aligned
 *
 * For aligned placements (start/end), includes the same-edge centered
 * position as fallbacks so the browser can try centering when the aligned
 * position would overflow, before flipping to the opposite edge.
 *
 * **Why `flip-inline flip-block` (or `flip-block flip-inline`) is included:**
 *
 * When a popup is in a viewport corner (e.g. inline-end align-end at the
 * top-right), flipping only the primary axis (`flip-inline`) moves the popup
 * to the left but keeps the same cross-axis span direction (e.g. upward),
 * which is still off-screen. The combined keyword `flip-inline flip-block`
 * mirrors the popup diagonally. It flips BOTH the position-area AND both
 * inline and block margins simultaneously, placing the popup at the
 * diagonally opposite corner where there is always space.
 *
 * Named `position-area` entries (e.g. `inline-start span-block-end`) in
 * `position-try-fallbacks` do NOT update margins, so only the `flip-*`
 * tactic keywords correctly flip the gap margin along with the position.
 */
export function placementToTryFallbacks({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const flippedEdge = edge === 'start' ? 'end' : 'start';
	const sameEdge = `${axis}-${edge}`;
	const oppositeEdge = `${axis}-${flippedEdge}`;
	const flipKeyword = axis === 'block' ? 'flip-block' : 'flip-inline';
	const flipCrossKeyword = axis === 'block' ? 'flip-inline' : 'flip-block';

	// Single algorithm: produce the shift list against any base alignment.
	// For `align: 'start'` the "near" shift expands toward `end`; for
	// `align: 'end'` it expands toward `start`; for `align: 'center'`
	// either order is symmetric (we use end-then-start to match the
	// historical fallback list).
	function shifts(baseAlign: 'start' | 'center' | 'end', edgeKey: string): string[] {
		if (baseAlign === 'center') {
			return [`${edgeKey} span-${crossAxis}-end`, `${edgeKey} span-${crossAxis}-start`];
		}
		const near = baseAlign === 'start' ? 'end' : 'start';
		const far = baseAlign === 'start' ? 'start' : 'end';
		return [`${edgeKey} span-${crossAxis}-${near}`, edgeKey, `${edgeKey} span-${crossAxis}-${far}`];
	}

	if (align !== 'center') {
		// Aligned (start/end): try same-edge shifts, then single-axis flip,
		// then diagonal flip for corner overflow, then opposite-edge shifts.
		// Legacy Popper fallback ordering for e.g. bottom-start:
		// [bottom, bottom-end, top-start, top, top-end, auto].
		return [
			...shifts(align, sameEdge),
			flipKeyword,
			`${flipKeyword} ${flipCrossKeyword}`,
			...shifts(align, oppositeEdge),
		].join(', ');
	}

	// Centered: same-edge shifts, single-axis flip, opposite-edge shifts.
	// Diagonal flip is unnecessary because centered placements expand
	// equally in both cross-axis directions.
	return [...shifts('center', sameEdge), flipKeyword, ...shifts('center', oppositeEdge)].join(', ');
}
