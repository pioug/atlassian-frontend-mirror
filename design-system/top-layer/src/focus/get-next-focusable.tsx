import { getFocusables } from './get-focusables';
import type { TFocusableFilter } from './types';

/**
 * Returns the focusable element after (`'forwards'`) or before
 * (`'backwards'`) the focused element in `container`. Wraps around at both
 * ends.
 *
 * The focused element does not need to be tabbable. For example, it can have
 * `tabindex="-1"` and have taken focus from a click or from script. Navigation
 * then starts from its position in the DOM, so focus does not get stuck on it.
 * Elements with `tabindex="-1"` are never returned.
 *
 * Returns `null` when focus is not inside `container`, or when `container` has
 * no focusable elements.
 */
export function getNextFocusable({
	container,
	direction,
	filter,
}: {
	container: HTMLElement;
	direction: 'forwards' | 'backwards';
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const focusables = getFocusables({ container, filter });
	const first = focusables[0];
	const last = focusables[focusables.length - 1];

	// `container` has no focusable elements.
	if (!first || !last) {
		return null;
	}

	const focusedElement = container.ownerDocument.activeElement;
	if (!(focusedElement instanceof HTMLElement) || !container.contains(focusedElement)) {
		return null;
	}
	const focusedIndex = focusables.indexOf(focusedElement);

	// The focused element is not in `focusables` when it is not tabbable, or
	// when `filter` excludes it. Find the first focusable element after it in
	// the DOM. That element, and the one before it in `focusables`, are the
	// closest focusable elements in each direction.
	if (focusedIndex === -1) {
		const followingIndex = focusables.findIndex((element) =>
			Boolean(
				focusedElement.compareDocumentPosition(element) &
				focusedElement.DOCUMENT_POSITION_FOLLOWING,
			),
		);

		if (direction === 'forwards') {
			// If nothing follows the focused element, wrap to the start.
			return focusables[followingIndex] ?? first;
		}

		// Use `last` when there is no entry before the following element. Either
		// nothing precedes the focused element (wrap to the end), or nothing
		// follows it (`last` is the closest preceding element).
		return focusables[followingIndex - 1] ?? last;
	}

	// The focused element is in `focusables`, so use the adjacent entry. Wrap
	// when the focused element is at either end.
	if (direction === 'forwards') {
		return focusables[focusedIndex + 1] ?? first;
	}

	return focusables[focusedIndex - 1] ?? last;
}
