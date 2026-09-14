import { type TeamPermission } from '../../../types/team';

/**
 * This is really just required so we don't show things like "Join team" if the team is member invite and it should say "Request to join team"
 */
export const inviteOnlyPermissions = (
	permission: TeamPermission | undefined,
): {
	REQUEST_TO_JOIN: boolean;
	CANCEL_JOIN_REQUEST: boolean;
} => ({
	REQUEST_TO_JOIN: permission === 'FULL_READ',
	CANCEL_JOIN_REQUEST: permission === 'FULL_READ',
});
