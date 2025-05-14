import { fg } from '@atlaskit/platform-feature-flags';

import { type TeamMembershipSettings, type TeamPermission } from '../../../types/team';

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

export const SCIMSyncTeamPermissions = (isMember: boolean, isOrgAdmin: boolean) => ({
	EDIT_DESCRIPTION: isMember || isOrgAdmin,
	EDIT_TEAM_SETTINGS: isMember || isOrgAdmin,
	EDIT_TEAM_LINK: isMember || isOrgAdmin,
	EDIT_TEAM_NAME: isOrgAdmin && fg('enable_edit_team_name_external_type_teams'),
});

export const getPermissionMap = (
	settings: TeamMembershipSettings,
	permission: TeamPermission | undefined,
	isMember: boolean,
	isOrgAdmin: boolean,
): PermissionMap => {
	if (settings === 'OPEN') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember),
			...openPermissions(permission),
		};
	}
	if (settings === 'MEMBER_INVITE') {
		return {
			...allPermissions(permission === 'FULL_WRITE', isMember),
			...inviteOnlyPermissions(permission),
		};
	} else if (settings === 'EXTERNAL') {
		return { ...allPermissions(false, isMember), ...SCIMSyncTeamPermissions(isMember, isOrgAdmin) };
	}
	return allPermissions(false, false);
};
