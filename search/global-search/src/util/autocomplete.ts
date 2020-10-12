import memoizeOne from 'memoize-one';

export const getAutocompleteText = memoizeOne(
  (query: string, autocompleteSuggestions?: string[]): string | undefined => {
    if (!autocompleteSuggestions || query.length === 0) {
      return undefined;
    }
    if (autocompleteSuggestions.length === 0) {
      return query;
    }
    const lowerCaseQuery = query.toLowerCase();
    const match = autocompleteSuggestions.find(suggestion =>
      suggestion.toLowerCase().startsWith(lowerCaseQuery),
    );
    if (!match) {
      return query;
    }
    return `${query}${match.slice(query.length)}`;
  },
);
