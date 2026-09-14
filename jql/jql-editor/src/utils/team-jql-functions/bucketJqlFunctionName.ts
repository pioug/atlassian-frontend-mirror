import {
	DESCENDANTS_OF_TEAM_FUNCTION_NAME,
	MEMBERS_OF_FUNCTION_NAME,
	OTHER_JQL_FUNCTION_NAME,
} from './index';

const teamJqlFunctionNames: ReadonlySet<string> = new Set([
	MEMBERS_OF_FUNCTION_NAME,
	DESCENDANTS_OF_TEAM_FUNCTION_NAME,
]);

/**
 * Collapses a JQL function name to a bounded value that is safe to emit as an analytics attribute.
 *
 * JQL function names are not a closed set: the grammar accepts any quoted string or number as a
 * function name, and Forge/Connect apps register their own functions, so a raw name can carry
 * tenant- or user-influenced text. Only the team functions this instrumentation exists to measure
 * are emitted verbatim; everything else collapses to {@link OTHER_JQL_FUNCTION_NAME}.
 *
 * Unlike {@link isHydratableTeamFunction} this is gate independent, so a function stays
 * attributable in analytics while its rollout gate is still off.
 */
export const bucketJqlFunctionName = (functionName: string): string => {
	const normalisedName = functionName.trim().toLowerCase();
	return teamJqlFunctionNames.has(normalisedName) ? normalisedName : OTHER_JQL_FUNCTION_NAME;
};
