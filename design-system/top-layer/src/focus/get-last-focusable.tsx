import { getFocusables } from './get-focusables';
import type { TFocusableFilter } from './types';

/**
 * Returns the last focusable element within the container.
 */
export function getLastFocusable({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const items = getFocusables({ container, filter });
	return items.length > 0 ? items[items.length - 1] : null;
}
