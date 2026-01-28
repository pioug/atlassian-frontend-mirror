import { fg } from '@atlaskit/platform-feature-flags';

import { getEarliestHiddenTiming, getPageVisibilityState, setupHiddenTimingCapture } from '../../index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

const mockedFg = fg as jest.MockedFunction<typeof fg>;

const performanceWithEntries = window.performance as Performance & {
	getEntriesByType?: Performance['getEntriesByType'];
};

const createVisibilityEntry = (name: 'hidden' | 'visible', startTime: number): PerformanceEntry =>
	({
		name,
		entryType: 'visibility-state',
		startTime,
		duration: 0,
		toJSON() {
			return {
				name,
				entryType: 'visibility-state',
				startTime,
				duration: 0,
			};
		},
	} as PerformanceEntry);

const originalGetEntriesByType = performanceWithEntries.getEntriesByType;

beforeAll(() => {
	if (typeof performanceWithEntries.getEntriesByType !== 'function') {
		Object.defineProperty(performanceWithEntries, 'getEntriesByType', {
			configurable: true,
			writable: true,
			value: jest.fn(),
		});
	}
});

afterAll(() => {
	if (originalGetEntriesByType) {
		performanceWithEntries.getEntriesByType = originalGetEntriesByType;
	} else {
		Object.defineProperty(performanceWithEntries, 'getEntriesByType', {
			configurable: true,
			writable: true,
			value: undefined,
		});
	}
});

beforeEach(() => {
	mockedFg.mockReset();
	mockedFg.mockReturnValue(false);
});

describe('hidden-timing without timings', () => {
	it('should return visible as default value when setupHiddenTimingCapture() is not called', () => {
		expect(getPageVisibilityState(0, 99)).toBe('visible');
	});
});

describe('hidden-timing with timings which is smaller than 50(SIZE)', () => {
	it('should return the correct status for the given time period', () => {
		// eslint-disable-next-line no-restricted-properties
		const performanceSpy = jest.spyOn(window.performance, 'now');
		const visibilitySpy = jest.spyOn(window.document, 'visibilityState', 'get');
		const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');
		const visibilityEntries = [
			createVisibilityEntry('hidden', 10),
			createVisibilityEntry('visible', 40),
		];

		getEntriesSpy.mockReturnValue(visibilityEntries);
		visibilitySpy.mockReturnValue('visible');
		mockedFg.mockReturnValue(true);

		setupHiddenTimingCapture();

		expect(getEntriesSpy).toHaveBeenCalledWith('visibility-state');
		expect(getPageVisibilityState(11, 39)).toBe('hidden');
		expect(getPageVisibilityState(41, 69)).toBe('visible');
		expect(getPageVisibilityState(11, 69)).toBe('mixed');

		// Test getEarliestHiddenTiming with initial visibility entries
		// After setup, we have: visible at 0, hidden at 10, visible at 40
		// Returns the offset from start time: 10 - 5 = 5
		const hiddenResult = getEarliestHiddenTiming(5, 50);
		expect(hiddenResult).toBe(5);

		// Query range where no hidden timing exists
		const noHiddenResult = getEarliestHiddenTiming(41, 100);
		expect(noHiddenResult).toBeUndefined();

		// Query range before any hidden timing
		const beforeHiddenResult = getEarliestHiddenTiming(0, 5);
		expect(beforeHiddenResult).toBeUndefined();

		// When hidden-timing with timings which is smaller than 50(SIZE)
		for (let i = 1; i < 10; i++) {
			performanceSpy.mockImplementationOnce(() => i * 10);
			visibilitySpy.mockReturnValueOnce(i % 2 === 0 ? 'visible' : 'hidden');
		}

		for (let i = 1; i < 10; i++) {
			document.dispatchEvent(new Event('visibilitychange'));
		}

		// should return visible when window was visible for whole duration
		expect(getPageVisibilityState(1, 9)).toBe('visible');
		// should return hidden when window was hidden for whole duration
		expect(getPageVisibilityState(11, 19)).toBe('hidden');
		// should return mixed when window start visible and became hidden
		expect(getPageVisibilityState(1, 19)).toBe('mixed');
		// should return mixed when window start hidden and became visible
		expect(getPageVisibilityState(11, 49)).toBe('mixed');
		// should return mixed when window start hidden and became visible and then hidden again
		expect(getPageVisibilityState(11, 89)).toBe('mixed');

		// Test getEarliestHiddenTiming after visibility changes
		// Timings now have alternating hidden/visible: 10, 20, 30, 40, 50, 60, 70, 80, 90
		// Hidden at: 10 (from visibilitychange when i=1)
		// Returns the offset from start time: 10 - 5 = 5
		const afterChangesResult = getEarliestHiddenTiming(5, 100);
		expect(afterChangesResult).toBe(5);

		// When hidden-timing with timings which is greater than 50(SIZE)
		for (let i = 10; i < 75; i++) {
			performanceSpy.mockImplementationOnce(() => i * 10);
			visibilitySpy.mockReturnValueOnce(i % 2 === 0 ? 'visible' : 'hidden');
		}

		for (let i = 10; i < 75; i++) {
			document.dispatchEvent(new Event('visibilitychange'));
		}

		// should return visible when window was visible for whole duration
		expect(getPageVisibilityState(501, 509)).toBe('visible');
		// should return hidden when window was hidden for whole duration
		expect(getPageVisibilityState(511, 519)).toBe('hidden');
		// should return mixed when window start visible and became hidden
		expect(getPageVisibilityState(511, 529)).toBe('mixed');
		// should return mixed when window start hidden and became visible
		expect(getPageVisibilityState(501, 519)).toBe('mixed');
		// should return mixed when window start hidden and became visible and then hidden again
		expect(getPageVisibilityState(501, 529)).toBe('mixed');
		// should return visible when window was visible for whole duration, when timings are over SIZE
		expect(getPageVisibilityState(741, 999)).toBe('visible');

		// Test getEarliestHiddenTiming with timings > SIZE (circular buffer)
		// After overflow, early entries are overwritten
		// Hidden entries should be at odd multiples of 10 (110, 130, 150, ..., 730)
		// Returns the offset from start time: 510 - 500 = 10
		const overflowResult = getEarliestHiddenTiming(500, 520);
		expect(overflowResult).toBe(10);

		// Test boundary conditions - exact match at start
		// Returns the offset from start time: 510 - 510 = 0
		const boundaryStartResult = getEarliestHiddenTiming(510, 520);
		expect(boundaryStartResult).toBe(0);

		// Test boundary conditions - exact match at end
		// Returns the offset from start time: 510 - 500 = 10
		const boundaryEndResult = getEarliestHiddenTiming(500, 510);
		expect(boundaryEndResult).toBe(10);

		// Test range with no hidden entries (visible entries at even multiples)
		const noHiddenInRangeResult = getEarliestHiddenTiming(520, 528);
		expect(noHiddenInRangeResult).toBeUndefined();

		getEntriesSpy.mockRestore();
		performanceSpy.mockRestore();
		visibilitySpy.mockRestore();
	});
});

describe('getHasHiddenTimingBeforeSetup', () => {
	it('should return false by default when setupHiddenTimingCapture is not called', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup } = require('../../index');
			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(false);
		});
	});

	it('should return false when no visibility entries exist before setup with feature flag enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			getEntriesSpy.mockReturnValue([]);
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(false);

			getEntriesSpy.mockRestore();
		});
	});

	it('should return false when only visible entries exist before setup with feature flag enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('visible', 10),
				createVisibilityEntry('visible', 20),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(false);

			getEntriesSpy.mockRestore();
		});
	});

	it('should return true when hidden entry exists before setup with feature flag enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('hidden', 10),
				createVisibilityEntry('visible', 20),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(true);

			getEntriesSpy.mockRestore();
		});
	});

	it('should return true when multiple hidden entries exist before setup with feature flag enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('hidden', 5),
				createVisibilityEntry('visible', 10),
				createVisibilityEntry('hidden', 15),
				createVisibilityEntry('visible', 20),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(true);

			getEntriesSpy.mockRestore();
		});
	});

	it('should return false when feature flag platform_ufo_native_pagevisibility_monitoring is disabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('hidden', 10),
				createVisibilityEntry('visible', 20),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockReturnValue(false);

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(false);

			getEntriesSpy.mockRestore();
		});
	});

	it('should work correctly with both platform_ufo_use_native_page_visibility_api and platform_ufo_native_pagevisibility_monitoring enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('hidden', 10),
				createVisibilityEntry('visible', 40),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockReturnValue(true);

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(true);
			expect(getEntriesSpy).toHaveBeenCalledWith('visibility-state');

			getEntriesSpy.mockRestore();
		});
	});

	it('should handle performance.getEntriesByType throwing an error gracefully', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			getEntriesSpy.mockImplementation(() => {
				throw new Error('Browser does not support visibility-state');
			});
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			expect(() => isolatedSetup()).not.toThrow();
			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(false);

			getEntriesSpy.mockRestore();
		});
	});

	it('should track only the first hidden entry when feature flag is enabled', () => {
		jest.isolateModules(() => {
			const { getHasHiddenTimingBeforeSetup: isolatedGetHasHiddenTimingBeforeSetup, setupHiddenTimingCapture: isolatedSetup } = require('../../index');
			const getEntriesSpy = jest.spyOn(window.performance, 'getEntriesByType');

			const visibilityEntries = [
				createVisibilityEntry('visible', 5),
				createVisibilityEntry('hidden', 10),
			];
			getEntriesSpy.mockReturnValue(visibilityEntries);
			mockedFg.mockImplementation((flag: string) => {
				return flag === 'platform_ufo_native_pagevisibility_monitoring';
			});

			isolatedSetup();

			expect(isolatedGetHasHiddenTimingBeforeSetup()).toBe(true);

			getEntriesSpy.mockRestore();
		});
	});
});
