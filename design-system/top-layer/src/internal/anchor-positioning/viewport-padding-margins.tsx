import { VIEWPORT_PADDING } from '../anchored-popover-size';
import { type TPlacement, type TPlacementAxis, type TPlacementEdge } from '../resolve-placement';
import { type TStyleDeclaration } from '../set-style';

/**
 * Every logical margin property the anchor positioning path writes. Declared once
 * here and imported by `edge-margin.tsx` and `cross-axis-shift-margins.tsx`, so
 * all three margin writers share one definition. Separate copies could drift
 * apart without a compile error, and a drifted name would only show up as a
 * property that `setStyle` writes and the browser silently ignores.
 */
export type TLogicalMarginProperty = `margin-${TPlacementAxis}-${TPlacementEdge}`;

/**
 * The cross-axis sides that face the viewport and so take the padding. Padding
 * on the anchor side of an aligned popover would move it off the anchor edge.
 *
 * Known cost (accepted): an aligned popover that falls back to a centred cell
 * sits 2.5px off centre. Rare. See `notes/decisions/viewport-edge-gap.md`.
 */
function viewportFacingCrossAxisSides({ align }: { align: TPlacement['align'] }): TPlacementEdge[] {
	if (align === 'center') {
		return ['start', 'end'];
	}
	// `align: 'start'` sits on the anchor's start edge and expands toward end.
	return [align === 'start' ? 'end' : 'start'];
}

/**
 * The margins that keep every anchored popover 5px off the viewport edge. They
 * never move a popover off its anchor. The cross-axis padding is composed into
 * the shift margins. See `notes/decisions/viewport-edge-gap.md`.
 */
export function getViewportPaddingMarginDeclarations({
	placement,
	crossAxisShiftMargins,
	hasCrossAxisPadding,
}: {
	placement: TPlacement;
	/**
	 * `false` for a `'match-anchor'` or `'min-anchor'` cross axis: the padding
	 * would push the popover off its anchor.
	 */
	hasCrossAxisPadding: boolean;
	/**
	 * The antisymmetric cross-axis shift pair, to compose the padding into.
	 */
	crossAxisShiftMargins: TStyleDeclaration<TLogicalMarginProperty>[];
}): TStyleDeclaration<TLogicalMarginProperty>[] {
	const crossAxis: TPlacementAxis = placement.axis === 'block' ? 'inline' : 'block';
	const paddedProperties = new Set<TLogicalMarginProperty>(
		hasCrossAxisPadding
			? viewportFacingCrossAxisSides({ align: placement.align }).map(
					(side) => `margin-${crossAxis}-${side}` as const,
				)
			: [],
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
