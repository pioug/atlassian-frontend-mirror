import faker from 'faker';

import { randomTeamMembership } from '../../mocks';
import { type MembershipState, type TeamMembership } from '../../types';
import { type UserStatus } from '../../types/user';

import { sortMembersByType } from './sort-teams';
import { isMember } from './team';

const randomTeamMember = ({
	state = 'FULL_MEMBER',
	status = 'active',
}: {
	state?: MembershipState;
	status?: UserStatus;
}): TeamMembership => {
	const membership = randomTeamMembership({ faker }, { state, status });

	return membership;
};

function shuffle<T>(a: T[]) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
}

function choice<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

describe('#sortMembersByType', () => {
	let toBeSorted: TeamMembership[];

	beforeEach(() => {
		toBeSorted = [
			// Regulars
			randomTeamMember({}),
			randomTeamMember({}),
			randomTeamMember({}),
			randomTeamMember({}),
			randomTeamMember({}),
			// Invited users
			randomTeamMember({ state: 'INVITED' }),
			randomTeamMember({ state: 'INVITED' }),
			// Inactive
			randomTeamMember({ status: 'inactive' }),
			// Deleted
			randomTeamMember({ status: 'closed' }),
		];
		shuffle(toBeSorted);
	});

	test('should put current member first', () => {
		const members = toBeSorted.slice();

		const currentUserId = choice(members.filter(isMember)).membershipId.memberId;

		const sorted = sortMembersByType(members, currentUserId);

		expect(sorted[0].membershipId.memberId).toEqual(currentUserId);
	});

	test('members should be sorted alphabetically', () => {
		const members = toBeSorted.slice();

		const sorted = sortMembersByType(members);

		const names = sorted.filter(isMember).map((member) => member.user?.fullName);

		const sortedNames = names.sort();

		expect(sortedNames).toEqual(names);
	});
});
