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
});
