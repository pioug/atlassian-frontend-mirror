import { VCObserverEntry } from '../../../types';

import calculateTTVCPercentiles, { Viewport } from './index';

jest.mock('../../utils/task-yield', () => {
	return jest.fn(() => Promise.resolve());
});

describe('visualCompletionCalc', () => {
	test('full screen rerender', async () => {
		const viewport: Viewport = { width: 1920, height: 860 };

		const createEntry = (time: DOMHighResTimeStamp): VCObserverEntry => {
			return {
				time,
				type: 'mutation:element',
				data: {
					elementName: 'element1',
					rect: new DOMRect(0, 0, viewport.width, viewport.height),
					visible: true,
				},
			};
		};
		const orderedEntries: VCObserverEntry[] = [createEntry(1), createEntry(2), createEntry(3)];

		const checkpoints = await calculateTTVCPercentiles({
			orderedEntries,
			viewport,
			percentiles: [10, 50, 90],
		});
		expect(checkpoints).toBeDefined();

		expect(checkpoints['10'].t).toBe(3);
		expect(checkpoints['10'].e).toEqual(['element1']);

		expect(checkpoints['50'].t).toBe(3);
		expect(checkpoints['50'].e).toEqual(['element1']);

		expect(checkpoints['90'].t).toBe(3);
		expect(checkpoints['90'].e).toEqual(['element1']);
	});
	test('10 section on the page ', async () => {
		const viewport: Viewport = { width: 1920, height: 860 };
		const sectionWidth = viewport.width / 10;

		const createSection = (time: DOMHighResTimeStamp, sectionNo: number): VCObserverEntry => {
			return {
				time,
				type: 'mutation:element',
				data: {
					elementName: `section${sectionNo}`,
					rect: new DOMRect((sectionNo - 1) * sectionWidth, 0, sectionWidth, viewport.height),
					visible: true,
				},
			};
		};
		const orderedEntries: VCObserverEntry[] = [
			{
				time: 1,
				type: 'mutation:element',
				data: {
					elementName: `container`,
					rect: new DOMRect(0, 0, viewport.width, viewport.height),
					visible: true,
				},
			},
			createSection(100, 1),
			createSection(200, 2),
			createSection(300, 3),
			createSection(400, 4),
			createSection(500, 5),
			createSection(600, 6),
			createSection(700, 7),
			createSection(800, 8),
			createSection(900, 9),
			createSection(1000, 10),
		];

		const checkpoints = await calculateTTVCPercentiles({
			orderedEntries,
			viewport,
			percentiles: [10, 50, 90, 95, 99, 100],
		});
		expect(checkpoints).toBeDefined();

		expect(checkpoints['10'].t).toEqual(100);
		expect(checkpoints['10'].e).toEqual(['container', 'section1']);

		expect(checkpoints['50'].t).toEqual(500);
		expect(checkpoints['50'].e).toEqual(['section2', 'section3', 'section4', 'section5']);

		expect(checkpoints['90'].t).toEqual(900);
		expect(checkpoints['90'].e).toEqual(['section6', 'section7', 'section8', 'section9']);

		expect(checkpoints['95'].t).toBe(1000);
		expect(checkpoints['95'].e).toEqual(['section10']);

		expect(checkpoints['99'].t).toBe(1000);
		expect(checkpoints['99'].e).toEqual(['section10']);

		expect(checkpoints['100'].t).toBe(1000);
		expect(checkpoints['100'].e).toEqual(['section10']);
	});
});
