import { type TeamPermission } from '../../../types/team';

/**
 * This is really just required so we don't show things like "Request to join team" if the team is open
 */
export const openPermissions = (
	permission: TeamPermission | undefined,
): {
	JOIN_TEAM: boolean;
	REQUEST_TO_JOIN: boolean;
	CANCEL_JOIN_REQUEST: boolean;
	APPROVE_JOIN_REQUEST: boolean;
	REJECT_JOIN_REQUEST: boolean;
} => ({
	JOIN_TEAM: permission === 'FULL_READ' || permission === 'FULL_WRITE',
	REQUEST_TO_JOIN: false,
	CANCEL_JOIN_REQUEST: false,
	APPROVE_JOIN_REQUEST: false,
	REJECT_JOIN_REQUEST: false,
});
