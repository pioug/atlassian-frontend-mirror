import taskYield from '../../utils/task-yield';

type RGBColor = `rgb(${number}, ${number}, ${number})`; // 24-bit color value
type Viewport = {
	width: number;
	height: number;
};

type CanvasType = OffscreenCanvas | HTMLCanvasElement;
type CanvasContextType = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

/**
 * Class responsible for managing a scaled canvas and tracking pixel drawing operations.
 * It uses either an OffscreenCanvas (if available) or a regular HTML Canvas for better performance
 * and maintains a mapping between colors and timestamps for pixel counting purposes.
 */
export class ViewportCanvas {
	/** The underlying Canvas instance (either OffscreenCanvas or HTMLCanvasElement) */
	private readonly canvas: CanvasType;

	/** The 2D rendering context of the canvas */
	private readonly ctx: CanvasContextType;

	/** Scale factor applied to the canvas (affects final pixel counts) */
	private readonly scaleFactor: number;

	/** Maps unique colors to their corresponding timestamps */
	private readonly colorTimeMap: Map<RGBColor, DOMHighResTimeStamp>;

	/** Counter used to generate unique colors */
	private colorCounter: number;

	private scaledWidth: number;
	private scaledHeight: number;

	private scaleX: number;
	private scaleY: number;

	/**
	 * Creates a new ViewportCanvas instance.
	 * @param viewport - The dimensions of the viewport
	 * @param scaleFactor - Scale factor to apply to the canvas (default: 0.5)
	 * @throws {Error} If canvas context cannot be obtained
	 */
	constructor(viewport: Viewport, scaleFactor: number = 1) {
		this.scaleFactor = scaleFactor;
		this.colorCounter = 1;
		this.colorTimeMap = new Map();

		const safeViewportWidth = Math.max(viewport.width, 1);
		const safeViewportHeight = Math.max(viewport.height, 1);

		// Calculate scaled dimensions
		this.scaledWidth = Math.max(Math.ceil(safeViewportWidth * scaleFactor), 1);
		this.scaledHeight = Math.max(Math.ceil(safeViewportHeight * scaleFactor), 1);

		this.scaleX = this.scaledWidth / safeViewportWidth;
		this.scaleY = this.scaledHeight / safeViewportHeight;

		// Initialize canvas with scaled dimensions
		this.canvas = this.createCanvas(this.scaledWidth, this.scaledHeight);

		const ctx = this.canvas.getContext('2d', {
			alpha: false, // Disable alpha channel for better performance
			willReadFrequently: true, // Optimize for frequent pixel reading
			colorSpace: 'srgb', // Use standard RGB color space
		}) as CanvasContextType | null;

		if (!ctx) {
			throw new Error('Could not get canvas context');
		}

		this.ctx = ctx;
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.imageSmoothingEnabled = false; // Disable image smoothing for better performance

		this.clear();
	}

	/**
	 * Creates a canvas instance, falling back to HTMLCanvasElement if OffscreenCanvas is not available
	 */
	private createCanvas(width: number, height: number): CanvasType {
		if (typeof OffscreenCanvas !== 'undefined') {
			return new OffscreenCanvas(width, height);
		}
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}

	public getScaledDimensions() {
		return {
			width: this.scaledWidth,
			height: this.scaledHeight,
		};
	}

	/**
	 * Clears the entire canvas by removing all drawn content.
	 * @private
	 */
	private clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Generates a unique RGB color from an incrementing counter.
	 * Uses a 24-bit color space (16,777,216 possible colors).
	 *
	 * @private
	 * @returns A unique RGB color string
	 *
	 * @example
	 * // Example bit operations for color 0x00FF8040:
	 * // Red:   (0x00FF8040 >> 16) & 0xFF = 0xFF = 255
	 * // Green: (0x00FF8040 >> 8) & 0xFF  = 0x80 = 128
	 * // Blue:   0x00FF8040 & 0xFF        = 0x40 = 64
	 */
	private generateColor(): RGBColor {
		// Wrap around at 16,777,215 (0x00FFFFFF) to stay within 24-bit color space
		const rgbColor = this.colorCounter++ % 0x00ffffff;

		return getRGBComponents(rgbColor);
	}

	/**
	 * Draws a rectangle on the canvas with a unique color and associates it with a timestamp.
	 * Each drawn rectangle gets a unique color which is mapped to the provided timestamp.
	 *
	 * @param rect - The rectangle dimensions to draw
	 * @param timestamp - The timestamp to associate with this drawing operation
	 */
	public drawRect(rect: DOMRect, timestamp: DOMHighResTimeStamp): void {
		const color = this.generateColor();
		this.colorTimeMap.set(color, timestamp);

		this.ctx.fillStyle = color;

		if (this.scaleFactor === 1) {
			return this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
		const scaledX = rect.x * this.scaleX;
		const scaledY = rect.y * this.scaleY;
		const scaledWidth = rect.width * this.scaleX;
		const scaledHeight = rect.height * this.scaleY;

		this.ctx.fillRect(
			Math.floor(scaledX),
			Math.ceil(scaledY),
			Math.max(scaledWidth, 1),
			Math.max(scaledHeight, 1),
		);
	}

	/**
	 * Calculates the number of pixels drawn for each timestamp.
	 * This method:
	 * 1. Reads the pixel data from the canvas
	 * 2. Counts pixels of each unique color
	 * 3. Maps colors back to their timestamps
	 * 4. Adjusts counts based on the scale factor
	 *
	 * @returns A Map containing timestamp to pixel count mappings
	 */
	public async getPixelCounts(): Promise<Map<DOMHighResTimeStamp, number>> {
		const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		const timestampsAmount = this.colorTimeMap.size;
		const pixelCounts = await calculateDrawnPixelsRaw(
			imageData,
			this.scaleFactor,
			timestampsAmount,
		);
		// Convert color counts to timestamp counts
		const timePixelCounts = new Map<DOMHighResTimeStamp, number>();

		for (let i = 0; i < pixelCounts.length; i++) {
			const count = pixelCounts[i];

			if (typeof count !== 'number') {
				continue;
			}

			const color = i + 1;
			const rgbColor = getRGBComponents(color);

			const timestamp = this.colorTimeMap.get(rgbColor);
			if (timestamp !== undefined) {
				timePixelCounts.set(timestamp, (timePixelCounts.get(timestamp) || 0) + count);
			}
		}

		return timePixelCounts;
	}
}

/**
 * Converts a number into RGB components in such a way that they can be recombined
 * to form the original number using bitwise operations.
 * @param number - The input number to be split into RGB components.
 * @returns The RGB color string in the format "rgb(r, g, b)".
 */
export function getRGBComponents(n: number): RGBColor {
	// Ensure the input is within the valid range for a 24-bit color
	if (n < 0 || n > 0xffffff) {
		throw new Error('Input number must be between 0 and 16777215 (inclusive).');
	}

	// Extract blue component (bits 0-7)
	const blue = n & 0xff;

	// Extract green component (bits 8-15)
	const green = (n >> 8) & 0xff;

	// Extract red component (bits 16-23)
	const red = (n >> 16) & 0xff;

	return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Calculates the number of pixels drawn for each color in the image data.
 * @param imageData - The image data to analyze.
 * @param scaleFactor - The scale factor applied to the canvas.
 * @param arraySize - The amount of timestamps that were drawn in the viewport
 * @returns A Map containing color to pixel count mappings.
 */
export async function calculateDrawnPixelsRaw(
	imageData: ImageData,
	scaleFactor: number,
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
