import fetchMock from 'fetch-mock/cjs/client';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { AGGErrors } from '../../util/errors';
import { AGGQuery } from '../graphqlUtils';
import UserProfileCardClient, { buildAggUserQuery } from '../UserProfileCardClient';

jest.mock('../../util/performance', () => ({
	getPageTime: jest.fn(() => 1000),
}));

jest.mock('../graphqlUtils');
(AGGQuery as jest.Mock).mockImplementation(() =>
	Promise.resolve({
		user: {
			zoneinfo: 'test-zoneinfo',
		},
	}),
);

const mockAnalytics = jest.fn();
const mockAnalyticsNext = jest.fn();

const mockAggError = new AGGErrors([{ message: 'Test error', extensions: {} }], 'test-id');

describe('UserProfileCardClient', () => {
	const options = {
		gatewayGraphqlUrl: 'https://test.com/gateway/api/graphql',
		cacheMaxAge: 1000,
	};

	const userId = 'test-user';
	const cloudId = 'test-cloud';

	let client: UserProfileCardClient;
	const triggeredEvent = {
		eventType: 'operational',
		actionSubject: 'profilecard',
		action: 'triggered',
		actionSubjectId: 'request',
		attributes: {
			firedAt: 1000,
			packageName: '@product/platform',
			packageVersion: '0.0.0',
		},
	};
	const successEvent = {
		eventType: 'operational',
		actionSubject: 'profilecard',
		action: 'succeeded',
		actionSubjectId: 'request',
		attributes: {
			duration: 0,
			firedAt: 1000,
			packageName: '@product/platform',
			packageVersion: '0.0.0',
		},
	};

	const failedEvent = {
		eventType: 'operational',
		actionSubject: 'profilecard',
		action: 'failed',
		actionSubjectId: 'request',
		attributes: {
			duration: 0,
			errorCount: 1,
			errorDetails: [
				{
					errorCategory: undefined,
					errorMessage: 'Test error',
					errorStatusCode: undefined,
					errorType: undefined,
					isSLOFailure: true,
				},
			],
			errorMessage: 'AGGErrors',
			isSLOFailure: true,
			traceId: 'test-id',
			firedAt: 1000,
			packageName: '@product/platform',
			packageVersion: '0.0.0',
		},
	};

	beforeEach(() => {
		client = new UserProfileCardClient(options);
		jest.clearAllMocks();
	});

	it('should return a cached profile if it exists', async () => {
		const spy = jest.spyOn(client, 'makeRequest');
		client.setCachedProfile(`${cloudId}/${userId}`, { id: userId });
		const result = await client.getProfile(cloudId, userId, mockAnalytics);
		expect(spy).not.toHaveBeenCalled();
		expect(result).toEqual(expect.objectContaining({ id: userId }));
	});

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should make a request if profile is not cached', async () => {
			const spy = jest.spyOn(client, 'makeRequest');
			await client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext);
			expect(spy).toHaveBeenCalledWith(cloudId, userId);
			expect(mockAnalyticsNext).not.toHaveBeenCalled();
			expect(mockAnalytics).toHaveBeenCalledWith(triggeredEvent);
			expect(mockAnalytics).toHaveBeenCalledWith(successEvent);
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should make a request if profile is not cached', async () => {
			const spy = jest.spyOn(client, 'makeRequest');
			await client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext);
			expect(spy).toHaveBeenCalledWith(cloudId, userId);
			expect(mockAnalytics).not.toHaveBeenCalled();
			expect(mockAnalyticsNext).toHaveBeenCalledWith(
				`${triggeredEvent.eventType}.${triggeredEvent.actionSubject}.${triggeredEvent.action}.${triggeredEvent.actionSubjectId}`,
				triggeredEvent.attributes,
			);
			expect(mockAnalyticsNext).toHaveBeenCalledWith(
				`${successEvent.eventType}.${successEvent.actionSubject}.${successEvent.action}.${successEvent.actionSubjectId}`,
				successEvent.attributes,
			);
		});
	});
	describe('makeRequest', () => {
		beforeEach(() => {
			client = new UserProfileCardClient(options);
			fetchMock.mock({
				options: {
					method: 'GET',
				},
				matcher: `begin:/gateway/api/teams/site`,
				response: { isPresent: true },
			});
			// jest.clearAllMocks();
		});

		afterEach(() => {
			fetchMock.restore();
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should handle request errors', async () => {
				(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

				await expect(
					client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext),
				).rejects.toThrow('AGGErrors');
			});

			it('should call analytics when makeRequest throws an error', async () => {
				(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

				await expect(
					client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext),
				).rejects.toThrow('AGGErrors');

				expect(mockAnalyticsNext).not.toHaveBeenCalled();
				expect(mockAnalytics).toHaveBeenCalledWith(triggeredEvent);
				expect(mockAnalytics).toHaveBeenCalledWith(failedEvent);
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should handle request errors', async () => {
				(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

				await expect(
					client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext),
				).rejects.toThrow('AGGErrors');
			});

			it('should call analytics when makeRequest throws an error', async () => {
				(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

				await expect(
					client.getProfile(cloudId, userId, mockAnalytics, mockAnalyticsNext),
				).rejects.toThrow('AGGErrors');

				expect(mockAnalytics).not.toHaveBeenCalled();
				expect(mockAnalyticsNext).toHaveBeenCalledWith(
					`${triggeredEvent.eventType}.${triggeredEvent.actionSubject}.${triggeredEvent.action}.${triggeredEvent.actionSubjectId}`,
					triggeredEvent.attributes,
				);

				expect(mockAnalyticsNext).toHaveBeenCalledWith(
					`${failedEvent.eventType}.${failedEvent.actionSubject}.${failedEvent.action}.${failedEvent.actionSubjectId}`,
					{
						...failedEvent.attributes,
						errorNumber: null,
						errorStatusCode: null,
						errorType: null,
						errorPath: null,
						errorCategory: null,
						errorDetails: [
							{
								...failedEvent.attributes.errorDetails[0],
								errorNumber: null,
								errorStatusCode: null,
								errorType: null,
								errorPath: null,
								errorCategory: null,
								errorCount: null,
								traceId: null,
								errorDetails: null,
							},
						],
					},
				);
			});
		});
	});
});

describe('UserProfileCardClient query tests', () => {
	parseAndTestGraphQLQueries([buildAggUserQuery('').query]);
});
