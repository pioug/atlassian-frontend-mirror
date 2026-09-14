import { type TeamMembership } from '../types/membership';

import type { MockConfig } from './mock-config';
import { randomTeamMembership } from './random-team-membership';

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
