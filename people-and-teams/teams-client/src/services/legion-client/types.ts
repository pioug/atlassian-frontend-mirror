import type { TeamMembership } from '../../types/membership';
import type {
	ExternalReference,
	ScopeMode,
	TeamDiscoverability,
	TeamMembershipSettings,
	TeamPermission,
	TeamRestriction,
	TeamState,
} from '../../types/team';

export interface LegionTeamImagesResponse {
	smallHeaderImageUrl: string;
	largeHeaderImageUrl: string;
	smallAvatarImageUrl: string;
	largeAvatarImageUrl: string;
}

export interface LegionTeamMembershipResponse {
	membership: {
		members: TeamMembership[];
		errors: string[];
	};
}

export interface LegionTeamBaseResponseV3 {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	discoverable?: TeamDiscoverability;
	organizationId?: string;
	restriction: TeamRestriction;
	creatorId?: string;
	creatorDomain?: string;
	permission?: TeamPermission;
}

export type LegionTeamGetResponseV3 = LegionTeamBaseResponseV3 & LegionTeamImagesResponse;

export type LegionTeamCreateResponseV3 = LegionTeamBaseResponseV3 & LegionTeamMembershipResponse;

export interface LegionTeamBaseResponseV4 {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	organizationId: string;
	creatorId?: string;
	permission?: TeamPermission;
	scopeMode: ScopeMode;
	isVerified?: boolean;
	externalReference?: ExternalReference;
}

export type LegionTeamGetResponseV4 = LegionTeamBaseResponseV4 & Required<LegionTeamImagesResponse>;

export type LegionTeamCreateResponseV4 = LegionTeamBaseResponseV4 &
	Required<LegionTeamMembershipResponse>;

export type LegionTeamAndGroupDifferenceResponse = {
	displayNameChange: {
		from: string;
		to: string;
	} | null;
	membersToAdd: {
		count: number;
		memberIds: string[];
	};
	membersToRemove: {
		count: number;
		memberIds: string[];
	};
};

export interface LegionTeamSearchResponseV3 {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	discoverable?: TeamDiscoverability;
	organizationId?: string;
	restriction: TeamRestriction;
	smallHeaderImageUrl: string;
	largeHeaderImageUrl: string;
	smallAvatarImageUrl: string;
	largeAvatarImageUrl: string;
	memberCount: number;
	includesYou: boolean;
}

export interface LegionTeamSearchResponseV4 {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	organizationId?: string;
	smallHeaderImageUrl: string;
	largeHeaderImageUrl: string;
	smallAvatarImageUrl: string;
	largeAvatarImageUrl: string;
	memberCount: number;
	includesYou: boolean;
	isVerified?: boolean;
}

export interface LegionPaginatedResponse<T> {
	entities: T[];
	cursor: string;
}

export interface LegionLinkResponseV3 {
	contentTitle: string;
	description: string;
	linkUri: string;
	creationTime?: string;
	linkId: string;
	teamId?: string;
}

export interface LegionLinkResponseV4 {
	contentTitle: string;
	description: string;
	linkUri: string;
	linkId: string;
	teamId?: string;
}
