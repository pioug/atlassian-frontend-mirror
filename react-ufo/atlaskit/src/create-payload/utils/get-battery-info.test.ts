import { ffTest } from '@atlassian/feature-flags-test-utils';

import getBatteryInfo, { getBatteryInfoToLegacyFormat } from './get-battery-info';

describe('getBatteryInfo', () => {
	const originalNavigator = global.navigator;

	afterEach(() => {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
	});

	ffTest.off('react_ufo_battery_info', 'Battery FG is off', () => {
		it('should return empty object when feature flag is disabled', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockResolvedValue({
						level: 0.8,
						charging: true,
					}),
				},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({});

			const legacyFormat = await getBatteryInfoToLegacyFormat();
			expect(legacyFormat).toEqual({});
		});
	});

	ffTest.on('react_ufo_battery_info', 'Battery FG is on', () => {
		it('should return battery info when modern getBattery API is available', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockResolvedValue({
						level: 0.8,
						charging: true,
					}),
				},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({
				level: 0.8,
				charging: true,
			});
		});

		it('should round battery level to 0.01 precision', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockResolvedValue({
						level: 0.8567,
						charging: false,
					}),
				},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({
				level: 0.86,
				charging: false,
			});
		});

		it('should return empty object when navigator is undefined', async () => {
			Object.defineProperty(global, 'navigator', {
				value: undefined,
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({});
		});

		it('should return empty object when no battery API is available', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({});
		});

		it('should handle getBattery API errors gracefully', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockRejectedValue(new Error('Battery API error')),
				},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({});
		});

		it('should handle invalid battery data gracefully', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockResolvedValue({
						level: null, // Invalid level
						charging: true,
					}),
				},
				configurable: true,
			});

			const result = await getBatteryInfo();
			expect(result).toEqual({});
		});

		it('should include battery data in legacy format when available', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {
					getBattery: jest.fn().mockResolvedValue({
						level: 0.75,
						charging: false,
					}),
				},
				configurable: true,
			});

			const legacyFormat = await getBatteryInfoToLegacyFormat();
			expect(legacyFormat).toEqual({
				'event:battery:level': 0.75,
				'event:battery:charging': false,
			});
		});

		it('should return empty legacy format when no battery data available', async () => {
			Object.defineProperty(global, 'navigator', {
				value: {},
				configurable: true,
			});

			const legacyFormat = await getBatteryInfoToLegacyFormat();
			expect(legacyFormat).toEqual({});
		});
	});
});
