/**
 * Walks a DOM tree up to the provided `stopElement`, or if falsy before.
 * @param element
 * @param stopElement
 */
export function walkUpTreeUntil(
	element: HTMLElement,
	shouldStop: (element: HTMLElement) => boolean,
): HTMLElement {
	let rootElement = element;
	while (rootElement && rootElement.parentElement && !shouldStop(rootElement)) {
		rootElement = rootElement.parentElement;
	}

	return rootElement;
}
