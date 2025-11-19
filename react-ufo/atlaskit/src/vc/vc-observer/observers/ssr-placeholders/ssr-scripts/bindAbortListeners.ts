import { type AbortEvent } from '../../../../../common/vc/types';
import { attachAbortListeners } from '../../../attachAbortListeners';
import { getViewportHeight, getViewportWidth } from '../../../getViewport';

export function bindAbortListeners(document: Document, window: Window): void {
	const viewport = {
		w: getViewportWidth(document),
		h: getViewportHeight(document),
	};

	const aborts: { -readonly [key in keyof typeof AbortEvent]?: number } = {};
	const unbinds = attachAbortListeners(window, viewport, (key, time) => {
		aborts[key] = time;
	});
	window.__SSR_ABORT_LISTENERS__ = {
		unbinds,
		aborts,
	};
}
