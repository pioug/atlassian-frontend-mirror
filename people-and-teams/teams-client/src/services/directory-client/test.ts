import { directoryClient } from './index';

describe('(Common) Directory client', () => {
	const makeGraphQLRequestStub = jest.spyOn(directoryClient, 'makeGraphQLRequest');

	afterEach(() => {
		makeGraphQLRequestStub.mockReset();
	});

	it('should construct the correct query TeamMembership GraphQL request', async () => {
		makeGraphQLRequestStub.mockResolvedValueOnce({ TeamMembership: [] });
		await directoryClient.queryTeamMemberships('abc-123', undefined);
		expect(makeGraphQLRequestStub).toHaveBeenCalledTimes(1);
		expect(makeGraphQLRequestStub).toHaveBeenCalledWith(
			{
				query: `query TeamMembership($teamId: String!, $membershipState: [TeamMembershipStatus]) {
    TeamMembership: TeamMembership(teamId: $teamId, membershipStates: $membershipState) {
      user: profile {
        id,
        fullName,
        title,
        avatarUrl,
        timezone,
        status
      },
      state:membershipStatus,
      role,
      membershipId {
        teamId, memberId
      }
    }
  }`,
				variables: {
					teamId: 'abc-123',
					membershipState: ['FULL_MEMBER'],
				},
			},
			{ operationName: 'TeamMembership' },
		);
	});

	it('should construct the correct query TeamMembership GraphQL request taking membership state', async () => {
		makeGraphQLRequestStub.mockResolvedValueOnce({ TeamMembership: [] });
		await directoryClient.queryTeamMemberships('abc-123', ['INVITED']);
		expect(makeGraphQLRequestStub).toHaveBeenCalledTimes(1);
		expect(makeGraphQLRequestStub).toHaveBeenCalledWith(
			{
				query: `query TeamMembership($teamId: String!, $membershipState: [TeamMembershipStatus]) {
    TeamMembership: TeamMembership(teamId: $teamId, membershipStates: $membershipState) {
      user: profile {
        id,
        fullName,
        title,
        avatarUrl,
        timezone,
        status
      },
      state:membershipStatus,
      role,
      membershipId {
        teamId, memberId
      }
    }
  }`,
				variables: {
					teamId: 'abc-123',
					membershipState: ['INVITED'],
				},
			},
			{ operationName: 'TeamMembership' },
		);
	});

	describe('retries for team membership not found', () => {
		it('should retry querying team membership on 404', async () => {
			makeGraphQLRequestStub
				.mockRejectedValueOnce({ category: 'NotFound' })
				.mockResolvedValueOnce({ TeamMembership: [] });

			const response = await directoryClient.queryTeamMemberships('the-gaggle');

			expect(response).toEqual([]);
			expect(makeGraphQLRequestStub).toHaveBeenCalledTimes(2);
		});

		it('should respect maximum retries for team membership on 404', async () => {
			makeGraphQLRequestStub.mockRejectedValue({ category: 'NotFound' });

			await expect(directoryClient.queryTeamMemberships('the-gaggle')).rejects.toEqual({
				category: 'NotFound',
			});
			expect(makeGraphQLRequestStub).toHaveBeenCalledTimes(4);
		});
	});

	describe('#queryFeatureFlags()', () => {
		it('constructs the correct query and transforms result', async () => {
			makeGraphQLRequestStub.mockResolvedValue({
				FeatureFlags: [
					{
						flag: 'flag1',
						enabled: true,
					},
					{
						flag: 'flag2',
						enabled: false,
					},
				],
			});
			const flags = await directoryClient.queryFeatureFlags('cloud-id', ['flag1', 'flag2']);
			expect(makeGraphQLRequestStub).toHaveBeenCalledWith(
				{
					query: `query FeatureFlags($cloudId: String!, $flags: [String]!) {
        FeatureFlags(cloudId: $cloudId, flags: $flags) {
          flag
          enabled
        }
      }`,
					variables: {
						cloudId: 'cloud-id',
						flags: ['flag1', 'flag2'],
					},
				},
				{ operationName: 'FeatureFlags' },
			);
			expect(flags).toEqual({ flag1: true, flag2: false });
		});
	});
});
