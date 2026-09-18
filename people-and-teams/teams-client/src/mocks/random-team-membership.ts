import { type TeamMembership } from '../types/membership';
import type { MockConfig } from './mock-config';
import { randomUser } from './random-user';

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
