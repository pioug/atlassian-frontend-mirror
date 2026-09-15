import { type TPlacement } from '../resolve-placement';

/**
 * Resolves a placement to CSS `position-area` syntax.
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
 * Takes the RESOLVED placement, which the hook threads through positioning,
 * sizing and margins alike, so nothing here can disagree with them.
 *
 * @example
 * // For a `block-end` placement, by `align`:
 * // 'center' → 'block-end'
 * // 'start'  → 'block-end span-inline-end'
 * // 'end'    → 'block-end span-inline-start'
 */
export function placementToPositionArea({ placement }: { placement: TPlacement }): string {
	const { axis, edge, align } = placement;
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
