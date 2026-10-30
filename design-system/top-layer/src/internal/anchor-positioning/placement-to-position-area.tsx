import { type TPlacement } from '../resolve-placement';

/**
 * Converts a placement to CSS `position-area` syntax.
 *
 * The `align` field is the *visual* alignment:
 * - `align: 'start'` means "lined up with the anchor's start edge" (left in LTR for the block axis)
 * - `align: 'end'` means "lined up with the anchor's end edge"
 * - `align: 'center'` means centred (a single-axis `position-area`)
 *
 * CSS `position-area` uses `span-*` keywords, which give the *expansion direction*.
 * Visual start alignment needs `span-{cross-axis}-end` (expand toward end, so the
 * start edges line up). This function does that inversion.
 *
 * Takes the RESOLVED placement, which the hook passes to positioning, sizing and
 * margins alike, so nothing here can disagree with them.
 *
 * @example
 * // For a `block-end` placement, by `align`:
 * // 'center' → 'block-end'
 * // 'start'  → 'block-end span-inline-end'
 * // 'end'    → 'block-end span-inline-start'
 */
export function placementToPositionArea({ placement }: { placement: TPlacement }): string {
	const { axis, edge, align } = placement;
	const edgeArea = `${axis}-${edge}`;

	if (align === 'center') {
		return edgeArea;
	}

	const crossAxis = axis === 'block' ? 'inline' : 'block';
	// Invert align → CSS span direction: visual 'start' → span toward 'end'
	const spanDirection = align === 'start' ? 'end' : 'start';
	return `${edgeArea} span-${crossAxis}-${spanDirection}`;
}
