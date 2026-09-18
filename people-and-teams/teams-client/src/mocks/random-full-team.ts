import { type TeamWithImageUrls } from '../types/team';
import { randomBasicTeam } from './random-basic-team';
import { randomTeamImages } from './random-team-images';
import { randomTeamMemberships } from './random-team-memberships-2';
import type { MockConfig } from './team';

export const randomFullTeam =
	({ faker }: MockConfig) =>
	(customProps = {}): TeamWithImageUrls => {
		const teamMemberships = randomTeamMemberships({ faker })();

		return {
			...randomBasicTeam({ faker })({
				organizationId: faker.random.uuid(),
				creatorId: faker.random.uuid(),
				permission: faker.random.arrayElement(['FULL_WRITE', 'FULL_READ']),
				creatorDomain: faker.random.word(),
				memberIds: teamMemberships.map((teamMembership) => teamMembership.membershipId.memberId),
				membership: {
					members: teamMemberships,
					errors: [],
				},
				orgId: faker.random.uuid(),

				...customProps,
			}),
			...randomTeamImages({ faker })(),
		};
	};
