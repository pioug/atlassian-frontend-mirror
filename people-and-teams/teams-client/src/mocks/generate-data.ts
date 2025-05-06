import type FakerType from 'faker';

import { randomUser } from '../mocks/user';
import { type TeamMembershipQueryResponse } from '../services/agg-client/utils/queries/team-membership-query';
import { type Team, type TeamMembership } from '../types';

import avatar1 from './images/avatar-1.png';
import avatar2 from './images/avatar-2.png';
import avatar3 from './images/avatar-3.png';
import avatar4 from './images/avatar-4.png';
import avatar5 from './images/avatar-5.png';

type MockConfig = {
	faker: typeof FakerType;
};

export const randomTeamMembership = ({ faker }: MockConfig, customProps = {}): TeamMembership => {
	const user = randomUser({ faker });
	return {
		state: faker.random.arrayElement(['FULL_MEMBER', 'ALUMNI', 'INVITED']),
		user,
		membershipId: {
			teamId: faker.random.uuid(),
			memberId: user.id,
		},
		role: faker.random.arrayElement(['ADMIN', 'REGULAR']),
		...customProps,
	};
};

export const randomTeamMemberships = (
	config: MockConfig,
	n = 10,
	customProps = {},
): TeamMembership[] =>
	[...Array(n)].map(() => {
		return {
			...randomTeamMembership(config, customProps),
		};
	});

export const fixedTeamMemberships = (n = 10): TeamMembership[] => {
	return [...Array(n)].map(
		(_, idx): TeamMembership => ({
			state: 'FULL_MEMBER',
			user: {
				id: `FIXED-NUMBER-ID-${idx}`,
				avatarUrl: `https://avatar.com/${idx}`,
				fullName: `Fixed User Fullname ${idx}`,
				nickname: `fixedUserName_${idx}`,
				title: `Fixed Job Title ${idx}`,
				userType: 'user',
			},
			membershipId: {
				teamId: `FIXED-TEAM-ID-${idx}`,
				memberId: `FIXED-NUMBER-ID-${idx}`,
			},
			role: 'REGULAR',
		}),
	);
};
// tslint:disable-next-line:no-any
export function randomReturnedNewTeamData(
	{ faker }: MockConfig,
	customProps: Partial<Team> = {},
): Team {
	return {
		id: faker.random.uuid(),
		creatorId: faker.random.uuid(),
		displayName: faker.finance.accountName(),
		description: faker.lorem.words(20),
		organizationId: undefined,
		permission: 'FULL_WRITE',
		membershipSettings: 'OPEN',
		state: 'ACTIVE',
		discoverable: 'DISCOVERABLE',
		restriction: 'NO_RESTRICTION',
		creatorDomain: 'c6080332a525e35ccd7b699a80a128e49a0acce5009e275bfdbc4ad53814eb2b',
		...customProps,
	};
}

export const mockTeamMembershipResponseWithNEdges = (
	{ faker }: MockConfig,
	n: number,
): { data: { team: TeamMembershipQueryResponse } } => ({
	data: {
		team: {
			teamV2: {
				members: {
					edges: [...Array(n)].map(() => ({
						node: {
							role: 'REGULAR',
							state: 'FULL_MEMBER',
							member: {
								name: `${faker.name.firstName()} ${faker.name.lastName()}`,
								picture: faker.random.arrayElement([avatar1, avatar2, avatar3, avatar4, avatar5]),
								accountStatus: 'active',
								extendedProfile: {
									jobTitle: faker.name.jobTitle(),
								},
								id: `ari:cloud:identity::user/${faker.random.uuid()}`,
							},
						},
					})),
					pageInfo: {
						endCursor: null,
						hasNextPage: false,
					},
				},
			},
		},
	},
});
