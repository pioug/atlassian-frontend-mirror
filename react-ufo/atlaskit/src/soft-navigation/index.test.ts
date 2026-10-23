type SoftNavigationModule = typeof import('./index');

type FakeEntry = Record<string, unknown> & { entryType: string; startTime: number };

const softNavigationEntry = (overrides: Partial<FakeEntry> = {}): FakeEntry => ({
	entryType: 'soft-navigation',
	name: 'https://example.com/next',
	startTime: 1000,
	interactionId: 1,
	presentationTime: 1150,
	paintTime: 1140,
	getLargestInteractionContentfulPaint: () => null,
	...overrides,
});

const contentfulPaintEntry = (
	interactionId: number,
	renderTime: number,
	loadTime = 0,
): FakeEntry => ({
	entryType: 'interaction-contentful-paint',
	startTime: 1000,
	interactionId,
	largestContentfulPaint: { renderTime, loadTime },
});

describe('soft navigation paint metrics', () => {
	const originalPerformanceObserver = global.PerformanceObserver;
	const globalWithSoftNavigation = globalThis as {
		PerformanceSoftNavigation?: unknown;
	};

	let observerCallback: PerformanceObserverCallback | undefined;
	let pendingRecords: FakeEntry[];
	let observe: jest.Mock;

	const emit = (entries: FakeEntry[]) => {
		observerCallback?.(
			{ getEntries: () => entries } as unknown as PerformanceObserverEntryList,
			{} as PerformanceObserver,
		);
	};

	const loadModule = (): SoftNavigationModule => {
		let softNavigationModule: SoftNavigationModule | undefined;
		jest.isolateModules(() => {
			softNavigationModule = require('./index');
		});
		return softNavigationModule!;
	};

	const mockSoftNavigationSupport = ({
		supportedEntryTypes = ['soft-navigation', 'interaction-contentful-paint'],
		hasLargestInteractionContentfulPaint = true,
	} = {}) => {
		const MockPerformanceObserver = jest.fn().mockImplementation((callback) => {
			observerCallback = callback;
			return {
				observe,
				disconnect: jest.fn(),
				takeRecords: () => {
					const records = pendingRecords;
					pendingRecords = [];
					return records;
				},
			};
		});
		Object.assign(MockPerformanceObserver, { supportedEntryTypes });
		global.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;

		globalWithSoftNavigation.PerformanceSoftNavigation = {
			prototype: hasLargestInteractionContentfulPaint
				? { getLargestInteractionContentfulPaint: () => null }
				: {},
		};
	};

	beforeEach(() => {
		observerCallback = undefined;
		pendingRecords = [];
		observe = jest.fn();
	});

	afterEach(() => {
		global.PerformanceObserver = originalPerformanceObserver;
		delete globalWithSoftNavigation.PerformanceSoftNavigation;
	});

	it('should observe soft navigations and interaction contentful paints when supported', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved } = loadModule();

		ensureSoftNavigationObserved();

		expect(observe).toHaveBeenCalledWith({ type: 'soft-navigation', buffered: true });
		expect(observe).toHaveBeenCalledWith({ type: 'interaction-contentful-paint', buffered: true });
	});

	it('should disconnect a half-started observer when a later observe call throws', () => {
		mockSoftNavigationSupport();
		observe.mockImplementation(({ type }: PerformanceObserverInit) => {
			if (type === 'interaction-contentful-paint') {
				throw new Error('observe failed');
			}
		});
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();

		ensureSoftNavigationObserved();
		expect(getSoftNavigationPaintMetrics(1050)).toEqual({});

		const observers = (global.PerformanceObserver as unknown as jest.Mock).mock.results.map(
			(result) => result.value as { disconnect: jest.Mock },
		);
		expect(observers).toHaveLength(2);
		observers.forEach((instance) => expect(instance.disconnect).toHaveBeenCalledTimes(1));
	});

	it('should not observe when the browser does not support soft navigations', () => {
		mockSoftNavigationSupport({ supportedEntryTypes: ['largest-contentful-paint'] });
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();

		ensureSoftNavigationObserved();

		expect(global.PerformanceObserver).not.toHaveBeenCalled();
		expect(getSoftNavigationPaintMetrics(1050)).toEqual({});
	});

	it('should not observe the earlier origin trial implementation', () => {
		mockSoftNavigationSupport({ hasLargestInteractionContentfulPaint: false });
		const { ensureSoftNavigationObserved } = loadModule();

		ensureSoftNavigationObserved();

		expect(global.PerformanceObserver).not.toHaveBeenCalled();
	});

	it('should start observing on first use and replay buffered entries when init did not start it', () => {
		mockSoftNavigationSupport();
		const bufferedEntries = [
			softNavigationEntry({ interactionId: 7 }),
			contentfulPaintEntry(7, 1300),
		];
		observe.mockImplementation(({ type, buffered }: PerformanceObserverInit) => {
			if (buffered) {
				pendingRecords.push(...bufferedEntries.filter((entry) => entry.entryType === type));
			}
		});
		const { getSoftNavigationPaintMetrics } = loadModule();

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100, lcp: 250 });
		expect(observe).toHaveBeenCalledWith({ type: 'soft-navigation', buffered: true });
	});

	it('should report fcp and lcp relative to the transition start', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({ startTime: 1000, interactionId: 7, presentationTime: 1150 }),
			contentfulPaintEntry(7, 1200),
			contentfulPaintEntry(7, 1480.6),
		]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100, lcp: 431 });
	});

	it('should fall back to paintTime when presentationTime is unavailable', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([softNavigationEntry({ presentationTime: undefined, paintTime: 1140 })]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 90 });
	});

	it('should report the latest contentful paint, including one after the transition ended', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({ interactionId: 7 }),
			contentfulPaintEntry(7, 1300),
			contentfulPaintEntry(7, 3500),
		]);

		expect(getSoftNavigationPaintMetrics(1050).lcp).toBe(2450);
	});

	it('should ignore contentful paints from other interactions', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([softNavigationEntry({ interactionId: 7 }), contentfulPaintEntry(8, 1300)]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100 });
	});

	it('should keep soft navigation paints when many other interactions paint', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({ interactionId: 7 }),
			contentfulPaintEntry(7, 1300),
			...Array.from({ length: 25 }, (_, i) => contentfulPaintEntry(100 + i, 1400)),
		]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100, lcp: 250 });
	});

	it('should use loadTime when an image has no renderTime', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([softNavigationEntry({ interactionId: 7 }), contentfulPaintEntry(7, 0, 1600)]);

		expect(getSoftNavigationPaintMetrics(1050).lcp).toBe(550);
	});

	it('should include paints captured before the soft navigation was detected', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({
				interactionId: 7,
				getLargestInteractionContentfulPaint: () => contentfulPaintEntry(7, 1250),
			}),
		]);

		expect(getSoftNavigationPaintMetrics(1050).lcp).toBe(200);
	});

	it('should flush entries the observer has not delivered yet', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		pendingRecords = [softNavigationEntry({ interactionId: 7 }), contentfulPaintEntry(7, 1300)];

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100, lcp: 250 });
	});

	it('should match the latest soft navigation that started before the transition', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({ startTime: 500, interactionId: 1, presentationTime: 600 }),
			softNavigationEntry({ startTime: 1000, interactionId: 2, presentationTime: 1150 }),
			softNavigationEntry({ startTime: 1100, interactionId: 3, presentationTime: 1200 }),
		]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 100 });
	});

	it('should ignore soft navigations that started too long before the transition', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([softNavigationEntry({ startTime: 1000, presentationTime: 1150 })]);

		expect(getSoftNavigationPaintMetrics(2001)).toEqual({});
	});

	it('should clamp paints that happened before the transition started to zero', () => {
		mockSoftNavigationSupport();
		const { ensureSoftNavigationObserved, getSoftNavigationPaintMetrics } = loadModule();
		ensureSoftNavigationObserved();

		emit([
			softNavigationEntry({ startTime: 1000, interactionId: 7, presentationTime: 1020 }),
			contentfulPaintEntry(7, 1030),
		]);

		expect(getSoftNavigationPaintMetrics(1050)).toEqual({ fcp: 0, lcp: 0 });
	});
});
