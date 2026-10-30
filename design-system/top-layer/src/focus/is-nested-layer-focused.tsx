import { getClosestLayer } from './get-closest-layer';

/**
 * Returns `true` when the focused element is in a nested layer: a `[popover]`
 * or `<dialog>` inside `container`.
 */
export function isNestedLayerFocused({ container }: { container: HTMLElement }): boolean {
	const focusedElement = container.ownerDocument.activeElement;

	if (!(focusedElement instanceof HTMLElement)) {
		return false;
	}

	// Cannot be in a nested layer if it is not in the container
	if (!container.contains(focusedElement)) {
		return false;
	}

	// If not in the same layer, must be in a nested layer
	return getClosestLayer({ element: focusedElement }) !== getClosestLayer({ element: container });
}
