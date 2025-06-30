import getNavigationMetrics, {
	getNavigationMetricsToLegacyFormat,
	type NavigationMetrics,
} from './get-navigation-metrics';

// Mock performance API
const mockPerformance = {
	getEntriesByType: jest.fn(),
};

// Mock global performance object
Object.defineProperty(global, 'performance', {
	value: mockPerformance,
	writable: true,
});

describe('getNavigationMetrics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when interaction type is not page_load', () => {
		it('should return null for press interaction', () => {
			const result = getNavigationMetrics('press');
			expect(result).toBeNull();
			expect(mockPerformance.getEntriesByType).not.toHaveBeenCalled();
		});

		it('should return null for transition interaction', () => {
			const result = getNavigationMetrics('transition');
			expect(result).toBeNull();
			expect(mockPerformance.getEntriesByType).not.toHaveBeenCalled();
		});
	});

	describe('when interaction type is page_load', () => {
		it('should return null when no navigation entries exist', () => {
			mockPerformance.getEntriesByType.mockReturnValue([]);

			const result = getNavigationMetrics('page_load');

			expect(result).toBeNull();
			expect(mockPerformance.getEntriesByType).toHaveBeenCalledWith('navigation');
		});

		it('should return navigation metrics when navigation entry exists', () => {
			const mockNavigationEntry = {
				// From https://www.w3.org/TR/resource-timing/
				redirectStart: 100.5,
				redirectEnd: 200.7,
				fetchStart: 300.2,
				domainLookupStart: 400.1,
				domainLookupEnd: 500.9,
				connectStart: 600.3,
				connectEnd: 700.8,
				secureConnectionStart: 650.4,
				requestStart: 800.6,
				responseStart: 900.1,
				responseEnd: 1000.2,
				encodedBodySize: 1500.7,
				decodedBodySize: 2000.3,
				transferSize: 1800.9,

				// From https://www.w3.org/TR/navigation-timing-2/
				redirectCount: 2,
				type: 'navigate',
				unloadEventEnd: 1100.5,
				unloadEventStart: 1050.2,
				workerStart: 1200.8,

				nextHopProtocol: 'h2',
			};

			mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry]);

			const result = getNavigationMetrics('page_load');

			expect(result).toEqual({
				// From https://www.w3.org/TR/resource-timing/
				redirectStart: 101,
				redirectEnd: 201,
				fetchStart: 300,
				domainLookupStart: 400,
				domainLookupEnd: 501,
				connectStart: 600,
				connectEnd: 701,
				secureConnectionStart: 650,
				requestStart: 801,
				responseStart: 900,
				responseEnd: 1000,
				encodedBodySize: 1501,
				decodedBodySize: 2000,
				transferSize: 1801,

				// From https://www.w3.org/TR/navigation-timing-2/
				redirectCount: 2,
				type: 'navigate',
				unloadEventEnd: 1101,
				unloadEventStart: 1050,
				workerStart: 1201,

				nextHopProtocol: 'h2',
			});
			expect(mockPerformance.getEntriesByType).toHaveBeenCalledWith('navigation');
		});

		it('should handle zero values correctly', () => {
			const mockNavigationEntry = {
				redirectStart: 0,
				redirectEnd: 0,
				fetchStart: 0,
				domainLookupStart: 0,
				domainLookupEnd: 0,
				connectStart: 0,
				connectEnd: 0,
				secureConnectionStart: 0,
				requestStart: 0,
				responseStart: 0,
				responseEnd: 0,
				encodedBodySize: 0,
				decodedBodySize: 0,
				transferSize: 0,
				redirectCount: 0,
				type: 'navigate',
				unloadEventEnd: 0,
				unloadEventStart: 0,
				workerStart: 0,
				nextHopProtocol: 'http/1.1',
			};

			mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry]);

			const result = getNavigationMetrics('page_load');

			expect(result).toEqual({
				redirectStart: 0,
				redirectEnd: 0,
				fetchStart: 0,
				domainLookupStart: 0,
				domainLookupEnd: 0,
				connectStart: 0,
				connectEnd: 0,
				secureConnectionStart: 0,
				requestStart: 0,
				responseStart: 0,
				responseEnd: 0,
				encodedBodySize: 0,
				decodedBodySize: 0,
				transferSize: 0,
				redirectCount: 0,
				type: 'navigate',
				unloadEventEnd: 0,
				unloadEventStart: 0,
				workerStart: 0,
				nextHopProtocol: 'http/1.1',
			});
		});

		it('should handle different navigation types', () => {
			const mockNavigationEntry = {
				redirectStart: 100,
				redirectEnd: 200,
				fetchStart: 300,
				domainLookupStart: 400,
				domainLookupEnd: 500,
				connectStart: 600,
				connectEnd: 700,
				secureConnectionStart: 650,
				requestStart: 800,
				responseStart: 900,
				responseEnd: 1000,
				encodedBodySize: 1500,
				decodedBodySize: 2000,
				transferSize: 1800,
				redirectCount: 1,
				type: 'reload',
				unloadEventEnd: 1100,
				unloadEventStart: 1050,
				workerStart: 1200,
				nextHopProtocol: 'h3',
			};

			mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry]);

			const result = getNavigationMetrics('page_load');

			expect(result?.type).toBe('reload');
			expect(result?.nextHopProtocol).toBe('h3');
		});

		it('should return null when performance.getEntriesByType throws an error', () => {
			mockPerformance.getEntriesByType.mockImplementation(() => {
				throw new Error('Performance API not available');
			});

			const result = getNavigationMetrics('page_load');

			expect(result).toBeNull();
		});
	});
});

describe('getNavigationMetricsToLegacyFormat', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when interaction type is not page_load', () => {
		it('should return empty object for press interaction', () => {
			const result = getNavigationMetricsToLegacyFormat('press');
			expect(result).toEqual({});
		});

		it('should return empty object for transition interaction', () => {
			const result = getNavigationMetricsToLegacyFormat('transition');
			expect(result).toEqual({});
		});
	});

	describe('when interaction type is page_load', () => {
		it('should return empty object when no navigation entries exist', () => {
			mockPerformance.getEntriesByType.mockReturnValue([]);

			const result = getNavigationMetricsToLegacyFormat('page_load');

			expect(result).toEqual({});
		});

		it('should return legacy format when navigation entry exists', () => {
			const mockNavigationEntry = {
				redirectStart: 100.5,
				redirectEnd: 200.7,
				fetchStart: 300.2,
				domainLookupStart: 400.1,
				domainLookupEnd: 500.9,
				connectStart: 600.3,
				connectEnd: 700.8,
				secureConnectionStart: 650.4,
				requestStart: 800.6,
				responseStart: 900.1,
				responseEnd: 1000.2,
				encodedBodySize: 1500.7,
				decodedBodySize: 2000.3,
				transferSize: 1800.9,
				redirectCount: 2,
				type: 'navigate',
				unloadEventEnd: 1100.5,
				unloadEventStart: 1050.2,
				workerStart: 1200.8,
				nextHopProtocol: 'h2',
			};

			mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry]);

			const result = getNavigationMetricsToLegacyFormat('page_load');

			expect(result).toEqual({
				'metrics:navigation': {
					redirectStart: 101,
					redirectEnd: 201,
					fetchStart: 300,
					domainLookupStart: 400,
					domainLookupEnd: 501,
					connectStart: 600,
					connectEnd: 701,
					secureConnectionStart: 650,
					requestStart: 801,
					responseStart: 900,
					responseEnd: 1000,
					encodedBodySize: 1501,
					decodedBodySize: 2000,
					transferSize: 1801,
					redirectCount: 2,
					type: 'navigate',
					unloadEventEnd: 1101,
					unloadEventStart: 1050,
					workerStart: 1201,
					nextHopProtocol: 'h2',
				},
			});
		});

		it('should return empty object when performance.getEntriesByType throws an error', () => {
			mockPerformance.getEntriesByType.mockImplementation(() => {
				throw new Error('Performance API not available');
			});

			const result = getNavigationMetricsToLegacyFormat('page_load');

			expect(result).toEqual({});
		});
	});
});

describe('NavigationMetrics interface', () => {
	it('should have all required properties', () => {
		const mockMetrics: NavigationMetrics = {
			// From https://www.w3.org/TR/resource-timing/
			redirectStart: 100,
			redirectEnd: 200,
			fetchStart: 300,
			domainLookupStart: 400,
			domainLookupEnd: 500,
			connectStart: 600,
			connectEnd: 700,
			secureConnectionStart: 650,
			requestStart: 800,
			responseStart: 900,
			responseEnd: 1000,
			encodedBodySize: 1500,
			decodedBodySize: 2000,
			transferSize: 1800,

			// From https://www.w3.org/TR/navigation-timing-2/
			redirectCount: 2,
			type: 'navigate',
			unloadEventEnd: 1100,
			unloadEventStart: 1050,
			workerStart: 1200,

			nextHopProtocol: 'h2',
		};

		expect(mockMetrics).toBeDefined();
		expect(typeof mockMetrics.redirectStart).toBe('number');
		expect(typeof mockMetrics.type).toBe('string');
		expect(typeof mockMetrics.redirectCount).toBe('number');
		expect(typeof mockMetrics.nextHopProtocol).toBe('string');
	});
});
