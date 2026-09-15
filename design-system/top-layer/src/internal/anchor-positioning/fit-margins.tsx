import { VIEWPORT_PADDING } from '../anchored-popover-size';
import { type TPlacement, type TPlacementAxis, type TPlacementEdge } from '../resolve-placement';
import { type TStyleDeclaration } from '../set-style';

/**
 * Every logical margin property the fit recipe can write. Declared here and
 * imported by `edge-margin.tsx` and `cross-axis-shift-margins.tsx`: two
 * structurally identical declarations are interchangeable to the compiler, so a
 * divergence would surface only as a silently-ignored property name at
 * `setStyle`.
 */
export type TLogicalMarginProperty = `margin-${TPlacementAxis}-${TPlacementEdge}`;

/**
 * The cross-axis sides that face the viewport rather than the anchor, and so take
 * the reserved padding.
 *
 * A `span-*` cell aligns the popover's MARGIN box to the anchor's edge, so padding
 * on the anchor-facing side does not reserve space at the viewport: it insets the
 * border box from the edge the consumer asked it to line up with. A centred
 * popover has no anchor-facing side, and padding both keeps the shift pair
 * antisymmetric so `anchor-center` still centres.
 *
 * Known cost: the slide fallbacks do not swap the inline margins the way
 * `flip-inline` does, so a slid popover keeps its padding on the anchor side (or,
 * re-centred, sits 2.5px off centre). Alignment in the requested position wins.
 */
function viewportFacingCrossAxisSides({ align }: { align: TPlacement['align'] }): TPlacementEdge[] {
	if (align === 'center') {
		return ['start', 'end'];
	}
	// `align: 'start'` sits on the anchor's start edge and expands toward end.
	return [align === 'start' ? 'end' : 'start'];
}

/**
 * The margin half of the fit recipe. The caps reserve the viewport padding by
 * subtracting it, but nothing makes the reservation land on the viewport side, so
 * a capped popover packs flush against the edge it slid or flipped to.
 *
 * The padding buys visual clearance and nothing else: at the cap the margin box
 * is exactly `100%` of the cell, so these margins never make
 * `position-try-fallbacks` fire. Only the unclamped placement-axis floor does
 * that; see `getPlacementAxisFloor`.
 *
 * The cross-axis sides are composed, not overwritten: they already carry the
 * antisymmetric `crossAxisShift` pair.
 */
export function getFitMarginDeclarations({
	placement,
	crossAxisShiftMargins,
}: {
	placement: TPlacement;
	/**
	 * The antisymmetric cross-axis shift pair, to compose the padding into.
	 */
	crossAxisShiftMargins: TStyleDeclaration<TLogicalMarginProperty>[];
}): TStyleDeclaration<TLogicalMarginProperty>[] {
	const crossAxis: TPlacementAxis = placement.axis === 'block' ? 'inline' : 'block';
	const paddedProperties = new Set<TLogicalMarginProperty>(
		viewportFacingCrossAxisSides({ align: placement.align }).map(
			(side) => `margin-${crossAxis}-${side}` as const,
		),
	);

	return [
		{ property: `margin-${placement.axis}-${placement.edge}`, value: VIEWPORT_PADDING },
		...crossAxisShiftMargins.map(({ property, value }) =>
			paddedProperties.has(property)
				? { property, value: `calc(${value} + ${VIEWPORT_PADDING})` }
				: { property, value },
		),
	];
}
