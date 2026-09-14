import taskYield from '../../utils/task-yield';

/**
 * Calculates the number of pixels drawn for each color in the image data.
 * @param imageData - The image data to analyze.
 * @param scaleFactor - The scale factor applied to the canvas.
 * @param arraySize - The amount of timestamps that were drawn in the viewport
 * @returns A Map containing color to pixel count mappings.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export async function calculateDrawnPixelsRaw(
	imageData: ImageData,
	_: number,
	arraySize: number,
): Promise<Uint32Array> {
	const data = imageData.data;
	const arr = new Uint32Array(arraySize);

	for (let i = 0; i < data.length; i += 4) {
		// Check alpha
		if (data[i + 3] !== 0) {
			// Combine RGB components into a single 24-bit color value:
			// (data[i] << 16)   - Shift red component left 16 bits   (bits 16-23)
			// (data[i + 1] << 8) - Shift green component left 8 bits (bits 8-15)
			// data[i + 2]       - Blue component stays as is         (bits 0-7)
			// The | operator combines all bits together
			const color = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
			const colorIndex = color - 1;
			arr[colorIndex] = (arr[colorIndex] || 0) + 1;
		}

		if (i % 10000 === 0) {
			await taskYield();
		}
	}

	return arr;
}
