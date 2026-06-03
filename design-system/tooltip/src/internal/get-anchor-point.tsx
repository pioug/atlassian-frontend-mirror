import { type TPlacementOptions } from '@atlaskit/top-layer/placement-map';
import type { TAnchorPoint } from '@atlaskit/top-layer/use-anchor-position-at-point';

import { type PositionMouseOptions } from '../types';

/**
 * Returns the trigger's X edge for inline-axis placements, or the
 * trigger's horizontal center for block-axis placements.
 *
 * Note: does not account for RTL writing modes.
 */
function getTriggerEdgeX({
	triggerRect,
	placement,
}: {
	triggerRect: DOMRect;
	placement: TPlacementOptions;
}): number {
	if (placement.axis === 'inline') {
		return placement.edge === 'start' ? triggerRect.left : triggerRect.right;
	}
	return triggerRect.left + triggerRect.width / 2;
}

/**
 * Returns the trigger's Y edge for block-axis placements, or the
 * trigger's vertical center for inline-axis placements.
 */
function getTriggerEdgeY({
	triggerRect,
	placement,
}: {
	triggerRect: DOMRect;
	placement: TPlacementOptions;
}): number {
	if (placement.axis === 'block') {
		return placement.edge === 'start' ? triggerRect.top : triggerRect.bottom;
	}
	return triggerRect.top + triggerRect.height / 2;
}

/**
 * Computes the viewport point at which to anchor a cursor-positioned
 * tooltip, given the cursor's coordinates and the trigger's bounding rect.
 *
 * - `mouse`:   both axes follow the cursor.
 * - `mouse-x`: X follows the cursor; Y locks to the trigger edge selected
 *   by `placement` (falls back to trigger center if the placement axis
 *   doesn't have a Y edge).
 * - `mouse-y`: Y follows the cursor; X locks to the trigger edge (falls
 *   back to trigger center similarly).
 */
export function getAnchorPoint({
	cursor,
	triggerRect,
	tooltipPosition,
	placement,
}: {
	cursor: { clientX: number; clientY: number };
	triggerRect: DOMRect;
	tooltipPosition: PositionMouseOptions;
	placement: TPlacementOptions;
}): TAnchorPoint {
	if (tooltipPosition === 'mouse-y') {
		return {
			x: getTriggerEdgeX({ triggerRect, placement }),
			y: cursor.clientY,
		};
	}

	if (tooltipPosition === 'mouse-x') {
		return {
			x: cursor.clientX,
			y: getTriggerEdgeY({ triggerRect, placement }),
		};
	}

	// tooltipPosition === 'mouse'
	return { x: cursor.clientX, y: cursor.clientY };
}
