import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

// The backend ignores `maxResults` unless the same experiment is enabled, and caps it at 50.
export const EXPANDED_AUTOCOMPLETE_MAX_RESULTS = 25;

export const getAutocompleteSuggestionsUrl = (field: string, query?: string): string => {
	const url = `/rest/api/latest/jql/autocompletedata/suggestions?fieldName=${encodeURIComponent(field)}&fieldValue=${encodeURIComponent(query ?? '')}`;

	return expVal('filter_refinement_butter_thanksgiving_drop', 'isEnabled', false)
		? `${url}&maxResults=${EXPANDED_AUTOCOMPLETE_MAX_RESULTS}`
		: url;
};
