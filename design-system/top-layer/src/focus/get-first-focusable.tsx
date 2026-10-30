import { getFocusables } from './get-focusables';
import type { TFocusableFilter } from './types';

/**
 * Returns the first focusable element in `container`, or `null` when there is
 * none.
 *
 * Elements that Tab skips (`tabindex="-1"`), disabled, hidden and `inert`
 * elements, and elements in a nested `[popover]` or `<dialog>`, do not count.
 * Use `filter` to exclude more elements.
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
