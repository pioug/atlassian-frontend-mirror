// TODO: Remove this cache when analysis is complete - it is used to track whether direct children elements will be ignored by the observer
export const checkedChildrenCache: WeakMap<HTMLElement, boolean> = new WeakMap();
let checkedInvalidChildrenCount: number = 0;

export function incrementCheckedInvalidChildrenCount() {
	checkedInvalidChildrenCount++;
}

export function getInvalidChildrenCount() {
	return checkedInvalidChildrenCount;
}

export default function checkCssProperty(element: HTMLElement): Element[] {
	const computedStyle = window.getComputedStyle(element);
	if (computedStyle.display === 'contents') {
		// If display is 'contents', we return the direct children of the element
		const result: HTMLElement[] = [];
		for (const child of element.children) {
			if (child instanceof HTMLElement) {
				if (!checkedChildrenCache.has(child)) {
					// TODO: Remove this cache when analysis is complete
					checkedChildrenCache.set(child, false);
				}
				result.push(child);
			}
		}
		return result;
	}
	return [element];
}
