const getCursorHeightFrom = (node: HTMLElement) =>
	parseFloat(window.getComputedStyle(node, undefined).lineHeight || '');
export const getOffsetParent = (
	editorViewDom: HTMLElement,
	popupsMountPoint?: HTMLElement,
): HTMLElement =>
	popupsMountPoint
		? // Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(popupsMountPoint.offsetParent as HTMLElement)
		: // Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(editorViewDom.offsetParent as HTMLElement);
export const getNearestNonTextNode = (node: Node) =>
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	node.nodeType === Node.TEXT_NODE ? (node.parentNode as HTMLElement) : (node as HTMLElement);

/**
 * We need to translate the co-ordinates because `coordsAtPos` returns co-ordinates
 * relative to `window`. And, also need to adjust the cursor container height.
 * (0, 0)
 * +--------------------- [window] ---------------------+
 * |   (left, top) +-------- [Offset Parent] --------+  |
 * | {coordsAtPos} | [Cursor]   <- cursorHeight      |  |
 * |               | [FloatingToolbar]               |  |
 */
const convertFixedCoordinatesToAbsolutePositioning = (
	coordinates: { bottom?: number; left?: number; right?: number; top?: number },
	offsetParent: HTMLElement,
	cursorHeight: number,
) => {
	const {
		left: offsetParentLeft,
		top: offsetParentTop,
		height: offsetParentHeight,
	} = offsetParent.getBoundingClientRect();

	return {
		left: (coordinates.left ?? 0) - offsetParentLeft,
		right: (coordinates.right ?? 0) - offsetParentLeft,
		top: (coordinates.top ?? 0) - (offsetParentTop - cursorHeight) + offsetParent.scrollTop,
		bottom:
			offsetParentHeight -
			((coordinates.top ?? 0) - (offsetParentTop - cursorHeight) - offsetParent.scrollTop),
	};
};

export const handlePositionCalculatedWith =
	(
		offsetParent: HTMLElement,
		node: Node,
		getCurrentFixedCoordinates: () => {
			bottom?: number;
			left?: number;
			right?: number;
			top?: number;
		},
	) =>
	(position: { bottom?: number; left?: number; right?: number; top?: number }) => {
		if (!offsetParent) {
			return position;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const target = getNearestNonTextNode(node)!;
		const cursorHeight = getCursorHeightFrom(target);
		const fixedCoordinates = getCurrentFixedCoordinates();

		const absoluteCoordinates = convertFixedCoordinatesToAbsolutePositioning(
			fixedCoordinates,
			offsetParent,
			cursorHeight,
		);
		return {
			left: position.left ? absoluteCoordinates.left : undefined,
			right: position.right ? absoluteCoordinates.right : undefined,
			top: position.top ? absoluteCoordinates.top : undefined,
			bottom: position.bottom ? absoluteCoordinates.bottom : undefined,
		};
	};
