import { DEFAULT_CONFIG } from '../constants';

import {
	MOCK_CONNECTED_TEAMS,
	MOCK_CONNECTED_TEAMS_RESULT,
	MOCK_NUMBER_OF_CONNECTED_TEAMS,
	MOCK_TEAM_CONTAINERS,
} from './mocks';

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

	describe('unlinkTeamContainer', () => {
		it('should call makeGraphQLRequest with correct parameters', async () => {
			const teamId = 'team-id';
			const containerId = 'container-id';

			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue({});

			await aggClient.unlinkTeamContainer(teamId, containerId);

			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						teamId: 'ari:cloud:identity::team/team-id',
						containerId,
					},
				},
				{
					operationName: 'UnlinkContainerMutation',
				},
			);
		});
	});

	describe('queryNumberOfTeamConnectedToContainer', () => {
		const containerId = 'mock-container-id';

		it('should call makeGraphQLRequest with correct parameters', async () => {
			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_NUMBER_OF_CONNECTED_TEAMS);
			await aggClient.queryNumberOfTeamConnectedToContainer(containerId);
			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						containerId,
					},
				},
				{
					operationName: 'NumberOfTeamConnectedToContainerQuery',
				},
			);
		});

		it('should return the correct result', async () => {
			jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_NUMBER_OF_CONNECTED_TEAMS);

			const result = await aggClient.queryNumberOfTeamConnectedToContainer(containerId);
			expect(result).toEqual(1);
		});
	});

	describe('queryTeamsConnectedToContainer', () => {
		const containerId = 'mock-container-id';

		it('should call makeGraphQLRequest with correct parameters', async () => {
			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_CONNECTED_TEAMS);
			await aggClient.queryTeamsConnectedToContainer(containerId);
			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						containerId,
					},
				},
				{
					operationName: 'TeamConnectedToContainerQuery',
				},
			);
		});

		it('should return the correct result', async () => {
			jest.spyOn(AGGClient.prototype, 'makeGraphQLRequest').mockResolvedValue(MOCK_CONNECTED_TEAMS);

			const result = await aggClient.queryTeamsConnectedToContainer(containerId);
			expect(result).toEqual(MOCK_CONNECTED_TEAMS_RESULT);
		});
	});
});
