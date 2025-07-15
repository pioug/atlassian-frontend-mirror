import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DEFAULT_CONFIG } from '../constants';

import {
	MOCK_CONNECTED_TEAMS,
	MOCK_CONNECTED_TEAMS_RESULT,
	MOCK_NUMBER_OF_CONNECTED_TEAMS,
	MOCK_TEAM_CONTAINERS,
	MOCK_TEAM_CONTAINERSV2,
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
		ffTest.on('teams_containers_cypher_query_v2_migration', 'cypherQueryV2', () => {
			it('should call makeGraphQLRequest with correct parameters for V2 query', async () => {
				const teamId = 'team-id';

				const makeRequestSpy = jest
					.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
					.mockResolvedValue(MOCK_TEAM_CONTAINERSV2);

				await aggClient.getTeamContainers(teamId);

				expect(makeRequestSpy).toHaveBeenCalledWith(
					{
						query: expect.any(String),
						variables: {
							cypherQuery: expect.stringContaining(teamId),
							params: expect.objectContaining({
								id: expect.stringContaining(teamId),
							}),
						},
					},
					{
						operationName: 'TeamContainersQueryV2',
					},
				);
			});

			it('should process V2 response correctly', async () => {
				const teamId = 'team-id';

				jest
					.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
					.mockResolvedValue(MOCK_TEAM_CONTAINERSV2);

				const result = await aggClient.getTeamContainers(teamId);
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
				expect(result).toHaveLength(2);
				expect(result[0]).toEqual(
					expect.objectContaining({
						id: '2',
						type: 'ConfluenceSpace',
						name: 'Confluence Space',
					}),
				);
				expect(result[1]).toEqual(
					expect.objectContaining({
						id: '3',
						type: 'JiraProject',
						name: 'Jira Project',
					}),
				);
			});
		});

		ffTest.off('teams_containers_cypher_query_v2_migration', 'cypherQuery', () => {
			it('should call makeGraphQLRequest with correct parameters for V1 query', async () => {
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

			it('should process V1 response correctly', async () => {
				const teamId = 'team-id';

				jest
					.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
					.mockResolvedValue(MOCK_TEAM_CONTAINERS);

				const result = await aggClient.getTeamContainers(teamId);
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
				expect(result).toHaveLength(2);
				expect(result[0]).toEqual(
					expect.objectContaining({
						id: '2',
						type: 'ConfluenceSpace',
						name: 'Confluence Space',
					}),
				);
				expect(result[1]).toEqual(
					expect.objectContaining({
						id: '3',
						type: 'JiraProject',
						name: 'Jira Project',
					}),
				);
			});
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
