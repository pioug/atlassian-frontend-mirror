import { fg } from '@atlaskit/platform-feature-flags';

import { configure } from './common/utils/config';
import { getResourceTimings } from './main';

jest.mock('@atlaskit/platform-feature-flags');
jest.mock('../config', () => ({
	getConfig: () => undefined,
}));

const mockFg = fg as jest.Mock;

describe('getResourceTimings timing name length validation', () => {
	beforeEach(() => {
		mockFg.mockReset();
		mockFg.mockReturnValue(false);
		configure({
			sanitiseEndpoints: (url: string) => url,
			mapResources: (url: string) => url,
		});
		Object.defineProperty(window, 'PerformanceObserver', {
			writable: true,
			value: undefined,
		});
	});

	it('keeps long resource timing names when the gate is disabled', () => {
		const longName = `https://example.com/${'a'.repeat(300)}`;
		Object.defineProperty(window, 'performance', {
			writable: true,
			value: {
				getEntriesByType: () => [
					{
						name: longName,
						initiatorType: 'fetch',
						startTime: 10,
						duration: 20,
						workerStart: 10,
						fetchStart: 10,
						responseStart: 15,
						requestStart: 12,
						transferSize: 10,
						serverTime: 3,
						networkTime: 17,
					},
				],
			},
		});

		const result = getResourceTimings(0, 100);

		expect(Object.keys(result)).toEqual([longName]);
	});

	it('truncates long resource timing names when the gate is enabled', () => {
		const longName = `https://example.com/${'a'.repeat(300)}`;
		mockFg.mockImplementation(
			(flagName: string) => flagName === 'platform_ufo_validate_timing_name_length',
		);
		Object.defineProperty(window, 'performance', {
			writable: true,
			value: {
				getEntriesByType: () => [
					{
						name: longName,
						initiatorType: 'fetch',
						startTime: 10,
						duration: 20,
						workerStart: 10,
						fetchStart: 10,
						responseStart: 15,
						requestStart: 12,
						transferSize: 10,
						serverTime: 3,
						networkTime: 17,
					},
				],
			},
		});

		const result = getResourceTimings(0, 100);
		const [resourceName] = Object.keys(result);

		expect(resourceName).toHaveLength(255);
		expect(resourceName).toBe(longName.slice(0, 255));
	});
});
