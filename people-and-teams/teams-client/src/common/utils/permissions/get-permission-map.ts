import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';
import { allPermissions } from './all-permissions';
import { type PermissionMap } from './constants';
import { inviteOnlyPermissions } from './invite-only-permissions';
import { openPermissions } from './open-permissions';
import { SCIMSyncTeamPermissions } from './scim-sync-team-permissions';

/**
 * Returns permission map for disbanded teams
 * Only UNARCHIVE_TEAM and DELETE_TEAM actions are allowed based on team settings and user permissions
 */
const getDisbandedTeamPermissionMap = (
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMember: boolean,
	isOrgAdmin: boolean,
): PermissionMap => {
	// Base permission map - all actions disabled for disbanded teams
	const basePermissions = allPermissions(false, false, false);

	const isOrgAdminControlled = settings === 'EXTERNAL' || settings === 'ORG_ADMIN_MANAGED';

	let canDelete: boolean;

	if (isOrgAdminControlled) {
		// For EXTERNAL and ORG_ADMIN_MANAGED teams, only org admins can delete
		canDelete = isOrgAdmin;
	} else {
		// For OPEN and MEMBER_INVITE teams, members with FULL_WRITE (or org admins) can delete
		canDelete = (isMember || isOrgAdmin) && permission === 'FULL_WRITE';
	}

	return {
		...basePermissions,
		CAN_EDIT_HIERARCHY: false,
		// Any user with FULL_WRITE can unarchive. Org admins can also unarchive EXTERNAL and
		// ORG_ADMIN_MANAGED teams without FULL_WRITE.
		UNARCHIVE_TEAM: permission === 'FULL_WRITE' || (isOrgAdminControlled && isOrgAdmin),
		// Fallback only: useTeamPermission uses the server's CAN_DELETE_TEAM when relay permissions
		// are available
		DELETE_TEAM: canDelete,
	};
};

/**
 * Returns permission map for active teams based on team settings
 */
const getActiveTeamPermissionMap = (
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMember: boolean,
	isOrgAdmin: boolean,
	source?: ExternalReferenceSource,
): PermissionMap => {
	const basePermissions = allPermissions(permission === 'FULL_WRITE', isMember, isOrgAdmin);

	if (settings === 'OPEN') {
		return {
			...basePermissions,
			...openPermissions(permission),
		};
	}
	if (settings === 'MEMBER_INVITE') {
		return {
			...basePermissions,
			...inviteOnlyPermissions(permission),
		};
	} else if (settings === 'EXTERNAL') {
		if (fg('enable_edit_team_name_external_type_teams')) {
			// All membership based actions are disabled for Externally synced teams
			const base = allPermissions(false, isMember, isOrgAdmin);
			const actionsMembersCanPerform = {
				// Org admins should not be able to edit hierarchies of HRIS synced teams
				CAN_EDIT_HIERARCHY: source === 'ATLASSIAN_GROUP' && basePermissions.CAN_EDIT_HIERARCHY,

				ADD_AGENT_TO_TEAM: basePermissions.ADD_AGENT_TO_TEAM,
				REMOVE_AGENT_FROM_TEAM: basePermissions.REMOVE_AGENT_FROM_TEAM,
				ARCHIVE_TEAM: basePermissions.ARCHIVE_TEAM,
				EDIT_TEAM_TYPE: basePermissions.EDIT_TEAM_TYPE,
				EDIT_DESCRIPTION: basePermissions.EDIT_DESCRIPTION,
				EDIT_TEAM_SETTINGS: basePermissions.EDIT_TEAM_SETTINGS,
				EDIT_TEAM_LINK: basePermissions.EDIT_TEAM_LINK,
				EDIT_TEAM_NAME:
					basePermissions.EDIT_TEAM_NAME &&
					source === 'ATLASSIAN_GROUP' &&
					fg('enable_edit_team_name_external_type_teams'),
			};
			return {
				...base,
				...actionsMembersCanPerform,
			};
		}

		return {
			...allPermissions(false, isMember, isOrgAdmin),
			...SCIMSyncTeamPermissions(isMember, isOrgAdmin, source),
			ADD_AGENT_TO_TEAM: isMember || isOrgAdmin,
			REMOVE_AGENT_FROM_TEAM: isMember || isOrgAdmin,
			ARCHIVE_TEAM: isOrgAdmin,
			EDIT_TEAM_TYPE: isOrgAdmin,
		};
	} else if (settings === 'ORG_ADMIN_MANAGED') {
		// NOTE: Only org admins will received FULL_WRITE permission
		return {
			...basePermissions,
			// Delete all there rows on enable_edit_team_name_external_type_teams cleanup
			EDIT_TEAM_LINK: isMember || permission === 'FULL_WRITE' || basePermissions.EDIT_TEAM_LINK,
			ADD_AGENT_TO_TEAM:
				isMember || permission === 'FULL_WRITE' || basePermissions.ADD_AGENT_TO_TEAM,
			REMOVE_AGENT_FROM_TEAM:
				isMember || permission === 'FULL_WRITE' || basePermissions.REMOVE_AGENT_FROM_TEAM,
			CAN_EDIT_HIERARCHY: permission === 'FULL_WRITE' || basePermissions.CAN_EDIT_HIERARCHY,
			EDIT_TEAM_TYPE: permission === 'FULL_WRITE' || basePermissions.EDIT_TEAM_TYPE,

			// ORG_ADMIN_MANAGED teams should not provide options to edit membership settings
			EDIT_TEAM_MEMBERSHIP: basePermissions.EDIT_TEAM_MEMBERSHIP,

			// There is no "invite" flow in org_admin_managed teams
			REQUEST_TO_JOIN: false,
			CANCEL_JOIN_REQUEST: false,
			APPROVE_JOIN_REQUEST: false,
			REJECT_JOIN_REQUEST: false,
		};
	}

	return allPermissions(false, false, false);
};

export const getPermissionMap = (
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMember: boolean,
	isOrgAdmin: boolean,
	source?: ExternalReferenceSource,
	state?: TeamState,
): PermissionMap => {
	// Handle disbanded teams with special permission map
	if (state === 'DISBANDED') {
		return getDisbandedTeamPermissionMap(settings, permission, isMember, isOrgAdmin);
	}

	// For active teams (or when state is not provided), use existing logic
	return getActiveTeamPermissionMap(settings, permission, isMember, isOrgAdmin, source);
};
