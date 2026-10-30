import {
	type TCrossAxisShiftDirection,
	type TPlacement,
	type TPlacementAlign,
	type TPlacementAxis,
	type TPlacementEdge,
} from '../resolve-placement';

/**
 * A viewport-relative position, in pixels. Physical rather than logical
 * because it is written straight to `top` / `left`.
 */
type TPosition = { top: number; left: number };

type TViewportSize = { width: number; height: number };

/**
 * `TCrossAxisShiftOffset` with its CSS length already resolved to pixels. Only
 * this module needs the pixel form, because only this module does arithmetic.
 */
type TResolvedCrossAxisShift = {
	value: number;
	direction: TCrossAxisShiftDirection;
};

/**
 * Returns the position on the placement `edge`, centred on the cross axis.
 *
 * Flips to the opposite edge when the popover does not fit and the opposite
 * edge has more space. `gap` separates the anchor and the popover along the
 * placement axis.
 */
function computeEdgePosition({
	axis,
	edge,
	anchorRect,
	popoverWidth,
	popoverHeight,
	viewport,
	gap,
}: {
	axis: TPlacementAxis;
	edge: TPlacementEdge;
	anchorRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
	viewport: TViewportSize;
	gap: number;
}): TPosition {
	if (axis === 'block' && edge === 'end') {
		// Below the anchor
		const spaceBelow = viewport.height - anchorRect.bottom;
		const spaceAbove = anchorRect.top;
		const fitsBelow = spaceBelow >= popoverHeight + gap;
		const shouldPlaceBelow = fitsBelow || spaceBelow >= spaceAbove;
		return {
			top: shouldPlaceBelow ? anchorRect.bottom + gap : anchorRect.top - popoverHeight - gap,
			left: anchorRect.left + anchorRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'block' && edge === 'start') {
		// Above the anchor
		const spaceAbove = anchorRect.top;
		const spaceBelow = viewport.height - anchorRect.bottom;
		const fitsAbove = spaceAbove >= popoverHeight + gap;
		const shouldPlaceAbove = fitsAbove || spaceAbove >= spaceBelow;
		return {
			top: shouldPlaceAbove ? anchorRect.top - popoverHeight - gap : anchorRect.bottom + gap,
			left: anchorRect.left + anchorRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'inline' && edge === 'end') {
		// Right of the anchor
		const spaceRight = viewport.width - anchorRect.right;
		const spaceLeft = anchorRect.left;
		const fitsRight = spaceRight >= popoverWidth + gap;
		const shouldPlaceRight = fitsRight || spaceRight >= spaceLeft;
		return {
			top: anchorRect.top + anchorRect.height / 2 - popoverHeight / 2,
			left: shouldPlaceRight ? anchorRect.right + gap : anchorRect.left - popoverWidth - gap,
		};
	}

	if (axis === 'inline' && edge === 'start') {
		// Left of the anchor
		const spaceLeft = anchorRect.left;
		const spaceRight = viewport.width - anchorRect.right;
		const fitsLeft = spaceLeft >= popoverWidth + gap;
		const shouldPlaceLeft = fitsLeft || spaceLeft >= spaceRight;
		return {
			top: anchorRect.top + anchorRect.height / 2 - popoverHeight / 2,
			left: shouldPlaceLeft ? anchorRect.left - popoverWidth - gap : anchorRect.right + gap,
		};
	}

	// Unreachable for a valid placement. Defaults to below the anchor.
	return {
		top: anchorRect.bottom + gap,
		left: anchorRect.left + anchorRect.width / 2 - popoverWidth / 2,
	};
}

/**
 * Moves the centred position from `computeEdgePosition` along the cross axis
 * for a non-centre `align`:
 *
 * - `'start'`: the popover start edge lines up with the anchor start edge.
 * - `'end'`: the popover end edge lines up with the anchor end edge.
 */
function applyAlignment({
	position,
	axis,
	align,
	anchorRect,
	popoverWidth,
	popoverHeight,
}: {
	position: TPosition;
	axis: TPlacementAxis;
	align: TPlacementAlign;
	anchorRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
}): TPosition {
	if (align === 'center') {
		return position;
	}

	// A block-axis placement has an inline (left and right) cross axis.
	if (axis === 'block') {
		if (align === 'start') {
			return { ...position, left: anchorRect.left };
		}
		return { ...position, left: anchorRect.right - popoverWidth };
	}

	// An inline-axis placement has a block (top and bottom) cross axis.
	if (align === 'start') {
		return { ...position, top: anchorRect.top };
	}
	return { ...position, top: anchorRect.bottom - popoverHeight };
}

/**
 * Applies the cross-axis shift offset. `forwards` always moves the popover
 * toward the cross-axis END, for every `align` value.
 *
 * Do not add a per-`align` sign inversion here. This is a coordinate, so the
 * direction is the sign and nothing else. The CSS path inverts only because an
 * END-side margin pushes a box the opposite way to a START-side one, which is a
 * property of margins.
 */
function applyCrossAxisShift({
	position,
	axis,
	crossAxisShift,
}: {
	position: TPosition;
	axis: TPlacementAxis;
	crossAxisShift: TResolvedCrossAxisShift;
}): TPosition {
	if (crossAxisShift.value === 0) {
		return position;
	}
	const directionSign = crossAxisShift.direction === 'forwards' ? 1 : -1;
	const delta = crossAxisShift.value * directionSign;

	// The cross axis is perpendicular to the placement axis.
	if (axis === 'block') {
		return { ...position, left: position.left + delta };
	}
	return { ...position, top: position.top + delta };
}

/**
 * Returns the viewport position of the popover from the anchor rect. Flips to
 * the side with more space when needed, then clamps to the viewport.
 *
 * `gap` and `crossAxisShift` arrive already resolved to pixels (see
 * `resolveCssLengthToPixels`), so this stays purely numeric.
 */
export function computeFallbackPosition({
	anchorRect,
	popover,
	placement,
	viewport,
	gap,
	crossAxisShift,
}: {
	anchorRect: DOMRect;
	popover: HTMLElement;
	placement: TPlacement;
	viewport: TViewportSize;
	gap: number;
	crossAxisShift: TResolvedCrossAxisShift;
}): TPosition {
	const { axis, edge, align } = placement;

	// The popover must have layout here (not `display: none`), or both sizes are `0`.
	const popoverWidth = popover.offsetWidth;
	const popoverHeight = popover.offsetHeight;

	const edgePosition = computeEdgePosition({
		axis,
		edge,
		anchorRect,
		popoverWidth,
		popoverHeight,
		viewport,
		gap,
	});

	const alignedPosition = applyAlignment({
		position: edgePosition,
		axis,
		align,
		anchorRect,
		popoverWidth,
		popoverHeight,
	});

	const shiftedPosition = applyCrossAxisShift({
		position: alignedPosition,
		axis,
		crossAxisShift,
	});

	// Clamp to the viewport. A popover larger than the viewport keeps its top-left
	// corner on screen.
	return {
		top: Math.max(0, Math.min(shiftedPosition.top, viewport.height - popoverHeight)),
		left: Math.max(0, Math.min(shiftedPosition.left, viewport.width - popoverWidth)),
	};
}
