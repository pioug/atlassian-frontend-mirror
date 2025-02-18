import { DEFAULT_CONFIG } from '../constants';

import { MOCK_TEAM_CONTAINERS } from './mocks';

import { AGGClient } from './index';

describe('AGGClient', () => {
	let aggClient: AGGClient;

	beforeEach(() => {
		aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, { logException: () => {} });
	});

	it('should set baseUrl correctly', () => {
		const baseUrl = 'https://new-base-url.com';
		aggClient.setBaseUrl(baseUrl);
		expect(aggClient['serviceUrl']).toEqual(`${baseUrl}/graphql`);
	});

	describe('queryTeamContainers', () => {
		it('should call makeGraphQLRequest with correct parameters', async () => {
			const teamId = 'team-id';

			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_TEAM_CONTAINERS);

			await aggClient.getTeamContainers(teamId);

			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						cypherQuery: expect.stringContaining(teamId),
					},
				},
				{
					operationName: 'TeamContainersQuery',
				},
			);
		});
	});
});
