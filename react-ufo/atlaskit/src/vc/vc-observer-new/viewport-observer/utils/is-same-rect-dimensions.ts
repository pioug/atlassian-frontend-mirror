const DIMENSIONS_CHECK_TOLERANCE_MARGIN_IN_PX = 1;

export function isSameRectDimensions(a: DOMRect | null | undefined, b: DOMRect | null | undefined) {
	if (!a || !b) {
		return false;
	}

	return (
		Math.abs(a.width - b.width) <= DIMENSIONS_CHECK_TOLERANCE_MARGIN_IN_PX &&
		Math.abs(a.height - b.height) <= DIMENSIONS_CHECK_TOLERANCE_MARGIN_IN_PX &&
		Math.abs(a.x - b.x) <= DIMENSIONS_CHECK_TOLERANCE_MARGIN_IN_PX &&
		Math.abs(a.y - b.y) <= DIMENSIONS_CHECK_TOLERANCE_MARGIN_IN_PX
	);
}
