import { type Team } from '../types/team';
import type { MockConfig } from './mock-config';

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
