import { type TeamMembership } from '../../types';

export function isInvited(member?: TeamMembership): member is TeamMembership & boolean {
	return !!member && member.state === 'INVITED';
}

export const isNonMember = (member?: TeamMembership): boolean =>
	!member || member.state === 'ALUMNI';

export const isRequestingJoin = (member?: TeamMembership): boolean =>
	!!member && member.state === 'REQUESTING_TO_JOIN';

export const isMember = (member?: TeamMembership): boolean =>
	!!member && member.state === 'FULL_MEMBER';
