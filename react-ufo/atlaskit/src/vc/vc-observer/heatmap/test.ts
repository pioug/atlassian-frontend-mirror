import { getPageVisibilityState } from '../../../hidden-timing';
import { ViewportUpdateClassifier } from '../revisions/ViewportUpdateClassifier';

import { MultiRevisionHeatmap } from './heatmap';

jest.mock('../../../hidden-timing', () => ({
	getPageVisibilityState: jest.fn(),
}));

const mockBox = (extend: object) => ({
	top: 0,
	left: 0,
	width: 0,
	height: 0,
	right: 0,
	bottom: 0,
	x: 0,
	y: 0,
	toJSON() {
		return {};
	},
	...extend,
});

class mockRevision extends ViewportUpdateClassifier {
	revision = 'mock.01';
	types = ['mock'];
	filters = [{ name: 'mock', filter: () => true }];

	constructor() {
		super();
		this.mergeConfig();
	}
}

describe('Heatmap supporting values for multiple revisions', () => {
	let heatmap: MultiRevisionHeatmap;
	beforeEach(() => {
		heatmap = new MultiRevisionHeatmap({
			viewport: { w: 100, h: 100 },
			revisions: [
				{ name: 'fy24.01', classifier: new mockRevision() },
				{ name: 'fy25.01', classifier: new mockRevision() },
				{ name: 'fy25.02', classifier: new mockRevision() },
			],
			arraySize: { w: 10, h: 10 },
		});
	});

	test('captures not overlapping elements', () => {
		heatmap.handleUpdate({
			time: 10,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 15,
				left: 15,
				width: 55,
				height: 55,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		heatmap.handleUpdate({
			time: 20,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 85,
				left: 85,
				width: 10,
				height: 90,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		const data = heatmap.getData();

		const result = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10,
			0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 10,
			10, 10, 10, 10, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20,
		];

		expect(Array.from(data.heatmaps[0])).toEqual(result);
		expect(Array.from(data.heatmaps[1])).toEqual(result);
		expect(Array.from(data.heatmaps[2])).toEqual(result);
	});

	test('captures overlapping elements', () => {
		heatmap.handleUpdate({
			time: 10,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 15,
				left: 15,
				width: 55,
				height: 55,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		heatmap.handleUpdate({
			time: 20,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 15,
				left: 25,
				width: 10,
				height: 90,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		const data = heatmap.getData();

		const result = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 20, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20, 10, 10, 10,
			0, 0, 0, 0, 10, 20, 20, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20, 10, 10, 10, 0, 0, 0, 0, 10, 20,
			20, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20, 10, 10, 10, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0,
			0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0,
		];

		expect(Array.from(data.heatmaps[0])).toEqual(result);
		expect(Array.from(data.heatmaps[1])).toEqual(result);
		expect(Array.from(data.heatmaps[2])).toEqual(result);
	});

	test('captures overlapping elements when approximate', () => {
		heatmap.handleUpdate({
			time: 10,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 15,
				left: 15,
				width: 20,
				height: 20,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		heatmap.handleUpdate({
			time: 20,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 15,
				left: 38,
				width: 10,
				height: 90,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		const data = heatmap.getData();

		const result = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 20, 20, 0, 0, 0, 0, 0, 0, 10, 10, 20, 20, 0, 0, 0, 0,
			0, 0, 10, 10, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0,
			0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 0, 0,
			0, 0, 0, 0, 0, 0, 20, 20, 0, 0, 0, 0, 0,
		];

		expect(Array.from(data.heatmaps[0])).toEqual(result);
		expect(Array.from(data.heatmaps[1])).toEqual(result);
		expect(Array.from(data.heatmaps[2])).toEqual(result);
	});

	test('captures revisions separately', () => {
		heatmap.handleUpdate({
			time: 10,
			classification: [true, true, true],
			intersectionRect: mockBox({
				top: 10,
				left: 10,
				width: 20,
				height: 20,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		heatmap.handleUpdate({
			time: 20,
			classification: [false, true, true],
			intersectionRect: mockBox({
				top: 30,
				left: 30,
				width: 30,
				height: 30,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		heatmap.handleUpdate({
			time: 30,
			classification: [false, true, false],
			intersectionRect: mockBox({
				top: 60,
				left: 30,
				width: 20,
				height: 20,
			}),
			onError: () => {},
			element: document.createElement('a'),
			targetName: 'a',
			type: 'html',
		});

		const data = heatmap.getData();

		const resultFY2401 = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,
		];

		const resultFY2501 = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 0, 0,
			0, 0, 0, 0, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		];

		const resultFY2502 = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		];

		expect(Array.from(data.heatmaps[0])).toEqual(resultFY2401);
		expect(Array.from(data.heatmaps[1])).toEqual(resultFY2501);
		expect(Array.from(data.heatmaps[2])).toEqual(resultFY2502);
	});
});

describe('getPayloadShapedData function', () => {
	let heatmap: MultiRevisionHeatmap;
	const mockProcessDataArgs = {
		VCParts: [90],
		VCCalculationMethods: [jest.fn(), jest.fn(), jest.fn()],
		clean: true,
		isEventAborted: false,
		interactionStart: 0,
		ttai: 5000,
		filterComponentsLog: [jest.fn(), jest.fn(), jest.fn()],
	};

	beforeEach(() => {
		heatmap = new MultiRevisionHeatmap({
			viewport: { w: 100, h: 100 },
			revisions: [
				{ name: 'fy24.01', classifier: new mockRevision() },
				{ name: 'fy25.01', classifier: new mockRevision() },
				{ name: 'fy25.02', classifier: new mockRevision() },
			],
			arraySize: { w: 10, h: 10 },
		});

		jest.spyOn(heatmap as any, 'processData').mockReturnValue([
			{
				VC: { '90': 1000 },
				VCBox: { '90': new Set(['element1']) },
			},
			{
				VC: { '90': 2000 },
				VCBox: { '90': new Set(['element2']) },
			},
			{
				VC: { '90': 0 },
				VCBox: {},
			},
		]);
	});

	test('handles empty VCParts', () => {
		const argsWithEmptyVCParts = { ...mockProcessDataArgs, VCParts: [] };
		const payload = heatmap.getPayloadShapedData(argsWithEmptyVCParts);
		const expectedPayload = [
			{
				revision: 'fy24.01',
				vcDetails: {},
				clean: true,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.01',
				vcDetails: {},
				clean: true,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.02',
				vcDetails: {},
				clean: true,
				'metric:vc90': null,
			},
		];
		expect(payload).toEqual(expectedPayload);
	});

	test('handles non-clean data', () => {
		const argsWithNonCleanData = { ...mockProcessDataArgs, clean: false };
		(getPageVisibilityState as jest.Mock).mockReturnValue('visible');
		const payload = heatmap.getPayloadShapedData(argsWithNonCleanData);
		expect(payload).toEqual([
			{
				revision: 'fy24.01',
				vcDetails: { '90': { t: 1000, e: ['element1'] } },
				clean: false,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.01',
				vcDetails: { '90': { t: 2000, e: ['element2'] } },
				clean: false,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.02',
				vcDetails: { '90': { t: 0, e: [] } },
				clean: false,
				'metric:vc90': null,
			},
		]);
	});

	test('handles multiple page visibility scenarios', () => {
		(getPageVisibilityState as jest.Mock).mockImplementation(() => 'prerender');
		const payload = heatmap.getPayloadShapedData(mockProcessDataArgs);
		expect(payload.every((p) => p['metric:vc90'] === null)).toBe(true);
	});

	test('handles non-existent VC Parts', () => {
		const argsWithNonExistentVCParts = { ...mockProcessDataArgs, VCParts: [999] };
		const payload = heatmap.getPayloadShapedData(argsWithNonExistentVCParts);
		expect(payload).toEqual([
			{
				revision: 'fy24.01',
				vcDetails: { '999': { t: 0, e: [] } },
				clean: true,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.01',
				vcDetails: { '999': { t: 0, e: [] } },
				clean: true,
				'metric:vc90': null,
			},
			{
				revision: 'fy25.02',
				vcDetails: { '999': { t: 0, e: [] } },
				clean: true,
				'metric:vc90': null,
			},
		]);
	});

	test('handles empty revision list', () => {
		const heatmapWithNoRevisions = new MultiRevisionHeatmap({
			viewport: { w: 100, h: 100 },
			revisions: [],
			arraySize: { w: 10, h: 10 },
		});
		const payload = heatmapWithNoRevisions.getPayloadShapedData(mockProcessDataArgs);
		expect(payload).toEqual([]);
	});

	test('handles edge case values', () => {
		const extremeArgs = {
			...mockProcessDataArgs,
			interactionStart: Number.MAX_SAFE_INTEGER,
			ttai: Number.MAX_SAFE_INTEGER,
		};
		(getPageVisibilityState as jest.Mock).mockReturnValue('hidden');
		const payload = heatmap.getPayloadShapedData(extremeArgs);
		expect(payload.every((p) => p['metric:vc90'] === null)).toBe(true);
	});

	test('handles single revision', () => {
		const singleRevisionHeatmap = new MultiRevisionHeatmap({
			viewport: { w: 100, h: 100 },
			revisions: [{ name: 'fy24.01', classifier: new mockRevision() }],
			arraySize: { w: 10, h: 10 },
		});
		(singleRevisionHeatmap as any).processData = jest.fn().mockReturnValue([
			{
				VC: { '90': 1500 },
				VCBox: { '90': new Set(['element3']) },
			},
		]);
		(getPageVisibilityState as jest.Mock).mockReturnValue('visible');
		const payload = singleRevisionHeatmap.getPayloadShapedData(mockProcessDataArgs);
		expect(payload).toEqual([
			{
				revision: 'fy24.01',
				vcDetails: { '90': { t: 1500, e: ['element3'] } },
				clean: true,
				'metric:vc90': 1500,
			},
		]);
	});
});

describe('MultiRevisionHeatmap', () => {
	// Constructor tests
	describe('constructor', () => {
		test('initializes with default array size when not provided', () => {
			const heatmap = new MultiRevisionHeatmap({
				viewport: { w: 100, h: 100 },
				revisions: [{ name: 'test', classifier: new mockRevision() }],
			});
			expect(heatmap.arraySize).toEqual({ w: 200, h: 200 });
		});
		test('initializes with custom array size when provided', () => {
			const heatmap = new MultiRevisionHeatmap({
				viewport: { w: 100, h: 100 },
				revisions: [{ name: 'test', classifier: new mockRevision() }],
				arraySize: { w: 50, h: 50 },
			});
			expect(heatmap.arraySize).toEqual({ w: 50, h: 50 });
		});
		test('initializes empty components logs and vc ratios for each revision', () => {
			const heatmap = new MultiRevisionHeatmap({
				viewport: { w: 100, h: 100 },
				revisions: [
					{ name: 'rev1', classifier: new mockRevision() },
					{ name: 'rev2', classifier: new mockRevision() },
				],
			});
			expect(heatmap.componentsLogs).toHaveLength(2);
			expect(heatmap.vcRatios).toHaveLength(2);
			expect(heatmap.componentsLogs[0]).toEqual({});
			expect(heatmap.vcRatios[0]).toEqual({});
		});
	});

	// Error handling tests
	describe('error handling', () => {
		let heatmap: MultiRevisionHeatmap;
		let onErrorMock: jest.Mock;
		beforeEach(() => {
			heatmap = new MultiRevisionHeatmap({
				viewport: { w: 100, h: 100 },
				revisions: [{ name: 'test', classifier: new mockRevision() }],
				arraySize: { w: 10, h: 10 },
			});
			onErrorMock = jest.fn();
		});
		test('handles invalid intersection rectangle coordinates', () => {
			heatmap.handleUpdate({
				time: 10,
				classification: [true],
				intersectionRect: mockBox({
					top: -10,
					left: -10,
					width: 5,
					height: 5,
				}),
				onError: onErrorMock,
				element: document.createElement('div'),
				targetName: 'test',
				type: 'html',
			});
			expect(onErrorMock).not.toHaveBeenCalled();
			const data = heatmap.getData();
			// Should handle negative coordinates gracefully
			expect(Array.from(data.heatmaps[0])).toContain(0);
		});
		test('handles intersection rectangle larger than viewport', () => {
			heatmap.handleUpdate({
				time: 10,
				classification: [true],
				intersectionRect: mockBox({
					top: 0,
					left: 0,
					width: 200,
					height: 200,
				}),
				onError: onErrorMock,
				element: document.createElement('div'),
				targetName: 'test',
				type: 'html',
			});
			expect(onErrorMock).not.toHaveBeenCalled();
			const data = heatmap.getData();
			// Should clip to array size
			expect(Array.from(data.heatmaps[0]).length).toBe(100); // 10x10
		});
	});

	// Static method tests
	describe('static methods', () => {
		test('makeVCReturnObj creates correct structure', () => {
			const result = MultiRevisionHeatmap.makeVCReturnObj([90, 95, 99]);
			expect(result).toEqual({
				'90': null,
				'95': null,
				'99': null,
			});
		});
		test('makeVCReturnObj handles empty array', () => {
			const result = MultiRevisionHeatmap.makeVCReturnObj([]);
			expect(result).toEqual({});
		});
	});
});
