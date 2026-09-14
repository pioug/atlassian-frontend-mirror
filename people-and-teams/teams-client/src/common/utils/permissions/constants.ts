import { type TeamAction } from './types';

export type PermissionMap = Required<Record<TeamAction, boolean>>;

export const vanityActions: TeamAction[] = [
	'EDIT_DESCRIPTION',
	'EDIT_TEAM_NAME',
	'EDIT_PROFILE_HEADER',
	'EDIT_TEAM_LINK',
];
