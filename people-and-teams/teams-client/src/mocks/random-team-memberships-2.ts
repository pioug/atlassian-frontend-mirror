import times from 'lodash/times';

import { type TeamMembership } from '../types/membership';

import { randomTeamMembership } from './random-team-membership-2';
import type { MockConfig } from './team';

export const randomTeamMemberships =
	(config: MockConfig) =>
	(n = 10, customProps = {}): TeamMembership[] =>
		times<TeamMembership>(n, () => {
			return {
				...randomTeamMembership(config)(customProps),
			};
		});
