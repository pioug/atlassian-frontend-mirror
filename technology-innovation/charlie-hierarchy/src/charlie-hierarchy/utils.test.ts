import {
	calculateLinkTargetPosition,
	calculateNodePosition,
	calculateStackingShift,
} from './utils';

describe('Charlie Hierarchy Utils', () => {
	const nodeWidthWithPadding = 100;

	describe('calculateStackingShift', () => {
		it('should return 0 when no children are stacked', () => {
			// 3 children, threshold 5 - no stacking needed
			const result = calculateStackingShift(3, 5, nodeWidthWithPadding);
			expect(result).toBe(0);
		});

		it('should return 0 when children equal threshold', () => {
			// 3 children, threshold 3 - exactly at threshold
			const result = calculateStackingShift(3, 3, nodeWidthWithPadding);
			expect(result).toBe(0);
		});

		it('should calculate correct shift when children exceed threshold', () => {
			// 6 children, threshold 3 - 3 children stacked
			// Shift = (3 * 100) / 2 = 150
			const result = calculateStackingShift(6, 3, nodeWidthWithPadding);
			expect(result).toBe(150);
		});

		it('should handle single stacked child', () => {
			// 4 children, threshold 3 - 1 child stacked
			// Shift = (1 * 100) / 2 = 50
			const result = calculateStackingShift(4, 3, nodeWidthWithPadding);
			expect(result).toBe(50);
		});

		it('should handle large number of stacked children', () => {
			// 10 children, threshold 2 - 8 children stacked
			// Shift = (8 * 100) / 2 = 400
			const result = calculateStackingShift(10, 2, nodeWidthWithPadding);
			expect(result).toBe(400);
		});

		it('should handle zero children', () => {
			const result = calculateStackingShift(0, 3, nodeWidthWithPadding);
			expect(result).toBe(0);
		});

		it('should work with different node widths', () => {
			// 5 children, threshold 3, width 200 - 2 children stacked
			// Shift = (2 * 200) / 2 = 200
			const result = calculateStackingShift(5, 3, 200);
			expect(result).toBe(200);
		});
	});

	describe('calculateNodePosition', () => {
		const originalLeft = 500;

		it('should return original position when no parent children', () => {
			const result = calculateNodePosition(originalLeft, undefined, 3, nodeWidthWithPadding);
			expect(result).toBe(originalLeft);
		});

		it('should return original position when parent children is empty array', () => {
			const result = calculateNodePosition(originalLeft, [], 3, nodeWidthWithPadding);
			expect(result).toBe(originalLeft);
		});

		it('should return original position when children count is below threshold', () => {
			const parentChildren = ['child1', 'child2']; // 2 children
			const result = calculateNodePosition(
				originalLeft,
				parentChildren,
				3, // threshold 3
				nodeWidthWithPadding,
			);
			expect(result).toBe(originalLeft);
		});

		it('should return original position when children count equals threshold', () => {
			const parentChildren = ['child1', 'child2', 'child3']; // 3 children
			const result = calculateNodePosition(
				originalLeft,
				parentChildren,
				3, // threshold 3
				nodeWidthWithPadding,
			);
			expect(result).toBe(originalLeft);
		});

		it('should apply shift when children exceed threshold', () => {
			const parentChildren = ['child1', 'child2', 'child3', 'child4', 'child5', 'child6']; // 6 children
			const result = calculateNodePosition(
				originalLeft,
				parentChildren,
				3, // threshold 3 - 3 children stacked
				nodeWidthWithPadding,
			);
			// Expected: 500 + ((6-3) * 100) / 2 = 500 + 150 = 650
			expect(result).toBe(650);
		});

		it('should handle single stacked child', () => {
			const parentChildren = ['child1', 'child2', 'child3', 'child4']; // 4 children
			const result = calculateNodePosition(
				originalLeft,
				parentChildren,
				3, // threshold 3 - 1 child stacked
				nodeWidthWithPadding,
			);
			// Expected: 500 + ((4-3) * 100) / 2 = 500 + 50 = 550
			expect(result).toBe(550);
		});

		it('should work with negative original positions', () => {
			const parentChildren = ['child1', 'child2', 'child3', 'child4']; // 4 children
			const result = calculateNodePosition(
				-100, // negative original position
				parentChildren,
				3, // threshold 3 - 1 child stacked
				nodeWidthWithPadding,
			);
			// Expected: -100 + ((4-3) * 100) / 2 = -100 + 50 = -50
			expect(result).toBe(-50);
		});
	});

	describe('calculateLinkTargetPosition', () => {
		const originalX = 300;

		it('should return original position when no source children', () => {
			const result = calculateLinkTargetPosition(originalX, undefined, 3, nodeWidthWithPadding);
			expect(result).toBe(originalX);
		});

		it('should return original position when source children is empty array', () => {
			const result = calculateLinkTargetPosition(originalX, [], 3, nodeWidthWithPadding);
			expect(result).toBe(originalX);
		});

		it('should return original position when children count is below threshold', () => {
			const sourceChildren = ['child1', 'child2']; // 2 children
			const result = calculateLinkTargetPosition(
				originalX,
				sourceChildren,
				3, // threshold 3
				nodeWidthWithPadding,
			);
			expect(result).toBe(originalX);
		});

		it('should return original position when children count equals threshold', () => {
			const sourceChildren = ['child1', 'child2', 'child3']; // 3 children
			const result = calculateLinkTargetPosition(
				originalX,
				sourceChildren,
				3, // threshold 3
				nodeWidthWithPadding,
			);
			expect(result).toBe(originalX);
		});

		it('should apply shift when children exceed threshold', () => {
			const sourceChildren = ['child1', 'child2', 'child3', 'child4', 'child5']; // 5 children
			const result = calculateLinkTargetPosition(
				originalX,
				sourceChildren,
				3, // threshold 3 - 2 children stacked
				nodeWidthWithPadding,
			);
			// Expected: 300 + ((5-3) * 100) / 2 = 300 + 100 = 400
			expect(result).toBe(400);
		});

		it('should handle large number of stacked children', () => {
			const sourceChildren = Array.from({ length: 10 }, (_, i) => `child${i + 1}`); // 10 children
			const result = calculateLinkTargetPosition(
				originalX,
				sourceChildren,
				2, // threshold 2 - 8 children stacked
				nodeWidthWithPadding,
			);
			// Expected: 300 + ((10-2) * 100) / 2 = 300 + 400 = 700
			expect(result).toBe(700);
		});

		it('should work with zero original position', () => {
			const sourceChildren = ['child1', 'child2', 'child3', 'child4']; // 4 children
			const result = calculateLinkTargetPosition(
				0, // zero original position
				sourceChildren,
				3, // threshold 3 - 1 child stacked
				nodeWidthWithPadding,
			);
			// Expected: 0 + ((4-3) * 100) / 2 = 0 + 50 = 50
			expect(result).toBe(50);
		});

		it('should work with different node widths', () => {
			const sourceChildren = ['child1', 'child2', 'child3', 'child4']; // 4 children
			const result = calculateLinkTargetPosition(
				originalX,
				sourceChildren,
				3, // threshold 3 - 1 child stacked
				250, // different node width
			);
			// Expected: 300 + ((4-3) * 250) / 2 = 300 + 125 = 425
			expect(result).toBe(425);
		});
	});

	describe('Edge cases and integration', () => {
		it('should handle threshold of 1', () => {
			const children = ['child1', 'child2', 'child3'];
			const nodeResult = calculateNodePosition(100, children, 1, nodeWidthWithPadding);
			const linkResult = calculateLinkTargetPosition(100, children, 1, nodeWidthWithPadding);

			// Expected: 100 + ((3-1) * 100) / 2 = 100 + 100 = 200
			expect(nodeResult).toBe(200);
			expect(linkResult).toBe(200);
		});

		it('should handle very large threshold', () => {
			const children = ['child1', 'child2'];
			const nodeResult = calculateNodePosition(100, children, 1000, nodeWidthWithPadding);
			const linkResult = calculateLinkTargetPosition(100, children, 1000, nodeWidthWithPadding);

			// No stacking needed, should return original
			expect(nodeResult).toBe(100);
			expect(linkResult).toBe(100);
		});

		it('should produce consistent results between node and link calculations', () => {
			const children = ['child1', 'child2', 'child3', 'child4', 'child5'];
			const originalPosition = 250;
			const threshold = 3;

			const nodeResult = calculateNodePosition(
				originalPosition,
				children,
				threshold,
				nodeWidthWithPadding,
			);
			const linkResult = calculateLinkTargetPosition(
				originalPosition,
				children,
				threshold,
				nodeWidthWithPadding,
			);

			// Both should produce the same result
			expect(nodeResult).toBe(linkResult);
			expect(nodeResult).toBe(350); // 250 + ((5-3) * 100) / 2 = 250 + 100
		});
	});
});
