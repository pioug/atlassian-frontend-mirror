import calculateTTVCPercentiles from './index';

jest.mock('../../utils/task-yield', () => {
	return jest.fn(() => Promise.resolve());
});

describe('calculateTTVCPercentiles', () => {
	const viewport = {
		width: 100,
		height: 100,
	};

	test('basic', async () => {
		const metrics = await calculateTTVCPercentiles({
			orderedEntries: [
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
			],
			startTime: 0,
			viewport,
			percentiles: [25, 50, 51, 75, 90, 100],
		});
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

	test('should calculate startTime offset properly', async () => {
		const metrics = await calculateTTVCPercentiles({
			orderedEntries: [
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
			],
			startTime: 50,
			viewport,
			percentiles: [25, 50, 51, 75, 90, 100],
		});
		expect(metrics).toBeDefined();

		expect(metrics['25'].t).toEqual(50);
		expect(metrics['25'].e).toEqual(['container']);

		expect(metrics['50'].t).toEqual(50);
		expect(metrics['50'].e).toEqual(['container']);

		expect(metrics['51'].t).toEqual(150);
		expect(metrics['51'].e).toEqual(['section1']);

		expect(metrics['75'].t).toEqual(150);
		expect(metrics['75'].e).toEqual(['section1']);

		expect(metrics['90'].t).toEqual(150);
		expect(metrics['90'].e).toEqual(['section1']);

		expect(metrics['100'].t).toEqual(150);
		expect(metrics['100'].e).toEqual(['section1']);
	});
});
