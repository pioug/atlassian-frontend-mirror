import { collectSSRPlaceholderDimensions } from './ssr-scripts/collectSSRPlaceholderDimensions';

import { SSRPlaceholderHandlers } from './index';

describe('SSR Placeholder Display Contents Fix', () => {
	let mockDocument: any;
	let mockWindow: any;

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock document with querySelector
		mockDocument = {
			querySelectorAll: jest.fn(),
			getElementById: jest.fn(),
		};

		// Mock window with global storage and getComputedStyle
		mockWindow = {
			__SSR_PLACEHOLDERS_DIMENSIONS__: {},
			getComputedStyle: jest.fn(),
		};

		// Mock DOMRect constructor
		(global as any).DOMRect = class MockDOMRect {
			x: number;
			y: number;
			width: number;
			height: number;
			left: number;
			top: number;
			right: number;
			bottom: number;

			constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.left = x;
				this.top = y;
				this.right = x + width;
				this.bottom = y + height;
			}
		};
	});

	describe('collectSSRPlaceholderDimensions', () => {
		it('should use effective dimensions for display: contents elements', () => {
			const mockElement = {
				getAttribute: jest.fn().mockReturnValue('test-placeholder'),
				getBoundingClientRect: jest.fn().mockReturnValue({
					x: 0,
					y: 0,
					width: 0,
					height: 0,
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
				}),
				children: [
					{
						getBoundingClientRect: jest.fn().mockReturnValue({
							x: 10,
							y: 20,
							width: 100,
							height: 50,
							left: 10,
							top: 20,
							right: 110,
							bottom: 70,
						}),
					},
					{
						getBoundingClientRect: jest.fn().mockReturnValue({
							x: 5,
							y: 25,
							width: 80,
							height: 40,
							left: 5,
							top: 25,
							right: 85,
							bottom: 65,
						}),
					},
				],
			};

			mockDocument.querySelectorAll.mockReturnValue([mockElement]);
			mockWindow.getComputedStyle.mockReturnValue({ display: 'contents' });

			collectSSRPlaceholderDimensions(mockDocument, mockWindow, false);

			// Should collect union of children dimensions
			const result = mockWindow.__SSR_PLACEHOLDERS_DIMENSIONS__['test-placeholder'];
			expect(result.x).toBe(5); // min left
			expect(result.y).toBe(20); // min top
			expect(result.width).toBe(105); // max right (110) - min left (5)
			expect(result.height).toBe(50); // max bottom (70) - min top (20)
		});

		it('should collect normal dimensions for non-display-contents elements', () => {
			const mockElement = {
				getAttribute: jest.fn().mockReturnValue('normal-placeholder'),
				getBoundingClientRect: jest.fn().mockReturnValue({
					x: 10,
					y: 20,
					width: 100,
					height: 50,
					left: 10,
					top: 20,
					right: 110,
					bottom: 70,
				}),
				children: [],
			};

			mockDocument.querySelectorAll.mockReturnValue([mockElement]);
			mockWindow.getComputedStyle.mockReturnValue({ display: 'block' });

			collectSSRPlaceholderDimensions(mockDocument, mockWindow, false);

			// Should use the element's own dimensions
			const result = mockWindow.__SSR_PLACEHOLDERS_DIMENSIONS__['normal-placeholder'];
			expect(result.x).toBe(10);
			expect(result.y).toBe(20);
			expect(result.width).toBe(100);
			expect(result.height).toBe(50);
		});

		it('should handle display: contents elements with no visible children', () => {
			const mockElement = {
				getAttribute: jest.fn().mockReturnValue('empty-placeholder'),
				getBoundingClientRect: jest.fn().mockReturnValue({
					x: 0,
					y: 0,
					width: 0,
					height: 0,
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
				}),
				children: [
					{
						getBoundingClientRect: jest.fn().mockReturnValue({
							x: 0,
							y: 0,
							width: 0,
							height: 0,
							left: 0,
							top: 0,
							right: 0,
							bottom: 0,
						}),
					},
				],
			};

			mockDocument.querySelectorAll.mockReturnValue([mockElement]);
			mockWindow.getComputedStyle.mockReturnValue({ display: 'contents' });

			collectSSRPlaceholderDimensions(mockDocument, mockWindow, false);

			// Should store zero dimensions when all children have zero dimensions
			const result = mockWindow.__SSR_PLACEHOLDERS_DIMENSIONS__['empty-placeholder'];
			expect(result.x).toBe(0);
			expect(result.y).toBe(0);
			expect(result.width).toBe(0);
			expect(result.height).toBe(0);
		});
	});

	describe('SSRPlaceholderHandlers with display contents support', () => {
		let handler: SSRPlaceholderHandlers;

		beforeEach(() => {
			handler = new SSRPlaceholderHandlers({});
		});

		it('should handle display contents elements properly', () => {
			// Create a real DOM element for testing
			const element = document.createElement('div');
			element.dataset.ssrPlaceholder = 'test';

			// Mock getBoundingClientRect
			jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
			} as DOMRect);

			// Mock getComputedStyle
			const originalGetComputedStyle = window.getComputedStyle;
			(window as any).getComputedStyle = jest.fn().mockReturnValue({ display: 'block' });

			try {
				// Set up placeholder data
				handler['staticPlaceholders'].set('test', { x: 0, y: 0, width: 0, height: 0 });

				const result = handler.checkIfExistedAndSizeMatchingV3(element);

				// Verify the method was called
				expect(result).toBe(true);
			} finally {
				// Restore original getComputedStyle
				(window as any).getComputedStyle = originalGetComputedStyle;
			}
		});
	});
});
