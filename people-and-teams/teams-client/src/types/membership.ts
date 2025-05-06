import { type TeamWithImageUrls } from './team';
import { type TeamsClientUser } from './user';

/**
 * @private
 * @deprecated INVITED is deprecated
 */
type DeprecratedMembershipState = 'INVITED';
export type MembershipState =
	| DeprecratedMembershipState
	| 'FULL_MEMBER'
	| 'ALUMNI'
	| 'REQUESTING_TO_JOIN';

export type MembershipRole = 'REGULAR' | 'ADMIN';

export type TeamMember = Pick<TeamsClientUser, 'id' | 'fullName' | 'avatarUrl' | 'status'>;

type Membership<T> = {
	membershipId: {
		teamId: string;
		memberId: string;
	};
	state: MembershipState;
	role: MembershipRole;
	user?: T;
};

/**
 * @param membershipId - The team IDZ
 */
export type TeamMembership = Membership<TeamsClientUser>;

// Currently an agent is just a user, they may diverge if we need more agent specific fields
export type TeamAgentMembership = Membership<TeamsClientUser>;

export interface TeamWithMemberships extends TeamWithImageUrls {
	members: TeamMember[];
	/* whether team includes the current user */
	includesYou: boolean;
	/* full member count of the team */
	memberCount: number;
}

// The minimal user required to invited someone
export interface InvitedUser {
	id: string | null;
	email: string | null;
}

export function isTeamMembershipWithUser(
	membership: TeamMembership,
): membership is Required<TeamMembership> {
	return typeof membership.user === 'object';
}
