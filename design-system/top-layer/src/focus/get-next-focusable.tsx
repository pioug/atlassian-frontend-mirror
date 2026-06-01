/**
 * Returns the next focusable element in the given direction relative to the
 * currently focused element within the container. Wraps around at both ends.
 *
 * Returns `null` if there is no focused element within the container or if
 * the focused element is not in the list of focusable elements.
 */

import { getFocusables } from './get-focusables';
import { selectors } from './selectors';
import type { TFocusableFilter } from './types';

export function getNextFocusable({
	container,
	direction,
	filter,
}: {
	container: HTMLElement;
	direction: 'forwards' | 'backwards';
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const all = getFocusables({ container, filter });
	const current = container.querySelector(selectors.focused);
	if (!(current instanceof HTMLElement)) {
		return null;
	}
	const index = all.indexOf(current);
	if (index === -1) {
		return null;
	}
	const nextIndex: number = (() => {
		if (direction === 'forwards') {
			return (index + 1) % all.length;
		}
		const proposed = index - 1;
		// if going into negative numbers, loop back to the last item
		return proposed < 0 ? all.length - 1 : proposed;
	})();

	return all[nextIndex] ?? null;
}
