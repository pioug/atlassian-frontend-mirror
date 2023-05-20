import React from 'react';

import { JQLEditor, JQLEditorProps } from '@atlassianlabs/jql-editor';
import {
  GetAutocompleteInitialData,
  GetAutocompleteSuggestions,
  useAutocompleteProvider,
} from '@atlassianlabs/jql-editor-autocomplete-rest';
import { render } from '@testing-library/react';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import {
  mockAutoCompleteData,
  mockSuggestionData,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { JiraJQLEditor, JiraJQLEditorProps } from './index';

jest.mock('@atlassianlabs/jql-editor', () => ({
  JQLEditor: jest
    .fn()
    .mockReturnValue(<div data-testid={'mocked-jira-editor'}></div>),
}));

jest.mock('@atlassianlabs/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

describe('jql-editor', () => {
  const setup = (propsOverride: Partial<JiraJQLEditorProps> = {}) => {
    const onSearchMock = jest.fn();

    const component = render(
      <IntlProvider locale="en">
        <JiraJQLEditor
          cloudId="67899"
          onSearch={onSearchMock}
          query="some-query"
          {...propsOverride}
        />
      </IntlProvider>,
    );

    return { ...component, onSearchMock };
  };

  beforeEach(() => {
    fetchMock.reset();
  });

  it('should render JQLEditor', () => {
    const { getByTestId, onSearchMock } = setup();
    expect(getByTestId('mocked-jira-editor')).toBeInTheDocument();
    const { analyticsSource, query, onSearch, autocompleteProvider } = asMock(
      JQLEditor,
    ).mock.calls[0][0] as JQLEditorProps;
    expect(analyticsSource).toBe('link-datasource');
    expect(query).toBe('some-query');
    expect(onSearch).toBe(onSearchMock);
    expect(autocompleteProvider).toBe('useAutocompleteProvider-call-result');
  });

  it('should setup proper AutocompleteProvider', async () => {
    setup();
    expect(useAutocompleteProvider).toHaveBeenCalledWith(
      'link-datasource',
      expect.any(Function),
      expect.any(Function),
    );

    /*
     * Verify second argument to useAutocompleteProvider when called makes a right backend call
     */
    const getAutocompleteInitialData = asMock(useAutocompleteProvider).mock
      .calls[0][1] as GetAutocompleteInitialData;
    fetchMock.post({
      url: '/gateway/api/ex/jira/67899//rest/api/latest/jql/autocompletedata',
      headers: { 'content-type': 'application/json' },
      body: {
        includeCollapsedFields: true,
      },
      response: mockAutoCompleteData,
    });

    /*
     * Verify third argument to useAutocompleteProvider when called makes a right backend call
     */
    const getAutocompleteSuggestions = asMock(useAutocompleteProvider).mock
      .calls[0][2] as GetAutocompleteSuggestions;
    const autocompleteData = await getAutocompleteInitialData(
      '/rest/api/latest/jql/autocompletedata',
    );

    expect(autocompleteData).toEqual({
      jqlFields: mockAutoCompleteData.visibleFieldNames,
      jqlFunctions: mockAutoCompleteData.visibleFunctionNames,
    });

    fetchMock.get({
      url: '/gateway/api/ex/jira/67899//rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      headers: { 'content-type': 'application/json' },
      response: mockSuggestionData,
    });

    const suggestionsData = await getAutocompleteSuggestions(
      '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
    );
    expect(suggestionsData).toEqual(mockSuggestionData);
  });
});
