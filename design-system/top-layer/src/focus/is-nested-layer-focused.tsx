import { getNestedLayers } from './get-nested-layers';

/**
 * Returns `true` when the focused element is in a nested layer: a `[popover]`
 * or `<dialog>` inside `container`. `layerFilter` limits which layers count.
 */
export function isNestedLayerFocused({
	container,
	layerFilter,
}: {
	container: HTMLElement;
	layerFilter?: (layer: Element) => boolean;
}): boolean {
	const focusedElement = container.ownerDocument.activeElement;

	if (!(focusedElement instanceof HTMLElement)) {
		return false;
	}

	return getNestedLayers({ container }).some(
		(layer) => layer.contains(focusedElement) && (!layerFilter || layerFilter(layer)),
	);
}
