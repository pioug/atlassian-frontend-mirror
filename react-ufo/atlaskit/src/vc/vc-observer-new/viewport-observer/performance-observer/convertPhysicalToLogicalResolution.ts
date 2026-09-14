// The LayoutShiftAttribution API is returning the numbers on physical dimension
export function convertPhysicalToLogicalResolution(rect: DOMRect): DOMRect {
	if (typeof window.devicePixelRatio !== 'number') {
		return rect;
	}

	if (window.devicePixelRatio === 1) {
		return rect;
	}

	// eslint-disable-next-line compat/compat
	return new DOMRect(
		rect.x / window.devicePixelRatio,
		rect.y / window.devicePixelRatio,
		rect.width / window.devicePixelRatio,
		rect.height / window.devicePixelRatio,
	);
}
