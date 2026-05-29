import { type TPlacementOptions } from '../internal/resolve-placement';

import { getPlacement } from './resolve-placement';

/**
 * Resolves placement options to CSS `position-area` syntax.
 *
 * The `align` field represents the *visual* alignment:
 * - `align: 'start'` means "aligned to the trigger's start edge" (left in LTR for block axis)
 * - `align: 'end'` means "aligned to the trigger's end edge"
 * - `align: 'center'` means centered (single-axis position-area)
 *
 * CSS `position-area` uses `span-*` keywords which indicate the *expansion direction*.
 * Visual start-alignment requires `span-{cross-axis}-end` (expand toward end = start-aligned).
 * This function handles the inversion internally.
 *
 * @example
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'center' } }) // → 'block-end'
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'start' } }) // → 'block-end span-inline-end'
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'end' } })   // → 'block-end span-inline-start'
 */
export function placementToPositionArea({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });
	const edgeValue = `${axis}-${edge}`;

	if (align === 'center') {
		return edgeValue;
	}

	// Cross-axis name: block ↔ inline
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	// Invert align → CSS span direction: visual 'start' → span toward 'end'
	const spanDir = align === 'start' ? 'end' : 'start';
	return `${edgeValue} span-${crossAxis}-${spanDir}`;
}
