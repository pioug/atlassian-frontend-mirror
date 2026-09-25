import { useLayoutEffect, useState } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { findOverflowScrollParent } from '../ui/Popup/utils';

type Options = {
	boundariesElement?: HTMLElement;
	isOpen?: boolean;
	maxHeight: number;
	offset: number;
	scrollableElement?: HTMLElement;
	target?: HTMLElement | null;
};

/** Constrain menu height to the available space; Popup chooses placement. */
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
			const above = Math.max(0, rect.top - (bounds.top - boundary.scrollTop) - offset);
			const below = Math.max(0, bounds.bottom - rect.bottom - offset);
			const space = below >= maxHeight ? below : Math.max(above, below);
			// Popup rounds its position up to a CSS pixel. Reserve that pixel at the edge.
			const available = Math.max(0, Math.floor(space) - 1);
			setHeight(Math.min(maxHeight, available));
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
