import { type FocusEvent } from 'react';

/**
 * Returns `true` only for *keyboard* focus entering an element from outside it.
 *
 * `onFocus` alone is unsuitable because:
 * 1. It bubbles (native `focusin`), firing on internal focus moves. We ignore these via
 *    `relatedTarget` when it's contained by the current target.
 * 2. Clicking an interactive descendant also focuses it, duplicating pointer events. We use
 *    `:focus-visible` to keep pointer behaviour unchanged.
 */
export const isKeyboardFocusEnteringElement = (event: FocusEvent<HTMLElement>): boolean => {
	// Ignore focus moving between elements inside the same element.
	if (event.currentTarget.contains(event.relatedTarget)) {
		return false;
	}

	try {
		if (!event.target.matches(':focus-visible')) {
			return false;
		}
	} catch {
		// Ignore errors from environments that don't support :focus-visible.
	}

	return true;
};
