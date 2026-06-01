import { isInSameLayer } from './is-in-same-layer';
import { selectors } from './selectors';
import type { TFocusableFilter } from './types';

/**
 * Returns all focusable HTMLElements within the container, optionally filtered.
 *
 * Focusables that belong to a nested top-layer scope (a `[popover]` or
 * `<dialog>` descendant of the container) are excluded - those elements
 * are owned by the inner layer's focus management. The container itself
 * is allowed to be a popover/dialog; only nested ones are filtered.
 */
export function getFocusables({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement[] {
	return Array.from(container.querySelectorAll(selectors.focusable))
		.filter((element): element is HTMLElement => element instanceof HTMLElement)
		.filter((element) => isInSameLayer({ element, container }))
		.filter((element) => !filter || filter(element, container));
}
