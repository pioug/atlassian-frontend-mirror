// Mock Bowser
jest.mock('bowser-ultralight', () => ({
	getParser: jest.fn(),
}));

import Bowser from 'bowser-ultralight';

import getBrowserMetadata, { getBrowserMetadataToLegacyFormat } from './get-browser-metadata';

const mockBowser = Bowser as jest.Mocked<typeof Bowser>;

describe('getBrowserMetadata', () => {
	// Store original navigator and Date to restore later
	const originalNavigator = global.navigator;
	const originalDate = global.Date;

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock Date to return consistent values
		jest.spyOn(global, 'Date').mockImplementation(
			() =>
				({
					getHours: () => 14,
					getDay: () => 3, // Wednesday
					getTimezoneOffset: () => -480, // PST is UTC-8, so offset is +480 minutes
				}) as any,
		);
	});

	afterEach(() => {
		// Restore original globals
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
		global.Date = originalDate;
	});

	it('should return time information', () => {
		// Mock basic navigator
		Object.defineProperty(global, 'navigator', {
			value: {},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).toEqual(
			expect.objectContaining({
				time: {
					localHour: 14,
					localDayOfWeek: 3,
					localTimezoneOffset: -480,
				},
			}),
		);
	});

	it('should return browser information when userAgent is available', () => {
		const mockParser = {
			getBrowserName: jest.fn().mockReturnValue('Chrome'),
			getBrowserVersion: jest.fn().mockReturnValue('91.0.4472.124'),
			getBrowser: jest.fn(),
			isMobile: jest.fn(),
			getUA: jest.fn(),
			parse: jest.fn(),
			getOS: jest.fn(),
			getPlatform: jest.fn(),
			getEngine: jest.fn(),
		};

		mockBowser.getParser.mockReturnValue(mockParser as any);

		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(mockBowser.getParser).toHaveBeenCalledWith(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		);
		expect(result).toEqual(
			expect.objectContaining({
				browser: {
					name: 'Chrome',
					version: '91.0.4472.124',
				},
			}),
		);
	});

	it('should not include browser info when userAgent is null', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: null,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(mockBowser.getParser).not.toHaveBeenCalled();
		expect(result).not.toHaveProperty('browser');
	});

	it('should include hardware concurrency when available', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				hardwareConcurrency: 8,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).toEqual(
			expect.objectContaining({
				device: {
					cpus: 8,
				},
			}),
		);
	});

	it('should not include hardware concurrency when null', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				hardwareConcurrency: null,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).not.toHaveProperty('device');
	});

	it('should include device memory when available', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				deviceMemory: 4,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).toEqual(
			expect.objectContaining({
				device: {
					memory: 4,
				},
			}),
		);
	});

	it('should not include device memory when null', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				deviceMemory: null,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).not.toHaveProperty('device');
	});

	it('should include network information when connection is available', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				connection: {
					effectiveType: '4g',
					rtt: 100,
					downlink: 10,
				},
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).toEqual(
			expect.objectContaining({
				network: {
					effectiveType: '4g',
					rtt: 100,
					downlink: 10,
				},
			}),
		);
	});

	it('should not include network information when connection is null', () => {
		Object.defineProperty(global, 'navigator', {
			value: {
				connection: null,
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).not.toHaveProperty('network');
	});

	it('should handle complete navigator object with all properties', () => {
		const mockParser = {
			getBrowserName: jest.fn().mockReturnValue('Firefox'),
			getBrowserVersion: jest.fn().mockReturnValue('89.0'),
			getBrowser: jest.fn(),
			isMobile: jest.fn(),
			getUA: jest.fn(),
			parse: jest.fn(),
			getOS: jest.fn(),
			getPlatform: jest.fn(),
			getEngine: jest.fn(),
		};

		mockBowser.getParser.mockReturnValue(mockParser as any);

		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
				hardwareConcurrency: 16,
				deviceMemory: 8,
				connection: {
					effectiveType: '4g',
					rtt: 50,
					downlink: 20,
				},
			},
			configurable: true,
		});

		const result = getBrowserMetadata();

		expect(result).toEqual({
			time: {
				localHour: 14,
				localDayOfWeek: 3,
				localTimezoneOffset: -480,
			},
			browser: {
				name: 'Firefox',
				version: '89.0',
			},
			device: {
				cpus: 16,
				memory: 8,
			},
			network: {
				effectiveType: '4g',
				rtt: 50,
				downlink: 20,
			},
		});
	});

	it('should handle missing navigator gracefully', () => {
		Object.defineProperty(global, 'navigator', {
			value: undefined,
			configurable: true,
		});

		const result = getBrowserMetadata();

		// Should still return time information
		expect(result).toEqual({
			time: {
				localHour: 14,
				localDayOfWeek: 3,
				localTimezoneOffset: -480,
			},
		});
	});

	it('should transform to legacy format correctly for backward compatibility', () => {
		const mockParser = {
			getBrowserName: jest.fn().mockReturnValue('Chrome'),
			getBrowserVersion: jest.fn().mockReturnValue('91.0.4472.124'),
			getBrowser: jest.fn(),
			isMobile: jest.fn(),
			getUA: jest.fn(),
			parse: jest.fn(),
			getOS: jest.fn(),
			getPlatform: jest.fn(),
			getEngine: jest.fn(),
		};

		mockBowser.getParser.mockReturnValue(mockParser as any);

		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				hardwareConcurrency: 8,
				deviceMemory: 4,
				connection: {
					effectiveType: '4g',
					rtt: 100,
					downlink: 10,
				},
			},
			configurable: true,
		});

		const legacyResult = getBrowserMetadataToLegacyFormat();

		// Should transform to the old colon-separated format
		expect(legacyResult).toEqual({
			'event:localHour': 14,
			'event:localDayOfWeek': 3,
			'event:localTimezoneOffset': -480,
			'event:browser:name': 'Chrome',
			'event:browser:version': '91.0.4472.124',
			'event:cpus': 8,
			'event:memory': 4,
			'event:network:effectiveType': '4g',
			'event:network:rtt': 100,
			'event:network:downlink': 10,
		});
	});
});
