import { type Config } from '../../config';
import * as ssr from '../../ssr';

import getSSRDoneTimeValue from './get-ssr-done-time-value';

// Mock the ssr module
jest.mock('../../ssr', () => ({
	getSSRDoneTime: jest.fn(),
}));

describe('getSSRDoneTimeValue', () => {
	// Clear all mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should use custom getSSRDoneTime from config when provided', () => {
		const customTime = 1234;
		const config: Config = {
			ssr: {
				getSSRDoneTime: jest.fn().mockReturnValue(customTime),
			},
		} as unknown as Config;

		const result = getSSRDoneTimeValue(config);

		expect(result).toBe(customTime);
		expect(config.ssr?.getSSRDoneTime).toHaveBeenCalledTimes(1);
		expect(ssr.getSSRDoneTime).not.toHaveBeenCalled();
	});

	it('should use default getSSRDoneTime when config is undefined', () => {
		const defaultTime = 5678;
		(ssr.getSSRDoneTime as jest.Mock).mockReturnValue(defaultTime);

		const result = getSSRDoneTimeValue(undefined);

		expect(result).toBe(defaultTime);
		expect(ssr.getSSRDoneTime).toHaveBeenCalledTimes(1);
	});

	it('should use default getSSRDoneTime when config.ssr is undefined', () => {
		const defaultTime = 5678;
		(ssr.getSSRDoneTime as jest.Mock).mockReturnValue(defaultTime);
		const config: Config = { ssr: undefined } as unknown as Config;

		const result = getSSRDoneTimeValue(config);

		expect(result).toBe(defaultTime);
		expect(ssr.getSSRDoneTime).toHaveBeenCalledTimes(1);
	});

	it('should use default getSSRDoneTime when config.ssr.getSSRDoneTime is undefined', () => {
		const defaultTime = 5678;
		(ssr.getSSRDoneTime as jest.Mock).mockReturnValue(defaultTime);
		const config: Config = {
			ssr: {},
		} as unknown as Config;

		const result = getSSRDoneTimeValue(config);

		expect(result).toBe(defaultTime);
		expect(ssr.getSSRDoneTime).toHaveBeenCalledTimes(1);
	});

	it('should handle undefined return values from custom getSSRDoneTime', () => {
		const config: Config = {
			ssr: {
				getSSRDoneTime: jest.fn().mockReturnValue(undefined),
			},
		} as unknown as Config;

		const result = getSSRDoneTimeValue(config);

		expect(result).toBeUndefined();
		expect(config.ssr?.getSSRDoneTime).toHaveBeenCalledTimes(1);
		expect(ssr.getSSRDoneTime).not.toHaveBeenCalled();
	});

	it('should handle undefined return values from default getSSRDoneTime', () => {
		(ssr.getSSRDoneTime as jest.Mock).mockReturnValue(undefined);

		const result = getSSRDoneTimeValue(undefined);

		expect(result).toBeUndefined();
		expect(ssr.getSSRDoneTime).toHaveBeenCalledTimes(1);
	});
});
