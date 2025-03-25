export { type UnlinkContainerMutationError } from './agg-client/utils/mutations/unlink-container-mutation';
import type { TeamContainer, TeamMembershipSettings, TeamState, UserStatus } from '../common/types';

export type ClientContext = {
	cloudId?: string | null;
	orgId?: string;
	userId?: string;
};

export type ClientContextProps = {
	cloudId?: string | null;
	orgId?: string;
	userId?: string;
};

export type TeamContainers = Array<TeamContainer>;

export type TeamMember = {
	id: string;
	fullName: string;
	avatarUrl?: string;
	status?: UserStatus;
};

export type TeamWithMemberships = {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	organizationId?: string;
	creatorId?: string;
	isVerified?: boolean;
	members: TeamMember[];
	includesYou: boolean; // to-do - this needs to be computed - https://product-fabric.atlassian.net/browse/CCECO-4368
	memberCount: number;
	largeAvatarImageUrl: string;
	smallAvatarImageUrl: string;
	largeHeaderImageUrl: string;
	smallHeaderImageUrl: string;
	restriction: 'ORG_MEMBERS';
};
