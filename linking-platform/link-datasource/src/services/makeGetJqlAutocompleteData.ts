import {
  type GetAutocompleteInitialData,
  type JQLAutocompleteResponse,
} from '@atlaskit/jql-editor-autocomplete-rest';

export type AutocompleteInitialDataResponse = {
  jqlFields: Awaited<ReturnType<GetAutocompleteInitialData>>['jqlFields'];
  jqlFunctions: Awaited<ReturnType<GetAutocompleteInitialData>>['jqlFunctions'];
};

export const makeGetJqlAutocompleteData =
  (cloudId: string) =>
  async (url: string): Promise<AutocompleteInitialDataResponse> => {
    const response = await fetch(`/gateway/api/ex/jira/${cloudId}/${url}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        includeCollapsedFields: true,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as JQLAutocompleteResponse;

      return {
        jqlFields: data.visibleFieldNames,
        jqlFunctions: data.visibleFunctionNames,
      };
    }

    throw new Error((await response.text()) || 'Something went wrong');
  };
