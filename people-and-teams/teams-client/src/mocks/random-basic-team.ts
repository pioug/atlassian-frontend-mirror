import { type Team } from '../types/team';

import type { MockConfig } from './team';

export const randomBasicTeam =
	({ faker }: MockConfig) =>
	(customProps = {}): Team => ({
		id: faker.random.uuid(),
		displayName: faker.company.companyName(),
		description: faker.company.catchPhrase(),
		state: faker.random.arrayElement(['ACTIVE', 'PURGED']),
		membershipSettings: faker.random.arrayElement(['OPEN', 'MEMBER_INVITE']),
		restriction: faker.random.arrayElement(['ORG_MEMBERS', 'NO_RESTRICTION']),
		...customProps,
	});
