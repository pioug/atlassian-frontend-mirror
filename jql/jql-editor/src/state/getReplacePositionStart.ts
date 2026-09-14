import type { JQLRuleKey, JQLSuggestions } from '@atlaskit/jql-autocomplete/jql-autocomplete/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

export const getReplacePositionStart = ({ rules, tokens }: JQLSuggestions): number => {
	// Matching tokens should be prioritized over rules when calculating autocomplete dropdown position
	if (tokens.values.length) {
		return tokens.replacePosition[0];
	}

	// Same precedence as `useAutocompleteOptions`, this may change in future if we don't limit suggestions to one rule
	const rulePrecedence: JQLRuleKey[] = [
		...(fg('enable-jql-membersof-autocomplete') ? (['functionArgument'] as const) : []),
		'value',
		'function',
		'list',
		'operator',
		'field',
	];

	for (const rule of rulePrecedence) {
		if (Object.prototype.hasOwnProperty.call(rules, rule)) {
			return rules[rule]!.replacePosition[0];
		}
	}

	return tokens.replacePosition[0];
};
