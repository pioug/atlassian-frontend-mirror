export const AllTeamActions = [
	'ADD_MEMBER_TO_TEAM',
	'JOIN_TEAM',
	'REQUEST_TO_JOIN',
	'CANCEL_JOIN_REQUEST',
	'APPROVE_JOIN_REQUEST',
	'REJECT_JOIN_REQUEST',
	'REMOVE_MEMBER_FROM_TEAM',
	'CANCEL_INVITE',
	'LEAVE_TEAM',
	'REMOVE_AGENT_FROM_TEAM',
	'ADD_AGENT_TO_TEAM',
	'CAN_EDIT_HIERARCHY',
	'CAN_CHANGE_MEMBERSHIP_SETTINGS',

	// Visual
	'EDIT_TEAM_NAME',
	'EDIT_DESCRIPTION',
	'EDIT_PROFILE_HEADER',
	'EDIT_TEAM_LINK',
	'EDIT_TEAM_SETTINGS',
	'EDIT_TEAM_MEMBERSHIP',
	'EDIT_TEAM_TYPE',

	// Serious
	'DELETE_TEAM',
	'ARCHIVE_TEAM',
	'UNARCHIVE_TEAM',
] as const;

export type TeamAction = (typeof AllTeamActions)[number];

export type TeamPermissions = {
	canCreateTeams: boolean;
	canViewTeams: boolean;
	canAdminTeams?: boolean;
};
