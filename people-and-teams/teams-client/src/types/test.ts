import { isTeamMembershipWithUser, type TeamMembership } from './membership';

const mockMembership: TeamMembership = {
	user: {
		id: '610196aeb704b40068ab1436',
		fullName: 'Tom Wood',
		avatarUrl:
			'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/610196aeb704b40068ab1436/20d384fd-ea32-43b2-bd67-fa71efddd144/128',
		status: 'active',
		userType: 'user',
	},
	state: 'REQUESTING_TO_JOIN',
	role: 'REGULAR',
	membershipId: {
		teamId: 'fcc50d9d-2aef-4939-8481-8b0a9ab3021d',
		memberId: '610196aeb704b40068ab1436',
	},
};

describe('types', () => {
	describe('isTeamMembershipWithUser typeguard', () => {
		it('returns true when the user is provided', () => {
			expect(isTeamMembershipWithUser(mockMembership)).toEqual(true);
		});

		it('returns false when the user is undefined', () => {
			expect(isTeamMembershipWithUser({ ...mockMembership, user: undefined })).toEqual(false);
		});

		it("returns false when the user prop isn't provided", () => {
			const { user, ...membership } = mockMembership;
			expect(isTeamMembershipWithUser(membership)).toEqual(false);
		});
	});
});
