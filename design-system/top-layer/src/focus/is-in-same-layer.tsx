const topLayerSelector = '[popover], dialog, [role="dialog"], [role="alertdialog"]';

/**
 * Returns true when `element` and `container` resolve to the same nearest
 * top-layer host (or both resolve to `null`, meaning the document layer).
 */
export function isInSameLayer({
	element,
	container,
}: {
	element: HTMLElement;
	container: HTMLElement;
}): boolean {
	const elementLayer = element.closest(topLayerSelector);
	const containerLayer = container.closest(topLayerSelector);
	// Both elements are in the "document" layer
	if (!elementLayer && !containerLayer) {
		return true;
	}
	return elementLayer === containerLayer;
}
