/* eslint-disable @atlaskit/platform/no-set-immediate */
import getPaintMetrics, { getPaintMetricsToLegacyFormat } from './get-paint-metrics';

describe('getPaintMetrics', () => {
	const originalPerformance = global.performance;
	const originalPerformanceObserver = global.PerformanceObserver;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('should return empty object for non-page_load interactions', async () => {
		const result = await getPaintMetrics('transition', 2000);
		expect(result).toEqual({});
	});

	it('should return empty object for press interactions', async () => {
		const result = await getPaintMetrics('press', 2000);
		expect(result).toEqual({});
	});

	it('should return nested paint metrics for page_load interactions', async () => {
		// Mock performance.getEntriesByType for paint metrics
		const mockPaintEntries = [
			{ name: 'first-paint', startTime: 500 },
			{ name: 'first-contentful-paint', startTime: 750 },
		];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver for LCP
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			// Immediately call the callback to simulate LCP entry
			setImmediate(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200 }],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			fp: 500,
			fcp: 750,
			lcp: 1200,
		});

		expect(global.performance.getEntriesByType).toHaveBeenCalledWith('paint');
		expect(mockPerformanceObserverConstructor).toHaveBeenCalled();
		expect(mockObserver.observe).toHaveBeenCalledWith({
			type: 'largest-contentful-paint',
			buffered: true,
		});
	});

	it('should handle missing paint metrics gracefully', async () => {
		// Mock empty paint entries
		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return [];
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver for LCP
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			// Immediately call the callback to simulate LCP entry
			setImmediate(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200 }],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			lcp: 1200,
		});
	});

	it('should handle LCP timeout gracefully', async () => {
		// Mock performance.getEntriesByType for paint metrics
		const mockPaintEntries = [
			{ name: 'first-paint', startTime: 500 },
			{ name: 'first-contentful-paint', startTime: 750 },
		];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver that times out
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation(() => {
			// Don't call the callback, let it timeout
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Fast-forward time to trigger timeout
		jest.advanceTimersByTime(250);

		const result = await resultPromise;

		expect(result).toEqual({
			fp: 500,
			fcp: 750,
		});

		expect(mockObserver.disconnect).toHaveBeenCalled();
	});

	it('should use latest LCP entry before end time', async () => {
		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return [];
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver with multiple LCP entries
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			setImmediate(() => {
				callback({
					getEntries: () => [
						{ name: 'largest-contentful-paint', startTime: 800 },
						{ name: 'largest-contentful-paint', startTime: 1200 }, // This should be used
						{ name: 'largest-contentful-paint', startTime: 2500 }, // This is after end time
					],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			lcp: 1200,
		});
	});

	it('should handle no LCP entries gracefully', async () => {
		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return [{ name: 'first-paint', startTime: 500 }];
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver with no LCP entries
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			setImmediate(() => {
				callback({
					getEntries: () => [],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			fp: 500,
		});
	});

	it('should round paint metrics to integers', async () => {
		// Mock performance.getEntriesByType for paint metrics with decimal values
		const mockPaintEntries = [
			{ name: 'first-paint', startTime: 500.7 },
			{ name: 'first-contentful-paint', startTime: 750.3 },
		];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver for LCP
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			setImmediate(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200.9 }],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			fp: 501, // Math.round(500.7)
			fcp: 750, // Math.round(750.3)
			lcp: 1201, // Math.round(1200.9)
		});
	});

	it('should handle only first-paint entry', async () => {
		const mockPaintEntries = [{ name: 'first-paint', startTime: 500 }];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver that times out (no LCP)
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation(() => {
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Fast-forward time to trigger timeout
		jest.advanceTimersByTime(250);

		const result = await resultPromise;

		expect(result).toEqual({
			fp: 500,
		});
	});

	it('should handle only first-contentful-paint entry', async () => {
		const mockPaintEntries = [{ name: 'first-contentful-paint', startTime: 750 }];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver that times out
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation(() => {
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Fast-forward time to trigger timeout
		jest.advanceTimersByTime(250);

		const result = await resultPromise;

		expect(result).toEqual({
			fcp: 750,
		});
	});

	it('should return empty object when no paint metrics are found', async () => {
		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return [];
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver that times out (no LCP)
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation(() => {
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetrics('page_load', 2000);

		// Fast-forward time to trigger timeout
		jest.advanceTimersByTime(250);

		const result = await resultPromise;

		expect(result).toEqual({});
	});
});

describe('getPaintMetricsToLegacyFormat', () => {
	const originalPerformance = global.performance;
	const originalPerformanceObserver = global.PerformanceObserver;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('should return legacy format for paint metrics', async () => {
		// Mock performance.getEntriesByType for paint metrics
		const mockPaintEntries = [
			{ name: 'first-paint', startTime: 500 },
			{ name: 'first-contentful-paint', startTime: 750 },
		];

		global.performance = {
			...originalPerformance,
			getEntriesByType: jest.fn().mockImplementation((type) => {
				if (type === 'paint') {
					return mockPaintEntries;
				}
				if (type === 'largest-contentful-paint') {
					return []; // No existing LCP entries, will use observer
				}
				return [];
			}),
		} as any;

		// Mock PerformanceObserver for LCP
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			setImmediate(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200 }],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		const resultPromise = getPaintMetricsToLegacyFormat('page_load', 2000);

		// Process the immediate callback
		await new Promise((resolve) => setImmediate(resolve));

		const result = await resultPromise;

		expect(result).toEqual({
			'metric:fp': 500,
			'metric:fcp': 750,
			'metric:lcp': 1200,
		});
	});

	it('should return empty object for non-page_load interactions in legacy format', async () => {
		const result = await getPaintMetricsToLegacyFormat('transition', 2000);
		expect(result).toEqual({});
	});
});
