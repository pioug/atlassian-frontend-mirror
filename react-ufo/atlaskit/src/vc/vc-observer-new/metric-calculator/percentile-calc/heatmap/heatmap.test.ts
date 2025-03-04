import Heatmap from './heatmap';

jest.mock('../../utils/task-yield', () => {
	return jest.fn(() => Promise.resolve());
});

describe('Heatmap', () => {
	describe('constructor', () => {
		test('create correct matrix size', () => {
			const heatmap = new Heatmap({
				viewport: {
					width: 400,
					height: 400,
				},
				heatmapSize: 200,
			});

			const map = heatmap.getHeatmap();

			expect(map.length).toEqual(200);
			expect(map[0].length).toEqual(200);
		});
		test('viewport width 0', () => {
			const heatmap = new Heatmap({
				viewport: {
					width: 0,
					height: 400,
				},
				heatmapSize: 200,
			});

			const map = heatmap.getHeatmap();

			expect(map.length).toEqual(200);
			expect(map[0].length).toEqual(200);
		});
		test('viewport height 0', () => {
			const heatmap = new Heatmap({
				viewport: {
					width: 400,
					height: 0,
				},
				heatmapSize: 200,
			});

			const map = heatmap.getHeatmap();

			expect(map.length).toEqual(200);
			expect(map[0].length).toEqual(200);
		});

		test('heatmapSize exceed Max', () => {
			const heatmap = new Heatmap({
				viewport: {
					width: 200,
					height: 200,
				},
				heatmapSize: 10000,
			});

			const map = heatmap.getHeatmap();

			expect(map.length).toEqual(1000);
			expect(map[0].length).toEqual(1000);
		});
	});

	describe('applyEntriesToHeatmap', () => {
		let heatmap: Heatmap;
		beforeEach(() => {
			heatmap = new Heatmap({
				viewport: {
					width: 10,
					height: 10,
				},
				heatmapSize: 10,
			});
		});
		test('basic', async () => {
			await heatmap.applyEntriesToHeatmap([
				{
					time: 100,
					type: 'mutation:element',
					data: {
						elementName: 'container',
						visible: true,
						rect: new DOMRect(0, 0, 10, 10),
					},
				},
			]);
			const map = heatmap.getHeatmap();

			expect(map).toBeDefined();
			for (const row of map) {
				for (const cell of row) {
					expect(cell.head).toBeDefined();
					expect(cell.head?.elementName).toBe('container');
					expect(cell.head?.time).toBe(100);
					expect(cell.head?.ratio).toBe(1);
				}
			}
		});

		test('child element mounted', async () => {
			await heatmap.applyEntriesToHeatmap([
				{
					time: 100,
					type: 'mutation:child-element',
					data: {
						elementName: 'child1',
						visible: true,
						rect: new DOMRect(0, 0, 5, 5),
					},
				},
				{
					time: 100,
					type: 'mutation:element',
					data: {
						elementName: 'container',
						visible: true,
						rect: new DOMRect(0, 0, 10, 10),
					},
				},
			]);
			const map = heatmap.getHeatmap();

			expect(map).toBeDefined();
			const cell = map[1][1];
			expect(cell.head?.elementName).toEqual('child1');
			expect(cell.head?.time).toEqual(100);
			expect(cell.head?.ratio).toEqual(0.25);

			expect(cell.previousEntries[0].elementName).toEqual('container');
			expect(cell.previousEntries[0].time).toEqual(100);
			expect(cell.previousEntries[0].ratio).toEqual(1);
			expect(cell.previousEntries[0].rect?.left).toEqual(0);
			expect(cell.previousEntries[0].rect?.right).toEqual(10);
			expect(cell.previousEntries[0].rect?.top).toEqual(0);
			expect(cell.previousEntries[0].rect?.bottom).toEqual(10);
			expect(cell.previousEntries[0].source).toEqual('mutation:parent-mounted');
		});
	});

    describe('getVCPercentMetrics', () => {
		let heatmap: Heatmap;
		beforeEach(() => {
			heatmap = new Heatmap({
				viewport: {
					width: 100,
					height: 100,
				},
				heatmapSize: 100,
			});
		});
		test('basic', async () => {
			await heatmap.applyEntriesToHeatmap([
				{
					time: 100,
					type: 'mutation:element',
					data: {
						elementName: 'container',
						visible: true,
						rect: new DOMRect(0, 0, 100, 100),
					},
				},
				{
					time: 200,
					type: 'mutation:element',
					data: {
						elementName: 'section1',
						visible: true,
						rect: new DOMRect(0, 0, 50, 100),
					},
				},
			]);
			const metrics = await heatmap.getVCPercentMetrics([25, 50, 51, 75, 90, 100]);
			expect(metrics).toBeDefined();

			expect(metrics['25'].t).toEqual(100);
			expect(metrics['25'].e).toEqual(['container']);

			expect(metrics['50'].t).toEqual(100);
			expect(metrics['50'].e).toEqual(['container']);

            expect(metrics['51'].t).toEqual(200);
			expect(metrics['51'].e).toEqual(['section1']);

            expect(metrics['75'].t).toEqual(200);
			expect(metrics['75'].e).toEqual(['section1']);

			expect(metrics['90'].t).toEqual(200);
			expect(metrics['90'].e).toEqual(['section1']);

			expect(metrics['100'].t).toEqual(200);
			expect(metrics['100'].e).toEqual(['section1']);
		});
	});
});
