import { type TeamMembership } from '../../../types/membership';
import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';
import { isMember } from '../team';

import { getPermissionMap, vanityActions } from './constants';
import { type TeamAction, type TeamPermissions } from './types';

export function hasPermission(
	action: TeamAction,
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isPeopleBrowseEnabled: boolean,
	currentUserMembership: TeamMembership | undefined,
	teamVisibilityPermissions?: TeamPermissions,
	source?: ExternalReferenceSource,
	state?: TeamState,
): boolean {
	if (!isPeopleBrowseEnabled && !vanityActions.includes(action)) {
		return false;
	}
	const isMemberOfTeam = isMember(currentUserMembership);
	const isOrgAdmin = Boolean(teamVisibilityPermissions?.canAdminTeams);
	return userCan(action, {
		membershipSettings: settings,
		teamPermission: permission,
		isMemberOfTeam,
		isOrgAdmin,
		source,
		state,
	});
}

type PermissionOptions = {
	/**
	 * The teams membership settings, "OPEN" | "MEMBER_INVITE" | "EXTERNAL"
	 */
	membershipSettings: TeamMembershipSettings;
	/**
	 * The users permission for the team, "FULL_WRITE" | "FULL_READ" | "NONE"
	 */
	teamPermission: TeamPermission | undefined;
	/**
	 * Is the user a member of the team
	 */
	isMemberOfTeam: boolean;
	/**
	 * Is the user an org admin
	 */
	isOrgAdmin: boolean;
	/**
	 * External source(if any) "ATLASSIAN_GROUP" | "HRIS"
	 */
	source?: ExternalReferenceSource;
	state?: TeamState;
};

/**
 * Determines if a user has permission perform a given action on a team
 */
export function userCan(action: TeamAction, options: PermissionOptions): boolean {
	return getPermissionMap(
		options.membershipSettings,
		options.teamPermission,
		options.isMemberOfTeam,
		options.isOrgAdmin,
		options.source,
		options.state,
	)[action];
}

/**
 * @deprecated Use `userCan` instead, it gives better visibility into the option mappings
 */
export function hasPermissionForAction(
	action: TeamAction,
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMemberOfTeam: boolean,
	isOrgAdmin: boolean = false,
): boolean {
	return userCan(action, {
		membershipSettings: settings,
		teamPermission: permission,
		isMemberOfTeam,
		isOrgAdmin,
	});
}
