/**
 * Reduces the given CSS width value to the next lowest even pixel value if the value is in px.
 * This is to mitigate subpixel rendering issues of embedded smart links.
 *
 * @param widthValue CSS width value to be rounded
 * @returns Reduced CSS width value where px value given, or otherwise the original value
 * @example
 */
// widthValue could be a string in px, rem or percentage, e.g. "800px", "100%", etc.
export function roundToClosestEvenPxValue(widthValue: string): string {
	try {
		if (widthValue.endsWith('px')) {
			const pxWidth = parseInt(widthValue.slice(0, -2));

			return `${pxWidth - (pxWidth % 2)}px`;
		}

		return widthValue;
	} catch {
		return widthValue;
	}
}
