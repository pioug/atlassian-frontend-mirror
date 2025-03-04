import calculateUnionArea from './calc-union-area';

describe('calculateUnionArea', () => {
	it('non overlapping rectangle', () => {
		const totalArea = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(10, 0, 10, 10),
			new DOMRect(20, 0, 10, 10),
		]);
		expect(totalArea).toEqual(300);
	});

	it('three exactly overlapping rectangle', () => {
		const totalArea = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(0, 0, 10, 10),
			new DOMRect(0, 0, 10, 10),
		]);
		expect(totalArea).toEqual(100);
	});

	it('three overlapping rectangle - smaller inside', () => {
		const totalArea = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(1, 1, 7, 7),
			new DOMRect(2, 2, 5, 5),
		]);
		expect(totalArea).toEqual(100);
	});

	it('three partial overlapping rectangle on x axis', () => {
		const totalArea = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(5, 0, 10, 10),
			new DOMRect(7, 0, 10, 10),
		]);
		expect(totalArea).toEqual(170);
	});

	it('three partial overlapping rectangle on y axis', () => {
		const totalArea = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(0, 5, 10, 10),
			new DOMRect(0, 7, 10, 10),
		]);
		expect(totalArea).toEqual(170);
	});

	// Edge cases
	it('should return 0 for empty array', () => {
		expect(calculateUnionArea([])).toBe(0);
	});

	it('should handle single rectangle', () => {
		expect(calculateUnionArea([new DOMRect(0, 0, 5, 5)])).toBe(25);
	});

	// Complex overlapping scenarios
	it('should handle cross-shaped overlapping rectangles', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 5, 15, 5), // horizontal rectangle
			new DOMRect(5, 0, 5, 15), // vertical rectangle
		]);
		expect(area).toBe(125); // 15*5 + 15*5 - 5*5(overlap)
	});

	it('should handle L-shaped arrangement', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 0, 5, 10), // vertical part
			new DOMRect(0, 5, 10, 5), // horizontal part
		]);
		expect(area).toBe(75); // 5*10 + 5*5
	});

	it('should handle stair-like arrangement', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(5, 5, 10, 10),
			new DOMRect(10, 10, 10, 10),
		]);
		expect(area).toBe(250); // Total area minus overlaps
	});

	// Negative coordinates
	it('should handle rectangles with negative coordinates', () => {
		const area = calculateUnionArea([new DOMRect(-10, -10, 10, 10), new DOMRect(-5, -5, 10, 10)]);
		expect(area).toBe(175); // Total area considering overlap
	});

	// Different sizes
	it('should handle rectangles of very different sizes', () => {
		const area = calculateUnionArea([new DOMRect(0, 0, 100, 100), new DOMRect(25, 25, 2, 2)]);
		expect(area).toBe(10000); // Large rectangle area (small one completely inside)
	});

	// Multiple overlaps
	it('should handle multiple partial overlaps', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(5, 0, 10, 10),
			new DOMRect(10, 0, 10, 10),
			new DOMRect(5, 5, 10, 10),
		]);
		expect(area).toBe(250); // Total area considering all overlaps
	});

	// Complex arrangements
	it('should handle complex zigzag arrangement', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(5, 5, 10, 10),
			new DOMRect(0, 10, 10, 10),
			new DOMRect(5, 15, 10, 10),
		]);
		expect(area).toBe(325); // Total area with zigzag pattern
	});

	// Edge alignment
	it('should handle rectangles aligned at edges', () => {
		const area = calculateUnionArea([
			new DOMRect(0, 0, 10, 10),
			new DOMRect(10, 0, 10, 10),
			new DOMRect(20, 0, 10, 10),
			new DOMRect(0, 10, 30, 10),
		]);
		expect(area).toBe(600); // 30 * 20
	});

	it('should handle floating point coordinates', () => {
		const area = calculateUnionArea([
			new DOMRect(0.5, 0.5, 10.5, 10.5), //110.25
			new DOMRect(5.5, 5.5, 10.5, 10.5), // 110.25
		]);
		expect(area).toBeCloseTo(190.25, 4);
	});
});
