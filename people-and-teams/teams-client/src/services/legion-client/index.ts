import {
	type InvitedUser,
	type LinkOrder,
	type NewTeamLink,
	type ReadMediaTokenResponse,
	type Team,
	type TeamLink,
	type TeamMembership,
	type TeamMembershipSettings,
	type TeamWithImageUrls,
	type TeamWithMemberships,
} from '../../types';
import {
	type ExternalReference,
	type LinkedTeamsBulkResponse,
	type LinkedTeamsProfileDetails,
	type OrgScope,
	type SoftDeletedTeam,
	type SoftDeletedTeamResponse,
	type TeamsPermissionFromApi,
} from '../../types/team';
import {
	type ApiTeamContainerCreationPayload,
	type ApiTeamContainerResponse,
} from '../../types/team-container';
import { type UserInSiteUserbase } from '../../types/user';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import {
	type LegionLinkResponseV3,
	type LegionLinkResponseV4,
	type LegionPaginatedResponse,
	type LegionTeamAndGroupDifferenceResponse,
	type LegionTeamCreateResponseV4,
	type LegionTeamGetResponseV4,
	type LegionTeamSearchResponseV4,
} from './types';

export interface PaginationResult<T> {
	entities: T[];
}

export interface OriginQuery {
	/**
	 * @private
	 * @deprecated use getContext().cloudId instead
	 */
	cloudId?: string;
	product?: string | null;
}

/**
 * @type AllTeamsQuery
 * Query type for the getAllTeams API
 * @property {string} orgId - Organization ID
 * @property {string} cursor - Cursor to fetch the next page of results
 * @property {number} limit - Number of teams to fetch
 * @property {string} searchQuery - Search query to filter teams
 * @property {string[]} memberAccountIds - List of member account IDs to filter teams
 * @property {boolean} useDefaultSort - Whether to use the default sort order
 * @property {boolean} showEmptyTeams - Whether to return empty teams in the search
 */
export interface AllTeamsQuery {
	/**
	 * @private
	 * @deprecated use getContext().orgId instead
	 */
	orgId: string;
	cursor?: string;
	limit?: number;
	searchQuery?: string;
	memberAccountIds?: string[];
	useDefaultSort?: boolean;
	showEmptyTeams?: boolean;
}

/**
 * @type AllTeamsResponse
 * Response type for the getAllTeams API
 * @property {TeamWithMemberships[]} teams - List of teams
 * @property {string} cursor - Cursor to fetch the next page of results
 * @property {Error} error - Error object if the API call fails
 */
export interface AllTeamsResponse {
	teams: TeamWithMemberships[];
	cursor: string;
	error?: Error;
}

/**
 * @type AllTeamsPayload
 * Payload type for the getAllTeams API
 * @property {TeamWithMemberships[]} entities - List of teams
 * @property {string} cursor - Cursor to fetch the next page of results
 */
export interface AllTeamsPayload {
	entities: TeamWithMemberships[];
	cursor: string;
}

export interface LegionClient {
	getTeamById(teamId: string): Promise<TeamWithImageUrls>;

	updateTeamById(teamId: string, data: Partial<Team>): Promise<TeamWithImageUrls>;

	getAllTeams(allTeamsQuery: AllTeamsQuery): Promise<AllTeamsResponse>;

	inviteUsersToTeam(
		teamId: string,
		users: InvitedUser[],
		originQuery: OriginQuery,
	): Promise<TeamMembership[]>;

	getMyTeamMembership(teamId: string): Promise<TeamMembership>;

	getTeamLinksByTeamId(teamId: string): Promise<{ entities: TeamLink[] }>;

	createTeamLink(teamId: string, link: NewTeamLink): Promise<TeamLink>;

	updateTeamLink(teamId: string, linkId: string, newLink: NewTeamLink): Promise<TeamLink>;

	deleteTeamLink(teamId: string, linkId: string): Promise<void>;

	reorderTeamLink(teamId: string, linkId: string, newPosition: number): Promise<LinkOrder>;

	acceptTeamInvitation(teamId: string): Promise<TeamMembership>;

	declineTeamInvitation(teamId: string): Promise<void>;

	selfJoinTeam(teamId: string, originQuery: OriginQuery): Promise<TeamMembership>;

	cancelJoinRequest(teamId: string): Promise<void>;

	acceptJoinRequest(teamId: string, memberId: string): Promise<TeamMembership>;

	declineJoinRequest(teamId: string, memberId: string): Promise<void>;

	deleteTeamMembership(teamId: string, memberId: string): Promise<TeamMembership>;

	revokeTeamInvite(teamId: string, memberId: string): Promise<TeamMembership>;

	deleteTeam(teamId: string): Promise<void>;

	isSingleFullMemberTeam(teamId: string): Promise<boolean>;

	createTeam(
		displayName: string,
		originQuery: OriginQuery,
		members?: string[],
		membershipSettings?: TeamMembershipSettings,
	): Promise<Team>;

	createExternalTeam(
		description: string,
		externalReference: ExternalReference,
		teamName?: string,
		siteId?: string,
	): Promise<Team>;

	retrieveBrowseUserPermission(product: string): Promise<{
		canSearchUsers: boolean;
	}>;
	getLinkedTeamsBulk(groupIds: string[]): Promise<LinkedTeamsBulkResponse>;

	getTeamProfileDetails(teamId: string): Promise<LinkedTeamsProfileDetails>;

	getOrgScope(): Promise<OrgScope>;

	getPermissions(): Promise<TeamsPermissionFromApi>;

	restoreTeamToSyncedGroup(teamId: string, externalReference: ExternalReference): Promise<void>;

	createTeamContainers(payload: ApiTeamContainerCreationPayload): Promise<ApiTeamContainerResponse>;
}

const v3UrlPath = `/v3/teams`;

const v4UrlPath = `/v4/teams`;

/**
 * REST Client to make calls to Legion.
 *
 * Redirects to the instance login screen when a response returns a 401.
 * It should probably redirect to Aa, but this is what the existing clients
 * do so I'm going to follow suite.
 */
export class LegionClient extends RestClient implements LegionClient {
	private serviceUrlRoot: string;

	constructor(serviceUrl: string) {
		super({ serviceUrl });
		this.serviceUrlRoot = serviceUrl;
	}

	setRootUrl(url: string) {
		if (url === this.serviceUrlRoot) {
			return;
		}
		this.serviceUrlRoot = url;
		this.setServiceUrl(url);
	}

	async getTeamById(teamId: string): Promise<TeamWithImageUrls> {
		const siteId = this.getCloudId();
		const teamResponse = await this.getResource<LegionTeamGetResponseV4>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}?siteId=${siteId}`,
		);
		return this.mapTeamResponseV4ToTeam(teamResponse);
	}

	async getAllTeams(allTeamsQuery: AllTeamsQuery): Promise<AllTeamsResponse> {
		try {
			const orgId = this.getOrgId(allTeamsQuery.orgId);
			const siteId = this.getCloudId();

			const { entities, cursor } = await this.postResource<
				LegionPaginatedResponse<LegionTeamSearchResponseV4>
			>(`${v4UrlPath}/search`, {
				organizationId: orgId,
				siteId: siteId,
				limit: allTeamsQuery.limit,
				query: allTeamsQuery.searchQuery,
				cursor: allTeamsQuery.cursor || '',
				sortBy: allTeamsQuery.useDefaultSort
					? null
					: [
							{
								field: 'displayName',
								order: 'asc',
							},
						],
				membership: { memberAccountIds: allTeamsQuery.memberAccountIds },
				showEmptyTeams: allTeamsQuery.showEmptyTeams,
			});

			const teams = entities.map((t) => this.mapTeamSearchResponseV4ToTeamWithMembership(t));

			return {
				cursor,
				teams: teams,
			};
		} catch (error) {
			this.logException(error, 'getAllTeams');
			return {
				cursor: '',
				teams: [],
				error: error instanceof Error ? error : undefined,
			};
		}
	}

	async updateTeamById(
		teamId: string,
		data: Partial<
			Pick<Team, 'displayName' | 'description' | 'membershipSettings'> & {
				headerImageId: string | undefined;
			}
		>,
	): Promise<TeamWithImageUrls> {
		const teamResponse = await this.patchResource<LegionTeamGetResponseV4>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}`,
			data,
		);
		return this.mapTeamResponseV4ToTeam(teamResponse);
	}

	/**
	 * @private
	 * @deprecated use publicApiClient.addUsersToTeam instead
	 */
	async inviteUsersToTeam(
		teamId: string,
		users: InvitedUser[],
		originQuery: OriginQuery,
	): Promise<TeamMembership[]> {
		if (!users || users.length === 0) {
			return Promise.resolve([]);
		}

		const emails: string[] = [];
		const ids: string[] = [];
		users.forEach((user) => {
			if (user.id) {
				ids.push(user.id);
			} else if (user.email) {
				emails.push(user.email);
			}
		});

		const url = `${v3UrlPath}/ui/${this.trimTeamARI(
			teamId,
		)}/membership/invite?${this.constructProductOriginParams(originQuery)}`;

		return this.postResource(url, {
			emailAddresses: emails,
			atlassianAccounts: ids,
		});
	}

	async getMyTeamMembership(teamId: string): Promise<TeamMembership> {
		return this.getResource(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/membership/me?siteId=${this.getCloudId()}`,
			{
				shouldLogError: (e) => e.status !== 400,
			},
		);
	}

	async getTeamLinksByTeamId(teamId: string): Promise<{ entities: TeamLink[] }> {
		let siteId = this.getCloudId();

		let response = await this.getResource<LegionPaginatedResponse<LegionLinkResponseV4>>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/links?siteId=${siteId}`,
		);
		return this.mapLegionTeamLinksResponseV4ToTeamLinkResponse(response);
	}

	async createTeamLink(teamId: string, link: NewTeamLink): Promise<TeamLink> {
		const sanitisedTeamLink: NewTeamLink = {
			contentTitle: link.contentTitle.trim(),
			linkUri: link.linkUri.trim(),
			description: link.description.trim(),
			...(link.creationTime ? { creationTime: link.creationTime.trim() } : {}),
			...(link.teamId ? { teamId: link.teamId.trim() } : {}),
		};

		const response = await this.postResource<LegionLinkResponseV4>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/links`,
			sanitisedTeamLink,
		);
		return this.mapLegionTeamLinkResponseV4ToTeamLink(response);
	}

	async updateTeamLink(
		teamId: string,
		linkId: string,
		{ linkUri, ...linkFields }: NewTeamLink,
	): Promise<TeamLink> {
		const response = await this.putResource<LegionLinkResponseV4>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/links/${linkId}`,
			{
				linkUri: linkUri.trim(),
				...linkFields,
			},
		);

		return this.mapLegionTeamLinkResponseV4ToTeamLink(response);
	}

	async deleteTeamLink(teamId: string, linkId: string): Promise<void> {
		return this.deleteResource(`${v4UrlPath}/${this.trimTeamARI(teamId)}/links/${linkId}`);
	}

	async reorderTeamLink(teamId: string, linkId: string, newPosition: number): Promise<LinkOrder> {
		const queryArgs = `?linkId=${linkId}&newPosition=${newPosition}`;
		return this.postResource(`${v4UrlPath}/${this.trimTeamARI(teamId)}/links/order${queryArgs}`);
	}

	async getOrgEligibilityForManagedTeams(): Promise<{ isEligible: boolean }> {
		const orgId = this.getOrgId();

		if (!orgId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'getOrgEligibilityForManagedTeams');
			throw err;
		}

		return this.getResourceCached<{ isEligible: boolean }>(
			`${v4UrlPath}/org/${orgId}/premium/eligibility`,
		);
	}

	/**
	 * @private
	 * @deprecated in V4, as no invitation status for team membership anymore.
	 */
	async acceptTeamInvitation(teamId: string): Promise<TeamMembership> {
		return this.postResource(`${v3UrlPath}/ui/${this.trimTeamARI(teamId)}/membership/accept`);
	}

	/**
	 * @private
	 * @deprecated in V4, as no invitation status for team membership anymore.
	 */
	async declineTeamInvitation(teamId: string): Promise<void> {
		return this.postResource(`${v3UrlPath}/ui/${this.trimTeamARI(teamId)}/membership/decline`);
	}

	async selfJoinTeam(
		// TODO Test me
		teamId: string,
		originQuery: OriginQuery,
	): Promise<TeamMembership> {
		const url = `${v4UrlPath}/${this.trimTeamARI(
			teamId,
		)}/membership/join?${this.constructProductOriginParams(originQuery)}`;

		return this.postResource(url);
	}

	async cancelJoinRequest(teamId: string): Promise<void> {
		return this.deleteResource(`${v4UrlPath}/${this.trimTeamARI(teamId)}/membership/request`);
	}

	async acceptJoinRequest(teamId: string, memberId: string): Promise<TeamMembership> {
		return this.postResource(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/membership/${memberId}/request/accept`,
		);
	}

	async declineJoinRequest(teamId: string, memberId: string): Promise<void> {
		return this.postResource(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/membership/${memberId}/request/decline`,
		);
	}

	/**
	 * @private
	 * @deprecated use publicApiClient.removeTeamMemberships instead
	 */
	async deleteTeamMembership(teamId: string, memberId: string): Promise<TeamMembership> {
		return this.deleteResource(`${v3UrlPath}/${this.trimTeamARI(teamId)}/members/${memberId}`);
	}

	/**
	 * @private
	 * @deprecated INVITED status has been deprecated
	 */
	async revokeTeamInvite(teamId: string, memberId: string): Promise<TeamMembership> {
		return this.deleteResource(
			`${v3UrlPath}/ui/${this.trimTeamARI(teamId)}/membership/${memberId}/revoke`,
		);
	}

	async deleteTeam(teamId: string): Promise<void> {
		return this.deleteResource(`${v4UrlPath}/${this.trimTeamARI(teamId)}`);
	}

	/**
	 * @private
	 * @deprecated should be other means to solve this issue
	 */
	async isSingleFullMemberTeam(teamId: string): Promise<boolean> {
		// This is still not working...
		const members: PaginationResult<TeamMembership> = await this.getResource(
			`${v4UrlPath}/${this.trimTeamARI(
				teamId,
			)}/members?size=2&membershipState=FULL_MEMBER&siteId=${this.getCloudId()}`,
		);
		return members.entities.length === 1;
	}

	async createTeam(
		displayName: string,
		originQuery: OriginQuery,
		members?: string[],
		membershipSettings: TeamMembershipSettings = 'OPEN',
	): Promise<Team> {
		const organizationId = this.getContext().orgId;

		if (!organizationId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'createTeam');
			throw err;
		}

		const url = `${v4UrlPath}?${this.constructProductOriginParams(originQuery)}`;

		const legionTeam = await this.postResource<LegionTeamCreateResponseV4>(url, {
			displayName,
			description: '',
			membershipSettings: membershipSettings,
			siteId: this.getCloudId(),
			organizationId: organizationId,
			members: [...new Set(members)],
		});

		return this.mapTeamCreateResponseV4ToTeam(legionTeam);
	}

	async createExternalTeam(
		description: string,
		externalReference: ExternalReference,
		teamName?: string,
		siteId?: string,
	): Promise<Team> {
		const organizationId = this.getContext().orgId;
		const cloudId = this.getContext().cloudId;

		if (!organizationId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'createTeam');
			throw err;
		}

		const url = `${v4UrlPath}/external?origin.cloudId=${encodeURIComponent(this.getCloudId(siteId || cloudId))}`;

		const legionExternalTeam = await this.postResource<LegionTeamCreateResponseV4>(url, {
			description,
			externalReference,
			organizationId,
			siteId: siteId || cloudId,
			displayName: teamName,
		});

		return this.mapTeamCreateResponseV4ToTeam(legionExternalTeam);
	}

	async getTeamAndGroupDiff(
		teamId: string,
		externalReference: ExternalReference,
	): Promise<LegionTeamAndGroupDifferenceResponse> {
		const siteId = this.getCloudId();
		return this.postResource<LegionTeamAndGroupDifferenceResponse>(
			`${v4UrlPath}/${this.trimTeamARI(teamId)}/external/diff`,
			{
				siteId,
				externalReference,
			},
		);
	}

	async linkExistingTeamToGroup(
		teamId: string,
		externalReference: ExternalReference,
	): Promise<void> {
		const siteId = this.getCloudId();
		return this.postResource(`${v4UrlPath}/${this.trimTeamARI(teamId)}/external/link`, {
			externalReference,
			siteId,
		});
	}

	async getWriteMediaToken(): Promise<ReadMediaTokenResponse> {
		return this.getResource<ReadMediaTokenResponse>('/v4/teams/header-image/media-upload').then(
			(response) => ({
				...response,
				baseUrl: response.baseUrl?.endsWith('/') ? response.baseUrl.slice(0, -1) : response.baseUrl,
			}),
		);
	}

	async getSoftDeletedTeamById(teamId: string): Promise<SoftDeletedTeam> {
		const orgId = this.getOrgId();
		const siteId = this.getCloudId();
		return this.getResource<SoftDeletedTeamResponse>(
			`${v4UrlPath}/org/${orgId}/soft-deleted/${this.trimTeamARI(teamId)}?siteId=${siteId}`,
		).then((response) => ({
			...response.teamResponse,
			id: teamId,
		}));
	}

	/**
	 * Shoud only be used within Teams (P&T) packages
	 */
	async getUserInSiteUserBase(userId: string): Promise<UserInSiteUserbase> {
		const siteId = this.getCloudId();
		return this.getResource<UserInSiteUserbase>(`/teams/site/${siteId}/users/${userId}/exists`, {
			headers: {
				Accept: 'application/json',
				'X-header-client-id': 'ptc-fe',
			},
		});
	}

	async retrieveBrowseUserPermission(product: string): Promise<{ canSearchUsers: boolean }> {
		return this.getResourceCached<{ canSearchUsers: boolean }>(
			`/teams/site/${this.getCloudId()}/canSearchUsers?product=${product}`,
			undefined,
			// 2 minute expiration, resolves duplicate calls in initial load
			{ expiration: 1000 * 60 * 2 },
		);
	}

	async getPermissions(): Promise<TeamsPermissionFromApi> {
		const orgId = this.getContext().orgId;
		const siteId = this.getCloudId();

		if (!orgId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'getPermissions');
			throw err;
		}

		return this.getResourceCached<TeamsPermissionFromApi>(
			`${v4UrlPath}/permission/self/organization/${orgId}?siteId=${siteId}`,
		);
	}

	async getLinkedTeamsBulk(groupIds: string[]): Promise<LinkedTeamsBulkResponse> {
		const organizationId = this.getContext().orgId;

		if (!organizationId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'getLinkedTeamsBulk');
			throw err;
		}

		const legionExternalTeam = await this.postResource<LinkedTeamsBulkResponse>(
			`${v4UrlPath}/external/bulk`,
			{
				organizationId,
				source: 'ATLASSIAN_GROUP',
				externalIds: groupIds,
			},
		);

		return legionExternalTeam;
	}

	async getTeamProfileDetails(teamId: string): Promise<LinkedTeamsProfileDetails> {
		const siteId = this.getCloudId();

		if (!siteId) {
			const err = new Error('Site ID is required');
			this.logException(err, 'getTeamProfileDetails');
			throw err;
		}

		const linkedTeamsProfileDetails = await this.getResource<LinkedTeamsProfileDetails>(
			`${v4UrlPath}/${teamId}/profile?siteId=${this.getCloudId()}`,
		);

		return linkedTeamsProfileDetails;
	}

	async getOrgScope(): Promise<OrgScope> {
		const orgId = this.getContext().orgId;

		if (!orgId) {
			const err = new Error('Organization ID is required');
			this.logException(err, 'getOrgScope');
			throw err;
		}

		const orgScope = await this.getResourceCached<OrgScope>(`${v4UrlPath}/org/${orgId}/scope`);
		return orgScope;
	}

	async restoreTeamToSyncedGroup(
		teamId: string,
		externalReference: ExternalReference,
	): Promise<void> {
		const siteId = this.getCloudId();

		return await this.postResource(`${v4UrlPath}/${teamId}/external/restore`, {
			externalReference: externalReference,
			siteId,
		});
	}

	async createTeamContainers(
		payload: ApiTeamContainerCreationPayload,
	): Promise<ApiTeamContainerResponse> {
		return this.postResource<ApiTeamContainerResponse>(`${v4UrlPath}/containers`, { ...payload });
	}

	// some Legion APIs return team id with the team ARI
	trimTeamARI(teamId = '') {
		const OLD_TEAM_ARI_PREFIX = 'ari:cloud:teams::team/';
		const TEAM_ARI_PREFIX = 'ari:cloud:identity::team/';

		return teamId.replace(TEAM_ARI_PREFIX, '').replace(OLD_TEAM_ARI_PREFIX, ''); // PTC-4213 will remove the references to the old team ARI
	}

	private constructProductOriginParams(originQuery: OriginQuery): string {
		const product = (originQuery.product || '').toUpperCase();
		const queries: string[] = [
			`origin.cloudId=${encodeURIComponent(this.getCloudId(originQuery.cloudId))}`,
		];
		if (product) {
			queries.push(`origin.product=${encodeURIComponent(product)}`);
		}

		return queries.join('&');
	}

	private mapTeamResponseV4ToTeam(teamResponse: LegionTeamGetResponseV4): TeamWithImageUrls {
		return {
			id: teamResponse.id,
			displayName: teamResponse.displayName,
			description: teamResponse.description,
			state: teamResponse.state,
			membershipSettings: teamResponse.membershipSettings,
			organizationId: teamResponse.organizationId,
			restriction: 'ORG_MEMBERS', // Deprecated field, not used in UI - this is the safest default
			creatorId: teamResponse.creatorId,
			permission: teamResponse.permission,
			orgId: teamResponse.organizationId,
			smallHeaderImageUrl: teamResponse.smallHeaderImageUrl,
			largeHeaderImageUrl: teamResponse.largeHeaderImageUrl,
			smallAvatarImageUrl: teamResponse.smallAvatarImageUrl,
			largeAvatarImageUrl: teamResponse.largeAvatarImageUrl,
			scopeMode: teamResponse.scopeMode,
			isVerified: teamResponse.isVerified,
			...(teamResponse.externalReference && {
				externalReference: {
					id: teamResponse.externalReference.id,
					source: teamResponse.externalReference.source,
				},
			}),
		};
	}

	private mapTeamCreateResponseV4ToTeam(teamResponse: LegionTeamCreateResponseV4): Team {
		return {
			id: teamResponse.id,
			displayName: teamResponse.displayName,
			description: teamResponse.description,
			state: teamResponse.state,
			membershipSettings: teamResponse.membershipSettings,
			organizationId: teamResponse.organizationId,
			restriction: 'ORG_MEMBERS', // Deprecated field, not used in UI - this is the safest default
			creatorId: teamResponse.creatorId,
			permission: teamResponse.permission,
			orgId: teamResponse.organizationId,
			memberIds: teamResponse.membership?.members?.map((m) => m.membershipId.memberId) || [],
			membership: teamResponse.membership,
		};
	}

	private mapTeamSearchResponseV4ToTeamWithMembership(
		teamResponse: LegionTeamSearchResponseV4,
	): TeamWithMemberships {
		return {
			id: teamResponse.id,
			displayName: teamResponse.displayName,
			description: teamResponse.description,
			state: teamResponse.state,
			membershipSettings: teamResponse.membershipSettings,
			organizationId: teamResponse.organizationId,
			restriction: 'ORG_MEMBERS', // Deprecated field, not used in UI - this is the safest default
			smallHeaderImageUrl: teamResponse.smallHeaderImageUrl,
			largeAvatarImageUrl: teamResponse.largeAvatarImageUrl,
			smallAvatarImageUrl: teamResponse.smallAvatarImageUrl,
			largeHeaderImageUrl: teamResponse.largeHeaderImageUrl,
			memberCount: teamResponse.memberCount,
			includesYou: teamResponse.includesYou,
			memberIds: [], // Team Search API does not return members
			members: [], // Team Search API does not return members
			membership: { members: [], errors: [] },
			isVerified: teamResponse.isVerified,
		};
	}

	mapLegionTeamLinksResponseV3ToTeamLinkResponse(
		response: LegionPaginatedResponse<LegionLinkResponseV3>,
	): {
		entities: TeamLink[];
	} {
		return {
			entities: response.entities.map<LegionLinkResponseV3>(
				this.mapLegionTeamLinkResponseV3ToTeamLink,
			),
		};
	}

	mapLegionTeamLinksResponseV4ToTeamLinkResponse(
		response: LegionPaginatedResponse<LegionLinkResponseV4>,
	): {
		entities: TeamLink[];
	} {
		return {
			entities: response.entities.map<LegionLinkResponseV4>(
				this.mapLegionTeamLinkResponseV4ToTeamLink,
			),
		};
	}

	mapLegionTeamLinkResponseV3ToTeamLink(legionLinkResponseV3: LegionLinkResponseV3): TeamLink {
		return {
			contentTitle: legionLinkResponseV3.contentTitle,
			description: legionLinkResponseV3.description,
			creationTime: legionLinkResponseV3.creationTime,
			linkUri: legionLinkResponseV3.linkUri,
			linkId: legionLinkResponseV3.linkId,
			teamId: legionLinkResponseV3.teamId,
		} as TeamLink;
	}

	mapLegionTeamLinkResponseV4ToTeamLink(legionLinkResponseV4: LegionLinkResponseV4): TeamLink {
		return {
			contentTitle: legionLinkResponseV4.contentTitle,
			description: legionLinkResponseV4.description,
			linkUri: legionLinkResponseV4.linkUri,
			linkId: legionLinkResponseV4.linkId,
			teamId: legionLinkResponseV4.teamId,
		} as TeamLink;
	}
}

export const defaultLegionClient = new LegionClient(DEFAULT_CONFIG.stargateRoot);
