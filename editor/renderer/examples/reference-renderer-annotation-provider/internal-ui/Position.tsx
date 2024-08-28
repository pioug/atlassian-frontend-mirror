/**
 * @jsxRuntime classic
 * @jsx jsx
 */

export const usePosition = ({
	range,
	portalContainer,
}: {
	portalContainer: Element;
	range: Range;
}) => {
	// Note: This does not update on range changes
	// Adding an effect to update on range changes means when creating a draft
	// the position will end up invalid (as the draftRange is not updated after wrapping in HTML)
	const position = getPosition(range, portalContainer);
	return position;
};

const getPosition = (range: Range, portalContainer: Element) => {
	const contentRect = getParentNode(range.commonAncestorContainer)!.getBoundingClientRect();

	const portalRect = portalContainer.getBoundingClientRect() || {
		left: 0,
		top: 0,
	};

	const rect = range!.getBoundingClientRect();

	const { left: leftRect, top: topRect, width } = rect;

	// Popup can't be rendered outside the body area
	let leftLimit = contentRect.left;
	let rightLimit = contentRect.right;

	// If the selected text has a parent that is scrollable for example like text inside table.
	// The popup is limited to be shown within the scrollable area.
	const firstParentThatCanScroll = getScrollParent(range.startContainer);
	if (firstParentThatCanScroll) {
		const scrollParentRect = firstParentThatCanScroll.getBoundingClientRect();
		leftLimit = Math.max(leftLimit, scrollParentRect.left);
		rightLimit = Math.min(rightLimit, scrollParentRect.right);
	}

	let x = width / 2 + leftRect;
	x = Math.max(leftLimit, Math.min(rightLimit, x));

	return {
		left: x - portalRect.left,
		top: topRect - portalRect.top,
	};
};

function getParentNode(node: any): HTMLElement | null {
	if (!node) {
		return null;
	}

	if (node.nodeType !== Node.TEXT_NODE) {
		return node;
	} else {
		return getParentNode(node.parentNode);
	}
}

function getScrollParent(node: any): any {
	if (!node) {
		return null;
	}

	if (node.nodeType !== Node.TEXT_NODE && node.scrollWidth > node.clientWidth) {
		return node;
	} else {
		return getScrollParent(node.parentNode);
	}
}
