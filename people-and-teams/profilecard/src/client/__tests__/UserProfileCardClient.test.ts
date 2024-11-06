import fetchMock from 'fetch-mock/cjs/client';

import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { AGGErrors } from '../../util/errors';
import { AGGQuery } from '../graphqlUtils';
import UserProfileCardClient, { buildAggUserQuery } from '../UserProfileCardClient';

jest.mock('../../util/performance', () => ({
	getPageTime: jest.fn(() => 1000),
}));

jest.mock('../../util/analytics', () => ({
	userRequestAnalytics: jest.fn((status, attrs) => ({
		status,
		attrs,
	})),
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

const mockAggError = new AGGErrors([{ message: 'Test error', extensions: {} }], 'test-id');

describe('UserProfileCardClient', () => {
	const options = {
		gatewayGraphqlUrl: 'https://test.com/gateway/api/graphql',
		cacheMaxAge: 1000,
	};

	const userId = 'test-user';
	const cloudId = 'test-cloud';

	let client: UserProfileCardClient;

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

	it('should make a request if profile is not cached', async () => {
		const spy = jest.spyOn(client, 'makeRequest');
		await client.getProfile(cloudId, userId, mockAnalytics);
		expect(spy).toHaveBeenCalledWith(cloudId, userId);
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

		it('should handle request errors', async () => {
			(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

			await expect(client.getProfile(cloudId, userId, mockAnalytics)).rejects.toThrow('AGGErrors');
		});

		it('should call analytics when makeRequest throws an error', async () => {
			(AGGQuery as jest.Mock).mockRejectedValue(mockAggError);

			await expect(client.getProfile(cloudId, userId, mockAnalytics)).rejects.toThrow('AGGErrors');

			expect(mockAnalytics).toHaveBeenCalled();
		});
	});
});

describe('UserProfileCardClient query tests', () => {
	parseAndTestGraphQLQueries([buildAggUserQuery('').query]);
});
