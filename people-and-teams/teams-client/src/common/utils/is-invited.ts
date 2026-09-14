import { type TeamMembership } from '../../types/membership';

export function isInvited(member?: TeamMembership): member is TeamMembership & boolean {
	return !!member && member.state === 'INVITED';
}
