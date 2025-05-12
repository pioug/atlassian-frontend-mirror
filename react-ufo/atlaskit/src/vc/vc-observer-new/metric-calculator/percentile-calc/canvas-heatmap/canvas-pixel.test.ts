import { fg } from '@atlaskit/platform-feature-flags';

import { calculateDrawnPixelsRaw, getRGBComponents, ViewportCanvas } from './canvas-pixel';

jest.mock('../../utils/task-yield', () => {
	return jest.fn(() => Promise.resolve());
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

// Mock canvas and context
const mockGetContext = jest.fn();
const mockClearRect = jest.fn();
const mockFillRect = jest.fn();
const mockScale = jest.fn();
const mockGetImageData = jest.fn();

// Mock OffscreenCanvas
class MockOffscreenCanvas {
	width: number = 0;
	height: number = 0;
	getContext = mockGetContext;
}

const mockOffscreenCanvas = jest.fn().mockImplementation(() => {
	return new MockOffscreenCanvas();
});

// Mock HTMLCanvasElement
class MockHTMLCanvasElement {
	width: number = 0;
	height: number = 0;
	getContext = mockGetContext;
}

// Mock OffscreenCanvasRenderingContext2D and CanvasRenderingContext2D
const mockContext = {
	clearRect: mockClearRect,
	fillRect: mockFillRect,
	scale: mockScale,
	getImageData: mockGetImageData,
	globalCompositeOperation: 'source-over',
	imageSmoothingEnabled: true, // Default to true
};

// Mock document.createElement for HTMLCanvasElement
const mockCreateElement = jest.fn().mockImplementation(() => {
	return new MockHTMLCanvasElement();
});

// Mock document
if (!global.document) {
	global.document = {} as any;
}
global.document.createElement = mockCreateElement;

describe('ViewportCanvas', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
		mockGetContext.mockReturnValue(mockContext);
		(fg as jest.Mock).mockReturnValue(false); // Default to feature flag disabled
		mockContext.imageSmoothingEnabled = true; // Reset to default
	});

	describe('when OffscreenCanvas is available', () => {
		beforeEach(() => {
			// Ensure OffscreenCanvas is defined
			(global as any).OffscreenCanvas = mockOffscreenCanvas;
		});

		test('should create instance with OffscreenCanvas and disable image smoothing when feature flag is enabled', () => {
			(fg as jest.Mock).mockReturnValue(true);
			const viewport = { width: 200, height: 150 };
			const scaleFactor = 0.5;
			const canvas = new ViewportCanvas(viewport, scaleFactor);

			expect(mockOffscreenCanvas).toHaveBeenCalled();
			expect(mockCreateElement).not.toHaveBeenCalled();
			expect(mockContext.imageSmoothingEnabled).toBe(false);

			const scaledDimensions = canvas.getScaledDimensions();
			expect(scaledDimensions.width).toBe(Math.ceil(viewport.width * scaleFactor));
			expect(scaledDimensions.height).toBe(Math.ceil(viewport.height * scaleFactor));
		});

		test('should create instance with HTMLCanvasElement and keep image smoothing enabled when feature flag is disabled', () => {
			(fg as jest.Mock).mockReturnValue(false);
			const viewport = { width: 200, height: 150 };
			const scaleFactor = 0.5;
			const canvas = new ViewportCanvas(viewport, scaleFactor);

			expect(mockCreateElement).toHaveBeenCalledWith('canvas');
			expect(mockCreateElement).toHaveBeenCalledTimes(1);
			expect(mockContext.imageSmoothingEnabled).toBe(true);

			const scaledDimensions = canvas.getScaledDimensions();
			expect(scaledDimensions.width).toBe(Math.ceil(viewport.width * scaleFactor));
			expect(scaledDimensions.height).toBe(Math.ceil(viewport.height * scaleFactor));
		});

		test('should fallback to HTMLCanvasElement when feature flag is disabled', () => {
			(fg as jest.Mock).mockReturnValue(false);
			const viewport = { width: 200, height: 150 };
			const scaleFactor = 0.5;
			const canvas = new ViewportCanvas(viewport, scaleFactor);

			expect(mockCreateElement).toHaveBeenCalledWith('canvas');
			expect(mockCreateElement).toHaveBeenCalledTimes(1);

			const scaledDimensions = canvas.getScaledDimensions();
			expect(scaledDimensions.width).toBe(Math.ceil(viewport.width * scaleFactor));
			expect(scaledDimensions.height).toBe(Math.ceil(viewport.height * scaleFactor));
		});
	});

	describe('when OffscreenCanvas is not available', () => {
		beforeEach(() => {
			// Remove OffscreenCanvas
			delete (global as any).OffscreenCanvas;
			// Reset mockCreateElement to ensure it's called
			mockCreateElement.mockClear();
		});

		test('should fallback to HTMLCanvasElement', () => {
			const viewport = { width: 200, height: 150 };
			const scaleFactor = 0.5;
			const canvas = new ViewportCanvas(viewport, scaleFactor);

			expect(mockCreateElement).toHaveBeenCalledWith('canvas');
			expect(mockCreateElement).toHaveBeenCalledTimes(1);

			const scaledDimensions = canvas.getScaledDimensions();
			expect(scaledDimensions.width).toBe(Math.ceil(viewport.width * scaleFactor));
			expect(scaledDimensions.height).toBe(Math.ceil(viewport.height * scaleFactor));
		});
	});

	test('should throw error when canvas context is not available', () => {
		// Ensure OffscreenCanvas is available but context is null
		(global as any).OffscreenCanvas = mockOffscreenCanvas;
		mockGetContext.mockReturnValue(null);

		expect(() => {
			new ViewportCanvas({ width: 100, height: 100 });
		}).toThrow('Could not get canvas context');
	});

	describe('when viewport is zero', () => {
		test('should always return at least 1 px of width and height', () => {
			const viewport = { width: 0, height: 0 };
			const scaleFactor = 0.25;
			const canvas = new ViewportCanvas(viewport, scaleFactor);

			const scaledDimensions = canvas.getScaledDimensions();
			expect(scaledDimensions.width).toBe(1);
			expect(scaledDimensions.height).toBe(1);
		});
	});
});

// getRGBComponents tests remain the same
describe('getRGBComponents', () => {
	test('should convert a number into a RGB', () => {
		expect(getRGBComponents(0)).toBe('rgb(0, 0, 0)');
		expect(getRGBComponents(1)).toBe('rgb(0, 0, 1)');
		expect(getRGBComponents(255)).toBe('rgb(0, 0, 255)');
		expect(getRGBComponents(256)).toBe('rgb(0, 1, 0)');
	});

	test('should throw an error for invalid input', () => {
		expect(() => getRGBComponents(-1)).toThrow(
			'Input number must be between 0 and 16777215 (inclusive).',
		);
		expect(() => getRGBComponents(0x1000000)).toThrow(
			'Input number must be between 0 and 16777215 (inclusive).',
		);
	});
});

describe('calculateDrawnPixelsRaw', () => {
	test('should calculate pixel counts correctly', async () => {
		const width = 2;
		const height = 2;
		const imageData = new ImageData(width, height);

		const data = new Uint8ClampedArray(imageData.data.buffer);

		const color1 = [0, 0, 1, 255];
		const color2 = [0, 0, 2, 255];

		data.set([...color1, ...color2, ...color1, ...color2]);

		const arraySize = 2; // three posible colors
		const scaleFactor = 1;
		const pixelCounts = await calculateDrawnPixelsRaw(imageData, scaleFactor, arraySize);

		expect(pixelCounts).toHaveLength(2);
		expect(pixelCounts[0]).toBe(2);
		expect(pixelCounts[1]).toBe(2);
	});
});
