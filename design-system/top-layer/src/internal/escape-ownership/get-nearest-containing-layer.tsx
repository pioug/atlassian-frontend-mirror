/**
 * The deepest layer in `layers` that contains `element` (not `element` itself), or `null`.
 */
export function getNearestContainingLayer({
	element,
	layers,
}: {
	element: HTMLElement;
	layers: HTMLElement[];
}): HTMLElement | null {
	const containingLayers = layers.filter((layer) => layer !== element && layer.contains(element));
	// The deepest containing layer contains no other containing layer.
	return (
		containingLayers.find(
			(layer) =>
				!containingLayers.some((otherLayer) => otherLayer !== layer && layer.contains(otherLayer)),
		) ?? null
	);
}
