export function calculateOffsetLeft(
	insideInlineLike: boolean,
	insideLayout: boolean,
	pmViewDom: Element,
	wrapper?: HTMLElement,
): number {
	let offsetLeft = 0;
	if (wrapper && insideInlineLike && !insideLayout) {
		const currentNode: HTMLElement = wrapper;
		const boundingRect = currentNode.getBoundingClientRect();
		offsetLeft = boundingRect.left - pmViewDom.getBoundingClientRect().left;
	}
	return offsetLeft;
}
