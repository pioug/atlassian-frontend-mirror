import { fixedTeamMemberships } from '../../mocks';
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

const teamMember = fixedTeamMemberships(1)[0];

describe('team utils', () => {
	it('checks if the member is invited to them team', () => {
		expect(isInvited({ ...teamMember, state: 'INVITED' })).toBe(true);
	});

	it('checks if the user is a non-member of the team', () => {
		expect(isNonMember({ ...teamMember, state: 'ALUMNI' })).toBe(true);
		expect(isNonMember({ ...teamMember, state: 'INVITED' })).toBe(false);
	});

	it('checks if a user is requesting to join the team', () => {
		expect(isRequestingJoin({ ...teamMember, state: 'REQUESTING_TO_JOIN' })).toBe(true);
		expect(isRequestingJoin({ ...teamMember, state: 'INVITED' })).toBe(false);
	});

	it('checks if the user is a member of the team', () => {
		expect(isMember({ ...teamMember, state: 'FULL_MEMBER' })).toBe(true);
		expect(isMember({ ...teamMember, state: 'INVITED' })).toBe(false);
	});
});
