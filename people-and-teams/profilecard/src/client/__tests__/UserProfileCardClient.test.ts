import fetchMock from 'fetch-mock/cjs/client';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { AGGErrors, DirectoryGraphQLErrors } from '../../util/errors';
import { AGGQuery, directoryGraphqlQuery } from '../graphqlUtils';
import UserProfileCardClient, { buildAggUserQuery, buildUserQuery } from '../UserProfileCardClient';

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
(directoryGraphqlQuery as jest.Mock).mockImplementation(() => Promise.resolve({ User: {} }));
(AGGQuery as jest.Mock).mockImplementation(() => Promise.resolve({ User: {} }));

const mockAnalytics = jest.fn();

const mockDirectoryError = new DirectoryGraphQLErrors(
	[{ message: 'Test error', category: 'Internal', type: 'type' }],
	'test-id',
);
const mockAggError = new AGGErrors([{ message: 'Test error', extensions: {} }], 'test-id');

describe('UserProfileCardClient', () => {
	const options = {
		url: 'https://test.com',
		cacheMaxAge: 1000,
	};

	const userId = 'test-user';
	const cloudId = 'test-cloud';

	let client: UserProfileCardClient;

	beforeEach(() => {
		client = new UserProfileCardClient(options);
		jest.clearAllMocks();
	});

	it('should throw an error if options.url is not provided', async () => {
		// @ts-ignore
		client = new UserProfileCardClient({});
		await expect(client.makeRequest(cloudId, userId)).rejects.toThrow(
			'options.url is a required parameter',
		);
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

	it('should handle request errors', async () => {
		(directoryGraphqlQuery as jest.Mock).mockRejectedValue(mockDirectoryError);

		await expect(client.getProfile(cloudId, userId, mockAnalytics)).rejects.toThrow(
			'DirectoryGraphQLErrors',
		);
	});

	it('should call analytics when makeRequest throws an error', async () => {
		(directoryGraphqlQuery as jest.Mock).mockRejectedValue(mockDirectoryError);

		await expect(client.getProfile(cloudId, userId, mockAnalytics)).rejects.toThrow(
			'DirectoryGraphQLErrors',
		);

		expect(mockAnalytics).toHaveBeenLastCalledWith({
			attrs: {
				duration: 0,
				errorCount: 1,
				errorDetails: [
					{
						errorCategory: 'Internal',
						errorNumber: undefined,
						errorPath: '',
						errorType: 'type',
						errorMessage: 'Test error',
						isSLOFailure: true,
					},
				],
				errorMessage: 'DirectoryGraphQLErrors',
				isSLOFailure: true,
				traceId: 'test-id',
			},
			status: 'failed',
		});
	});

	ffTest.on('migrate_cloud_user_to_agg_user_query', 'with cloudUser migration on', () => {
		const optionsNext = {
			gatewayGraphqlUrl: 'https://test.com',
			cacheMaxAge: 1000,
		};

		const userId = 'test-user';
		const cloudId = 'test-cloud';

		let client: UserProfileCardClient;

		beforeEach(() => {
			client = new UserProfileCardClient(optionsNext);
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

		it('should throw an error if options.gatewayGraphqlUrl is not provided', async () => {
			// @ts-ignore
			client = new UserProfileCardClient({});
			await expect(client.makeRequest(cloudId, userId)).rejects.toThrow(
				'options.gatewayGraphqlUrl is a required parameter',
			);
		});

		it('should throw an error if user not present in the site', async () => {
			fetchMock.restore();
			fetchMock.mock({
				options: {
					method: 'GET',
				},
				matcher: `begin:/gateway/api/teams/site`,
				response: { isPresent: false },
			});

			await expect(client.makeRequest(cloudId, userId)).rejects.toThrow(
				'Unable to fetch user: User does not exist in this site',
			);
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
	parseAndTestGraphQLQueries([buildUserQuery('', '').query]);
	parseAndTestGraphQLQueries([buildAggUserQuery('').query]);
});
