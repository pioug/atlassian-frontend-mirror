import Fetcher, {
	type FrontendExperimentsResponse,
	ResponseError,
	// @ts-ignore - this is not a valid package entry point and cannot be resolved when using a modern Typescript 'moduleResolution' setting
} from '@atlaskit/feature-gate-fetcher/src';
import {
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client';

import Refresh, { NO_CACHE_RETRY_OPTIONS_DEFAULT, SCHEDULER_OPTIONS_DEFAULT } from '../Refresh';
import { type ProviderOptions } from '../types';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
	fetchExperimentValues: jest.fn(),
	fetchClientSdk: jest.fn(),
}));

const THIRTY_MINUTES = 1800000;
const ONE_HOUR = 3600000;
const TWO_HOURS = 7200000;

const mockProviderOptions: ProviderOptions = {
	apiKey: 'api-key',
	initialFetchTimeout: 15,
	pollingInterval: 5000,
};

const mockIdentifiers: Identifiers = {
	atlassianAccountId: 'abc-123',
	tenantId: '123-abc',
};

const mockCustomAttributes: CustomAttributes = {
	value: 'custom attribute value',
};

const mockCustomAttributesFromFetch = { attributes: '1234' };
const mockExperimentValues = {
	value: '12345',
};

const mockProfileHash = '8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289';
const mockRulesetProfile = {
	customAttributes: mockCustomAttributes,
	identifiers: mockIdentifiers,
	environment: FeatureGateEnvironment.Development,
	perimeter: PerimeterType.COMMERCIAL,
	targetApp: 'targetApp_web',
};

const mockExperimentValuesResponse: FrontendExperimentsResponse = {
	experimentValues: mockExperimentValues,
	customAttributes: mockCustomAttributesFromFetch,
};

export const responseErrorWithStatusCode = (status: number): ResponseError =>
	new ResponseError(`Response Error: ${status}`, status, '{}');

describe('Refresh', () => {
	let mockOnFeatureGateUpdate: jest.Mock;
	let apiKey: string;
	let version: string;
	let oldTimestamp: number;
	let refresh: Refresh;
	let fetchAndRescheduleSpy: jest.SpyInstance;
	let addEventListenerSpy: jest.SpyInstance;
	let removeEventListenerSpy: jest.SpyInstance;
	const mockedFetcher = jest.mocked(Fetcher);

	const setupRefreshForFetch = (): void => {
		(refresh as any).lastUpdateTimestamp = Date.now() - SCHEDULER_OPTIONS_DEFAULT.interval;
	};

	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
		// eslint-disable-next-line no-console
		console.info = jest.fn();
		mockOnFeatureGateUpdate = jest.fn();
		refresh = new Refresh({ apiKey: 'mock-api-key' }, mockOnFeatureGateUpdate);
		refresh.setClientVersion('mock-client-version');
		refresh.updateProfile(mockProfileHash, mockRulesetProfile);
		addEventListenerSpy = jest.spyOn(document, 'addEventListener').mockImplementation(() => {});
		removeEventListenerSpy = jest
			.spyOn(document, 'removeEventListener')
			.mockImplementation(() => {});
		fetchAndRescheduleSpy = jest
			.spyOn(Refresh.prototype as any, 'fetchAndReschedule')
			.mockImplementation(() => {});

		mockedFetcher.fetchExperimentValues.mockResolvedValue(mockExperimentValuesResponse);
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	test('has been initialised correctly', () => {
		expect((refresh as any).pollingConfig).toEqual(SCHEDULER_OPTIONS_DEFAULT);
		expect((refresh as any).failureCount).toEqual(0);
		expect((refresh as any).timerId).toEqual(undefined);
		expect((refresh as any).version).toEqual(undefined);
		expect((refresh as any).lastUpdateTimestamp).toEqual(0);
		expect((refresh as any).onExperimentValuesUpdate).toEqual(mockOnFeatureGateUpdate);
	});

	test('initialised with partial polling config', () => {
		refresh = new Refresh(
			{
				// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
				apiKey,
				pollingInterval: 20,
			},
			mockOnFeatureGateUpdate,
		);
		expect((refresh as any).pollingConfig.interval).toEqual(20);
	});

	test('initialised with bad polling config', () => {
		refresh = new Refresh(
			{
				// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
				apiKey,
				pollingInterval: undefined,
			},
			mockOnFeatureGateUpdate,
		);
		expect((refresh as any).pollingConfig).toEqual(SCHEDULER_OPTIONS_DEFAULT);
	});

	test('start multiple time only have one active timer', async () => {
		fetchAndRescheduleSpy.mockRestore();
		const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');
		(refresh as any).lastUpdateTimestamp = new Date().getTime();

		refresh.start();
		refresh.start();
		refresh.start();
		refresh.start();

		(refresh as any).lastUpdateTimestamp =
			new Date().getTime() - SCHEDULER_OPTIONS_DEFAULT.interval;
		expect(scheduleSpy).toHaveBeenCalledTimes(4);
		jest.runOnlyPendingTimers();

		await new Promise(process.nextTick);

		expect(mockOnFeatureGateUpdate).toHaveBeenCalledTimes(1);
	});

	test('start is setting timeout via fetchAndReschedule', () => {
		fetchAndRescheduleSpy.mockRestore();
		fetchAndRescheduleSpy = jest.spyOn(Refresh.prototype as any, 'fetchAndReschedule');
		const calculateIntervalSpy = jest.spyOn(Refresh.prototype as any, 'calculateInterval');
		(refresh as any).lastUpdateTimestamp = new Date().getTime();
		refresh.start();
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect((refresh as any).timerId).not.toEqual(undefined);
		expect(calculateIntervalSpy).toHaveBeenCalledTimes(1);
		expect(fetchAndRescheduleSpy).toHaveBeenCalled();
	});

	// assert failing
	test.skip('start calls stop before fetchAndReschedule', () => {
		const stopSpy = jest.spyOn(Refresh.prototype as any, 'stop');
		(refresh as any).lastUpdateTimestamp = new Date().getTime();
		refresh.start();
		expect(stopSpy).toHaveBeenCalledBefore(setTimeout as unknown as jest.Mock);
		expect(fetchAndRescheduleSpy).toHaveBeenCalled();
	});

	test('start calls fetchAndReschedule, schedule if on last updated timestamp is fresh', () => {
		fetchAndRescheduleSpy.mockRestore();
		const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');

		// timestamp is fairly new
		(refresh as any).lastUpdateTimestamp = new Date().getTime();
		(refresh as any).start();
		expect(scheduleSpy).toHaveBeenCalled();
	});

	describe('with cached results', () => {
		beforeEach(() => {
			refresh = new Refresh(
				{
					apiKey: 'apiKey',
				},
				mockOnFeatureGateUpdate,
			);
			refresh['pollingConfig'].backOffJitter = 0;
			refresh['pollingConfig'].maxWaitInterval = ONE_HOUR;
			refresh.updateProfile(mockProfileHash, mockRulesetProfile, Date.now());
		});

		test('calculateInterval should return correct interval when no failure', () => {
			let res = (refresh as any).calculateInterval();
			expect(res).toEqual(SCHEDULER_OPTIONS_DEFAULT.interval);

			(refresh as any).pollingConfig.interval = 100;
			res = (refresh as any).calculateInterval();
			expect(res).toEqual(100);
		});

		it.each`
			failureCount | expectedInterval
			${1}         | ${SCHEDULER_OPTIONS_DEFAULT.minWaitInterval}
			${2}         | ${SCHEDULER_OPTIONS_DEFAULT.minWaitInterval * 2}
			${4}         | ${SCHEDULER_OPTIONS_DEFAULT.minWaitInterval * 8}
			${20}        | ${ONE_HOUR}
		`(
			'calculateInterval returns interval: $expectedInterval when failure count is $failureCount, max 1 hour cap applied',
			({ failureCount, expectedInterval }) => {
				(refresh as any).failureCount = failureCount;
				const res = (refresh as any).calculateInterval();
				expect(res).toEqual(expectedInterval);
			},
		);

		// 4800000 backoff is calculated by minWaitInterval * backOffFactor ** (failureCount - 1)
		it.each`
			jitter | expectedMin                                  | expectedMax
			${0.1} | ${4800000 * (1 - 0.1)}                       | ${4800000 * (1 + 0.1)}
			${0.2} | ${4800000 * (1 - 0.2)}                       | ${4800000 * (1 + 0.2)}
			${0.5} | ${4800000 * (1 - 0.5)}                       | ${4800000 * (1 + 0.5)}
			${1}   | ${SCHEDULER_OPTIONS_DEFAULT.minWaitInterval} | ${TWO_HOURS}
		`(
			'calculateInterval uses backoff jitter: $jitter within range [$expectedMin, $expectedMax]',
			({ jitter, expectedMin, expectedMax }) => {
				(refresh as any).pollingConfig.maxWaitInterval = TWO_HOURS;
				(refresh as any).pollingConfig.backOffJitter = jitter;
				(refresh as any).failureCount = 5;
				for (let index = 0; index < 100; index++) {
					const res = (refresh as any).calculateInterval();
					expect(res).toBeGreaterThanOrEqual(expectedMin);
					expect(res).toBeLessThanOrEqual(expectedMax);
				}
			},
		);
	});

	describe('without cached results', () => {
		beforeEach(() => {
			refresh = new Refresh(mockProviderOptions, mockOnFeatureGateUpdate);
			refresh['noCachePollingConfig'].backOffJitter = 0;
			refresh.updateProfile(mockProfileHash, mockRulesetProfile, 0);
		});

		test('calculateInterval should return correct interval when no failure', () => {
			const res = (refresh as any).calculateInterval();
			expect(res).toEqual(0);
		});

		it.each`
			failureCount | expectedInterval
			${1}         | ${0}
			${2}         | ${NO_CACHE_RETRY_OPTIONS_DEFAULT.minWaitInterval * 2}
			${4}         | ${NO_CACHE_RETRY_OPTIONS_DEFAULT.minWaitInterval * 8}
			${20}        | ${NO_CACHE_RETRY_OPTIONS_DEFAULT.maxWaitInterval}
		`(
			'calculateInterval returns interval: $expectedInterval when failure count is $failureCount, max 1 hour cap applied',
			({ failureCount, expectedInterval }) => {
				(refresh as any).failureCount = failureCount;
				const res = (refresh as any).calculateInterval();
				expect(res).toEqual(expectedInterval);
			},
		);

		// 1024000 backoff is calculated by minWaitInterval * backOffFactor ** (failureCount - 1)
		it.each`
			jitter | expectedMin                                       | expectedMax
			${0.1} | ${1024000 * (1 - 0.1)}                            | ${1024000 * (1 + 0.1)}
			${0.2} | ${1024000 * (1 - 0.2)}                            | ${1024000 * (1 + 0.2)}
			${0.5} | ${1024000 * (1 - 0.5)}                            | ${1024000 * (1 + 0.5)}
			${1}   | ${NO_CACHE_RETRY_OPTIONS_DEFAULT.minWaitInterval} | ${THIRTY_MINUTES}
		`(
			'calculateInterval uses backoff jitter: $jitter within range [$expectedMin, $expectedMax]',
			({ jitter, expectedMin, expectedMax }) => {
				(refresh as any).noCachePollingConfig.maxWaitInterval = THIRTY_MINUTES;
				(refresh as any).noCachePollingConfig.backOffJitter = jitter;
				(refresh as any).failureCount = 12;
				for (let index = 0; index < 100; index++) {
					const res = (refresh as any).calculateInterval();
					expect(res).toBeGreaterThanOrEqual(expectedMin);
					expect(res).toBeLessThanOrEqual(expectedMax);
				}
			},
		);
	});

	test('start calls fetchAndReschedule, schedule if on last updated timestamp is old', () => {
		fetchAndRescheduleSpy.mockRestore();
		const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');

		// timestamp is too old
		(refresh as any).lastUpdateTimestamp =
			new Date().getTime() - SCHEDULER_OPTIONS_DEFAULT.interval;
		(refresh as any).start();
		expect(scheduleSpy).not.toHaveBeenCalled();
	});

	test('stop cancels pending timer', () => {
		(refresh as any).timerId = 5;
		refresh.stop();
		expect(clearTimeout).toHaveBeenCalled();
		expect((refresh as any).timerId).toBeUndefined();
	});

	test('updateProfile sets user', () => {
		refresh.updateProfile(mockProfileHash, mockRulesetProfile);
		expect((refresh as any).profileHash).toEqual(mockProfileHash);
		expect((refresh as any).rulesetProfile).toEqual(mockRulesetProfile);
	});

	test('updateProfile resets failure count', () => {
		(refresh as any).failureCount = 5;
		refresh.updateProfile(mockProfileHash, mockRulesetProfile);
		expect((refresh as any).failureCount).toEqual(0);
	});

	test('updateProfile sets the profile has and ruleset', () => {
		const timestamp = Date.now();
		refresh.updateProfile(mockProfileHash, mockRulesetProfile, timestamp);
		expect((refresh as any).profileHash).toEqual(mockProfileHash);
		expect((refresh as any).rulesetProfile).toEqual(mockRulesetProfile);
		expect((refresh as any).lastUpdateTimestamp).toEqual(timestamp);
	});

	test('setClientVersion sets the client version', () => {
		const clientVersion = 'client-version-1';
		expect((refresh as any).clientVersion).not.toEqual(clientVersion);
		refresh.setClientVersion(clientVersion);
		expect((refresh as any).clientVersion).toEqual(clientVersion);
	});

	describe('fetchAndReschedule', () => {
		beforeEach(() => {
			// restore the mock implementation so we can hit fetchAndReschedule code
			fetchAndRescheduleSpy.mockRestore();
		});

		test('schedule again', () => {
			(refresh as any).lastUpdateTimestamp = new Date().getTime();
			const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');

			(refresh as any).fetchAndReschedule();
			expect(scheduleSpy).toHaveBeenCalled();
		});

		test('validation log should be called once', () => {
			(refresh as any).lastUpdateTimestamp = 1;
			refresh['pollingConfig'].interval = 500;

			(refresh as any).fetchAndReschedule();

			// eslint-disable-next-line no-console
			expect(console.info).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line no-console
			expect(console.info).toHaveBeenCalledWith(
				'options.pollingInterval needs to be greater than 1000, interval has been set to minimum',
			);
		});

		test('calls fetcher to fetchFeatureFlags', () => {
			(refresh as any).fetchAndReschedule();
			expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalled();
		});

		test('pass correct params to fetcher', () => {
			(refresh as any).lastUpdateTimestamp =
				new Date().getTime() - SCHEDULER_OPTIONS_DEFAULT.interval;
			(refresh as any).fetchAndReschedule();
			refresh.updateProfile(
				mockProfileHash,
				mockRulesetProfile,
				new Date().getTime() - SCHEDULER_OPTIONS_DEFAULT.interval,
			);
			expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				'mock-client-version',
				{
					apiKey: 'mock-api-key',
					environment: mockRulesetProfile.environment,
					perimeter: mockRulesetProfile.perimeter,
					targetApp: mockRulesetProfile.targetApp,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('handles success resp from fetcher', async () => {
			(refresh as any).failureCount = 1;
			const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');
			setupRefreshForFetch();
			refresh.start();

			await new Promise(process.nextTick);

			expect((refresh as any).failureCount).toEqual(0);
			expect(scheduleSpy).toHaveBeenCalled();
			expect(mockOnFeatureGateUpdate).toHaveBeenCalled();
			expect(mockOnFeatureGateUpdate).toHaveBeenCalledWith({
				experimentValuesResponse: mockExperimentValuesResponse,
				profileHash: mockProfileHash,
				rulesetProfile: mockRulesetProfile,
				timestamp: Date.now(),
			});
			expect(setTimeout).toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledWith(
				expect.anything(),
				SCHEDULER_OPTIONS_DEFAULT.interval,
			);
		});

		test('handles error resp from fetcher', async () => {
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValueOnce(responseErrorWithStatusCode(429));
			(refresh as any).failureCount = 1;
			(refresh as any).pollingConfig.backOffJitter = 0;
			// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
			(refresh as any).lastUpdateTimestamp = oldTimestamp;
			// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
			(refresh as any).version = version;
			const startSpy = jest.spyOn(Refresh.prototype as any, 'start');
			setupRefreshForFetch();
			refresh.start();

			await new Promise(process.nextTick);

			expect((refresh as any).failureCount).toEqual(2);
			expect(startSpy).toHaveBeenCalled();
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledWith(
				expect.anything(),
				SCHEDULER_OPTIONS_DEFAULT.minWaitInterval * 2,
			);
		});
		test.skip('handles multiple error resp from fetcher, finally success after retries', async () => {
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValueOnce(responseErrorWithStatusCode(429));
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValueOnce(responseErrorWithStatusCode(428));

			(refresh as any).failureCount = 1;
			(refresh as any).pollingConfig.backOffJitter = 0;
			// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
			(refresh as any).lastUpdateTimestamp = oldTimestamp;

			const scheduleSpy = jest.spyOn(Refresh.prototype as any, 'schedule');

			(refresh as any).fetchAndReschedule();

			expect((refresh as any).failureCount).toEqual(2);
			expect(scheduleSpy).toHaveBeenCalledTimes(1);
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledTimes(1);
			expect(setTimeout).toHaveBeenCalledWith(
				expect.anything(),
				SCHEDULER_OPTIONS_DEFAULT.minWaitInterval * 2,
			);

			jest.clearAllMocks();
			jest.runOnlyPendingTimers();
			expect((refresh as any).failureCount).toEqual(3);
			expect(scheduleSpy).toHaveBeenCalledTimes(1);
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledTimes(1);
			expect(setTimeout).toHaveBeenCalledWith(
				expect.anything(),
				SCHEDULER_OPTIONS_DEFAULT.minWaitInterval * 4,
			);

			jest.clearAllMocks();
			jest.runOnlyPendingTimers();
			expect((refresh as any).failureCount).toEqual(0);
			expect(scheduleSpy).toHaveBeenCalledTimes(1);
			expect(mockOnFeatureGateUpdate).toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledTimes(1);
			expect(setTimeout).toHaveBeenCalledWith(
				expect.anything(),
				SCHEDULER_OPTIONS_DEFAULT.interval,
			);
		});

		test('handles 500 error resp from fetcher, reschedule for a retry', async () => {
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValue(responseErrorWithStatusCode(500));
			(refresh as any).failureCount = 0;
			setupRefreshForFetch();

			const exitingTimestamp = (refresh as any).lastUpdateTimestamp;

			refresh.start();

			await new Promise(process.nextTick);

			expect((refresh as any).failureCount).toEqual(1);
			expect((refresh as any).lastUpdateTimestamp).toEqual(exitingTimestamp);
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).toHaveBeenCalledTimes(1);
		});

		test('handles 401 error resp from fetcher', async () => {
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValue(responseErrorWithStatusCode(401));
			(refresh as any).failureCount = 1;
			setupRefreshForFetch();
			refresh.start();

			expect((refresh as any).failureCount).toEqual(1);
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).not.toHaveBeenCalled();
		});

		test('handles 400 error resp from fetcher', async () => {
			mockedFetcher.fetchExperimentValues = jest
				.fn()
				.mockRejectedValue(responseErrorWithStatusCode(400));
			(refresh as any).failureCount = 1;
			setupRefreshForFetch();
			refresh.start();

			expect((refresh as any).failureCount).toEqual(1);
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
			expect(setTimeout).not.toHaveBeenCalled();
		});

		test('does not process response if user was switched', async () => {
			// Start the fetch
			setupRefreshForFetch();
			refresh.start();

			// Update the user context before the fetch is finished
			refresh.updateProfile('different-profile-hash', mockRulesetProfile);

			// Wait for the fetch to finish
			await new Promise(process.nextTick);

			// Fetch was for the previous use so should not trigger updated
			expect(mockOnFeatureGateUpdate).not.toHaveBeenCalled();
		});
	});

	describe('tab hidden', () => {
		let bindVisibilityChangeSpy: jest.SpyInstance;
		let unbindVisibilityChangeSpy: jest.SpyInstance;
		let visibilityChangeHandlerSpy: jest.SpyInstance;
		// let isFetchRequiredSpy: jest.SpyInstance;
		// let scheduleSpy: jest.SpyInstance;
		const isTabHiddenOriginal = (Refresh as any).isTabHidden;

		beforeEach(() => {
			fetchAndRescheduleSpy.mockRestore();
			bindVisibilityChangeSpy = jest.spyOn(refresh as any, 'bindVisibilityChange');
			unbindVisibilityChangeSpy = jest.spyOn(refresh as any, 'unbindVisibilityChange');
			jest.spyOn(refresh as any, 'isFetchRequired').mockReturnValue(false);
		});

		afterEach(() => {
			refresh.stop();
			// restore isTabHidden static function
			(Refresh as any).isTabHidden = isTabHiddenOriginal;
		});

		test('start refresh will bind listener on visibilitychange', () => {
			refresh.start();
			expect(bindVisibilityChangeSpy).toHaveBeenCalledTimes(1);
		});

		test('stop refresh will unbind listener on visibilitychange', () => {
			refresh.start();
			refresh.stop();
			expect(unbindVisibilityChangeSpy).toHaveBeenCalledTimes(1);
		});

		test('restart refresh will rebind listener on visibilitychange', () => {
			refresh.start();
			expect(bindVisibilityChangeSpy).toHaveBeenCalledTimes(1);
			refresh.stop();
			expect(unbindVisibilityChangeSpy).toHaveBeenCalledTimes(1);
			refresh.start();
			expect(bindVisibilityChangeSpy).toHaveBeenCalledTimes(2);
		});

		test('visibility change trigger handler on active refresh', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			visibilityChangeHandlerSpy = jest.spyOn(refresh as any, 'visibilityChangeHandler');
			refresh.start();
			document.dispatchEvent(new Event('visibilitychange'));
			expect(visibilityChangeHandlerSpy).toHaveBeenCalledTimes(1);
		});

		test('visibility change doesnt trigger handler on inactive refresh', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			visibilityChangeHandlerSpy = jest.spyOn(refresh as any, 'visibilityChangeHandler');
			document.dispatchEvent(new Event('visibilitychange'));
			expect(visibilityChangeHandlerSpy).toHaveBeenCalledTimes(0);
		});

		test('visibility change doesnt trigger handler on stopped refresh', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			visibilityChangeHandlerSpy = jest.spyOn(refresh as any, 'visibilityChangeHandler');
			refresh.start();
			refresh.stop();
			document.dispatchEvent(new Event('visibilitychange'));
			expect(visibilityChangeHandlerSpy).toHaveBeenCalledTimes(0);
		});

		test('visibility change cancel current schedule', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
			refresh.start();
			document.dispatchEvent(new Event('visibilitychange'));
			expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
		});

		test('visibility change do a schedule if tab is hidden', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			const scheduleSpy = jest.spyOn(refresh as any, 'schedule');
			refresh.start();
			// schedule a normal interval poll
			expect(scheduleSpy).toHaveBeenCalledTimes(1);
			(Refresh as any).isTabHidden = jest.fn().mockReturnValue(true);
			document.dispatchEvent(new Event('visibilitychange'));
			// schedule a long interval poll
			expect(scheduleSpy).toHaveBeenCalledTimes(2);
		});

		test('visibility change do a fetchAndReschedule if tab is active', () => {
			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
			fetchAndRescheduleSpy = jest.spyOn(refresh as any, 'fetchAndReschedule');
			refresh.start();
			// on start, do a fetchAndReschedule
			expect(fetchAndRescheduleSpy).toHaveBeenCalledTimes(1);
			(Refresh as any).isTabHidden = jest.fn().mockReturnValue(false);
			document.dispatchEvent(new Event('visibilitychange'));
			// on tab back to active, do another fetchAndReschedule
			expect(fetchAndRescheduleSpy).toHaveBeenCalledTimes(2);
		});
	});

	describe('setTimestamp', () => {
		test('should keep timestamp at 0', () => {
			refresh.setTimestamp(Date.now());
			expect(refresh['lastUpdateTimestamp']).not.toBe(0);
			refresh.setTimestamp(0);
			expect(refresh['lastUpdateTimestamp']).toBe(0);
		});

		test('should update stale timestamp to be 0', () => {
			refresh.setTimestamp(Date.now());
			expect(refresh['lastUpdateTimestamp']).not.toBe(0);
			expect(refresh['lastUpdateTimestamp']).not.toBe(100);
			refresh.setTimestamp(100);
			expect(refresh['lastUpdateTimestamp']).toBe(0);
		});

		test('should keep fresh timestamp', () => {
			const newTimestamp = Date.now();
			expect(refresh['lastUpdateTimestamp']).not.toBe(newTimestamp);
			refresh.setTimestamp(newTimestamp);
			expect(refresh['lastUpdateTimestamp']).toBe(newTimestamp);
		});
	});

	describe('updateProfile', () => {
		test('should keep timestamp at 0', () => {
			refresh.setTimestamp(Date.now());
			expect(refresh['lastUpdateTimestamp']).not.toBe(0);
			refresh.updateProfile(mockProfileHash, mockRulesetProfile, 0);
			expect(refresh['lastUpdateTimestamp']).toBe(0);
		});

		test('should update stale timestamp to be 0', () => {
			refresh.setTimestamp(Date.now());
			expect(refresh['lastUpdateTimestamp']).not.toBe(0);
			expect(refresh['lastUpdateTimestamp']).not.toBe(100);
			refresh.updateProfile(mockProfileHash, mockRulesetProfile, 100);
			expect(refresh['lastUpdateTimestamp']).toBe(0);
		});

		test('should keep fresh timestamp', () => {
			const newTimestamp = Date.now();
			expect(refresh['lastUpdateTimestamp']).not.toBe(newTimestamp);
			refresh.updateProfile(mockProfileHash, mockRulesetProfile, newTimestamp);
			expect(refresh['lastUpdateTimestamp']).toBe(newTimestamp);
		});
	});
});
