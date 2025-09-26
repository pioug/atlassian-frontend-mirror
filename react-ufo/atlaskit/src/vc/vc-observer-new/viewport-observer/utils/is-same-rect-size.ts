const SIZE_CHECK_TOLERANCE_MARGIN_IN_PX = 1;

export function isSameRectSize(a: DOMRect | null | undefined, b: DOMRect | null | undefined) {
	if (!a || !b) {
		return false;
	}

	return (
		Math.abs(a.width - b.width) <= SIZE_CHECK_TOLERANCE_MARGIN_IN_PX &&
		Math.abs(a.height - b.height) <= SIZE_CHECK_TOLERANCE_MARGIN_IN_PX
	);
}
