import { type TPlacement } from './resolve-placement';

/**
 * JS fallback positioning math. Used only when the browser does not
 * support CSS Anchor Positioning (less than 6% of users).
 *
 * Consumer-supplied `offset.gap` and `offset.crossAxisShift` are
 * honored: the caller (`useAnchorPosition`) resolves CSS length strings
 * (tokens, calc, var, etc) to pixels via a DOM probe before passing them
 * in. The caller also keeps the popover hidden (`opacity: 0`) until the
 * first measurement completes, so the popover never paints at the wrong
 * position.
 */

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
	axis: 'block' | 'inline';
	edge: 'start' | 'end';
	triggerRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
	viewport: { width: number; height: number };
	gap: number;
}): { top: number; left: number } {
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
	position: { top: number; left: number };
	axis: 'block' | 'inline';
	align: 'start' | 'center' | 'end';
	triggerRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
}): { top: number; left: number } {
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
 * Applies the cross-axis shift offset.
 *
 * The sign mirrors the CSS path (see `crossAxisShiftMargin` in
 * `use-anchor-position.tsx`):
 *   - `align: 'start' | 'center'` + `forwards`  → push toward end (positive)
 *   - `align: 'end'`              + `forwards`  → push toward start (negative)
 *   - `backwards` flips the sign in both cases.
 */
function applyCrossAxisShift({
	position,
	axis,
	align,
	crossAxisShift,
}: {
	position: { top: number; left: number };
	axis: 'block' | 'inline';
	align: 'start' | 'center' | 'end';
	crossAxisShift: { value: number; direction: 'forwards' | 'backwards' };
}): { top: number; left: number } {
	if (crossAxisShift.value === 0) {
		return position;
	}
	const directionSign = crossAxisShift.direction === 'forwards' ? 1 : -1;
	const sideSign = align === 'end' ? -1 : 1;
	const delta = crossAxisShift.value * directionSign * sideSign;

	// Cross-axis is the OPPOSITE of the placement axis.
	if (axis === 'block') {
		return { ...position, left: position.left + delta };
	}
	return { ...position, top: position.top + delta };
}

/**
 * Computes popover position from trigger rect and viewport, flipping to
 * the side with more space when needed. Re-runs on scroll/resize.
 *
 * `gap` and `crossAxisShift` are pre-resolved to pixels by the
 * caller (see `resolveCssLengthToPixels`), so this function stays purely
 * numeric.
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
	crossAxisShift: { value: number; direction: 'forwards' | 'backwards' };
}): { top: number; left: number } {
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
		align,
		crossAxisShift,
	});

	// Clamp to viewport so the popover is never offscreen
	return {
		top: Math.max(0, Math.min(shiftedPosition.top, viewport.height - popoverHeight)),
		left: Math.max(0, Math.min(shiftedPosition.left, viewport.width - popoverWidth)),
	};
}
