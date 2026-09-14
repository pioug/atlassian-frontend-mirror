import { type TeamMembership } from '../../types/membership';

export const isRequestingJoin = (member?: TeamMembership): boolean =>
	!!member && member.state === 'REQUESTING_TO_JOIN';
