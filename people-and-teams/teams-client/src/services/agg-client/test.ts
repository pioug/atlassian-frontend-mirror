import { type MembershipState, type ResultWithPageInfo, type TeamMembership } from '../../types';
import { DEFAULT_CONFIG } from '../constants';
import { logException } from '../sentry/main';

import { MOCK_TEAM, MOCK_USER } from './mocks';

import { AGGClient } from './index';

describe('AGGClient', () => {
	let aggClient: AGGClient;

	beforeEach(() => {
		aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, { logException });
	});

	it('should set baseUrl correctly', () => {
		const baseUrl = 'https://new-base-url.com';
		aggClient.setBaseUrl(baseUrl);
		expect(aggClient['serviceUrl']).toEqual(`${baseUrl}/graphql`);
	});

	describe('queryTeamMemberships', () => {
		const teamId = '123456';
		const membershipState: MembershipState[] = ['FULL_MEMBER'];
		const pageInfo = { first: 100 };

		it('should call makeGraphQLRequest with correct parameters', async () => {
			aggClient.setContext({ cloudId: 'cloudId' });
			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_TEAM);
			await aggClient.queryTeamMemberships(teamId, membershipState, pageInfo);
			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						teamId,
						membershipState,
						siteId: 'cloudId',
						...pageInfo,
					},
				},
				{
					operationName: 'TeamMembership',
				},
			);
		});

		it('should return the correct result', async () => {
			jest.spyOn(AGGClient.prototype, 'makeGraphQLRequest').mockResolvedValue(MOCK_TEAM);

			const result = await aggClient.queryTeamMemberships(teamId, membershipState, pageInfo);
			const expectedResult: ResultWithPageInfo<TeamMembership> = {
				edges: [
					{
						membershipId: {
							teamId,
							memberId: '1',
						},
						state: 'FULL_MEMBER',
						role: 'REGULAR',
						user: {
							id: '1',
							fullName: 'user1',
							avatarUrl: 'url1',
							status: 'active',
							title: 'CPA - Chief Party Animal',
							userType: 'user',
						},
					},
					{
						membershipId: {
							teamId,
							memberId: '2',
						},
						state: 'FULL_MEMBER',
						role: 'REGULAR',
						user: {
							id: '2',
							fullName: 'user2',
							avatarUrl: 'url2',
							status: 'active',
							title: 'Deputy Party Animal',
							userType: 'user',
						},
					},
				],
				pageInfo: {
					hasNextPage: false,
					endCursor: 'end',
				},
			};
			expect(result).toEqual(expectedResult);
		});
	});

	describe('queryAGGUser', () => {
		const userId = MOCK_USER.user.id;

		it('should call makeGraphQLRequest with correct parameters', async () => {
			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(MOCK_USER);
			await aggClient.queryAGGUser(userId);
			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						userId,
					},
				},
				{
					operationName: 'TeamsUserQuery',
				},
			);
		});

		it('should return the correct result', async () => {
			jest.spyOn(AGGClient.prototype, 'makeGraphQLRequest').mockResolvedValue(MOCK_USER);

			const result = await aggClient.queryAGGUser(userId);
			expect(result).toEqual(MOCK_USER.user);
		});
	});

	describe('queryTeamHasAgents', () => {
		const teamId = 'team123';

		it('should call makeGraphQLRequest with correct parameters', async () => {
			const makeRequestSpy = jest
				.spyOn(AGGClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue({ graphStore: { teamHasAgents: { edges: [] } } });
			await aggClient.queryTeamHasAgents(teamId);
			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.stringContaining('TeamHasAgentsQuery'),
					variables: {
						id: `ari:cloud:identity::team/${teamId}`,
					},
				},
				{
					operationName: 'TeamHasAgentsQuery',
				},
			);
		});

		it('should return an empty array if no agents are found', async () => {
			jest.spyOn(AGGClient.prototype, 'makeGraphQLRequest').mockResolvedValue({
				graphStore: { teamHasAgents: { edges: [] } },
			});

			const result = await aggClient.queryTeamHasAgents(teamId);
			expect(result).toEqual([]);
		});

		it('should return the correct agents', async () => {
			const mockResponse = {
				graphStore: {
					teamHasAgents: {
						edges: [
							{
								node: {
									id: 'ari:cloud:identity::user/agent1',
									name: 'Agent One',
									picture: 'url1',
								},
							},
							{
								node: {
									id: 'ari:cloud:identity::user/agent2',
									name: 'Agent Two',
									picture: 'url2',
								},
							},
						],
					},
				},
			};
			jest.spyOn(AGGClient.prototype, 'makeGraphQLRequest').mockResolvedValue(mockResponse);

			const result = await aggClient.queryTeamHasAgents(teamId);
			expect(result).toEqual([
				{
					associationId: { teamId, memberId: 'agent1' },
					agent: {
						id: 'ari:cloud:identity::user/agent1',
						fullName: 'Agent One',
						avatarUrl: 'url1',
					},
				},
				{
					associationId: { teamId, memberId: 'agent2' },
					agent: {
						id: 'ari:cloud:identity::user/agent2',
						fullName: 'Agent Two',
						avatarUrl: 'url2',
					},
				},
			]);
		});
	});
});
