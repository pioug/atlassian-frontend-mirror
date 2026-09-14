import { type TeamMembership } from '../types/membership';

import { randomUser } from './random-user';
import type { MockConfig } from './team';

export const randomTeamMembership =
	({ faker }: MockConfig) =>
	(customProps = {}): TeamMembership => {
		const user = randomUser({ faker });

		return {
			state: faker.random.arrayElement(['FULL_MEMBER', 'ALUMNI', 'REQUESTING_TO_JOIN']),
			user,
			membershipId: {
				teamId: faker.random.uuid(),
				memberId: user.id,
			},
			role: faker.random.arrayElement(['ADMIN', 'REGULAR']),
			...customProps,
		};
	};
