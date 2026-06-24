import type { TPlacementOptions } from '@atlaskit/top-layer/placement-map';
import type { TAnchorPoint } from '@atlaskit/top-layer/use-anchor-position-at-point';

/**
 * Reduces an anchor rect to the single viewport point that, wrapped in a
 * zero-size synthetic anchor, produces the same popover position
 * `useAnchorPosition` would for the given placement. This works because
 * `useAnchorPosition` only reads the edge / alignment corner of the rect,
 * so a coincident zero-size point is geometrically equivalent.
 *
 * RTL is resolved here so the downstream synthetic anchor only sees physical
 * coordinates. Defaults mirror `getPlacement` in
 * `@atlaskit/top-layer/placement-map` (`axis: 'block'`, `edge: 'end'`,
 * `align: 'center'`).
 */
export function rectPointForPlacement({
	rect,
	placement,
	isRtl,
}: {
	rect: DOMRect;
	placement: TPlacementOptions;
	isRtl: boolean;
}): TAnchorPoint {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';

	if (axis === 'block') {
		// Popover sits above (`edge: 'start'`) or below (`edge: 'end'`)
		// the anchor. Hug the matching horizontal edge; align along x.
		const y = edge === 'start' ? rect.top : rect.bottom;
		const x = horizontalForAlign({ rect, align, isRtl });
		return { x, y };
	}

	// `axis: 'inline'`: popover sits inline-start or inline-end of the
	// anchor. Hug the matching vertical edge; align along y.
	const x = inlineEdgeX({ rect, edge, isRtl });
	const y = verticalForAlign({ rect, align });
	return { x, y };
}

function horizontalForAlign({
	rect,
	align,
	isRtl,
}: {
	rect: DOMRect;
	align: 'start' | 'center' | 'end';
	isRtl: boolean;
}): number {
	if (align === 'center') {
		return rect.left + rect.width / 2;
	}
	// `start` / `end` are logical. In LTR, `start` is the left edge.
	// In RTL, `start` is the right edge.
	const isStartLeft = !isRtl;
	if (align === 'start') {
		return isStartLeft ? rect.left : rect.right;
	}
	return isStartLeft ? rect.right : rect.left;
}

function verticalForAlign({
	rect,
	align,
}: {
	rect: DOMRect;
	align: 'start' | 'center' | 'end';
}): number {
	if (align === 'center') {
		return rect.top + rect.height / 2;
	}
	if (align === 'start') {
		return rect.top;
	}
	return rect.bottom;
}

function inlineEdgeX({
	rect,
	edge,
	isRtl,
}: {
	rect: DOMRect;
	edge: 'start' | 'end';
	isRtl: boolean;
}): number {
	const isStartLeft = !isRtl;
	if (edge === 'start') {
		return isStartLeft ? rect.left : rect.right;
	}
	return isStartLeft ? rect.right : rect.left;
}
