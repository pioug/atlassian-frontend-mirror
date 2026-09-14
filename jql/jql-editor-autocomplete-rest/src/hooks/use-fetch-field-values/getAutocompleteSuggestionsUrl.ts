export const getAutocompleteSuggestionsUrl = (field: string, query?: string) =>
	`/rest/api/latest/jql/autocompletedata/suggestions?fieldName=${encodeURIComponent(field)}&fieldValue=${encodeURIComponent(query ?? '')}`;
