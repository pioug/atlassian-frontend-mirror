import { type TPlacement } from '../resolve-placement';

/**
 * The placement axis joined to its edge, e.g. `block-end`.
 */
type TPositionAreaEdge = `${TPlacement['axis']}-${TPlacement['edge']}`;

/**
 * The try options that slide the popover along one edge, on the cross axis.
 *
 * A try option is only worth listing if its margin box can fit where an earlier
 * one did not. Two options over the SAME cell have the same margin box and the
 * same fit result. That rules out three cells for an aligned placement: the near
 * span on the requested edge IS the base `position-area`, and on the opposite
 * edge the near and far spans are where the placement-axis flip and the diagonal
 * flip land.
 *
 * A centred placement has no near or far span, so it slides to both spans on
 * both edges.
 */
function getSlideTryOptions({
	align,
	edgeArea,
	crossAxis,
	isOppositeEdge,
}: {
	align: TPlacement['align'];
	edgeArea: TPositionAreaEdge;
	crossAxis: TPlacement['axis'];
	isOppositeEdge: boolean;
}): string[] {
	if (align === 'center') {
		return [`${edgeArea} span-${crossAxis}-end`, `${edgeArea} span-${crossAxis}-start`];
	}
	if (isOppositeEdge) {
		return [edgeArea];
	}
	// For `align: 'start'` the popover expands toward `end`, so the far span is
	// `start`. `align: 'end'` is the mirror image.
	const farSpanSide = align === 'start' ? 'start' : 'end';
	return [edgeArea, `${edgeArea} span-${crossAxis}-${farSpanSide}`];
}

/**
 * The try option that flips on both axes, into the opposite corner.
 */
function getDiagonalFlipTryOption({ axis }: { axis: TPlacement['axis'] }): string {
	const placementAxisFlip = axis === 'block' ? 'flip-block' : 'flip-inline';
	const crossAxisFlip = axis === 'block' ? 'flip-inline' : 'flip-block';
	return `${placementAxisFlip} ${crossAxisFlip}`;
}

/**
 * Returns the `position-try-fallbacks` value for a RESOLVED placement. The
 * browser tries the entries in order and uses the first one whose margin box
 * fits, so an entry over a cell already tried can never be chosen.
 * `getSlideTryOptions` explains which ones those are.
 *
 * Centred: slide along the requested edge to either span, flip to the opposite
 * edge, then slide along that edge to either span.
 *
 * Start or end aligned: slide along the requested edge (re-centred, then the far
 * span), flip to the opposite edge keeping the alignment, flip on the diagonal
 * into the opposite corner, then re-centre on the opposite edge. The diagonal is
 * the clean escape when the popover would land off screen on both axes: a flip
 * keyword carries the gap and shift margins across, where a `position-area`
 * slide leaves them on the original sides.
 *
 * @example
 * // Centred on the block-end edge (the default placement):
 * placementToTryFallbacks({ placement: resolvePlacement({ placement: {} }) });
 * // => 'block-end span-inline-end, block-end span-inline-start, flip-block,
 * //     block-start span-inline-end, block-start span-inline-start'
 *
 * // Start-aligned on the block-end edge:
 * placementToTryFallbacks({ placement: resolvePlacement({ placement: { align: 'start' } }) });
 * // => 'block-end, block-end span-inline-start, flip-block, flip-block flip-inline, block-start'
 */
export function placementToTryFallbacks({ placement }: { placement: TPlacement }): string {
	const { axis, edge, align } = placement;
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const oppositeEdge = edge === 'start' ? 'end' : 'start';

	const sameEdgeArea: TPositionAreaEdge = `${axis}-${edge}`;
	const oppositeEdgeArea: TPositionAreaEdge = `${axis}-${oppositeEdge}`;

	const placementAxisFlip = axis === 'block' ? 'flip-block' : 'flip-inline';

	return [
		getSlideTryOptions({ align, edgeArea: sameEdgeArea, crossAxis, isOppositeEdge: false }),
		placementAxisFlip,
		align !== 'center' ? getDiagonalFlipTryOption({ axis }) : null,
		getSlideTryOptions({ align, edgeArea: oppositeEdgeArea, crossAxis, isOppositeEdge: true }),
	]
		.filter(Boolean)
		.flat()
		.join(', ');
}
