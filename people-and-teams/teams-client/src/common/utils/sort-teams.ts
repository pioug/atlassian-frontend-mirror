import { type TeamMembership } from '../../types';

enum MemberType {
	CURRENT_USER = 0,
	MEMBER = 1,
	INVITED = 2,
	INACTIVE = 3,
	DELETED = 4,
}

const checkType = (member: TeamMembership, currentAccountId?: string): MemberType => {
	if (member.membershipId.memberId === currentAccountId) {
		return MemberType.CURRENT_USER;
	} else if (member && member.state === 'INVITED') {
		return MemberType.INVITED;
	} else if (member.user?.status === 'inactive') {
		return MemberType.INACTIVE;
	} else if (member.user?.status === 'closed') {
		return MemberType.DELETED;
	} else {
		return MemberType.MEMBER;
	}
};

export const sortMembersByType = (
	members: TeamMembership[],
	currentAccountId?: string,
): TeamMembership[] => {
	const newMembers = members.map((member) => ({
		member,
		type: checkType(member, currentAccountId),
	}));
	newMembers.sort(({ member: memberA, type: typeA }, { member: memberB, type: typeB }) => {
		if (typeA === typeB) {
			return memberA.user?.fullName.localeCompare(memberB.user?.fullName || '') || 0;
		} else {
			return typeA - typeB;
		}
	});
	return newMembers.map(({ member }) => member);
};
