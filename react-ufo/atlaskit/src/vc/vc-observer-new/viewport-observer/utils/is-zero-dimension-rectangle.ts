export function isZeroDimensionRectangle(rect: DOMRectReadOnly) {
	return (
		rect.bottom === 0 &&
		rect.top === 0 &&
		rect.left === 0 &&
		rect.right === 0 &&
		rect.x === 0 &&
		rect.y === 0 &&
		rect.width === 0 &&
		rect.height === 0
	);
}
