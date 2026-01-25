import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { RLLPlaceholderHandlers } from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// Mock window and document for testing
const mockWindow = {
	innerWidth: 1920,
	innerHeight: 1080,
};

const mockGetBoundingClientRect = jest.fn();

describe('RLLPlaceholderHandlers', () => {
	let originalWindow: typeof window;
	let originalDocument: typeof document;

	beforeEach(() => {
		// Store original globals
		originalWindow = global.window;
		originalDocument = global.document;

		// Reset DOM
		document.body.innerHTML = '';

		// Reset mock
		mockGetBoundingClientRect.mockReset();

		// Clear singleton instance for each test
		if (typeof globalThis !== 'undefined') {
			delete (globalThis as any).__REACT_UFO_RLL_PLACEHOLDER_HANDLERS__;
		}
	});

	afterEach(() => {
		// Restore original globals
		global.window = originalWindow;
		global.document = originalDocument;
	});

	describe('constructor', () => {
		it('should not collect placeholders when window is undefined', () => {
			// @ts-ignore
			delete global.window;

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should not collect placeholders when document is undefined', () => {
			// @ts-ignore
			global.window = mockWindow;
			// @ts-ignore
			delete global.document;

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should collect placeholders when both window and document are available', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			// Create DOM with RLL placeholders
			document.body.innerHTML = `
				<input type="hidden" data-lazy-begin="test-1" />
				<div id="content-1">Placeholder content 1</div>
				<input type="hidden" data-lazy-end="test-1" />
			`;

			// Mock getBoundingClientRect for in-viewport element
			const mockRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(mockRect);

			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1);
			// Since element is fully in viewport, should cache the full rectangle
			expect(placeholders[0].left).toBe(mockRect.left);
			expect(placeholders[0].top).toBe(mockRect.top);
			expect(placeholders[0].right).toBe(mockRect.right);
			expect(placeholders[0].bottom).toBe(mockRect.bottom);
			expect(placeholders[0].width).toBe(mockRect.width);
			expect(placeholders[0].height).toBe(mockRect.height);
		});
	});

	describe('RLL placeholder collection', () => {
		beforeEach(() => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});
		});

		it('should handle empty DOM', () => {
			document.body.innerHTML = '';

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should collect single placeholder', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="placeholder-1" />
				<div id="content-1">Content</div>
				<input data-lazy-end="placeholder-1" />
			`;

			const mockRect = new DOMRect(0, 0, 100, 100);
			mockGetBoundingClientRect.mockReturnValue(mockRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1);
			// Since element is fully in viewport, should cache the full rectangle
			expect(placeholders[0].left).toBe(mockRect.left);
			expect(placeholders[0].top).toBe(mockRect.top);
			expect(placeholders[0].right).toBe(mockRect.right);
			expect(placeholders[0].bottom).toBe(mockRect.bottom);
			expect(placeholders[0].width).toBe(mockRect.width);
			expect(placeholders[0].height).toBe(mockRect.height);
		});

		it('should collect multiple placeholders', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="placeholder-1" />
				<div id="content-1">Content 1</div>
				<input data-lazy-end="placeholder-1" />

				<input data-lazy-begin="placeholder-2" />
				<div id="content-2">Content 2</div>
				<span>More content</span>
				<input data-lazy-end="placeholder-2" />
			`;

			const mockRect = new DOMRect(0, 0, 100, 100);
			mockGetBoundingClientRect.mockReturnValue(mockRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(3); // 1 element from first + 2 elements from second
		});

		it('should handle placeholder with no content', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="empty-placeholder" />
				<input data-lazy-end="empty-placeholder" />
			`;

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should handle placeholder with text nodes (should be ignored)', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="text-placeholder" />
				Some text content
				<div>Element content</div>
				More text
				<input data-lazy-end="text-placeholder" />
			`;

			const mockRect = new DOMRect(0, 0, 100, 100);
			mockGetBoundingClientRect.mockReturnValue(mockRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1); // Only the div element, text nodes ignored
		});

		it('should handle begin marker without id', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="" />
				<div>Content</div>
				<input data-lazy-end="" />
			`;

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should handle orphaned begin marker (no matching end)', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="orphaned" />
				<div>Content that never ends</div>
			`;

			const mockRect = new DOMRect(0, 0, 100, 100);
			mockGetBoundingClientRect.mockReturnValue(mockRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1); // Should collect until end of siblings
		});
	});

	describe('viewport filtering', () => {
		beforeEach(() => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});
		});

		it('should include elements fully in viewport', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="in-viewport" />
				<div>Content</div>
				<input data-lazy-end="in-viewport" />
			`;

			// Fully visible element
			const inViewportRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(inViewportRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1);
			// Since element is fully in viewport, should cache the full rectangle
			expect(placeholders[0].left).toBe(inViewportRect.left);
			expect(placeholders[0].top).toBe(inViewportRect.top);
			expect(placeholders[0].right).toBe(inViewportRect.right);
			expect(placeholders[0].bottom).toBe(inViewportRect.bottom);
			expect(placeholders[0].width).toBe(inViewportRect.width);
			expect(placeholders[0].height).toBe(inViewportRect.height);
		});

		it('should include elements partially in viewport', () => {
			// Ensure viewport dimensions without replacing the window object
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="partial" />
				<div>Content</div>
				<input data-lazy-end="partial" />
			`;

			// Partially visible element (extends beyond right edge)
			const partialRect = new DOMRect(1800, 100, 200, 200); // left: 1800, right: 2000 (beyond 1920)
			mockGetBoundingClientRect.mockReturnValue(partialRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1);
		});

		it('should exclude elements completely outside viewport', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="outside" />
				<div>Content</div>
				<input data-lazy-end="outside" />
			`;

			// Completely outside viewport (to the right)
			const outsideRect = new DOMRect(2000, 100, 200, 200); // left: 2000 (beyond 1920)
			mockGetBoundingClientRect.mockReturnValue(outsideRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(0);
		});

		it('should handle mixed in/out viewport elements', () => {
			document.body.innerHTML = `
				<input data-lazy-begin="mixed" />
				<div id="visible">Visible content</div>
				<div id="hidden">Hidden content</div>
				<input data-lazy-end="mixed" />
			`;

			// Mock different rects for different elements
			mockGetBoundingClientRect
				.mockReturnValueOnce(new DOMRect(100, 100, 200, 200)) // visible
				.mockReturnValueOnce(new DOMRect(2000, 100, 200, 200)); // outside viewport

			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(1); // Only the visible one
		});

		it('should handle zero-size elements', () => {
			// Ensure viewport dimensions without replacing the window object
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="zero-size" />
				<div>Content</div>
				<input data-lazy-end="zero-size" />
			`;

			const zeroRect = new DOMRect(100, 100, 0, 0);
			mockGetBoundingClientRect.mockReturnValue(zeroRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(0); // Zero-size elements should not be cached
		});

		it('should handle elements at viewport edges', () => {
			// Ensure viewport dimensions without replacing the window object
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="edge-case" />
				<div>Content</div>
				<input data-lazy-end="edge-case" />
			`;

			// Element exactly at the edge (left edge = viewport width)
			const edgeRect = new DOMRect(1920, 100, 100, 100); // left: 1920, right: 2020 (beyond viewport)
			mockGetBoundingClientRect.mockReturnValue(edgeRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			// Should exclude element at edge since it would create zero-width intersection
			expect(placeholders).toHaveLength(0);
		});

		it('should exclude elements with zero-width intersections', () => {
			// Ensure viewport dimensions without replacing the window object
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="zero-width" />
				<div>Content</div>
				<input data-lazy-end="zero-width" />
			`;

			// Element that would create zero-height intersection
			const zeroHeightRect = new DOMRect(100, 1080, 200, 100); // top: 1080 (at viewport bottom), bottom: 1180
			mockGetBoundingClientRect.mockReturnValue(zeroHeightRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const placeholders = handler.getPlaceholders();

			expect(placeholders).toHaveLength(0); // Should exclude zero-height intersections
		});

		it('should handle edge case with zero-size intersecting rectangles', () => {
			// Setup DOM with placeholder that creates non-zero intersection
			document.body.innerHTML = `
				<input data-lazy-begin="valid-size" />
				<div>Content</div>
				<input data-lazy-end="valid-size" />
			`;

			// Use a non-zero rectangle that will be cached
			const validRect = new DOMRect(100, 100, 50, 50);
			mockGetBoundingClientRect.mockReturnValue(validRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test intersecting rect with valid size
			const result = handler.isRLLPlaceholderHydration(validRect);
			expect(result).toBe(true);

			// Test that zero-size rects don't match (since they wouldn't be cached anyway)
			const zeroRect = new DOMRect(100, 100, 0, 0);
			const zeroResult = handler.isRLLPlaceholderHydration(zeroRect);
			expect(zeroResult).toBe(false);
		});
	});

	describe('getPlaceholders', () => {
		it('should return empty array when no placeholders collected', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});
			document.body.innerHTML = '';

			const handler = RLLPlaceholderHandlers.getInstance();
			expect(handler.getPlaceholders()).toEqual([]);
		});

		it('should return collected intersecting placeholders', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="test" />
				<div>Content</div>
				<input data-lazy-end="test" />
			`;

			// Element partially outside viewport (right edge extends beyond)
			const elementRect = new DOMRect(1800, 100, 200, 200); // left: 1800, right: 2000
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const result = handler.getPlaceholders();

			expect(result).toHaveLength(1);
			// Should cache only the intersecting portion: left: 1800, right: 1920 (viewport width)
			expect(result[0].left).toBe(1800);
			expect(result[0].top).toBe(100);
			expect(result[0].right).toBe(1920); // clipped to viewport width
			expect(result[0].bottom).toBe(300);
			expect(result[0].width).toBe(120); // 1920 - 1800
			expect(result[0].height).toBe(200);
		});

		it('should return full rectangle when element is fully in viewport', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});

			document.body.innerHTML = `
				<input data-lazy-begin="test" />
				<div>Content</div>
				<input data-lazy-end="test" />
			`;

			// Element fully in viewport
			const elementRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();
			const result = handler.getPlaceholders();

			expect(result).toHaveLength(1);
			// Should cache the full rectangle since it's fully in viewport
			expect(result[0].left).toBe(100);
			expect(result[0].top).toBe(100);
			expect(result[0].right).toBe(300);
			expect(result[0].bottom).toBe(300);
			expect(result[0].width).toBe(200);
			expect(result[0].height).toBe(200);
		});
	});

	describe('isRLLPlaceholderHydration', () => {
		beforeEach(() => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: mockWindow.innerWidth,
			});
			Object.defineProperty(window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: mockWindow.innerHeight,
			});
		});

		it('should return false when no placeholders are cached', () => {
			document.body.innerHTML = '';
			const handler = RLLPlaceholderHandlers.getInstance();

			const testRect = new DOMRect(100, 100, 200, 200);
			const result = handler.isRLLPlaceholderHydration(testRect);
			expect(result).toBe(false);
		});

		it('should return true for exact intersecting rectangle match', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="exact-match" />
				<div>Content</div>
				<input data-lazy-end="exact-match" />
			`;

			// Element fully in viewport
			const elementRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test with same intersecting rect (which should be the full rect since element is fully in viewport)
			const result = handler.isRLLPlaceholderHydration(elementRect);
			expect(result).toBe(true);
		});

		it('should return true for intersecting rectangle within 1 pixel tolerance', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="tolerance-match" />
				<div>Content</div>
				<input data-lazy-end="tolerance-match" />
			`;

			// Element fully in viewport
			const elementRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test element with 1 pixel difference (within tolerance)
			const toleranceRect = new DOMRect(101, 99, 200, 200); // left +1, top -1
			const result = handler.isRLLPlaceholderHydration(toleranceRect);
			expect(result).toBe(true);
		});

		it('should return false for intersecting rectangle outside 1 pixel tolerance', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="outside-tolerance" />
				<div>Content</div>
				<input data-lazy-end="outside-tolerance" />
			`;

			// Element fully in viewport
			const elementRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test element with 2 pixel difference (outside tolerance)
			const outsideToleranceRect = new DOMRect(102, 100, 200, 200); // left +2
			const result = handler.isRLLPlaceholderHydration(outsideToleranceRect);
			expect(result).toBe(false);
		});

		it('should test all rectangle properties for tolerance', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="all-props" />
				<div>Content</div>
				<input data-lazy-end="all-props" />
			`;

			const placeholderRect = new DOMRect(100, 100, 200, 200); // right: 300, bottom: 300

			// Test each property at tolerance boundary
			const testCases = [
				{ rect: new DOMRect(99, 100, 200, 200), expected: true, desc: 'left -1' },
				{ rect: new DOMRect(101, 100, 200, 200), expected: true, desc: 'left +1' },
				{ rect: new DOMRect(98, 100, 200, 200), expected: false, desc: 'left -2' },
				{ rect: new DOMRect(100, 99, 200, 200), expected: true, desc: 'top -1' },
				{ rect: new DOMRect(100, 101, 200, 200), expected: true, desc: 'top +1' },
				{ rect: new DOMRect(100, 102, 200, 200), expected: false, desc: 'top +2' },
				{ rect: new DOMRect(100, 100, 201, 200), expected: true, desc: 'right +1' },
				{ rect: new DOMRect(100, 100, 199, 200), expected: true, desc: 'right -1' },
				{ rect: new DOMRect(100, 100, 198, 200), expected: false, desc: 'right -2' },
				{ rect: new DOMRect(100, 100, 200, 201), expected: true, desc: 'bottom +1' },
				{ rect: new DOMRect(100, 100, 200, 199), expected: true, desc: 'bottom -1' },
				{ rect: new DOMRect(100, 100, 200, 198), expected: false, desc: 'bottom -2' },
			];

			testCases.forEach(({ rect, expected, desc }) => {
				// Clear singleton for each test case to avoid match count interference
				delete (globalThis as any).__REACT_UFO_RLL_PLACEHOLDER_HANDLERS__;

				mockGetBoundingClientRect.mockReturnValue(placeholderRect);
				Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

				const handler = RLLPlaceholderHandlers.getInstance();

				const result = handler.isRLLPlaceholderHydration(rect);
				expect(result).toBe(expected);
			});
		});

		it('should match against multiple cached intersecting placeholders', () => {
			// Setup DOM with multiple placeholders
			document.body.innerHTML = `
				<input data-lazy-begin="multi-1" />
				<div>Content 1</div>
				<input data-lazy-end="multi-1" />
				<input data-lazy-begin="multi-2" />
				<div>Content 2</div>
				<input data-lazy-end="multi-2" />
			`;

			const rect1 = new DOMRect(100, 100, 200, 200);
			const rect2 = new DOMRect(400, 400, 300, 300);
			mockGetBoundingClientRect.mockReturnValueOnce(rect1).mockReturnValueOnce(rect2);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test intersecting rect matches second placeholder
			const result = handler.isRLLPlaceholderHydration(rect2);
			expect(result).toBe(true);
		});

		it('should return false when intersecting rect matches none of multiple placeholders', () => {
			// Setup DOM with multiple placeholders
			document.body.innerHTML = `
				<input data-lazy-begin="multi-1" />
				<div>Content 1</div>
				<input data-lazy-end="multi-1" />
				<input data-lazy-begin="multi-2" />
				<div>Content 2</div>
				<input data-lazy-end="multi-2" />
			`;

			const rect1 = new DOMRect(100, 100, 200, 200);
			const rect2 = new DOMRect(400, 400, 300, 300);
			mockGetBoundingClientRect.mockReturnValueOnce(rect1).mockReturnValueOnce(rect2);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test intersecting rect matches neither placeholder
			const differentRect = new DOMRect(800, 800, 100, 100);
			const result = handler.isRLLPlaceholderHydration(differentRect);
			expect(result).toBe(false);
		});

		it('should handle edge case with zero-size intersecting rectangles', () => {
			// Setup DOM with placeholder that creates non-zero intersection
			document.body.innerHTML = `
				<input data-lazy-begin="valid-size" />
				<div>Content</div>
				<input data-lazy-end="valid-size" />
			`;

			// Use a non-zero rectangle that will be cached
			const validRect = new DOMRect(100, 100, 50, 50);
			mockGetBoundingClientRect.mockReturnValue(validRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test intersecting rect with valid size
			const result = handler.isRLLPlaceholderHydration(validRect);
			expect(result).toBe(true);

			// Test that zero-size rects don't match (since they wouldn't be cached anyway)
			const zeroRect = new DOMRect(100, 100, 0, 0);
			const zeroResult = handler.isRLLPlaceholderHydration(zeroRect);
			expect(zeroResult).toBe(false);
		});

		it('should allow unlimited matches per placeholder', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="unlimited-match" />
				<div>Content</div>
				<input data-lazy-end="unlimited-match" />
			`;

			const placeholderRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(placeholderRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test with the same intersecting rect multiple times
			const testRect = placeholderRect;

			// All matches should return true (no limit)
			expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);

			// Even more attempts should continue to return true
			for (let i = 0; i < 10; i++) {
				expect(handler.isRLLPlaceholderHydration(testRect)).toBe(true);
			}
		});

		it('should match multiple placeholders independently without limits', () => {
			// Setup DOM with multiple placeholders
			document.body.innerHTML = `
				<input data-lazy-begin="placeholder-1" />
				<div>Content 1</div>
				<input data-lazy-end="placeholder-1" />
				<input data-lazy-begin="placeholder-2" />
				<div>Content 2</div>
				<input data-lazy-end="placeholder-2" />
			`;

			const rect1 = new DOMRect(100, 100, 200, 200);
			const rect2 = new DOMRect(400, 400, 300, 300);
			mockGetBoundingClientRect.mockReturnValueOnce(rect1).mockReturnValueOnce(rect2);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Test both placeholders multiple times - all should succeed
			expect(handler.isRLLPlaceholderHydration(rect1)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect1)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect1)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect1)).toBe(true);

			expect(handler.isRLLPlaceholderHydration(rect2)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect2)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect2)).toBe(true);
			expect(handler.isRLLPlaceholderHydration(rect2)).toBe(true);
		});

		it('should match with tolerance correctly without count limits', () => {
			// Setup DOM with placeholder
			document.body.innerHTML = `
				<input data-lazy-begin="tolerance-unlimited" />
				<div>Content</div>
				<input data-lazy-end="tolerance-unlimited" />
			`;

			const placeholderRect = new DOMRect(100, 100, 200, 200);
			mockGetBoundingClientRect.mockReturnValue(placeholderRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// Create intersecting rects with slight variations (within tolerance)
			const toleranceRects = [
				new DOMRect(100, 100, 200, 200), // exact match
				new DOMRect(101, 100, 200, 200), // +1 pixel (within tolerance)
				new DOMRect(99, 101, 200, 200), // -1, +1 pixels (within tolerance)
				new DOMRect(100, 99, 200, 200), // -1 pixel (within tolerance)
			];

			// All within tolerance should match repeatedly
			toleranceRects.forEach((rect) => {
				expect(handler.isRLLPlaceholderHydration(rect)).toBe(true);
				expect(handler.isRLLPlaceholderHydration(rect)).toBe(true); // Test multiple times
			});
		});

		it('should work with partially visible intersecting rectangles', () => {
			// Setup DOM with placeholder that's partially outside viewport
			document.body.innerHTML = `
				<input data-lazy-begin="partial-rect" />
				<div>Content</div>
				<input data-lazy-end="partial-rect" />
			`;

			// Element extends beyond right edge of viewport
			const elementRect = new DOMRect(1800, 100, 200, 200); // right: 2000, viewport width: 1920
			mockGetBoundingClientRect.mockReturnValue(elementRect);
			Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

			const handler = RLLPlaceholderHandlers.getInstance();

			// The cached placeholder should be the intersecting portion: (1800, 100, 120, 200)
			// Test with the intersecting rectangle from IntersectionObserver
			const intersectingRect = new DOMRect(1800, 100, 120, 200); // width clipped to 120 (1920 - 1800)
			const result = handler.isRLLPlaceholderHydration(intersectingRect);
			expect(result).toBe(true);

			// Test with full element rect should fail
			const fullElementResult = handler.isRLLPlaceholderHydration(elementRect);
			expect(fullElementResult).toBe(false);
		});
	});
});
