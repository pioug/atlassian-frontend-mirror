import { type TeamMembershipQueryResponse } from '../services/agg-client/utils/queries/team-membership-query';

import avatar1 from './images/avatar-1.png';
import avatar2 from './images/avatar-2.png';
import avatar3 from './images/avatar-3.png';
import avatar4 from './images/avatar-4.png';
import avatar5 from './images/avatar-5.png';
import type { MockConfig } from './mock-config';

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
