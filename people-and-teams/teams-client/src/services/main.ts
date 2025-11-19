import { fg } from '@atlaskit/platform-feature-flags';

import {
	TEAMS_CLIENT_EXPERIENCES,
	type TeamsClientExperienceKeys,
} from '../common/utils/ufo/constants';
import { type MembershipState, type TeamMembership, type TeamWithImageUrls } from '../types';

import { aggClient } from './agg-client';
import { type AGGPageInfoVariables, type ResultWithPageInfo } from './agg-client/types';
import collaborationGraphClient from './collaborationgraph-client';
import { directoryClient } from './directory-client';
import identityClient from './identity-client';
import invitationsClient from './invitations-client';
import { defaultLegionClient } from './legion-client';
import mutabilityClient from './mutability-client';
import objectResolverClient from './object-resolver-client';
import permsClient from './perms-client';
import publicApiClient from './public-api-client';
import replinesClient from './replines-client';
import reportingLinesClient from './reporting-lines-client';
import teamCentralClient from './team-central-client';
import teamsInSlackClient from './teams-in-slack-client';
import { type ClientContextProps } from './types';
import userPreferencesClient from './user-preferences-client';

/**
 * This solves error TS1055:
 * Type 'ReturnType' is not a valid async function return type in ES5/ES3 because it does not refer to a Promise-compatible constructor value
 */
type AwaitedReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

/**
 * The Teams Client is an used for fetching data related to Atlas teams.
 * It is an abstraction over the various clients that are used to fetch data related to teams.
 * Find out more about the APIs here - [https://developer.atlassian.com/platform/teams-internal/](https://developer.atlassian.com/platform/teams-internal/)
 */
export class TeamsClient {
	private readonly _aggClient = aggClient;
	private readonly _directoryClient = directoryClient;
	private readonly _legionClient = defaultLegionClient;
	private readonly _mutabilityClient = mutabilityClient;
	private readonly _permsClient = permsClient;
	private readonly _publicApiClient = publicApiClient;
	private readonly _invitationsClient = invitationsClient;
	private readonly _userPreferencesClient = userPreferencesClient;
	private readonly _objectResolverClient = objectResolverClient;
	private readonly _teamsInSlackClient = teamsInSlackClient;
	private readonly _collaborationGraphClient = collaborationGraphClient;
	private readonly _identityClient = identityClient;
	private readonly _teamCentralClient = teamCentralClient;
	private readonly _replinesClient = replinesClient;
	private readonly _reportingLinesClient = reportingLinesClient;

	constructor(
		/**
		 * @param {ClientContextProps} context - Context including CloudId & OrgId to be used for all requests
		 */
		context?: ClientContextProps,
	) {
		if (context) {
			this.setContext(context);
		}
	}

	private async measurePerformance<Response>(
		name: TeamsClientExperienceKeys,
		fn: () => Promise<Response>,
	): Promise<Response> {
		const exp = TEAMS_CLIENT_EXPERIENCES.get(name);
		if (!exp) {
			return fn();
		}
		exp.start();
		try {
			const result = await fn();
			exp.success();
			return result;
		} catch (e) {
			exp.failWithError(e);
			throw e;
		}
	}

	/**
	 * Sets the base URL to be used in the client requests
	 * @param {string} baseUrl - The new base URL
	 */
	setBaseUrl(baseUrl: string) {
		this._aggClient.setBaseUrl(baseUrl);
		this._directoryClient.setBaseUrl(baseUrl);
	}

	/**
	 * Sets context including CloudId & OrgId to be used for all requests
	 */
	setContext(context: ClientContextProps) {
		this._aggClient.setContext(context);
		this._directoryClient.setContext(context);
		this._legionClient.setContext(context);
		this._permsClient.setContext(context);
		this._mutabilityClient.setContext(context);
		this._publicApiClient.setContext(context);
		this._invitationsClient.setContext(context);
		this._replinesClient.setContext(context);
	}

	setTeamCentralContext(baseUrl: string, context: ClientContextProps) {
		this._teamCentralClient.setContext(context);
		this._teamCentralClient.setBaseUrl(baseUrl);
	}

	/**
	 * @private
	 * @deprecated use setBaseUrl instead
	 */
	setDirectoryBaseUrl(baseUrl: string) {
		// eslint-disable-next-line no-console
		console.warn('setDirectoryBaseUrl is deprecated, use setBaseUrl instead');
		return this._directoryClient.setBaseUrl(baseUrl);
	}

	/**
	 * Fetches Browse user settings
	 */
	async querySettings(
		cloudId?: string,
		product?: string,
	): Promise<{ ['internal.browse-users-allowed']: boolean }> {
		if (cloudId) {
			if (fg('fix_query_settings_context')) {
				const previousContext = this._legionClient.getContext();
				this.setContext({ ...previousContext, cloudId });
			} else {
				this.setContext({ cloudId });
			}
		}
		return this.measurePerformance('querySettings', async () => {
			if (!product) {
				throw new Error('Product is required');
			}
			const response = await this._legionClient.retrieveBrowseUserPermission(product);
			return {
				'internal.browse-users-allowed': response.canSearchUsers,
			};
		});
	}

	/**
	 * This will return all of the teams-related permissions that your user has for the org and site in the client context.
	 */
	async getPermissions(): Promise<AwaitedReturn<typeof defaultLegionClient.getPermissions>> {
		return this.measurePerformance('getPermissions', () => this._legionClient.getPermissions());
	}

	/**
	 * Fetches feature flags from Directory
	 * @deprecated As part of decommisioning pf-directoy
	 */
	async queryFeatureFlags(
		...args: Parameters<typeof directoryClient.queryFeatureFlags>
	): Promise<AwaitedReturn<typeof directoryClient.queryFeatureFlags>> {
		return this.measurePerformance('queryFeatureFlags', () =>
			this._directoryClient.queryFeatureFlags(...args),
		);
	}

	/**
	 * Get user information of members of a team, paginated
	 * @param {string} teamId
	 * @returns {Promise}
	 */
	async queryTeamMemberships(
		teamId: string,
		membershipState: MembershipState[] = ['FULL_MEMBER'],
		pageInfo: AGGPageInfoVariables = {
			first: 100,
		},
	): Promise<ResultWithPageInfo<TeamMembership>> {
		return this._aggClient.queryTeamMemberships(teamId, membershipState, pageInfo);
	}

	/**
	 * Get user information given an user id
	 * @param {string} userId
	 * @returns {Promise}
	 */
	async queryAGGUser(userId: string): Promise<AwaitedReturn<typeof aggClient.queryAGGUser>> {
		return this._aggClient.queryAGGUser(userId);
	}

	/**
	 * Get the agents associated with the team
	 * @param {string} userId
	 * @returns {Promise}
	 */
	async queryTeamHasAgents(
		teamId: string,
	): Promise<AwaitedReturn<typeof aggClient.queryTeamHasAgents>> {
		return this._aggClient.queryTeamHasAgents(teamId);
	}

	/**
	 * Get user information of a member of a team
	 * @param {string} userId
	 * @returns {Promise<CloudUser>}
	 */
	queryUser(
		...args: Parameters<typeof directoryClient.queryUser>
	): Promise<AwaitedReturn<typeof directoryClient.queryUser>> {
		return this.measurePerformance('queryUser', () => this._directoryClient.queryUser(...args));
	}

	setLegionRootUrl(url: string) {
		return this._legionClient.setRootUrl(url);
	}

	/**
	 *
	 * @param teamId
	 * @returns {Promise<TeamWithImageUrls>}
	 */
	async getTeamById(
		teamId: string,
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamById>> {
		return this.measurePerformance('getTeamById', () => this._legionClient.getTeamById(teamId));
	}

	/**
	 * Search teams based on query
	 */
	async getAllTeams(
		...args: Parameters<typeof defaultLegionClient.getAllTeams>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getAllTeams>> {
		return this.measurePerformance('getAllTeams', () => this._legionClient.getAllTeams(...args));
	}

	/**
	 * Update team details
	 */
	async updateTeamById(
		...args: Parameters<typeof defaultLegionClient.updateTeamById>
	): Promise<AwaitedReturn<typeof defaultLegionClient.updateTeamById>> {
		return this.measurePerformance('updateTeamById', () =>
			this._legionClient.updateTeamById(...args),
		);
	}

	/**
	 * @private
	 * @deprecated use addUsersToTeam instead
	 */
	async inviteUsersToTeam(
		...args: Parameters<typeof defaultLegionClient.inviteUsersToTeam>
	): Promise<AwaitedReturn<typeof defaultLegionClient.inviteUsersToTeam>> {
		return this.measurePerformance('inviteUsersToTeam', () =>
			this._legionClient.inviteUsersToTeam(...args),
		);
	}

	/**
	 * Get the current user's team membership
	 */
	async getMyTeamMembership(
		...args: Parameters<typeof defaultLegionClient.getMyTeamMembership>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getMyTeamMembership>> {
		return this.measurePerformance('getMyTeamMembership', () =>
			this._legionClient.getMyTeamMembership(...args),
		);
	}

	/**
	 * Get a teams "Links"
	 */
	async getTeamLinksByTeamId(
		teamId: string,
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamLinksByTeamId>> {
		return this.measurePerformance('getTeamLinksByTeamId', () =>
			this._legionClient.getTeamLinksByTeamId(teamId),
		);
	}

	/**
	 * Create a team link
	 */
	async createTeamLink(
		...args: Parameters<typeof defaultLegionClient.createTeamLink>
	): Promise<AwaitedReturn<typeof defaultLegionClient.createTeamLink>> {
		return this.measurePerformance('createTeamLink', () =>
			this._legionClient.createTeamLink(...args),
		);
	}

	/**
	 * Update a team link
	 */
	async updateTeamLink(
		...args: Parameters<typeof defaultLegionClient.updateTeamLink>
	): Promise<AwaitedReturn<typeof defaultLegionClient.updateTeamLink>> {
		return this.measurePerformance('updateTeamLink', () =>
			this._legionClient.updateTeamLink(...args),
		);
	}

	/**
	 * Delete a team link
	 */
	async deleteTeamLink(
		...args: Parameters<typeof defaultLegionClient.deleteTeamLink>
	): Promise<void> {
		return this.measurePerformance('deleteTeamLink', () =>
			this._legionClient.deleteTeamLink(...args),
		);
	}

	/**
	 * Reorder a team link
	 */
	async reorderTeamLink(
		...args: Parameters<typeof defaultLegionClient.reorderTeamLink>
	): Promise<AwaitedReturn<typeof defaultLegionClient.reorderTeamLink>> {
		return this.measurePerformance('reorderTeamLink', () =>
			this._legionClient.reorderTeamLink(...args),
		);
	}

	/**
	 * Get org's eligibility for managed teams
	 */
	async getOrgEligibilityForManagedTeams(): Promise<
		AwaitedReturn<typeof defaultLegionClient.getOrgEligibilityForManagedTeams>
	> {
		return this.measurePerformance('getOrgEligibilityForManagedTeams', () =>
			this._legionClient.getOrgEligibilityForManagedTeams(),
		);
	}

	/**
	 * @deprecated Invitation status no longer exists
	 * Accept a team invitation
	 */
	async acceptTeamInvitation(
		...args: Parameters<typeof defaultLegionClient.acceptTeamInvitation>
	): Promise<AwaitedReturn<typeof defaultLegionClient.acceptTeamInvitation>> {
		return this.measurePerformance('acceptTeamInvitation', () =>
			this._legionClient.acceptTeamInvitation(...args),
		);
	}

	/**
	 * @deprecated Invitation status no longer exists
	 * Decline a team invitation
	 */
	async declineTeamInvitation(
		...args: Parameters<typeof defaultLegionClient.declineTeamInvitation>
	): Promise<void> {
		return this.measurePerformance('declineTeamInvitation', () =>
			this._legionClient.declineTeamInvitation(...args),
		);
	}

	/**
	 * Add current user to a team
	 */
	async selfJoinTeam(
		...args: Parameters<typeof defaultLegionClient.selfJoinTeam>
	): Promise<AwaitedReturn<typeof defaultLegionClient.selfJoinTeam>> {
		return this.measurePerformance('selfJoinTeam', () => this._legionClient.selfJoinTeam(...args));
	}

	/**
	 * Add agent to a team
	 */
	async addAgentsToTeam(
		...args: Parameters<typeof defaultLegionClient.addAgentsToTeam>
	): Promise<AwaitedReturn<typeof defaultLegionClient.addAgentsToTeam>> {
		return this.measurePerformance('addAgentToTeam', () =>
			this._legionClient.addAgentsToTeam(...args),
		);
	}

	async removeAgentTeamAssociation(
		...args: Parameters<typeof defaultLegionClient.removeAgentTeamAssociation>
	): Promise<AwaitedReturn<typeof defaultLegionClient.removeAgentTeamAssociation>> {
		return this.measurePerformance('removeAgentTeamAssociation', () =>
			this._legionClient.removeAgentTeamAssociation(...args),
		);
	}

	/**
	 * Cancel a join request to a private team
	 */
	async cancelJoinRequest(teamId: string): Promise<void> {
		return this.measurePerformance('cancelJoinRequest', () =>
			this._legionClient.cancelJoinRequest(teamId),
		);
	}

	/**
	 * Accept a join request to a private team
	 */
	async acceptJoinRequest(
		...args: Parameters<typeof defaultLegionClient.acceptJoinRequest>
	): Promise<AwaitedReturn<typeof defaultLegionClient.acceptJoinRequest>> {
		return this.measurePerformance('acceptJoinRequest', () =>
			this._legionClient.acceptJoinRequest(...args),
		);
	}

	/**
	 * Decline a join request to a private team
	 */
	async declineJoinRequest(
		...args: Parameters<typeof defaultLegionClient.declineJoinRequest>
	): Promise<void> {
		return this.measurePerformance('declineJoinRequest', () =>
			this._legionClient.declineJoinRequest(...args),
		);
	}

	/**
	 * @deprecated use removeTeamMemberships instead
	 */
	async deleteTeamMembership(
		...args: Parameters<typeof defaultLegionClient.deleteTeamMembership>
	): Promise<AwaitedReturn<typeof defaultLegionClient.deleteTeamMembership>> {
		return this.measurePerformance('deleteTeamMembership', () =>
			this._legionClient.deleteTeamMembership(...args),
		);
	}

	/**
	 * @deprecated INVITED status has been deprecated
	 */
	async revokeTeamInvite(
		...args: Parameters<typeof defaultLegionClient.revokeTeamInvite>
	): Promise<AwaitedReturn<typeof defaultLegionClient.revokeTeamInvite>> {
		return this.measurePerformance('revokeTeamInvite', () =>
			this._legionClient.revokeTeamInvite(...args),
		);
	}

	/**
	 * Delete a team
	 */
	async deleteTeam(teamId: string): Promise<void> {
		return this.measurePerformance('deleteTeam', () => this._legionClient.deleteTeam(teamId));
	}

	/**
	 * Archive a team
	 */
	async archiveTeam(teamId: string): Promise<TeamWithImageUrls> {
		return this.measurePerformance('archiveTeam', () => this._legionClient.archiveTeam(teamId));
	}
	/**
	 * Unarchive a team
	 */
	async unarchiveTeam(teamId: string): Promise<TeamWithImageUrls> {
		return this.measurePerformance('unarchiveTeam', () => this._legionClient.unArchiveTeam(teamId));
	}

	/**
	 * Unlink a team from group
	 */
	async unlinkTeamFromGroup(teamId: string): Promise<void> {
		return this.measurePerformance('unlinkTeamFromGroup', () =>
			this._legionClient.unlinkTeamFromGroup(teamId, 'MEMBER_INVITE'),
		);
	}

	/**
	 * @private
	 * @deprecated should be other means to solve this issue
	 */
	async isSingleFullMemberTeam(teamId: string): Promise<boolean> {
		return this._legionClient.isSingleFullMemberTeam(teamId);
	}

	/**
	 * Create a team
	 */
	async createTeam(
		...args: Parameters<typeof defaultLegionClient.createTeam>
	): Promise<AwaitedReturn<typeof defaultLegionClient.createTeam>> {
		return this.measurePerformance('createTeam', () => this._legionClient.createTeam(...args));
	}

	/**
	 * Create containers for a team
	 */
	async createTeamContainers(
		...args: Parameters<typeof defaultLegionClient.createTeamContainers>
	): Promise<AwaitedReturn<typeof defaultLegionClient.createTeamContainers>> {
		return this.measurePerformance('createTeamContainers', () =>
			this._legionClient.createTeamContainers(...args),
		);
	}

	/**
	 * Create a external team
	 * @param {string} groupDescription - The description of the group, which will be used as the team description. The group name will be fetched from the identity service, so it does not need to be provided.
	 * @param {ExternalReference} externalReference
	 */
	async createExternalTeam(
		...args: Parameters<typeof defaultLegionClient.createExternalTeam>
	): Promise<AwaitedReturn<typeof defaultLegionClient.createExternalTeam>> {
		return this.measurePerformance('createExternalTeam', () =>
			this._legionClient.createExternalTeam(...args),
		);
	}

	/**
	 * Get linked teams for a groups in bulk
	 * @param {string} groupIds - The group ids to fetch linked teams for
	 */
	async getLinkedTeamsBulk(
		...args: Parameters<typeof defaultLegionClient.getLinkedTeamsBulk>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getLinkedTeamsBulk>> {
		return this.measurePerformance('getLinkedTeamsBulk', () =>
			this._legionClient.getLinkedTeamsBulk(...args),
		);
	}

	/**
	 * Get Org scope
	 */
	async getOrgScope(
		...args: Parameters<typeof defaultLegionClient.getOrgScope>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getOrgScope>> {
		return this.measurePerformance('getOrgScope', () => this._legionClient.getOrgScope(...args));
	}

	/**
	 * Restore soft-deleted team and sync to group
	 */
	async restoreTeamToSyncedGroup(
		...args: Parameters<typeof defaultLegionClient.restoreTeamToSyncedGroup>
	): Promise<void> {
		return this.measurePerformance('restoreTeamToSyncedGroup', () =>
			this._legionClient.restoreTeamToSyncedGroup(...args),
		);
	}

	/**
	 * Get the difference between a team and a group
	 * @param teamId
	 * @param {ExternalReference} externalReference
	 * @returns {Promise<TeamAndGroupDifference>}
	 */
	async getTeamAndGroupDiff(
		...args: Parameters<typeof defaultLegionClient.getTeamAndGroupDiff>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamAndGroupDiff>> {
		return this.measurePerformance('getTeamAndGroupDiff', () =>
			this._legionClient.getTeamAndGroupDiff(...args),
		);
	}

	/**
	 * Link an existing team to a group
	 * @param teamId
	 * @param {ExternalReference} externalReference
	 */
	async linkExistingTeamToGroup(
		...args: Parameters<typeof defaultLegionClient.linkExistingTeamToGroup>
	): Promise<AwaitedReturn<typeof defaultLegionClient.linkExistingTeamToGroup>> {
		return this.measurePerformance('linkExistingTeamToGroup', () =>
			this._legionClient.linkExistingTeamToGroup(...args),
		);
	}

	/**
	 *
	 * @param teamId
	 * @returns {Promise<LinkedTeamsProfileDetails>}
	 */
	async getTeamProfileDetailsByTeamId(
		...args: Parameters<typeof defaultLegionClient.getTeamProfileDetails>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamProfileDetails>> {
		return this.measurePerformance('getTeamProfileDetails', () =>
			this._legionClient.getTeamProfileDetails(...args),
		);
	}

	/**
	 *
	 * @param teamId
	 * @returns {Promise<SoftDeletedTeam>}
	 */
	async getSoftDeletdTeamById(
		teamId: string,
	): Promise<AwaitedReturn<typeof defaultLegionClient.getSoftDeletedTeamById>> {
		return this.measurePerformance('getSoftDeletedTeamById', () =>
			this._legionClient.getSoftDeletedTeamById(teamId),
		);
	}

	/**
	 * Shoud only be used within Teams (P&T) packages
	 * @param userId
	 * @returns {Promise<SoftDeletedTeam>}
	 */
	async getUserInSiteUserBase(
		userId: string,
	): Promise<AwaitedReturn<typeof defaultLegionClient.getUserInSiteUserBase>> {
		return this.measurePerformance('getUserInSiteUserBase', () =>
			this._legionClient.getUserInSiteUserBase(userId),
		);
	}

	trimTeamARI(teamId = '') {
		return this._legionClient.trimTeamARI(teamId);
	}

	/**
	 * Get user profile with mutability constraints
	 */
	async getProfileWithMutability(
		...args: Parameters<typeof mutabilityClient.getProfileWithMutability>
	): Promise<AwaitedReturn<typeof mutabilityClient.getProfileWithMutability>> {
		return this.measurePerformance('getProfileWithMutability', () =>
			this._mutabilityClient.getProfileWithMutability(...args),
		);
	}

	/**
	 * Get enabled sites for a team
	 */
	async getTeamEnabledSites(
		...args: Parameters<typeof defaultLegionClient.getTeamEnabledSites>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamEnabledSites>> {
		return this.measurePerformance('getTeamEnabledSites', () =>
			this._legionClient.getTeamEnabledSites(...args),
		);
	}

	/**
	 * Assign teams to sites
	 * @param migrations
	 * @returns {Promise<AssignTeamsToSitesResponse>}
	 */
	async assignTeamsToSites(
		...args: Parameters<typeof defaultLegionClient.assignTeamsToSites>
	): Promise<AwaitedReturn<typeof defaultLegionClient.assignTeamsToSites>> {
		return this.measurePerformance('assignTeamsToSites', () =>
			this._legionClient.assignTeamsToSites(...args),
		);
	}

	/**
	 * Get assigned teams
	 * @param orgId
	 * @param cursor
	 * @param displayNameContains
	 * @param count - number of teams to return
	 */
	async getAssignedTeams(
		...args: Parameters<typeof defaultLegionClient.getAssignedTeams>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getAssignedTeams>> {
		return this.measurePerformance('getAssignedTeams', () =>
			this._legionClient.getAssignedTeams(...args),
		);
	}

	/**
	 * Get unassigned teams
	 * @param orgId
	 * @param count - number of teams to return
	 * @param cursor - cursor to the next page of results
	 * @param query - query to filter teams by
	 */
	async getUnassignedTeams(
		...args: Parameters<typeof defaultLegionClient.getUnassignedTeams>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getUnassignedTeams>> {
		return this.measurePerformance('getUnassignedTeams', () =>
			this._legionClient.getUnassignedTeams(...args),
		);
	}

	/**
	 * Set team site assignment permission
	 * @param orgId
	 * @param alignmentPermission - 'ALL_USERS' | 'ORG_ADMIN'
	 */
	async setTeamSiteAssignmentPermission(
		...args: Parameters<typeof defaultLegionClient.setTeamSiteAssignmentPermission>
	): Promise<AwaitedReturn<typeof defaultLegionClient.setTeamSiteAssignmentPermission>> {
		return this.measurePerformance('setTeamSiteAssignmentPermission', () =>
			this._legionClient.setTeamSiteAssignmentPermission(...args),
		);
	}

	/**
	 * Get team site assignment org details
	 */
	async getTeamSiteAssignmentOrgDetails(
		...args: Parameters<typeof defaultLegionClient.getTeamSiteAssignmentOrgDetails>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamSiteAssignmentOrgDetails>> {
		return this.measurePerformance('getTeamSiteAssignmentOrgDetails', () =>
			this._legionClient.getTeamSiteAssignmentOrgDetails(...args),
		);
	}

	/**
	 * Get teams to be cloned to JSM sites
	 */
	async getTeamsToBeClonedToJsmSites(
		...args: Parameters<typeof defaultLegionClient.getTeamsToBeClonedToJsmSites>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamsToBeClonedToJsmSites>> {
		return this.measurePerformance('getTeamsToBeClonedToJsmSites', () =>
			this._legionClient.getTeamsToBeClonedToJsmSites(...args),
		);
	}

	/**
	 * Is the current user a site admin
	 */
	getIsSiteAdmin(
		...args: Parameters<typeof permsClient.getIsSiteAdmin>
	): Promise<AwaitedReturn<typeof permsClient.getIsSiteAdmin>> {
		return this.measurePerformance('getIsSiteAdmin', () =>
			this._permsClient.getIsSiteAdmin(...args),
		);
	}

	/**
	 * Add users to a team
	 */
	addUsersToTeam(
		...args: Parameters<typeof publicApiClient.addUsersToTeam>
	): Promise<AwaitedReturn<typeof publicApiClient.addUsersToTeam>> {
		return this.measurePerformance('addUsersToTeam', () =>
			this._publicApiClient.addUsersToTeam(...args),
		);
	}

	/**
	 * Remove users from a team
	 */
	removeTeamMemberships(
		...args: Parameters<typeof publicApiClient.removeTeamMemberships>
	): Promise<AwaitedReturn<typeof publicApiClient.removeTeamMemberships>> {
		return this.measurePerformance('removeTeamMemberships', () =>
			this._publicApiClient.removeTeamMemberships(...args),
		);
	}

	/**
	 * Restore a deleted team
	 */
	restoreTeam(
		...args: Parameters<typeof publicApiClient.restoreTeam>
	): Promise<AwaitedReturn<typeof publicApiClient.restoreTeam>> {
		return this.measurePerformance('restoreTeam', () => this._publicApiClient.restoreTeam(...args));
	}

	getRecommendedProducts(
		...args: Parameters<typeof invitationsClient.getProductRecommendations>
	): Promise<AwaitedReturn<typeof invitationsClient.getProductRecommendations>> {
		return this.measurePerformance('getRecommendedProducts', () =>
			this._invitationsClient.getProductRecommendations(...args),
		);
	}

	joinOrRequestDefaultAccessToProductsBulk(
		...args: Parameters<typeof invitationsClient.joinOrRequestDefaultAccessToProductsBulk>
	): Promise<AwaitedReturn<typeof invitationsClient.joinOrRequestDefaultAccessToProductsBulk>> {
		return this.measurePerformance('joinOrRequestDefaultAccessToProductsBulk', () =>
			this._invitationsClient.joinOrRequestDefaultAccessToProductsBulk(...args),
		);
	}

	/**
	 * Get token to upload media for a team
	 */
	async getWriteTeamMediaToken(): Promise<
		AwaitedReturn<typeof userPreferencesClient.getReadMediaToken>
	> {
		return this.measurePerformance('getWriteTeamMediaToken', () =>
			this._legionClient.getWriteMediaToken(),
		);
	}

	/**
	 * Get token to read media for a user
	 */
	async getReadMediaToken(
		...args: Parameters<typeof userPreferencesClient.getReadMediaToken>
	): Promise<AwaitedReturn<typeof userPreferencesClient.getReadMediaToken>> {
		return this.measurePerformance('getReadMediaToken', () =>
			this._userPreferencesClient.getReadMediaToken(...args),
		);
	}

	/**
	 * Get token to upload media for a user
	 */
	async getWriteUserMediaToken(): Promise<
		AwaitedReturn<typeof userPreferencesClient.getReadMediaToken>
	> {
		return this.measurePerformance('getWriteUserMediaToken', () =>
			this._userPreferencesClient.getWriteMediaToken(),
		);
	}

	/**
	 * Update header image for a user
	 */
	async updateUserHeaderImage(
		headerImageId: string | null,
	): Promise<AwaitedReturn<typeof userPreferencesClient.updateUserHeaderImage>> {
		return this.measurePerformance('updateUserHeaderImage', () =>
			this._userPreferencesClient.updateUserHeaderImage(headerImageId),
		);
	}

	/**
	 * Fetch user containers from collboration graph
	 */
	async getUserContainers(
		...args: Parameters<typeof collaborationGraphClient.getUserContainers>
	): Promise<AwaitedReturn<typeof collaborationGraphClient.getUserContainers>> {
		return this.measurePerformance('getUserContainers', () =>
			this._collaborationGraphClient.getUserContainers(...args),
		);
	}

	/**
	 * Fetch mutatability of external managed user fields
	 */
	async getUserManageConfig(
		...args: Parameters<typeof identityClient.getUserManageConfig>
	): Promise<AwaitedReturn<typeof identityClient.getUserManageConfig>> {
		return this.measurePerformance('getUserManageConfig', () =>
			this._identityClient.getUserManageConfig(...args),
		);
	}

	/**
	 * Fetch user avatar uploaded status
	 */
	async getMyAvatarUploadedStatus(
		...args: Parameters<typeof identityClient.getMyAvatarUploadedStatus>
	): Promise<AwaitedReturn<typeof identityClient.getMyAvatarUploadedStatus>> {
		return this.measurePerformance('getMyAvatarUploadedStatus', () =>
			this._identityClient.getMyAvatarUploadedStatus(...args),
		);
	}

	/**
	 * Delete user avatar
	 */
	async deleteAvatar(
		...args: Parameters<typeof identityClient.deleteAvatar>
	): Promise<AwaitedReturn<typeof identityClient.deleteAvatar>> {
		return this.measurePerformance('deleteUserAvatar', () =>
			this._identityClient.deleteAvatar(...args),
		);
	}

	async fetchUserAvatarInfo(
		...args: Parameters<typeof identityClient.fetchUserAvatarInfo>
	): Promise<AwaitedReturn<typeof identityClient.fetchUserAvatarInfo>> {
		return this.measurePerformance('fetchUserAvatarInfo', () =>
			this._identityClient.fetchUserAvatarInfo(...args),
		);
	}

	/**
	 * Fetch Team link icons
	 */
	async getTeamLinkIcons(
		...args: Parameters<typeof objectResolverClient.getTeamLinkIcons>
	): Promise<AwaitedReturn<typeof objectResolverClient.getTeamLinkIcons>> {
		return this.measurePerformance('getTeamLinkIcons', () =>
			this._objectResolverClient.getTeamLinkIcons(...args),
		);
	}

	/**
	 * Fetch ARI from URL
	 */
	async getAriFromUrl(
		...args: Parameters<typeof objectResolverClient.getAriFromUrl>
	): Promise<AwaitedReturn<typeof objectResolverClient.getAriFromUrl>> {
		return this.measurePerformance('getAriFromUrl', () =>
			this._objectResolverClient.getAriFromUrl(...args),
		);
	}

	/**
	 * Fetch web link title
	 */
	async getWebLinkTitle(
		...args: Parameters<typeof objectResolverClient.getWebLinkTitle>
	): Promise<AwaitedReturn<typeof objectResolverClient.getWebLinkTitle>> {
		return this.measurePerformance('getWebLinkTitle', () =>
			this._objectResolverClient.getWebLinkTitle(...args),
		);
	}

	/**
	 * Fetch team in slack details
	 */
	async getTeamInSlack(
		...args: Parameters<typeof teamsInSlackClient.getTeamInSlack>
	): Promise<AwaitedReturn<typeof teamsInSlackClient.getTeamInSlack>> {
		return this.measurePerformance('getTeamInSlack', () =>
			this._teamsInSlackClient.getTeamInSlack(...args),
		);
	}

	/**
	 * Delete team in slack
	 */
	async disconnectTeamInSlack(
		...args: Parameters<typeof teamsInSlackClient.disconnectTeamInSlack>
	): Promise<AwaitedReturn<typeof teamsInSlackClient.disconnectTeamInSlack>> {
		return this.measurePerformance('disconnectTeamInSlack', () =>
			this._teamsInSlackClient.disconnectTeamInSlack(...args),
		);
	}

	/**
	 * Update team in slack
	 */
	async updateTeamInSlack(
		...args: Parameters<typeof teamsInSlackClient.updateTeamInSlack>
	): Promise<AwaitedReturn<typeof teamsInSlackClient.updateTeamInSlack>> {
		return this.measurePerformance('updateTeamInSlack', () =>
			this._teamsInSlackClient.updateTeamInSlack(...args),
		);
	}

	/**
	 * Update user details
	 */
	async updateUser(
		...args: Parameters<typeof identityClient.updateUser>
	): Promise<AwaitedReturn<typeof identityClient.updateUser>> {
		return this.measurePerformance('updateUser', () => this._identityClient.updateUser(...args));
	}

	async updateUserAvatar(
		...args: Parameters<typeof identityClient.updateUserAvatar>
	): Promise<AwaitedReturn<typeof identityClient.updateUserAvatar>> {
		return this.measurePerformance('updateUserAvatar', () =>
			this._identityClient.updateUserAvatar(...args),
		);
	}

	async addTeamWatcher(
		...args: Parameters<typeof teamCentralClient.addTeamWatcher>
	): Promise<AwaitedReturn<typeof teamCentralClient.addTeamWatcher>> {
		return this._teamCentralClient.addTeamWatcher(...args);
	}

	async isTeamWatcher(
		...args: Parameters<typeof teamCentralClient.isTeamWatcher>
	): Promise<AwaitedReturn<typeof teamCentralClient.isTeamWatcher>> {
		return this._teamCentralClient.isTeamWatcher(...args);
	}

	async removeTeamWatcher(
		...args: Parameters<typeof teamCentralClient.removeTeamWatcher>
	): Promise<AwaitedReturn<typeof teamCentralClient.removeTeamWatcher>> {
		return this._teamCentralClient.removeTeamWatcher(...args);
	}

	async deleteKudos(
		...args: Parameters<typeof teamCentralClient.deleteKudos>
	): Promise<AwaitedReturn<typeof teamCentralClient.deleteKudos>> {
		return this._teamCentralClient.deleteKudos(...args);
	}

	async queryTagList(
		...args: Parameters<typeof teamCentralClient.queryTagList>
	): Promise<AwaitedReturn<typeof teamCentralClient.queryTagList>> {
		return this._teamCentralClient.queryTagList(...args);
	}

	async createTag(
		...args: Parameters<typeof teamCentralClient.createTag>
	): Promise<AwaitedReturn<typeof teamCentralClient.createTag>> {
		return this._teamCentralClient.createTag(...args);
	}

	async createHelpPointer(
		...args: Parameters<typeof teamCentralClient.createHelpPointer>
	): Promise<AwaitedReturn<typeof teamCentralClient.createHelpPointer>> {
		return this._teamCentralClient.createHelpPointer(...args);
	}

	async updateHelpPointer(
		...args: Parameters<typeof teamCentralClient.updateHelpPointer>
	): Promise<AwaitedReturn<typeof teamCentralClient.updateHelpPointer>> {
		return this._teamCentralClient.updateHelpPointer(...args);
	}

	async deleteHelpPointer(
		...args: Parameters<typeof teamCentralClient.deleteHelpPointer>
	): Promise<AwaitedReturn<typeof teamCentralClient.deleteHelpPointer>> {
		return this._teamCentralClient.deleteHelpPointer(...args);
	}

	async getUserTenure(
		...args: Parameters<typeof replinesClient.getUserTenure>
	): Promise<AwaitedReturn<typeof replinesClient.getUserTenure>> {
		return this.measurePerformance('getUserTenure', () =>
			this._replinesClient.getUserTenure(...args),
		);
	}

	async checkOrgFullAlignmentStatus(
		...args: Parameters<typeof defaultLegionClient.checkOrgFullAlignmentStatus>
	): Promise<AwaitedReturn<typeof defaultLegionClient.checkOrgFullAlignmentStatus>> {
		return this._legionClient.checkOrgFullAlignmentStatus(...args);
	}

	async getTeamStatesInBulk(
		...args: Parameters<typeof defaultLegionClient.getTeamStatesInBulk>
	): Promise<AwaitedReturn<typeof defaultLegionClient.getTeamStatesInBulk>> {
		return this._legionClient.getTeamStatesInBulk(...args);
	}

	async getReportingLines(
		...args: Parameters<typeof reportingLinesClient.getReportingLines>
	): Promise<AwaitedReturn<typeof reportingLinesClient.getReportingLines>> {
		return this.measurePerformance('getReportingLines', () =>
			this._reportingLinesClient.getReportingLines(...args),
		);
	}
}

export const teamsClient = new TeamsClient();
