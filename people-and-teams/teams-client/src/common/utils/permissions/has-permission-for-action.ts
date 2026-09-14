import { type TeamMembershipSettings, type TeamPermission } from '../../../types/team';

import { type TeamAction } from './types';
import { userCan } from './user-can';

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
