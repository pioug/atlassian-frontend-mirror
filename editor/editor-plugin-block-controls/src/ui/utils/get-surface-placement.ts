import type { CSSProperties } from 'react';

import { shouldBeSticky } from '../../pm-plugins/utils/drag-handle-positions';
import { dragHandleGap, topPositionAdjustment } from '../consts';

export type SurfacePlacement = {
	/**
	 * Set only for sticky-eligible node types (long tables, panels, expands, etc.): the target
	 * node's full height. Lets the surface wrapper span the node so its content can use
	 * `position: sticky` to stay in view while the node scrolls, instead of scrolling off-screen
	 * with the node's top edge.
	 */
	height?: number;
	left: number;
	top: number;
	transform: string;
};

export type SurfaceSide = 'left' | 'right';

export type SurfacePlacementOptions = {
	layout: string;
	nodeRect: Pick<DOMRect, 'height' | 'left' | 'right' | 'top' | 'width'>;
	nodeType: string;
	nodeTypeWithLevel: string;
	parentNodeType?: string;
	side: SurfaceSide;
};

export const getAbsoluteSurfacePlacement = ({
	offsetParentRect,
	offsetParentScrollLeft,
	offsetParentScrollTop,
	placement,
}: {
	offsetParentRect?: Pick<DOMRect, 'left' | 'top'>;
	offsetParentScrollLeft: number;
	offsetParentScrollTop: number;
	placement: SurfacePlacement;
}): SurfacePlacement => ({
	...placement,
	left: placement.left - (offsetParentRect?.left ?? 0) + offsetParentScrollLeft,
	top: placement.top - (offsetParentRect?.top ?? 0) + offsetParentScrollTop,
});

/**
 * Positions the surface beside the legacy drag-handle slot, on either the left or right edge
 * of the target node. Node-type-specific gap/top-adjustment maths (layouts, tables, media, cards,
 * extensions, etc.) live in one place so left/right edge cases can't drift out of sync.
 *
 * The left side grows away from the node without knowing its own width, so it needs
 * `translateX(-100%)` to anchor its right edge at `nodeRect.left` and extend backward. The right
 * side grows in the normal box-flow direction (away from the node, into the margin), so the gap
 * can be folded straight into `left` with no transform needed.
 */
export const getSurfacePlacement = ({
	layout,
	nodeRect,
	nodeType,
	nodeTypeWithLevel,
	parentNodeType,
	side,
}: SurfacePlacementOptions): SurfacePlacement => {
	if (nodeType === 'layoutColumn') {
		// nodeRect.left + width/2 === nodeRect.right - width/2 — side-independent.
		return {
			left: nodeRect.left + nodeRect.width / 2,
			top: nodeRect.top,
			transform: 'translate(-50%, -50%)',
		};
	}

	const gap = dragHandleGap(nodeType, parentNodeType);
	const top = nodeRect.top + topPositionAdjustment(nodeTypeWithLevel, layout);
	const height = shouldBeSticky(nodeType) ? nodeRect.height : undefined;

	return side === 'right'
		? { left: nodeRect.right + gap, top, transform: '', height }
		: { left: nodeRect.left, top, transform: `translateX(calc(-100% - ${gap}px))`, height };
};

/**
 * The insets to apply to a surface wrapper, plus whether that wrapper spans its target node.
 *
 * Two kinds of placement produce this. A measured one resolves to pixel numbers from a
 * `getBoundingClientRect` snapshot, so it is only as fresh as the last render and needs observers
 * to keep it honest. An anchored one resolves to `anchor()` functions that the browser re-evaluates
 * on every layout change, so it stays attached to its node with nothing re-rendering.
 *
 * `isSticky` is carried alongside the style rather than read back out of it because the two variants
 * express the same stretch differently — a measured `height` versus an anchored `bottom`.
 */
export type SurfaceWrapperPlacement = {
	isSticky: boolean;
	style: CSSProperties;
};

/**
 * Adapts a measured placement to the shape the surface components consume. Sticky-eligible node
 * types are the ones `getSurfacePlacement` gave a `height` to.
 */
export const toMeasuredSurfaceWrapperPlacement = (
	placement: SurfacePlacement,
): SurfaceWrapperPlacement => ({
	isSticky: placement.height !== undefined,
	style: {
		height: placement.height,
		left: placement.left,
		top: placement.top,
		transform: placement.transform,
	},
});

/**
 * Where a surface goes when its anchor stops resolving, as the fallback argument to the block-axis
 * `anchor()` calls below.
 *
 * An anchor is invalid once its element stops generating a box e.g. (`display: none`) / removed node
 * Currently, anchor fallback is not unstable with some of the position-visibility options, so here
 * we manually set a fallback of -9999 so that it will render offscreen out of the viewport
 * without causing extra overflows
 */
const INVALID_ANCHOR_OFFSCREEN_PX = 9999;
const INVALID_ANCHOR_FALLBACK_TOP = `-${INVALID_ANCHOR_OFFSCREEN_PX}px`;
const INVALID_ANCHOR_FALLBACK_BOTTOM = `${INVALID_ANCHOR_OFFSCREEN_PX}px`;

export type AnchoredSurfacePlacementOptions = {
	/** The target node's CSS anchor name, i.e. its `data-node-anchor` value. */
	anchorName: string;
	nodeType: string;
	nodeTypeWithLevel: string;
	parentNodeType?: string;
	side: SurfaceSide;
};

export const getAnchoredSurfacePlacement = ({
	anchorName,
	nodeType,
	nodeTypeWithLevel,
	parentNodeType,
	side,
}: AnchoredSurfacePlacementOptions): SurfaceWrapperPlacement => {
	if (nodeType === 'layoutColumn') {
		// The column's horizontal midpoint, matching the measured `nodeRect.left + width / 2` and the
		// legacy drag handle's own layout-column formula. Side-independent.
		return {
			isSticky: false,
			style: {
				left: `calc((anchor(${anchorName} left) + anchor(${anchorName} right)) / 2)`,
				positionAnchor: anchorName,
				top: `anchor(${anchorName} top, ${INVALID_ANCHOR_FALLBACK_TOP})`,
				transform: 'translate(-50%, -50%)',
			},
		};
	}

	const gap = dragHandleGap(nodeType, parentNodeType);
	const isSticky = shouldBeSticky(nodeType);

	return {
		isSticky,
		style: {
			// A sticky wrapper is stretched with `bottom` instead of a measured `height`. Pairing it
			// with the adjusted `top` keeps the box ending exactly where the node does, however far
			// the top adjustment pushed the start down and however much the node later grows.
			...(isSticky
				? { bottom: `anchor(${anchorName} bottom, ${INVALID_ANCHOR_FALLBACK_BOTTOM})` }
				: {}),
			left:
				side === 'right'
					? `calc(anchor(${anchorName} right) + ${gap}px)`
					: `anchor(${anchorName} left)`,
			positionAnchor: anchorName,
			top: `calc(anchor(${anchorName} top, ${INVALID_ANCHOR_FALLBACK_TOP}) + ${topPositionAdjustment(nodeTypeWithLevel)}px)`,
			// The left side grows away from the node without knowing its own width, so it pulls itself
			// back past its own box and the gap. The right side grows into the margin, so the gap is
			// already folded into `left` above.
			transform: side === 'right' ? '' : `translateX(calc(-100% - ${gap}px))`,
		},
	};
};
