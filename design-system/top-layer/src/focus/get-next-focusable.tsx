/**
 * Returns the next focusable element in the given direction relative to the
 * currently focused element within the container. Wraps around at both ends.
 *
 * The currently focused element does not need to be tabbable. This prevents
 * navigation from getting stuck on an element that was programmatically or
 * pointer focused with `tabindex="-1"`. Negative-tab-index elements remain
 * excluded as destinations.
 *
 * Returns `null` if there is no focused element within the container.
 */

import { getFocusables } from './get-focusables';
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
	const first = all[0];
	const last = all[all.length - 1];

	// Checking the elements directly narrows types from `HTMLElement | undefined`.
	if (!first || !last) {
		return null;
	}

	const current = container.ownerDocument.activeElement;
	if (!(current instanceof HTMLElement) || !container.contains(current)) {
		return null;
	}
	const index = all.indexOf(current);

	// The focused element can be absent from `all` when it is non-tabbable or
	// excluded by the filter. Find the first focusable element that follows it in
	// the DOM, which identifies the nearest focusable destination in either direction.
	if (index === -1) {
		const followingIndex = all.findIndex((element) =>
			Boolean(current.compareDocumentPosition(element) & current.DOCUMENT_POSITION_FOLLOWING),
		);

		if (direction === 'forwards') {
			// If nothing follows the current element, then wrap to the start.
			return all[followingIndex] ?? first;
		}

		// The closest preceding element is immediately before the first following one.
		// A missing adjacent entry means the backward sequence wraps to the end.
		return all[followingIndex - 1] ?? last;
	}

	// The current element is tabbable, so use its adjacent list entry and wrap
	// when it is already at the boundary.
	if (direction === 'forwards') {
		return all[index + 1] ?? first;
	}

	return all[index - 1] ?? last;
}
