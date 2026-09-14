import { fg } from '@atlaskit/platform-feature-flags/fg';

import { DESCENDANTS_OF_TEAM_FUNCTION_NAME, MEMBERS_OF_FUNCTION_NAME } from './index';

/**
 * Whether the arguments of the given JQL function should take part in team hydration.
 *
 * These functions take a team as their argument (e.g. `membersOf("id: <uuid>")`,
 * `descendantsOfTeam(id:<uuid>)`), so the argument — not the operand — is what gets replaced with a
 * team rich inline node. Each function owns its own gate, so enabling one does not implicitly
 * enable the other.
 *
 * @param functionName Lowercased JQL function name, i.e. `functionOperand.function.value.toLowerCase()`.
 */
export const isHydratableTeamFunction = (functionName: string): boolean => {
	switch (functionName) {
		case MEMBERS_OF_FUNCTION_NAME:
			return fg('jira-membersof-team-support');
		case DESCENDANTS_OF_TEAM_FUNCTION_NAME:
			return fg('jira-descendants-of-team-jql-function');
		default:
			return false;
	}
};
