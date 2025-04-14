import { fg } from '@atlaskit/platform-feature-flags';

import {
	getProfilerAsyncRuntime,
	getProfilerData,
	getProfilerRuntimeByFunction,
	getProfilerRuntimeByTag,
	getProfilerTotalRuntime,
	markProfilingEnd,
	markProfilingStart,
	resetProfilerMeasurements,
	withProfiling,
} from './index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

const mockFg = fg as jest.Mock;

describe('Profiler Module', () => {
	let originalPerformanceNow: typeof global.performance.now;

	beforeAll(() => {
		originalPerformanceNow = global.performance.now;
		global.performance.now = jest.fn();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		resetProfilerMeasurements();
	});

	afterAll(() => {
		global.performance.now = originalPerformanceNow;
	});

	describe('resetProfilerMeasurements', () => {
		it('should reset all profiler measurements', () => {
			globalThis.__ufo_self_measurements.runtime.total = 100;
			resetProfilerMeasurements();
			expect(globalThis.__ufo_self_measurements.runtime.total).toBe(0);
		});
	});

	describe('recordProfilerMeasurement', () => {
		it('should record a synchronous function measurement', () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(100);
			const fn = withProfiling(() => {});
			fn();
			expect(getProfilerTotalRuntime()).toBeCloseTo(100);
		});

		it('should record an asynchronous function measurement', async () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(150);
			const asyncFn = withProfiling(async () => Promise.resolve());
			await asyncFn();
			expect(getProfilerAsyncRuntime()).toBeCloseTo(150);
		});

		it('should handle errors in synchronous function', () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(200);
			const fn = withProfiling(() => {
				throw new Error('Test Error');
			});
			expect(() => fn()).toThrow('Test Error');
			const data = getProfilerData();
			expect(data.error).toBeCloseTo(200);
		});

		it('should handle errors in asynchronous function', async () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(250);
			const asyncFn = withProfiling(async () => {
				throw new Error('Test Async Error');
			});
			await expect(asyncFn()).rejects.toThrow('Test Async Error');
			const data = getProfilerData();
			expect(data.error).toBeCloseTo(250);
		});
	});

	describe('withProfiling', () => {
		it('should not profile if feature gate is off', () => {
			mockFg.mockReturnValue(false);
			const fn = jest.fn();
			const profiledFn = withProfiling(fn);
			profiledFn();
			expect(performance.now).not.toHaveBeenCalled();
		});

		it('should profile if feature gate is on', () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(100);
			const fn = jest.fn();
			const profiledFn = withProfiling(fn);
			profiledFn();
			expect(performance.now).toHaveBeenCalledTimes(2);
			expect(getProfilerTotalRuntime()).toBeCloseTo(100);
		});
	});

	describe('markProfilingStart and markProfilingEnd', () => {
		it('should record a custom measurement', () => {
			mockFg.mockReturnValue(true);
			(performance.now as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(300);
			const start = markProfilingStart('test');
			markProfilingEnd(start, { tags: ['custom'] });
			const customTime = getProfilerRuntimeByTag('custom');
			expect(customTime).toBeCloseTo(300);
		});
	});

	describe('getProfilerTotalRuntime', () => {
		it('should return the total runtime', () => {
			globalThis.__ufo_self_measurements.runtime.total = 400;
			expect(getProfilerTotalRuntime()).toBe(400);
		});
	});

	describe('getProfilerAsyncRuntime', () => {
		it('should return the async runtime', () => {
			globalThis.__ufo_self_measurements.runtime.async = 500;
			expect(getProfilerAsyncRuntime()).toBe(500);
		});
	});

	describe('getProfilerRuntimeByFunction', () => {
		it('should return the runtime for a specific function', () => {
			globalThis.__ufo_self_measurements.runtime.byFunction['testFunction'] = 600;
			expect(getProfilerRuntimeByFunction('testFunction')).toBe(600);
		});
	});

	describe('getProfilerRuntimeByTag', () => {
		it('should return the runtime for a specific tag', () => {
			globalThis.__ufo_self_measurements.runtime.custom['testTag'] = 700;
			expect(getProfilerRuntimeByTag('testTag')).toBe(700);
		});
	});
});
