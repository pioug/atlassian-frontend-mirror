import { type TeamMembership } from '../../types/membership';

export const isNonMember = (member?: TeamMembership): boolean =>
	!member || member.state === 'ALUMNI';
