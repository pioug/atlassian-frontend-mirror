import { type TeamMembership } from '../types/membership';

export const fixedTeamMemberships = (n = 10): TeamMembership[] => {
	return [...Array(n)].map(
		(_, idx): TeamMembership => ({
			state: 'FULL_MEMBER',
			user: {
				id: `FIXED-NUMBER-ID-${idx}`,
				avatarUrl: `https://avatar.com/${idx}`,
				fullName: `Fixed User Fullname ${idx}`,
				nickname: `fixedUserName_${idx}`,
				title: `Fixed Job Title ${idx}`,
				userType: 'user',
			},
			membershipId: {
				teamId: `FIXED-TEAM-ID-${idx}`,
				memberId: `FIXED-NUMBER-ID-${idx}`,
			},
			role: 'REGULAR',
		}),
	);
};
