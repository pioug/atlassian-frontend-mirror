import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { bucketJqlFunctionName } from './bucketJqlFunctionName';
import { isHydratableTeamFunction } from './isHydratableTeamFunction';

describe('isHydratableTeamFunction', () => {
	it('returns false for functions that do not take a team argument', () => {
		// No gate is consulted for these names, so nothing is mocked here.
		expect(isHydratableTeamFunction('currentuser')).toBe(false);
		expect(isHydratableTeamFunction('under')).toBe(false);
		expect(isHydratableTeamFunction('')).toBe(false);
	});

	// Each case below mocks BOTH gates, because each gate only governs its own function — relying on
	// the ambient state of the other gate would make the assertion unsound.
	it('hydrates descendantsOfTeam only when just its gate is enabled', () => {
		passGate('jira-descendants-of-team-jql-function');
		failGate('jira-membersof-team-support');

		expect(isHydratableTeamFunction('descendantsofteam')).toBe(true);
		expect(isHydratableTeamFunction('membersof')).toBe(false);
	});

	it('hydrates membersOf only when just its gate is enabled', () => {
		failGate('jira-descendants-of-team-jql-function');
		passGate('jira-membersof-team-support');

		expect(isHydratableTeamFunction('membersof')).toBe(true);
		expect(isHydratableTeamFunction('descendantsofteam')).toBe(false);
	});

	it('hydrates neither when both gates are disabled', () => {
		failGate('jira-descendants-of-team-jql-function');
		failGate('jira-membersof-team-support');

		expect(isHydratableTeamFunction('descendantsofteam')).toBe(false);
		expect(isHydratableTeamFunction('membersof')).toBe(false);
	});

	it('hydrates both when both gates are enabled', () => {
		passGate('jira-descendants-of-team-jql-function');
		passGate('jira-membersof-team-support');

		expect(isHydratableTeamFunction('descendantsofteam')).toBe(true);
		expect(isHydratableTeamFunction('membersof')).toBe(true);
	});
});

describe('bucketJqlFunctionName', () => {
	it.each(['membersof', 'descendantsofteam'])('emits %s verbatim', (functionName) => {
		expect(bucketJqlFunctionName(functionName)).toBe(functionName);
	});

	it('normalises casing and surrounding whitespace before matching', () => {
		expect(bucketJqlFunctionName(' DescendantsOfTeam ')).toBe('descendantsofteam');
	});

	it.each([
		['a built-in function outside the team set', 'currentuser'],
		['a Forge/Connect registered function', 'myforgejqlfunction'],
		['a quoted function name', '"a team name typed by the user"'],
		['a numeric function name', '123'],
		['an empty function name', ''],
	])('buckets %s as other', (_, functionName) => {
		expect(bucketJqlFunctionName(functionName)).toBe('other');
	});
});
