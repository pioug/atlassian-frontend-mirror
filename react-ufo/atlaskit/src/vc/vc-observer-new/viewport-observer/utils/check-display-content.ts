export default function checkCssProperty(element: HTMLElement): Element[] {
	const computedStyle = window.getComputedStyle(element);
	if (computedStyle.display === 'contents') {
		// If display is 'contents', we return the direct children of the element
		const result: HTMLElement[] = [];
		for (const child of element.children) {
			if (child instanceof HTMLElement) {
				result.push(child);
			}
		}
		return result;
	}
	return [element];
}
