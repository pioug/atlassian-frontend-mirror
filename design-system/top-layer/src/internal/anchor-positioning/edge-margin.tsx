import { type TPlacement, type TPlacementEdge } from '../resolve-placement';
import { type TStyleDeclaration } from '../set-style';
import { type TLogicalMarginProperty } from './fit-margins';

/**
 * The margin that creates the gap between the popover and its anchor.
 */
export function edgeMargin({
	placement,
	offset,
}: {
	placement: TPlacement;
	offset: string;
}): TStyleDeclaration<TLogicalMarginProperty> {
	const { axis, edge } = placement;
	// The side FACING the anchor is always opposite the placement edge.
	const anchorFacingEdge: TPlacementEdge = edge === 'end' ? 'start' : 'end';
	return { property: `margin-${axis}-${anchorFacingEdge}`, value: offset };
}
