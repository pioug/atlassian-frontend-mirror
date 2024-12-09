import { backgroundTask, isTaskAborted } from './backgroundTasks';
import { type CalculateVCOptions, EditorPerformanceMetrics } from './editorPerformanceMetrics';
import { getLatencyPercentiles } from './measurements';
import { TimelineController, type UserEvent } from './timeline';
import type { ViewportDimension } from './types';

jest.mock('./backgroundTasks', () => ({
	backgroundTask: jest.fn(),
	isTaskAborted: jest.fn(),
}));

jest.mock('./measurements', () => {
	const originalModule = jest.requireActual('./measurements');
	return {
		...originalModule,
		getLatencyPercentiles: jest.fn(),
	};
});

describe('EditorPerformanceMetrics', () => {
	let timeline: TimelineController;
	let viewport: ViewportDimension;
	let metrics: EditorPerformanceMetrics;

	beforeEach(() => {
		jest.useFakeTimers({
			doNotFake: ['performance'],
		});
		timeline = new TimelineController();
		viewport = { w: 800, h: 600 };
		metrics = new EditorPerformanceMetrics(timeline, viewport);

		(backgroundTask as jest.Mock).mockImplementation((task) => {
			return {
				result: task(() => Promise.resolve()),
			};
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('calculateLatencyPercents', () => {
		it('should calculate latency percentiles for each user event category', async () => {
			const mockPercentiles = { p50: 100, p85: 200, p90: 300, p95: 400, p99: 500 };
			(getLatencyPercentiles as jest.Mock).mockReturnValue(mockPercentiles);

			const mockEvents: UserEvent[] = [
				{
					type: 'user-event:mouse',
					startTime: 0,
					data: { category: 'mouse', eventName: 'click', duration: 1800, elementName: '' },
				},
				{
					type: 'user-event:keyboard',
					startTime: 0,
					data: { category: 'keyboard', eventName: 'keypress', duration: 1500, elementName: '' },
				},
			];
			const mockGetEventsPerType = jest.spyOn(timeline, 'getEventsPerType').mockImplementation(
				// @ts-expect-error
				(type: string) => {
					return mockEvents;
				},
			);

			const result = await metrics.calculateLatencyPercents();

			expect(mockGetEventsPerType).toHaveBeenCalledTimes(9); // One for each category
			expect(getLatencyPercentiles).toHaveBeenCalledTimes(9);

			expect(result).not.toBeNull();
			expect(result!['mouse']).toEqual(mockPercentiles);
			expect(result!['keyboard']).toEqual(mockPercentiles);
			expect(result!['form']).toEqual(mockPercentiles);
			expect(result!['clipboard']).toEqual(mockPercentiles);
			expect(result!['drag-and-drop']).toEqual(mockPercentiles);
			expect(result!['page-resize']).toEqual(mockPercentiles);
			expect(result!['scroll']).toEqual(mockPercentiles);
			expect(result!['other']).toEqual(mockPercentiles);
		});

		it('should handle task abortion gracefully', async () => {
			(isTaskAborted as unknown as jest.Mock).mockReturnValue(true);

			const result = await metrics.calculateLatencyPercents();

			expect(result).toEqual(null);
		});
	});

	describe('calculateLastHeatmap', () => {
		it('should return null if viewport is null', async () => {
			metrics = new EditorPerformanceMetrics(
				timeline,
				// @ts-expect-error
				null,
			);
			const result = await metrics.calculateLastHeatmap(100);
			expect(result).toBeNull();
		});

		it('should return a heatmap with correct dimensions', async () => {
			const heatmapSize = 100;
			const heatmap = await metrics.calculateLastHeatmap(heatmapSize);
			expect(heatmap).not.toBeNull();
			expect(heatmap).toHaveProperty('width');
			expect(heatmap).toHaveProperty('height');
			expect(heatmap?.width).toBeLessThanOrEqual(heatmapSize);
			expect(heatmap?.height).toBeLessThanOrEqual(heatmapSize);
		});
	});

	describe('calculateVCPercents', () => {
		it('should return null if heatmap is null', async () => {
			metrics = new EditorPerformanceMetrics(
				timeline,
				// @ts-expect-error
				null,
			);
			const options: CalculateVCOptions = {
				ignoreNodeReplacements: false,
				ignoreLayoutShifts: false,
				ignoreElementMoved: false,
				heatmapSize: 100,
			};
			const result = await metrics.calculateVCPercents(options);
			expect(result).toBeNull();
		});

		it('should return VC percents as a record', async () => {
			const options: CalculateVCOptions = {
				ignoreNodeReplacements: false,
				ignoreLayoutShifts: false,
				ignoreElementMoved: false,
				heatmapSize: 100,
			};
			const result = await metrics.calculateVCPercents(options);
			expect(result).toBeInstanceOf(Object);
		});
	});

	describe('calculateVCTargets', () => {
		it('should return null if VCPercents are null', async () => {
			metrics = new EditorPerformanceMetrics(
				timeline,
				// @ts-expect-error
				null,
			);
			const result = await metrics.calculateVCTargets();
			expect(result).toBeNull();
		});

		it('should return VCTargets as a record', async () => {
			const result = await metrics.calculateVCTargets();
			expect(result).toBeInstanceOf(Object);
		});
	});
});
