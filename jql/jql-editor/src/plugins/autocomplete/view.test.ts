import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type SelectableAutocompleteOption } from './components/types';
import { shouldInsertOpeningParenthesis } from './view';

const createOption = (
	overrides: Partial<SelectableAutocompleteOption> = {},
): SelectableAutocompleteOption => ({
	id: 'dc3404f8-af7b-44e3-b582-eb74d0989d80',
	name: 'Team Rocket',
	value: 'team-rocket',
	replacePosition: [0, 0],
	context: {
		operator: 'in',
	},
	matchedText: '',
	type: 'value',
	...overrides,
});

describe('shouldInsertOpeningParenthesis', () => {
	ffTest.on(
		'enable-jql-membersof-autocomplete',
		'membersOf function argument autocomplete is enabled',
		() => {
			it('returns false for function argument suggestions', () => {
				expect(
					shouldInsertOpeningParenthesis(
						createOption({
							type: 'functionArgument',
						}),
					),
				).toBe(false);
			});
		},
	);

	it('inserts an opening parenthesis for list operator values when not already in a list', () => {
		expect(shouldInsertOpeningParenthesis(createOption())).toBe(true);
	});

	it('still inserts an opening parenthesis for non-function-argument value contexts', () => {
		expect(
			shouldInsertOpeningParenthesis(
				createOption({
					context: {
						functionName: 'currentuser',
						operator: 'in',
					},
				}),
			),
		).toBe(true);
	});
});
