/* eslint-disable compat/compat */
import {
	cleanSquareHeatmap,
	cloneArray,
	createHeatmapWithAspectRatio,
	getElementRatio,
	type Heatmap,
	type HeatmapEntry,
	type HeatmapRect,
	mapDOMRectToHeatmap,
	transformHeatmap,
	type ViewportDimension,
} from './heatmap';

const entry = (time: DOMHighResTimeStamp): HeatmapEntry => {
	if (time === 0) {
		return {
			head: null,
			previousEntries: [],
		};
	}

	return {
		head: {
			time,
			elementName: null,
			wrapperSectionName: null,
			rect: null,
			source: null,
			ratio: null,
		},
		previousEntries: [],
	};
};

describe('cloneArray', () => {
	it('should clone a 2D array of numbers', () => {
		const original = [[1, 2, 3].map(entry), [4, 5, 6].map(entry)];
		const cloned = cloneArray(original);
		expect(cloned).toEqual(original);
		expect(cloned).not.toBe(original); // Ensure it's a deep clone
	});
});

describe('transformHeatmap', () => {
	it('should transform the heatmap correctly', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const heatmapEntry = {
			time: startTime,
			elementName: null,
			wrapperSectionName: null,
			rect: null,
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			entry: heatmapEntry,
			heatmap,
			transformSource: null,
			onEmptyRow: onEmptyRowMock,
		});

		expect(onEmptyRowMock).not.toHaveBeenCalled();
		expect(heatmap.map).toEqual([
			[startTime, startTime, startTime].map(entry),
			[startTime, startTime, startTime].map(entry),
			[startTime, startTime, startTime].map(entry),
		]);
	});

	it('should fill the previousEntries when replacing a react', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const firstHeatmapEntry = {
			time: startTime,
			elementName: null,
			wrapperSectionName: null,
			rect: null,
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			entry: firstHeatmapEntry,
			heatmap,
			transformSource: null,
			onEmptyRow: onEmptyRowMock,
		});

		const nextRect: HeatmapRect = { left: 0, top: 0, right: 1, bottom: 1 };

		const nextHeatmapEntry = {
			time: startTime + 999,
			elementName: null,
			wrapperSectionName: null,
			rect: null,
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect: nextRect,
			entry: nextHeatmapEntry,
			heatmap,
			transformSource: 'mutation',
			onEmptyRow: onEmptyRowMock,
		});

		expect(heatmap.map[0][0].previousEntries).toHaveLength(1);
		expect(heatmap.map[0][0].previousEntries).toEqual([expect.objectContaining(firstHeatmapEntry)]);
	});
});

describe('getElementRatio', () => {
	it('should calculate the element ratio for a rectangle covering the entire heatmap', () => {
		const rect: HeatmapRect = { left: 0, top: 0, right: 100, bottom: 100 };
		const viewport: ViewportDimension = {
			h: 100,
			w: 100,
		};

		const result = getElementRatio({ rect, viewport });

		expect(result).toBe(1);
	});

	it('should return 0 for a zero-sized rectangle', () => {
		const rect: HeatmapRect = { left: 10, top: 10, right: 10, bottom: 10 };
		const viewport: ViewportDimension = {
			h: 100,
			w: 100,
		};

		const result = getElementRatio({ rect, viewport });
		expect(result).toBe(0);
	});

	it('should return 0 for a zero-sized heatmap', () => {
		const rect: HeatmapRect = { left: 0, top: 0, right: 10, bottom: 10 };
		const viewport: ViewportDimension = {
			h: 0,
			w: 0,
		};

		const result = getElementRatio({ rect, viewport });

		expect(result).toBe(0);
	});

	it('should calculate correctly for a partial rectangle in the heatmap', () => {
		const rect: HeatmapRect = { left: 0, top: 0, right: 50, bottom: 50 };
		const viewport: ViewportDimension = {
			h: 100,
			w: 100,
		};

		const result = getElementRatio({ rect, viewport });

		expect(result).toBe(0.25);
	});

	it('should handle negative coordinates gracefully', () => {
		const rect: HeatmapRect = { left: -10, top: -10, right: 10, bottom: 10 };
		const viewport: ViewportDimension = {
			h: 100,
			w: 100,
		};

		const result = getElementRatio({ rect, viewport });

		// The rectangle's area is 20 * 20 = 400, total heatmap area is 100 * 100 = 10000
		// Ratio should be 400 / 10000 = 0.04
		expect(result).toBe(0.04);
	});

	it('should handle cases where rectangle is larger than heatmap', () => {
		const rect: HeatmapRect = { left: 0, top: 0, right: 200, bottom: 200 };
		const viewport: ViewportDimension = {
			h: 100,
			w: 100,
		};

		const result = getElementRatio({ rect, viewport });

		// The rectangle's area is 200 * 200 = 40000, total heatmap area is 100 * 100 = 10000
		// Ratio should be 40000 / 10000 = 4 (but, logically, it is capped at 1)
		expect(result).toBe(1);
	});
});

describe('cleanSquareHeatmap', () => {
	it('should create a heatmap with width and height equal to size', () => {
		const heatmapSize = 3;
		const result = cleanSquareHeatmap(heatmapSize);

		expect(result).toEqual([[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)]);
	});
});

describe('createHeatmapWithAspectRatio', () => {
	it('should create a heatmap based on viewport aspect ratio - landscape', () => {
		const viewport = { w: 200, h: 100 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(10);
		expect(result.height).toBe(5);
		expect(result.map).toEqual([
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(entry),
		]);
	});

	it('should create a heatmap based on viewport aspect ratio - portrait', () => {
		const viewport = { w: 100, h: 200 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(5);
		expect(result.height).toBe(10);
		expect(result.map).toEqual([
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
			[0, 0, 0, 0, 0].map(entry),
		]);
	});

	it('should create a heatmap based on viewport aspect ratio - square', () => {
		const viewport = { w: 100, h: 100 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(10);
		expect(result.height).toBe(10);
		expect(result.map[0]).toHaveLength(10);
		expect(result.map[9]).toHaveLength(10);
	});

	it('should handle extreme landscape aspect ratio', () => {
		const viewport = { w: 300, h: 100 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(10);
		expect(result.height).toBe(Math.round(10 / 3));

		expect(result.map).toHaveLength(Math.round(10 / 3));
		expect(result.map[0]).toHaveLength(10);
		expect(result.map[result.map.length - 1]).toHaveLength(10);
	});

	it('should handle extreme portrait aspect ratio', () => {
		const viewport = { w: 100, h: 300 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(Math.round(10 / 3));
		expect(result.height).toBe(10);

		expect(result.map).toHaveLength(10);
		expect(result.map[0]).toHaveLength(Math.round(10 / 3));
		expect(result.map[result.map.length - 1]).toHaveLength(Math.round(10 / 3));
	});

	it('should handle zero dimensions in the viewport', () => {
		const viewport = { w: 0, h: 0 };
		const heatmapSize = 10;

		const result = createHeatmapWithAspectRatio({ viewport, heatmapSize });

		expect(result.width).toBe(10);
		expect(result.height).toBe(10);
		expect(result.map).toHaveLength(10);
		expect(result.map[0]).toHaveLength(10);
		expect(result.map[9]).toHaveLength(10);
	});
});

describe('mapDOMRectToHeatmap', () => {
	it('should map a DOMRect to the heatmap dimensions proportionally', () => {
		const rect = new DOMRect(10, 20, 30, 40);
		const heatmap: Heatmap = {
			map: [],
			height: 100,
			width: 200,
			scaleX: 0.1,
			scaleY: 0.2,
		};

		const result = mapDOMRectToHeatmap({ rect, heatmap });

		expect(result).toEqual({
			left: 1,
			right: 4,
			top: 4,
			bottom: 12,
		});
	});

	const testCases = [
		{ viewport: { w: 360, h: 800 }, box: { x: 90, y: 200, width: 250, height: 100 } },
		{ viewport: { w: 1366, h: 768 }, box: { x: 200, y: 150, width: 400, height: 300 } },
		{ viewport: { w: 1536, h: 864 }, box: { x: 50, y: 50, width: 300, height: 400 } },
		{ viewport: { w: 1440, h: 900 }, box: { x: 100, y: 100, width: 500, height: 500 } },
		{ viewport: { w: 1024, h: 768 }, box: { x: 100, y: 150, width: 300, height: 400 } },
		{ viewport: { w: 800, h: 600 }, box: { x: 200, y: 100, width: 400, height: 400 } },
		{ viewport: { w: 1600, h: 900 }, box: { x: 400, y: 200, width: 800, height: 450 } },
		{ viewport: { w: 1366, h: 768 }, box: { x: 341, y: 192, width: 683, height: 384 } },
		{ viewport: { w: 1920, h: 1080 }, box: { x: 100, y: 100, width: 1720, height: 880 } },
		{ viewport: { w: 1920, h: 1080 }, box: { x: 860, y: 490, width: 200, height: 100 } },
		{ viewport: { w: 2560, h: 1440 }, box: { x: 1000, y: 500, width: 560, height: 440 } },
		{ viewport: { w: 1440, h: 900 }, box: { x: 200, y: 100, width: 1040, height: 700 } },
		{ viewport: { w: 1600, h: 900 }, box: { x: 600, y: 300, width: 400, height: 300 } },
		{ viewport: { w: 1280, h: 720 }, box: { x: 400, y: 200, width: 480, height: 320 } },
		{ viewport: { w: 3200, h: 1800 }, box: { x: 600, y: 400, width: 2000, height: 1000 } },
		{ viewport: { w: 1024, h: 768 }, box: { x: 100, y: 50, width: 824, height: 668 } },
		{ viewport: { w: 800, h: 600 }, box: { x: 300, y: 200, width: 200, height: 100 } },
		{ viewport: { w: 3840, h: 2160 }, box: { x: 1000, y: 1000, width: 1840, height: 1160 } },
		{ viewport: { w: 1920, h: 600 }, box: { x: 800, y: 100, width: 320, height: 400 } },
		{ viewport: { w: 2560, h: 1090 }, box: { x: 100, y: 100, width: 2360, height: 890 } },
		{ viewport: { w: 1280, h: 800 }, box: { x: 100, y: 100, width: 1080, height: 600 } },
		{ viewport: { w: 1366, h: 768 }, box: { x: 200, y: 100, width: 966, height: 568 } },
		{ viewport: { w: 1440, h: 2560 }, box: { x: 720, y: 1280, width: 400, height: 800 } },
		{ viewport: { w: 2160, h: 3840 }, box: { x: 500, y: 1000, width: 1200, height: 1800 } },
		{ viewport: { w: 1200, h: 1920 }, box: { x: 300, y: 500, width: 600, height: 800 } },
		{ viewport: { w: 800, h: 1280 }, box: { x: 100, y: 200, width: 600, height: 800 } },
		{ viewport: { w: 1920, h: 1080 }, box: { x: 640, y: 360, width: 960, height: 360 } },
		{ viewport: { w: 1680, h: 1050 }, box: { x: 420, y: 262, width: 840, height: 525 } },
		{ viewport: { w: 2560, h: 1440 }, box: { x: 100, y: 100, width: 2360, height: 1240 } },
		{ viewport: { w: 1366, h: 768 }, box: { x: 341, y: 192, width: 683, height: 384 } },
		{ viewport: { w: 480, h: 854 }, box: { x: 120, y: 213, width: 240, height: 427 } },
		{ viewport: { w: 1125, h: 2436 }, box: { x: 281, y: 609, width: 563, height: 1218 } },
		{ viewport: { w: 1242, h: 2688 }, box: { x: 310, y: 672, width: 621, height: 1344 } },
	];

	const heatmapSize = 200;
	describe.each(testCases)(
		'Test case: %# - validate heatmap element ratio',
		({ viewport, box }) => {
			it('should return the same ratio from the original viewport', () => {
				const heatmap = createHeatmapWithAspectRatio({ viewport, heatmapSize });

				const rect = new DOMRect(box.x, box.y, box.width, box.height);
				const originalRatio = getElementRatio({ rect, viewport });

				const mappedRect = mapDOMRectToHeatmap({ rect, heatmap });
				const mappedRatio = getElementRatio({
					rect: mappedRect,
					viewport: {
						w: heatmap.width,
						h: heatmap.height,
					},
				});

				expect(originalRatio).toEqual(mappedRatio);
			});
		},
	);
});

describe('transformHeatmap', () => {
	it('should set source to "replacement" when entry has the same dimensions and elementName', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const initialEntry = {
			time: startTime,
			elementName: 'testElement',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			transformSource: 'mutation',
			entry: initialEntry,
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		// Create a new entry with the same dimensions and elementName
		const newEntry = {
			time: startTime + 1000,
			elementName: 'testElement',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			entry: newEntry,
			transformSource: 'mutation',
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		expect(heatmap.map[0][0].head).toEqual(
			expect.objectContaining({
				source: 'mutation:node-replacement',
				elementName: 'testElement',
			}),
		);
	});

	it('should not set source to "replacement" if dimensions are different', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const initialEntry = {
			time: startTime,
			elementName: 'testElement',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			entry: initialEntry,
			transformSource: 'mutation',
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		// Create a new entry with different dimensions
		const newEntry = {
			time: startTime + 1000,
			elementName: 'testElement',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 2, bottom: 2 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect: { left: 0, top: 0, right: 2, bottom: 2 },
			entry: newEntry,
			transformSource: 'mutation',
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		expect(heatmap.map[0][0].head).toEqual(
			expect.objectContaining({
				source: 'mutation',
				elementName: 'testElement',
			}),
		);
		expect(heatmap.map[0][0].previousEntries).toHaveLength(1);
	});

	it('should not set source to "replacement" if elementName is different', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const initialEntry = {
			time: startTime,
			elementName: 'testElement1',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			transformSource: 'mutation',
			entry: initialEntry,
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		// Create a new entry with a different elementName
		const newEntry = {
			time: startTime + 1000,
			elementName: 'testElement2',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			transformSource: 'mutation',
			entry: newEntry,
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		expect(heatmap.map[0][0].head).toEqual(
			expect.objectContaining({
				source: 'mutation',
				elementName: 'testElement2',
			}),
		);
		expect(heatmap.map[0][0].previousEntries).toHaveLength(1);
	});

	it('should not set source to "replacement" if transformSource is not mutation', () => {
		const heatmap: Heatmap = {
			map: [[0, 0, 0].map(entry), [0, 0, 0].map(entry), [0, 0, 0].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};

		const rect: HeatmapRect = { left: 0, top: 0, right: 3, bottom: 3 };
		const startTime = 123456;
		const onEmptyRowMock = jest.fn();
		const initialEntry = {
			time: startTime,
			elementName: 'testElement1',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			transformSource: 'mutation',
			entry: initialEntry,
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		// Create a new entry with a different elementName
		const newEntry = {
			time: startTime + 1000,
			elementName: 'testElement',
			wrapperSectionName: null,
			rect: { left: 0, top: 0, right: 3, bottom: 3 },
			source: null,
			ratio: null,
		};

		transformHeatmap({
			rect,
			transformSource: 'layout-shift',
			entry: newEntry,
			heatmap,
			onEmptyRow: onEmptyRowMock,
		});

		expect(heatmap.map[0][0].head).toEqual(
			expect.objectContaining({
				source: 'layout-shift',
				elementName: 'testElement',
			}),
		);
		expect(heatmap.map[0][0].previousEntries).toHaveLength(1);
	});
});
