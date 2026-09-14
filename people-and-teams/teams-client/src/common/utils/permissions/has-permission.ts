/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type TeamMembership } from '../../../types/membership';
import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';
import { isMember } from '../is-member';

import { vanityActions } from './constants';
import { type TeamAction, type TeamPermissions } from './types';
import { userCan } from './user-can';

/**
 * @deprecated use import { userCan } from '@atlassian/teams-app-internal-user-permissions';
 */
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

/**
 * @deprecated Use `import { hasPermissionForAction } from '@atlaskit/teams-client/has-permission-for-action'` instead.
 */
export { hasPermissionForAction } from './has-permission-for-action';
/**
 * @deprecated Use `import { userCan } from '@atlaskit/teams-client/user-can'` instead.
 */
export { userCan } from './user-can';
