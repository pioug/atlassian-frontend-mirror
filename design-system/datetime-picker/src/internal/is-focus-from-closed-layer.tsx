function isLayerOpen({ layer }: { layer: Element }): boolean {
	if (layer instanceof HTMLDialogElement) {
		return layer.open;
	}
	// Some DOM implementations throw on `:popover-open`.
	try {
		return layer.matches(':popover-open');
	} catch {
		return false;
	}
}

/**
 * Whether focus comes from inside a layer (a `[popover]` or a `<dialog>`) that is closed: the layer
 * returns focus as it hides, for example a popup that the field opened. That is not the user
 * arriving at the field.
 */
export function isFocusFromClosedLayer({
	relatedTarget,
}: {
	relatedTarget: EventTarget | null;
}): boolean {
	if (!(relatedTarget instanceof Element)) {
		return false;
	}
	const layer = relatedTarget.closest('[popover], dialog');
	return layer !== null && !isLayerOpen({ layer });
}
