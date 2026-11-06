import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { JQLAutocomplete } from '../../src/jql-autocomplete';

// 🟡 is a single code point but two UTF-16 code units. The editor reports caret positions as
// UTF-16 offsets (string length), so suggestions must line up with those offsets.
const query = 'project = "ABC CORP" AND "Event Type" = "🟡 Template" AND Anlä';
const caret = query.length;
const matchedText = 'Anlä';

const getSuggestions = (position: number) =>
	JQLAutocomplete.fromText(query).getJQLSuggestionsForCaretPosition([position, position]);

describe('JQLAutocomplete with astral characters before the caret', () => {
	beforeEach(() => {
		passGate('filter_jql_jracloud-100041');
	});

	it('suggests fields for the clause after a value containing an emoji', () => {
		const { rules } = getSuggestions(caret);

		expect(rules.operator).toBeUndefined();
		expect(rules.field).toEqual(
			expect.objectContaining({
				matchedText,
				replacePosition: [caret - matchedText.length, caret],
			}),
		);
	});

	it('replaces the whole field token when the caret is inside it', () => {
		const { rules } = getSuggestions(caret - 2);

		expect(rules.field?.replacePosition).toEqual([caret - matchedText.length, caret]);
	});
});
