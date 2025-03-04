import { calculateDrawnPixelsRaw, getRGBComponents, ViewportCanvas } from './canvas-pixel';

jest.mock('../../utils/task-yield', () => {
	return jest.fn(() => Promise.resolve());
});

// Mock canvas and context
const mockGetContext = jest.fn();
const mockClearRect = jest.fn();
const mockFillRect = jest.fn();
const mockScale = jest.fn();
const mockGetImageData = jest.fn();

// Mock canvas element
class MockCanvas {
	width: number = 0;
	height: number = 0;
	getContext = mockGetContext;
}

// Mock context
const mockContext = {
	clearRect: mockClearRect,
	fillRect: mockFillRect,
	scale: mockScale,
	getImageData: mockGetImageData,
};

// Mock document.createElement
document.createElement = jest.fn().mockImplementation((tagName) => {
	if (tagName === 'canvas') {
		return new MockCanvas();
	}
	return null;
});

describe('ViewportCanvas', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
		mockGetContext.mockReturnValue(mockContext);
	});

	test('should create instance with correct dimensions', () => {
		const viewport = { width: 200, height: 150 };
		const scaleFactor = 0.5;
		const canvas = new ViewportCanvas(viewport, scaleFactor);

		// Access private properties for testing (using any type assertion)
		const scaledDimensions = canvas.getScaledDimensions();
		expect(scaledDimensions.width).toBe(Math.ceil(viewport.width * scaleFactor));
		expect(scaledDimensions.height).toBe(Math.ceil(viewport.height * scaleFactor));
	});

	test('should throw error when canvas context is not available', () => {
		mockGetContext.mockReturnValue(null);

		expect(() => {
			new ViewportCanvas({ width: 100, height: 100 });
		}).toThrow('Could not get canvas context');
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
