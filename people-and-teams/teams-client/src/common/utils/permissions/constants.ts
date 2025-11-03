import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';

import { type TeamAction } from './types';

export type PermissionMap = Required<Record<TeamAction, boolean>>;

export const allPermissions = (defaultPermission: boolean, isMember: boolean): PermissionMap => ({
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
	REMOVE_AGENT_FROM_TEAM: defaultPermission,
	ADD_AGENT_TO_TEAM: defaultPermission,
	ARCHIVE_TEAM: defaultPermission && isMember,
	UNARCHIVE_TEAM: false,
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
	const newTeamProfileEnabled = FeatureGates.getExperimentValue(
		'new_team_profile',
		'isEnabled',
		false,
	);
	const isArchiveTeamEnabled = fg('legion-enable-archive-teams') && newTeamProfileEnabled;

	// Base permission map - all actions disabled for disbanded teams
	const basePermissions = allPermissions(false, false);

	// UNARCHIVE_TEAM permission based on team settings
	let canUnarchive = false;
	if (isArchiveTeamEnabled) {
		if (settings === 'EXTERNAL') {
			// For EXTERNAL teams, only org admins can unarchive
			canUnarchive = isOrgAdmin;
		} else if (settings === 'OPEN' || settings === 'MEMBER_INVITE') {
			// For OPEN and MEMBER_INVITE teams, members with FULL_WRITE can unarchive
			canUnarchive = isMember && permission === 'FULL_WRITE';
		}
	}

	return {
		...basePermissions,
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
	const newTeamProfileEnabled = FeatureGates.getExperimentValue(
		'new_team_profile',
		'isEnabled',
		false,
	);
	const isArchiveTeamEnabled = fg('legion-enable-archive-teams') && newTeamProfileEnabled;
	if (settings === 'OPEN') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember),
			...openPermissions(permission),
			ARCHIVE_TEAM: isArchiveTeamEnabled && permission === 'FULL_WRITE' && isMember,
		};
	}
	if (settings === 'MEMBER_INVITE') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember),
			...inviteOnlyPermissions(permission),
			ARCHIVE_TEAM: isArchiveTeamEnabled && permission === 'FULL_WRITE' && isMember,
		};
	} else if (settings === 'EXTERNAL') {
		return {
			...allPermissions(false, isMember),
			...SCIMSyncTeamPermissions(isMember, isOrgAdmin, source),
			ADD_AGENT_TO_TEAM: newTeamProfileEnabled && (isMember || isOrgAdmin),
			REMOVE_AGENT_FROM_TEAM: newTeamProfileEnabled && (isMember || isOrgAdmin),
			ARCHIVE_TEAM: isArchiveTeamEnabled && isOrgAdmin,
		};
	}
	return allPermissions(false, false);
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
