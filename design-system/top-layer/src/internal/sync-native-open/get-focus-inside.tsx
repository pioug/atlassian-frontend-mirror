export function getFocusInside({ element }: { element: HTMLElement }): HTMLElement | null {
	const { activeElement } = element.ownerDocument;
	if (activeElement instanceof HTMLElement && element.contains(activeElement)) {
		return activeElement;
	}
	return null;
}
