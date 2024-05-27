import { type GetAutocompleteSuggestions } from '@atlaskit/jql-editor-autocomplete-rest';

export type AutocompleteSuggestionsResponse = {
  results: Awaited<ReturnType<GetAutocompleteSuggestions>>['results'];
};

export const makeGetJqlSuggestionsData =
  (cloudId: string) =>
  async (url: string): Promise<AutocompleteSuggestionsResponse> => {
    const response = await fetch(`/gateway/api/ex/jira/${cloudId}/${url}`, {
      headers: { 'content-type': 'application/json' },
    });

    if (response.ok) {
      return response.json();
    }

    throw new Error((await response.text()) || 'Something went wrong');
  };
