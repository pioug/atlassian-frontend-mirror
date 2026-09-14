import {
	type ExternalReferenceSource,
	type TeamMembershipSettings,
	type TeamPermission,
	type TeamState,
} from '../../../types/team';

import { getPermissionMap } from './get-permission-map';
import { type TeamAction } from './types';

type PermissionOptions = {
	/**
	 * The teams membership settings, "OPEN" | "MEMBER_INVITE" | "EXTERNAL"
	 */
	membershipSettings: TeamMembershipSettings;
	/**
	 * The users permission for the team, "FULL_WRITE" | "FULL_READ" | "NONE"
	 */
	teamPermission: TeamPermission | undefined;
	/**
	 * Is the user a member of the team
	 */
	isMemberOfTeam: boolean;
	/**
	 * Is the user an org admin
	 */
	isOrgAdmin: boolean;
	/**
	 * External source(if any) "ATLASSIAN_GROUP" | "HRIS"
	 */
	source?: ExternalReferenceSource;
	state?: TeamState;
};

/**
 * Determines if a user has permission perform a given action on a team
 * @deprecated use import { userCan } from '@atlassian/teams-app-internal-user-permissions';
 */
export function userCan(action: TeamAction, options: PermissionOptions): boolean {
	return getPermissionMap(
		options.membershipSettings,
		options.teamPermission,
		options.isMemberOfTeam,
		options.isOrgAdmin,
		options.source,
		options.state,
	)[action];
}
