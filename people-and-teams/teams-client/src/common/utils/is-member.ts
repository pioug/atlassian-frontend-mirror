import { type TeamMembership } from '../../types/membership';

export const isMember = (member?: TeamMembership): boolean =>
	!!member && member.state === 'FULL_MEMBER';
