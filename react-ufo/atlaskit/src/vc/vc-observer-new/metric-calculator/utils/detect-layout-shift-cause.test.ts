import type { VCObserverEntry, ViewportEntryData } from '../../types';

import { detectLayoutShiftCause } from './detect-layout-shift-cause';

/**
 * Avoid using the native `DOMRect` here as it crashes the test runner when Jest deep-copies values for matcher output.
 * e.g. TypeError: Cannot read private member #channel from an object whose class did not declare it
 */
const makeRect = (x: number, y: number, width: number, height: number) =>
	({ x, y, width, height } as unknown as DOMRect);

const makeViewportEntry = (
	time: number,
	data: ViewportEntryData,
): VCObserverEntry & { data: ViewportEntryData } => ({
	time,
	data,
});

const makeLayoutShiftEntryData = (rect: DOMRect, previousRect: DOMRect): ViewportEntryData => ({
	type: 'layout-shift',
	elementName: 'LS',
	rect,
	previousRect,
	visible: true,
});

describe('detectLayoutShiftCause', () => {
	it('happy path: one viewport entry (`mutation:element`) added above causes downward shift; layout-shift is 20ms after', () => {
		const startTime = 0;
		const offenderTime = 100;
		const checkpointTime = offenderTime + 20;

		const offender: ViewportEntryData = {
			type: 'mutation:element',
			elementName: 'NEW_ABOVE',
			rect: makeRect(0, 0, 20, 20),
			visible: true,
		};

		const layoutShiftEntries: ViewportEntryData[] = [
			makeLayoutShiftEntryData(
				// element moved down by 20px
				makeRect(0, 20, 100, 100),
				makeRect(0, 0, 100, 100),
			),
		];

		const { layoutShiftVariables, layoutShiftOffenders } = detectLayoutShiftCause({
			viewportEntries: [makeViewportEntry(offenderTime, offender)],
			layoutShiftEntries,
			time: checkpointTime,
			startTime,
		});

		expect(layoutShiftVariables).toEqual({
			allHaveRects: true,
			allMovedSameWay: true,
			allMovedSameAmount: true,
			deltaX: 0,
			deltaY: 20,
		});

		expect(layoutShiftOffenders).toHaveLength(1);
		expect(layoutShiftOffenders[0]).toEqual(
			expect.objectContaining({
				offender: offender.elementName,
				happenedBefore: true,
				isAbove: 'all',
				isLeft: 'none',
				isRight: 'none',
				hasHorizontalOverlap: 'all',
				hasVerticalOverlap: 'none',
				matchesLayoutShiftDelta: false,
			}),
		);
	});

	it('classifies offender against multiple layout-shift entries as all/some/none', () => {
		const startTime = 0;
		const offenderTime = 100;
		const checkpointTime = offenderTime + 20;

		const offender: ViewportEntryData = {
			type: 'mutation:element',
			elementName: 'NEW_PARTIALLY_ABOVE',
			rect: makeRect(0, 0, 10, 40), // bottom=40
			visible: true,
		};

		const layoutShiftEntries: ViewportEntryData[] = [
			makeLayoutShiftEntryData(
				// element moved down by 20px
				makeRect(0, 20, 100, 100), // top=20
				makeRect(0, 0, 100, 100),
			),
			makeLayoutShiftEntryData(
				// element moved down by 20px
				makeRect(0, 50, 100, 100), // top=50
				makeRect(0, 30, 100, 100),
			),
		];

		const { layoutShiftVariables, layoutShiftOffenders } = detectLayoutShiftCause({
			viewportEntries: [makeViewportEntry(offenderTime, offender)],
			layoutShiftEntries,
			time: checkpointTime,
			startTime,
		});

		expect(layoutShiftVariables).toEqual({
			allHaveRects: true,
			allMovedSameWay: true,
			allMovedSameAmount: true,
			deltaX: 0,
			deltaY: 20,
		});

		expect(layoutShiftOffenders).toHaveLength(1);
		expect(layoutShiftOffenders[0]).toEqual(
			expect.objectContaining({
				offender: offender.elementName,
				happenedBefore: true,
				isAbove: 'some',
				hasVerticalOverlap: 'some',
				hasHorizontalOverlap: 'all',
				isLeft: 'none',
				isRight: 'none',
			}),
		);
	});

	it('happy path (transitions): time is relative to startTime, while entries are absolute', () => {
		const startTime = 1000;
		const offenderAbsoluteTime = 1100;
		const checkpointRelativeTime = 120; // => checkpoint absolute time 1120

		const offender: ViewportEntryData = {
			type: 'mutation:element',
			elementName: 'NEW_ABOVE',
			rect: makeRect(0, 0, 20, 20),
			visible: true,
		};

		const layoutShiftEntries: ViewportEntryData[] = [
			makeLayoutShiftEntryData(makeRect(0, 20, 100, 100), makeRect(0, 0, 100, 100)),
		];

		const { layoutShiftOffenders } = detectLayoutShiftCause({
			viewportEntries: [makeViewportEntry(offenderAbsoluteTime, offender)],
			layoutShiftEntries,
			time: checkpointRelativeTime,
			startTime,
		});

		expect(layoutShiftOffenders).toHaveLength(1);
		expect(layoutShiftOffenders[0].happenedBefore).toBe(true);
	});

	it('happy path (initial load): startTime=0, component added on the left causes layout shift to the right', () => {
		const startTime = 0;
		const offenderTime = 10;
		const checkpointTime = 30;

		const offender: ViewportEntryData = {
			type: 'mutation:element',
			elementName: 'NEW_LEFT',
			rect: makeRect(0, 0, 20, 100),
			visible: true,
		};

		const layoutShiftEntries: ViewportEntryData[] = [
			makeLayoutShiftEntryData(
				// element moved right by 20px
				makeRect(20, 0, 100, 100),
				makeRect(0, 0, 100, 100),
			),
		];

		const { layoutShiftVariables, layoutShiftOffenders } = detectLayoutShiftCause({
			viewportEntries: [makeViewportEntry(offenderTime, offender)],
			layoutShiftEntries,
			time: checkpointTime,
			startTime,
		});

		expect(layoutShiftVariables).toEqual({
			allHaveRects: true,
			allMovedSameWay: true,
			allMovedSameAmount: true,
			deltaX: 20,
			deltaY: 0,
		});

		expect(layoutShiftOffenders).toHaveLength(1);
		expect(layoutShiftOffenders[0]).toEqual(
			expect.objectContaining({
				offender: offender.elementName,
				happenedBefore: true,
				isLeft: 'all',
				isAbove: 'none',
				hasVerticalOverlap: 'all',
				hasHorizontalOverlap: 'none',
			}),
		);
	});
});
