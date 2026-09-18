import { type SelectableAutocompleteOption } from '../types';
import { getAutocompleteAnalyticsAttributes } from './getAutocompleteAnalyticsAttributes';
import { getOptionFunctionName } from './getOptionFunctionName';
import { groupAutocompleteOptionsByKey } from './groupAutocompleteOptionsByKey';

const createOption = (
	overrides: Partial<SelectableAutocompleteOption> = {},
): SelectableAutocompleteOption => ({
	id: 'dc3404f8-af7b-44e3-b582-eb74d0989d80',
	name: 'Team Rocket',
	value: 'team-rocket',
	replacePosition: [0, 0],
	context: null,
	matchedText: '',
	type: 'value',
	...overrides,
});

describe('groupAutocompleteOptionsByKey', () => {
	it('returns a single group when no options have a groupKey', () => {
		const options = [createOption(), createOption({ id: 'other', value: 'other' })];

		expect(groupAutocompleteOptionsByKey(options)).toEqual([{ options }]);
	});

	it('groups all options that share the same groupKey', () => {
		const teamA = createOption({ groupKey: 'team', value: 'a' });
		const teamB = createOption({ groupKey: 'team', value: 'b', id: 'b' });
		const other = createOption({ value: 'c', id: 'c' });

		expect(groupAutocompleteOptionsByKey([teamA, teamB, other])).toEqual([
			{ groupKey: 'team', options: [teamA, teamB] },
			{ options: [other] },
		]);
	});

	it('merges non-consecutive options with the same key and uses one ungrouped bucket without key', () => {
		const teamA = createOption({ groupKey: 'team', value: 'a' });
		const ungrouped = createOption({ value: 'ungrouped', id: 'ungrouped' });
		const teamB = createOption({ groupKey: 'team', value: 'b', id: 'b' });

		expect(groupAutocompleteOptionsByKey([teamA, ungrouped, teamB])).toEqual([
			{ groupKey: 'team', options: [teamA, teamB] },
			{ options: [ungrouped] },
		]);
	});

	it('orders sections by first appearance when ungrouped options come first', () => {
		const ungrouped = createOption({ value: 'ungrouped', id: 'ungrouped' });
		const teamA = createOption({ groupKey: 'team', value: 'a' });
		const teamB = createOption({ groupKey: 'team', value: 'b', id: 'b' });

		expect(groupAutocompleteOptionsByKey([ungrouped, teamA, teamB])).toEqual([
			{ options: [ungrouped] },
			{ groupKey: 'team', options: [teamA, teamB] },
		]);
	});

	it('treats a missing groupKey as ungrouped', () => {
		const team = createOption({ groupKey: 'team', value: 'team', id: 'team' });
		const a = createOption({ value: 'a', id: 'a' });
		const b = createOption({ value: 'b', id: 'b' });

		expect(groupAutocompleteOptionsByKey([a, team, b])).toEqual([
			{ options: [a, b] },
			{ groupKey: 'team', options: [team] },
		]);
	});
});

describe('getOptionFunctionName', () => {
	it('returns the lowercased function name for a function option', () => {
		expect(
			getOptionFunctionName(
				createOption({ type: 'function', name: 'descendantsOfTeam()', value: 'descendantsOfTeam' }),
			),
		).toBe('descendantsofteam');
	});

	it('drops the argument list from a function option value', () => {
		expect(
			getOptionFunctionName(createOption({ type: 'function', value: 'membersOf("Team Rocket")' })),
		).toBe('membersof');
	});

	it('returns the enclosing function name for a function argument option', () => {
		expect(
			getOptionFunctionName(
				createOption({
					type: 'functionArgument',
					value: 'id:a5b5230c-5fea-4a8c-83a2-4f16d125a31c',
					context: { functionName: 'descendantsofteam', field: '"Team[Team]"' },
				}),
			),
		).toBe('descendantsofteam');
	});

	it('returns undefined for a function argument option without a parse context', () => {
		expect(getOptionFunctionName(createOption({ type: 'functionArgument' }))).toBeUndefined();
	});

	it.each(['field', 'operator', 'value', 'keyword'] as const)(
		'returns undefined for a %s option',
		(type) => {
			expect(getOptionFunctionName(createOption({ type }))).toBeUndefined();
		},
	);

	it('returns undefined for a function option with no name before the argument list', () => {
		expect(getOptionFunctionName(createOption({ type: 'function', value: '()' }))).toBeUndefined();
	});

	// Function names are user and tenant influenced: the JQL grammar accepts any quoted string as a
	// function name, and Forge/Connect apps register their own functions.
	it.each([
		['a Forge/Connect registered function', 'myForgeJqlFunction()'],
		['a quoted function name carrying user text', '"a team name typed by the user"()'],
	])('buckets %s as other', (_, value) => {
		expect(getOptionFunctionName(createOption({ type: 'function', value }))).toBe('other');
	});

	it('buckets an unknown enclosing function name from the parse context as other', () => {
		expect(
			getOptionFunctionName(
				createOption({
					type: 'functionArgument',
					context: { functionName: '"a team name typed by the user"', field: '"Team[Team]"' },
				}),
			),
		).toBe('other');
	});
});

describe('getAutocompleteAnalyticsAttributes', () => {
	const attributesFor = (option: SelectableAutocompleteOption) =>
		getAutocompleteAnalyticsAttributes({
			areRichInlineNodesEnabled: false,
			keyboard: true,
			numberOfOptions: 3,
			option,
			optionIndex: 1,
		});

	it('includes optionFunctionName when the option belongs to a known function', () => {
		expect(
			attributesFor(
				createOption({ type: 'function', value: 'descendantsOfTeam()', matchedText: 'desc' }),
			),
		).toEqual({
			keyboard: true,
			nodeType: 'text',
			numberOfOptions: 3,
			optionFunctionName: 'descendantsofteam',
			optionIndex: 1,
			optionType: 'function',
			queryLength: 4,
		});
	});

	it('omits optionFunctionName entirely when the option has no enclosing function', () => {
		const attributes = attributesFor(createOption({ type: 'value' }));

		expect(attributes).not.toHaveProperty('optionFunctionName');
		expect(attributes.optionType).toBe('value');
	});
});
