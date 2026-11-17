import { getFocusables } from './get-focusables';
import type { TFocusableFilter } from './types';

/**
 * Returns the last focusable element in `container`, in Tab order, or `null`
 * when there is none.
 *
 * Elements that Tab skips (`tabindex="-1"`), disabled, hidden and `inert`
 * elements do not count. See `getFocusables` for how nested layers count. Use
 * `filter` to exclude more elements.
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
