export type JQLAutocompleteResponse = {
  visibleFieldNames: JQLFieldResponse[];
  visibleFunctionNames: JQLFunctionResponse[];
};

export type JQLFieldResponse = {
  displayName: string;
  value: string;
  types: string[];
  operators: string[];
  searchable?: string;
  deprecated?: string;
  deprecatedSearcherKey?: string;
  orderable?: string;
  auto?: string;
  cfid?: string;
};

export type JQLFunctionResponse = {
  displayName: string;
  value: string;
  types: string[];
  /**
   * `true` if the function **only** supports list operators.
   */
  isList?: string;
  /**
   * `true` if the function supports **both** list and single value operators.
   */
  supportsListAndSingleValueOperators?: string;
};

export type JQLFieldValueResponse = {
  displayName: string;
  value: string;
};
export type JQLAutocompleteSuggestionsResponse = {
  results: JQLFieldValueResponse[];
};

export type AutocompleteInitialDataResponse = {
  jqlFields: JQLFieldResponse[];
  jqlFunctions: JQLFunctionResponse[];
};

export type GetAutocompleteInitialData = (
  url: string,
) => Promise<AutocompleteInitialDataResponse>;

export type AutocompleteSuggestionsResponse = {
  results: JQLFieldValueResponse[];
};

export type GetAutocompleteSuggestions = (
  url: string,
) => Promise<AutocompleteSuggestionsResponse>;
