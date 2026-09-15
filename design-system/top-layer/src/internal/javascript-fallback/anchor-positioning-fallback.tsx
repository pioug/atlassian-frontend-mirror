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

/**
 * `TCrossAxisShiftOffset` with its CSS length already resolved to pixels. Only
 * this module needs the pixel form, because only this module does arithmetic.
 */
type TResolvedCrossAxisShift = {
	value: number;
	direction: TCrossAxisShiftDirection;
};

/**
 * Computes the base {top, left} position based on the primary edge,
 * flipping to the opposite side when there is not enough space.
 *
 * `gap` is applied along the main axis between trigger and popover.
 */
function computeEdgePosition({
	axis,
	edge,
	triggerRect,
	popoverWidth,
	popoverHeight,
	viewport,
	gap,
}: {
	axis: TPlacementAxis;
	edge: TPlacementEdge;
	triggerRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
	viewport: { width: number; height: number };
	gap: number;
}): TPosition {
	if (axis === 'block' && edge === 'end') {
		// Below trigger
		const spaceBelow = viewport.height - triggerRect.bottom;
		const spaceAbove = triggerRect.top;
		const fitsBelow = spaceBelow >= popoverHeight + gap;
		const useBelow = fitsBelow || spaceBelow >= spaceAbove;
		return {
			top: useBelow ? triggerRect.bottom + gap : triggerRect.top - popoverHeight - gap,
			left: triggerRect.left + triggerRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'block' && edge === 'start') {
		// Above trigger
		const spaceAbove = triggerRect.top;
		const spaceBelow = viewport.height - triggerRect.bottom;
		const fitsAbove = spaceAbove >= popoverHeight + gap;
		const useAbove = fitsAbove || spaceAbove >= spaceBelow;
		return {
			top: useAbove ? triggerRect.top - popoverHeight - gap : triggerRect.bottom + gap,
			left: triggerRect.left + triggerRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'inline' && edge === 'end') {
		// Right of trigger
		const spaceRight = viewport.width - triggerRect.right;
		const spaceLeft = triggerRect.left;
		const fitsRight = spaceRight >= popoverWidth + gap;
		const useRight = fitsRight || spaceRight >= spaceLeft;
		return {
			top: triggerRect.top + triggerRect.height / 2 - popoverHeight / 2,
			left: useRight ? triggerRect.right + gap : triggerRect.left - popoverWidth - gap,
		};
	}

	if (axis === 'inline' && edge === 'start') {
		// Left of trigger
		const spaceLeft = triggerRect.left;
		const spaceRight = viewport.width - triggerRect.right;
		const fitsLeft = spaceLeft >= popoverWidth + gap;
		const useLeft = fitsLeft || spaceLeft >= spaceRight;
		return {
			top: triggerRect.top + triggerRect.height / 2 - popoverHeight / 2,
			left: useLeft ? triggerRect.left - popoverWidth - gap : triggerRect.right + gap,
		};
	}

	// Unreachable for valid placements; defaults to below trigger
	return {
		top: triggerRect.bottom + gap,
		left: triggerRect.left + triggerRect.width / 2 - popoverWidth / 2,
	};
}

/**
 * Adjusts the base (centered) position for non-center alignments.
 *
 * `align: 'start'` → popover start edge at trigger start edge
 * `align: 'end'`   → popover end edge at trigger end edge
 */
function applyAlignment({
	position,
	axis,
	align,
	triggerRect,
	popoverWidth,
	popoverHeight,
}: {
	position: TPosition;
	axis: TPlacementAxis;
	align: TPlacementAlign;
	triggerRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
}): TPosition {
	if (align === 'center') {
		return position;
	}

	if (axis === 'block') {
		// Block-axis placement → cross-axis is inline (left/right)
		if (align === 'start') {
			return { ...position, left: triggerRect.left };
		}
		// align === 'end'
		return { ...position, left: triggerRect.right - popoverWidth };
	}

	// Inline-axis placement → cross-axis is block (top/bottom)
	if (align === 'start') {
		return { ...position, top: triggerRect.top };
	}
	// align === 'end'
	return { ...position, top: triggerRect.bottom - popoverHeight };
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

	// Cross-axis is the OPPOSITE of the placement axis.
	if (axis === 'block') {
		return { ...position, left: position.left + delta };
	}
	return { ...position, top: position.top + delta };
}

/**
 * Computes the popover position from the trigger rect and viewport, flipping to
 * the side with more space when needed.
 *
 * `gap` and `crossAxisShift` arrive already resolved to pixels (see
 * `resolveCssLengthToPixels`), so this stays purely numeric.
 */
export function computeFallbackPosition({
	triggerRect,
	popoverEl,
	placement,
	viewport,
	gap,
	crossAxisShift,
}: {
	triggerRect: DOMRect;
	popoverEl: HTMLElement;
	placement: TPlacement;
	viewport: { width: number; height: number };
	gap: number;
	crossAxisShift: TResolvedCrossAxisShift;
}): TPosition {
	const { axis, edge, align } = placement;

	// Measure popover dimensions. Callers must ensure the popover has
	// laid out before calling this (it should not be `display: none`).
	const popoverWidth = popoverEl.offsetWidth;
	const popoverHeight = popoverEl.offsetHeight;

	const basePosition = computeEdgePosition({
		axis,
		edge,
		triggerRect,
		popoverWidth,
		popoverHeight,
		viewport,
		gap,
	});

	const alignedPosition = applyAlignment({
		position: basePosition,
		axis,
		align,
		triggerRect,
		popoverWidth,
		popoverHeight,
	});

	const shiftedPosition = applyCrossAxisShift({
		position: alignedPosition,
		axis,
		crossAxisShift,
	});

	// Clamp to viewport so the popover is never offscreen
	return {
		top: Math.max(0, Math.min(shiftedPosition.top, viewport.height - popoverHeight)),
		left: Math.max(0, Math.min(shiftedPosition.left, viewport.width - popoverWidth)),
	};
}
