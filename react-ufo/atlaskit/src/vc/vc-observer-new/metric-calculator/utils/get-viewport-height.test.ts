import getViewportHeight from './get-viewport-height';

describe('getViewportHeight', () => {
	beforeEach(() => {
		// Reset the mock implementations before each test
		jest.clearAllMocks();
	});

	it('should return the clientHeight when it is greater than window.innerHeight', () => {
		const mockDocument = {
			documentElement: {
				clientHeight: 800,
			},
		};

		// Mock the window object
		Object.defineProperty(window, 'innerHeight', {
			value: 600,
			writable: true,
		});

		expect(getViewportHeight(mockDocument as any)).toBe(800);
	});

	it('should return window.innerHeight when it is greater than clientHeight', () => {
		const mockDocument = {
			documentElement: {
				clientHeight: 500,
			},
		};

		// Mock the window object
		Object.defineProperty(window, 'innerHeight', {
			value: 700,
			writable: true,
		});

		expect(getViewportHeight(mockDocument as any)).toBe(700);
	});

	it('should return 0 if an error occurs and both clientHeight and innerHeight are 0', () => {
		const mockDocument = {
			documentElement: {
				// Simulate an error
				get clientHeight() {
					throw new Error('Access error');
				},
			},
		};

		// Mock the window object
		Object.defineProperty(window, 'innerHeight', {
			value: 0,
			writable: true,
		});

		expect(getViewportHeight(mockDocument as any)).toBe(0);
	});
});
