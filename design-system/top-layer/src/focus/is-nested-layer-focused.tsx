import { getClosestLayer } from './get-closest-layer';

/**
 * Returns `true` when `document.activeElement` is inside a nested top-layer
 * descendant of `container` (a `[popover]` or `<dialog>` that is itself a
 * descendant of `container`).
 */
export function isNestedLayerFocused({ container }: { container: HTMLElement }): boolean {
	const focused = container.ownerDocument.activeElement;

	if (!(focused instanceof HTMLElement)) {
		return false;
	}

	// Cannot be in a nested layer if it is not in the container
	if (!container.contains(focused)) {
		return false;
	}

	// If not in the same layer, must be in a nested layer
	return getClosestLayer({ element: focused }) !== getClosestLayer({ element: container });
}
