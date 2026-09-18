import escapeRegExp from 'lodash/escapeRegExp';

import { type SelectableAutocompleteOptions } from '../plugins/autocomplete/components/types';
import { getAutocompleteOptionId } from './getAutocompleteOptionId';
import { type ContextAwareTokenSuggestions } from './types';

export const tokensToAutocompleteOptions = (
	tokens: ContextAwareTokenSuggestions,
): SelectableAutocompleteOptions => {
	let tokensToDisplay = tokens.values;

	if (tokens.matchedText !== '') {
		// Candidates that start with last token text but are not an exact match (case insensitive)
		const regex = new RegExp(`^${escapeRegExp(tokens.matchedText)}[^$]`, 'i');
		tokensToDisplay = tokens.values.filter((token) => regex.test(token));
	}

	return tokensToDisplay.map((token) => ({
		id: getAutocompleteOptionId(token),
		name: token,
		value: token,
		replacePosition: tokens.replacePosition,
		matchedText: tokens.matchedText,
		context: tokens.context ?? null,
		type: 'keyword',
	}));
};
