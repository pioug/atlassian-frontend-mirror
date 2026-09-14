import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type PermissionMap } from './constants';

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
	EDIT_TEAM_TYPE:
		defaultPermission && (isOrgAdmin || fg('ptc-enable-team-type-permission-enabled')),
	REMOVE_AGENT_FROM_TEAM: defaultPermission,
	ADD_AGENT_TO_TEAM: defaultPermission,
	ARCHIVE_TEAM: defaultPermission && (isMember || fg('ptc-enable-team-type-permission-enabled')),
	UNARCHIVE_TEAM: false,
	CAN_EDIT_HIERARCHY: defaultPermission,
	CAN_CHANGE_MEMBERSHIP_SETTINGS: defaultPermission,
});
