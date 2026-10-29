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
	const containing = layers.filter((layer) => layer !== element && layer.contains(element));
	return (
		containing.find(
			(layer) => !containing.some((other) => other !== layer && layer.contains(other)),
		) ?? null
	);
}
