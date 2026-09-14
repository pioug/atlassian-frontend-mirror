import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type ExternalReferenceSource } from '../../../types/team';

export const SCIMSyncTeamPermissions = (
	isMember: boolean,
	isOrgAdmin: boolean,
	source?: ExternalReferenceSource,
): {
	EDIT_DESCRIPTION: boolean;
	EDIT_TEAM_SETTINGS: boolean;
	EDIT_TEAM_LINK: boolean;
	EDIT_TEAM_NAME: boolean;
	//Org admins should not be able to edit hierarchies of HRIS synced teams
	CAN_EDIT_HIERARCHY: boolean;
} => ({
	EDIT_DESCRIPTION: isMember || isOrgAdmin,
	EDIT_TEAM_SETTINGS: isMember || isOrgAdmin,
	EDIT_TEAM_LINK: isMember || isOrgAdmin,
	EDIT_TEAM_NAME:
		isOrgAdmin && source === 'ATLASSIAN_GROUP' && fg('enable_edit_team_name_external_type_teams'),
	//Org admins should not be able to edit hierarchies of HRIS synced teams
	CAN_EDIT_HIERARCHY: source === 'ATLASSIAN_GROUP' && isOrgAdmin,
});
