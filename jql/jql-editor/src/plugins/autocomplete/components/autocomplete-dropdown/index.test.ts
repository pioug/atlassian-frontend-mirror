import { type SelectableAutocompleteOption } from '../types';

import { groupAutocompleteOptionsByKey } from './index';

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
