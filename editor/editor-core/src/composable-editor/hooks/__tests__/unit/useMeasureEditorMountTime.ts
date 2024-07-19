import { renderHook } from '@testing-library/react-hooks';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as measures from '@atlaskit/editor-common/performance-measures';
import type { ExperienceStore } from '@atlaskit/editor-common/ufo';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';

import measurements from '../../../../utils/performance/measure-enum';
import useMeasureEditorMountTime from '../../useMeasureEditorMountTime';

const mockStopMeasureDuration = 1234;

jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance-measures'),
	startMeasure: jest.fn(),
	clearMeasure: jest.fn(),
	stopMeasure: jest.fn(
		(measureName: string, onMeasureComplete?: (duration: number, startTime: number) => void) => {
			onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
		},
	),
}));

describe('useMeasureEditorMountTime', () => {
	const createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any> = createAnalyticsEventMock();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('for startMeasure', () => {
		const startMeasureSpy = jest.spyOn(measures, 'startMeasure');

		afterEach(() => {
			startMeasureSpy.mockRestore();
		});

		it('only runs once after a rerender', () => {
			const { rerender } = renderHook(() =>
				useMeasureEditorMountTime({}, () => undefined, createAnalyticsEvent as any),
			);
			rerender();
			rerender();

			expect(startMeasureSpy).toHaveBeenCalledTimes(1);
			expect(startMeasureSpy).toHaveBeenCalledWith(measurements.EDITOR_MOUNTED);
		});
	});

	describe('for stopMeasure', () => {
		const stopMeasureSpy = jest.spyOn(measures, 'stopMeasure');

		afterEach(() => {
			stopMeasureSpy.mockRestore();
		});

		it('only runs once after a rerender', () => {
			const { rerender } = renderHook(() =>
				useMeasureEditorMountTime({}, () => undefined, createAnalyticsEvent as any),
			);
			rerender();
			rerender();

			expect(stopMeasureSpy).toHaveBeenCalledTimes(1);
			expect(stopMeasureSpy).toHaveBeenCalledWith(
				measurements.EDITOR_MOUNTED,
				expect.any(Function),
			);
		});
	});

	describe('for clearMeasure', () => {
		const clearMeasureSpy = jest.spyOn(measures, 'clearMeasure');

		afterEach(() => {
			clearMeasureSpy.mockRestore();
		});
		useMeasureEditorMountTime;

		it('should not run on rerender', () => {
			const { rerender } = renderHook(() =>
				useMeasureEditorMountTime({}, () => undefined, createAnalyticsEvent as any),
			);
			rerender();
			rerender();

			expect(clearMeasureSpy).toHaveBeenCalledTimes(0);
		});

		it('should run once on unmount', async () => {
			const { unmount } = renderHook(() =>
				useMeasureEditorMountTime({}, () => undefined, createAnalyticsEvent as any),
			);
			unmount();
			expect(clearMeasureSpy).toHaveBeenCalledTimes(1);
			expect(clearMeasureSpy).toHaveBeenCalledWith(measurements.EDITOR_MOUNTED);
		});

		it('should run ON_EDITOR_READY_CALLBACK on unmount if prop is active', () => {
			const { unmount } = renderHook(() =>
				useMeasureEditorMountTime(
					{
						performanceTracking: {
							onEditorReadyCallbackTracking: { enabled: true },
						},
					},
					() => undefined,
					createAnalyticsEvent as any,
				),
			);
			unmount();
			expect(clearMeasureSpy).toHaveBeenCalledTimes(2);
			expect(clearMeasureSpy).toHaveBeenCalledWith(measurements.ON_EDITOR_READY_CALLBACK);
		});

		it('should run abortAll on experience store on unmount if prop is active', () => {
			const experienceStore = {
				abortAll: jest.fn(),
			} as unknown as ExperienceStore;
			const { unmount } = renderHook(() =>
				useMeasureEditorMountTime(
					{
						featureFlags: {
							ufo: true,
						},
					},
					() => experienceStore,
					createAnalyticsEvent as any,
				),
			);
			unmount();
			expect(experienceStore.abortAll).toHaveBeenCalledTimes(1);
			expect(experienceStore.abortAll).toHaveBeenCalledWith({
				reason: 'editor component unmounted',
			});
		});
	});
});
