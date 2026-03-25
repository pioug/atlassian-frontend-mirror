import { type TPlacement } from './resolve-placement';

/**
 * Computes the base {top, left} position based on the primary edge,
 * flipping to the opposite side when there is not enough space.
 */
function computeEdgePosition({
	axis,
	edge,
	triggerRect,
	popoverWidth,
	popoverHeight,
	viewport,
	offset,
}: {
	axis: 'block' | 'inline';
	edge: 'start' | 'end';
	triggerRect: DOMRect;
	popoverWidth: number;
	popoverHeight: number;
	viewport: { width: number; height: number };
	offset: number;
}): { top: number; left: number } {
	if (axis === 'block' && edge === 'end') {
		// Below trigger
		const spaceBelow = viewport.height - triggerRect.bottom;
		const spaceAbove = triggerRect.top;
		return {
			top:
				spaceBelow >= popoverHeight + offset || spaceBelow >= spaceAbove
					? triggerRect.bottom + offset
					: triggerRect.top - popoverHeight - offset,
			left: triggerRect.left + triggerRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'block' && edge === 'start') {
		// Above trigger
		const spaceAbove = triggerRect.top;
		const spaceBelow = viewport.height - triggerRect.bottom;
		return {
			top:
				spaceAbove >= popoverHeight + offset || spaceAbove >= spaceBelow
					? triggerRect.top - popoverHeight - offset
					: triggerRect.bottom + offset,
			left: triggerRect.left + triggerRect.width / 2 - popoverWidth / 2,
		};
	}

	if (axis === 'inline' && edge === 'end') {
		// Right of trigger
		const spaceRight = viewport.width - triggerRect.right;
		const spaceLeft = triggerRect.left;
		return {
			top: triggerRect.top + triggerRect.height / 2 - popoverHeight / 2,
			left:
				spaceRight >= popoverWidth + offset || spaceRight >= spaceLeft
					? triggerRect.right + offset
					: triggerRect.left - popoverWidth - offset,
		};
	}

	if (axis === 'inline' && edge === 'start') {
		// Left of trigger
		const spaceLeft = triggerRect.left;
		const spaceRight = viewport.width - triggerRect.right;
		return {
			top: triggerRect.top + triggerRect.height / 2 - popoverHeight / 2,
			left:
				spaceLeft >= popoverWidth + offset || spaceLeft >= spaceRight
					? triggerRect.left - popoverWidth - offset
					: triggerRect.right + offset,
		};
	}

	// Unreachable for valid placements; defaults to below trigger
	return {
		top: triggerRect.bottom + offset,
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
 * JS fallback: compute popover position from trigger rect and viewport.
 *
 * Placement algorithm (from the document):
 * - "block" placement: show above/below, picking the side with more space if flipping needed
 * - "inline" placement: show left/right, picking the side with more space if flipping needed
 * - "auto" placement: show on the edge with the most available space
 *
 * Re-runs on scroll (capture on window) and resize events.
 */
export function computeFallbackPosition({
	triggerRect,
	popoverEl,
	placement,
	viewport,
	offset,
}: {
	triggerRect: DOMRect;
	popoverEl: HTMLElement;
	placement: TPlacement;
	viewport: { width: number; height: number };
	offset: number;
}): { top: number; left: number } {
	const { axis, edge, align } = placement;

	// Measure popover dimensions (it might not have layout yet if just shown)
	const popoverWidth = popoverEl.offsetWidth;
	const popoverHeight = popoverEl.offsetHeight;

	const basePosition = computeEdgePosition({
		axis,
		edge,
		triggerRect,
		popoverWidth,
		popoverHeight,
		viewport,
		offset,
	});

	const alignedPosition = applyAlignment({
		position: basePosition,
		axis,
		align,
		triggerRect,
		popoverWidth,
		popoverHeight,
	});

	// Clamp to viewport so the popover is never offscreen
	return {
		top: Math.max(0, Math.min(alignedPosition.top, viewport.height - popoverHeight)),
		left: Math.max(0, Math.min(alignedPosition.left, viewport.width - popoverWidth)),
	};
}
