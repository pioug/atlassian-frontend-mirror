import { useLayoutEffect, useState } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { findOverflowScrollParent, getVerticalPlacement } from '../ui/Popup/utils';

// Keeps the menu's far edge clear of the boundary edge (space.100).
const EDGE_GAP = 8;

type Options = {
	boundariesElement?: HTMLElement;
	isOpen?: boolean;
	maxHeight: number;
	offset: number;
	scrollableElement?: HTMLElement;
	target?: HTMLElement | null;
};

/**
 * Limits menu height to the space around its anchor as the page scrolls or resizes.
 * It allows room above or below the anchor because Popup can choose either side.
 * This hook controls height only; Popup still positions the menu.
 */
export function useMenuPopupSizing({
	target,
	boundariesElement,
	scrollableElement,
	maxHeight,
	offset,
	isOpen = true,
}: Options): number {
	const [height, setHeight] = useState(maxHeight);

	useLayoutEffect(() => {
		const view = target?.ownerDocument.defaultView;
		if (!target || !view || !isOpen) {
			return;
		}
		const boundary = boundariesElement || target.ownerDocument.body;
		const scrollParent = scrollableElement || findOverflowScrollParent(target);
		const update = () => {
			const rect = target.getBoundingClientRect();
			const bounds = boundary.getBoundingClientRect();
			const above = Math.max(0, rect.top - (bounds.top - boundary.scrollTop) - offset - EDGE_GAP);
			const below = Math.max(0, bounds.bottom - rect.bottom - offset - EDGE_GAP);
			const space = below >= maxHeight ? below : Math.max(above, below);
			// Popup rounds its position up to a CSS pixel. Reserve that pixel at the edge.
			const fitHeight = Math.min(maxHeight, Math.max(0, Math.floor(space) - 1));
			// Popup's placement ignores the offset, so it can still open below when this hook
			// sized for above. Size for the side Popup will use. `true` mirrors the preventOverflow
			// every caller passes to Popup, so this prediction matches Popup's own placement.
			const placement = getVerticalPlacement(target, boundary, fitHeight, undefined, false, true);
			setHeight(
				placement === 'bottom'
					? Math.min(fitHeight, Math.max(0, Math.floor(below) - 1))
					: fitHeight,
			);
		};
		const schedule = rafSchedule(update);
		update();
		const unbindResize = bind(view, { type: 'resize', listener: schedule });
		const unbindScroll = scrollParent
			? bind(scrollParent, { type: 'scroll', listener: schedule })
			: undefined;
		return () => {
			unbindResize();
			unbindScroll?.();
			schedule.cancel();
		};
	}, [target, boundariesElement, scrollableElement, maxHeight, offset, isOpen]);

	return height;
}
