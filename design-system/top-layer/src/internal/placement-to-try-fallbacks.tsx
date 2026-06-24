import { getPlacement, type TPlacement, type TPlacementOptions } from './resolve-placement';

/**
 * A `position-area` primary edge — the placement axis joined to its edge, e.g.
 * `block-end` or `inline-start`. These are the four edges a popover can sit on.
 */
type TPositionAreaEdge = `${TPlacement['axis']}-${TPlacement['edge']}`;

function slideOnEdge({
	align,
	edgeKey,
	crossAxis,
}: {
	align: TPlacement['align'];
	edgeKey: TPositionAreaEdge;
	crossAxis: TPlacement['axis'];
}): string[] {
	if (align === 'center') {
		return [`${edgeKey} span-${crossAxis}-end`, `${edgeKey} span-${crossAxis}-start`];
	}
	// For `align: 'start'` the popover expands toward `end`, so the "near"
	// span is `end` and the "far" span is `start`; `align: 'end'` mirrors
	// this. The bare `edgeKey` (re-centered) sits between them.
	const near = align === 'start' ? 'end' : 'start';
	const far = align === 'start' ? 'start' : 'end';
	return [`${edgeKey} span-${crossAxis}-${near}`, edgeKey, `${edgeKey} span-${crossAxis}-${far}`];
}

function flipDiagonally({ axis }: { axis: 'block' | 'inline' }) {
	const flipOnMainAxis = axis === 'block' ? 'flip-block' : 'flip-inline';
	const flipToCrossAxis = axis === 'block' ? 'flip-inline' : 'flip-block';
	return `${flipOnMainAxis} ${flipToCrossAxis}`;
}

/**
 * Returns the `position-try-fallbacks` value for a placement.
 *
 * @example
 * // Centered on the block-end edge (the default placement):
 * placementToTryFallbacks({ placement: { axis: 'block', edge: 'end', align: 'center' } });
 * // => 'block-end span-inline-end, block-end span-inline-start, flip-block,
 * //     block-start span-inline-end, block-start span-inline-start'
 */
export function placementToTryFallbacks({ placement }: { placement: TPlacementOptions }): string {
	/**
	 * **Build the fallback list**
	 *
	 * Each entry is a complete alternative position.
	 * The browser tries them _in order_ and uses the _first_ one that fits.
	 */

	const resolved = getPlacement({ placement });
	const { axis, edge, align } = resolved;
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const flippedEdge = edge === 'start' ? 'end' : 'start';

	const sameEdgeArea: TPositionAreaEdge = `${axis}-${edge}`;
	const oppositeEdgeArea: TPositionAreaEdge = `${axis}-${flippedEdge}`;

	const flipOnMainAxis = axis === 'block' ? 'flip-block' : 'flip-inline';

	/**
	 * **Fallback algorithm**
	 *
	 * We have two things we can do to keep something visible:
	 *
	 * 1. _Slide_ along edges
	 * 2. _Flip_ to another edge
	 *
	 * _Centered popover_
	 *
	 * Desired: Sits in middle of main edge
	 *
	 * Fallbacks:
	 *  1: _Slide_ along main edge on the cross axis
	 *  2: _Flip_ on main axis to opposite edge (centered)
	 *  3: _Slide_ along opposite edge on the cross axis
	 *
	 * _Start or end aligned popover_
	 *
	 * Desired: Sits at start / end of main edge
	 *
	 * Fallbacks:
	 *  1: _Slide_ along main edge on the cross axis
	 *  2: _Flip_ on main axis to opposite edge
	 *  3: _Flip_ on the diagonal (flip main axis + flip cross axis) into the
	 *     opposite corner. For start / end alignment, this is the clean escape
	 *     when the popover would otherwise land offscreen on both axes (ie in a
	 *     corner). Rule 4 gets the job done, but a slide drops the gap
	 *     as named position-area values don't carry margins).
	 *     The diagonal flip keeps the gap and the alignment.
	 *  4: _Slide_ along opposite edge on the cross axis
	 */

	return [
		slideOnEdge({ align, edgeKey: sameEdgeArea, crossAxis }),
		flipOnMainAxis,
		align !== 'center' ? flipDiagonally({ axis }) : null,
		slideOnEdge({ align, edgeKey: oppositeEdgeArea, crossAxis }),
	]
		.filter(Boolean)
		.flat()
		.join(', ');
}
