const getCursorHeightFrom = (node: HTMLElement) =>
  parseFloat(window.getComputedStyle(node, undefined).lineHeight || '');
export const getOffsetParent = (
  editorViewDom: HTMLElement,
  popupsMountPoint?: HTMLElement,
): HTMLElement =>
  popupsMountPoint
    ? (popupsMountPoint.offsetParent as HTMLElement)
    : (editorViewDom.offsetParent as HTMLElement);
export const getNearestNonTextNode = (node: Node) =>
  node.nodeType === Node.TEXT_NODE
    ? (node.parentNode as HTMLElement)
    : (node as HTMLElement);

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
  coordinates: { top: number; left: number; bottom: number; right: number },
  offsetParent: HTMLElement,
  cursorHeight: number,
) => {
  const {
    left: offsetParentLeft,
    top: offsetParentTop,
    height: offsetParentHeight,
  } = offsetParent.getBoundingClientRect();

  return {
    left: coordinates.left - offsetParentLeft,
    right: coordinates.right - offsetParentLeft,
    top:
      coordinates.top -
      (offsetParentTop - cursorHeight) +
      offsetParent.scrollTop,
    bottom:
      offsetParentHeight -
      (coordinates.top -
        (offsetParentTop - cursorHeight) -
        offsetParent.scrollTop),
  };
};

export const handlePositionCalculatedWith = (
  offsetParent: HTMLElement,
  node: Node,
  getCurrentFixedCoordinates: () => any,
) => (position: {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}) => {
  if (!offsetParent) {
    return position;
  }

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
