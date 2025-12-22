import { fg } from '@atlaskit/platform-feature-flags';

import { getPageVisibilityState, setupHiddenTimingCapture } from '../../index';

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

		getEntriesSpy.mockRestore();
		performanceSpy.mockRestore();
		visibilitySpy.mockRestore();
	});
});
