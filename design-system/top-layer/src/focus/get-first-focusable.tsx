import { getFocusables } from './get-focusables';
import type { TFocusableFilter } from './types';

/**
 * Returns the first focusable element within the container.
 */
export function getFirstFocusable({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const items = getFocusables({ container, filter });
	return items.length > 0 ? items[0] : null;
}
