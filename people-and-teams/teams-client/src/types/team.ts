import { type TeamMembership } from './membership';

/**
 * @private
 * @deprecated state has been removed as part of migration to V4
 */
export type DeprecatedTeamState = 'DISBANDED';

export type TeamState = 'ACTIVE' | 'PURGED' | DeprecatedTeamState;

export type TeamMembershipSettings = 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL';

export type TeamDiscoverability = 'DISCOVERABLE';

export type TeamRestriction = 'ORG_MEMBERS' | 'NO_RESTRICTION';

export type TeamPermission = 'FULL_WRITE' | 'FULL_READ' | 'NONE'; // Note: Should never see this | as UI should get a 404 instead. Included for completenes;

export type ScopeMode = 'ORG_SCOPE_MODE' | 'SITE_SCOPE_MODE';

export interface Scope {
	id: string;
	name: string;
}

export interface TeamAvatarImage {
	largeAvatarImageUrl: string;
	smallAvatarImageUrl: string;
	largeHeaderImageUrl: string;
	smallHeaderImageUrl: string;
}

/**
 * @type Team
 * Team type which doean't include the avatar image urls
 */
export interface Team {
	id: string;
	displayName: string;
	description: string;
	state: TeamState;
	membershipSettings: TeamMembershipSettings;
	/**
	 * @private
	 * @deprecated field has been removed as part of migration to V4. Will always be DISCOVERABLE
	 */
	discoverable?: TeamDiscoverability;
	organizationId?: string;
	/**
	 * @private
	 * @deprecated field has been removed as part of migration to V4
	 */
	restriction: TeamRestriction;
	creatorId?: string;
	permission?: TeamPermission;
	/**
	 * @private
	 * @deprecated field has been removed as part of migration to V4
	 */
	creatorDomain?: string;
	memberIds?: string[];
	membership?: {
		members?: TeamMembership[];
		errors?: string[];
	};
	/**
	 * @private
	 * @deprecated use organizationId instead
	 */
	orgId?: string;
	scopeMode?: ScopeMode;
	isVerified?: boolean;
	externalReference?: {
		id: string;
		source: ExternalReferenceSource;
	};
}

/**
 * @type TeamWithImageUrls
 */
export interface TeamWithImageUrls extends Team, TeamAvatarImage {}

export interface SoftDeletedTeamResponse {
	teamResponse: { displayName: string; expiry: string };
}
export interface SoftDeletedTeam {
	id: string;
	displayName: string;
	expiry: string;
}

/**
 * @type ExternalReference
 * Payload type for the createTeam API, when the team membershipSetting is EXTERNAL
 * @property {string} source - The source of the external reference, e.g., "ATLASSIAN_GROUP".
 * @property {string} id - Group ID of source
 */
export interface ExternalReference {
	source: ExternalReferenceSource;
	id: string;
	//group name
	displayName?: string;
	syncTeamName?: boolean;
}

export type ExternalReferenceSource = 'ATLASSIAN_GROUP' | 'HRIS';

export type TeamsPermissionApi = 'CAN_CREATE_TEAMS' | 'CAN_VIEW_TEAMS' | 'CAN_ADMIN_TEAMS';

/**
 * @type TeamsPermissionFromApi
 * Mapped response from GET /api/v4/teams/permission/self/organization/{orgId}
 */
export type TeamsPermissionFromApi = { permissions: TeamsPermissionApi[] };

export type LinkedTeam = Pick<
	TeamWithImageUrls,
	| 'id'
	| 'displayName'
	| 'description'
	| 'organizationId'
	| 'isVerified'
	| 'smallAvatarImageUrl'
	| 'largeAvatarImageUrl'
> & {
	linkToTeamProfile: string;
	externalReference: {
		id: string;
	};
	scopeMode: ScopeMode;
	scope: Scope;
};

export interface LinkedTeamsBulkResponse {
	teams: LinkedTeam[];
}

export interface LinkedTeamsProfileDetails {
	profileUrl: string;
}

export interface OrgScope {
	scopeMode: ScopeMode;
	scopes: Scope[];
}

export interface TeamEnabledSitesResponse {
	suggestedSite: {
		id: string;
		name: string;
	};
	sites: {
		id: string;
		name: string;
	}[];
}

export interface AssignTeamsToSitesResponse {
	migratedTeams: string[];
	failedTeams: {
		teamId: string;
		failureCode: string;
		failureReason: string;
	}[];
}

export interface AssignedTeam {
	id: string;
	displayName: string;
	avatarImageUrl: string;
	members: {
		firstPageCount: number;
		memberCursor: string;
	};
	scope: {
		id: string;
		name: string;
	};
	scopeAlignmentMetadata: {
		accountId: string;
		timestamp: string;
	};
}

export interface AssignedTeamsResponse {
	teams: AssignedTeam[];
	cursor: string;
}

export interface UnassignedTeam {
	id: string;
	displayName: string;
	avatarImageUrl: string;
	members: {
		firstPageCount: number;
		memberCursor: string;
	};
	suggestedSite: {
		id: string;
		name: string;
	};
}

export interface UnassignedTeamsResponse {
	teams: UnassignedTeam[];
	cursor: string;
}
