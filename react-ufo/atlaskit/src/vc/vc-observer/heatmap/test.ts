import { ViewportUpdateClassifier } from '../revisions/ViewportUpdateClassifier';

import { MultiRevisionHeatmap } from './heatmap';

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
