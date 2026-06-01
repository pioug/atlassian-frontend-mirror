import { getDocument } from '@atlaskit/browser-apis';

import { isInSameLayer } from './is-in-same-layer';

/**
 * Returns `true` when `document.activeElement` is inside a nested top-layer
 * descendant of `container` (a `[popover]`, `<dialog>`, `[role="dialog"]` or
 * `[role="alertdialog"]` that is itself a descendant of `container`).
 */
export function isNestedLayerFocused({ container }: { container: HTMLElement }): boolean {
	const focused = getDocument()?.activeElement;

	if (!(focused instanceof HTMLElement)) {
		return false;
	}

	// Cannot be in a nested layer if it is not in the container
	if (!container.contains(focused)) {
		return false;
	}

	// If not in the same layer, must be in a nested layer
	return !isInSameLayer({ element: focused, container });
}
