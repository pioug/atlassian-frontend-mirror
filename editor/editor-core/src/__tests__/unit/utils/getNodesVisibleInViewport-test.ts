import { isNodeVisible, getNodesVisibleInViewport } from '../../../utils/getNodesVisibleInViewport';

// Mock getBoundingClientRect and window dimensions
const mockGetBoundingClientRect = (x: number, y: number, width: number, height: number) => ({
	x,
	y,
	width,
	height,
	top: y,
	left: x,
	right: x + width,
	bottom: y + height,
	toJSON: () => ({ x, y, width, height }),
});

const mockWindowDimensions = (width: number, height: number) => {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
	Object.defineProperty(window, 'innerHeight', {
		writable: true,
		configurable: true,
		value: height,
	});
};

describe('isNodeVisible', () => {
	let mockElement: Element;

	beforeEach(() => {
		// Set default viewport dimensions
		mockWindowDimensions(1920, 1080);

		mockElement = document.createElement('div');
	});

	afterEach(() => {
		// Reset window dimensions
		mockWindowDimensions(1920, 1080);
	});

	describe('fully visible elements', () => {
		it('should return true for element fully within viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(100, 100, 200, 150),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});

		it('should return true for element at viewport origin', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(0, 0, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});

		it('should return true for element at viewport edge', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(1820, 980, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});
	});

	describe('partially visible elements', () => {
		it('should return true for element with top-left corner in viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(1900, 1000, 200, 200),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});

		it('should return true for element extending beyond right edge', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(1900, 100, 200, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});

		it('should return true for element extending beyond bottom edge', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(100, 1000, 100, 200),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});
	});

	describe('invisible elements', () => {
		it('should return false for element completely above viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(100, -200, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});

		it('should return false for element completely below viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(100, 1200, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});

		it('should return false for element completely left of viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(-200, 100, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});

		it('should return false for element completely right of viewport', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(2000, 100, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});

		it('should return false for element exactly at right edge', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(1920, 100, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});

		it('should return false for element exactly at bottom edge', () => {
			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(100, 1080, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(false);
		});
	});

	describe('different viewport dimensions', () => {
		it('should work with small viewport', () => {
			mockWindowDimensions(800, 600);

			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(400, 300, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});

		it('should work with large viewport', () => {
			mockWindowDimensions(2560, 1440);

			Object.defineProperty(mockElement, 'getBoundingClientRect', {
				value: () => mockGetBoundingClientRect(1280, 720, 100, 100),
			});

			expect(isNodeVisible(mockElement)).toBe(true);
		});
	});
});

describe('getNodesVisibleInViewport', () => {
	let mockEditorDom: Element;
	let mockNodes: Element[];

	beforeEach(() => {
		// Set default viewport dimensions
		mockWindowDimensions(1920, 1080);

		// Create mock editor DOM
		mockEditorDom = document.createElement('div');
		mockNodes = [];

		// Create some mock nodes with different types
		const nodeTypes = ['paragraph', 'heading', 'codeBlock', 'table', 'paragraph', 'codeBlock'];

		nodeTypes.forEach((type, index) => {
			const node = document.createElement('div');
			node.setAttribute('data-prosemirror-node-name', type);

			// Set different visibility states
			let isVisible = false;
			if (index < 3) {
				// First 3 nodes are visible
				isVisible = true;
			}

			Object.defineProperty(node, 'getBoundingClientRect', {
				value: () =>
					mockGetBoundingClientRect(
						isVisible ? 100 : -200,
						isVisible ? 100 + index * 50 : -200,
						100,
						50,
					),
			});

			mockNodes.push(node);
			mockEditorDom.appendChild(node);
		});
	});

	afterEach(() => {
		// Reset window dimensions
		mockWindowDimensions(1920, 1080);
	});

	describe('basic counting', () => {
		it('should count visible nodes by type', () => {
			const result = getNodesVisibleInViewport(mockEditorDom);

			expect(result).toEqual({
				paragraph: 1, // First paragraph is visible
				heading: 1, // Heading is visible
				codeBlock: 1, // First codeBlock is visible
			});
		});

		it('should not count invisible nodes', () => {
			const result = getNodesVisibleInViewport(mockEditorDom);

			// Should not include table or second paragraph/codeBlock (they're invisible)
			expect(result.table).toBeUndefined();
			expect(result.paragraph).toBe(1); // Only first one
			expect(result.codeBlock).toBe(1); // Only first one
		});

		it('should return empty object when no nodes are visible', () => {
			// Create a new DOM with all invisible nodes
			const invisibleDom = document.createElement('div');

			// Add nodes that are all invisible
			const invisibleNodeTypes = ['paragraph', 'heading', 'codeBlock'];
			invisibleNodeTypes.forEach((type) => {
				const node = document.createElement('div');
				node.setAttribute('data-prosemirror-node-name', type);
				Object.defineProperty(node, 'getBoundingClientRect', {
					value: () => mockGetBoundingClientRect(-200, -200, 100, 50),
				});
				invisibleDom.appendChild(node);
			});

			const result = getNodesVisibleInViewport(invisibleDom);
			expect(result).toEqual({});
		});
	});

	describe('threshold handling', () => {
		it('should respect the 200 node threshold', () => {
			// Create a new DOM with more than 200 nodes
			const largeDom = document.createElement('div');

			// Create more than 200 nodes
			for (let i = 0; i < 250; i++) {
				const node = document.createElement('div');
				node.setAttribute('data-prosemirror-node-name', 'paragraph');
				Object.defineProperty(node, 'getBoundingClientRect', {
					value: () => mockGetBoundingClientRect(100, 100 + i, 100, 50),
				});
				largeDom.appendChild(node);
			}

			const result = getNodesVisibleInViewport(largeDom);

			// Should only process first 200 nodes
			expect(result.paragraph).toBeLessThanOrEqual(200);
		});

		it('should handle empty DOM', () => {
			const emptyDom = document.createElement('div');
			const result = getNodesVisibleInViewport(emptyDom);

			expect(result).toEqual({});
		});
	});

	it('should skip nodes without data-prosemirror-node-name attribute', () => {
		const nodeWithoutType = document.createElement('div');
		// No data-prosemirror-node-name attribute
		Object.defineProperty(nodeWithoutType, 'getBoundingClientRect', {
			value: () => mockGetBoundingClientRect(100, 100, 100, 50),
		});
		mockEditorDom.appendChild(nodeWithoutType);

		const result = getNodesVisibleInViewport(mockEditorDom);

		// Should not include nodes without type
		expect(Object.keys(result).length).toBe(3); // Only the original visible nodes
	});

	it('should handle typical editor content mix', () => {
		// Simulate a typical editor with various content
		// Create a completely new DOM for this test to avoid interference
		const typicalDom = document.createElement('div');

		const typicalContent = [
			{ type: 'paragraph', visible: true },
			{ type: 'heading', visible: true },
			{ type: 'table', visible: true },
			{ type: 'codeBlock', visible: false }, // Below fold
			{ type: 'paragraph', visible: false }, // Below fold
		];

		typicalContent.forEach(({ type, visible }) => {
			const node = document.createElement('div');
			node.setAttribute('data-prosemirror-node-name', type);
			Object.defineProperty(node, 'getBoundingClientRect', {
				value: () =>
					mockGetBoundingClientRect(
						visible ? 100 : 100,
						visible ? 100 : 1200, // Below fold
						100,
						50,
					),
			});
			typicalDom.appendChild(node);
		});

		const result = getNodesVisibleInViewport(typicalDom);

		expect(result).toEqual({
			paragraph: 1,
			heading: 1,
			table: 1,
		});
	});

	describe('early exit optimisation', () => {
		it('should early exit after first non-visible node to avoid unnecessary getBoundingClientRect calls', () => {
			// Create a DOM with visible nodes first, then non-visible nodes
			const optimisedDom = document.createElement('div');

			// Create a counter to track getBoundingClientRect calls
			let callCount = 0;

			// First 3 nodes are visible
			const visibleNodeTypes = ['paragraph', 'heading', 'codeBlock'];
			visibleNodeTypes.forEach((type, index) => {
				const node = document.createElement('div');
				node.setAttribute('data-prosemirror-node-name', type);
				Object.defineProperty(node, 'getBoundingClientRect', {
					value: () => {
						callCount++;
						return mockGetBoundingClientRect(100, 100 + index * 50, 100, 50);
					},
				});
				optimisedDom.appendChild(node);
			});

			// Add a non-visible node (below viewport)
			const firstNonVisibleNode = document.createElement('div');
			firstNonVisibleNode.setAttribute('data-prosemirror-node-name', 'table');
			Object.defineProperty(firstNonVisibleNode, 'getBoundingClientRect', {
				value: () => {
					callCount++;
					return mockGetBoundingClientRect(100, 1200, 100, 50); // Below viewport
				},
			});
			optimisedDom.appendChild(firstNonVisibleNode);

			// Add more nodes that should never be checked due to early exit
			const neverCheckedNodes = ['paragraph', 'list', 'blockquote'];
			neverCheckedNodes.forEach((type) => {
				const node = document.createElement('div');
				node.setAttribute('data-prosemirror-node-name', type);
				// These should never be called, but if they are, they'll be visible
				Object.defineProperty(node, 'getBoundingClientRect', {
					value: () => {
						callCount++;
						return mockGetBoundingClientRect(100, 1300, 100, 50);
					},
				});
				optimisedDom.appendChild(node);
			});

			const result = getNodesVisibleInViewport(optimisedDom);

			// Should only count the first 3 visible nodes
			expect(result).toEqual({
				paragraph: 1,
				heading: 1,
				codeBlock: 1,
			});

			// Should NOT include the non-visible nodes
			expect(result.table).toBeUndefined();
			expect(result.list).toBeUndefined();
			expect(result.blockquote).toBeUndefined();

			// Verify we only called getBoundingClientRect on the nodes we actually checked
			// (This is a bit implementation-specific, but useful for catching regressions)
			expect(callCount).toBe(4); // 3 visible + 1 non-visible
		});

		it('should handle case where all nodes are visible (no early exit)', () => {
			// Create a DOM with all visible nodes
			const allVisibleDom = document.createElement('div');

			const allVisibleNodeTypes = ['paragraph', 'heading', 'codeBlock', 'table', 'list'];
			allVisibleNodeTypes.forEach((type, index) => {
				const node = document.createElement('div');
				node.setAttribute('data-prosemirror-node-name', type);
				Object.defineProperty(node, 'getBoundingClientRect', {
					value: () => mockGetBoundingClientRect(100, 100 + index * 50, 100, 50),
				});
				allVisibleDom.appendChild(node);
			});

			const result = getNodesVisibleInViewport(allVisibleDom);

			// Should count all visible nodes
			expect(result).toEqual({
				paragraph: 1,
				heading: 1,
				codeBlock: 1,
				table: 1,
				list: 1,
			});
		});
	});
});
