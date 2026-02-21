import { isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';

import { type TeamAction } from './types';

export type PermissionMap = Required<Record<TeamAction, boolean>>;

export const allPermissions = (
	defaultPermission: boolean,
	isMember: boolean,
	isOrgAdmin: boolean,
): PermissionMap => ({
	ADD_MEMBER_TO_TEAM: defaultPermission,
	JOIN_TEAM: defaultPermission,
	REQUEST_TO_JOIN: defaultPermission,
	CANCEL_JOIN_REQUEST: defaultPermission,
	APPROVE_JOIN_REQUEST: defaultPermission,
	REJECT_JOIN_REQUEST: defaultPermission,
	REMOVE_MEMBER_FROM_TEAM: defaultPermission,
	CANCEL_INVITE: defaultPermission,
	LEAVE_TEAM: defaultPermission && isMember,
	EDIT_DESCRIPTION: defaultPermission,
	EDIT_TEAM_NAME: defaultPermission,
	EDIT_PROFILE_HEADER: defaultPermission,
	EDIT_TEAM_LINK: defaultPermission,
	DELETE_TEAM: defaultPermission,
	EDIT_TEAM_SETTINGS: defaultPermission,
	EDIT_TEAM_MEMBERSHIP: defaultPermission,
	EDIT_TEAM_TYPE: defaultPermission && isOrgAdmin,
	REMOVE_AGENT_FROM_TEAM: defaultPermission,
	ADD_AGENT_TO_TEAM: defaultPermission,
	ARCHIVE_TEAM: defaultPermission && isMember,
	UNARCHIVE_TEAM: false,
	CAN_EDIT_HIERARCHY: defaultPermission,
	CAN_CHANGE_MEMBERSHIP_SETTINGS: defaultPermission,
});

export const vanityActions: TeamAction[] = [
	'EDIT_DESCRIPTION',
	'EDIT_TEAM_NAME',
	'EDIT_PROFILE_HEADER',
	'EDIT_TEAM_LINK',
];

export const openPermissions = (permission: TeamPermission | undefined) => ({
	JOIN_TEAM: permission === 'FULL_READ' || permission === 'FULL_WRITE',
	REQUEST_TO_JOIN: false,
	CANCEL_JOIN_REQUEST: false,
	APPROVE_JOIN_REQUEST: false,
	REJECT_JOIN_REQUEST: false,
});

export const inviteOnlyPermissions = (permission: TeamPermission | undefined) => ({
	REQUEST_TO_JOIN: permission === 'FULL_READ',
	CANCEL_JOIN_REQUEST: permission === 'FULL_READ',
});

export const SCIMSyncTeamPermissions = (
	isMember: boolean,
	isOrgAdmin: boolean,
	source?: ExternalReferenceSource,
) => ({
	EDIT_DESCRIPTION: isMember || isOrgAdmin,
	EDIT_TEAM_SETTINGS: isMember || isOrgAdmin,
	EDIT_TEAM_LINK: isMember || isOrgAdmin,
	EDIT_TEAM_NAME:
		isOrgAdmin && source === 'ATLASSIAN_GROUP' && fg('enable_edit_team_name_external_type_teams'),
	//Org admins should not be able to edit hierarchies of HRIS synced teams
	CAN_EDIT_HIERARCHY: source === 'ATLASSIAN_GROUP' && isOrgAdmin,
});

/**
 * Returns permission map for disbanded teams
 * Only UNARCHIVE_TEAM action is allowed based on team settings and user permissions
 */
const getDisbandedTeamPermissionMap = (
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMember: boolean,
	isOrgAdmin: boolean,
): PermissionMap => {
	const newTeamProfileEnabled = !isFedRamp() || fg('new_team_profile_fedramp');

	// Base permission map - all actions disabled for disbanded teams
	const basePermissions = allPermissions(false, false, false);

	// UNARCHIVE_TEAM permission based on team settings
	let canUnarchive = false;
	if (newTeamProfileEnabled) {
		if (settings === 'EXTERNAL' || settings === 'ORG_ADMIN_MANAGED') {
			// For EXTERNAL and ORG_ADMIN_MANAGED teams, only org admins can unarchive
			canUnarchive = isOrgAdmin;
		} else if (settings === 'OPEN' || settings === 'MEMBER_INVITE') {
			// For OPEN and MEMBER_INVITE teams, members with FULL_WRITE can unarchive
			canUnarchive = (isMember || isOrgAdmin) && permission === 'FULL_WRITE';
		}
	}

	return {
		...basePermissions,
		CAN_EDIT_HIERARCHY: false,
		UNARCHIVE_TEAM: canUnarchive,
		DELETE_TEAM: canUnarchive,
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
	const newTeamProfileEnabled = !isFedRamp() || fg('new_team_profile_fedramp');
	if (settings === 'OPEN') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember, isOrgAdmin),
			...openPermissions(permission),
			ARCHIVE_TEAM:
				newTeamProfileEnabled && permission === 'FULL_WRITE' && (isMember || isOrgAdmin),
		};
	}
	if (settings === 'MEMBER_INVITE') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember, isOrgAdmin),
			...inviteOnlyPermissions(permission),
			ARCHIVE_TEAM:
				newTeamProfileEnabled && permission === 'FULL_WRITE' && (isMember || isOrgAdmin),
		};
	} else if (settings === 'EXTERNAL') {
		return {
			...allPermissions(false, isMember, isOrgAdmin),
			...SCIMSyncTeamPermissions(isMember, isOrgAdmin, source),
			ADD_AGENT_TO_TEAM: newTeamProfileEnabled && (isMember || isOrgAdmin),
			REMOVE_AGENT_FROM_TEAM: newTeamProfileEnabled && (isMember || isOrgAdmin),
			ARCHIVE_TEAM: newTeamProfileEnabled && isOrgAdmin,
			EDIT_TEAM_TYPE: isOrgAdmin,
		};
	} else if (settings === 'ORG_ADMIN_MANAGED') {
		// NOTE: Only org admins will received FULL_WRITE permission
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember, isOrgAdmin),
			EDIT_TEAM_LINK: isMember || permission === 'FULL_WRITE',
			ADD_AGENT_TO_TEAM: newTeamProfileEnabled && (isMember || permission === 'FULL_WRITE'),
			REMOVE_AGENT_FROM_TEAM: newTeamProfileEnabled && (isMember || permission === 'FULL_WRITE'),
			ARCHIVE_TEAM: newTeamProfileEnabled && permission === 'FULL_WRITE',
			CAN_EDIT_HIERARCHY: permission === 'FULL_WRITE',
			EDIT_TEAM_TYPE: permission === 'FULL_WRITE',
			// ORG_ADMIN_MANAGED teams should not provide options to edit membership settings
			EDIT_TEAM_MEMBERSHIP: false,
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
